/**
 * system本地资源配置
 */
var resource = [
  {
    id: '0', isActive: false, name: '系统管理', path: '', open: false, icon: 'icon-ap-navsetting',
    children: [
      { id: "002", isActive: false, name: "资源管理", path: "/system/resourceManage", hide: true, icon: 'icon-ap-menu' },
      { id: "003", isActive: false, name: "字典管理", path: "/system/dictManage", hide: true, icon: 'icon-ap-dictionary' },
      { id: "004", isActive: false, name: "权限管理", path: "/system/authManage", hide: true, icon: 'icon-ap-auth' },
      { id: "005", isActive: false, name: "组织机构管理", path: "/system/organManage", hide: true, icon: 'icon-ap-organization' }
    ]
  }
];

module.exports = resource;
