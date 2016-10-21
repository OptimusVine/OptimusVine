var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var request = require('request')

var env = process.env.NODE_ENV

if(env == 'development'){
	var keys = require('../../private/keys') 
	var token = keys.slack.token
	var webhook = keys.slack.webhooks.kjiel
} else {
	var token = process.env.slack_token
	var webhook = process.env.slack_hook_kjiel
}

var headers = {"Content-type": "application/json"}

var sendMessage = function(text, webhook){
	console.log("Inside webhook.js")
	console.log(text)
//	console.log(webhookX)
//	webhookX = "https://hooks.slack.com/services/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"
	console.log(webhook)
	return new Promise(function(resolve, reject){
	var message = {"text":text}
	message = JSON.stringify(message)
	request.post({url: webhook, headers: headers, body: message}, function(err, res){
		if(err){console.log(err)}
			if(res){
				console.log(res.body)
				resolve()
			}
		})
	})
}

module.exports = {
	sendMessage: sendMessage
}