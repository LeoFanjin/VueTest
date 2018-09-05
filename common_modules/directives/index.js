var permissions = require('./permissions');
var button = require('./rippleria');
var tip = require('./tip');
var login = require('./login');
var clickoutside = require('./clickoutside');
/**
 * 指令插件
 */
var Directives = {};
Directives.install = function (Vue) {
  //权限验证指令
  Vue.directive('permissions', permissions);
  //按钮点击动画
  Vue.directive('ap-btn', button);
  //tip提示
  Vue.directive('ap-tip', tip);
  //placeholder兼容
  Vue.directive('placeholder', login);
  //权限验证指令
  Vue.directive('clickoutside', clickoutside);
};

module.exports = Directives;
