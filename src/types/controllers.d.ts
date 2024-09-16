declare namespace FilesController {
  interface GetFileResponse extends LocalFile {
    location: string;
    playable?: {
      location: string;
    };
  }
}

interface FilesController {
  get(id: ID, user: User): Promise<FilesController.GetFileResponse>;

  list(params: { ids: ID[] }, user: User): Promise<FilesController.GetFileResponse[]>;

  delete(id: ID, user: User): Promise<LocalFile>
}
