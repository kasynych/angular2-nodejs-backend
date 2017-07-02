'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');

module.exports.create = (user_access,cb) => {
  console.log('creating the user_access');

  db.query('INSERT INTO user_access SET user_id=?, type_access=?, project_id=?, language_id=?',
    [user_access.user_id,user_access.type_access,user_access.project_id == 0?NULL:user_access.project_id,user_access.language_id==0?NULL:user_access.language_id], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('user_access successfully created');
    cb(null, results.insertId);
    logs.create("New user access created. User Access ID="+results.insertId);
  });
//  db_connection.end();
};

module.exports.update = (user_access,cb) => {
  console.log('updating user_access!');

  db.query('UPDATE user_access SET user_id=?, type_access=?, project_id=?, language_id=? WHERE user_access_id=?',
    [user_access.user_id,user_access.type_access,user_access.project_id == 0?NULL:user_access.project_id,user_access.language_id==0?NULL:user_access.language_id,user_access.user_access_id], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('user_access successfully updated');
    cb(null, 'success');
    logs.create("User access updated. User Access ID="+user_access.user_access_id);
  });
};

module.exports.get = (cb) => {
  console.log('getting user_access!');
  db.query('SELECT * FROM user_access',function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got user_access!');
  });
}

module.exports.getById = (user_id,cb) => {
  console.log('getting user_access by user_access_id!');
  db.query('SELECT * FROM user_access WHERE user_id=?',[user_id],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got user_access!');
    cb(null, results[0]);
  });
}

module.exports.delete = (user_access_ids,cb) => {
  console.log('deleting user_access!');
  var user_access_ids_arr  = user_access_ids.split(',');
  for(var i in user_access_ids_arr)
    if(isNaN(user_access_ids_arr[i])){
      cb("Wrong user_access ids",null);
      return;
    }
  db.query('DELETE FROM user_access WHERE user_access_id IN ('+user_access_ids+')',function(error, results, fields) {
    if (error) {console.log(error);cb(error, null); return;}
    cb(null, results.affectedRows);
    console.log('user_access successfully deleted!');
    logs.create("User accesses deleted. User access ID="+user_access_ids);
  });
}