'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");

describe('LANGUAGES MODULE', function () {
  it('should fetch languages from file', function(done){
    var languages = require("../modules/languages.js");
    setTimeout(function(){
      languages.getAllLanguages(function(err,languages) {
      if (err) done(err);
      else{
        assert.ok(Array.isArray(languages), 'not an array fetched');
        assert.ok(languages.length > 0, 'languages.length=0');
        done();
      }
    }); 
    }, 300);
  });
  
  describe('requests', function() {
    it('GET /api/languages respond with json', function() {
      return helpers.request
        .get('/api/languages')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
        })
        .then(response => {
        })
    });

    it('GET /api/languages/all respond with json', function() {
      return helpers.request
        .get('/api/languages/all')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (res.body.length == 0) throw new Error("Empty result");
        })
        .then(response => {
        })
    });

    it('GET /api/languages/language respond with json', function() {
      return helpers.request
        .get('/api/languages/language?lang_id=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (Object.keys(res.body).length == 0) throw new Error("Empty result");
          if (Object.keys(res.body).length != 3) throw new Error("Number of fields must be 3");
        })
        .then(response => {
        })
    });

    it('POST /api/languages response should contain language id', function() {
      var data = {name: "testlang"+Date.now(), code: "testcode"+Date.now()};
      return helpers.request
        .post('/api/languages')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.data == "undefined") throw new Error("Language id not returned");
          if (typeof res.body.data.language_id == "undefined") throw new Error("Language id not returned");
          if (isNaN(res.body.data.language_id)) throw new Error("Language id is not numeric");
        })
        .then(response => {
          db.query("DELETE FROM languages WHERE language_id=?",[response.body.data.language_id],function(a,b,c){});
        })
    });

    it('PUT /api/languages response should contain "success" field', function() {
      var data = {language_id:0, name: "testlang"+Date.now(), code: "testcode"+Date.now()};
      return helpers.request
        .put('/api/languages')
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

    it('DELETE /api/languages response should contain "success" field', function() {
      return helpers.request
        .delete('/api/languages?ids=0')
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