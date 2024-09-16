import type { LRUCache } from 'lru-cache';
import logger from '../../logger';

class CacheRepository implements FileRepository {
  constructor(
    protected cache: LRUCache<string, unknown>,
  ) {}

  public async get(id: ID, user: User = null): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.get`, { id, user });

    if (this.cache.has(id) === false) {
      return undefined;
    }

    return this.cache.get(id) as LocalFile;
  }

  public async create(params: FileRepository.CreateParameters): Promise<LocalFile> {
    logger.debug(`${this.constructor.name}.create`, params);
    
    if ('cacheable' in params && params.cacheable) {
      this.cache.set(params.id, params);
    }

    return params as LocalFile;
  }

  public async find(params: FileRepository.FindParameters): Promise<LocalFile[]> {
    logger.debug(`${this.constructor.name}.find`, { params });

    const {
      ids,
    } = params;

    const cachedItems = ids.map((id) => this.cache.get(id) as LocalFile).filter((item) => typeof item !== 'undefined');

    return cachedItems;
  }

  public async update(params: FileRepository.UpdateParameters, where: { id: ID }): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.update`, { params, where });

    const file = this.cache.get(where.id) as LocalFile;

    const updatedFile = {
      ...file,
      ...params,
    };

    this.cache.set(where.id, updatedFile);

    return updatedFile;
  }

  public async delete(id: ID, user: User = null): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.delete`, { id });

    const file = this.cache.get(id) as LocalFile;

    this.cache.delete(id);

    return file;
  }
}

export default CacheRepository;
