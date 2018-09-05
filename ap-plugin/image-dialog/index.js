// 引用组件
import imageDialog from './main.vue';

imageDialog.install = function (Vue) {
  Vue.component(imageDialog.name, imageDialog);
};

export default imageDialog;

