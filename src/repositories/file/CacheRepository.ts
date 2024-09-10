import type { LRUCache } from 'lru-cache';
import logger from '../../logger';

class CacheRepository implements FileRepository {
  constructor(
    protected dynamoDBRepository: FileRepository,
    protected cache: LRUCache<string, unknown>,
  ) {}

  public async get(id: ID, user: User = null): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.get`, { id, user });

    if (!this.cache.has(id)) {
      const file = await this.dynamoDBRepository.get(id, user);

      this.cache.set(id, file);
    }

    return this.cache.get(id) as LocalFile;
  }

  public async create(params: FileRepository.CreateParameters): Promise<LocalFile> {
    logger.debug(`${this.constructor.name}.create`, params);

    const item = await this.dynamoDBRepository.create(params);
    
    this.cache.set(item.id, item);

    return item;
  }

  public async find(params: FileRepository.FindParameters): Promise<LocalFile[]> {
    logger.debug(`${this.constructor.name}.find`, { params });

    const {
      ids,
    } = params;

    const notCachedItems = ids.filter((id) => !this.cache.has(id));

    if (notCachedItems.length > 0) {
      const items = await this.dynamoDBRepository.find({ ids: notCachedItems });

      items.forEach((item) => {
        this.cache.set(item.id, item);
      });
    }

    return ids.map((id) => this.cache.get(id) as LocalFile);
  }

  public async update(params: FileRepository.UpdateParameters, where: { id: ID }): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.update`, { params, where });

    this.cache.delete(where.id);

    const item = await this.dynamoDBRepository.update(params, where);

    this.cache.set(item.id, item);

    return item;
  }

  public async delete(id: ID, user: User = null): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.delete`, { id });

    throw new Error('Method not implemented!');
  }
}

export default CacheRepository;
