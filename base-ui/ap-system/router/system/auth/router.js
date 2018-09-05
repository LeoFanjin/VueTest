const sysAuthMgr = resolve => require(['./main.vue'], resolve);

module.exports = {
  path: "/system/authManage",
  component: sysAuthMgr
};