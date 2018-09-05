<style scoped lang="less" src="./style.less"></style>
<template>
    <div class="container-fluid">
        <div>
            <button type="button" class="btn btn-default" @click="fxOpenFile">打开文件</button>
            <button type="button" class="btn btn-default" @click="fxCloseFile">关闭文件</button>
        </div>
        <div id="odfObj">

        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                odfObj: null
            }
        },
        mounted () {
            this.fxInit();
        },
        methods: {
            fxInit() {
                // var width = document.documentElement.clientWidth;
                var width = '100%';
                // var height = document.documentElement.clientHeight;
                var height = parseInt(this.$store.state.min_height)-65;
                this.odfObj = OFD.OCX.init("odfObj", width, height);
                this.odfObj.ready(this.odfObj._id);
                if (!("ActiveXObject" in window)) {
                    this.odfObj.jsCallbackFun_InitSetting();
                    this.odfObj.jsCallbackFun_UpdateInfo();
                }
            },
            //打开文件
            fxOpenFile() {
                var res = this.odfObj.openFile("http://pmo.htfoxit.com:8080/foxit-upload-ofd/download.do?fileid=323f23b857474fd39a9c678ce2f5e450&userid=78c8e9917bac40c6b2d83b8ad117ed9a&"
                    + Math.random(), false);
            },
            // 关闭文件
            fxCloseFile() {
                this.odfObj.closeFile(false);
            }
        }
    }
</script>