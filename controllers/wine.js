var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var FL = require('../middlewares/fusion_lifecycle/workspaces')
var FLitem = require('../middlewares/fusion_lifecycle/item')

var Wine = mongoose.model('Item') 
var Sourcing = mongoose.model('Sourcing') 
var Production = mongoose.model('Production') 
var Process = mongoose.model('Process') 
var Workspace = mongoose.model('Workspace') 
var Item = mongoose.model('Item') 

var processController = require('./process')

var getProductionWorkflowHistory = function(req, res, next){
	FLitem.getProductionWorkflowHistory(req, res)
}

var getItemWorkflowHistory = function(req, res, next){
	FLitem.getItemWorkflowHistory(req, res)
}

var getWorkspaces = function(req, res, next){
	Workspace.find(function(err, workspaces){
		res.send(workspaces)
	})
}

var getProcesses = function(req, res, next){
	Process.find().populate("workspace").exec(function(err, workflows){
		res.send(workflows)
	})
}

var getWines = function(req, res, next){
	Wine.find({type:"Wine"}, function(err, wines){
		var count = wines.length
	//	console.log(wines[0])
		processController.updateProcessCounts()
	//	console.log("There are more objects, only printing ONE")
		res.json(wines)
	})
}

var getSourcing = function(req, res){
	Wine.find({type:"Sourcing"}, function(err, sourcings){
		var count = sourcings.length
		console.log(sourcings[0].plmItem.details)

		console.log("There are more objects, only printing ONE")
		res.json(sourcings)
	})
}

var getProductionRuns = function(req, res){
	Production.find(function(err, sourcings){
		var count = sourcings.length
		console.log(sourcings[0].plmItem.details)

		console.log("There are more objects, only printing ONE")
		res.json(sourcings)
	})
}

var showProductionRunsStatus = function(req, res){
	Item.find({"type":"Production Run"},function(err, productions){
		findStateStatus(productions).then(function(statuses){
			res.send(statuses)
		}).catch(function(msg){
			res.send(statuses)
		})
	})
}

var showSourcingStatus = function(req, res){
	Item.find({"type":"Sourcing"},function(err, sourcings){
		findStateStatus(sourcings).then(function(statuses){
			res.send(statuses)
		}).catch(function(msg){
			res.send(statuses)
		})
	})
}

var findStateStatus = function(items){
//	console.log(items[0].plmItem.metaFields)
	WFstates = [];
	return new Promise(function(resolve, reject){
	for(i=0;i<items.length;i++){
			var state = items[i].plmItem.details.workflowState.stateName
		//	console.log(state)
			if(state == "Cancelled" || state == "Closed"){}
				else if(WFstates.length <1 ) {
					checkState(items[i])
					WFstates.push({name:state, count:1})
				} else {
					for(j=0;j<WFstates.length;j++){
						if(WFstates[j].name == state ){
							WFstates[j].count++
							j=WFstates.length
						} else if (WFstates.length -1 == j){
							checkState(items[i])
							WFstates.push({name:state, count:1})
							j=WFstates.length							
						} else {
						// Otherwise cycle back to start, doing nothing
					}
				}
			}
		}
		if(WFstates.length == 0){
			msg = "No States in active status"
			console.log(msg)
			reject(msg)
		} else {
			console.log(WFstates)
			resolve(WFstates)
		}
	})
}

var checkState = function(item){
//	console.log(item.plmItem.details)
	Process.find({"stateId":item.plmItem.details.workflowState.stateId}, function(err, results){
		if(err){
			} else if (results.length>0){
			//	console.log(results)
			console.log("No Workflow State matching this ID : " +  item.plmItem.details.workflowState.stateI)
			} else {
				Workspace.find({"id":item.plmItem.details.workspaceID}, function(err, res){
				//	console.log(res)
					var o = {
					stateName: item.plmItem.details.workflowState.stateName,
					stateId: item.plmItem.details.workflowState.stateId,
					workspace: res[0],
					type: res[0].label,
				}
					var w = new Process(o)
					w.save(function(err, res){
					console.log("saved workflow named: " + res.stateName + " for Workspace : " + res.workspace.name)
					console.log(res)
					})
				})
				
			}
	})
}

var showWinesStatus = function(req, res){
	Item.find({"type":"Wine"},function(err, wines){
		findStateStatus(wines).then(function(statuses){
			res.send(statuses)
		}).catch(function(msg){
			res.send(statuses)
		})
	})
}

var refreshSourcing = function(req, res){
	FL.getItems(92)
}

var refreshWines = function(req, res){
	FL.getItems(98).then(function(r){
		res.json({message:"I built this lazy, pull wines in a minutes"})
	})
}

var refreshProductionRuns = function(req, res){
	FL.getItems(93)
}

var getAuth = function(req, res){
	FL.getItems(92)
}

var addWine = function(req, res, next){
	p = {
		id: 1,
		name: "Kjiel"
		}

	var wine = new Wine(p)

	wine.save(function(err, result){
		res.json(result);
	});
}

module.exports = {
	addWine: addWine,
	getAuth: getAuth,
	getSourcing: getSourcing,
	getItemWorkflowHistory: getItemWorkflowHistory,
	getProductionRuns: getProductionRuns,
	getProductionWorkflowHistory: getProductionWorkflowHistory,
	getWines: getWines,
	getProcesses: getProcesses,
	getWorkspaces: getWorkspaces,
	refreshProductionRuns: refreshProductionRuns,
	refreshSourcing: refreshSourcing,
	refreshWines: refreshWines,
	showWinesStatus, showWinesStatus,
	showSourcingStatus, showSourcingStatus,
	showProductionRunsStatus, showProductionRunsStatus,
}