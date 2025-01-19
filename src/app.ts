import express from 'express';
import qs from 'qs';
import * as Sentry from '@sentry/node';
import config from './config';
import routes from './routes';
import cors from './middlewares/cors';
import logRequest from './middlewares/logRequest';
import errorHandler from './middlewares/errorHandler';
import services from './services';
import './logger/sentry';

const app = express();

app.disable('x-powered-by');
app.set('query parser', function (str: string) {
  return qs.parse(str, { arrayLimit: Infinity });
});
typeof process.env.SENTRY_DSN === 'string' && Sentry.setupExpressErrorHandler(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use(logRequest);

app.use(services.Trace.openSegment('uplad-service') as any);
app.use(`${config.routePrefix}`, routes);
app.use(services.Trace.closeSegment() as any);

app.use(errorHandler);

export default app;
