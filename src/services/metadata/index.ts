import Metadata from './Metadata';
import strategies from './strategy';

const container = {
  get Metadata() {
    return new Metadata(strategies);
  },
};

export default container;
