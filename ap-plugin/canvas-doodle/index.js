// 引用组件
import canvasDoodle from './main.vue';

canvasDoodle.install = function (Vue) {
  Vue.component(canvasDoodle.name, canvasDoodle);
};

export default canvasDoodle;

