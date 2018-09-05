
<template>
    <div v-show="show" class="box" align="center">
        <div class="model">
            <div class="close-model" @click="closeEnlarge">×</div>
            <a class="pointer" style="height: 100%;display: inline-block;" :href="bigImg.src"　target="_blank">
                <img class="big-img" id="big-img" :src="bigImg.src"/>
            </a>
            <div class="control-panel" v-show="imgList.length > 1">
                <div class="next" @click="next"><span class="glyphicon glyphicon-chevron-right"></span></div>
                <div class="lase" @click="last"><span class="glyphicon glyphicon-chevron-left"></span></div>
            </div>
        </div>
        <div v-show="showMessage" class="message">{{message}}</div>
    </div>
</template>
<style scoped>
    .box {
        width:100%;
        height:100%;
        position: fixed;
        top:0;
        left:0;
        z-index:9999;
        background-color:rgba(0,0,0,0.4);
    }
    .model {
        width:50%;
        height:385px;
        line-height:380px;
        background-color:#fff;
        margin-top:10%;
        position: relative;
        -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5);
        -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5);
        box-shadow:0 0 10px rgba(0, 0, 0, .5);
    }
    .close-model {
        width:30px;
        height:30px;
        border-radius: 50%;
        font-size:30px;
        line-height:31px;
        position: absolute;
        top:-15px;
        right:-15px;
        color: rgba(244, 244, 244, 0.84);
        background-color:rgba(0,0,0,0.6);
        cursor:pointer
    }
    .close-model:hover{
        color: #fff;
        background-color:rgba(0,0,0,0.8);
    }
    .big-img {
        max-height:100%;
        max-width:100%;
    }
    .control-panel {
        /*height : 70px;*/
        /*width : 100%;*/
        /*position: absolute;*/
        /*top : 170px;*/
    }
    .control-panel div {
        position: absolute;
        top : 170px;
        width : 26px;
        height : 70px;
        line-height:70px;
        color:#fff;
        cursor:pointer;
        background-color:rgba(0,0,0,0.4);
    }
    .control-panel div:hover {
        background-color:rgba(0,0,0,0.8);
    }
    .control-panel .next {
        /*float:right;*/
        right: 0px;
    }
    .control-panel .lase {
        /*float:left;*/
        left: 0px;
    }
    .message {
        position: absolute;
        top : 48%;
        left: 46%;
        font-size: 18px;
        border-radius: 23px;
        height: 44px;
        padding: 10px;
        color:#fff;
        background-color:rgba(0,0,0,0.4);
    }
</style>
<script>
    /**
     *
     */
    export default {
        name: "sinosoft_radio",
        props: {
            imgList : {
                type : Array,
                default : []
            },
            show : {
                type : Boolean,
                default : false
            },
            bigImg : {
                type : Object,
                default : {src:'',index:0}
            }
        },

        watch: {

        },
        data: function(){
            return {
                showMessage: false,
                message: ''
            }
        },
        created: function(){
        },

        mounted: function(){
        },

        methods: {
            closeEnlarge(){//关闭放大框
                this.$emit("closeEnlarge");
            },
            next(){
                var self = this;
                if(this.bigImg.index < this.imgList.length-1){
                    this.bigImg.index += 1;
                    this.bigImg.src = this.imgList[this.bigImg.index].url;
                }else{
                    this.message = '已经到最后一张了';
                    this.showMessage = true;
                    setTimeout(function(){
                        self.showMessage = false;
                    },1000);
                }
            },
            last(){
                var self = this;
                if(this.bigImg.index > 0){
                    this.bigImg.index -= 1;
                    this.bigImg.src = this.imgList[this.bigImg.index].url;
                }else{
                    this.message = '已经到第一张了';
                    this.showMessage = true;
                    setTimeout(function(){
                        self.showMessage = false;
                    },1000);
                }
            },
            bbimg(){
                var o = document.getElementById("big-img");
                var zoom=parseInt(o.style.zoom, 10)||100;
                zoom+=event.wheelDelta/12;
                if (zoom>0) o.style.zoom=zoom+'%';
                return false;
            }
        }
    }

</script>
