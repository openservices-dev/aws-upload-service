import AWSVideo from './AWSVideo';
import config from '../../../config';
import services from '../../../services';

const container = {
  get AWSVideo() {
    return new AWSVideo(
      config.services.job.video.conversions,
      config.services.job.video.thumbnails,
      config.services.job.video.queue,
      config.services.job.video.role,
      config.services.job.video.bucket,
      services.AWS.mc,
    );
  },
};

export default container;
