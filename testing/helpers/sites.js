var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var siteControlller = require('../controllers/sites')

var mongoose = require('mongoose')
var Site = mongoose.model('Site')

// Test Data to pull in locations via Array, mocking a .csv import
var sitesArray = [
	[1, "8716 35th St W", "", 'University Place', 'WA', 98466],
	[6, '15255 Sunwood Blvd', '105', 'Tukwilla', 'WA', 98188],
	[3, '1747 Briarvista Way', , 'Atlanta', 'GA', 30329],
	[4, '1144 11th St', 'Unit A', 'Santa Monica', 'CA', 90004],
	[5, '4243 Don Luis Dr', , 'Los Angeles', 'CA', 90008],
	[2, "8174 35th St W", "", "UP", 'WA', 98466]
	]

var loadIfEmpty = function(){
	Site.find(function(err, sites){
		if(sites.length < 1){
			console.log('No Sites found in DB - loading test data')
			loadArray(sitesArray)
		} else {
			console.log('Site(s) Found, no action being taken')
		}
	})
}

var loadArray = function(a){
	for(i=0; i<a.length; i++){
		var t = {}
		var item = a[i];
		var address = {
			street: item[1],
			street2: item[2],
			city: item[3],
			state: item[4],
			zip: item[5]
		}
		t.name = "A place " + i
		t.address = address;
		t.id = item[0]
		console.log(t)
		var load = new Site(t)
		load.save(function(err, routeX){

		})
	}
}

exports.listSites = function(){
	return sitesArray;
}

loadIfEmpty();