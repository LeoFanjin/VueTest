/**
 * system本地资源配置
 */
var resource = [
  { id: '100', isActive: false, name: 'demo', open: false, icon: '&#xe61;', path: "/demo",
    children: [
      { id: '101', isActive: false, name: 'ODF', icon: '&#xe61;', path: "/odfView"},
      { id: '102', isActive: false, name: 'H5', icon: '&#xe61;', path: "/h5"},
      { id: '103', isActive: false, name: 'canvas', icon: '&#xe61;', path: "/canvas"},
      { id: '104', isActive: false, name: 'selector', icon: '&#xe61;', path: "/selector"},
      { id: '105', isActive: false, name: 'Magic Cube', icon: '&#xe61;', path: "/cube"},
      { id: '106', isActive: false, name: 'Axios', icon: '&#xe61;', path: "/axios"}
    ]
  },
];

module.exports = resource;
