<style scoped lang="less" src="./style.less"></style>
<template>
    <div id="axios-div">
        <h2>axios</h2>
        <button type="button" @click="sendAjaxRequest">发送请求</button>
        <button type="button" @click="mergeAjaxRequest">合并请求</button>
        <div>
            res1: {{res1}}<br>
            res2: {{res2}}
        </div>
        <button type="button" @click="optionRequest">options请求</button>
        <button type="button" @click="requestCookie">获取cookie</button>
        <div>
            选择文件：<input type="file" name="file" @change="fileUploadding">
            进度：{{progress}}%
            <button type="button" @click="sendRequest">发送请求</button>
            <button type="button" @click="cancelRequest">取消请求</button>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                res1: null,
                res2: null,
                file: {},
                progress: 0
            }
        },
        methods: {
            sendAjaxRequest() {
                this.$axios({
                    url: 'http://localhost:8081/list'
                }).then(
                    res => {
                        console.log(res);
                    }
                ).catch(error => {

                });
            },
            mergeAjaxRequest() {
                //配置公共数据
                this.$axios.defaults.baseURL = 'http://localhost:8081/';
                var req1 = this.$axios.get('list');
                var req2 = this.$axios.post('add', 'a=1');
                this.$axios.all([
                    req1,req2
                ]).then(this.$axios.spread((res1, res2) => {
                    this.res1 = res1.data;
                    this.res2 = res2.data;
                })).catch(error => {
                    console.log(error);
                });
            },
            optionRequest() {
                this.$axios.defaults.baseURL = 'http://localhost:8081/';
                this.$axios.defaults.headers.accept = 'abc';
                this.$axios.get('list', {
                    params: {
                        id: 1 
                    },
                    transformResponse: function(data) {
                        data = 'modify data';
                        return data;
                    }
                }).then(res => {
                    console.log('res1',res);
                }).catch(error => {
                    console.log(error);
                });

                this.$axios.post('add', 'name=jack', {
                    timeout: 1000,
                    transformRequest: function(data) {
                        //加工请求体数据
                        return 'name=rose';
                    }
                }).then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
            },
            requestCookie() {
                this.$axios.defaults.baseURL = 'http://localhost:8081/';
                this.$axios.get('').then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
            },
            sendRequest() {
                var self = this;
                var fd = new FormData();
                fd.append('file', this.file);
                this.$axios.defaults.baseURL = 'http://localhost:8081/';
                this.$axios.post('/uploadFile', fd, {
                    onUploadProgress: function(progressEvent) {
                        console.log(progressEvent);
                        console.log(progressEvent.loaded);
                        console.log(progressEvent.total);
                        self.progress = (progressEvent.loaded/progressEvent.total)*100;
                    }
                }).then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
            },
            fileUploadding(e) {
                console.log(e.target.files[0]);
                this.file = e.target.files[0];
            },
            cancelRequest() {

            }
        }
    }
</script>