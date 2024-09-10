class None implements Services.Job.Strategy {
  public async process(): Promise<void> {
    return;
  }
}

export default None;
