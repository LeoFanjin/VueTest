import Vue from 'vue';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const requireComponent = require.context('.', false, /\.vue$/);
console.log('requireComponent',requireComponent);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  //fileName的格式是'./baseButton.vue'，所以去掉头和尾，只保留真正的文件名
  const componentName = capitalizeFirstLetter(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''));
  Vue.component(componentName, componentConfig.default || componentConfig);
});