import Exiftool from '../../metadata/strategy/Exiftool';

/**
 * 
 * @see https://github.com/exiftool/exiftool
 */
class ExiftoolMetadata implements Services.Job.Strategy {
  constructor(
    protected storage: Services.Storage,
    protected whitelist: string[] = [],
  ) {}

  public async process(file: LocalFile): Promise<unknown> {
    const buffer = await this.loadFile(file.path);

    const exiftool = new Exiftool();
  
    const metadata = await exiftool.getMetadata(buffer);

    const filteredMetadata = Object.keys(metadata)
      .filter(key => this.whitelist.includes(key))
      .reduce((obj, key) => {
        obj[key] = metadata[key];
        return obj;
      }, {});

    return {
      metadata: filteredMetadata,
    };
  }

  private async loadFile(path: string): Promise<Buffer> {
    const response: any = await this.storage.retrieve(path);

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      response.on('data', chunk => chunks.push(chunk))
      response.once('end', () => resolve(Buffer.concat(chunks)))
      response.once('error', reject)
    });

    return buffer;
  }
}

export default ExiftoolMetadata;
