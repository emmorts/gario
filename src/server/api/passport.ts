import * as passport from 'passport';
import { OAuth2Strategy as GoogleStrategy, VerifyFunction } from 'passport-google-oauth';
import { Strategy as FacebookStrategy} from 'passport-facebook';
import UserRepository from 'server/database/repositories/UserRepository';
import Logger from 'server/Logger';
import oauth from 'server/api/oauth';

async function handleStrategyResponse(accessToken: string, refreshToken: string, profile: passport.Profile, done: VerifyFunction) {
  const user = await UserRepository.find({ oauthID: profile.id });
  
  if (user) {
    done(null, user);
  } else {
    const newUser = {
      oauthID: profile.id,
      name: profile.displayName,
      created: Date.now(),
    };

    try {
      const savedUser = await UserRepository.insert(newUser);

      done(null, savedUser);
    } catch (error) {
      Logger.error(error);
    }
  }
  // UserRepository.find({ oauthID: profile.id })
  //   .then((user) => {
  //     if (user) {
  //       done(null, user);
  //     } else {
  //       const newUser = {
  //         oauthID: profile.id,
  //         name: profile.displayName,
  //         created: Date.now(),
  //       };

  //       UserRepository.insert(newUser)
  //         .then(() => {
  //           done(null, newUser);
  //         })
  //         .catch((repositoryError) => {
  //           Logger.error(repositoryError);
  //         });
  //     }
  //   })
  //   .catch((error) => {
  //     Logger.error(error);
  //   });
}

passport.serializeUser((user: any, done) => {
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
  // scope: oauth.google.scope,
}, handleStrategyResponse));

passport.use(new FacebookStrategy({
  clientID: oauth.facebook.clientID,
  clientSecret: oauth.facebook.clientSecret,
  callbackURL: oauth.facebook.callbackURL,
}, handleStrategyResponse));
