"user strict";
const db = require('./db.js');
var logs = require('../modules/logs');
const fs = require('fs');
const utf8 = require('utf8');
const xml = require("node-xml-lite");

module.exports.import = (form,file,cb) => {
  if(typeof form.project_id == "undefined" || isNaN(form.project_id)){
    cb("Wrong project_id",null);return;
  }

  if(typeof file.filename == "undefined"){
    cb("File not given",null);return;
  }

  const fd = fs.openSync(file.filename, 'r');
  const bufferSize = 1024;
  const buffer = new Buffer(bufferSize);

  var leftOver = '';
  var read, line, idxStart, idx;
  var lines = [];
  var strings = [];
  var inserts = [];
  var string_type = '';
  var string = '';
  var key = '';
  var phrase = '';
  var placeholders = [];
  var ret;
  var els = [];

  while ((read = fs.readSync(fd, buffer, 0, bufferSize, null)) !== 0) {
    leftOver += buffer.toString('utf8', 0, read);
    idxStart = 0
    while ((idx = leftOver.indexOf("\n", idxStart)) !== -1) {
      line = leftOver.substring(idxStart, idx);
      lines.push(line);
      idxStart = idx + 1;
    }
    leftOver = leftOver.substring(idxStart);
  }
  line = leftOver.substring(idxStart, idx);
  lines.push(line);

  switch(file.mime_type){
    case 'application/xml':
    case 'text/xml':
      for(var i in lines){
        line = lines[i];
        key = '';
        phrase = '';
        try{
          ret = xml.parseString(line);
          if(ret.name=="string"){
            string_type = "Key";
            key = ret.attrib.name.trim();
            phrase = ret.childs[0].trim();
          }else
            string_type = "Other";
        }catch(e){
          if(line.trim() == '')
            string_type = 'LineBreak';
          else if(line.trim().startsWith('//')){
            string_type = 'Comment';
            phrase = line;
          }else{
            string_type = 'Other';
            phrase = line;
          }
        }


        if(phrase != '') phrase = substParams(phrase);

        if (phrase == '') phrase = line;
        strings.push({"string_type":string_type,"key":key,"phrase":phrase});
      }
      break;

    case 'application/octet-stream':
      for(var i in lines){
        line = lines[i];
        key = '';
        phrase = '';


        if (line.trim().charCodeAt(0) == 0)
          line = line.trim().substr(1,line.trim().length-1);

        if(line.trim().startsWith('"')){
          els = line.split('"');
          if(els.length != 5){
            cb("Wrong line format: "+line,null);
            return;
          }
          key = els[1];
          phrase = els[3];
          string_type = "Key";
        }else{
          if(line.trim() == '')
            string_type = 'LineBreak';
          else if(line.trim().startsWith('//')){
            string_type = 'Comment';
            phrase = line;
          }else{
            string_type = 'Other';
            phrase = line;
          }
        }

        if(phrase != ''){
          phrase = substParams(phrase);
        }

        if(key != ''){
          key = substParams(key);
        }

        if (phrase == '') phrase = line;
        strings.push({"string_type":string_type,"key":key,"phrase":phrase});
      }
      break;
    default:
      cb("Wrong mime type",null);
      return;
  }

  if(strings.length != lines.length){
    cb("Error",null);
    return;
  }

  for(i in lines){
    line = lines[i];
    string = strings[i];
    inserts.push(form.project_id.toString());
    inserts.push(i);
    inserts.push(string.string_type);
    inserts.push(string.key);
    inserts.push(string.phrase);
    placeholders.push('(?,?,?,?,?)');
  }
  
  db.query("/*DELETE FROM project_strings WHERE project_id="+form.project_id.toString()+";*/  INSERT INTO project_strings(`project_id`, `order`, `type`, `key`, `english`) VALUES "+placeholders.join(','),inserts, function(error, results, fields){
    if (error) {cb(error, null); return;}

    cb(null,results.insertId);
    logs.create("Project strings imported. IDs:"+results.insertId+'-'+(results.insertId+lines.length-1));
    return;
  });
};

module.exports.create = (string,cb) => {
  console.log('creating the string');

  db.query('INSERT INTO `project_strings` SET `project_id`=?, `order`=?, `type`=?, `key`=?, `english`=?',
    [string.project_id, string.order, string.type, string.key, string.english], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('string successfully created');
    cb(null, results.insertId);
    logs.create("New string created. String ID="+results.insertId);
  });
//  db_connection.end();
};

module.exports.get = (project_id,cb) => {
  console.log('getting project_strings!');
  db.query('SELECT * FROM project_strings WHERE project_id =? ORDER BY `order` ASC',[parseInt(project_id)],function(error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results);
    console.log('got project_strings!');
  });
}

module.exports.getById = (string_id,cb) => {
  console.log('getting string by string_id!');
  db.query('SELECT * FROM project_strings WHERE project_string_id=?',[string_id],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('got string!');
    cb(null, results[0]);
  });
}

module.exports.update = (string,cb) => {
  console.log('updating string!');

  db.query('UPDATE `project_strings` SET `type`=?, `key`=?, `english`=?, `universal_string_id`=? WHERE `project_string_id`=?',
    [string.type, string.key, string.english, string.universal_string_id, string.project_string_id], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    console.log('string successfully updated');
    cb(null, 'success');
    logs.create("Project string updated. Project string ID="+string.project_string_id);
  });
};

module.exports.updateSorting = (strings,cb) => {
  console.log('updating sorting');

  var queries = [];

  for (i in strings){
    queries.push('UPDATE project_strings SET `order`='+db.escape(strings[i].order)+' WHERE project_string_id='+db.escape(strings[i].project_string_id));
  }

  db.query(queries.join(';'),function(error, results, fields){
    if (error) {cb(error, null); return;}
    cb(null, 'success');
  })
}

module.exports.delete = (project_string_ids,cb) => {
  console.log('deleting strings!');
  var project_string_ids_arr  = project_string_ids.split(',');
  for(var i in project_string_ids_arr)
    if(isNaN(project_string_ids_arr[i])){
      cb("Wrong project_string ids",null);
      return;
    }
  db.query('DELETE FROM project_strings WHERE project_string_id IN ('+project_string_ids+')',function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      cb(null, results.affectedRows);
      console.log('strings successfully deleted!');
      logs.create("Project strings deleted. Project string ID="+project_string_ids);
  });
}

var substParams = (str) => {
  var i = 1;
  var r = new RegExp("\%"+i+"[\$]@");
  while(r.test(str)){
    str = str.replace('%'+i+'$@','#'+i);
    i++;
    r = new RegExp("\%"+i+"[\$]@");
  }

  i = 1;
  var r = new RegExp("\%"+i+"[\$]s");
  while(r.test(str)){
    str = str.replace('%'+i+'$s','#'+i);
    i++;
    r = new RegExp("\%"+i+"[\$]s");
  }

  i = 1;
  while(str.indexOf('%@') != -1){
    str = str.replace('%@','#'+i);
    i++;
  }

  return str;
}

module.exports.test = {
  substParams: str => {
    if(process.env.environment == 'test')
      return substParams(str);
    else
      return false;
  }
}