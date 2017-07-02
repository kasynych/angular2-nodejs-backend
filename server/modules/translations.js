'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');

module.exports.create = (user,cb) => {
  console.log('creating the universal translation!');

  db.query('',
    [], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('universal translation successfully created');
    cb(null, 'success');
  });
//  db_connection.end();
};

module.exports.update = (user,cb) => {
  console.log('updating universal translation!');

  db.query('',
    [], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('universal translation successfully updated');
    cb(null, 'success');
  });
};

module.exports.get = (cb) => {
  console.log('getting universal translations!');
  db.query('',function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got universal translations!');
  });
}

module.exports.getById = (user_id,cb) => {
  console.log('getting log by universal translation_id!');
  db.query('',[],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got universal translation!');
    cb(null, results[0]);
  });
}

module.exports.delete = (user_ids,cb) => {
  console.log('deleting universal translation!');
  db.query('',function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      cb(null, 'success');
      console.log('universal translation successfully deleted!');
  });
}