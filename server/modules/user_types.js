'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');

module.exports.get = (cb) => {
  console.log('getting user types!');
  db.query('SELECT * FROM user_type',function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got user types!');
  });
}