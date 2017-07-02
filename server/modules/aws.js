'use strict';
const AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID,secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});
const s3 = new AWS.S3();
const bucketName = "fel-files";

module.exports.putObject = (filename,body,cb) => {
  var keyName = filename;
  var params = {Bucket: bucketName, Key: keyName, Body: body};
  s3.putObject(params, function(err, data) {
    if (err){
      console.log(err)
      cb('Error uploading file to amazon',null);
    }else{
      console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
      cb(null,filename);
    }
  });
};

module.exports.streamObject = (filename,stream,cb) => {
  var params = {
    Bucket: bucketName, 
    Key: filename
  };
  s3.getObject(params, function(err, data) {
    if (err){
      console.log(err);
      cb("File not found",null);return;
    }
    else{
      s3.getObject(params).createReadStream().pipe(stream);
      stream.on('finish', () => {
        cb(null,'success');
      });
      stream.on('error', (arg) => {
        console.log(arg);
        cb('Error streaming file',null);
      });
    }
  });
}

module.exports.getObject = (filename,cb) => {
  var params = {
    Bucket: bucketName, 
    Key: filename
  };
  s3.getObject(params, function(err, data) {
    if (err){
      console.log(err);
      cb("Error getting file",null);
      return;
    }
    else{
      cb(null,data);
    }
  });
}

module.exports.deleteObject = (filename,cb) => {
  var params = {
    Bucket: "fel-files", 
    Key: filename
  };
  s3.deleteObject(params, function(err, data) {
    if (err) cb("Error deleting file",null);
    else cb(null,'success');
  });
}