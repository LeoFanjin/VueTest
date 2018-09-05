var APP_CONFIG = {
  /* 开发环境 */
  development: {
    "system_code": '22c8ef91873fa4389b5300bdd3d155be',
    "base_api": "http://60.28.140.210:10102/iiprp",  //新API地址
    // "base_api": "http://iiprp.vipgz1.idcfengye.com/iiprp_manage",  //新API地址
    // "base_api": "http://xiaoxingmu.free.ngrok.cc/iiprp",  //新API地址
    // "base_api": "http://192.168.125.123:8081/iiprp",
    "userManual": [
      {
        docName: '举报信息管理子系统-用户使用手册.doc',
        address: 'http://10.20.30.220:80/group24/M00/02/88/ChQeVlo4g_GAJHbbAFjcAJUcwhk772.doc'
      }
    ],
    "title": "举报管理中心",
    "showLogo": true                                        //是否显示logo
  },
  /* 测试环境 */
  staging: {
    "system_code": '22c8ef91873fa4389b5300bdd3d155be',
    "base_api": "http://60.28.140.210:10102/iiprp",  //新API地址
    "userManual": [
      {
        docName: '举报信息管理子系统-用户使用手册.doc',
        address: 'http://10.20.30.220:80/group24/M00/02/88/ChQeVlo4g_GAJHbbAFjcAJUcwhk772.doc'
      }
    ],
    "title": "举报管理中心",
    "showLogo": true
  },
  /* 生产环境 */
  production: {
    "system_code": '22c8ef91873fa4389b5300bdd3d155be',
    "base_api": "http://10.20.20.240:8010/iiprp",  //新API地址
    "userManual": [
      {
        docName: '举报信息管理子系统-用户使用手册.doc',
        address: 'http://10.20.30.220:80/group24/M00/02/88/ChQeVlo4g_GAJHbbAFjcAJUcwhk772.doc'
      }
    ],
    "title": "举报管理中心",
    "showLogo": true
  }
};
