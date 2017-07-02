//Copyright 2013-2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//Licensed under the Apache License, Version 2.0 (the "License").
//You may not use this file except in compliance with the License.
//A copy of the License is located at
//
//    http://aws.amazon.com/apache2.0/
//
//or in the "license" file accompanying this file. This file is distributed
//on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
//either express or implied. See the License for the specific language
//governing permissions and limitations under the License.

//Get modules.
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routes = require('./routes');
const http = require('http');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const aws = require('./modules/aws');
const cryptojs = require('crypto-js');

const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const formidable = require('formidable');
const logs = require('./modules/logs');
const users = require('./modules/users');
const user_types = require('./modules/user_types.js');
const user_access = require('./modules/user_access');
const forceSSL = require('./modules/forcessl.js');
const navigation = require('./modules/navigation');
const languages = require('./modules/languages');
const projects = require('./modules/projects.js');
const strings = require('./modules/strings.js');
const universal_strings = require('./modules/universal_strings.js');

app.use(bodyParser());
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

app.use(cookieParser());
app.use(session({ secret: 'asv7asvlkj2KJSC234&320L' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(forceSSL());
app.use(express.static(path.join(__dirname, '/../app/src')));

process.env.environment = "dev";

app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app.

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('logging in');
    users.getActiveByUsername(username,'*', function(err, user) {
      if (err) {console.log(err); return done(err); }
      if (!user) {
        console.log('User '+username+' not found!');
        return done(null, false, { message: 'Incorrect username' });
      }
      if (user.password != cryptojs.SHA1(password).toString()) {
        console.log('Password '+password+' is incorrect!');
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

//Create DynamoDB client and pass in region.
var db = new AWS.DynamoDB({region: config.AWS_REGION});
//Create SNS client and pass in region.
var sns = new AWS.SNS({ region: config.AWS_REGION});

// app.get('/login', function(req,res) {
//   if(typeof req.user != 'undefined')
//     res.redirect('/').end();
//   var options = {
//     root: __dirname + '/../app/src',
//     dotfiles: 'deny',
//     headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//     }
//   };

//   res.sendFile('login.html', options, function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//       console.log('Sent:', 'login.html  ');
//     }
//   });
// });

app.post('/authentication/login',function(req, res, next) {
  if(typeof req.user != 'undefined'){
    res.json({'error':'error'});return;
  }
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { res.json({'error':'Wrong username or password'});return; }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({'success':'Successful login'});
    });
  })(req, res, next);
});

//GET route
app.get(/^\/$|^\/logs$|^\/login$|^\/users$|^\/new-user$|^\/user\/[0-9]+$|^\/languages$|^\/new-language$|^\/language\/[0-9]+$|^\/user-access$|^\/new-user-access$|^\/user-access\/[0-9]+$|^\/projects$|^\/new-project$|^\/project\/[0-9]+$|^\/strings\/project\/[0-9]+$|^\/string\/[0-9]+$/, function(req,res) {
  // if(typeof req.user == 'undefined'){
  //   res.status(403).end();return;
  // }

  // if(req.user.user_type != 'admin'){
  //   res.status(403).end();return;
  // }

  var options = {
    root: __dirname + '/../app/src',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  var fileName = 'index.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
        console.log(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

/*
 *      UPLOADS
 */
// GET file
app.get('/uploads/:filename',function(req,res){
  // if(typeof req.user == 'undefined'){
  //   res.redirect('/login');return;
  // }

  // if(req.user.user_type != 'admin'){
  //   res.status(403).end();return;
  // }

  if(typeof req.params.filename == 'undefined'){
    res.json({error:"Filename is not given"});
    return;
  }

  if (!/^[a-z_]{5,20}[0-9]+\.xlsx$/.test(req.params.filename)){
    res.json({"error":"Wrong filename"});return;
  }

  res.setHeader('Content-disposition', 'attachment; filename=' + req.params.filename);
  aws.streamObject(req.params.filename,res,function(error,results){
    if(error !== null){
      res.json({"error":error});
      console.log(error);
      return;
    }
  });
});

//GET user
app.get('/users/user_info', function(req,res) {
  if(typeof req.user == 'undefined'){
    res.json({"error":"user not found"});;return;
  }

  users.getActiveByUsername(req.user.username,'user_type', function(error, user) {
      if(error !== null){
        res.json({"error":"Error getting user"})
      }else {
        res.json(user);
      }
  });
});

/*
 *  LOGOUT
 */

app.get('/logout', function(req, res){
  if(typeof req.user == 'undefined'){
    res.redirect('/login');return;
  }

  req.logOut();
  res.clearCookie('connect.sid');
  req.session.destroy(function (err) {
    res.redirect('/login');
  });
});


/*
 *
 *                  API
 * 
 */

/*
 *      USERS
 */

app.get('/api/users', function(req,res) {
  args = {page: req.query.page};
  res.setHeader('Content-Type', 'application/json');
  users.get(args,function(error,results){
    if(error !== null){
      res.json({"error":"Error getting users"})
    }else {
      res.json(results);
    }
  });
});

//POST signup form.
app.post('/api/users', function(req, res) {

  users.create(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({data:{user_id:response},success:"User successfully created"});
    }
  });
});

//PUT signup form.
app.put('/api/users', function(req, res) {

  users.update(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({success:"User successfully updated"});
    }
  });
});

app.get('/api/users/user', function(req,res) {

  res.setHeader('Content-Type', 'application/json');
  users.getById(req.query.user_id, function(error,results){
    if(error !== null){
      res.json({"error":"Error getting users"})
    }else {
      res.json(results);
    }
  });
});

// DELETE users
app.delete('/api/users', function(req,res) {
  users.delete(req.query.ids, function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({data:{affected_rows:response},success:"Users successfully deleted"});
    }
  });
});

