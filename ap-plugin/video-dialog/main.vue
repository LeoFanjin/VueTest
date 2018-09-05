<!--视频播放弹出组件-->
<style scoped lang="less" src="./style.less"></style>
<style>
  .video-js{
    width: 100%!important;
  }
  .video-js .vjs-big-play-button{
    top: 45%;
    left: 45%;
  }
</style>
<template>
  <div id="video_dialog" v-show="show">
    <transition name="slide-fade">
      <div v-show="show" class="video-dialog-box">
        <i class="close-box icon iconfont icon-ap-close" @click="closeVideo"></i>
        <div :class="{'col-xs-9': isScreen,'col-xs-12': !isScreen}">
          <video-player
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            :style="{'width': boxStyle.width}"
          ></video-player>
        </div>
        <div id="screenRight" class="col-xs-3 screen-right" v-show="isScreen">
          <div class="screen-right-box" v-for="(video,index) in items" :class="{'active': index == showItem}" @click="changeItem(index)">
            <div class="img-box">
                <img :src="video.image">
              </div>
              <div class="img-info" :style="{'width': (boxStyle.width*.25)-100 + 'px'}">
                <span>
                  {{video.infoTitle}}
                </span>
              </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { videoPlayer } from 'vue-video-player';
  
  export default {
    name: 'video-dialog',
    computed: {
      
    },
    components: {
      videoPlayer
    },
    props: {
      /**
       * 显示隐藏
      */
      show: {
        type: Boolean,
        default: false
      },
      /**
       * 视频数组
      */
      items: {
        type: Array,
        default: []
      },
      /**
       * 选中视频下标
      */
      showItem: {
        type: Number,
        default: 0
      },
      /**
       * 是否左右分屏显示
      */
      isScreen: {
       type: Boolean,
       default: false 
      }
    },
    data () {
      return {
        playerOptions: {
          autoplay: false,
          sources: [{
            // mp4
            // type: 'video/mp4',
            // src: 'http://vjs.zencdn.net/v/oceans.mp4',
            // flv
            type: 'video/x-flv',
            src: 'http://fms.cntv.lxdns.com/live/flv/channel96.flv'
          }],
          language: 'zh-CN',
          techOrder: ['flash'],
          poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-6.jpg",
          height: 0
        },
        boxStyle: {
          height: '',
          width: ''
        }
      }
    },
    watch: {
      'show': function(){
        this.$refs.videoPlayer.initialize();
        this.boxStyle.height = $('.video-dialog-box').height();
        this.playerOptions.height = $('.video-dialog-box').height();
        if(this.isScreen){
          this.boxStyle.width = $('.video-dialog-box').width()*.74 + 'px';
        }else{
          this.boxStyle.width = $('.video-dialog-box').width() + 'px';
        }
        if(this.show){
          document.documentElement.style.overflowY = 'hidden';
        }else{
          document.documentElement.style.overflowY = 'auto';
        }
        this.initOption();
      },
      'showItem': 'initOption',
      "$route": 'closeVideo'
    },
    created() {
    },
    mounted(){
    },
    methods: {
      /**
       * @close  -----关闭视频组件调用
      */
      initOption() {
        // this.playerOptions.sources[0].src = this.items[this.showItem].video;
        // this.playerOptions.poster = this.items[this.showItem].image;
        $("#screenRight").animate({scrollTop: this.showItem*60}, 500);
      },
      changeItem(index) {
        this.showItem = index;
        
      },
      closeVideo() {
        this.$refs.videoPlayer.dispose();
        this.show = false;
        this.$emit('close');
      },
    }
  }
</script>
