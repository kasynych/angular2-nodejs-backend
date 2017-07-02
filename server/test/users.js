'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");

describe('USERS MODULE', function () {
    
  describe('requests', function() {
    this.timeout(10000);
    it('GET /api/users respond with json', function() {
      return helpers.request
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
        })
    });
    

    it('GET /api/users/user respond with json', function() {
      return helpers.request
        .get('/api/users/user?user_id=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (Object.keys(res.body).length == 0) throw new Error("Empty result");
          if (Object.keys(res.body).length != 9) throw new Error("Number of fields must be 9");
        })
        .then(response => {
        })
    });


    it('POST /api/users response should contain user id', function() {
      var data = {
                  user_type_id: 1,
                  email: "testemail"+Date.now(),
                  username: "testusername"+Date.now(),
                  firstname: "testfirstname",
                  lastname: "testlastname",
                  status: 1,
                  password: "testpassword",
                  user_access_projects: [{user_access_id: 0,
                                          type_access: "project",
                                          project_id:1,
                                          language_id:null},
                                          {user_access_id: 0,
                                          type_access: "project",
                                          project_id:2,
                                          language_id:null},
                                          {user_access_id: 0,
                                          type_access: "project",
                                          project_id:3,
                                          language_id:null}],
                  user_access_languages: [{user_access_id: 0,
                                          type_access: "language",
                                          project_id:1,
                                          language_id:null},
                                          {user_access_id: 0,
                                          type_access: "language",
                                          project_id:2,
                                          language_id:null},
                                          {user_access_id: 0,
                                          type_access: "language",
                                          project_id:3,
                                          language_id:null,}]
                };
      return helpers.request
        .post('/api/users')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.data == "undefined") throw new Error("User id not returned");
          if (typeof res.body.data.user_id == "undefined") throw new Error("User id not returned");
          if (isNaN(res.body.data.user_id)) throw new Error("User id is not numeric");
        })
        .then(response => {
          db.query("DELETE FROM users WHERE user_id=?",[response.body.data.user_id],function(a,b,c){});
          db.query("DELETE FROM user_access WHERE user_id=?",[response.body.data.user_id],function(a,b,c){});
        })
    });


    it('PUT /api/users response should contain "success" field', function() {
      var data = {
                  user_id: 0,
                  user_type_id: 1,
                  email: "testemail"+Date.now(),
                  username: "testusername"+Date.now(),
                  firstname: "testfirstname",
                  lastname: "testlastname",
                  status: 1,
                  password: "testpassword",
                  user_access_projects: [],
                  user_access_languages: []
                };
      return helpers.request
        .put('/api/users')
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

    it('DELETE /api/users response should contain "success" field', function() {

      return helpers.request
        .delete('/api/users?ids=0')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.success == "undefined") throw new Error("Success field not found");
        })
        .then(response => {
        })                
    });


    it('DELETE /api/users number of affected rows must be as espected', function(done) {
      var db = require("../modules/db.js");
      var data = [], user_ids = [];
      for(var i = 0; i<3;i++)
        data.push({
          user_type_id: 1,
          email: "testemail"+Date.now()+i,
          username: "testusername"+Date.now()+i,
          firstname: "testfirstname",
          lastname: "testlastname",
          status: 1,
          password: "testpassword",
          user_access_projects: [],
          user_access_languages: []
        });

      helpers.request.post('/api/users')
        .set('Accept', 'application/json')
        .type("json")
        .send(data[0])
        .then(response =>{
          user_ids.push(response.body.data.user_id);
          helpers.request.post('/api/users')
            .set('Accept', 'application/json')
            .type("json")
            .send(data[1])
            .then(response =>{
              user_ids.push(response.body.data.user_id);
              helpers.request.post('/api/users')
              .set('Accept', 'application/json')
              .type("json")
              .send(data[2])
              .then(response =>{
                user_ids.push(response.body.data.user_id);
                helpers.request
                  .delete('/api/users?ids='+(user_ids.join(',')))
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .expect(function(res) {
                    if (typeof res.body.error != "undefined") throw new Error(res.body.error);
                    if (typeof res.body.success == "undefined") throw new Error("Success field not found");
                    if (res.body.data.affected_rows != 3) throw new Error("Number of deleted records must be 3");
                  })
                  .then(response => {
                    done();
                  })                
              });
            });
        });
    });
  });
});