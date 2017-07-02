'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');

module.exports.create = (user,cb) => {
  console.log('creating the project string!');

  db.query('',
    [], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('project string successfully created');
    cb(null, 'success');
  });
//  db_connection.end();
};

module.exports.update = (user,cb) => {
  console.log('updating project string!');

  db.query('',
    [], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('project string successfully updated');
    cb(null, 'success');
  });
};

module.exports.get = (cb) => {
  console.log('getting project strings!');
  db.query('',function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got project strings!');
  });
}

module.exports.getById = (user_id,cb) => {
  console.log('getting log by project string_id!');
  db.query('',[],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got project string!');
    cb(null, results[0]);
  });
}

module.exports.delete = (user_ids,cb) => {
  console.log('deleting project string!');
  db.query('',function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      cb(null, 'success');
      console.log('project string successfully deleted!');
  });
}