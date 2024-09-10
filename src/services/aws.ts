import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import { MediaConvertClient } from '@aws-sdk/client-mediaconvert';
import config from '../config';

export default () => {
  return {
    get s3(): S3Client {
      return new S3Client({
        region: config.services.storage.region,
        credentials: {
          accessKeyId: config.services.storage.accessKeyId,
          secretAccessKey: config.services.storage.secretAccessKey,
        },
      });
    },

    get sqs(): SQSClient {
      return new SQSClient({
        apiVersion: '2012-11-05',
        region: config.services.queue.region,
        credentials: {
          accessKeyId: config.services.queue.accessKeyId,
          secretAccessKey: config.services.queue.secretAccessKey,
        }
      });
    },

    get mc(): MediaConvertClient {
      return new MediaConvertClient({
        apiVersion: '2017-08-29',
        region: config.services.job.video.region,
        endpoint: config.services.job.video.endpoint,
        credentials: {
          accessKeyId: config.services.job.video.accessKeyId,
          secretAccessKey: config.services.job.video.secretAccessKey,
        }
      });
    },
  }
}

