/*!
 * # 
 * @author wondger@qq.com
 * @date 2014-05-10
 */

/*!*/
var fs = require('fs');
var config = require('./config');
var mimiPkg = require('../package.json');
var mimiConfig;

if (!config.exists()) {
  config.create();
}

mimiConfig = config.read();
mimiConfig.apps = mimiConfig.apps || {};

exports.add = function(appname) {
  var pkg = require(process.cwd() + '/package.json');

  if (!mimiConfig.apps[appname]) {
    mimiConfig.apps[appname] = {
      name: pkg.name,
      path: process.cwd(),
      version: pkg.version,
      start: pkg.scripts && pkg.scripts.start || "",
      repository: pkg.repository,
      author: pkg.author,
      createTime: new Date(),
      mimiVersion: mimiPkg.version
    };

    config.create(JSON.stringify(mimiConfig, null, 2));
  }
  else {
    console.log("%s exists!", appname);
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
  console.log(appname);
  console.log(" package: %s", app.name);
  console.log(" author: %s", app.author);
  console.log(" path: %s", app.path);
  console.log(" version: %s", app.version);
  console.log(" repoType: %s", app.repository.type);
  console.log(" repoUrl: %s", app.repository.url);
  console.log(" lastDeploy: %s", app.lastDeploy || "");
};

exports.deploy = function(appname) {
  var app = mimiConfig.apps[appname];

  if (!app) {
    console.error("%s do not exists! Maybe you should add it first!", appname);
    return;
  }

  console.log(app.repository);
  console.log(app.path);

};
