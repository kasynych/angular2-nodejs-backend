'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');
var languages;
var fs = require('fs');
fs.readFile('languages.json', (err, data) => {
  if (err) throw err;
  languages = JSON.parse(data);
});

module.exports.getAllLanguages = (cb) => {
  cb(null, languages);
}

module.exports.create = (language,cb) => {
  console.log('creating the language!');
  db.query('INSERT INTO languages SET name=?, code=?',
    [language.name, language.code], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('language successfully created');
    cb(null, results.insertId);
    logs.create("New language created. Language ID="+results.insertId);
  });
//  db_connection.end();
};

module.exports.update = (language,cb) => {
  console.log('updating language!');

  db.query('UPDATE languages SET name=?, code=? WHERE language_id=?',
    [language.name,language.code,language.language_id], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('language successfully updated');
    cb(null, 'success');
    logs.create("Language updated. Language ID="+language.language_id);
  });
};

module.exports.delete = (language_ids,cb) => {
  console.log('deleting language!');
  var language_ids_arr  = language_ids.split(',');
  for(var i in language_ids_arr)
    if(isNaN(language_ids_arr[i])){
      cb("Wrong language ids",null);
      return;
    }
  db.query('DELETE FROM languages WHERE language_id IN (?)',
      [language_ids],function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      cb(null, results.affectedRows);
      console.log('language successfully deleted!');
      logs.create("Languages deleted. Language ID="+language_ids);
  });
};

module.exports.get = (cb) => {
  console.log('getting languages!');
  db.query('SELECT * FROM languages',function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got languages!');
  });
}

module.exports.getById = (language_id,cb) => {
  console.log('getting language by language_id!');
  if(isNaN(language_id)){ cb('language_id is not numeric',null);return;}
  db.query('SELECT * FROM languages WHERE language_id=?',[language_id],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got language!');
    cb(null, results[0]);
  });
}