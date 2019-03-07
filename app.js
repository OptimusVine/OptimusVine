console.log("***** The Process Backend App *****")
console.log("The problem is NOT creating");
console.log("The problem is NOT imagining");
console.log("The true problem is imagining AND creating at the level you are happy with");
console.log("Don't let perfect be the enemy of good")
console.log("   - Voltaire")
console.log("***** ")

var cors = require('cors')
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var flash = require('connect-flash')
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path')
var session = require('express-session')
/*
 
An array of addresses plus a techniciaina ID
Take an array of addresses, and provide with Tech it is best suited for

*/

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
console.log(env + " Is our Environment")
var configDB = require('./config/database.js') 
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url[env])


var models = require('./models/index')

var routes = require('./routes/index');

var middlewares = require('./middlewares/middlewares')

// var helpers = require('./helpers/index')

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); 



// Required for PASSPORT
app.use(require('express-session')({
  secret: 'MASH4077',
  resave: false,
  saveUninitialized: false
}));
app.use(session({ secret: 'MASH4077'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

/*
app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT'),
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});
*/

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT'),
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});



require('./config/passport')(passport)

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

 // console.log("Example app listening at http://%s:%s", host, port)


module.exports = app;

