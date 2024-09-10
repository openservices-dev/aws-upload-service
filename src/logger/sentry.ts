import * as Sentry from '@sentry/node';

if (typeof process.env.SENTRY_DSN === 'string') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    
    tracesSampleRate: 1.0,
  });
}
