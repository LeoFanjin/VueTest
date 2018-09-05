var Message = require('./main');

/**
 * 指令插件
 */
var MessageBox = {};
MessageBox.install = function (Vue) {
  //权限验证指令
  Vue.prototype.$confirm = function (content, title, opt) {
    return Message.confirm(content, title, opt);
  };
};

module.exports = MessageBox;