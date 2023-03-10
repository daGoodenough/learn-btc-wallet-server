const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;

const localOptions = {usernameField: 'email'}

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({email: email}, (err, user) => {
    if(err) {return done(err)};
    if(!user) {
      return done(null, false);
    };
    if(!user.validPassword(password, user)) {
        return done(null, false, {message: "Incorrect Password"});
    };
    return done(null, user);
  })
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.NODE_ENV === 'production' ? 
    process.env.PROD_TOKEN_SECRET : 
    'helloworld',
};

const jwtLogin = new JwtStrategy(jwtOptions, async(payload, done) => {
  // const user = find user by id from jwt (id: payload.sub)
  User
    .findById(payload.sub)
    .populate('wallets')
    .exec(
      (err, user) => {
        if (err) { return done(err, false) };
        if(user) {
          done(null, user);
        } else {
          done(null, false);
        };
      }
    )
});

passport.use(localLogin);
passport.use(jwtLogin);

module.exports.requireAuth = passport.authenticate('jwt', { session: false });