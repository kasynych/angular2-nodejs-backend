'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');

var items_per_page = 20;

module.exports.create = (user,cb) => {
  console.log('creating the user');

  db.query('INSERT INTO users SET username=?, email=?, password=sha1(?), firstname=?, lastname=?, user_type_id=?, status=?',
    [user.username,user.email,user.password,user.firstname,user.lastname,user.user_type_id,user.status], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('user successfully created');
    var user_id = results.insertId;
    logs.create("New user created. User ID="+user_id);
    if(user.user_access_languages.length > 0 || user.user_access_projects.length > 0){
      var user_access = user.user_access_languages.concat(user.user_access_projects);
      var inserts = [];
      for(var i in user_access){
        if(user_access[i].type_access !== 'project' && user_access[i].type_access !== 'language'
          || isNaN(user_access[i].project_id) && user_access[i].project_id != null
          || isNaN(user_access[i].language_id) && user_access[i].language_id != null){
            cb("Validation error",null);return;
          }
        inserts.push('('+user_id+',"'+user_access[i].type_access+'",'+user_access[i].project_id+','+user_access[i].language_id+')');
      }
      db.query('DELETE FROM user_access WHERE user_id='+user_id+'; INSERT INTO user_access(user_id,type_access,project_id,language_id) VALUES '+inserts.join(','),function(error, results, fields){
        if (error) {cb(error, null); return;}
        cb(null, user_id);
      })
    }else
      cb(null, user_id);
  });
//  db_connection.end();
};

module.exports.update = (user,cb) => {
  console.log('updating user!');

  db.query('UPDATE users SET username=?, email=?, password=sha1(?), firstname=?, lastname=?, user_type_id=?, status=? WHERE user_id=?',
    [user.username,user.email,user.password,user.firstname,user.lastname,user.user_type_id,user.status,user.user_id], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('user successfully updated');
    logs.create("User updated. User ID="+user.user_id);
    if(user.user_access_languages.length > 0 || user.user_access_projects.length > 0){
      var user_access = user.user_access_languages.concat(user.user_access_projects);
      var inserts = [];
      
      for(var i in user_access){
        if(user_access[i].type_access !== 'project' && user_access[i].type_access !== 'language'
          || isNaN(user_access[i].project_id) && user_access[i].project_id != null
          || isNaN(user_access[i].language_id) && user_access[i].language_id != null){
            cb("Validation error",null);return;
          }
        inserts.push('('+parseInt(user.user_id)+',"'+user_access[i].type_access+'",'+user_access[i].project_id+','+user_access[i].language_id+')');
      }
      db.query('DELETE FROM user_access WHERE user_id='+parseInt(user.user_id)+'; INSERT INTO user_access(user_id,type_access,project_id,language_id) VALUES '+inserts.join(','),function(error, results, fields){
        if (error) {cb(error, null); return;}
        cb(null, 'success');
      })
    }else{
      db.query('DELETE FROM user_access WHERE user_id='+parseInt(user.user_id),function(error, results, fields){
        if (error) {cb(error, null); return;}
        cb(null, 'success');
      })
    }
  });
};

module.exports.get = (args,cb) => {
  var pagination = {
    page: args.page,
    items_per_page: (typeof args.items_per_page != 'undefined' ? args.items_per_page: items_per_page)
  }

  console.log('getting users!');
  db.query('SELECT user_id, user_type_id, email, username, firstname, lastname, status FROM users'+
            (pagination.items_per_page != 0?' LIMIT '+(pagination.page-1)*pagination.items_per_page+', '+pagination.items_per_page:''),function(error, results, fields) {
    if (error) {cb(error, null); return;}
    db.query('SELECT count(*) as cnt FROM users',function(error2, results2, fields2) {
      if (error2) {console.log(error2),cb(error2, null); return;}
      cb(null, {results:results,total_pages:Math.ceil(results2[0].cnt/pagination.items_per_page)});
    })
    
    console.log('got users!');
  });
}

module.exports.getActiveByUsername = (username,select,cb) => {
  console.log('getting user by username!');
  db.query('SELECT '+select+' FROM users WHERE username=? AND status=1',[username],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got user!');
    cb(null, results[0]);
  });
}

module.exports.getById = (user_id,cb) => {
  console.log('getting user by user_id!');
  db.query('SELECT user_id, user_type_id, email, username, firstname, lastname, status FROM users WHERE user_id=?',[user_id],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got user!');
    if (results.length == 0) {cb("User not found!", null); return;}
    var user = results[0];
    db.query(`SELECT user_access_id, type_access, project_id, language_id
              FROM user_access
              WHERE user_id=?`,[user_id],function (error, results, fields) {
      if (error) {cb(error, null); return;}
      console.log('got user!');
      
      var user_access_languages = [];
      var user_access_projects = [];
      for (var row of results){
        if(row.type_access == 'language')
          user_access_languages.push(row);
        else if(row.type_access == 'project')
          user_access_projects.push(row);
      }
      cb(null, {"user_id":user.user_id,
                "user_type_id":user.user_type_id,
                "email":user.email,
                "username":user.username,
                "firstname":user.firstname,
                "lastname":user.lastname,
                "status":user.status,
                "user_access_languages":user_access_languages,
                "user_access_projects":user_access_projects});
    });
  });
}

module.exports.delete = (user_ids,cb) => {
  console.log('deleting users!');
  var user_ids_arr  = user_ids.split(',');
  for(var i in user_ids_arr)
    if(isNaN(user_ids_arr[i])){
      cb("Wrong user ids",null);
      return;
    }
  db.query('DELETE FROM user_access WHERE user_id IN ('+user_ids+')',function(error, results, fields) {
    if (error) {console.log(error);cb(error, null); return;}
    db.query('DELETE FROM users WHERE user_id IN ('+user_ids+')',function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      cb(null, results.affectedRows);
      console.log('users successfully deleted!');
      logs.create("Users deleted. User ID="+user_ids);
    });
  });
}