<style scoped type="less">
  .el-message-box__wrapper {
    z-index: 2000;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  .el-message-box {
    z-index: 2020;
    border-radius: 0;
  }
  .el-message-box .panel-body {
    min-height: 50px;
    padding: 30px 20px;
  }
  .el-message-box__message p {
    font-size: 14px;
  }

</style>
<template>
  <transition name='msgbox-fade'>
    <div class='el-message-box__wrapper' v-show='value' @click.self='handleWrapperClick'>
      <div class='el-message-box panel' :class='customClass'>
        <div class="panel-heading">
          <h2 class="panel-title">{{ title || '提示' }}</h2>
          <div class="panel-opt">
            <ul>
              <li @click="handleAction('cancel')"><i class="icon iconfont icon-ap-close"></i></li>
            </ul>
          </div>
        </div>
        <div class="panel-body" v-if="message !== ''">
          <div class='el-message-box__status' :class='[ typeClass ]'></div>
          <div class='el-message-box__message' :style="{ 'margin-left': typeClass ? '50px' : '0' }"><p>{{ message }}</p></div>
            <el-input v-model='inputValue' v-if='false' :placeholder='inputPlaceholder' ref='input'></el-input>
        </div>
        <div class="panel-foot">
          <div class="panel-opt">
            <ul>
              <li class="btn btn-primary btn-bordered" v-show='showConfirmButton' ref='confirm' @click="handleAction('confirm')"><span>{{ confirmButtonText || '确定' }}</span></li>
              <li class="btn btn-default btn-bordered" v-show='showCancelButton' @click="handleAction('cancel')"><span>{{ cancelButtonText || '取消' }}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type='text/babel'>
  import Popup from 'vue-popup';
  import {addClass, removeClass} from 'wind-dom/src/class';

  const typeMap = {
    success: 'circle-check',
    info: 'information',
    warning: 'warning',
    error: 'circle-cross'
  };

  export default {
    mixins: [Popup],

    props: {
      modal: {
        default: true
      },
      lockScroll: {
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        default: true
      },
      closeOnPressEscape: {
        default: true
      }
    },

    computed: {
      typeClass() {
        return this.type && typeMap[this.type] ? `el-icon-${typeMap[this.type]}` : '';
      },

      confirmButtonClasses() {
        return `el-button--primary ${this.confirmButtonClass}`;
      },
      cancelButtonClasses() {
        return `${this.cancelButtonClass}`;
      }
    },

    methods: {
      doClose() {
        this.value = false;
        this._closing = true;

        this.onClose && this.onClose();

        if (this.lockScroll) {
          setTimeout(() => {
            if (this.modal && this.bodyOverflow !== 'hidden') {
              document.body.style.overflow = this.bodyOverflow;
              document.body.style.paddingRight = this.bodyPaddingRight;
            }
            this.bodyOverflow = null;
            this.bodyPaddingRight = null;
          }, 200);
        }
        this.opened = false;

        if (!this.transition) {
          this.doAfterClose();
        }
      },

      handleWrapperClick() {
        if (this.closeOnClickModal) {
          this.close();
        }
      },

      handleAction(action) {
        if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
          return;
        }
        var callback = this.callback;
        this.value = false;
        callback(action);
      },

      validate() {
        if (this.$type === 'prompt') {
          var inputPattern = this.inputPattern;
          if (inputPattern && !inputPattern.test(this.inputValue || '')) {
            this.editorErrorMessage = this.inputErrorMessage || '错误';
//            addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
            return false;
          }
          var inputValidator = this.inputValidator;
          if (typeof inputValidator === 'function') {
            var validateResult = inputValidator(this.inputValue);
            if (validateResult === false) {
              this.editorErrorMessage = this.inputErrorMessage || '错误';
//              addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
              return false;
            }
            if (typeof validateResult === 'string') {
              this.editorErrorMessage = validateResult;
              return false;
            }
          }
        }
        this.editorErrorMessage = '';
//        removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
        return true;
      }
    },

    watch: {
      inputValue(val) {
        if (this.$type === 'prompt' && val !== null) {
          this.validate();
        }
      },

      value(val) {
        if (this.$type === 'alert' || this.$type === 'confirm') {
          this.$nextTick(() => {
//            this.$refs.confirm.$el.focus();
          });
        }
        if (this.$type !== 'prompt') return;
        if (val) {
//          setTimeout(() => {
//            if (this.$refs.input && this.$refs.input.$el) {
//              this.$refs.input.$el.querySelector('input').focus();
//            }
//          }, 500);
        } else {
          this.editorErrorMessage = '';
//          removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
        }
      }
    },

    data() {
      return {
        title: undefined,
        message: '',
        type: '',
        customClass: '',
        showInput: false,
        inputValue: null,
        inputPlaceholder: '',
        inputPattern: null,
        inputValidator: null,
        inputErrorMessage: '',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonClass: '',
        confirmButtonDisabled: false,
        cancelButtonClass: '',
        editorErrorMessage: null,
        callback: null
      };
    }
  };
</script>
