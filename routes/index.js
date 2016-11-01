var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)


var express = require('express');
var router = express.Router();
var passport = require('passport');

var secret = "SECRET"
var expressJWT = require('express-jwt')
var jwt = require('jsonwebtoken')
var auth = expressJWT({secret: secret}).unless({path: ['/']})
 
var mongoose = require('mongoose')
var Route = mongoose.model('Route')
var Site = mongoose.model('Site')
var People = mongoose.model('People')
var Todo = mongoose.model('ToDo')
var Item = mongoose.model('Item')
var Process = mongoose.model('Process')
var Production = mongoose.model('Production')

var itemController = require('../controllers/item')
var peopleController = require('../controllers/people')
var processController = require('../controllers/process')
var routeController = require('../controllers/routes')
var siteController = require('../controllers/sites')
var workController = require('../controllers/work')
var todoController = require('../controllers/todo')
var wineController = require('../controllers/wine')
var communicationController = require('../controllers/communication')

router.get('/', function(req, res, next) {
  res.render('index');
});

// AUTHENTICATION

var signup = function(req, res){
	if(req.body){
		passport.authenticate('local-signup', function(err, user){
			req.user = user.local.email
			console.log(req.user)
			res.send(req.user)
		})(req, res)
	}
}

var login = function(req, res){
	console.log(req.headers)
	if(req.body){
		passport.authenticate('local-login', function(err, user){
			if(err){console.log(err)}
			if(!user){res.status(401).json({status:"Not Found"})}
			if(user){
		//		console.log(user)
				req.user = {'email': user.local.email}
				req.logIn(user, function(err){
					var myToken = jwt.sign(user,secret)
		//			console.log(myToken)
					res.status(200).json({status: 'Login Successful', token: myToken, email: req.user})
				})
			}
		})(req, res)
	}
}

router.route('/signup')
	.post(signup);


router.route('/login')
	.post(login);


router.route('/user')
	.get(function (req, res){
	console.log(req.body)
	if(!req.user){ console.log({user: "No User"}), res.send({user: "No User"})}
	else {
		console.log(req.user)
		res.send(req.user)
		}
	})
	.post(function(){
		console.log("Made it to USER!")
	})



// TESTS

router.get('/test', wineController.getAuth);

// WORKFLOWS

router.route('/processes')
	.get(processController.getProcesses)
	.post(processController.postProcess)
router.route('/processes/options')
	.get(processController.getOptions)
router.route('/processes/counts')
	.get(processController.getCounts)
router.route('/processes/:process')
	.get(processController.getProcessItems)

 
// COMMUNICATION
router.route('/message/sendSlack')
	.get(communicationController.sendMessageSlack)
	.post(communicationController.postMessageSlack)

// WORKSPACES

router.get('/workspaces', wineController.getWorkspaces)




// ITEMS

router.route('/items/:type')
	.get(itemController.getItemsByType)
router.route('/items/:type/:item')
	.get(itemController.getItemById)


// WINES 
// TODO: DEPRECIATE WINES --- TRANSITION TO ITEMS

router.route('/wines')
	.get(wineController.getWines)
router.route('/wines/refresh')
	.get(wineController.refreshWines)
router.route('/wines/status')
	.get(wineController.showWinesStatus)
router.route('/wines/status/:item')
	.get(wineController.getItemWorkflowHistory)

// SOURCING
// TODO: DEPRECIATE SOURCINGS --- TRANSITION TO ITEMS

router.route('/sourcings')
	.get(wineController.getSourcing)
router.route('/sourcings/refresh')
	.get(wineController.refreshSourcing)
router.route('/sourcings/status')
	.get(wineController.showSourcingStatus)

// PRODUCTION RUNS
// TODO: DEPRECIATE SOURCINGS --- TRANSITION TO ITEMS

router.route('/productionRuns')
	.get(wineController.getProductionRuns)
router.route('/productionRuns/refresh')
	.get(wineController.refreshProductionRuns)
router.route('/productionRuns/status')
	.get(wineController.showProductionRunsStatus)
router.route('/productionRuns/status/:production')
	.get(wineController.getProductionWorkflowHistory)



// WORKS

router.route('/works')
	.get(workController.getWorks)
	.post(workController.addWork)

// PEOPLE

