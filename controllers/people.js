var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

// This is the go-between controller for Routes and the Database
// Related to all people

var mongoose = require('mongoose');

var People = mongoose.model('People') 

// SENDS all people currently in the database
exports.getPeople = function(req, res, next){
	People.find(function(err, people){
		res.json(people)
	})
}
// Adds a new person to the database
// CURRENTLY HARD CODED TO A SINGLE PERSON
exports.addPerson = function(req, res, next){
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