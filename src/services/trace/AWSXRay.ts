import XRay from 'aws-xray-sdk';
import http from 'http';
import https from 'https';

class AWSXRay implements Services.Trace {
  constructor (plugins: string) {
    this.setPlugins(plugins);

    XRay.captureHTTPsGlobal(http, true);
    XRay.captureHTTPsGlobal(https, true);
  }

  public openSegment(defaultName: string) {
    return XRay.express.openSegment(defaultName);
  }

  public closeSegment() {
    return XRay.express.closeSegment();
  }

  public createSegment(name: string) {
    return new XRay.Segment(name);
  }

  public setSegment(segment: unknown): void {
    return XRay.setSegment(segment as XRay.Segment);
  }

  public getTraceId(): string {
    const namespace = XRay.getNamespace();

    if (namespace.active === null) {
      return undefined;
    }

    const segment = XRay.getSegment();

    return 'segment' in segment ? segment.segment.trace_id : segment.trace_id;
  }

  public getNamespace(): unknown {
    return XRay.getNamespace();
  }

  public captureAWSv3Client<T>(client: T): T {
    return XRay.captureAWSv3Client(client as T & { middlewareStack: { remove: any, use: any }, config: any });
  }

  public setDaemonAddress(address: string) {
    XRay.setDaemonAddress(address);
  }

  public setPlugins(plugins: string | undefined) {
    if (typeof plugins !== 'string') {
      return;
    }

    const xrayPlugins = [
      plugins.includes('ECS') ? XRay.plugins.ECSPlugin : null,
      plugins.includes('EC2') ? XRay.plugins.EC2Plugin : null,
      plugins.includes('BEANSTALK') ? XRay.plugins.ElasticBeanstalkPlugin : null,
    ].filter(plugin => plugin !== null);

    XRay.config(xrayPlugins); 
  }
}

export default AWSXRay;
