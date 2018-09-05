<!-- 首页 -->
<style lang="less" scoped src="./style.less"></style>

<template>
    <div id="ui_home" class="container-fluid">
      <p class="icon"><i class="icon iconfont icon-ap-smile"></i></p>
      <p class="content">{{$t('common.label.welcome')}}{{title}}</p>
    </div>
</template>

<script>
    export default{
        data (){
            return {
                title: G.title
            }
        }
    }
</script>
