/**
 * system本地资源配置
 */
var resource = [
  { id: '100', isActive: false, name: 'demo', open: false, icon: '&#xe61;', path: "/demo",
    children: [
      { id: '101', isActive: false, name: 'ODF', icon: '&#xe61;', path: "/odfView"},
      { id: '102', isActive: false, name: 'canvas', icon: '&#xe61;', path: "/canvas"},
    ]
  },
];

module.exports = resource;