var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var auth = require('./auth')

var request = require('request')
var mongoose = require('mongoose')

var Workspace = mongoose.model('Workspace')
var Sourcing = mongoose.model('Sourcing')
var Wine = mongoose.model('Item')
var Production = mongoose.model('Production')
var Workflow = mongoose.model('Workflow')

var setOptions = function(target){
	o = {
    "method":"GET",
    "url": "https://clubw.autodeskplm360.net/api/rest/v1/",
    "headers": {
        "Accept": "application/json"
    ,   "Cookie": auth.Cookie()
    }}
    o.url += target
    return o;
}

// gets the history of a given item as its moved through workflows in PLM
exports.getItemWorkflowHistory = function(req, res){
	return new Promise(function(resolve, reject){
		var uri = req.item.uri
		o = {
    "method":"GET",
    "url": uri + "/workflows/history",
    "headers": {
        "Accept": "application/json"
    ,   "Cookie": auth.Cookie()
    	}}
     	console.log(o) 
    	request(o ,function(err, response){
    		if(err){console.log(err)}
    		else if(response.statusCode ==500){console.log("Error 500 - Possible AUTH issue")}
    		else{
			   	//  console.log("Request Received")
			   	var resBody = JSON.parse(response.body)
			   		console.log(resBody.list.historySteps)
	    	//	processDownloadedItems(resBody.list.item, id)
    			}
    		})
	})
}

exports.getProductionWorkflowHistory = function(req, res){
	return new Promise(function(resolve, reject){
		var uri = req.production.uri
		o = {
    "method":"GET",
    "url": uri + "/workflows/history",
    "headers": {
        "Accept": "application/json"
    ,   "Cookie": auth.Cookie()
    	}}
     	console.log(o) 
    	request(o ,function(err, response){
    		if(err){console.log(err)}
    		else if(response.statusCode ==500){console.log("Error 500 - Possible AUTH issue")}
    		else{
			   	//  console.log("Request Received")
			   	var resBody = JSON.parse(response.body)
			   		console.log(resBody.list.historySteps)
	    	//	processDownloadedItems(resBody.list.item, id)
    			}
    		})
	})
}