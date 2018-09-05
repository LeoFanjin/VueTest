import _ from 'underscore';
import {myBrowser} from 'utils';

G = _.extend(G, {
  env: 'development',
  errorPage: '/error',
  lang: 'zh',
  messageLock: false,
  isRelyAPI: false,
  homePage: '/home',
  loginPage: '/login',
  storage_key: 'storage_key',
  options_key: 'options_key',
  lang_key: 'lang_key',
  new_base_api: '',
  title: '',
  showLogo: true,
  $message: null,
  maskLevel: 0,

});

G = _.extend(G, _config_);
G = _.extend(G, APP_CONFIG[_config_.env]);

if (myBrowser() === "Safari" && G.supportSafari) {
  let urlArray = G.base_api.split("/");
  let base_api = window.location.protocol + "//" + window.location.host;
  if (urlArray.length >= 4) {
    base_api += "/" + urlArray[3];
  }
  G.base_api = base_api;
}

if (!G.isRelyAPI) {
  G.localResource = require('./ap-base/local-resources');
}