import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// import AWSXRay from '../../logger/XRay';
import config from '../../config';
import services from '../'

const container = {
  get DynamoDB(): DynamoDBClient {
    if (typeof this._dynamoDB === 'undefined') {
      const dynamoDB = new DynamoDBClient({
        credentials: {
          accessKeyId: config.services.database.accessKeyId,
          secretAccessKey: config.services.database.secretAccessKey,
        },
        endpoint: config.services.database.endpoint,
        region: config.services.database.region,
      });

      this._dynamoDB = services.Trace.captureAWSv3Client(dynamoDB);
    }

    return this._dynamoDB;
  },
};

export default container;
