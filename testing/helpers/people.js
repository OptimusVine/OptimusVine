var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');
var People = mongoose.model('People')
// Test data in Array for to mimic a csv upload or import
var peoepleArray = [
	[24, "Kjiel", "Carlson"],
	[74, "Wayne", "Nikolaisen"],
	[172, "Pete", "Gabbard"],
	[23, "Kellyn", "Carlson"]
	]

var loadIfEmpty = function(){
	People.find(function(err, people){
		if(people.length < 1){
			console.log('No people found in DB - loading test data')
			loadArray(peoepleArray)
		} else {
			console.log('People(s) Found, no action being taken')
		}
	})
}

var loadArray = function(a){
	for(i=0; i<a.length; i++){
		var t = {}
		var item = a[i];

		t.id = item[0]
		t.name = {
			first: item[1],
			last: item[2]
		}

		console.log(t)
		var load = new People(t)
		load.save()
	}
}

loadIfEmpty();


var getPerson = function(id){
	for(i=0; i < peoepleArray.length; i++){
		if(peoepleArray[i][2] === id){
			console.log("Person with id " + id + " found: " + peoepleArray[i])
			return peoepleArray[i];
		}
	}
}

getPerson(23)

exports.listPeople = function(){
	for(i=0; i < peoepleArray.length; i++){
		console.log(peoepleArray[i]);
		return peoepleArray;
	}
}