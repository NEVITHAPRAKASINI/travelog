// var createError = require('http-errors');
//var express = require('express');
//var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

//var app = express();

//// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

//// error handler
//app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};

//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});
const express = require('express')
const app = express()
var path = require('path');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
//const port = 3000
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var database = "travelLog"
var dir = path.resolve(__dirname)


//login

app.get("/", function (req, res) {
  // res.sendFile('login.html', { root:'C:/Users/nevi/Desktop/modules/public'});
  res.sendFile('login.html', { root: dir + '/public' });
});

app.post("/signUpUser", function (req, res) {
  var user = req.body;
  userExists(user.userName, function (response) {

    if (response) {
      signUpUser(user);
      res.redirect("/");
    }
    else {
      console.log("UserName already present");
      res.sendFile('invalidSignUp.html', { root: dir + '/public' });
    }
  })

})

app.post("/logInUser", function (req, res) {
  var user = req.body;
  logInUser(user, function (response) {
    if (response) {
      res.sendFile('mainPage.html', { root: dir + '/public' });
    }
    else {
      console.log("invalid user");
      res.sendFile('invalidLogin.html', { root: dir + '/public' });
    }
  })
});
//add user
signUpUser = function (user) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("user").insertOne(user, function (err, res) {
      if (err) throw err;
      console.log("document inserted");
      db.close();
    });
  });
}

//to veryfy user
logInUser = function (user, callback) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("user").find(user).toArray(function (err, result) {
      var isexists = false;
      if (err) throw err;
      console.log(result);
      console.log(result.length);
      if (result.length > 0) {
        isexists = true;
      }
      else {
        isexists = false;
      }
      db.close();
      return callback(isexists);
    });
  });

}
//check user
userExists = function (userName, callback) {
  var userCount;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("user").find({ userName: userName }).toArray(function (err, result) {
      if (err) throw err;
      userCount = result.length;
      db.close();
      if (result.length === 0) {
        isexists = true;
      }
      else {
        isexists = false;
      }
      db.close();
      return callback(isexists);
    });
  });
  return userCount;
}

//logout
app.get("/logout", function (req, res) {
  // res.sendFile('login.html', { root:'C:/Users/nevi/Desktop/modules/public'});
  res.redirect("/")});


app.listen(1500, function () {
  console.log("The server has been started");
});

module.exports = app;
