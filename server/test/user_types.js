'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");

describe('USER TYPES MODULE', function () {
    
  describe('requests', function() {
    it('GET /api/user_types respond with json', function() {
      return helpers.request
        .get('/api/user_types')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
        })
    });
  });
});