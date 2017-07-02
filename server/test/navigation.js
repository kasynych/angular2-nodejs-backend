'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");

describe("NAVIGATION MODULE", function(){
  describe("requests", function(){
    it('GET /api/navigation respond with json', function() {
      return helpers.request
        .get('/api/navigation')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
        })
    });

    it('GET /api/navigation "Strings" item must have subitems', function() {
      return helpers.request
        .get('/api/navigation')
        .set('Accept', 'application/json')
        .expect(function(res){
          if(res.body.strings.subitems.length == 0) throw new Error('"Strings" item has no subitems');
        })
        .then(response => {
        })
    });
  })
})