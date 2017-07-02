'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");

describe('USER ACCESS MODULE', function () {
  describe('requests', function(){
    it('GET /api/user_accesses respond with json', function() {
      return helpers.request
        .get('/api/user_accesses')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
        })
        .then(response => {
        })
    });
    
    it('GET /api/user_accesses/user_access respond with json', function() {
      return helpers.request
        .get('/api/user_accesses/user_access?user_access_id=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (Object.keys(res.body).length == 0) throw new Error("Empty result");
          if (Object.keys(res.body).length != 5) throw new Error("Number of fields must be 5");
        })
        .then(response => {
        })
    });
    
    it('POST /api/user_accesses response should contain user_access id', function() {
      var data = {user_id: 1, type_access: "project", project_id: "1", language_id: null};
      return helpers.request
        .post('/api/user_accesses')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.data == "undefined") throw new Error("User access id not returned");
          if (typeof res.body.data.user_access_id == "undefined") throw new Error("User access id not returned");
          if (isNaN(res.body.data.user_access_id)) throw new Error("User access id is not numeric");
        })
        .then(response => {
          db.query("DELETE FROM user_access WHERE user_access_id=?",[response.body.data.user_access_id,function(a,b,c){}]);
        })
    });
    
    it('PUT /api/user_accesses response should contain "success" field', function() {
      var data = {user_access_id:0, user_id: 1, type_access: "project", project_id: "1", language_id: null};
      return helpers.request
        .put('/api/user_accesses')
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
    
    it('DELETE /api/user_accesses response should contain "success" field', function() {
      return helpers.request
        .delete('/api/user_accesses?ids=0')
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
});