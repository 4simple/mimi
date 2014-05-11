/*!
 * # 
 * @author wondger@qq.com
 * @date 2014-05-10
 */

/*!*/
var fs = require('fs'),
    colors = require('colors'),
    exec = require('child_process').exec;

var config = require('./config'),
    mimiPkg = require('../package.json'),
    mimiConfig;

if (!config.exists()) {
  config.create();
}

mimiConfig = config.read();
mimiConfig.apps = mimiConfig.apps || {};

exports.add = function(appname, startfile) {
  var pkg = require(process.cwd() + '/package.json');

  if (!mimiConfig.apps[appname]) {
    mimiConfig.apps[appname] = {
      name: pkg.name,
      path: process.cwd(),
      version: pkg.version,
      start: pkg.scripts && pkg.scripts.start || "",
      startfile: startfile || "app.js",
      repository: pkg.repository,
      author: pkg.author,
      createTime: new Date(),
      mimiVersion: mimiPkg.version
    };

    config.create(JSON.stringify(mimiConfig, null, 2));
  }
  else {
    console.error("%s exists!".red, appname);
  }

};

exports.remove = function(appname) {
  if (mimiConfig.apps[appname]) {
    delete mimiConfig.apps[appname];
    config.create(JSON.stringify(mimiConfig, null, 2));
  }
  else {
    console.log("%s does not exist!", appname);
  }
};

exports.list = function(appname) {
  for (var appname in mimiConfig.apps) {
    exports.info(appname);
  }
};

exports.info = function(appname) {
  var app = mimiConfig.apps[appname];

  if (!app) {
    console.error("Sorry, %s do not exist!", appname);
    return;
  }

  console.log(appname);
  console.log(" package: %s", app.name);
  console.log(" author: %s", app.author);
  console.log(" path: %s", app.path);
  console.log(" starfile: %s", app.startfile);
  console.log(" version: %s", app.version);
  console.log(" repoType: %s", app.repository.type);
  console.log(" repoUrl: %s", app.repository.url);
  console.log(" lastDeploy: %s", app.lastDeploy || "");
};

exports.deploy = function(appname) {
  var app = mimiConfig.apps[appname];

  if (!app) {
    console.error("%s do not exist!", appname);
    console.info("Maybe you should add it first");
    console.info("  mimi add %s'!", appname)
    return;
  }

  if (!app.repository || !app.repository.type === "git" || !app.repository.url) {
    console.error("%s repository config error!", appname);
    console.info("Maybe you need to check the app config", appname);
    console.info("mimi info %s", appname);
    return;
  }

  exec("git pull " + app.repository.url, {"cwd": app.path}, function(err, stdout, stderr) {
    if (err) {
      console.error("Oh, %s deploy failed!", appname);
      console.error(err);
      return;
    }

    console.info("%s deploy start...", appname);
    console.info("Sync repository...");
    console.info(stdout);

    var startCommand = app.start ? app.start : "node app.js";

    exec(startCommand, {"cwd": app.path}, function(err, stdout, stderr) {
      if (err) {
        console.error("Oh, %s deploy failed!", appname);
        console.error(err);
        return;
      }

      console.info("Start app...");
      console.info(stdout);
    });
  });
};
