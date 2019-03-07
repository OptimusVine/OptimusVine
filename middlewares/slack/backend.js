var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var request = require('request')
var slack = require('./webhooks')
var peopleController = require('../../controllers/people')

var env = process.env.NODE_ENV

if(env == 'development'){
	var keys = require('../../private/keys') 
	var token = keys.slack.token
	var webhook = keys.slack.webhooks.kjiel
} else {
	var token = process.env.slack_token
	var webhook = process.env.slack_hook_kjiel
}

var listUsersUrl = "https://slack.com/api/users.list?token=" + token + "&pretty=1"

console.log(listUsersUrl)

var getUsers = function(){
	request.get(listUsersUrl, function(err, res){
		if(err){console.log(err)}
		if(res){
			var b = JSON.parse(res.body)
            if(b.members){
                b.members.forEach(function(m){
                    if(!m.deleted){
                    var displayname = m.real_name ? m.real_name : m.name
                    var p = mapUsersToSchema(m)
                    peopleController.addUpdatePerson(p)
                    }
			    })
          //      console.log(b.members[0])
          //      var p = mapUsersToSchema(b.members[0])
          //      peopleController.addUpdatePerson(p)

            } else {
                console.log("ERROR:")
                console.log(b)
            }
			
		}
	})
}

var mapUsersToSchema = function(u){
        u.slackId = u.id;
        delete u.id
        if(u.profile){
            u.name = {
            first: u.profile.first_name,
            last: u.profile.last_name,
            full: u.real_name,
            slack: u.name
            }
        } else {
            u.name = {
                slack: u.name
            }
        }
        u.email = u.profile.email       
        return u
}

//getUsers()