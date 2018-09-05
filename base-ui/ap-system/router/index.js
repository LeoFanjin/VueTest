module.exports = {
  index: resolve => require(['./index.vue'], resolve),
  login: require('./login/router'),
  _404: require('./404/router'),
  children: [
    //home
    require("./home/router"),
    //404
    require("./error/404/router"),

    //system
    require("./system/organ/router"),
    require("./system/resource/router"),
    require("./system/dict/router"),
    require("./system/auth/router"),

    //release
    require("./release/router")
    //personal
    // require("./personal/router")
  ]
};
