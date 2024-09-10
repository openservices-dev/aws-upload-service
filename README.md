# AWS Upload Service

## Requirements

* [S3](https://aws.amazon.com/s3/)
* [CloudFront](https://aws.amazon.com/cloudfront/)
* [Simple Queue Service](https://aws.amazon.com/sqs/)
* [Media Convert](https://aws.amazon.com/mediaconvert/)

## Logging and debugging

Enable debug logs:

```
LOGGER_LEVEL=debug
```

**Sentry** is supported and is initialized if `SENTRY_DSN` variable is set:

```
SENTRY_DSN=
```

## License

[MIT license](./LICENSE)
