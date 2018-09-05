<script>
  import uuid from 'uuid';

  export default {
    name: "sinosoft_page",
    props: {
      total: {
        type: Number,
        default: 0
      },
      value: {
        type: Number,
        default: 1
      },
      limit: {
        type: Number,
        default: 10
      }
    },
    watch: {
      "value" (newV, oldV) {
        if (this.pageCount) {
          if (newV < 1 || newV > this.pageCount) {
            this.goPage(oldV);
          } else {
            this.initButton();
          }
        }
      },
      "total" () {
        this.initButton();
      }
    },
    data() {
      return {
        id: "sinosoft_page_",
        isShow: true,
        preDisabled: true,
        nextDisabled: false
      }
    },
    created() {
      this.id += uuid.v1();
      this.initButton();

      if (!this.total || !this.value || !this.limit) { //控制page是否显示
        this.isShow = false;
        return;
      }
    },
    computed: {
      /** 根据total和limit计算页数 **/
      pageCount() {
        return Math.ceil(this.total / this.limit);
      }
    },
    methods: {
      /** 控制按钮的状态 **/
      initButton () {
        if (this.value <= 1) {
          this.preDisabled = true;
          this.nextDisabled = false;
        } else if (this.value >= this.pageCount) {
          this.preDisabled = false;
          this.nextDisabled = true;
        } else {
          this.preDisabled = false;
          this.nextDisabled = false;
        }
        if (this.total <= this.limit) {
          this.preDisabled = true;
          this.nextDisabled = true;
        }
      },
      /** 上一页 **/
      prePage() {
        var currentPage = this.value;
        if (currentPage > 1) {
          this.goPage((currentPage - 1));
        }
      },
      /** 下一页 **/
      nextPage() {
        var currentPage = this.value;
        if (currentPage < this.pageCount) {
          this.goPage((currentPage + 1));
        }
      },
      /** 跳转页面 **/
      goPage(page) {
        this.$emit('input', page);
      },
      enterPage(event) {
        try {
          var newPage = Number(event.target.value);
          if (newPage < 1 || newPage > this.pageCount) {
            event.target.value = this.value;
          } else {
            this.goPage(newPage);
          }
        } catch (e) {
          event.target.value = this.value;
        }
      }
    }
  }
</script>

<style lang="less" src="./page.less"></style>

<template>
  <div align="center" class="sinosoft_page" :id="id">
    <el-button size="mini" class="d-arrow-left" icon="d-arrow-left" @click="goPage(1)" :plain="true"
               :disabled="preDisabled"></el-button>
    <el-button size="mini" icon="arrow-left" @click="prePage" :plain="true" :disabled="preDisabled"></el-button>
    第 <input type="text" size="2" maxlength="7" :value="value" @keyup.enter="enterPage">页,共
    <span>{{pageCount}}</span>页
    <el-button size="mini" icon="arrow-right" @click="nextPage" :plain="true" :disabled="nextDisabled"></el-button>
    <el-button size="mini" class="d-arrow-right" icon="d-arrow-right" @click="goPage(pageCount)" :plain="true"
               :disabled="nextDisabled"></el-button>
    共{{total}}条
  </div>
</template>
