const JwtStrategy = require("passport-jwt").Strategy;
const ExtraJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtraJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};

/*

module.exports = function(passport, nev) {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.name = req.body.name;
        nev.createTempUser(newUser, function(
          err,
          existingPersistentUser,
          newTempUser
        ) {
          if (err) console.error(err);
          if (existingPersistentUser) {
            console.log(
              "You have already signed up and confirmed your account. Did you forget your password?"
            );
            return done(null);
          }
          if (newTempUser) {
            var URL = newTempUser[nev.options.URLFieldName];
            nev.sendVerificationEmail(email, URL, function(err, info) {
              if (err) console.error(err);
              console.log(
                "An email has been sent to you. Please check it to verify your account."
              );
              return done(null);
            });
          } else {
            console.log(
              "You have already signed up. Please check your email to verify your account."
            );
            return done(null);
          }
        });
      }
    )
  );
};
*/
