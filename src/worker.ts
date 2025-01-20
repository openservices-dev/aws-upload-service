import services from './services';
import config from './config';
import logger from './logger';

async function start() {
  const namespace = config.services.trace.daemonAddressNamespace;
  const name = config.services.trace.daemonAddressName;
  if (typeof namespace === 'string' && typeof name === 'string') {
    const address = await services.ServiceDiscovery.discoverInstance(namespace, name);

    (services.Trace as any).setDaemonAddress(address);
  }
  
  logger.info('Upload worker is running');

  const consumer = (await import('./worker/Consumer')).default;
  const ns = services.Trace.getNamespace();

  (ns as any).run(() => {
    consumer.start();
  });
}

start();
