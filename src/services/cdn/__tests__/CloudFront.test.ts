import CloudFront from '../CloudFront';

describe('Services', () => {
  describe('CDN', () => {
    describe('CDN', () => {
      test('Return URL with different host', async () => {
        const cloudFront = new CloudFront('https://cloud.front');

        expect(cloudFront.getUrl('path/to/file')).toBe('https://cloud.front/path/to/file');
      });
    });
  });
});
