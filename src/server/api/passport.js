const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserRepository = require('server/database/repositories/UserRepository');

passport.use(new LocalStrategy(
  (username, password, done) => {
    UserRepository.find({ username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
