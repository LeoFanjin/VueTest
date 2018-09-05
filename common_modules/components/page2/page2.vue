<script>
  import uuid from 'uuid';

  export default {
    name: "sinosoft_page",
    props: {
      total: {
        type: Number,
        default: 0
      },
      value: {
        type: Number,
        default: 1
      },
      limit: {
        type: Number,
        default: 10
      },
      // 是否显示总页数和跳页部分
      isShowJump: {
        type: Boolean,
        default: true
      }
    },

    watch: {
      "value" (newV, oldV) {
        if (this.pageCount) {
          if (newV < 1 || newV > this.pageCount) {
            this.goPage(oldV);
          } else {
            if (this.value <= 1) {
              this.preDisabled = true;
              this.nextDisabled = false;
            } else if (this.value >= this.pageCount) {
              this.preDisabled = false;
              this.nextDisabled = true;
            } else {
              this.preDisabled = false;
              this.nextDisabled = false;
            }
          }
          this.currentPage = newV;
        }
      },
      "total" () {
        if (!this.total || !this.value || !this.limit) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      },
      "pageCount" () {
        if (this.pageCount < this.value) {
          this.value = this.pageCount || 1;
          this.$emit("input", this.value);
        }
      }
    },
    data() {
      return {
        id: "sinosoft_page_",
        isShow: true,
        preDisabled: true,
        nextDisabled: false,
        currentPage: 1,
        p: 1                    //显示相邻几页
      }
    },
    created() {
      this.id += uuid.v1();
      if (!this.total || !this.value || !this.limit) {
        this.isShow = false;
        return;
      }
    },
    computed: {
      pageCount() {
        return Math.ceil(this.total / this.limit);
      },
      pageView: {
        get: function () {
          var self = this;
          var array = [];

          var start = 1;
          var end = this.pageCount;
          var p = self.p;
          var current = this.value;

          if (current - p > 0) {
            start = current - p;
          }

          if (current + p <= this.pageCount) {
            end = current + p;
          }

          var sc = current - start;
          var ec = this.pageCount - end;

          if (sc < p && p < ec) {
            end += (p - (current - 1));
          }

          sc = current - 1;
          ec = this.pageCount - current;

          if (ec < p && p < sc) {
            start -= (p - (this.pageCount - current));
          }

          for (var i = start; i <= end; i++) {
            array.push(i);
          }

          return array;
        }
      }
    },

    methods: {
      /** 上一页 **/
      prePage() {
        var currentPage = this.value;
        if (currentPage > 1) {
          this.goPage((currentPage - 1));
        }
      },
      /** 下一页 **/
      nextPage() {
        var currentPage = this.value;
        if (currentPage < this.pageCount) {
          this.goPage((currentPage + 1));
        }
      },
      /** 跳转页面 **/
      goPage(page) {
        this.$emit('input', page);
      },
      enterPage(event) {
        try {
          var newPage = Number(event.target.value);
          if (newPage < 1 || newPage > this.pageCount) {
            event.target.value = this.value;
          } else {
            this.goPage(newPage);
          }
        } catch (e) {
          event.target.value = this.value;
        }
      }
    }
  }
</script>
<style scoped lang="less" src="./page2.less">
</style>

<template>
  <nav align="center" class="sinosoft_page2" :id="id">
    <ul :class="{'pad-30':!isShowJump}">
      <!-- 返回首页 -->
      <li><a @click="goPage(1)" :disabled="preDisabled">&laquo;</a></li>
      <!-- 上一页 -->
      <li><a @click="prePage" :disabled="preDisabled">&lsaquo;</a></li>

      <li v-if="value>=(p + 2) && pageCount > (p + 2)" @click="goPage(1)">
        <a>1</a>
      </li>
      <li v-if="value>=(p + 3) && pageCount > (p + 3)" @click="goPage(value-p)">
        <a>…</a>
      </li>

      <li :class="{active: item==value}" v-for="item in pageView" @click="goPage(item)">
        <a>{{item}}</a>
      </li>
      <li v-if="value<pageCount-p-1 && pageCount-p > 3" @click="goPage(value+p)">
        <a>…</a>
      </li>
      <li v-if="value<pageCount-p" @click="goPage(pageCount)">
        <a>{{pageCount}}</a>
      </li>
      <!-- 下一页 -->
      <li><a @click="nextPage" :disabled="nextDisabled">&rsaquo;</a></li>
      <!-- 最后一页 -->
      <li><a @click="goPage(pageCount)" :disabled="nextDisabled">&raquo;</a></li>
    </ul>
    <div class="page_label" v-if="isShowJump">
      共{{total}}条数据 到 <input type="text" v-model="currentPage" class="page_go" @keyup.enter="enterPage"> 页
    </div>
  </nav>
</template>
