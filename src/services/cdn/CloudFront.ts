import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

class CloudFront implements Services.CDN {
  constructor(
    protected url: string,
    protected keyPairId?: string,
    protected privateKey?: string,
  ) {}

  public getUrl(path: string): string {
    return `${this.url}/${path}`;
  }

  public getSignedUrl(path: string): string {
    if (typeof this.privateKey === 'undefined' || typeof this.keyPairId === 'undefined') {
      throw new Error('Missing privateKey or keyPairId!');
    }

    const signedUrl = getSignedUrl({
      url: `${this.url}/${path}`,
      keyPairId: this.keyPairId,
      privateKey: this.privateKey,
      dateLessThan: (new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).toISOString().split('T').shift(),
    });

    return signedUrl;
  }
}

export default CloudFront;
