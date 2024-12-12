import Exiftool from '../../metadata/strategy/Exiftool';
import logger from '../../../logger';

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
    logger.debug(`${this.constructor.name}.process`, { file });

    const readable = await this.storage.retrieve(file.path);

    const exiftool = new Exiftool();
  
    const metadata = await exiftool.getMetadata(readable);

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
}

export default ExiftoolMetadata;
