import APIError from '../errors/APIError';

class Files implements FilesController {
  constructor(
    protected fileRepository: FileRepository,
    protected storage: Services.Storage,
    protected cdn: Services.CDN,
  ) {}

  public async get(id: ID, user: User = null): Promise<FilesController.GetFileResponse> {  
    const file = await this.fileRepository.get(id, user);

    if (typeof file === 'undefined') {
      throw new APIError({ message: 'File not found!', code: 404 });
    }
    
    const location = this.cdn.getSignedUrl(file.path);
    const thumbnails = file.thumbnails.map(path => this.cdn.getUrl(path));
    const conversions = 'conversions' in file ? file.conversions.map(c => this.cdn.getUrl(c)) : undefined;

    return {
      ...file,
      location,
      thumbnails,
      conversions,
    };
  }

  public async list(params: { ids: ID[] }, user: User = null): Promise<FilesController.GetFileResponse[]> {
    const files = await this.fileRepository.find({ ...params, user });

    const filesWithLocation = await Promise.all(files.map(async (file) => {
      const location = this.cdn.getSignedUrl(file.path);
      const thumbnails = file.thumbnails.map(path => this.cdn.getUrl(path));
      const conversions = 'conversions' in file ? file.conversions.map(c => this.cdn.getUrl(c)) : undefined;

      return {
        ...file,
        location,
        thumbnails,
        conversions,
      };
    }));

    return filesWithLocation;
  }

  public async delete(id: ID, user: User = null): Promise<LocalFile> {  
    const file = await this.fileRepository.get(id, user);

    if (typeof file === 'undefined') {
      throw new APIError({ message: 'File not found!', code: 404 });
    }

    await this.storage.delete(file.path);
    await this.fileRepository.delete(id, user);

    return file;
  }
}

export default Files;
