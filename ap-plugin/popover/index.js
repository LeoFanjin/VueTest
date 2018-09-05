// 引用组件
import popover from './main.vue';

popover.install = function (Vue) {
  Vue.component(popover.name, popover);
};

export default popover;

