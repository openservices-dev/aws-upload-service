import Image from './Image';
import Video from './Video';
import Exiftool from './Exiftool';

export default {
  'image': new Image(),
  'video': new Video(),
  'exiftool': new Exiftool(),
};
