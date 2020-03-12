import * as express from 'express';
import * as passport from 'passport';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import AuthController from 'server/api/controllers/AuthController';

export function register(app: express.Express) {
  require('server/api/passport');

  app.use(morgan(` [HTTP] :method :status :url :response-time ms`));
  app.use(session({
    secret: 'BLABLA',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    if (req.user) {
      res.set('X-Player-Name', (req.user as any).name);
    }

    next();
  });

  app.use(express.static('dist'));
  
  app.get('/api', (req, res) => void (res.sendStatus(200)));

  AuthController(app);
};
