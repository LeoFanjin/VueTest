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
            进度：{{progress}}%<br>
            <button type="button" @click="sendRequest">发送请求</button>
            <button type="button" @click="cancelRequest">取消请求</button>
            <button type="button" @click="resumeRequest">继续请求</button>
        </div>
        <div>
            <h3>拦截器</h3>
            <button type="button" @click="sendRequestIn">发请求</button>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    export default {
        data () {
            return {
                res1: null,
                res2: null,
                file: {},
                progress: 0,
                source: null,
                loaded: 0
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
            //传文件
            sendRequest() {
                const cancelToken = axios.CancelToken;
                const source = cancelToken.source();
                this.source = source;
                var fd = new FormData();
                fd.append('file', this.file);
                // this.$axios.defaults.baseURL = 'http://localhost:8081/';
                this.$axios.post('http://60.28.140.210:10092/iiprp/fileUploadController/uploadToLocal', fd, {
                    //携带取消标识
                    cancelToken: source.token,
                    onUploadProgress: (progressEvent) => {
                        this.loaded = progressEvent.loaded;
                        this.progress = (progressEvent.loaded/progressEvent.total)*100;
                    }
                }).then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
            },
            fileUploadding(e) {
                this.file = e.target.files[0];
            },
            //取消
            cancelRequest() {
                this.source.cancel();
            },
            //续传
            resumeRequest() {
                var fileData = this.file.slice(this.loaded+1, this.file.size);
                var fd = new FormData();
                fd.append('file', fileData);
                //为了续传后再取消
                const cancelToken = axios.CancelToken;
                const source = cancelToken.source();
                this.source = source;
                this.$axios.post('http://60.28.140.210:10092/iiprp/fileUploadController/uploadToLocal', fd, {
                    //携带取消标识
                    cancelToken: source.token,
                    onUploadProgress: (progressEvent) => {
                        this.loaded = progressEvent.loaded;
                        this.progress = (progressEvent.loaded/progressEvent.total)*100;
                    }
                }).then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
            },
            sendRequestIn() {
                this.$axios.defaults.baseURL = 'http://localhost:8081/';
                //配置拦截器，use给请求之前做的事可以使多件，也可以use多次
                this.$axios.interceptors.request.use(function(config) {
                    console.log(config);
                    //设置请求头
                    var token = localStorage.getItem('token');
                    if('token') {
                        config.headers['token'] = token;
                    }
                    return config;
                });
                //相应拦截器
                this.$axios.interceptors.response.use(function(res) {
                    console.log(res);
                    if(res.headers.token) {
                        var token = res.headers.token;
                        localStorage.setItem('token', token);
                    }
                    return res;
                });
                this.$axios.get('/list'
                ).then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
</script>