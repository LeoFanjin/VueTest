<style scoped lang="less" src="./style.less"></style>
<template>
    <div id="h5-test">
        <header>头</header>
        <section>
            <article>文章</article>
            <div>
                <audio src="dist/vendor/media/Westlife - Viva La Vida.mp3" controls></audio>
            </div>
            <div>
                <video controls muted>
                    <source src="dist/vendor/media/视频教程.avi">
                    对不起，浏览器不支持
                </video>
            </div>
            <div>
                <form id="testForm" action="" method="GET">
                    邮箱:<input type="email" value="" name="email" autofocus required><br>
                    数字:<input type="number" value="" name="number"><br>
                    url:<input type="url" value="" name="url"><br>
                    滑块:<input type="range" value="" name="range"><br>
                    颜色:<input type="color" value="" name="color"><br>
                    时间:<input type="time" value="" name="time"><br>
                    <input type="submit" value="提交">
                </form>
                <input type="text" name="extra" value="" form="testForm">
            </div>
            <div>
                <input type="text" value="" name="txtList" list="urlList">
                <datalist id="urlList">
                    <option value="https://www.baidu.com">百度</option>
                    <option value="https://www.github.com">Github</option>
                    <option value="https://www.stackoverflow.com">stackoverflow</option>
                </datalist>
            </div>
            <div>
                <input type="button" value="添加样式" @click="addCls">
                <input type="button" value="移除样式" @click="removeCls">
                <input type="button" value="切换样式" @click="toggleCls">
                <input type="button" value="是否包含样式" @click="containCls">
                <div id="testDiv" class="basic testCls"></div>
            </div>
            <div>
                <div id="attr-div" data-name="刹那" data-user-sex="男" data-age="19"></div>
                <input type="button" value="自定义属性" @click="getAttributes">
            </div>
            <div>
                <input id="file_in_1" type="file" @change="fileChooseCss">
                <input id="file_in_2" type="file" @change="fileChooseJs">
                <input id="file_in_3" type="file" @change="fileChooseImg">
                <div id="file_div_1"></div>
                <img id="imported_img" src="" style="height: 6 0px;">
            </div>
            <aside>侧边</aside>
        </section>
        <footer>底部</footer>
        <dialog title="测试" v-model="status.showModal" size="lg">
            试试
        </dialog>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                status: {
                    showModal: true
                }
            }
        },
        mounted () {
            // this.domTest();
        },
        created () {
            // this.onlineChange();
            window.ononline = function () {
                console.log('net connected');
            }
            window.onoffline = function () {
                console.log('net disconnected');
            }
            this.getGeoLocation();
            this.setStorage();
        },
        methods: {
            getGeoLocation() {
                // window.navigator.geolocation.watchPosition();
                window.navigator.geolocation.getCurrentPosition(function(position) {
                    console.log('position',position);
                    console.log(getGeoLocation.coords.latitude);
                    console.log(getGeoLocation.coords.longitude);
                }, function(msg) {
                    console.log('msg',msg);
                });
            },
            setStorage() {
                sessionStorage.setItem('name', '刹那');
                sessionStorage.setItem('birthday', '2199');
                sessionStorage.setItem('nationality', 'Crugis');
                console.log(window.sessionStorage.getItem('nationality'));
                // window.sessionStorage.removeItem('name');
            },
            domTest() {
                var input = document.querySelector('input');
                input.style.fontSize = '18px';
                console.dir(input);
                var inputs = document.querySelectorAll('input');
                console.log(inputs);
                var urlList = document.querySelector('#urlList');
                console.log(urlList);
            },
            addCls() {
                document.querySelector('#testDiv').classList.add('testCls');
            },
            removeCls() {
                document.querySelector('#testDiv').classList.remove('testCls');
            },
            toggleCls() {
                document.querySelector('#testDiv').classList.toggle('testCls');
            },
            containCls() {
                var result = document.querySelector('#testDiv').classList.contains('testCls');
                alert(result);
            },
            getAttributes() {
                var dataset = document.querySelector('#attr-div').dataset;
                console.log(dataset);
                console.log(dataset.name);
                console.log(dataset['age']);
                dataset.level = 'lv2';
            },
            //读取文件
            fileChooseCss(evt) {
                var file = evt.target.files[0];
                var fReader = new FileReader();
                fReader.readAsText(file);
                fReader.onload = function() {
                    //读取读取的结果
                    var result = fReader.result;
                    var style = document.createElement('style');
                    style.innerHTML = result;
                    document.querySelector('head').appendChild(style);
                }
            },
            fileChooseJs(evt) {
                var file = evt.target.files[0];
                var fReader = new FileReader();
                fReader.readAsText(file);
                fReader.onload = function() {
                    //读取读取的结果
                    var result = fReader.result;
                    var script = document.createElement('script');
                    script.innerHTML = result;
                    document.querySelector('head').appendChild(script);
                }
            },
            fileChooseImg(evt) {
                var file = evt.target.files[0];
                var fReader = new FileReader();
                fReader.readAsDataURL(file);
                fReader.onload = function() {
                    //读取读取的结果
                    var result = fReader.result;
                    var img = document.querySelector('#imported_img');
                    img.src = result;
                }
            },
            //判断网络是否连接
            onlineChange() {
                var state = window.navigator.onLine;
                if(state) {
                    console.log('online');
                }else{
                    console.log('offline');
                }
            }
        }
    }
</script>