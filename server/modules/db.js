'use strict';
var mysql = require('mysql');

var connection = mysql.createConnection({
  multipleStatements: true,
  host     : '...',
  user     : 'root',
  password : '...',
  database : 'strings_test',
  port: 3306,
  timeout: 60000
//  ,debug: true
});

var del = connection._protocol._delegateError;
connection._protocol._delegateError = function(err, sequence){
  if (err.fatal) {
    console.trace('fatal error: ' + err.message);
  }
  return del.call(this, err, sequence);
};

connection.connect(function(err) {
  if(err !== null)
    console.log(err); // 'ECONNREFUSED'
});

module.exports = connection