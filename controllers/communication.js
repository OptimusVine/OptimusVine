var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var webhooks = require('../middlewares/slack/webhooks')
var slackBackend = require('../middlewares/slack/backend')

var mongoose = require('mongoose');

var People = mongoose.model('People') 
var Webhook = mongoose.model('Webhook') 

var getWebhooks = function(req, res){
    Webhook.find(function(err, w){
        res.send(w)
    })
}

var postWebhooks = function(req, res){
    var w = new Webhook(req.body)
    w.save(function(err, result){
        res.send(result)
    })
}

var sendMessageSlack = function(req, res){
    var text = "This has been sent via Angular2 App"
    webhooks.sendMessage(text)
    res.send(text)
}

var postMessageSlack = function(req, res){
    var message = req.body.text
    console.log(req.body)
    getWebhook(req.body.slackId).then(function(webhookBody){
        webhooks.sendMessage(message, webhookBody.webhook).then(function(){
            console.log("sending response")
            res.status(200)
            var body = JSON.stringify({"result":"Message Received"})
            res.send(body)
        }) 
    })
}

var getWebhook = function(slackId){
    return new Promise(function(resolve, reject){
	Webhook.findOne({"slackId":slackId}, function(err, person){
		resolve( person)
	    })
    })
}

module.exports = {
    getWebhooks: getWebhooks,
    postMessageSlack: postMessageSlack,
    postWebhooks: postWebhooks,
    sendMessageSlack: sendMessageSlack,   
}