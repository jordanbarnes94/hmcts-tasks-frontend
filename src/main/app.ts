/* eslint-disable no-console */
import * as path from 'path';

import { HTTPError } from './HttpError';
import { Nunjucks } from './modules/nunjucks';

import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import express, { json, urlencoded } from 'express';
import { glob } from 'glob';
import helmet from 'helmet';
import favicon from 'serve-favicon';

const { setupDev } = require('./development');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;

new Nunjucks(developmentMode).enableFor(app);

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
// Security headers — CSP disabled here; configure separately to suit your GOV.UK frontend assets
app.use(helmet({ contentSecurityPolicy: false }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csurf({ cookie: true }));
// eslint-disable-next-line import/no-named-as-default-member
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

glob
  .sync(__dirname + '/routes/**/*.+(ts|js)')
  .sort() // Sort alphabetically to ensure consistent route registration order
  .map(filename => require(filename))
  .forEach(route => route.default(app));

setupDev(app, developmentMode);

// 404 handler — must be registered after all routes
app.use((req, res) => res.status(404).render('not-found'));

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HTTPError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Handle CSRF token validation failures
  if ((err as Error & { code?: string }).code === 'EBADCSRFTOKEN') {
    return res.status(403).render('forbidden');
  }
  // eslint-disable-next-line no-console
  console.error('Error:', err.message, err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
