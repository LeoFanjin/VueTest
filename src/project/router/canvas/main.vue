<style scoped lang="less" src="./style.less"></style>
<template>
    <div id="can-div">
        <canvas height="500" width="800"></canvas>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                
            }
        },
        created () {
            
        },
        mounted () {
            this.canvasZoom();
        },
        methods: {
            // 绘制线
            drawLine() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                ctx.moveTo(100, 100);
                ctx.lineTo(300, 100);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 20;
                ctx.stroke();
                ctx.beginPath();

                ctx.moveTo(100, 300);
                ctx.lineTo(300, 300);
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 20;
                ctx.stroke();
            },
            // 绘制连接
            drawJoint() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                ctx.moveTo(50, 100);
                ctx.lineTo(250, 150);
                ctx.lineTo(50, 200);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 20;
                ctx.lineJoin = 'round';
                ctx.stroke();
                ctx.beginPath();

                ctx.moveTo(300, 100);
                ctx.lineTo(500, 150);
                ctx.lineTo(300, 200);
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 20;
                ctx.lineJoin = 'bevel';
                ctx.stroke();
                ctx.beginPath();

                ctx.moveTo(550, 100);
                ctx.lineTo(750, 150);
                ctx.lineTo(550, 200);
                ctx.strokeStyle = '#1a0bee';
                ctx.lineWidth = 20;
                ctx.lineJoin = 'miter';
                ctx.stroke();
                ctx.beginPath();
            },
            // 绘制三角形
            drawTriangular() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                ctx.moveTo(100, 100);
                ctx.lineTo(300, 200);
                ctx.lineTo(100, 300);
                // ctx.lineTo(100, 100);
                ctx.closePath();
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 10;
                ctx.stroke();
            },
            // 绘制矩形
            drawRectangle() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                ctx.moveTo(100, 100);
                ctx.lineTo(400, 100);
                ctx.lineTo(400, 300);
                ctx.lineTo(100, 300);
                ctx.closePath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.stroke();
            },
            // 线性渐变
            drawLinearGradient() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                var lgd = ctx.createLinearGradient(100, 100, 500, 100);
                lgd.addColorStop(0, 'red');
                lgd.addColorStop(.5, 'green');
                lgd.addColorStop(.7, 'yellow');
                lgd.addColorStop(.9, 'purple');
                ctx.strokeStyle = lgd;
                ctx.moveTo(100, 100);
                ctx.lineTo(500, 100);
                ctx.lineWidth = 20;
                ctx.stroke();
            },
            // 径向渐变
            drawRadialGradient() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                var rgd = ctx.createRadialGradient(200, 150, 50, 200, 150, 100);
                rgd.addColorStop(0, 'red');
                rgd.addColorStop(.5, 'blue');
                rgd.addColorStop(1, 'green');
                ctx.fillStyle = rgd;
                // ctx.moveTo(100, 50);
                // ctx.lineTo(300, 50);
                // ctx.lineTo(300, 300);
                // ctx.lineTo(100, 300);
                // ctx.closePath();
                // ctx.fill();
                ctx.fillRect(0, 0, 400, 300);
            },
            // 非零环绕
            drawNonzeroSurround() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                ctx.moveTo(100, 100);
                ctx.lineTo(100, 300);
                ctx.lineTo(300, 300);
                ctx.lineTo(300, 100);
                ctx.strokeStyle = 'blue';
                ctx.closePath();

                ctx.moveTo(150, 150);
                ctx.lineTo(250, 150);
                ctx.lineTo(250, 250);
                ctx.lineTo(150, 250);
                ctx.strokeStyle = 'green';
                ctx.closePath();

                ctx.moveTo(180, 180);
                ctx.lineTo(180, 220);
                ctx.lineTo(220, 220);
                ctx.lineTo(220, 180);
                ctx.closePath();

                ctx.stroke();

                ctx.fillStyle = 'red';
                ctx.fill();
            },
            // 虚线
            drawDottedLine() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');

                ctx.moveTo(100, 50);
                ctx.lineTo(400, 50);
                // ctx.setLineDash([20, 10]);
                ctx.setLineDash([10, 5, 20]);
                ctx.stroke();
            },
            // 矩形2
            drawRectangle2() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                // ctx.fillStyle = 'green';
                // ctx.fillRect(100, 100, 100, 200);
                // ctx.stroke();
                // ctx.clearRect();
                var x = 0, step = 5, i = 1;

                setInterval(function() {
                    ctx.clearRect(0, 0, c.width, c.height);
                    ctx.fillStyle = 'green';
                    ctx.fillRect(x, 100, 100, 200);
                    ctx.stroke();
                    x += i*step;
                    if(x > c.width - 100) {
                        i = -1;
                    }else if(x <= 0){
                        i = 1;
                    }
                }, 10);
            },
            // 绘制文本
            drawText() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                ctx.moveTo(400, 0);
                ctx.lineTo(400, 500);
                ctx.stroke();
                ctx.beginPath();

                ctx.moveTo(0, 250);
                ctx.lineTo(800, 250);
                ctx.stroke();

                ctx.font = '50px 全新硬笔行书简';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'red';
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;
                ctx.shadowBlur = 5;
                // ctx.strokeText('全网最帅', 400, 250);
                ctx.fillText('全网最帅', 400, 250);
            },
            // 绘制图片
            drawImg() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                var img = document.createElement('img');
                img.src = '/dist/vendor/image/xiayize.jpg';
                img.onload = function() {
                    // ctx.drawImage(img, 100, 100, 200, 100);
                    // 图片对象，图片选择的横、纵坐标，图片的宽、高，画图的横、纵坐标，图片显示的宽、高
                    ctx.drawImage(img, 180, 50, 350, 170, 100, 100, 350, 270);
                }
            },
            // 绘制弧
            drawArc() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                ctx.arc(200, 150, 50, Math.PI/6, Math.PI*3/2, false);
                ctx.stroke();
                ctx.beginPath();

                ctx.arc(400, 150, 50, Math.PI/6, Math.PI*3/2, true);
                ctx.stroke();
            },
            // 平移
            canvasMove() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');
                // 设置画布原点平移
                ctx.translate(100, 100);
                ctx.moveTo(0, 0);
                ctx.lineTo(100, 0);
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'green';
                ctx.stroke();
            },
            // 旋转
            canvasRotate() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');

                ctx.translate(100, 100);

                ctx.rotate(Math.PI/2);
                ctx.moveTo(0, 0);
                ctx.lineTo(200, 0);
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 200);
                ctx.stroke();
            },
            // 缩放
            canvasZoom() {
                var c = document.querySelector('canvas');
                var ctx = c.getContext('2d');

                ctx.translate(100, 100);

                ctx.scale(.5, 1); // 横坐标缩放值，纵坐标缩放值
                ctx.arc(0, 0, 100, 0, 2*Math.PI);
                ctx.stroke();
            }
        }
    }
</script>