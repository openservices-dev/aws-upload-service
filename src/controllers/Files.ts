import APIError from '../errors/APIError';

interface GetFileResponse extends LocalFile {
  location: string;
  playable?: {
    location: string;
  };
}

class FilesController {
  constructor(
    protected fileRepository: FileRepository,
    protected storage: Services.Storage,
    protected cdn: Services.CDN,
  ) {}

  public async getFile(id: ID, user: User = null): Promise<GetFileResponse> {  
    const file = await this.fileRepository.get(id, user);

    if (typeof file === 'undefined') {
      throw new APIError({ message: 'File not found!', code: 404 });
    }
    
    const location = this.cdn.getSignedUrl(file.path);

    return {
      ...file,
      location,
    };
  }

  public async listFiles(params: any, user: User = null): Promise<GetFileResponse[]> {
    const files = await this.fileRepository.find({ ...params, user });

    const filesWithLocation = await Promise.all(files.map(async (file) => {
      const location = this.cdn.getSignedUrl(file.path);

      return {
        ...file,
        location,
      };
    }));

    return filesWithLocation;
  }

  public async deleteFile(id: ID, user: User = null): Promise<LocalFile> {  
    const file = await this.fileRepository.get(id, user);

    if (typeof file === 'undefined') {
      throw new APIError({ message: 'File not found!', code: 404 });
    }

    await this.storage.delete(file.path);
    await this.fileRepository.delete(id, user);

    return file;
  }
}

export default FilesController;
