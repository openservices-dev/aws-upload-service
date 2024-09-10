import CloudFront from '../CloudFront';

describe('Services', () => {
  describe('CDN', () => {
    describe('CDN', () => {
      test('Return URL with different host', async () => {
        const cloudFront = new CloudFront('https://cloud.front');

        expect(cloudFront.getUrl('https://bucket.s3.eu-central-1.amazonaws.com/path/to/file')).toBe('https://cloud.front/path/to/file');
      });
    });
  });
});
