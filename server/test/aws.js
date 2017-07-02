'use strict';

const assert = require('assert');
const helpers = require("../modules/helpers.js");
const aws = require("../modules/aws");
const fs = require('fs');

describe('AWS MODULE', function(){
  var filename = 'test_file.txt';
  describe('putObject()',function(){
    this.timeout(5000)
    it('return filename',function(done){
      aws.putObject(filename,'test content',function(error,results){
        if(error!==null) done(new Error(error));
        else if(results != filename)
          done('Wrong result: '+results);
        else{
          done();
        }
      });
    })
  })
  describe('streamObject()',function(){
    it('returns "success"',function(done){
      var writableStream = fs.createWriteStream('uploads/streamed_from_amazon.txt');
      // var Writable = require('stream').Writable;
      // var writableStream = new Writable(); // does not work, "Error: not implemented"
      aws.streamObject(filename,writableStream,function(error,results){
        if(error!==null) done(new Error(error));
        else if(results!=="success") done(new Error('Wrong results: '+results));
        else done();
      });
    })
  })
  describe('getObject()',function(){
    it('returns Object',function(done){
      aws.getObject(filename,function(error,results){
        if(error!==null) done(new Error(error));
        else if(!(results instanceof Object)) done(new Error('Not object returned: '+results));
        else done();
      });
    });
  })
  describe('deleteObject()',function(){
    it('returns "success"',function(done){
      aws.deleteObject(filename,function(error,results){
        if(error!==null) done(new Error(error));
        else done();
      })    
    });
  })
});