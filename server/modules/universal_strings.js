'use strict';
var db = require('../modules/db');
var logs = require('../modules/logs');

module.exports.create = (ustring,cb) => {
  console.log('creating the universal string!');

  db.query('SELECT * FROM universal_strings WHERE LOWER(universal_string) = LOWER(?)',[ustring.universal_string], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    if(results.length > 0 ) {cb("Universal String already exists", results[0].universal_string_id); return;}

    var insert = {
      universal_string_id:ustring.universal_string_id?ustring.universal_string_id:0,
      universal_string:ustring.universal_string?ustring.universal_string:'',
      type:ustring.type?ustring.type:'item',
      formal:ustring.formal?ustring.formal:1,
      description:ustring.description?ustring.description:'',
      image1:ustring.image1?ustring.image1:'',
      image2:ustring.image2?ustring.image2:'',
      image3:ustring.image3?ustring.image3:'',
      image4:ustring.image4?ustring.image4:''
    }
    db.query('INSERT INTO universal_strings SET universal_string=?, `type`=?, formal=?, description=?, image1=?, image2=?, image3=?, image4=?',
      [insert.universal_string,insert.type,insert.formal,insert.description,insert.image1,insert.image2,insert.image3,insert.image4], function (error, results, fields) {
      if (error) {cb(error, null); return;}
      console.log('universal string successfully created');
      cb(null, results.insertId);
    });
  })
//  db_connection.end();
};

module.exports.update = (ustring,cb) => {
  console.log('updating universal string!');

  db.query('UPDATE universal_strings SET universal_string=?, type=?, formal=?, description=?, image1=?, image2=?, image3=?, image4=? WHERE universal_string_id=?',
    [ustring.universal_string,ustring.type,ustring.formal,ustring.description,ustring.image1,ustring.image2,ustring.image3,ustring.image4,ustring.universal_string_id], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('universal string successfully updated');
    cb(null, 'success');
  });
};

module.exports.get = (cb) => {
  console.log('getting universal strings!');
  db.query('SELECT * FROM universal_strings',function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got universal strings!');
  });
}

module.exports.getById = (universal_string_id,cb) => {
  console.log('getting universal string by universal string_id!');
  db.query('SELECT * FROM universal_strings WHERE universal_string_id=?',[universal_string_id],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got universal string!');
    cb(null, results[0]);
  });
}

module.exports.delete = (ustring_ids,cb) => {
  console.log('deleting universal strings!');
  var ustring_ids_arr  = ustring_ids.split(',');
  for(var i in ustring_ids_arr)
    if(isNaN(ustring_ids_arr[i])){
      cb("Wrong user ids",null);
      return;
    }
  db.query('DELETE FROM universal_strings WHERE universal_string_id IN('+ustring_ids+')',function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      cb(null, 'success');
      console.log('universal strings successfully deleted!');
  });
}