/*
 *      USERS TYPES
 */

// GET user_types
app.get('/api/user_types', function(req,res){
  user_types.get(function(err,user_types) {
    if(err !== null){
      res.json({"error":"Error getting user types"});
    }else{
      res.json(user_types);return;
    }
    
  })
});

/*
 *      USER ACCESS
 */

// GET user_access
app.get('/api/user_accesses', function(req,res){
  user_access.get(function(err,user_accesses) {
    if(err !== null){
      res.json({"error":"Error getting user accesses"});
    }else{
      res.json(user_accesses);return;
    }
    
  })
});

// GET 1 user_access
app.get('/api/user_accesses/user_access', function(req,res){
  user_access.getById(req.query.user_access_id, function(error,user_access){
    if(error !== null){
      res.json({"error":"Error getting user access"});
    }else{
      res.json(user_access);return;
    }
    
  })
});

// POST add user_access
app.post('/api/user_accesses', function(req,res){
  user_access.create(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({data:{user_access_id:response},success:"User access successfully added"});
    }
  });
});

// PUT update user_access
app.put('/api/user_accesses', function(req, res) {
  user_access.update(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({success:"User access successfully updated"});
    }
  });
});

// DELETE user_accesses
app.delete('/api/user_accesses', function(req,res){
  user_access.delete(req.query.ids, function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({data:{affected_rows:response},success:"User accesses successfully deleted"});
    }
  });
});

/*
 *      NAVIGATION
 */

// GET navigation
app.get('/api/navigation', function(req,res){
  navigation.get(function(err,items){
    if(err !== null){
      res.json({"error":"Error getting navigation"});
    }else{
      res.json(items);return;
    }
  });
});

/*
 *      LANGUAGES
 */

// GET languages
app.get('/api/languages', function(req,res){
  languages.get(function(err,languages) {
    if(err !== null){
      res.json({"error":"Error getting languages"});
    }else{
      res.json(languages);return;
    }
    
  })
});

// GET 1 language
app.get('/api/languages/language', function(req,res){
  languages.getById(req.query.lang_id, function(error,language){
    if(error !== null){
      res.json({"error":"Error getting language"});
    }else{
      res.json(language);return;
    }
    
  })
});

// GET all languages from JSON
app.get('/api/languages/all', function(req,res){
  languages.getAllLanguages(function(err,languages) {
    if(err !== null){
      res.json({"error":"Error getting languages"});
    }else{
      res.json(languages);return;
    }
    
  })
});

// POST add language
app.post('/api/languages', function(req,res){
  languages.create(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({data:{language_id:response},success:"Language successfully added"});
    }
  });
});

// PUT update language
app.put('/api/languages', function(req, res) {
  languages.update(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({success:"Language successfully updated"});
    }
  });
});

// DELETE languages
app.delete('/api/languages', function(req,res){
  languages.delete(req.query.ids, function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({data:{affected_rows:response},success:"Languages successfully deleted"});
    }
  });
});


/*
 *      PROJECTS
 */

// GET projects
app.get('/api/projects', function(req,res){
  projects.get(function(err,projects) {
    if(err !== null){
      res.json({"error":"Error getting projects"});
    }else{
      res.json(projects);return;
    }
    
  })
});

// GET 1 project
app.get('/api/projects/project', function(req,res){
  projects.getById(req.query.project_id, function(error,project){
    if(error !== null){
      res.json({"error":"Error getting project"});
    }else{
      res.json(project);return;
    }
    
  })
});

// POST add project
app.post('/api/projects', function(req,res){
  projects.create(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({data:{project_id:response},success:"Project successfully added"});
    }
  });
});

// PUT update project
app.put('/api/projects', function(req, res) {
  projects.update(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({success:"Project successfully updated"});
    }
  });
});

// DELETE projects
app.delete('/api/projects', function(req,res){
  projects.delete(req.query.ids, function(error,response){
    if(error !== null){
      res.json({"error":"error"});
    }
    if(response !== null) {
      res.json({data:{affected_rows:response},success:"Projects successfully deleted"});
    }
  });
});

