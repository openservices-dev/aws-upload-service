import { Consumer } from 'sqs-consumer';
import services from '../services';
import config from '../config';
import logger from '../logger';
import video from '../services/job/video';
import repositories from '../repositories';

const consumer = Consumer.create({
  queueUrl: config.services.queue.url,
  attributeNames: ['AWSTraceHeader', 'X-Request-ID'] as any,
  handleMessage: async (message) => {
    const traceHeader = message.Attributes.AWSTraceHeader;
    const traceData = services.Trace.processTraceData(traceHeader);
    const segment: any = services.Trace.createSegment(config.serviceName, traceData.root, traceData.parent);
    services.Trace.setSegment(segment);

    logger.debug('Received message from queue!', { ...message });

    const body = JSON.parse(message.Body);

    if ('fileId' in body) {
      try {
        const file = await repositories.File.get(body.fileId, null);
        const values = await services.Job.process(body.mimetype, file) as Record<string, string | number | boolean>;
        await repositories.File.update({ ...values, cacheable: !body.mimetype.startsWith('video') }, { id: file.id });
      } catch (err) {
        logger.error('Could not process file!', { error: err.message, stack: err.stack });
      }
    }

    if ('detail' in body && 'jobId' in body.detail) {
      if (body.detail.status === 'COMPLETE') {
        const updatedFile = await video.AWSVideo.complete(body) as Record<string, string | number | boolean>;
        await repositories.File.update({ ...updatedFile, cacheable: true }, { id: updatedFile['id'] as string });
      }

      if (body.detail.status === 'ERROR') {
        logger.error('Media convert job ended with error!', body);
      }
    }

    segment && segment.close();
  },
  sqs: services.AWS.sqsConsumer,
});

consumer.on('message_processed', (message) => {
  logger.debug('Message successfully processed and removed from the queue!', { message });
});

consumer.on('error', (err) => {
  logger.error('Unknown error occured!', { message: err.message, stack: err.stack });
});

consumer.on('processing_error', (err) => {
  logger.error('Error while processing message from queue!', { message: err.message, stack: err.stack });
});

consumer.on('timeout_error', (err) => {
  logger.error('Timeout error!', { message: err.message, stack: err.stack });
});

export default consumer;