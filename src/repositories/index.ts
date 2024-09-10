import file from './file';

const container = {
  get File(): FileRepository {
    return file.Cache;
  },
};

export default container;
