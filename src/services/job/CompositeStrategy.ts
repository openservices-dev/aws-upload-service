class CompositeStrategy implements Services.Job.Strategy {
  constructor(
    protected strategies: Services.Job.Strategy[] = [],
  ) {}

  public addStrategy(strategy: Services.Job.Strategy): void {
    this.strategies.push(strategy);
  }

  public async process(file: LocalFile): Promise<void> {
    for (const strategy of this.strategies) {
      await strategy.process(file);
    }
  }
}

export default CompositeStrategy;
