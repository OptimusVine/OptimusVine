console.log("***** Route Planner App *****")
console.log("The problem is NOT creating");
console.log("The problem is NOT imagining");
console.log("The true problem is imagining AND creating at the level you are happy with");
console.log("***** ")

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path')
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

var helpers = require('./helpers/index')

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

 // console.log("Example app listening at http://%s:%s", host, port)


module.exports = app;

/*
var speaker = ["Kjiel", "MHD"]
var speech = [
				"This is working, " + speaker[0], 
				"That's bullshit, " + speaker [1]
				]

for(i=0; i<speech.length; i++){
	console.log(speech[i]);
}

people.listPeople(speaker);
*/

