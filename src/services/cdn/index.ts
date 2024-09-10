import CloudFront from './CloudFront';
import config from '../../config';

const container = {
  get CloudFront() {
    if (typeof this._cloudFront === 'undefined') {
      this._cloudFront = new CloudFront(
        config.services.cdn.url,
        config.services.cdn.keyPairId,
        config.services.cdn.privateKey.replace(/\\n/g, '\n'),
      );
    }
    
    return this._cloudFront;
  },
};

export default container;
