import S3Storage from './S3Storage';
import services from '../';
import config from '../../config';

const container = {
  get S3() {
    if (typeof this._s3 === 'undefined') {
      this._s3 = new S3Storage(
        services.AWS.s3,
        config.services.storage.bucket,
        config.services.storage.region,
        config.services.storage.acl,
        config.services.storage.serverSideEncryption,
      );
    }
    
    return this._s3;
  },
};

export default container;
