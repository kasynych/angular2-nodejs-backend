'use strict';

const assert = require('assert');
const helpers = require("../modules/helpers.js");
const cryptojs = require('crypto-js');

describe('ROLES', function(){
  describe('requests', function(){
    it('POST /authentication/login with wrong credentials should throw error', function(){
      var data = {  username: 'blabla!', password: 'asvasqerd23'};
      return helpers.request
        .post('/authentication/login')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error == "undefined") throw new Error('No error thrown');
          if (typeof res.body.success != "undefined") throw new Error('Login was successful');
        })
        .then(response => {
        })
    });

    it('POST /authentication/login with correct credentials should return success', function(){
      var data = {  username: 'admin', password: 'admin'};
      return helpers.request
        .post('/authentication/login')
        .set('Accept', 'application/json')
        .type("json")
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          if (typeof res.body.error != "undefined") throw new Error(res.body.error);
          if (typeof res.body.success == "undefined") throw new Error('Sucess field not present');
        })
        .then(response => {
        })
    });
  });
});