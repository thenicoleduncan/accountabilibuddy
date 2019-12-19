const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const jwtSecret = require("./jwt-config");
const db = require("../models");

module.exports = function(passport) {

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    db.User.findOne({ where: { id: id } }).then(function(data) {
      cb(null, data);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        session: true,
        passReqToCallback: true
      },
      function(req, email, password, done) {
        const userName = req.body.name;

        db.User.findOne({ where: { email: email } }).then(function(data) {
          if (data) {
            return done(null, false, {
              message: "Oops! Email already signed-up."
            });
          }
          else {
            db.User
              .create({
                email: email,
                password: db.User.generateHash(password),
                name: userName
              })
              .then(function(data) {
                return done(null, data);
              });
          }
        });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        session: true
      },
      function(email, password, done) {
        db.User.findOne({ where: { email: email } }).then(function(user) {
          if (!user) {
            return done(null, false, { message: "No email found." });
          }
          if (!db.User.validPassword(password, user.password)) {
            return done(null, false, { message: "Oops! Wrong password!" });
          }

          return done(null, user);
        });
      }
    ) //end new LocalStrategy
  ); // end passport.use local-login

  const opts = {
    jwtFromRequest: function(req) {
      return req.cookies.jwt;
    },
    secretOrKey: jwtSecret.secret
  };

  passport.use(
    "jwt",
    new JwtStrategy(opts, function(jwtpayload, cb) {
      db.User.findOne({ id: jwtpayload.sub }).then(function(data) {
        if (data) {
          return cb(null, data);
        }
        else {
          return cb(null, false, { message: "No user found." });
        }
      });
    })
  );

  

};

