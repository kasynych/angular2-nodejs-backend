'use strict';

var items = function(){
    this.users = {"title":"Users","href":"/users","subitems":[]};
    this.user_access = {"title":"User access","href":"/user-access","subitems":[]};
    this.translations = {"title":"Translations","href":"/translations","subitems":[]};
    this.logs = {"title":"Logs","href":"/logs","subitems":[]};
    this.languages = {"title":"Languages","href":"/languages","subitems":[]};
    this.projects = {"title":"Projects","href":"/projects","subitems":[]};
    this.strings = {"title":"Strings","href":"javascript:void(0)","subitems":[]};
    this.logout = {"title":"Logout","href":"/logout","subitems":[]};
}

module.exports.get = (cb) => {
  const projects = require('./projects.js');

  projects.get(function(error,results){
    var ret_items = new items();
    if(error !== null)
      cb("Projects not found: "+error,null);
    else if(results.length > 0){
      ret_items.strings.href="/strings/project/"+results[0].project_id;
      for(var i in results){
        ret_items.strings.subitems.push({"title":results[i].project_name,"href":"/strings/project/"+results[i].project_id});
      }
    }
    cb(null,ret_items);
  })
};