import AWSQueue from './AWSQueue';
import services from '../';
import config from '../../config';

const container = {
  get AWSQueue() {
    if (typeof this._awsQueue === 'undefined') {
      this._awsQueue = new AWSQueue(
        services.AWS.sqs,
        config.services.queue.url
      );
    }

    return this._awsQueue;
  },
};

export default container;
