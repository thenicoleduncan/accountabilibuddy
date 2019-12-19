// API USER ROUTES
const passport = require("passport");
require("../config/passport-config")(passport);
//const flash = require("connect-flash");
const db = require("../models");
const session = require("express-session");
const cookieParser = require("cookie-parser");
//jwt
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwt-config");

module.exports = function (app) {

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  
  // Get all users
  app.get("/api/user", function (req, res) {
    db.User.findAll({
      include: [db.Goals]
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // Get one user. 
  app.get("/api/user/:id", function (req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Goals]
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  ////////////////////
  ////Auth Routes////
  //////////////////

  // Create a new user 
  app.post("/api/user", passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/add",
  }));

  app.get("/api/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.post(
    "/api/login",
    passport.authenticate("local-login", {
      failureRedirect: "/login-failed",
    }),
    function (req, res) {
      const payload = {
        email: req.user.email,
        expires: Date.now() + parseInt(60000)
      };
      req.login(payload, { session: false }, function (error) {
        if (error) {
          res.status(400).send({ error });
        }

        const token = jwt.sign(JSON.stringify(payload), jwtSecret.secret);

        res.cookie("jwt", token, { httpOnly: true, secure: false });
        //redirect to dashboard;
        res.redirect("../dashboard");
      });
    }
  );


  
  // Update existing user.  
  app.put("/api/user/:id", function (req, res) {
    db.User.update(
      req.body, {
      where: {
        id: req.body.id
      }
    }
    ).then(function (dbUser) {
      res.json(dbUser);
    })
  });

  // Delete existing user.  
  app.delete("/api/user/:id", function (req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

};
