var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose')
var Route = mongoose.model('Route')
var Site = mongoose.model('Site')

// Test Data to pull in locations via Array, mocking a .csv import
var routesArray = [
	[0, "Route 33", "Kjiel", ,"Open"],
	[1, "Route 1", "Pete", ,"Open"],
	[2, "Route 2", "Wayne", ,"Open"],
	[3, "Beverly Hills", "Kellyn", ,"Open"]
	]

var loadIfEmpty = function(){
	Route.find(function(err, routes){
		if(routes.length < 1){
			console.log('No Routes found in DB - loading test data')
			loadArray(routesArray)
		} else {
			console.log('Route(s) Found, no action being taken')
		}
	}) 
}

// When passed an ID for a site, it will return the full site from the DB to be inserted into the Route
var loadSite = function(route, num){
	var query = Site.find({"id":num})
	query.exec(function(err, site){
		if(err){return err};
		if(!site){return;}
		console.log(route)
		route.sites.push("Mongoose")
		console.log("Sites : ")
	})
}

var loadArray = function(a){
	var count = 1;
	for(i=0; i<a.length; i++){
		var t = {}
		var item = a[i];

		t.id = item[0]
		t.name = item[1]
		t.tech = item[2]
		t.status = item[4]


		var load = new Route(t)
	//	console.log(load)
		load.save(function(err, route){
			var query = Site.find({"id":count})
							count++;
			query.exec(function(err, site){

				if(err){return err};
				if(!site){return;}
				if(site.length<1){return;}
				//console.log(site[0])
				route.sites.push(site[0])


				console.log(route.sites)
				route.save(function(){
					site[0].nextDate = route.scheduleDate
					site[0].routes.push(route)
					site[0].save()
				})
			})
		})
	}
}

loadIfEmpty();

exports.listRoutes = function(){
	return routesArray;
}

exports.addToRoutes = function(p, s){
	var routeId = findRoute(p,s);
	console.log("Route ID = " + routeId)
}

var findRoute = function(p, s, cb){
	for(i=0;i<routesArray.length;i++){
		if (routesArray[i][1] = 23){ // Hard-coded to single tech
			console.log(routesArray[i][0])
			return routesArray[i][0];
		}
	}
}