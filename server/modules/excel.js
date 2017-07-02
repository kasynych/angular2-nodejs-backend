'use strict';
const db = require('./db');
const xl = require('excel4node');
const settings = require('./settings');
const aws = require('./aws');

module.exports.generate = (columns, sql, filename, cb) => {
  const wb = new xl.Workbook();
  db.query(sql,function(error, results, fields){
    if (error) {
      console.log(error);
      cb(error, null); return;
    }

    if(results.length == 0){
      console.log('empty result');
      cb("Empty result",null);return;
    }

    if(fields.length != columns.length){
      console.log('Columns length is not equal to column in SQL');
      cb('Columns length is not equal to column in SQL', null); return;
    }
    console.log('Number of rows: '+results.length);
    var ws = wb.addWorksheet('Worksheet');

    var i=0,j=0;
    for(j in columns)
      ws.cell(1,parseInt(j)+1).string(columns[j].label);
    for(i in results){
      for(j in fields){
        switch(columns[j].type){
          case 'string':
            ws.cell(parseInt(i)+2,parseInt(j)+1).string(results[i][columns[j].alias].toString());
            break;
        }
      }
    }

    wb.writeToBuffer().then(function (buffer) {
      aws.putObject(filename+'.xlsx',buffer, function(error, results){
        cb(error,results);
      });
    });
  });
}