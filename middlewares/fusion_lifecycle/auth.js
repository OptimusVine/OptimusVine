var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var request = require('request')
var mongoose = require('mongoose')

var env = process.env.NODE_ENV

if(env == "development"){
	var keys = require('../../private/keys')
	var userId = keys.autodesk.userId
	var password = keys.autodesk.password
} else {
	var token = process.env.asana_token_kjiel
	var userId = process.env.autodesk_userId_kjiel
	var password = process.env.autodesk_password_kjiel
}
/*
var keys = require ('../../private/keys.js')
var userId = keys.autodesk.userId
var password = keys.autodesk.password
*/

var sessionid = "";
var cookieString = "";
var workspaces;

options = {}

var param = {
	"header": {
		"Content-Type": "application/json",
		"Accept": "application/json"
	},
		"userID": userId,
		"password": password
}

exports.Cookie = function(){
	if (cookieString.length > 2){
		return cookieString
	} else {
		console.log("Cookie String might be Null")
	}
}

// ==== Get Authentication Token ====
var getAuth = function(){
	console.log(" \n ----- Requesting PLM Authentication ----- \n")
	request.post('https://clubw.autodeskplm360.net/rest/auth/1/login', {form: param}, function(err, response){
		if(err){
			console.log("Error attempting to reach PLM for Authentication")
		} else {
		//	console.log(response)
			var resBody = JSON.parse(response.body);
		//	console.log(resBody)
			sessionid = resBody.sessionid;
			cookieString = "customer=CLUBW;JSESSIONID=" + sessionid.toString();
		//	console.log(cookieString + " is our Auth Key!");
			setOptions("", cookieString)
		//	console.log(options)
			console.log(" \n -- PLM Authentication: " + cookieString + "\n")
			return;
		}
	}) 
}

var setOptions = function(dest, cookie){
	options = {
    "method":"GET",
    "url": "https://clubw.autodeskplm360.net/api/rest/v1/",
    "headers": {
        "Accept": "application/json"
    ,   "Cookie": cookieString
    }}
	options.url += dest
//	options.headers.Cookie += cookie
//	console.log(options.headers.Cookie)
	return options
}

var setOptionsWorkspace = function(){
	options = {
    "method":"GET",
    "url": "https://clubw.autodeskplm360.net/api/rest/v1/workspaces",
    "headers": {
        "Accept": "application/json"
    ,   "Cookie": cookieString
    }}
	return options
}

getAuth();

