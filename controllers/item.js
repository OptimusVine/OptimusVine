var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose')

var PLM_map = require('../config/PLM_map')
var list = PLM_map.list

var plm = require('../middlewares/fusion_lifecycle/workspaces')

var Item = mongoose.model('Item')

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

var pullFromPLMbyType = function(req, res){
//    console.log(req.type)
//    console.log(list)
    var pos = list.map(function(e) { return e.type; }).indexOf(req.type);
//    console.log(pos)
    if(pos > -1){
        plm.getItems(list[pos].workspace).then(function(){
            res.send('doing a fresh pull of ' + list[pos].type)
        }).catch(function(){
            var m = {
                message: 'Error Pulling Items from PLM'

            }
            res.send(m)
        })
    }
}

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

module.exports = {
    examineItems: examineItems,
    getItems: getItems,
    getItemById: getItemById,
    getItemsByType: getItemsByType,
    pullFromPLMbyType: pullFromPLMbyType,
    updateWorkspaces: updateWorkspaces
}