/*
 *      STRINGS
 */

// GET strings
app.get('/api/strings', function(req,res){
  strings.get(parseInt(req.query.project_id),function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
      return;
    }

    res.json(response);return;
  })
});

// GET 1 string
app.get('/api/strings/string', function(req,res){
  strings.getById(parseInt(req.query.string_id), function(error,string){
    if(error !== null){
      res.json({"error":"Error getting string"});
    }else{
      res.json(string);return;
    }
    
  })
});

// POST add string
app.post('/api/strings', function(req,res){
  strings.create(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({data:{project_string_id:response},success:"String successfully added"});
    }
  });
});

// POST import
app.post('/api/strings/import', function(req,res){

  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname+"/uploads";
  form.keepExtensions = true;

  form.parse(req, function(err, fields, files) {
    if(err != null){
      res.json({"error":"error"}).end();return;
    }
    if(Object.keys(files).length == 0){
      res.status(404).end();return;
    }
    var file = {filename: files.strings.path, mime_type:files.strings.type};
    strings.import(fields,file,function(error,response){
      if(error !== null){
        res.json({"error":"error"});
        console.log(error);
        return;
      }

      res.status(200).json({data:{project_string_id:response},success:"Strings successfully imported"}).end();
    });
  });
});

// PUT update string
app.put('/api/strings', function(req, res) {
  strings.update(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({success:"String successfully updated"});
    }
  });
});

// PUT update sorting
app.put('/api/strings/sorting', function(req, res){
  strings.updateSorting(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({success:"Sorting successfully updated"});
    }
  });
});

// DELETE strings
app.delete('/api/strings', function(req,res){
  strings.delete(req.query.ids, function(error,response){
    if(error !== null){
      res.json({"error":"error"});
    }
    if(response !== null) {
      res.json({data:{affected_rows:response},success:"Strings successfully deleted"});
    }
  });
});

/*
 *      LOGS
 */

// GET logs
app.get('/api/logs', function(req,res){
  args = {"page": parseInt(req.query.page), "export":false};

  if(typeof req.query.period != "undefined")
    if (/^[a-z\-0-9]+$/.test(req.query.period)){
      args.period = req.query.period;
    }else{
      res.json({"error":"Validation error"});return;
    }

  if(typeof req.query.date_from != "undefined" && typeof req.query.date_to != "undefined"){
    if (/^[0-9\/]{10}$/.test(req.query.date_from) && /^[0-9\/]{10}$/.test(req.query.date_to)){
      args.date_from = req.query.date_from
      args.date_to = req.query.date_to
    }else{
      res.json({"error":"Validation error"});return;
    }
  }

  logs.get(args,function(error,response){
    if(error !== null){
      res.json({"error":error});return;
    }

    res.json(response);return;
  });
});

app.get('/api/logs/export',function(req,res){
  args = {"page": parseInt(req.query.page), "export": true};

  if(typeof req.query.period != "undefined")
    if (/^[a-z\-0-9]+$/.test(req.query.period)){
      args.period = req.query.period;
    }else{
      res.json({"error":"Validation error"});return;
    }

  if(typeof req.query.date_from != "undefined" && typeof req.query.date_to != "undefined"){
    if (/^[0-9\/]{10}$/.test(req.query.date_from) && /^[0-9\/]{10}$/.test(req.query.date_to)){
      args.date_from = req.query.date_from
      args.date_to = req.query.date_to
    }else{
      res.json({"error":"Validation error"});return;
    }
  }

  logs.get(args,function(error,response){
    if(error !== null){
      res.json({"error":error});return;
    }

    res.json({"data":{"filename":response},success:"Export file created"});return;
  });
});


/*
 *      UNIVERSAL STRINGS
 */

// GET universal strings
app.get('/api/universal_strings', function(req,res){
  universal_strings.get(function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
      return;
    }

    res.json(response);return;
  })
});

// GET 1 universal string
app.get('/api/universal_strings/universal_string', function(req,res){
  universal_strings.getById(parseInt(req.query.universal_string_id), function(error,string){
    if(error !== null){
      res.json({"error":"Error getting string"});
    }else{
      res.json(string);return;
    }
    
  })
});

// POST add universal string
app.post('/api/universal_strings', function(req,res){
  universal_strings.create(req.body,function(error,response){
    if(error !== null){
      error_obj = {"error":"error"};
      if(error == 'Universal String already exists')
        error_obj = {"error":error, data: {universal_string_id: response}};
      res.json(error_obj);
      console.log(error);
      return;
    }
    if(response !== null) {
      res.json({data:{universal_string_id:response},success:"Universal string successfully added"});
    }
  });
});

// PUT update universal string
app.put('/api/universal_strings', function(req, res) {
  universal_strings.update(req.body,function(error,response){
    if(error !== null){
      res.json({"error":"error"});
      console.log(error);
    }
    if(response !== null) {
      res.json({success:"Universal strings successfully updated"});
    }
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});