router.get('/people', peopleController.getPeople);
router.get('/people/withAsana', peopleController.getPeopleWithAsana);
router.get('/people/withSlack', peopleController.getPeopleWithSlack);
router.route('/people/:person')
	.get(function(req, res, next){
		console.log(req.person)
			res.json(req.person)
		})

// ROUTES

router.get('/routes', routeController.getRoutes);
router.route('/routes/:route')
	.get(function(req, res, next){
		console.log(req.Result)
			res.json(req.Result)
		})
router.route('/routes/:route/date')
	.get(routeController.getDate)
router.route('/routes/:route/setScheduleDate/:date')
	.get(routeController.setScheduleDate)

	//.post(routeController.addRoute) // This has not been tested

// SITES

router.get('/sites', siteController.getSites);
router.route('/sites/:sites')
	.get(function(req, res, next){
		console.log(req.site)
			res.json(req.site)
		})
router.route('/sites/:sites/findOptimal')
	.get(routeController.findOptimalRoute)
router.route('/sites/:sites/addSiteToRoute/:route')
	.get(siteController.addSiteToRoute)
router.route('/sites/:sites/date')
	.get(siteController.getDate)

// TODOS

router.route('/todos')
	.get(auth, todoController.getTodos) // Service Exists
	.post(todoController.postTodos)
router.get('/todos/pull', todoController.pullTodos)

router.route('/todos/Incomplete/pull')
	.get(todoController.pullIncompleteTasks)

router.route('/todos/Incomplete/refresh')
	.get(todoController.updateIncompleteTasks)

router.route('/todos/:todo')
	.get(function(req, res, next){
		console.log(req.todo)
			res.json(req.todo)
		})
router.route('/todos/:todo/update')
	.get(todoController.pullFullTask)

router.route('/todos/:todo/complete')
	.get(todoController.completeToDo)

router.route('/todos/pull/myTasks')
	.get(todoController.getMyTasks)

router.route('/todos/pull/incomplete')
	.get(todoController.pullIncompleteTasks)


router.route('/todos/:todo/assign/:assignee')
	.put(todoController.todoPutByIdAssign)

// PARAMETERS
 
router.param('item', function(req, res, next, id){
	var query = Item.findById(id);
	query.exec(function(err, item){
		if (err){return next(err); }
		if (!item) {return next(new Error('can\'t find item'));}
		req.item = item;
		return next();
	})
})

router.param('type', function(req, res, next, type){
	//	console.log("looking for type : ")
		req.type = type;
		return next()
})

router.param('route', function(req, res, next, id){
	var query = Route.findById(id);
	query.exec(function(err, route){
		if (err){ return next(err); }
		if (!route) {return next(new Error('can\'t find route')); }
		req.Result = route;
		return next()
	})
})

router.param('sites', function(req, res, next, id){
	var query = Site.findById(id);
	query.exec(function(err, site){
		if (err){return next(err); }
		if (!site) {return next(new Error('can\'t find site'));}
		req.site = site;
		return next();
	})
})

router.param('production', function(req, res, next, id){
	var query = Production.findById(id);
	query.exec(function(err, production){
		if (err){return next(err); }
		if (!production) {return next(new Error('can\'t find production'));}
		req.production = production;
		return next();
	})
})

router.param('person', function(req, res, next, id){
	var query = People.findById(id);
	query.exec(function(err, person){
		if (err){return next(err); }
		if (!person) {return next(new Error('can\'t find person'));}
		req.person = person;
		return next();
	})
})

router.param('process', function(req, res, next, id){
	var query = Process.findById(id).populate('children');
	query.exec(function(err, p){
		if (err){return next(err); }
		if (!p) {return next(new Error('can\'t find process'));}
		req.p = p;
		return next();
	})
})

router.param('todo', function(req, res, next, id){
	var query = Todo.findById(id);
	query.exec(function(err, todo){
		if (err){return next(err); }
		if (!todo) {return next(new Error('can\'t find todo'));}
		req.todo = todo;
		return next();
	})
})

router.param('assignee', function(req, res, next, assignee){
	req.assignee = assignee;
		return next()
})

router.param('date', function(req, res, next, id){
	var year = id.substring(0,4);
	var month = id.substring(4,6);
	var day = id.substring(6,8)
	var date =  new Date(year, month -1, day)
	console.log(date)
	req.date = date;
	return next()
})

module.exports = router;