import aws from './aws';
import database from './database';
import storage from './storage';
import queue from './queue';
import token from './token';
import cdn from './cdn';
import metadata from './metadata';
import job from './job';
import cache from './cache';
import trace from './trace';
import ServiceDiscovery from './serviceDiscovery';
import config from '../config';

const container = {
  get AWS() {
    return aws();
  },

  get Cache() {
    return cache.LRU;
  },

  get Database(): Services.Database {
    return database.DynamoDB;
  },

  get Storage(): Services.Storage {
    return storage.S3;
  },

  get Queue(): Services.Queue {
    return queue.AWSQueue;
  },

  get Token(): Services.Token {
    switch (config.services.token.type) {
      case 'JWT':
        return token.JWT;
      case 'AWS_COGNITO':
        return token.AWSCognito;
      default:
        throw new Error('Unknown token service!');
    }
  },

  get CDN(): Services.CDN {
    return cdn.CloudFront;
  },

  get Metadata(): Services.Metadata {
    return metadata.Metadata;
  },

  get Job(): Services.Job {
    return job.Job;
  },

  get Trace(): Services.Trace {
    switch (config.services.trace.type) {
      case 'AWS_XRAY':
        return trace.AWSXRay;
      case 'CLS_HOOKED':
      default:
        return trace.CLSHooked;
    }
  },

  get ServiceDiscovery() {
    return new ServiceDiscovery();
  },
};

export default container;
