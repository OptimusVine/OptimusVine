// WHen an Item is pass to this, it should return the workspace ID

var mongoose = require('mongoose')

var Workspace = mongoose.model('Workspace')
var w

const list = [
    {type: 'Wine', workspace: 98},
    {type: 'Sourcing', workspace: 92},
    {type: 'Production Runs', workspace: 93},
    {type: 'Transportation', workspace: 118}

]

module.exports = {
    list: list,
}