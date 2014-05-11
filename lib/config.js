/*!
 * # 
 * @author wondger@qq.com
 * @date 2014-05-10
 */

/*!*/

var fs = require('fs');
var pkg = require('../package.json');
var configPath = process.env.HOME + "/.mimi";

exports.exists = function() {
  return fs.existsSync(configPath);
};

exports.create = function(data) {
  var defaultData = {
    version: pkg.version,
    description: "This is mimi(https://github.com/4simple/mimi) configure file. Please don't delete!"
  };
  data = data || JSON.stringify(defaultData, null, 4);
  fs.writeFileSync(configPath, data, {encoding: "utf-8"});
};

exports.read = function() {
  var content = fs.readFileSync(configPath, {encoding: "utf-8"});
  return JSON.parse(content);
};
