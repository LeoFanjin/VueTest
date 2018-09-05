<script>
  import uuid from 'uuid';

  export default {
    name: "ss_picture",
    props: {
      src: {
        type: String,
        default: 'http://tupian.qqjay.com/tou2/2017/0207/d1d88563f8bb88a580a34c9912256e1d.jpg'
      }
    },
    data() {
      return {
        id: "ss_picture_"
      }
    },
    created() {
      this.id += uuid.v1();
    },
    computed: {},
    methods: {
      edit() {
        this.$emit("edit");
      },
      remove() {
        this.$emit("remove");
      }
    }
  }
</script>

<style lang="less" src="./style.less"></style>

<template>
  <div class="ss_picture img-thumbnail" :id="id">
    <div class="mask">
      <div class="picture-opt">
        <a class="picture-opt-edit"><i class="icon iconfont icon-ap-modify" @click="edit"></i></a>
        <a class="picture-opt-remove"><i class="icon iconfont icon-ap-delete" @click="remove"></i></a>
      </div>
    </div>
    <img :src="src">
  </div>
</template>
