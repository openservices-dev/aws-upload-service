import deepmerge from 'deepmerge';

class Job implements Services.Job {
  constructor(
    protected jobs: { regex: string, strategy: Services.Job.Strategy }[] = [],
  ) {}

  public addStrategy(regex: string, strategy: Services.Job.Strategy): void {
    this.jobs.push({ regex, strategy });
  }

  public async process(mimetype: string, file: LocalFile): Promise<unknown> {
    const strategies = this.jobs.filter(job => new RegExp(job.regex).test(mimetype));

    const responses = await Promise.all(strategies.map(job => job.strategy.process(file)));

    const updatedFile = deepmerge.all([ file, ...responses.filter(response => typeof response !== 'undefined') ]);

    return updatedFile;
  }
}

export default Job;
