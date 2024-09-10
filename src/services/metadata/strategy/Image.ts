import sizeOf from 'image-size';

class ImageStrategy implements Services.Metadata.Strategy {
  public async getMetadata(file: unknown): Promise<unknown> {
    if (!Buffer.isBuffer(file)) {
      throw new Error('ImageStrategy requires file to be instance of Buffer!');
    }

    const dimensions = sizeOf(file);

    return dimensions;
  }
}

export default ImageStrategy;
