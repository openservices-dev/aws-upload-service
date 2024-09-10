import general from './general';
import image from './image';
import video from './video';
import Job from './Job';

const container = {
  get Image(): Services.Job.Strategy {
    return image.SharpImage;
  },

  get Video(): Services.Job.Strategy {
    return video.AWSVideo;
  },

  get Job(): Services.Job {
    return new Job([
      { regex: 'image/.+', strategy: this.Image },
      { regex: 'video/.+', strategy: this.Video },
      { regex: '.+/.+', strategy: general.ExiftoolMetadata },
    ]);
  }
};

export default container;
