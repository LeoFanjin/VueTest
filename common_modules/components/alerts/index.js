/**
 * alert(Message)
 * Element-UI  message组件封装
 * 3秒内不能重复弹出
 */
var Message = {};
Message.install = function (Vue) {
  var $message = Vue.prototype.$notify;
  var Message = function (options) {
    var opt = {};
    if (options.type) {
      opt = options;
      opt.onClick = function () {
        this.close();
      };
    } else {
      if (options.message) {
        opt = options;
      } else {
        opt.message = options;
      }
      opt.type = "info";
      opt.onClick = function () {
        this.close();
      };
    }
    $message(opt);
  };

  ['success', 'warning', 'info', 'error'].forEach(type => {
    Message[type] = options => {
      if (!G.messageLock) {
        G.messageLock = true;
        setTimeout(() => {G.messageLock = false;}, 500);
        var opt = {
          message: options,
          onClick: function () {
            this.close();
          }
        };
        return $message[type](opt);
      }
    };
  });

  Message.close = function (id, userOnClose) {
    G.messageLock = false;
    $message.close(id, userOnClose);
  };

  Message.closeAll = function () {
    $message.closeAll();
  };
  Vue.prototype.$message = Message;
};

module.exports = Message;
