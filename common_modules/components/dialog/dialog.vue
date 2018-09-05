<style scoped lang="less" src="./dialog.less"></style>

<template>
  <div style="" :id="id" :class="['modal', 'fade', 'bs-example-modal-' + size, 'sinosoft-dialog']" tabindex="-1"
       role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
    <div class="modal-dialog" :class="['modal-' + size]" :align="sAlign">
      <div class="modal-content">
        <div v-show="title || showTitle" class="modal-header">
          <h2 class="modal-title">{{title}}</h2>
          <ul>
            <slot name="opt"></slot>
            <li data-dismiss="modal"><i class="icon iconfont icon-ap-close"></i></li>
          </ul>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div v-show="showFooter" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
    <button class="hide" :id="'button_' + id" data-toggle="modal" :data-target="'#' + id"></button>
  </div>
</template>

<script>
  import uuid from 'uuid';

  /**
   * props:
   *      title: "标题"
   *      model: 是否显示 true/false
   *      size: 大小 (bs-example-modal-lg、bs-example-modal-sm)
   *      showFooter: 是否显示footer
   *      keyboard: 是否允许esc关闭
   * events:
   *        show: 打开时出发
   *        shown: 打开后触发
   *        hide: 关闭时触发
   *        hidden: 关闭后触发
   */
  export default {
    name: "sinosoft_modal",
    props: {
      sAlign: { //文字对齐方式
        type: String,
        default: "left"
      },
      title: { //标题
        type: String,
        default: ""
      },
      showTitle: {
        type: Boolean,
        default: false
      },
      value: { //控制模态框显示隐藏
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: ''
      },
      showFooter: {
        type: Boolean,
        default: false
      },
      keyboard: {
        type: Boolean,
        default: true
      }
    },

    watch: {
      "value" () {
        if (this.value) {
          this.open();
        } else {
          this.close();
        }
      },
      "$route": "close"
    },
    data () {
      return {
        id: "sinosoft_model_",
        modal: null
      }
    },

    created () {
      this.id += uuid.v1();
    },

    mounted () {
      var self = this;
      jQuery("#" + this.id).on("show.bs.modal", function () {
        self.$emit("show");
      }); //show 方法调用之后立即触发该事件。
      jQuery("#" + this.id).on("shown.bs.modal", function () {
        self.$emit("shown");
      }); //模态框已经显示出来（并且同时在 CSS 过渡效果完成）之后被触发。
      jQuery("#" + this.id).on("hide.bs.modal", function () {
        self.$emit("hide");
      }); //hide 方法调用之后立即触发该事件。
      jQuery("#" + this.id).on("hidden.bs.modal", function () { //此事件在模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发。
        self.$emit('input', false);
        self.$emit("hidden");
      });
    },

    methods: {
      open () {
        jQuery("#" + this.id).modal('show');
      },
      close () {
        jQuery("#" + this.id).modal('hide');
      }
    }
  }

</script>
