var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

// This is the go-between controller for Routes and the Database
// Related to all people

var mongoose = require('mongoose');

var People = mongoose.model('People') 
var Webhook = mongoose.model('Webhook') 

// SENDS all people currently in the database
var getPeople = function(req, res, next){
	People.find(function(err, people){
		res.json(people)
	})
}

var getPeopleWithSlack = function(req, res, next){
	People.find({"slack.id":{"$exists":"true"}}, function(err, results){
		res.json(results)
	})
}

var getPeopleWithAsana = function(req, res, next){
	People.find({"asana_assignee":{$ne:null}}, function(err, results){
		res.json(results)
	})
}

// Adds a new person to the database
// CURRENTLY HARD CODED TO A SINGLE PERSON
var addPerson = function(req, res, next){
	p = {id: 1,
		name: {
			first: "Kjiel",
			last: "Carlson"
			}
		}

	var person = new People(p)

	person.save(function(err, result){
		res.json(result);
	});
}

var addUpdatePerson = function(p){
// 	console.log(p)
	if(!(p._id || p.slackId )){
		console.log("There is no _id or slackId for the user to addUpdatePerson : Please build more functionality")
	} else {
			People.find({'slackId':p.slackId}, function(err, people){
				if(people.length > 0){console.log(people.length + " people have been found")
					if(people.length == 1){console.log(people[0])}
					} else {
						console.log("let add " + p.real_name)
						var pNew = new People(p)
						console.log(pNew)
						pNew.save(function(err, result){
							console.log(result)
						})
					}
				
			})
	}
}

module.exports = {
	addPerson: addPerson,
	addUpdatePerson: addUpdatePerson,
	getPeople: getPeople,
	getPeopleWithSlack: getPeopleWithSlack,
	getPeopleWithAsana: getPeopleWithAsana
}