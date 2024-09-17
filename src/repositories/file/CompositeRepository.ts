import logger from '../../logger';

class CompositeRepository implements FileRepository {
  constructor(
    protected dynamoDBRepository: FileRepository,
    protected cacheRepository: FileRepository,
  ) {}

  public async get(id: ID, user: User = null): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.get`, { id, user });

    let file = await this.cacheRepository.get(id, user);

    if (typeof file === 'undefined') {
      file = await this.dynamoDBRepository.get(id, user);

      await this.cacheRepository.create(file);
    }

    return file;
  }

  public async create(params: FileRepository.CreateParameters): Promise<LocalFile> {
    logger.debug(`${this.constructor.name}.create`, params);

    const file = await this.dynamoDBRepository.create(params);

    await this.cacheRepository.create(file);

    return file;
  }

  public async find(params: FileRepository.FindParameters): Promise<LocalFile[]> {
    logger.debug(`${this.constructor.name}.find`, { params });

    const {
      ids,
    } = params;

    const cachedItems = await this.cacheRepository.find(params);
    const cachedIds = cachedItems.map((item) => item.id);

    const notCachedIds = ids.filter((id) => cachedIds.indexOf(id) === -1);
    let notCachedItems = [];

    if (notCachedIds.length > 0) {
      notCachedItems = await this.dynamoDBRepository.find({ ids: notCachedIds });

      await Promise.all(notCachedItems.map(item => this.cacheRepository.create(item)));
    }

    return ids.map(id => {
      const item = cachedItems.find((item) => item.id === id);

      if (typeof item !== 'undefined') {
        return item;
      }

      return notCachedItems.find((item) => item.id === id);
    });
  }

  public async update(params: FileRepository.UpdateParameters, where: { id: ID }): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.update`, { params, where });

    await this.cacheRepository.delete(where.id, null);

    const file = await this.dynamoDBRepository.update(params, where);

    await this.cacheRepository.create(file);

    return file;
  }

  public async delete(id: ID, user: User = null): Promise<LocalFile | undefined> {
    logger.debug(`${this.constructor.name}.delete`, { id });

    const file = await this.dynamoDBRepository.delete(id, user);

    await this.cacheRepository.delete(id, user);

    return file;
  }
}

export default CompositeRepository;
