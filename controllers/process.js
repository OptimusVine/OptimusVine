var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var Process = mongoose.model('Process')
var Item = mongoose.model('Item')

var getProcessItems = function(req, res, next){
    console.log(req.p)
    var a = []
    a.push(req.p.stateName)
    if(req.p.children.length>0){
        console.log("Also searching for children")
        req.p.children.forEach(function(p){
            console.log(p)
            a.push(p.stateName)
        })

    }
         console.log(a)   
    Item.find({'plmItem.details.workflowState.stateName':{$in: a}}, function(err, results){
        console.log(results.length)
        res.send(results)
    })
  //  res.send("HERE")
}

var postProcess = function(req, res, next){
    if(req.body){
        console.log(req.body)
        if(req.body.action == "New"){
            if(req.body.stateName){
                console.log("Received Request to Create NEW process")
                var p = new Process(req.body)
                p.save()
                console.log(p)
            } else {
                res.send({error:"No StateName"})
            }

        } else if (req.body.action == "Add Child"){
            console.log("Received Request to Add Child to Existing Process")
            var r = req.body
            var a = [r.mainProcess._id, r.process1._id]
            
            Process.find({'_id':{$in:a}}, function(err, results){
                console.log(results)
                if(results){
                    if(results.length != 2){
                        var e = "Unable to find both processes in DB"
                        console.lob(e)
                        res.send({error:e})
                        }                
                    if(results[0]._id == r.mainProcess._id){
                        addChildToDb(results[0], results[1])
                        .then(function(p){
                            res.send(p)})
                        .catch(function(p){
                            res.send({error:"ERROR on ADD CHILD"})})
                    } else {            
                        addChildToDb(results[1], results[0])
                        .then(function(p){
                            res.send(p)})
                        .catch(function(p){
                            res.send({error:"ERROR on ADD CHILD"})})
                    }
                } else {
                    var e = "Unable to find both processes in DB"
                        console.lob(e)
                        res.send({error:e})
                }
            })
        } else {
            res.send({status: "Unknown Action"})
        }
    } else {
        res.send({status: "No req.body"})
    }
    

}

var addChildToDb = function(parent, child, res){
    return new Promise(function(resolve, reject){
        if(parent.children.indexOf(child._id)<0){
            parent.children.push(child)
            parent.save(function(err, res){
                if (err){reject(parent)}
                resolve(res)
            })
        } else {
            console.log("child already exists on record")
            reject(parent)
        }
    })
}

var getProcesses = function(req, res, next){
	Process.find().populate("children").populate("workspace").exec(function(err, workflows){
		res.send(workflows)
	})
}

var getProcessCounts = function(req, res, next){
    updateProcessCounts().then(function(r){
        res.json({message:"OK"})
    })
    
    
}

var updateProcessCounts = function(){
    var a = []
    return new Promise(function(resolve, reject){
    Item.find(function(err, items){
        Process.find().populate("children").populate("workspace").exec(function(err, processes){
            for(i=0; i<processes.length; i++){
                processes[i].count = 0
            }
            for(i=0; i<items.length;i++){
                var state = items[i].plmItem.details.workflowState.stateName
        //        console.log(state)
                var pos = processes.map(function(e) { return e.stateName; }).indexOf(state);
                processes[pos].count++
            }
            for(i=0; i<processes.length; i++){
                processes[i].countChildren = 0
                for(j=0;j<processes[i].children.length;j++){
                    processes[i].countChildren += processes[i].children[j].count
                }
                processes[i].save()
            }
           })
        })
    })
}

var getOptions = function(req, res, next){
    var options = [
        {action: "New"},
        {action: "Add Child"}
        ]
    res.json(options)
    
}

module.exports = {
    postProcess: postProcess,
    getProcesses: getProcesses,
    getOptions: getOptions,
    getCounts: getProcessCounts,
    getProcessItems: getProcessItems,
    updateProcessCounts: updateProcessCounts
}