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
  // Load index page
  app.get("/", function (req, res) {
    if (req.user) {
      res.redirect("/dashboard");
    } else {
      let message = `Sign in to your account.`; 
      res.render("index", { message: message });
    }
  });

  app.get("/login-failed", function (req, res){
    res.render("login-failed");
  })

  // Load example page and pass in an example by id
  app.get("/user/:id", function (req, res) {
    db.User.findOne({ where: { id: req.params.id } }).then(function (dbUser) {
      res.render("dashboard");
    });
  });


  app.get("/dashboard", function (req, res) {
    if (req.user) {
       
      db.Task.findAll({ where: { UserId: req.user.id, priority: 1, completed: 0 }}).then(function(dbTasks){
        findGoal(dbTasks); 
      }); 
      function findGoal(dbTasks) {
        db.Goal.findAll({ where: { UserId: req.user.id, completed: 0 } }).then(function(dbGoals){
                res.render("dashboard", { tasks: dbTasks, goals: dbGoals}) }); 
      }; 
        
    } else {
      res.redirect("/");
    }
  });

  app.get("/add", function (req, res) {
    res.render("create-account");
  });

  app.get("/completed-goals", function(req, res){
    db.Goal.findAll({ where: { UserId: req.user.id, completed: 1} }).then(function(dbCompletedGoals){
      res.render("completed-goals", { goals: dbCompletedGoals }); 
    })
  })

  app.get("/:goal/tasks", function (req, res) {
    var goal = `${req.params.goal}`;
    var goalId = goal.slice(1);
    console.log(`Goal ID is ${goalId}`);
    if (req.user) {
      console.log(req.user);
      db.Task.findAll({ where: { UserId: req.user.id, GoalId: goalId, completed: 0 } }).then(function(dbCurrentTasks) {
        renderFinishedTasks(dbCurrentTasks)
      }); 
      function renderFinishedTasks(dbCurrentTasks) {
        db.Task.findAll({ where: { UserId: req.user.id, GoalId: goalId, completed: 1 }}).then(function(dbDoneTasks){
          renderGoal(dbCurrentTasks, dbDoneTasks); 
        }); 
      }; 
      function renderGoal (dbCurrentTasks, dbDoneTasks) {
        db.Goal.findOne({ where: { id: goalId }}).then(function(dbGoal){
          res.render("tasks", { tasksCurrent: dbCurrentTasks, tasksDone: dbDoneTasks, idgoal: goalId, goaldescr: dbGoal.description }); 
        })
      }
    } else {
      res.redirect("/");
    }
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });

};
