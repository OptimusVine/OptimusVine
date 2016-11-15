var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose')

var PLM_map = require('../config/PLM_map')


var plm = require('../middlewares/fusion_lifecycle/workspaces')

var Item = mongoose.model('Item')
var Workspace = mongoose.model('Workspace')
var Rule = mongoose.model('Rule')

var list 

Workspace.find(function(err, results){
    list = results
})

var getItems = function(req, res){
    Item.find(function(err, results){
        res.json(results)
    })
}

var getItemById = function(req, res, next){
 //   console.log(req.type)
  //  console.log(req.item)
    res.send(req.item)
 }

var getItemsByType = function(req, res, next){
    Item.find({'type':req.type}, function(err, results){
        res.send(results)
    })
 } 




var createTestRule = function(){
    var r = new Rule({
        name: "PR - Released Last",
        rule: {
            goal: "Set Released in NetSuite on Production Runs to zzz",
            how: {
                statement: "If type is PR and Stage is Released in NetSuite",
                items: {
                    types: ['Production Run'],
                },
                stages: ['Released in NetSuite'],
            },
            change: {
                rank: 'zzz'
            }
        }
    })
    r.save(function(err, result){
        if(err){}
        if(result){console.log("NEW RULE! : " + result.name)}
    })
 }
 // createTestRule()



var processRules = function(rule){
                var r = rule
                return new Promise(function(resolve, reject){
            //    console.log(r.name)
            //    console.log(r.rule.goal + "  " + r.rule.how.statement)
                if(r.rule.how.items){
                    var qI = {}
                    if(r.rule.how.items.types){
                        qI.type = {$in: r.rule.how.items.types}
                    }
                    if(r.rule.how.stages){
                        qI['plmItem.details.workflowState.stateName'] = {$in:r.rule.how.stages}
                    }

                    var u = {}
                    if(r.rule.change)
                    rank = r.rule.change.rank
                    var qU = {$set: {rank}}
                //    console.log(qI)
                //    console.log(qU)
                    Item.update(qI, qU, {multi: true},function(err, results){
                    //    console.log(err)
                //        console.log(results)
                   //     if(results[0]){
                    //        console.log(results[0])
                    //    }
                    })
                }
        })
 }

var cycleRules = function(req, res){
    Rule.find(function(err, rules){
        if(rules && rules[0]){
            // ENTER FOR LOOP FOR EACH Rule
            for(i=0;i<rules.length;i++){
                processRules(rules[i])
            }
        }
    })
 }

cycleRules()

var examineItems = function(req, res){
    console.log("Examine Items of Type: " + req.type)
    
    Item.find({'type':req.type}, function(err, results){
        results.forEach(function(r){
            if(r.plmItem.details){
                console.log(r.plmItem.metaDetails)
            }
        })
    })


    res.send("OK")
}



var updateWorkspaces = function(req, res){
	plm.receiveWorkspaces()
}

var changeRank = function(req, res){
    console.log(req.body)
    if(!req.item || !req.body || !req.body.rank){
        res.send("Request Failed")
    } else {
        req.item.rank = req.body.rank
        console.log(req.item.rank)
        req.item.save(function(err, result){
            if(err){
                console.log(err)
                res.send("Error on Save")
            } else {
                res.send(result)
            }
        })
    }
}

var pullFromPLMbyType = function(t){
//    console.log(req.type)
    console.log(list)
    var pos = list.map(function(e) { return e.label; }).indexOf(t);
//    console.log(pos)
    if(pos > -1){
        var m
        plm.getItems(list[pos].id).then(function(){
            var n = Date.now()
            Workspace.update({id:list[pos].id},{$set:{lastUpdate: n}}, function(err, result){
                if(result){
                    console.log("workspace updated to reflect recent update")
                }
            })
        }).catch(function(){
            m = {
                message: 'Error Pulling Items from PLM'
            }
            return(m)
        })
    } else {
        console.log('Cannot Find Workspace in [pullFromPLMbyType]')
    }
}

remotePullByType = function(req, res){
    if(req.type){
        pullFromPLMbyType(req.type)
        res.send("Pulling " + req.type)
    } else {
        res.send({message:"No Type"})
    }
}

pullAllFromPLM = function(req, res){
    console.log(list)
    res.send({message:"Pulling ALL types"})
    list.forEach(function(t){
        pullFromPLMbyType(t.label)
    })
}

module.exports = {
    changeRank: changeRank,
    examineItems: examineItems,
    getItems: getItems,
    getItemById: getItemById,
    getItemsByType: getItemsByType,
    pullFromPLMbyType: pullFromPLMbyType,
    pullAllFromPLM: pullAllFromPLM,
    remotePullByType: remotePullByType,
    updateWorkspaces: updateWorkspaces
}