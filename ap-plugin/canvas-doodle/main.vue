<!--视频播放弹出组件-->
<style scoped lang="less" src="./style.less"></style>
<style src="./inc/wColorPicker.css"></style>
<style src="./wPaint.css"></style>

<template>
  <div id="canvas_doodle" v-show="showCanvas" v-loading="vLoad">
    <div id="wPaint"></div>
    <div class="btn-group">
      <div @click="saveImage">
        <i class="icon iconfont icon-ap-save1"></i>
      </div>
      <div @click="closeDoodle">
        <i class="icon iconfont icon-ap-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import './inc/jquery.1.9.1.min.js';
  import './inc/jquery.ui.core.min.js';
  import './inc/jquery.ui.widget.min.js';
  import './inc/jquery.ui.mouse.min.js';
  import './inc/jquery.ui.draggable.min.js';
  import './inc/wColorPicker.js';
  import './wPaint.js';
  export default {
    name: 'canvas-doodle',
    computed: {

    },
    components: {
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      image: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showCanvas: false,
        imageUrl: '',
        evidenceId: '',
        result: {},
        error: '',
        vLoad: true
      }
    },
    watch: {
      "show": function () {
        var self = this;
        self.error = '';
        self.result = {};
        if (self.show) {
          $.post(G.public_api + '/evidence/findURL', { url: self.image },
            function (result) {
              if (result.data.url) {
                self.showCanvas = true;
                $.post(G.public_api + '/evidence/getImageBase64', { url: result.data.url }, function (result2) {
                  if (result2.status == 1) {
                    self.imageUrl = 'data:image/png;base64,' + decodeURI(result2.data);
                    self.evidenceId = result.data.evidenceId;
                    self.init();
                  } else {
                    self.error = '取证失败，请检查网址';
                    self.closeDoodle();
                  }
                });
              } else {
                self.error = '取证失败，请检查网址';
                self.closeDoodle();
              }
            });

        } else {
          document.documentElement.style.overflowY = 'auto';
        }
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {
      init() {
        var self = this;
        document.documentElement.style.overflowY = 'hidden';
        self.getImageWidth(self.imageUrl, function (w, h) {
          $("#wPaint").wPaint({
            image: self.imageUrl,
            imageHeight: h,
            imageWidth: w,
          }).data('_wPaint');

          $(window).resize(function () {
            var width = w;
            var height = h;
            $('#wPaint').css({
              width: width,
              height: height
            });
            var wp = $("#wPaint").data('_wPaint');
            $(wp.canvas).attr('width', width + 'px').attr('height', height + 'px');
          })
          $(document).ready(function () { $(window).resize(); });
        });
      },
      closeDoodle() {
        $("#wPaint").children().remove();
        this.showCanvas = false;
        this.$emit('close', this.result, this.error);
      },
      saveImage() {
        var self = this;
        var imageData = $("#wPaint").wPaint("image").split(',')[1];
        imageData = imageData.replace(/\+/g, "＋");
        imageData = imageData.replace(/\//g, "／");
        $.post(G.public_api + '/evidence/save', {
          id: self.evidenceId, url: self.image, imageStr: imageData
        },
          function (result) {
            if (result.data) {
              if (result.data.eUrl) {
                self.result = { sUrl: result.data.esUrl, bigUrl: result.data.eUrl };
              }
              self.closeDoodle();
            } else {
              self.$message.error('保存失败');
            }
          });
      },

      getImageWidth(url, callback) {
        var img = new Image();
        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
          callback(img.width, img.height);
        } else {
          // 完全加载完毕的事件
          img.onload = function () {
            callback(img.width, img.height);
          }
        }
      },
      //uncode码转换
      tounicode(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
          let uncode = parseInt(data[i].charCodeAt(0), 10).toString(16);
          let bw = '';
          for (let j = 0; j < 4 - uncode.length; j++) {
            bw += '0';
          }
          str += "\\u" + bw + uncode;
        }
        return str;
      },
      tohanzi(data) {
        data = data.split("\\u");
        var str = '';
        for (var i = 0; i < data.length; i++) {
          str += String.fromCharCode(parseInt(data[i], 16).toString(10));
        }
        return str;
      },


      base64encode(str) {
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var base64DecodeChars = new Array(
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
          52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
          -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
          15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
          -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
          41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
          c1 = str.charCodeAt(i++) & 0xff;
          if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
          }
          c2 = str.charCodeAt(i++);
          if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
          }
          c3 = str.charCodeAt(i++);
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
          out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
      }
    }
  }
</script>