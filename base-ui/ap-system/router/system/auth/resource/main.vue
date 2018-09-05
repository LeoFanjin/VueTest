<!--资源操作-->
<style scoped lang="less" src="./style.less"></style>

<template>
  <transition name="slide-fade">
    <div id="ap_system_auth_resource">
      <div class="panel">
        <div class="panel-heading">
          <h2 class="panel-title">{{$t('auth.label.resource_opt')}}</h2>
          <div class="panel-opt">
            <ul>
              <!-- 绑定 -->
              <li v-if="!status.isDisableOptBind" v-permissions="{options: $store.state.options, opt: 'OPERATION_05'}" @click="bindPermissionOpt"><i class="icon iconfont icon-ap-bind"></i></li>
              <!-- 重置 -->
              <li v-if="!status.isDisableOptReset" v-permissions="{options: $store.state.options, opt: 'OPERATION_05'}" @click="resetOptionsCheck"><i class="icon iconfont icon-ap-reset1"></i></li>
            </ul>
          </div>
        </div>
        <div class="panel-body organTree sinosoft_tree tree"
             :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">
          <sinosoft_tree ref="tree" :canChecked="status.canChecked" :isActive="false" :data="treeData" idKey="id"
                         :map="treeMap" :parentKey="parentKey" typeMap='type' :typeSettings='typeSettings'
                         @selectChecked="checkedSourceTreeItem"></sinosoft_tree>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import sinosoft_tree from "components/tree";

  export default {
    components: {
      sinosoft_tree
    },
    props: {
      operationList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      selectedPermissionId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        treeData: [],
        parentKey: "parentId",
        treeMap: {
          child: 'children',
          label: 'name'
        },
        typeSettings: [
          {name: 'Operation', showChecked: true, icon: 'icon-ap-operation'},
          {name: 'Resource', icon: 'icon-ap-menu'}
        ],

        status: {
          isDisableOptBind: true,
          isDisableOptReset: true,
          canChecked: false
        },
        selectedOperations: [],
        //已绑定的操作
        bindedOperationIds: []
      }
    },
    watch: {
      "operationList": "init",
      "selectedPermissionId": "onPermissionSelectChange"
    },
    created() {
      this.queryAllResource();
    },
    methods: {
      init(){
        var self = this;

        if (self.operationList.length > 0) {
          self.bindedOperationIds = _.map(self.operationList, function (item, index) {
            return item.operationId;
          });
          self.$refs.tree.selectedItems(self.bindedOperationIds);

        } else {
          self.$refs.tree.cleanSelected();
        }

        self.$refs.tree.resetSelected();
      },
      //监听许可选择变化
      onPermissionSelectChange() {
        if (this.selectedPermissionId) {
          this.status.isDisableOptBind = false;
          this.status.isDisableOptReset = false;
          this.status.canChecked = true;
        } else {
          this.status.isDisableOptBind = true;
          this.status.isDisableOptReset = true;
          this.status.canChecked = false;
        }
      },
      //查询所有资源
      queryAllResource() {
        var self = this;

        self.$store.dispatch("queryAllResource").then(function (tree) {
          self.treeData = tree;

        }).catch(function (message) {
          if (message && typeof message === "string") {
            self.$message.error(message);
          }
        });
      },
      //资源树点击事件
      checkedSourceTreeItem(childSelectItems) {
        this.selectedOperations = childSelectItems;
      },
      //许可绑定操作
      bindPermissionOpt() {
        var self = this, idArray = [];

        _.map(self.selectedOperations, function (item) {
          if (item.type == 'Operation') {
            idArray.push(item.id);
          }
        });

        if (self.bindedOperationIds.join(',') === idArray.join(',')) {
          return self.$message.error(self.$t('auth.msg.opt_not_modify'));
        }

        self.$store.dispatch("bindPermissionOpe", {
          permissionId: self.selectedPermissionId,
          operetionId: idArray.join(',')
        }).then(function () {
          self.bindedOperationIds = idArray;

          self.$message.success(self.$t('auth.msg.p_opt_bind_success'));
        }).catch(function (error) {
          self.$message.error(typeof error === "string" ? error : self.$t('common.msg.opt_fail'));
        });
      },
      //重置操作选择
      resetOptionsCheck() {
        var self = this;
        self.$refs.tree.selectedItems(self.bindedOperationIds);
      }
    }
  }
</script>
