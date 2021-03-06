//赋值全局变量
import './G.js';
//引入全局CSS
import 'muse-ui/dist/muse-ui.css';
import './ap-base/static/css/main.less';
//解决VUE不兼容IE问题
import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';

import routerConfig from './ap-base/router';
import store from './ap-base/store';
import i18n from "./i18n";
import {dialog, lang as langUtils, mask} from 'utils';
import './app';
import './comp.js';

Vue.use(VueRouter);

const router = new VueRouter({
  hashbang: false,
  mode: 'history',
  routes: routerConfig
});

new Vue({
  i18n,
  router,
  store,
  watch: {
    '$route': function () {
      dialog.clearDialog();
      mask.hideMask();
    }
  },
  created() {
    // 把Message对象添加到全局对象
    G.$message = this.$message;
    langUtils.setLanguage(this, langUtils.getLanguage(this));
  },
  mounted() {
    document.title = G.title || "UI平台";
  }
}).$mount('#app');

Vue.mixin({
  created() {
    mask.hideMask();
  }
});