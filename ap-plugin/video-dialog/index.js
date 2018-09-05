// 引用组件
import videoDialog from './main.vue';

videoDialog.install = function (Vue) {
  Vue.component(videoDialog.name, videoDialog);
};

export default videoDialog;

