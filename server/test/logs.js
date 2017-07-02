'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");
const logs = require("../modules/logs.js");
describe('LOGS MODULE', function(){
  it('logs.create returns log id',function(done){
    logs.create("test log",function(error,results){
      if (typeof error != "undefined") done(error);
      if (isNaN(results)) done(new Error("Log id not returned: "+results));
      db.query("DELETE FROM logs WHERE log_id=?",[results],function(a,b,c){});
    })
  });

  it('logs.update returns "success"', function(done){
    var data = {
      log_data: "updated log",
      log_id: 1
    }
    logs.update(data,function(error,results){
      if (typeof error != "undefined") done(error);
      if (results !== "success") done(new Error('"Success" not returned'));
    })
  });

  it('logs.get returns object with results Array', function(done){
    logs.get({page:1,export:false},function(error,results){
      if (typeof error != "undefined") done(error);
      else
      if (!(results.results instanceof Array)) done(new Error('Returns not array'));
    })
  });

  it('logs.getById returns Object', function(done){
    logs.getById(1,function(error,results){
      if (typeof error != "undefined") done(error);
      if (Object.keys(results).length != 4) done(new Error("Number of fields must be 4"));
    })
  });

  it('logs.delete returns "success"', function(done){
    logs.delete('1',function(error,results){
      if (typeof error != "undefined") done(error);
      if (results !== "success") done(new Error('"Success" not returned'));
    })
  });

  describe('requests', function(){
    it('GET /api/logs respond with json', function() {
      var query = "page=1&period=custom&date_from=01/01/2017&date_to=02/01/2017";
      return helpers.request
        .get('/api/logs?'+query)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
        })
    });

    describe('validations', function(){
      it('GET /api/logs period="blabla!" should return validation error', function() {
        var query = "page=1&period=blabla!&date_from=01/01/2017&date_to=02/01/2017";
        return helpers.request
          .get('/api/logs?'+query)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            if (typeof response.body.error == "undefined") throw new Error("Error not thrown");
          })
      });

      it('GET /api/logs date_from="01.01.2017!" should return validation error', function() {
        var query = "page=1&period=blabla&date_from=01/01/2017!&date_to=02/01/2017";
        return helpers.request
          .get('/api/logs?'+query)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            if (typeof response.body.error == "undefined") throw new Error("Error not thrown");
          })
      });

      it('GET /api/logs date_to="02.01.2017!" should return validation error', function() {
        var query = "page=1&period=blabla&date_from=01/01/2017!&date_to=02/01/2017!";
        return helpers.request
          .get('/api/logs?'+query)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            if (typeof response.body.error == "undefined") throw new Error("Error not thrown");
          })
      });
    });

    it('GET /api/logs/export response should contain "success" field',function(){
      this.timeout(20000);
      return helpers.request
        .get('/api/logs/export?period=last-7-days')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.success == "undefined") throw new Error("Success field not found");
        })
        .then(response => {
        })
    });
  });
})