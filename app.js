import express from 'express';
import http from 'http';
import path from 'path';
import methods from 'methods';
import expressValidator from 'express-validator';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import errorhandler from 'errorhandler';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';


dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const app = express();

// Normal express config defaults
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

// mongose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// import models
import Models from './models/index';

// app routes
import routes from './routes';
app.use(routes);

// passport initialize
app.use(passport.initialize());
app.use(passport.session());

import passportConfig from './config/passport';

// swagger
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes);

if (!isProduction) {
  app.use(errorhandler());
}

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handler
app.use((err, req, res, next) => {
  if (!isProduction) {
    console.log(err.stack);
  }

  res.status(err.status || 500);

  res.json({'errors': {
    message: err.message,
    error: err
  }});
});

// starting server
const server = app.listen( process.env.PORT || 3000, () => {
  console.log('Web server running on port ' + server.address().port);
});

let cron = require('node-cron');
import mailer from "./controllers/mailer"
import duties from "./controllers/duties"

cron.schedule('1 12 * * *', () => {
  mailer.runCron();
});

cron.schedule('1 3 * * *', () => {
  duties.runCron();
});
