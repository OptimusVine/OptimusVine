var request = require('request')

var env = process.env.NODE_ENV

if(env == 'development'){
	var keys = require('./private/keys').keys
	var token = keys.slack.token
	var webhook = keys.slack.webhooks.kjiel
} else {
	var token = process.env.slack_token
	var webhook = process.env.slack_hook_kjiel
}




//console.log(keys.keys)
// Webhook Address to ping @kjiel
//var webhook = keys.slack.webhooks.kjiel



var payload= {"text":"You should pack up shortly and begin to head for the @kjiel"}
payload = JSON.stringify(payload)

var headers = {"Content-type": "application/json"}

//console.log(payload)
/*
request.post({url: webhook, headers: headers, body: payload}, function(err, res){
    if(err){console.log(err)}
    if(res){console.log(res.body)}
})
*/

exports.sendMessage = function(text){
	var message = {"text":text}
	message = JSON.stringify(message)
	request.post({url: webhook, headers: headers, body: message}, function(err, res){
    if(err){console.log(err)}
    if(res){
    //	console.log(res.body)
    }
	})
}


var listChannelsUrl = "https://slack.com/api/channels.list?token=" + token + "&exclude_archived=1&pretty=1"
var listUsersUrl = "https://slack.com/api/users.list?token=" + token + "&pretty=1"

var getUsers = function(){
	request.get(listUsersUrl, function(err, res){
		if(err){console.log(err)}
		if(res){
			var b = JSON.parse(res.body)
			b.members.forEach(function(m){
				if(!m.deleted){
				var displayname = m.real_name ? m.real_name : m.name
				console.log(displayname + " has ID : " + m.id)
				}
			})
		}
	})
}

var getChannels = function(){
	request.get(listChannelsUrl, function(err, res){
		if(err){console.log(err)}
	    if(res){
	   // 	console.log(res.body)
	    	var b = JSON.parse(res.body)
	    	b.channels.forEach(function(c){

	    		console.log(c.name + " has ID: " + c.id)
	    	})
	    }
	})
}

//getUsers()


/*
Ops entering all Price Posting, and Distributor Information
All DTB tech card, Winc Journal and Webstie info for wines capture in PLM
*/