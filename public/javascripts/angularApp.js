var app = angular.module('fromScratch', ['ui.router']);
 

  // =========================================================================
  // FACTORIES ===============================================================
  // =========================================================================

app.factory('works', ['$http', function($http){
	var o = {
		works: []
	}

	o.getAll = function(){
		return $http.get('/works').success(function(data){
			angular.copy(data, o.works);
		})
	}

	o.get = function(id) {
		return $http.get('/works/' + id).then(function(res){
			return res.data;
		})
	}

	return o;
}])

app.factory('work', ['$http', function($http){
	o = {
		work: []
	}

	return o;
}])

app.factory('wines', ['$http', function($http){
	var o = {
		wines: []
	}

	o.getAll = function(){
		return $http.get('/wines').success(function(data){
			angular.copy(data, o.wines);
		})
	}

	o.get = function(id) {
		return $http.get('/wines/' + id).then(function(res){
			return res.data;
		})
	}

	return o;
}])

app.factory('wine', ['$http', function($http){
	o = {
		wine: []
	}

	return o;
}])

app.factory('sites', ['$http', function($http){
	var o = {
		sites: []
	}

	o.getAll = function(){
		return $http.get('/sites').success(function(data){
			angular.copy(data, o.sites);
		})
	}

	o.get = function(id) {
		return $http.get('/sites/' + id).then(function(res){
			return res.data;
		})
	}

	return o;
}])

app.factory('site', ['$http', function($http){
	o = {
		site: []
	}

	return o;
}])

app.factory('routes', ['$http', function($http){
	var o = {
		routes: []
	}

	o.getAll = function(){
		return $http.get('/routes').success(function(data){
			angular.copy(data, o.routes);
		})
	}

	o.get = function(id) {
		return $http.get('/routes/' + id).then(function(res){
			return res.data;
		})
	}

	return o;
}])

app.factory('route', ['$http', function($http){
	o = {
		route: []
	}

	return o;
}])

app.factory('todos', ['$http', function($http){
	var o = {
		todos: []
	}

	o.getAll = function(){
		return $http.get('/todos').success(function(data){
			angular.copy(data, o.todos);
		})
	}

	o.get = function(id) {
		return $http.get('/todos/' + id).then(function(res){
			return res.data;
		})
	}

	o.pullUpdate = function(id){
		return $http.get('/todos/' + id + '/update').then(function(res){
			return res.data;
		})
	}

	o.pullIncomplete = function(id){
		return $http.get('/todos/incomplete/pull').then(function(res){
			return res.data;
		})
	}

	o.refreshIncomplete = function(id){
		return $http.get('/todos/incomplete/refresh').then(function(res){
			return res.data;
		})
	}

	o.complete = function(id){
		return $http.get('/todos/' + id + '/complete').then(function(res){
			return res.data;
		})
	}

	o.assignToDo = function(asanaId, todoId){
		return $http.put('/todos/' + todoId + '/assign/' + asanaId).then(function(res){
			if(!res.data.asana_assignee){
				return $http.get('/todos/' + todoId).then(function(res){
					return res.data
					})
			} else{
			console.log("Received from Internal API: " + res.data.asana_assignee.name)
			return res.data;
			}
		})
	}

	o.addToDo = function(t){
		return $http.post('/todos', t).then(function(res){
			if(res.data.name){
				o.todos.push(res.data)
				console.log(res.data)
				return 
			} else {
				console.log("No name exists in response")
			}
		})
	}

	return o;
}])

