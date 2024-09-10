import SharpImage from './SharpImage';
import config from '../../../config';
import services from '../../../services';

const container = {
  get SharpImage() {
    if (typeof this._sparp === 'undefined') {
      this._sparp = new SharpImage(
        services.Storage,
        config.services.job.image.thumbnails,
      );
    }

    return this._sparp;
  },
};

export default container;
