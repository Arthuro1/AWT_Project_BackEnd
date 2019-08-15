const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('Authorization');
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async(jwt_payload, done) => {
    try {
      console.log('I am in jwt passport');
      const user = await User.findById(jwt_payload.sub);
      if (user) {
        console.log('token valid');
        return done(null, user);
      }

      console.log('token invalid');
      return done(null, false);
    } catch (e) {
      done(e, false);
    }
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async(email, password, done) => {
      try {
        const user = await User.findOne({'local.email': email});
        if (!user) {
          return done(null, false);
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          return done(null, false);
        }
        return done(null, user);
      } catch (e) {
        done(e, false);
      }
    }
  )
);

passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async(accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const existingUser = await User.findOne({'google.id': profile.id});
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          method: 'google',
          google: {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          },
          imageUrl: profile.photos[0].value,
          commentIds: [],
        });

        await newUser.save();
        done(null, newUser);
      } catch (e) {
        done(e, false, e.message);
      }
    }
  )
);

passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    async(accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const existingUser = await User.findOne({'facebook.id': profile.id});
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          method: 'facebook',
          facebook: {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          },
          imageUrl: profile.photos[0].value,
          commentIds: [],
        });

        await newUser.save();
        done(null, newUser);
      } catch (e) {
        done(e, false, e.message);
      }
    }
  )
);
