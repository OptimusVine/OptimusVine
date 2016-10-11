var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');
var Promise = require('bluebird');

var Route = mongoose.model('Route') 
var Site = mongoose.model('Site')

var availableRoutes = []

// SENDS all routes back to the brower
exports.getRoutes = function(req, res, next){
	Route.find(function(err, routes){
		res.json(routes)
	})
}

// calling this will pull all OPEN routes, 
//			if there are none open then it should create a new route
// 			if there are open routes, it will then search all sites for a ZIP MATCH
// 			if there are no ZIP matches, it will search for nearby zip codes
exports.suggestRoutes = function(req, res){
	if(!req){console.log("No Request exists!")}
	var query = Route.find({"status":"Open"});
	query.exec(function(err, routes){
		if (err){return next(err); }
		if (!routes) {return next(new Error('can\'t find routes'));}
		console.log(routes.length + " Open routes found... Attempting match to " + req.site.address.zip)
		findSimilarSites(req, routes, res)
		return next();
	})


}

function doSomething() {
  return new Promise(function(resolve) {
    var value = 42;
    resolve(value);
  });
}

var findOpenRoutes = function(req, res){
	return new Promise(function(resolve){
	if(!req){console.log("No Request exists!")}
	var query = Route.find({"status":"Open"});
	query.exec(function(err, routes){
		if (err){return next(err); }
		if (!routes) {return next(new Error('can\'t find routes'));}
		console.log(routes.length + " Open routes found... Attempting match to " + req.site.address.zip)
		console.log("")
		resolve(routes)
		})
	})
}

exports.findOptimalRoute = function(req, res){
	findOpenRoutes(req, res).then(function(routes){
		return processRoutes(req, res, routes)
	}).then(function(availableRoutes){
		return getMatchingRoutes(req, res, availableRoutes)
	}).then(function(matchingRoutes){
		offerRoutes(req, res, matchingRoutes)	
	})
}

var offerRoutes = function(req, res, matchingRoutes){
	console.log("Matching Routes:")
	console.log(matchingRoutes)
	res.send(matchingRoutes);
}

var getMatchingRoutes = function(req, res, availableRoutes){
		return new Promise(function(resolve){
		console.log("availableRoutes:")
		console.log(availableRoutes)
		var matchingRoutes = availableRoutes
	resolve( matchingRoutes)
	})
}

var processRoutes = function(req, res, routes){
	return new Promise(function(resolve) {
		var availableRoutes = [];
		var countSites = 0;
		var sitesFound = 0
		var id;

		for(i=0; i<routes.length; i++){
			for(j=0; j<routes[i].sites.length; j++){
				countSites++
			}
		}

		for(i=0; i<routes.length; i++){
			console.log("Examining Route: " + routes[i].name)
			for(j=0; j<routes[i].sites.length; j++){
				matchRoute(req, routes, i, j).then(function(route){
						console.log(route)
						availableRoutes.push(route)
						console.log(availableRoutes)
						sitesFound++
						if(sitesFound == countSites){
							console.log("Full of Sites")
							console.log(availableRoutes)
							resolve(availableRoutes)
						} 
					}).catch(function(err){
						console.log(err)
						sitesFound++
						if(sitesFound == countSites){
							console.log("Full of Sites")
							console.log(availableRoutes)
							resolve(availableRoutes)
						} 
					})
			} // cycling through sites in each route
		}	// cycling through each route
		console.log("")
	})
}

// No idea why this is called, instead of calling cycleRoutes directly
var findSimilarSites = function(req, routes, res){
		cycleRoutes(req, res, routes)
		}

// Goes through EACH route
// THEN through EACH site in each route
// THEN attemps to match the site to a route via a different function
// 		If a match is returned to this function, it will push into "available routes"
var cycleRoutes = function(req, res, routes){
	return new Promise(function(resolve) {
	for(i=0; i<routes.length; i++){
			for(j=0; j<routes[i].sites.length; j++){				
				getMatchingRoutes(req, routes, i, j).then(function(route){
					if(route){console.log("Route Match : " + route)
						res.send("This can be added to Route " + route._id)
					availableRoutes.push(route)
					}
				})
			} // cycling through sites in each route
		}
		resolve();
	})
}

// Two sites are here --- One is pushed from a diff functoin, one is in the request
// Attempts to find a route with a matching Zip Code
// IF the site exists in the route, rejects out
// THEN compares the site pushed into function to the site requested
var matchRoute = function(req, routes, i, j){
	return new Promise(function(resolve, reject) {
		
			var id = routes[i].sites[j]
				if(id.equals(req.site._id)){ 
					console.log("*** Error: Site already in Route ***")
					reject(new Error(id + " : Site already in Route"))
					}
				else {    
					var query = Site.findById(id);
					query.exec(function(err, site){
						if (err){ console.log(err); reject(fail) }
						if (!site) {console.log("can't find anything"); reject(fail) }
					}).then( function(site){
						if(site){
							if(req.site.address.zip == site.address.zip){
							console.log("We have a match at zip: " + site.address.zip)
							console.log("Route Number : " + routes[i].name)	
								resolve(routes[i])
							} else {
							console.log(site.address.zip + " : This zip is not a match")
							reject(new Error("Not a Zip Match"))
								// If the Zip code does not match, does it need to do anything?
								}
						}
					})
				} // ELSE - when it doesn't find itself	
				
			//	console.log(routes[i].sites[j])
			})
}

exports.setScheduleDate = function(req, res, next){
	console.log(req.Result)
	console.log(req.date)
	req.Result.scheduleDate = req.date;
	req.Result.save(function(err, route){
		for(i=0;i<route.sites.length;i++){
			var query = Site.findById(route.sites[i])
			query.exec(function(err, site){
				if(site.nextDate > req.Result.scheduleDate){
					console.log("Scheduled to be out sooner")
				} else {
					site.nextDate = req.Result.scheduleDate;
					site.save()
				}
			})
		}
	})
	res.send(req.Result)

}

exports.getDate = function(req, res, next){
	res.send(req.Result.scheduleDate)
}

// A site and a route ID are passed. The site is added to the route
exports.addSiteToRoute = function(req, res, next){
	var site = new Site({id: 1, name: "Warehouse"});
	Route.findOne(function(err, route){
		console.log("Found route : " + route)
		req.site = site;
		if(route.addSite(req)){
			res.send(site + " has been added to " + route)
		}
	})
}


