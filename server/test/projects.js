'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");

describe('PROJECTS MODULE', function(){
  describe('requests', function(){
    this.timeout(10000);
    it('GET /api/projects respond with json', function() {
      return helpers.request
        .get('/api/projects')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
        })
    });


    it('GET /api/projects/project respond with json', function() {
      return helpers.request
        .get('/api/projects/project?project_id=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (Object.keys(res.body).length == 0) throw new Error("Empty result");
          if (Object.keys(res.body).length != 8) throw new Error("Number of fields must be 8");
        })
        .then(response => {
        })
    });


    it('POST /api/projects response should contain project id', function() {
      var data = {
                  project_name: "project_name"+Date.now(),
                  platform: "platform"+Date.now(),
                  parameter1: "parameter1"+Date.now(),
                  parameter2: "parameter2"+Date.now(),
                  parameter3: "parameter3"+Date.now(),
                  parameter4: "parameter4"+Date.now(),
                  project_languages: [{
                    project_id: 0,
                    language_id: 1,
                    code: "testcode"
                  }]
                };
      return helpers.request
        .post('/api/projects')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.data == "undefined") throw new Error("Project id not returned");
          if (typeof res.body.data.project_id == "undefined") throw new Error("Project id not returned");
          if (isNaN(res.body.data.project_id)) throw new Error("Project id is not numeric");
        })
        .then(response => {
          db.query("DELETE FROM project_languages WHERE project_id=?",[response.body.data.project_id],function(a,b,c){
            db.query("DELETE FROM project_strings WHERE project_id=?",[response.body.data.project_id],function(a,b,c){
              db.query("DELETE FROM projects WHERE project_id=?",[response.body.data.project_id],function(a,b,c){});
            });
          });
        })
    });


    it('PUT /api/projects response should contain "success" field', function() {
      var data = {
                  project_id: 1,
                  project_name: "project_name"+Date.now(),
                  platform: "platform"+Date.now(),
                  parameter1: "parameter1"+Date.now(),
                  parameter2: "parameter2"+Date.now(),
                  parameter3: "parameter3"+Date.now(),
                  parameter4: "parameter4"+Date.now(),
                  project_languages: [{
                    project_id: 0,
                    language_id: 1,
                    code: "testcod1"
                  },
                  {
                    project_id: 0,
                    language_id: 2,
                    code: "testcod2"
                  },
                  {
                    project_id: 0,
                    language_id: 3,
                    code: "testcod3"
                  }]
                };
      return helpers.request
        .put('/api/projects')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.success == "undefined") throw new Error("Success field not found");
        })
        .then(response => {
        })
    });

    it('DELETE /api/projects response should contain "success" field', function() {

      return helpers.request
        .delete('/api/projects?ids=0')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.success == "undefined") throw new Error("Success field not found");
        })
        .then(response => {
        })                
    });


    it('DELETE /api/projects number of affected rows must be as espected', function() {
      var data = [], project_ids = [];
      for(var i = 0; i<3;i++)
        data.push({
                  project_name: "project_name"+Date.now()+i,
                  platform: "platform"+Date.now()+i,
                  parameter1: "parameter1"+Date.now()+i,
                  parameter2: "parameter2"+Date.now()+i,
                  parameter3: "parameter3"+Date.now()+i,
                  parameter4: "parameter4"+Date.now()+i,
                  project_languages: [{
                    project_id: 0,
                    language_id: 1,
                    code: "testcode"
                  }]
        });

      return helpers.request.post('/api/projects')
        .set('Accept', 'application/json')
        .type("json")
        .send(data[0])
        .then(response =>{
          project_ids.push(response.body.data.project_id);
          return helpers.request.post('/api/projects')
            .set('Accept', 'application/json')
            .type("json")
            .send(data[1])
            .then(response =>{
              project_ids.push(response.body.data.project_id);
              return helpers.request.post('/api/projects')
              .set('Accept', 'application/json')
              .type("json")
              .send(data[2])
              .then(response =>{
                project_ids.push(response.body.data.project_id);
                return helpers.request
                  .delete('/api/projects?ids='+(project_ids.join(',')))
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .expect(function(res) {
                    if (typeof res.body.error != "undefined") throw new Error(res.body.error);
                    if (typeof res.body.success == "undefined") throw new Error("Success field not found");
                    if (res.body.data.affected_rows != 3) throw new Error("Number of deleted records must be 3");
                  })
                  .then(response => {
                  })                
              });
            });
        });
    });
  });
});