'use strict';

const assert = require('assert');

const db = require("../modules/db.js");
const helpers = require("../modules/helpers.js");
const settings = require('../modules/settings');
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID,secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});

describe('EXCEL MODULE', function(){
  this.timeout(20000);
  describe('generate()', function (){
    it('should generate xls', function(done){
      var excel = require('../modules/excel.js');
      const fs = require('fs');
      var columns = [{"type":"string","alias":"log_data","label":"Log"},{"type":"string","alias":"datetime","label":"Date/time"}];
      var sql = "SELECT log_data, DATE_FORMAT(datetime,'"+settings.date_format+"') AS datetime FROM logs LIMIT 100";
      var filename = "test_excel";
      excel.generate(columns,sql,filename,function(error,results){
        if(error !== null)
          done(new Error(error));
        else{
          var s3 = new AWS.S3();

          var params = {
            Bucket: "fel-files", 
            Key: filename+".xlsx"
          };
          s3.getObject(params, function(err, data) {
            if (err) done(new Error('Export file '+filename+'.xlsx not found'));
            else{
              s3.deleteObject(params, function(err, data) {
                if (err) done(new Error('Could not delete '+filename+'.xlsx'))
                else     done();
              });
            }
          });
        }
      })
    })
  });
});