
//组件
import canvasDoodle from './canvas-doodle/index.js';
import imageDalog from './image-dialog/index.js';
// import videoDialog from './video-dialog/index.js';
import popover from './popover/index.js';
//自定义指令
import onceTip from './directive/onceTip';
import contentTip from './directive/contentTip';

const components = [
  // imageDalog, videoDialog, popover
  canvasDoodle, imageDalog, popover
];

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  });
  Vue.directive('once-tip', onceTip);
  Vue.directive('content-tip', contentTip);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = {
  install
};
