const passport = require('passport');

module.exports = (app) => {
  app.get('/api/auth', (req, res) => {
    if (req.isAuthenticated()) {
      res.set('X-Player-Name', req.user.name);
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  app.get('/api/auth/logout', (req, res) => {
    req.logout();

    res.redirect('/');
  });

  app.get('/api/auth/google', passport.authenticate('google'), () => {});
  app.get('/api/auth/google/callback', passport.authenticate('google'), (req, res) => res.redirect(`/`));

  app.get('/api/auth/facebook', passport.authenticate('facebook'), () => {});
  app.get('/api/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => res.redirect(`/`));
};
