import { DynamoDBClient, GetItemCommand, BatchGetItemCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../logger';

class DynamoDBRepository implements FileRepository {
  constructor(
    protected dynamoDB: DynamoDBClient,
    protected tableName: string,
  ) {}

  public async get(id: ID, user: User = null): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.get`, { id, user });

    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        id: {
          S: id,
        }
      }
    });
  
    const result = await this.dynamoDB.send(command);

    const item = unmarshall(result.Item);

    return item as LocalFile;
  }

  public async create(params: FileRepository.CreateParameters): Promise<LocalFile> {
    logger.debug(`${this.constructor.name}.create`, params);

    const item = {
      id: uuidv4(),
      ...params,
      createdAt: new Date().toISOString(),
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(item),
    });

    const result = await this.dynamoDB.send(command);

    logger.debug('result', result);

    return item as LocalFile;
  }

  public async find(params: FileRepository.FindParameters): Promise<LocalFile[]> {
    logger.debug(`${this.constructor.name}.find`, { params });

    const {
      ids,
    } = params;

    const command = new BatchGetItemCommand({
      RequestItems: {
        [this.tableName]: {
          Keys: ids.map(id => ({
            id: {
              S: id,
            }
          }))
        }
      }
    });

    const result = await this.dynamoDB.send(command);

    logger.debug('result', result);

    return result.Responses[this.tableName].map(item => unmarshall(item)) as LocalFile[];
  }

  public async update(params: FileRepository.UpdateParameters, where: { id: ID }): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.update`, { params, where });

    const updateExpression = [];
    const attributeNames = {};
    const attributeValues = {};

    Object.keys(params).forEach(key => {
      if (['metadata', 'thumbnails', 'conversions'].includes(key) === false) return;

      updateExpression.push(`#${key} = :${key}`);
      attributeNames[`#${key}`] = key;
      if (typeof params[key] === 'string') attributeValues[`:${key}`] = { S: params[key] };
      if (typeof params[key] === 'object' && Array.isArray(params[key]) === false) attributeValues[`:${key}`] = { M: marshall(params[key]) };
      if (typeof params[key] === 'object' && Array.isArray(params[key])) attributeValues[`:${key}`] = { L: marshall(params[key]) };
    });

    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: {
        id: {
          S: where.id,
        }
      },
      UpdateExpression: `SET ${updateExpression.join(',')}`,
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await this.dynamoDB.send(command);

    const item = unmarshall(response.Attributes);

    return item as LocalFile;
  }

  public async delete(id: ID, user: User = null): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.delete`, { id });

    throw new Error('Method not implemented!');
  }
}

export default DynamoDBRepository;
