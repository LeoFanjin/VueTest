/**
 * 参数说明：
 * message: 提示信息
 * top: 提示信息相对绑定元素（左上角点）距离顶部距离
 * left: 提示信息相对绑定元素（左上角点）距离左部距离
 * id: 任意值（不能重复）
 * 例子用法：<div v-once-tip="{message: 'div块的提示信息', top: '125', left: '290', id: '2'}">div块</div>
 */
var onceTip = {
  componentUpdated: function (el, binding, vnode) {
    if ($("#tip_" + binding.value.id).length > 0) {
      destroye(el, binding, vnode);
    } else {
      drawTip(el, binding, vnode);
    }
  },
  inserted: function (el, binding, vnode) {
    if ($("#tip_" + binding.value.id).length == 0) {
      drawTip(el, binding, vnode);
    }
  },
  unbind: function (el, binding, vnode) {
    destroye(el, binding, vnode);
  }
};

function destroye(el, binding, vnode) {
  $("#tip_" + binding.value.id).html('');
  $("#tip_" + binding.value.id).attr('style', '');
  $("#canvas_" + binding.value.id).remove();
}
function drawTip(el, binding, vnode) {
  var x = $(el).offset().left;
  var y = $(el).offset().top;
  el.style.position = 'relative';
  try {
    if (binding.value.message && binding.value.top && binding.value.left) {
      //画出div
      var tip = document.createElement('div');
      tip.id = 'tip_' + binding.value.id;
      tip.style.height = '22px';
      tip.style.position = 'absolute';
      tip.style.borderRadius = '4px';
      tip.style.boxShadow = '0 0 2px #3d3d3d';
      tip.style.backgroundColor = '#fff';
      tip.style.fontSize = '12px';
      tip.style.zIndex = '9999';
      tip.style.padding = '1px 3px';

      if (Number(binding.value.top) > 0) {
        tip.style.top = `${$(el).height() + (Number(binding.value.top))}px`;
      } else {
        tip.style.top = `${-22 + (Number(binding.value.top))}px`;
      }
      tip.style.left = `${$(el).width() + Number(binding.value.left)}px`;
      tip.style.width = binding.value.message.length * 12 + 'px';
      tip.innerHTML = binding.value.message;
      el.appendChild(tip);

      //创建画布
      var line = document.createElement('canvas');
      line.id = 'canvas_' + binding.value.id;
      line.width = $(el).width() + Number(binding.value.left) + $(tip).width();
      line.height = Number(binding.value.top) > 0 ? Number(binding.value.top) : -Number(binding.value.top);
      line.style.position = 'absolute';
      if (Number(binding.value.top) > 0) {
        line.style.top = $(el).height() + 'px';
      } else {
        line.style.top = binding.value.top + 'px';
      }
      line.style.left = '0';
      el.appendChild(line);

      //划线
      var canvas = document.getElementById("canvas_" + binding.value.id);
      var context = canvas.getContext("2d");
      if (Number(binding.value.top) > 0) {
        context.moveTo($(el).width() / 2, 0);
        context.lineTo($(el).width() + Number(binding.value.left) + $(tip).width() / 2, binding.value.top);
      } else {
        context.moveTo($(el).width() / 2, -Number(binding.value.top));
        context.lineTo($(el).width() + Number(binding.value.left) + $(tip).width() / 2, 0);
      }
      context.lineWidth = 0.2;
      context.strokeStyle = "#000";
      context.stroke();
    }
  } catch (e) {
    console.log(e);
  }
}
module.exports = onceTip;