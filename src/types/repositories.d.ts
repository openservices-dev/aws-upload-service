declare namespace FileRepository {
  interface CreateParameters {
    userId?: ID;
    path: string;
    mimetype: string;
    size: number;
    metadata?: unknown;
  }

  interface UpdateParameters {
    metadata?: unknown;
    thumbnails?: string[];
    conversions?: string[];
  }

  interface FindParameters {
    ids?: ID[];
    user?: User;
    first?: number;
    after?: number;
  }
}

interface FileRepository {
  create(params: FileRepository.CreateParameters): Promise<LocalFile>;

  get(id: ID, user: User): Promise<LocalFile | undefined>;

  find(params: FileRepository.FindParameters): Promise<LocalFile[]>;

  update(params: FileRepository.UpdateParameters, where: { id: ID }): Promise<LocalFile | undefined>;

  delete(id: ID, user: User): Promise<LocalFile | undefined>;
}

declare namespace ThumbnailRepository {
  interface CreateParameters {
    fileId: ID;
    path: string;
    mimetype: string;
    size: number;
    metadata?: unknown;
  }
}

interface ThumbnailRepository {
  create(params: ThumbnailRepository.CreateParameters): Promise<Thumbnail>;

  get(id: ID): Promise<Thumbnail | undefined>;

  getAll(fileId: ID): Promise<Thumbnail[] | undefined>;

  delete(params: { id?: ID, fileId?: ID }): Promise<void>;
}

declare namespace MediaConvertJobRepository {
  interface CreateParameters {
    id: string;
    fileId: ID;
  }
}

interface MediaConvertJobRepository {
  create(params: MediaConvertJobRepository.CreateParameters): Promise<{ id: string, fileId: ID }>;

  get(id: string): Promise<{ id: string, fileId: ID } | undefined>;
}
