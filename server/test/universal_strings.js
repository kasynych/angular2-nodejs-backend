'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");

describe('UNIVERSAL_STRINGS MODULE', function () {
  describe('requests', function(){
    it('GET /api/universal_strings respond with json', function() {
      return helpers.request
        .get('/api/universal_strings')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
        })
    });
    

    it('GET /api/universal_strings/universal_string respond with json', function() {
      return helpers.request
        .get('/api/universal_strings/universal_string?universal_string_id=1')
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


    it('POST /api/universal_strings response should contain universal string id', function() {
      var data = {
                  universal_string: "test_universal_string"+Date.now()
                };
      return helpers.request
        .post('/api/universal_strings')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.data == "undefined") throw new Error("Universal string id not returned");
          if (typeof res.body.data.universal_string_id == "undefined") throw new Error("Universal string id not returned");
          if (isNaN(res.body.data.universal_string_id)) throw new Error("Universal string id is not numeric");
        })
        .then(response => {
          db.query("DELETE FROM universal_strings WHERE universal_string_id=?",[response.body.data.universal_string_id],function(a,b,c){});
        })
    });

    it('POST /api/universal_strings response should contain error message and universal string id if universal string exists', function(done) {
      var existing_universal_string_id = 0;
      
      var data = {
                  universal_string: "exiting_universal_string"
                };
      helpers.request
        .post('/api/universal_strings')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.data == "undefined") throw new Error("Universal string id not returned");
          if (typeof res.body.data.universal_string_id == "undefined") throw new Error("Universal string id not returned");
          if (isNaN(res.body.data.universal_string_id)) throw new Error("Universal string id is not numeric");

          existing_universal_string_id = res.body.data.universal_string_id
        })
        .then(response => {
          helpers.request
            .post('/api/universal_strings')
            .set('Accept', 'application/json')
            .type("json")
            .send(data)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function(res) {
              if (typeof res.body.error == "undefined") throw new Error("Error field is missing");
              if (res.body.error != "Universal String already exists") throw new Error("Wrong error message");
              if (typeof res.body.data.universal_string_id == "undefined") throw new Error("Universal string id not returned");
              if (isNaN(res.body.data.universal_string_id)) throw new Error("Universal string id is not numeric");
            })
            .then(response => {
              db.query("DELETE FROM universal_strings WHERE universal_string = 'exiting_universal_string'",function(a,b,c){
                done();
              });
            })
        })
    });


    it('PUT /api/universal_strings response should contain "success" field', function() {
      var data = {
                  universal_string_id: 1,
                  universal_string: "test_universal_string"+Date.now()
                };
      return helpers.request
        .put('/api/universal_strings')
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
  });
});