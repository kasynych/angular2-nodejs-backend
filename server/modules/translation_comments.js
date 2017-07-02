'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');

module.exports.create = (user,cb) => {
  console.log('creating the translation comment!');

  db.query('',
    [], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('translation comment successfully created');
    cb(null, 'success');
  });
//  db_connection.end();
};

module.exports.update = (user,cb) => {
  console.log('updating translation comment!');

  db.query('',
    [], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('translation comment successfully updated');
    cb(null, 'success');
  });
};

module.exports.get = (cb) => {
  console.log('getting translation comments!');
  db.query('',function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got translation comments!');
  });
}

module.exports.getById = (user_id,cb) => {
  console.log('getting log by translation comment_id!');
  db.query('',[],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got translation comment!');
    cb(null, results[0]);
  });
}

module.exports.delete = (user_ids,cb) => {
  console.log('deleting translation comment!');
  db.query('',function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      cb(null, 'success');
      console.log('translation comment successfully deleted!');
  });
}