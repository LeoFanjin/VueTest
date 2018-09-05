/**
 * v-content-tip 参数说明：必须加引号
 * <mu-text-field v-content-tip="{message: '文字提示',icon : 'icon-ap-prompt',top: '40', right: '0', id: '2'}" />
 * message:提示信息
 * icon: 图标
 * top:
 * left:
 * right:
 * bottom:
 */
import './style.less';
var contentTip = {
  bind: function (el, binding, vnode) {
    el.style.position = 'relative';

    var tip = document.createElement('div');
    var html = '';
    var content = `<span style="display:none;">${binding.value.message}</span>`;
    var iHtml = '',id = `content_tip_${binding.value.id}`;
    var icon = binding.value.icon ? binding.value.icon : 'icon-ap-prompt';
    tip.className = 'content-tip-s';
    tip.id = id;
    tip.style.top = binding.value.top ? binding.value.top + 'px' : '';
    tip.style.bottom = binding.value.bottom ? binding.value.bottom + 'px' : '';
    tip.style.width = (binding.value.message.length * 12 + 20) + 'px';
    if (binding.value.left) {
      tip.style.left = binding.value.left ? binding.value.left + 'px' : '';
      tip.style.textAlign = 'right';
      iHtml = `<i onmouseenter="javascript: $('#${id} span').fadeIn(300)" onmouseleave="javascript: $('#${id} span').fadeOut(300)" class="icon iconfont ${icon}"></i>`;
      html = `${content}&nbsp;${iHtml}`;
    } else if (binding.value.right) {
      tip.style.right = binding.value.right ? binding.value.right + 'px' : '';
      tip.style.textAlign = 'left';
      iHtml = `<i onmouseenter="javascript: $('#${id} span').fadeIn(300)" onmouseleave="javascript: $('#${id} span').fadeOut(300)" class="icon iconfont ${icon}"></i>`;
      html = `${iHtml}&nbsp;${content}`;
    } else {
      tip.style.textAlign = 'right';
      iHtml = `<i onmouseenter="javascript: $('#${id} span').fadeIn(300)" onmouseleave="javascript: $('#${id} span').fadeOut(300)" class="icon iconfont ${icon}"></i>`;
      html = `${iHtml}&nbsp;${content}`;
    }
    tip.innerHTML = html;
    $(el).append($(tip));
  }
};

module.exports = contentTip;