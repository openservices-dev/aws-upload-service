import DynamoDBRepository from './DynamoDBRepository';
import CacheRepository from './CacheRepository';
import services from '../../services';

const container = {
  get DynamoDB(): FileRepository {
    if (typeof this._dynamoDB === 'undefined') {
      this._dynamoDB = new DynamoDBRepository(services.Database, 'aws-upload-service');
    }

    return this._dynamoDB;
  },

  get Cache(): FileRepository {
    if (typeof this._cache === 'undefined') {
      this._cache = new CacheRepository(this.DynamoDB, services.Cache);
    }
    return this._cache;
  }
};

export default container;
