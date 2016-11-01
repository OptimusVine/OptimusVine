process.env.NODE_ENV = 'test'

var mongoose = require('mongoose')

var app = require('../app')
var Item = mongoose.model('Item')
var Work = mongoose.model('Work')
// var Items = require('../models/items')

// var data = require('./data_loader')

var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = chai.expect;
chai.should()
chai.use(chaiHttp)

var assert = require('assert')
    http = require('http')

describe('/', function(){
    it('should return 200', function(done){
        http.get('http://localhost:5000', function(res){
            assert.equal(200, res.statusCode);
            done()
        })
    })
})

describe('Wines', function(){

    Item.collection.drop()
    beforeEach(function(done){
        var newWine = new Item({
            type: 'Wine',
            description: 'Optimus Vine',
            plmItem: {
                details: {
                    workflowState: {
                        stateName: "Concept"
                    }
                }
            }
        })
        newWine.save(function(err){
            done()
        })
     })

    it('should list ALL wines on /wines GET', function(done){
        chai.request(app)
            .get('/wines')
            .end(function(err, res){
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.a('array')
                res.body[0].should.have.property('type')
                res.body[0].should.have.property('description')
                res.body[0].description.should.equal('Optimus Vine')
                res.body[0].should.have.property('plmItem')
                done()
            })
     })

})

describe('Todos API', function(){
    it('should return Status 401 with NO AUTH on /todos GET', function(done){
        chai.request(app)
            .get('/todos')
            .end(function(err, res){
                res.should.have.status(401)
                done()
            })
      })

    it('should return only INCOMPLETE tasks on /todos/pull/incomplete', function(done){
        chai.request(app)
            .get('/todos/pull/incomplete')
            .end(function(err, res){
                res.should.have.status(200)
                res.should.be.json
                res.body.should.have.property('message')
                res.body.should.have.property('count')
                expect(res.body.count).to.be.at.least(2)
                done()
            })
      })

})

describe('Items API', function(){
    it('should list ALL wines on /items/WINE GET', function(done){
        chai.request(app)
            .get('/items/Wine')
            .end(function(err, res){
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.a('array')
                res.body[0].should.have.property('type')
                res.body[0].should.have.property('description')
                res.body[0].should.have.property('plmItem')
                res.body[0].description.should.equal('Optimus Vine')
                res.body[0].type.should.equal('Wine')
                done()
            })
        })

    it('should list a SINGLE item on /items/<type>/<id> GET', function(done) {
        var newWine = new Item({
            type: 'Wine',
            description: 'Slapsquatch',
            plmItem: {
                details: {
                    workflowState: {
                        stateName: "Concept"
                    }
                }
            }
        })
        newWine.save(function(err, data) {
        chai.request(app)
            .get('/items/WINE/'+data._id)
            .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('description');
            res.body.should.have.property('type');
            res.body.description.should.equal('Slapsquatch');
       //     res.body._id.should.equal(data._id);
            done();
            });
        });
     });



    it('should return 404 on  /items/<type>/123 POST', function(done){
        var newWine = new Item({
            type: 'Wine',
            description: 'Missy Piggy',
            plmItem: {
                details: {
                    workflowState: {
                        stateName: "Concept"
                    }
                }
            }
        })
        newWine.save(function(err, data) {
        chai.request(app)
            .post('/items/WINE/'+data._id, {})
            .end(function(err, res){
            res.should.have.status(404);
            done();
            });
        });
        })

    



})

// describe('Work API', function(){

//     it('should return ALL work on /works GET', function(done){
//         chai.request(app)
//             .get('/works')
//             .end(function(err, res){
//                 res.should.have.status(200)
//                 res.should.be.json
//                 res.body.should.be.a('array')
//             })
//     })
// })
