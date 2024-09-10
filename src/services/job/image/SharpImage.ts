import sharp from 'sharp';
import { getDimensions } from '../../../utils/functions';

/**
 * 
 * @see https://www.npmjs.com/package/sharp
 * @see https://github.com/lovell/sharp
 * @see https://sharp.pixelplumbing.com/
 */
class SharpImage implements Services.Job.Strategy {
  constructor(
    protected storage: Services.Storage,
    protected thumbnails: [{ width: number, height: number }],
  ) {}

  public async process(file: LocalFile): Promise<unknown> {
    const imageBuffer = await this.loadImage(file.path);
  
    const thumbnails = await Promise.all(this.thumbnails.map(async (thumbnail) => {
      const { width, height } = getDimensions(file.metadata['height'], file.metadata['width'], thumbnail.height, thumbnail.width);
      const image = await this.resizeImage(imageBuffer, file.mimetype, width, height);
      const path = `/generated/${thumbnail.width}x${thumbnail.height}/${file.path}`;

      await this.storage.store(image, path, { type: 'thumbnail', source: 'worker', userId: file.userId });

      return path;
    }));

    return {
      thumbnails,
    };
  }

  private async loadImage(path: string): Promise<Buffer> {
    const response: any = await this.storage.retrieve(path);

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      response.on('data', chunk => chunks.push(chunk))
      response.once('end', () => resolve(Buffer.concat(chunks)))
      response.once('error', reject)
    });

    return buffer;
  }

  private async resizeImage(buffer: Buffer, mimetype: string, width: number, height: number): Promise<Buffer> {
    switch (mimetype) {
      case 'image/jpg':
      case 'image/jpeg':
        return sharp(buffer).resize(width, height).jpeg({ quality: 100 }).toBuffer();
      case 'image/png':
        return sharp(buffer).resize(width, height).png({ quality: 100 }).toBuffer();
      default:
        return sharp(buffer).resize(width, height).toBuffer();
    }
  }
}

export default SharpImage;
