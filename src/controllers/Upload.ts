import crypto from 'crypto';
import path from 'path';
import namespace from '../services/cls';
import logger from '../logger';

class UploadController {
  constructor(
    protected fileRepository: FileRepository,
    protected storage: Services.Storage,
    protected queue: Services.Queue,
    protected metadata: Services.Metadata,
  ) {}

  public async process(uploadedFile: Express.Multer.File, user: User | undefined): Promise<LocalFile> {
    const directory = crypto.createHash('md5').update((new Date).toISOString().split('T')[0]).digest("hex").substring(0, 16);
  
    const path = await this.processFile(directory, uploadedFile, user);
    const metadata = await this.getMetadata(uploadedFile);
  
    const file = await this.fileRepository.create({
      userId: typeof user === 'undefined' ? null : user.id,
      path: path,
      mimetype: uploadedFile.mimetype,
      size: uploadedFile.size,
      metadata,
    });
  
    await this.informWorker(file);

    return file;
  }

  protected async getMetadata(file: Express.Multer.File): Promise<unknown> {
    try {
      const metadata = await this.metadata.getMetadata(file.mimetype, file.buffer);

      return metadata;
    } catch (err) {
      logger.error('Cannot get metadata from file!', { message: err.message });

      return {};
    }
  }

  protected async processFile(directory: string, file: Express.Multer.File, user: User | undefined): Promise<string> {
    const hash = crypto.createHash('sha1').update(`${file.originalname}${Date.now()}`).digest('hex');
    const extname = path.extname(file.originalname);
  
    await this.storage.store(file.buffer, `${directory}/${hash}${extname}`, {
      type: 'original',
      userId: typeof user !== 'undefined' ? user.id : null,
    });
  
    return `${directory}/${hash}${extname}`;
  }

  protected async informWorker(file: LocalFile): Promise<void> {
    const messageData = {
      fileId: file.id,
      mimetype: file.mimetype,
      metadata: file.metadata,
      traceId: namespace.get('traceId'),
    }
    
    try {
      await this.queue.sendMessage(messageData);
    } catch (error) {
      logger.error('Could not send message to the queue!', error);
    }
  }
}

export default UploadController;
