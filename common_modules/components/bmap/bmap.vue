<style scoped lang="less" src="./bmap.less"></style>
<style>
  .sinosoft_bmap .imageOverlayDiv {
    position: absolute;
  }

  .sinosoft_bmap .imageOverlayDiv .imageOverlayDiv1 {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 20000003;

    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;

    cursor: pointer;

    border: 1px solid #3bafdb;
  }

  .sinosoft_bmap .imageOverlayDiv .imageOverlayDivShadow1 {
    position: absolute;
    left: 7px;
    bottom: 6px;
    background-color: #f1f1f1;
    border: 1px solid #e2e2e2;
    z-index: 20000002;
  }

  .sinosoft_bmap .imageOverlayDiv .imageOverlayDivShadow2 {
    position: absolute;
    left: 14px;
    bottom: 12px;
    background-color: #f1f1f1;
    border: 1px solid #e2e2e2;
    z-index: 20000001;
  }

  .sinosoft_bmap .imageOverlayDiv:before {
    content: "";
    border-top: 10px solid #3bafdb;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    font-family: FontAwesome;
    display: block;
    position: absolute;
    right: 45%;
    bottom: -10px;
    font-size: 20px;
    color: #eee;
  }
</style>
<template>
  <div :id="id" class="sinosoft_bmap"></div>
</template>

<script>
  import ImageOverlay from "./overlay/imageOverlay";

  module.exports = {
    props: {
      zoom: {
        type: Number,
        default: 15
      },
      center: {
        type: Array,
        default: [87.52713404443502, 43.00487174643814]
      },
      controls: {
        type: Array,
        default: ["SCALE_CONTROL"]
      }
    },
    data() {
      return {
        id: 'sinosoft_bmap_',
        map: null,
        config: {
          controls: {
            SCALE_CONTROL: "SCALE_CONTROL"
          }
        }
      }
    },
    created() {
      this.id = this.id + Date.now() + Math.random() * 9 + 1;
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        var self = this;

        self.map = new BMap.Map(this.id);                               // 创建地图实例
        self.setCenter();
        self.enableScrollWheelZoom();

        self.controls.forEach(function (item) {
          self.addUtils(item);
        });
      },
      enableScrollWheelZoom(){
        var self = this;
        self.map.enableScrollWheelZoom();
      },
      /**
       设置中心点
       @param xCoordinate X坐标
       @param yCoordinate Y坐标
       @param zoom 缩放
       */
      setCenter(xCoordinate, yCoordinate, zoom){
        var self = this;

        var point = new BMap.Point(xCoordinate || self.center[0], yCoordinate || self.center[1]);  // 创建点坐标
        self.map.centerAndZoom(point, zoom || self.zoom);                // 初始化地图，设置中心点坐标和地图级别
      },
      /**
       * 添加工具
       * @param control
       */
      addUtils(control){
        var self = this;

        switch (control) {
          case self.config.controls.SCALE_CONTROL:
            self.map.addControl(new BMap.ScaleControl());
            break;
        }
      },
      /**
       * 添加消息窗体
       */
      addInfoWindow(obj) {
        var self = this;

        var infoWindow = new BMap.InfoWindow(obj, {
          enableCloseOnClick: false
        });
        self.map.openInfoWindow(infoWindow, self.map.getCenter());      // 打开信息窗口
      },

      /**
       * 添加标记点
       */
      addMarkPoints(point = this.map.getCenter()){
        var self = this;

        var marker = new BMap.Marker(point);        // 创建标注
        self.map.addOverlay(marker);                     // 将标注添加到地图中
//                var myIcon = new BMap.Icon("/common_modules/bmap/image/marker.png", new BMap.Size(23, 25), {
//                    offset: new BMap.Size(10, 25)
//                });
//// 创建标注对象并添加到地图
//                var marker = new BMap.Marker(point, {icon: myIcon});
//                self.map.addOverlay(marker);
      },
      addImageOverlay(point, imagePath){
        var self = this;

        var imageOverlay = new ImageOverlay(point, 80, imagePath[0].uploadAddress, function (e) {
          self.$emit("clickImageOverlay", imagePath);
          e.stopPropagation();
        });
        self.map.addOverlay(imageOverlay);
      }
    }
  };
</script>


