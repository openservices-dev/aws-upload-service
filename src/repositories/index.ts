import file from './file';

const container = {
  get File(): FileRepository {
    return file.Composite;
  },
};

export default container;
