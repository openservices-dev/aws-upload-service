import {
  MediaConvertClient,
  CreateJobCommand,
  AccelerationMode,
  OutputGroupType,
  TimecodeSource,
  AudioDefaultSelection,
  InputTimecodeSource,
  StatusUpdateInterval,
} from '@aws-sdk/client-mediaconvert';
import logger from '../../../logger';
import { getDimensions } from '../../../utils/functions';

/**
 * 
 * @see https://aws.amazon.com/mediaconvert/
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/emc-examples.html
 */
class AWSVideo implements Services.Job.Strategy {
  constructor(
    protected conversions: [{ width: number, height: number }],
    protected thumbnails: [{ width: number, height: number }],
    protected queue: string,
    protected role: string,
    protected bucket: string,
    protected mediaConvert: MediaConvertClient,
  ) {}

  public async process(file: LocalFile): Promise<void> {
    logger.debug(`${this.constructor.name}.process`, { file });

    const conversionOutputGroups = this.getVideoOutputGroups(file);
    const thumbnailOutputGroups = this.getThumbnailOutputGroups(file);

    const params = {
      Queue: this.queue,
      Role: this.role,
      Settings: {
        TimecodeConfig: {
          Source: TimecodeSource.ZEROBASED
        },
        OutputGroups: [
          ...conversionOutputGroups,
          ...thumbnailOutputGroups,
        ],
        Inputs: [
          {
            AudioSelectors: {
              "Audio Selector 1": {
                DefaultSelection: AudioDefaultSelection.DEFAULT
              }
            },
            VideoSelector: {},
            TimecodeSource: InputTimecodeSource.ZEROBASED,
            FileInput: `s3://${this.bucket}/${file.path}`
          }
        ]
      },
      AccelerationSettings: {
        Mode: AccelerationMode.DISABLED,
      },
      StatusUpdateInterval: StatusUpdateInterval.SECONDS_60,
      Priority: 0,
      // Tags: {
      //   source: 'worker',
      // },
      UserMetadata: {
        fileId: file.id,
      },
    };

    await this.mediaConvert.send(new CreateJobCommand(params));
  }

  protected getVideoOutputGroups(file: LocalFile): Array<unknown> {
    return this.conversions.map((conversion) => {
      const { width, height } = getDimensions(file.metadata['height'], file.metadata['width'], conversion.height, conversion.width);
      const evenWidth = (2 * Math.round(width / 2));
      const evenHeight = (2 * Math.round(height / 2));

      return {
          Name: 'MP4',
          Outputs: [{
            ContainerSettings: {
              Container: 'MP4',
              Mp4Settings: {}
            },
            VideoDescription: {
              CodecSettings: {
                Codec: 'H_264',
                H264Settings: {
                  MaxBitrate: 5000000,
                  RateControlMode: 'QVBR',
                  SceneChangeDetect: 'TRANSITION_DETECTION',
                },
              },
              Width: evenWidth,
              Height: evenHeight,
            },
            AudioDescriptions: [
              {
                CodecSettings: {
                  Codec: 'AAC',
                  AacSettings: {
                    Bitrate: 96000,
                    CodingMode: 'CODING_MODE_2_0',
                    SampleRate: 48000,
                  },
                },
              },
            ],
          }],
          OutputGroupSettings: {
            Type: OutputGroupType.FILE_GROUP_SETTINGS,
            FileGroupSettings: {
              Destination: `s3://${this.bucket}/generated/${conversion.width}x${conversion.height}/${file.path.split('.')[0]}`
            }
          }
      };
    });
  }

  protected getThumbnailOutputGroups(file: LocalFile): Array<unknown> {
    return this.thumbnails.map((thumbnail) => {
      const { width, height } = getDimensions(file.metadata['height'], file.metadata['width'], thumbnail.height, thumbnail.width);
      const evenWidth = (2 * Math.round(width / 2));
      const evenHeight = (2 * Math.round(height / 2));

      return {
        Name: `Thumbnails ${thumbnail.width}x${thumbnail.height}`,
        Outputs: [{
          VideoDescription: {
            CodecSettings: {
              Codec: 'FRAME_CAPTURE',
              FrameCaptureSettings: {
                FramerateNumerator: 30,
                FramerateDenominator: 300,
                MaxCaptures: 10,
                Quality: 100
              }
            },
            Width: evenWidth,
            Height: evenHeight,
          },
          ContainerSettings: {
            Container: 'RAW'
          },
          NameModifier: `_thumbnail`
        }],
        OutputGroupSettings: {
          Type: OutputGroupType.FILE_GROUP_SETTINGS,
          FileGroupSettings: {
            Destination: `s3://${this.bucket}/generated/${thumbnail.width}x${thumbnail.height}/${file.path.split('.')[0]}`
          }
        }
      }
    });
  }

  public async complete(payload: any): Promise<unknown> {
    logger.debug(`${this.constructor.name}.complete`, { payload });

    const id = payload.detail.userMetadata.fileId;

    const conversions = payload.detail.outputGroupDetails
      .filter(outputGroupDetail => outputGroupDetail.outputDetails[0].outputFilePaths[0].endsWith('.mp4'))
      .map(outputGroupDetail => outputGroupDetail.outputDetails[0].outputFilePaths)
      .flat();

    const thumbnails = payload.detail.outputGroupDetails
      .filter(outputGroupDetail => outputGroupDetail.outputDetails[0].outputFilePaths[0].endsWith('.jpg'))
      .map(outputGroupDetail => outputGroupDetail.outputDetails[0].outputFilePaths)
      .flat();

    return {
      id,
      conversions,
      thumbnails,
    };
  }
}

export default AWSVideo;
