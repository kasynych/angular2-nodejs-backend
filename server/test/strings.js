'use strict';
process.env.environment = "test";
const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");

describe('STRINGS MODULE', function () {
  describe('substParams()', function(){
    var strings = require("../modules/strings.js");
    it('replace "%1$s %2$s %3$s" with "#1 #2 #3"', function(){
      assert.equal("#1 #2 #3", strings.test.substParams("%1$s %2$s %3$s"));
    })

    it('replace "%@ %@ %@" with "#1 #2 #3"', function(){
      assert.equal("#1 #2 #3", strings.test.substParams("%@ %@ %@"));
    })

    it('replace "%1$@ %2$@ %3$@" with "#1 #2 #3"', function(){
      assert.equal("#1 #2 #3", strings.test.substParams("%1$@ %2$@ %3$@"));
    })
  });

  describe('import()', function() {
    this.timeout(10000);
    it('should parse xml without error', function (done) {
      var strings = require("../modules/strings.js");
      var file = {filename: __dirname+"/files/strings.xml", mime_type:"application/xml"};
      var form = {"project_id": 2};

      strings.import(form,file,function(error,response){
        if (error) done(error);
        else{
          db.query('DELETE FROM project_strings WHERE project_string_id>=?',response,function(a,b,c){
            done();
          });
        }
      });
    });

    it('should parse .strings without error', function (done) {
      var strings = require("../modules/strings.js");
      var file = {filename: __dirname+"/files/strings2.strings", mime_type:"application/octet-stream"};
      var form = {"project_id": 2};

      strings.import(form,file,function(error,response){
        if (error) done(error);
        else{
          db.query('DELETE FROM project_strings WHERE project_string_id>=?',response,function(a,b,c){
            done();
          });
        }
      });
    });
  });
  describe('requests', function() {

    it('GET /api/strings respond with json', function() {
      return helpers.request
        .get('/api/strings?project_id=1')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
        })
    });


    it('GET /api/strings/string respond with json', function() {
      return helpers.request
        .get('/api/strings/string?string_id=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (Object.keys(res.body).length == 0) throw new Error("Empty result");
          if (Object.keys(res.body).length != 7) throw new Error("Number of fields must be 7");
        })
        .then(response => {
        })
    });

    
    it('POST /api/strings response should contain string id', function() {
      var data = {project_string_id: 0, project_id: 2, order: 1, type: "Key", key: "test_key", english: "test_phrase"};
      return helpers.request
        .post('/api/strings')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.data == "undefined") throw new Error("String id not returned");
          if (typeof res.body.data.project_string_id == "undefined") throw new Error("String id not returned");
          if (isNaN(res.body.data.project_string_id)) throw new Error("String id is not numeric");
        })
        .then(response => {
          db.query("DELETE FROM project_strings WHERE project_string_id=?",[response.body.data.project_string_id,function(a,b,c){}]);
        })
    });

    it('upload files', function(){
      var xml = require("node-xml-lite");
      
      return helpers.request
        .post('/api/strings/import')
        .set('Content-Type', 'multipart/form-data')
        .field('project_id', '2')
        .attach('strings', 'test/files/strings.xml')
        .expect(200)
        .then(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          db.query('DELETE FROM project_strings WHERE project_string_id>=?',res.body.data.project_string_id,function(a,b,c){
          });
          return helpers.request
            .post('/api/strings/import')
            .set('Content-Type', 'multipart/form-data')
            .field('project_id', '2')
            .attach('strings', 'test/files/strings2.strings')
            .expect(200)
            .then(function(res) {
              if (typeof res.body.error != "undefined") throw new Error(res.body.error);
              db.query('DELETE FROM project_strings WHERE project_string_id>=?',res.body.data.project_string_id,function(a,b,c){
              });
            });
        });
    });


    it('PUT /api/strings response should contain "success" field', function() {
      var data = {
                  project_string_id: 0,
                  type: "testtype",
                  key: "testkey",
                  english: "test english"
                };
      return helpers.request
        .put('/api/strings')
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


    it('PUT /api/strings/sorting response should contain "success" field', function() {
      var data = [{
                  project_string_id: 1,
                  project_id: 2,
                  order: 1,
                  type: "testtype",
                  key: "testkey",
                  english: "test english"
                },
                {
                  project_string_id: 2,
                  project_id: 2,
                  order: 2,
                  type: "testtype",
                  key: "testkey",
                  english: "test english"
                },
                {
                  project_string_id: 3,
                  project_id: 2,
                  order: 3,
                  type: "testtype",
                  key: "testkey",
                  english: "test english"
                }];
      return helpers.request
        .put('/api/strings/sorting')
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
  })
});