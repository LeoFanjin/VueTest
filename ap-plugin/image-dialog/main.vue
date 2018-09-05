<!--视频播放弹出组件-->
<style scoped lang="less" src="./style.less"></style>
<style>
</style>
<template>
  <div id="image_dialog" v-show="show">
    <!-- <i class="close-box icon iconfont icon-ap-close" @click="closeImage"></i> -->
    <div v-show="show">
      <div class="col-xs-12 image-dialog-box" style="height: 650px;padding:0;">
        <div :class="{'col-xs-10': isShowInfo,'col-xs-11': !isShowInfo}" class="img-box" style="padding:0;width: 1030px;margin-right:20px;" align="center">
          <img :src="getShowImage" />
        </div>
        <div v-show="isShowInfo" class="col-xs-2 desc-info">
          <slot name="desc"></slot>
        </div>
      </div>

      <div v-if="listVertical" class="col-xs-12 img-list" align="center" :style="{'height': listHeight + 'px'}">
        <div class="images-box" id="imagesVerticalBox">
          <div style="width: 2000px">
            <div class="images" v-for="(image,index) in items" :class="{'active':showItem == index}" @click="showItem = index">
              <img :id="'image_'+index" :src="image" />
            </div>
          </div>
          <div class="tip-page left" @click="changeIndex('last')">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="tip-page right" @click="changeIndex('next')">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>

      <div v-if="listHorizontal" class="col-xs-1 img-hor-list" align="center" style="height: 650px;width: 150px;padding: 0;">
        <div class="images-box" id="imagesHorizontalBox">
          <div style="height: 650px;padding-top: 25px;">
            <div class="images" v-for="(image,index) in items" :class="{'active':showItem == index}" @click="showItem = index">
              <img :id="'image_'+index" :src="image" />
            </div>
          </div>
          <div class="tip-page left" @click="changeIndex('last')">
            <i class="el-icon-arrow-up"></i>
          </div>
          <div class="tip-page right" @click="changeIndex('next')">
            <i class="el-icon-arrow-down"></i>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  export default {
    name: 'image-dialog',
    computed: {
      getShowImage() {
        var self = this;
        var imageUrl = self.items[self.showItem];
        // if (self.listVertical) {
        //   $("#imagesVerticalBox").animate({ scrollLeft: self.showItem * 90 }, 200);
        // }
        // if (self.listHorizontal) {
        //   $("#imagesHorizontalBox").animate({ scrollTop: self.showItem * 90 }, 200);
        // }
        return imageUrl;
      }
    },
    components: {
    },
    props: {
      show: {//显示图片放大
        type: Boolean,
        default: true
      },
      items: {//图片数组
        type: Array,
        default: []
      },
      showItem: {//当前放大图片所在数组下标
        type: Number,
        default: 0
      },
      listVertical: {//是否横向显示列表 
        type: Boolean,
        default: false
      },
      listHorizontal: {//是否垂直显示列表 
        type: Boolean,
        default: false
      },
      isShowInfo: {//是否显示详细信息
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showImage: '',
        listHeight: 0,
        subHeight: 0,
        windowHeight: 0
      }
    },
    watch: {
      "show": "init",
      "showItem": function () {
        this.$emit('showIndex', this.showItem);
      }
    },
    created() {
      this.windowHeight = $(window).height() - 20;
    },
    mounted() {
      // this.addScroll();
    },
    methods: {
      init() {
        if (this.show) {
          document.documentElement.style.overflowY = 'hidden';
        } else {
          document.documentElement.style.overflowY = 'auto';
        }
        this.listHeight = this.listVertical ? 90 : 0;
        this.subHeight = this.listVertical ? 70 : -20;
      },
      closeImage() {
        this.show = false;
        this.$emit('close');
      },
      changeIndex(control) {
        if (control == 'next') {
          this.showItem = this.items.length - 1 == this.showItem ? this.showItem : this.showItem + 1;
        } else {
          this.showItem = this.showItem == 0 ? this.showItem : this.showItem - 1;
        }
      },
      addScroll() {
        var self = this;
        var i = 0;
        var scrollFunc = function (e) {
          if (!self.listVertical && !self.listHorizontal) return;
          e = e || window.event;
          if (e.wheelDelta) {
            if (e.wheelDelta > 0) {
              ++i;
              if (i % 2 == 0) self.changeIndex('last');
            }
            if (e.wheelDelta < 0) {
              ++i;
              if (i % 2 == 0) self.changeIndex('next');
            }
          } else if (e.detail) {
            if (e.detail > 0) {
              if (i % 2 == 0) self.changeIndex('next');
            }
            if (e.detail < 0) {
              if (i % 2 == 0) self.changeIndex('last');
            }
          }
        }
        if (document.addEventListener) {
          document.addEventListener('DOMMouseScroll', scrollFunc, false);
        }
        window.onmousewheel = document.onmousewheel = scrollFunc;
      }
    }
  }
</script>