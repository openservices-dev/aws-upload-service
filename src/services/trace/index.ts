import { ServiceDiscoveryClient, DiscoverInstancesCommand, HealthStatusFilter } from '@aws-sdk/client-servicediscovery';
import AWSXRay from './AWSXRay';
import CLSHooked from './CLSHooked';
import config from '../../config';
import { nextTick } from 'process';

const container = {
  get AWSXRay() {
    if (typeof this._awsXRay === 'undefined') {
      this._awsXRay = new AWSXRay(config.services.trace.plugins);

      if (typeof config.services.trace.daemonAddressNamespace === 'string') {
        const setDaemonAddress = async () => {
          const client = new ServiceDiscoveryClient({ region: process.env.AWS_XRAY_REGION });

          const input = {
            NamespaceName: config.services.trace.daemonAddressNamespace,
            ServiceName: config.services.trace.daemonAddressName,
            MaxResults: 1,
            HealthStatus: HealthStatusFilter.HEALTHY_OR_ELSE_ALL,
          };
        
          const command = new DiscoverInstancesCommand(input);
        
          const result = await client.send(command);
        
          const ip = result.Instances[0].Attributes.AWS_INSTANCE_IPV4;
          const port = result.Instances[0].Attributes.AWS_INSTANCE_PORT;
        
          this._awsXRay.setDaemonAddress(`${ip}:${port}`);
        };

        nextTick(setDaemonAddress);
      }
    }

    return this._awsXRay;
  },

  get CLSHooked() {
    if (typeof this._clsHooked === 'undefined') {
      this._clsHooked = new CLSHooked();
    }

    return this._clsHooked;
  }
};

export default container;
