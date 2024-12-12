import DynamoDBRepository from './DynamoDBRepository';
import CacheRepository from './CacheRepository';
import CompositeRepository from './CompositeRepository';
import config from '../../config';
import services from '../../services';

const container = {
  get DynamoDB(): FileRepository {
    if (typeof this._dynamoDB === 'undefined') {
      this._dynamoDB = new DynamoDBRepository(services.Database, config.services.database.tableName, config.env === 'DEVELOPMENT');
    }

    return this._dynamoDB;
  },

  get Cache(): FileRepository {
    if (typeof this._cache === 'undefined') {
      this._cache = new CacheRepository(services.Cache);
    }
    return this._cache;
  },

  get Composite(): FileRepository {
    if (typeof this._composite === 'undefined') {
      this._composite = new CompositeRepository(this.DynamoDB, this.Cache);
    }

    return this._composite;
  }
};

export default container;
