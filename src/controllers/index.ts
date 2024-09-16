import UploadController from './Upload';
import Files from './Files';
import repositories from '../repositories';
import services from '../services';

const container = {
  get Upload() {
    return new UploadController(repositories.File, services.Storage, services.Queue, services.Metadata);
  },

  get Files(): FilesController {
    return new Files(repositories.File, services.Storage, services.CDN);
  },
};

export default container;
