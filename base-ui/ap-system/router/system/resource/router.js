const sysresourceMgr = resolve => require(['./main.vue'], resolve);

module.exports = {
  path: "/system/resourceManage",
  component: sysresourceMgr
};