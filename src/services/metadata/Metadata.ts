class Metadata implements Services.Metadata {
  constructor(
    protected strategies: Record<string, Services.Metadata.Strategy> = {},
  ) {}

  public addStrategy(mimetype: string, strategy: Services.Metadata.Strategy): void {
    this.strategies[mimetype] = strategy;
  }

  public async getMetadata(mimetype: string, file: unknown): Promise<unknown> {
    const strategy = this.strategies[Object.keys(this.strategies).find(key => mimetype.startsWith(key))];

    return strategy.getMetadata(file);
  }
}

export default Metadata;
