const passport = require('passport');

module.exports = (app) => {
  app.post('/login',
    passport.authenticate('local'),
    (req, res) => {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect(`/users/${req.user.username}`);
    });
};
