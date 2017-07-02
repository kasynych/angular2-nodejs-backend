'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');

module.exports.create = (project,cb) => {
  console.log('creating the project!');

  db.query('INSERT INTO projects SET project_name=?, platform=?, parameter1=?, parameter2=?, parameter3=?, parameter4=?',
    [project.project_name, project.platform, project.parameter1, project.parameter2, project.parameter3, project.parameter4], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('project successfully created');
    logs.create("New project created. Project ID="+results.insertId);
    if(project.project_languages.length > 0){
      var inserts = [];
      var project_id = results.insertId;
      for(var i in project.project_languages){
        var patt = new RegExp("^[a-zA-Z\-0-9]{1,8}$");
        var res = patt.test(project.project_languages[i].code);
        if(!res || isNaN(project.project_languages[i].language_id)){
          cb("Validation error",null);return;
        }
        inserts.push('('+project_id+',"'+project.project_languages[i].language_id+'","'+project.project_languages[i].code+'")');

        db.query('DELETE FROM project_languages WHERE project_id='+project_id+';INSERT INTO project_languages(project_id,language_id,code) VALUES '+inserts.join(','), function (error, results, fields) {
          if (error) {cb(error, null); return;}
          cb(null, project_id); return;
        });
      }
    }else
      cb(null, results.insertId);
  });
//  db_connection.end();
};

module.exports.update = (project,cb) => {
  console.log('updating project!');

  db.query('UPDATE projects SET project_name=?, platform=?, parameter1=?, parameter2=?, parameter3=?, parameter4=? WHERE project_id=?',
    [project.project_name, project.platform, project.parameter1, project.parameter2, project.parameter3, project.parameter4, project.project_id], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('project successfully updated');
    logs.create("Project updated. Project ID="+project.project_id);
    if(project.project_languages.length > 0){
      var inserts = [];
      for(var i in project.project_languages){
        var patt = new RegExp("^[a-zA-Z\-0-9]{1,8}$");
        var res = patt.test(project.project_languages[i].code);
        if(!res || isNaN(project.project_languages[i].language_id)){
          cb("Validation error",null);return;
        }
        inserts.push('('+parseInt(project.project_id)+',"'+project.project_languages[i].language_id+'","'+project.project_languages[i].code+'")');
      }

      db.query('DELETE FROM project_languages WHERE project_id='+parseInt(project.project_id)+';INSERT INTO project_languages(project_id,language_id,code) VALUES '+inserts.join(','), function (error, results, fields) {
        if (error) {cb(error, null); return;}
        cb(null, "success"); return;
      });
    }else{
      db.query('DELETE FROM project_languages WHERE project_id='+parseInt(project.project_id), function (error, results, fields) {
        if (error) {cb(error, null); return;}
        cb(null, "success"); return;
      });
    }
  });
};

module.exports.get = (cb) => {
  console.log('getting projects!');
  db.query('SELECT * FROM projects',function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got projects!');
  });
}

module.exports.getById = (project_id,cb) => {
  console.log('getting project by project_id!');
  db.query('SELECT * FROM projects WHERE project_id=?',[project_id],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got project!');
    var project = results[0];
    if(typeof project == "undefined" || project == null){
      console.log(project_id);
      console.log(results,fields);
    }
    db.query('SELECT project_id,language_id,code FROM project_languages WHERE project_id=?',[project_id],function (error, results, fields) {
      if (error) {cb(error, null); return;}
      project.project_languages = results;
      cb(null, project);
    });
  });
}

module.exports.delete = (project_ids,cb) => {
  console.log('deleting project!');
  var project_ids_arr  = project_ids.split(',');
  for(var i in project_ids_arr)
    if(isNaN(project_ids_arr[i])){
      cb("Wrong project ids",null);
      return;
    }
  db.query('DELETE FROM project_languages WHERE project_id IN ('+project_ids+')',function(error, results, fields) {
    if (error) {console.log(error);cb(error, null); return;}
    db.query('DELETE FROM project_strings WHERE project_id IN ('+project_ids+')',function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      db.query('DELETE FROM projects WHERE project_id IN ('+project_ids+')',function(error, results, fields) {
        if (error) {console.log(error);cb(error, null); return;}
        cb(null, results.affectedRows);
        console.log('project successfully deleted!');
        logs.create("Projects deleted. Project ID="+project_ids);
      });
    });
    
  });
}