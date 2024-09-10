declare namespace Jobs {
  interface Video {
    convert(file: LocalFile, height: number, width: number, thumbnailHeight: number, thumbnailWidth: number): Promise<void>;

    complete(payload: unknown): Promise<void>;
  }

  interface Image {
    resize(file: LocalFile, width: number, height: number): Promise<unknown>;
  }
}