app.factory('todo', ['$http', function($http){
	o = {
		todo: []
	}

	return o;
}])

  // =========================================================================
  // CONTROLLERS =============================================================
  // =========================================================================

  app.controller('MainCtrl', [
  	'$scope',
  	'$state',
  	function($scope, $state){
  		$scope.test = "The world exists";
  	}])

  app.controller('SiteCtrl', [
  	'$scope',
  	'$state',
  	'sites',
  	'site',
  	function($scope, $state, sites, site){
  		$scope.test = "The world exists";
  		$scope.sites = sites.sites
  		if(site){$scope.site = site};
}])

    app.controller('TodoCtrl', [
  	'$scope',
  	'$state',
  	'todos',
  	'todo',
  	function($scope, $state, todos, todo){

  		$scope.users = [{"name": "Kjiel Carlson", "asanaId":10363492364586},
						{"name": "Adam S", "asanaId":10363492364586},
						{"name": "Martin L", "asanaId":10363492364586}]

  		$scope.test = "The world exists";
  		$scope.todos = todos.todos
  		if(todo){$scope.todo = todo};

  		$scope.forAssignment = false;
  		$scope.newTodo = false;

  		$scope.showComplete = false;

  		$scope.reloadRoute = function() {
   			$state.reload();
   		//	$scope.lastUpdate = false;
		//	$scope.lastRefresh = false;   
		}

  		$scope.changeShowComplete = function(){
  			$scope.showComplete = !$scope.showComplete
  		}

  		$scope.addToDo = function(){
  			if($scope.name === '' | $scope.summary === ''){ return; }
  			var tempToDo = {
  				name: $scope.name,
  				summary: $scope.summary,
  				assignee: $scope.assignee
  			}
  			todos.addToDo(tempToDo).then(function(data){

  			})
  			console.log(tempToDo)
  			$scope.newTodo = false
  		}

		$scope.refreshIncomplete = function(){
			todos.refreshIncomplete().then(function(){
				$scope.lastRefresh = Date.now()
			})
		}

  		$scope.startNewTodo = function(){
  			$scope.newTodo = true
  		}

  		$scope.pullIncomplete = function(){
  			todos.pullIncomplete().then(function(){
  				$scope.lastUpdate = Date.now()
  			})  			
  		}

  		$scope.complete = function(todoId){
  			todos.complete(todoId).then(function(){

  			})
  		}

  		$scope.pleaseAssign = function(){
  			$scope.forAssignment = true
  		}

  		$scope.pullUpdate = function(t){
  			todos.pullUpdate(t._id).then(function(data){
  				$scope.todo = data;
  			})
  		}

  		$scope.assignToDo = function(todoId, choice){
  			console.log("choice : " + choice);
  			todos.assignToDo(choice, todoId).then(function(data){
  				console.log("Last Stop: " + data.asana_assignee.name)
  				$scope.forAssignment = false
  				$scope.todo = data
  			})
  		}

  	}])

  app.controller('RouteCtrl', [
  	'$scope',
  	'$state',
  	'routes',
  	'route',
  	function($scope, $state, routes, route){
  		$scope.test = "The world exists";
  		$scope.routes = routes.routes
  		if(route){$scope.route = route};

  	}])

    app.controller('WineCtrl', [
  	'$scope',
  	'$state',
  	'wines',
  	'wine',
  	function($scope, $state, wines, wine){
  		$scope.test = "The world exists";
  		$scope.wines = wines.wines
  		if(wine){$scope.wine = wine};

  	}])

  	 app.controller('WorkCtrl', [
  	'$scope',
  	'$state',
  	'works',
  	'work',
  	function($scope, $state, works, work){
  		$scope.test = "The world exists";
  		$scope.works = works.works
  		if(work){$scope.work = work};

  	}])

  // =========================================================================
  // ROUTING / STATES ========================================================
  // =========================================================================

  app.config([
  	'$stateProvider',
  	'$urlRouterProvider',
  	function($stateProvider, $urlRouterProvider){

  		$stateProvider

  		.state('works', {
			url: '/works', 
			templateUrl: '/works.html',
			controller: 'WorkCtrl',
			resolve: {
    		worksPromise: ['works', function(works){
    			return works.getAll()
    			}]
    		}
		})

  		.state('wines', {
			url: '/wines', 
			templateUrl: '/wines.html',
			controller: 'WineCtrl',
			resolve: {
    		sitesPromise: ['wines', function(wines){
    			return wines.getAll()
    			}]
    		}
		})

		 .state('routes', {
			url: '/routes', 
			templateUrl: '/routes.html',
			controller: 'RouteCtrl',
			resolve: {
    		routesPromise: ['routes', function(routes){
    			return routes.getAll()
    			}]
    		}
		})

		.state('route', {
	    	url: '/routes/{id}',
	    	templateUrl: '/route.html',
	    	controller: 'RouteCtrl',
	    	resolve: {
	    		route: ['$stateParams', 'routes', function($stateParams, routes){
	    			return routes.get($stateParams.id);
	    		}], 
	    		routePromise: ['routes', function(routes){
	    			return [routes.getAll()];
	    		}]
	    	}
	    })

  		.state('sites', {
			url: '/sites', 
			templateUrl: '/sites.html',
			controller: 'SiteCtrl',
			resolve: {
    		sitesPromise: ['sites', function(sites){
    			return sites.getAll()
    			}]
    		}
		})

		.state('site', {
	    	url: '/sites/{id}',
	    	templateUrl: '/site.html',
	    	controller: 'SiteCtrl',
	    	resolve: {
	    		site: ['$stateParams', 'sites', function($stateParams, sites){
	    			return sites.get($stateParams.id);
	    		}], 
	    		sitePromise: ['sites', function(sites){
	    			return [sites.getAll()];
	    		}]
	    	}
	    })

	    .state('todos', {
			url: '/todos', 
			templateUrl: '/todos.html',
			controller: 'TodoCtrl',
			resolve: {
    		sitesPromise: ['todos', function(todos){
    			return todos.getAll()
    			}]
    		}
		})

		.state('todo', {
	    	url: '/todos/{id}',
	    	templateUrl: '/todo.html',
	    	controller: 'TodoCtrl',
	    	resolve: {
	    		todo: ['$stateParams', 'todos', function($stateParams, todos){
	    			return todos.get($stateParams.id);
	    		}], 
	    		todoPromise: ['todos', function(todos){
	    			return [todos.getAll()];
	    		}]
	    	}
	    })

	    .state('home', {
	      url: '/home',
	      templateUrl: '/home.html',
	      controller: 'MainCtrl'
	    })


		



  $urlRouterProvider.otherwise('home');

  	}]) // End State Configs

  // =========================================================================
  // APP CONFIG ==============================================================
  // =========================================================================

