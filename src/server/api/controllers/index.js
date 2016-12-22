const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

exports.register = (app) => {
  require('server/api/passport');
  app.use(morgan(`\\x1b[32m [HTTP] :method :status :url :response-time ms\\x1b[0m`));
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
      res.set('X-Player-Name', req.user.name);
    }

    next();
  });

  app.use(express.static('dist'));

  require('server/api/controllers/AuthController')(app);
};
