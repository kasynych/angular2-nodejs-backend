'use strict';
const db = require('./db');
const excel = require('./excel');
const fs = require('fs');
const settings = require('./settings');
const aws = require('./aws');
var items_per_page = 100;

module.exports.create = (log_data,cb) => {
  db.query('INSERT INTO logs SET user_id =?, datetime=NOW(), log_data=?',
    [1, log_data], function (error, results, fields) {
    if (error) {
      if(typeof cb !== "undefined")
        cb(error, null); return;
    }
    
    if(typeof cb !== "undefined")
      cb(null, results.insertId);
  });
};

module.exports.update = (log,cb) => {
  db.query('UPDATE logs SET log_data=? WHERE log_id =?',
    [log.log_data,log.log_id], function (error, results, fields) {
    if (error) {cb(error, null); return;}
    
    cb(null, 'success');
  });
};

module.exports.get = (args,cb) => {
  console.log('getting logs!');
  var pagination = {
    page: args.page,
    items_per_page: (typeof args.items_per_page != 'undefined' ? args.items_per_page: items_per_page)
  }

  var where = '1';

  if(typeof args.period != 'undefined'){
    if(args.period != 'custom'){
      switch(args.period){
        case "today":
          where = 'DATEDIFF(NOW(),`datetime`) = 0'
          break;
        case "last-7-days":
          where = 'DATEDIFF(NOW(),`datetime`) <= 7'
          break;
        case "last-30-days":
          where = 'DATEDIFF(NOW(),`datetime`) <= 30'
          break;
      }
    }else if(args.period == "custom"){
      var date_from = args.date_from.substr(6,4)+'-'+args.date_from.substr(3,2)+'-'+args.date_from.substr(0,2)
      var date_to = args.date_to.substr(6,4)+'-'+args.date_to.substr(3,2)+'-'+args.date_to.substr(0,2)
      where = 'DATEDIFF(`logs`.`datetime`,"'+date_from+'") >= 0 AND DATEDIFF("'+date_to+'",`logs`.`datetime`) >= 0';
    }
  }

  if(args.export == false){
    db.query('SELECT log_id, user_id, DATE_FORMAT(`logs`.datetime,"'+settings.date_format+'") as datetime, log_data FROM logs WHERE '+where+'\
              ORDER BY `logs`.`datetime` DESC '+
              (pagination.items_per_page != 0?' LIMIT '+(pagination.page-1)*pagination.items_per_page+', '+pagination.items_per_page:''),function(error, results, fields) {
      if (error) {console.log(error);cb(error, null); return;}
      db.query('SELECT count(*) as cnt FROM logs WHERE '+where,function(error2, results2, fields2) {
        if (error2) {console.log(error2),cb(error2, null); return;}
        cb(null, {results:results,total_pages:Math.ceil(results2[0].cnt/pagination.items_per_page)});
        console.log('got logs!');
      })
    });
  }else{
    var sql = 'SELECT log_data, DATE_FORMAT(datetime,"'+settings.date_format+'") as datetime FROM logs WHERE '+where+'\ ORDER BY `logs`.`datetime` DESC';
    var columns = [{"type":"string","alias":"log_data","label":"Log"},{"type":"string","alias":"datetime","label":"Date/time"}];
    var filename = "strings_log"+Date.now();
    excel.generate(columns,sql,filename,function(error,results){
      if(error !== null)
        cb(error,null);
      else{
        aws.getObject(filename+".xlsx",function(error,results){
          if (error){
            cb("Error creating export file",null);
            return;
          }
          else{
            console.log('exported logs!');
            cb(null,filename+'.xlsx');
          }
        });
      }
    })
  }
}

module.exports.getById = (log_id,cb) => {
  db.query('SELECT * FROM logs WHERE log_id=?',[log_id],function (error, results, fields) {
    if (error) {cb(error, null); return;}
    cb(null, results[0]);
  });
}

module.exports.delete = (log_ids,cb) => {
  var log_ids_arr  = log_ids.split(',');
  for(var i in log_ids_arr)
    if(isNaN(log_ids_arr[i])){
      cb("Wrong log ids",null);
      return;
    }
  db.query('DELETE FROM logs WHERE log_id IN('+log_ids+')',function(error, results, fields) {
    if (error) {console.log(error);cb(error, null); return;}
    cb(null, 'success');s
  });
}