// 引用组件
import echartsBar from './main.vue';

echartsBar.install = function (Vue) {
  Vue.component(echartsBar.name, echartsBar);
};

export default echartsBar;

