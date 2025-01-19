export default {
  /**
   * @type {number}
   * @default 3010
   */
  port: process.env.PORT || 3010,
  /**
   * Values:
   * DEVELOPMENT
   * PRODUCTION
   * @type {string="DEVELOPMENT", "PRODUCTION"}
   * @default DEVELOPMENT
   */
  env: process.env.ENV || 'DEVELOPMENT',
  /**
   * @type {string}
   * @default upload-service
   */
  serviceName: process.env.SERVICE_NAME || 'upload-service',
  /**
   * Prefix for all routes.
   * @type {string}
   */
  routePrefix: process.env.ROUTE_PREFIX || '/upload',
  /**
   * Examples:
   * 1. any images => image/.+
   * 2. any images or videos => (image|video)/.+
   * 3. specific image => image/(jpeg|png)
   * @type {string}
   */
  fileFilterRegex: process.env.FILE_FILTER_REGEX || '(image|video)/.+',
  cors: {
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [ 'http://localhost:3000' ],
  },
  logger: {
    /**
     * Supported values:
     * debug
     * info
     * warn
     * error
     * @type {string="debug", "info", "warn", "error"}
     */
    level: process.env.LOGGER_LEVEL,
  },
  services: {
    /**
     * Access token is used to authorize user to do some actions
     * or to pair newly uploaded files to a user.
     */
    token: {
      /**
       * @type {string="JWT", "AWS_COGNITO"}
       */
      type: process.env.SERVICES_TOKEN_TYPE,
      /**
       * @type {string}
       */
      secret: process.env.SERVICES_TOKEN_SECRET,
      /**
       * AWS Cognito
       */
      aws: {
        /**
         * @type {string}
         */
        region: process.env.SERVICES_TOKEN_AWS_REGION,
        /**
         * @type {string}
         */
        userPoolId: process.env.SERVICES_TOKEN_AWS_USER_POOL_ID,
        /**
         * @type {string}
         */
        clientId: process.env.SERVICES_TOKEN_AWS_CLIENT_ID,
      },
    },
    /**
     * Database is used to store information about files.
     * Supported databases:
     * 1. DynamoDB
     */
    database: {
      /**
       * @type {string}
       */
      tableName: process.env.SERVICES_DATABASE_TABLE_NAME,
      accessKeyId: process.env.SERVICES_DATABASE_ACCESS_KEY_ID,
      secretAccessKey: process.env.SERVICES_DATABASE_SECRET_ACCESS_KEY,
      /**
       * @type {string}
       * @example eu-central-1
       */
      region: process.env.SERVICES_DATABASE_REGION,
      /**
       * This value is used for development purposes.
       * @type {string}
       * @example http://dynamodb-upload:8000
       */
      endpoint: process.env.SERVICES_DATABASE_ENDPOINT,
    },
    storage: {
      /**
       * @type {string}
       */
      accessKeyId: process.env.SERVICES_STORAGE_ACCESS_KEY_ID,
      /**
       * @type {string}
       */
      secretAccessKey: process.env.SERVICES_STORAGE_SECRET_ACCESS_KEY,
      /**
       * @type {string}
       */
      region: process.env.SERVICES_STORAGE_REGION,
      /**
       * @type {string}
       */
      bucket: process.env.SERVICES_STORAGE_BUCKET,
      /**
       * Amazon S3 access control lists (ACLs) enable you to manage access to buckets and objects.
       * 
       * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html
       * @type {string="READ", "WRITE", "READ_ACP", "WRITE_ACP", "FULL_CONTROL", "private", "public-read", "public-read-write", "aws-exec-read", "authenticated-read", "bucket-owner-read", "bucket-owner-full-control", "log-delivery-write"}
       */
      acl: process.env.SERVICES_STORAGE_ACL,
      /**
       * Server-side encryption is the encryption of data at its destination by the application or service that receives it.
       * 
       * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html
       * @type {string="AES256", "aws:kms", "aws:kms:dsse"}
       */
      serverSideEncryption: process.env.SERVICES_STORAGE_SERVER_SIDE_ENCRYPTION,
    },
    /**
     * Queue is used to process files asynchronously. For example to generate thumbnails
     * or to convert videos to different formats.
     * Queue is also used as callback from AWS MediaConvert service.
     */
    queue: {
      /**
       * @type {string}
       */
      accessKeyId: process.env.SERVICES_QUEUE_ACCESS_KEY_ID,
      /**
       * @type {string}
       */
      secretAccessKey: process.env.SERVICES_QUEUE_SECRET_ACCESS_KEY,
      /**
       * @type {string}
       * @example eu-central-1
       */
      region: process.env.SERVICES_QUEUE_REGION,
      /**
       * @type {string}
       * @example https://sqs.<region>.amazonaws.com/<account id>/<queue name>
       */
      url: process.env.SERVICES_QUEUE_URL,
    },
    cdn: {
      /**
       * @type {string}
       */
      url: process.env.SERVICES_CDN_URL,
      /**
       * @type {string}
       */
      keyPairId: process.env.SERVICES_CDN_KEY_PAIR_ID,
      /**
       * @type {string}
       */
      privateKey: process.env.SERVICES_CDN_PRIVATE_KEY,
    },
    job: {
      general: {
        exiftool: {
          /**
           * @type {string}
           * @example GPSAltitude,GPSLatitude,GPSLongitude
           */
          whitelist: process.env.SERVICES_JOB_GENERAL_EXIFTOOL_WHITELIST,
        }
      },
      image: {
        /**
         * JSON value required. Format:
         * [{
         *   width: 800,
         *   height: 800,
         * }, {
         *   width: 320,
         *   height: 320,
         * }]
         * 
         * @type {string}
         */
        thumbnails: process.env.SERVICES_JOB_IMAGE_THUMBNAILS ? JSON.parse(process.env.SERVICES_JOB_IMAGE_THUMBNAILS) : [],
      },
      video: {
        accessKeyId: process.env.SERVICES_JOB_VIDEO_ACCESS_KEY_ID,
        secretAccessKey: process.env.SERVICES_JOB_VIDEO_SECRET_ACCESS_KEY,
        region: process.env.SERVICES_JOB_VIDEO_REGION,
        queue: process.env.SERVICES_JOB_VIDEO_QUEUE,
        role: process.env.SERVICES_JOB_VIDEO_ROLE,
        endpoint: process.env.SERVICES_JOB_VIDEO_ENDPOINT,
        bucket: process.env.SERVICES_JOB_VIDEO_BUCKET,
        /**
         * 
         * JSON value required. Format:
         * [{
         *   width: 800,
         *   height: 800,
         * }, {
         *   width: 320,
         *   height: 320,
         * }]
         * 
         * @type {string}
         */
        thumbnails: process.env.SERVICES_JOB_VIDEO_THUMBNAILS ? JSON.parse(process.env.SERVICES_JOB_VIDEO_THUMBNAILS) : [],
        /**
         * JSON value required. Format:
         * [{
         *   width: 800,
         *   height: 800,
         * }, {
         *   width: 320,
         *   height: 320,
         * }]
         * 
         * @type {string}
         */
        conversions: process.env.SERVICES_JOB_VIDEO_CONVERSIONS ? JSON.parse(process.env.SERVICES_JOB_VIDEO_CONVERSIONS) : [],
      },
    },
    trace: {
      /**
       * @type {string="AWS_XRAY", "CLS_HOOKED"}
       * @default CLS_HOOKED
       */
      type: process.env.SERVICES_TRACE_TYPE || 'CLS_HOOKED',
      /**
       * If using Service Discovery to find the daemon address.
       * @type {string}
       * @requires SERVICES_TRACE_TYPE=AWS_XRAY
       */
      daemonAddressNamespace: process.env.SERVICES_TRACE_DAEMON_ADDRESS_NAMESPACE,
      /**
       * If using Service Discovery to find the daemon address.
       * @type {string}
       * @requires SERVICES_TRACE_TYPE=AWS_XRAY
       */
      daemonAddressName: process.env.SERVICES_TRACE_DAEMON_ADDRESS_NAME,
      /**
       * Supported values:
       * * ECS
       * * EC2
       * * BEANSTALK
       * @type {string}
       * @requires SERVICES_TRACE_TYPE=AWS_XRAY
       */
      plugins: process.env.SERVICES_TRACE_PLUGINS,
    }
  },
}
