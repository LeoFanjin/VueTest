module.exports = {
  clearDialog: function () {
    //解决bootstrap模态框路由切换，遮罩层不消失问题
    $('.modal-backdrop.fade.in').size() > 0 ? $('.modal-backdrop.fade.in').remove() : null;
    if ($(".dialog-open").size() > 0) {
      $(".dialog-open").removeClass("modal-open");
      $("body").css("padding-right", "0px");
    }
  }
};
