<style scoped lang="less" src="./style.less"></style>
<template>
  <mu-paper class="echart-paper" :zDepth="1" :style="paperStyle">
    <div id="barCharts"></div>

  </mu-paper>
</template>
<script>
  var echarts = require('echarts');
  export default {
    computed: {
      getData() {
        console.log(this.data);
        return this.data
      }
    },
    name: 'echarts-bar',
    props: {
      paperStyle: {
        type: Object,
        default: {
          width: '300px',
          height: '250px'
        }
      },
      data: {
        type: Array,
        default: []
      },
      seriesType: {
        type: String,
        default: 'bar'
      }
    },
    data() {
      return {
        barCharts: null,
        option: null
      }
    },
    created() {

    },
    mounted() {
      this.init();
      // this.getData();
    },
    watch: {
      "data": function () { alert(1) }
    },
    methods: {
      updateOption() {
        var self = this;
        console.log(self.paperStyle);
      },
      init() {
        var self = this;
        self.barCharts = echarts.init(document.getElementById('barCharts'));

        self.option = {
          color: ['#3398DB'],
          title: {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [//柱状图参数
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [//柱状图参数
            {
              type: 'value'
            }
          ],
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          series: [
            // {
            //   name: '直接访问',
            //   type: 'bar',
            //   barWidth: '60%',
            //   data: [10, 52, 200, 334, 390, 330, 220]
            // }
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        self.barCharts.setOption(self.option);
      }
    }
  }
</script>