const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('Authorization');
opts.secretOrKey = process.env.JWT_SECRET?process.env.JWT_SECRET:'mySecret';

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
