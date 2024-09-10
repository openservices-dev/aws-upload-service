import ExiftoolMetadata from './ExiftoolMetadata';
import services from '../../../services';
import config from '../../../config';

const container = {
  get ExiftoolMetadata() {
    return new ExiftoolMetadata(
      services.Storage,
      config.services.job.general.exiftool.whitelist ? config.services.job.general.exiftool.whitelist.split(',') : []
    );
  },
};

export default container;
