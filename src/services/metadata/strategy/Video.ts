import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';

class VideoStrategy implements Services.Metadata.Strategy {
  public async getMetadata(file: unknown): Promise<unknown> {
    const video = Buffer.isBuffer(file) ? Readable.from(file) : file;

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video, function(err: Error, metadata: any) {
        if (err !== null) {
          return reject(err);
        }
  
        const stream = metadata.streams.find(stream => {
          return 'height' in stream && 'width' in stream;
        });

        if (typeof stream === 'undefined') {
          return reject('Cannot get metadata from video!');
        }
  
        resolve({
          height: stream.height,
          width: stream.width,
          bitrate: stream.bit_rate,
          duration: stream.duration,
        });
      });
    });
  }
}

export default VideoStrategy;
