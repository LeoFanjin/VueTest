module.exports = {
  // 显示蒙板
  //level 默认为 0
  showMask(level) {
    if (level) {
      G.maskLevel = level;
    }
    $("#sinosoft_mask").show();
  },
  // 隐藏蒙板
  hideMask(level) {
    var hide = function () {
      $("#sinosoft_mask").hide();
      G.maskLevel = 0;
    };

    if (level) {
      if (level > G.maskLevel) {
        hide();
      }
    } else {
      hide();
    }
  }
};
