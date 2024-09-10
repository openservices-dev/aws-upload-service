import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import logger from '../../logger';

class S3Storage implements Services.Storage {
  constructor(
    protected s3: S3Client,
    protected bucket: string,
    protected region: string,
    protected acl?: string,
    protected serverSideEncryption?: string,
  ) {}

  public async store(body: Buffer, path: string, tags?: Record<string, string>): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Body: body,
      Key: path,
      Tagging: typeof tags === 'undefined' ? undefined : (new URLSearchParams(tags)).toString(),
    };

    if (typeof this.acl !== 'undefined') {
      params['ACL'] = this.acl;
    }

    if (typeof this.serverSideEncryption !== 'undefined') {
      params['ServerSideEncryption'] = this.serverSideEncryption;
    }

    try {
      const parallelUploads3 = new Upload({
        client: this.s3,
        params,
        tags: [],
        leavePartsOnError: false,
      });
    
      parallelUploads3.on('httpUploadProgress', (progress) => {
        logger.debug('Upload processing...', { progress });
      });
    
      await parallelUploads3.done();
    } catch (err) {
      logger.error('Unable to store file!', { error: { message: err.message, stack: err.stack } });
      throw err;
    }
  }

  public async retrieve(path: string): Promise<unknown> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: path,
    });

    const { Body } = await this.s3.send(command);

    return Body;
  }

  public async delete(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: path,
    });

    await this.s3.send(command);
  }
}

export default S3Storage;
