var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var Site = mongoose.model('Site')
var Route = mongoose.model('Route') 

exports.getSites = function(req, res, next){
	Site.find(function(err, sites){
				res.json(sites)
	})
}

exports.getDate = function(req, res, next){
	Route.find({_id:req.site.routes, status:"Open"}, function(err, routes){
		if(routes.length > 1) {console.log("THIS IS SCHEDULED ON MULTIPLE DATES")}
		if(routes.length < 1) {console.log("This is not yet scheduled")} 
			else {
				res.send(routes[0].scheduleDate)
			}
	})

}

exports.addSite = function(req, res, next){
	p = {id: 1,
		name: "Warehouse"
		}

	var site = new Site(p)

	site.save(function(err, result){
		res.json(result);
	});
}

// A site and a route ID are passed. The site is added to the route
exports.addSiteToRoute = function(req, res, next){
	if(req.Result.sites.indexOf(req.site._id) >= 0){
		console.log(req.Result.sites.indexOf(req.site._id))
		console.log("Already exists in Route")
		res.write("Already exists in Route " + req.Result);
		res.end();
		}
		else { 
			req.Result.sites.push(req.site)
			req.Result.save(function(err, route){
				if(err){return err}
				if(!route){console.log("No Route Found when Saving")}
				req.site.routes.push(route)
				console.log(req.site)
			})
			res.json(req.Result)
		}
}