const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const UserRepository = require('server/database/repositories/UserRepository');
const Logger = require('server/Logger');
const oauth = require('server/api/oauth');

function handleStrategyResponse(accessToken, refreshToken, profile, done) {
  UserRepository.find({ oauthID: profile.id })
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        const newUser = {
          oauthID: profile.id,
          name: profile.displayName,
          created: Date.now(),
        };

        UserRepository.insert(newUser)
          .then(() => {
            done(null, newUser);
          })
          .catch((repositoryError) => {
            Logger.error(repositoryError);
          });
      }
    })
    .catch((error) => {
      Logger.error(error);
    });
}

passport.serializeUser((user, done) => {
  Logger.trace(`Serializing user: ${user._id}`);

  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserRepository.find(id)
    .then((user) => {
      Logger.trace(`Deserialized user: ${id}`);

      done(null, user);
    })
    .catch((error) => {
      Logger.error(error);

      done(error, null);
    });
});

passport.use(new GoogleStrategy({
  clientID: oauth.google.clientID,
  clientSecret: oauth.google.clientSecret,
  callbackURL: oauth.google.callbackURL,
  scope: oauth.google.scope,
}, handleStrategyResponse));

passport.use(new FacebookStrategy({
  clientID: oauth.facebook.clientID,
  clientSecret: oauth.facebook.clientSecret,
  callbackURL: oauth.facebook.callbackURL,
}, handleStrategyResponse));
