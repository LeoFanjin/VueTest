<template>
  <div>
    <mu-popover :trigger="trigger" :open="open" @close="handleClose">
      <slot name="content"></slot>
    </mu-popover>
  </div>
</template>
<script>
  export default {
    name: 'ap-popover',
    props: {
      trigger: {
        type: Object,
        default: null
      },
      open: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
      }
    },
    watch:{
    },
    mounted() {
    },
    methods: {
      handleClose(e) {
        this.open = false;
        this.$emit('close');
      }
    }
  }
</script>