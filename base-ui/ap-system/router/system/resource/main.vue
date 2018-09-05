<!--资源管理-->
<style scoped lang="less" src="./style.less"></style>

<template>
  <div id="ap_sys_resource" class="container-fluid">
    <div id="leftDiv" class="col-xs-3">
      <div class="panel">
        <div class="panel-heading">
          <h2 class="panel-title">{{$t('resource.label.resource_manage')}}</h2>
          <div class="panel-opt">
            <ul>
              <li @click="changePosition('up')" v-permissions="{options: this.$store.state.options, opt: 'RESOURCE_03'}"><i class="icon iconfont icon-ap-arrowup"></i></li>
              <li @click="changePosition('down')" v-permissions="{options: this.$store.state.options, opt: 'RESOURCE_03'}"><i class="icon iconfont icon-ap-arrowdown"></i></li>
              <li @click="showResourceAdd" v-permissions="{options: this.$store.state.options, opt: 'RESOURCE_02'}"><i class="icon iconfont icon-ap-add"></i></li>
            </ul>
          </div>
        </div>
        <div class="panel-body sinosoft_tree tree" :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">
          <sinosoft_tree ref="tree" :data="treeData" idKey="resourceId" :map="treeMap" :parentKey="parentKey" @onCurrentItem="selectTreeItem"></sinosoft_tree>
        </div>
      </div>
    </div>
    <div id="middleDiv" class="col-xs-5">
      <resource_add :showAdd="status.isShowResourceAdd" :parentNode="parentItem" @close="closeResourceAddPage" @add="addResource"></resource_add>
      <resource_edit :showEdit="status.isShowResourceEdit" :parentNode="parentItem" :itemId="resourceId" :isParent="isParent" @close="closeResourceEditPage" @save="updateTreeItem" @remove="removeTreeItem"></resource_edit>
    </div>
    <div id="rightDiv" class="col-xs-4">
      <operation :showOperation="status.isShowOperation" :itemId="resourceIdForOperation"></operation>
    </div>
    <div id="labelDiv" class="col-xs-9" v-if="!status.isShowResourceAdd && !status.isShowResourceEdit">
      <div class="alert alert-warning fade in">
        {{$t('resource.label.view_details')}}
      </div>
    </div>
  </div>
</template>

<script>
  import Promise from 'bluebird';
  import sinosoft_tree from "components/tree";
  import {dict, constant} from "utils";
  import resource_add from "./resource-add/main.vue";
  import resource_edit from "./resource-edit/main.vue";
  import operation from "./operation/main.vue";

  export default {
    components: {
      resource_add,
      resource_edit,
      operation,
      sinosoft_tree
    },
    data() {
      return {
        test: 'test',
        treeData: [],
        parentKey: "resourceParentId",
        treeMap: {
          child: 'children',
          label: 'resourceName'
        },
        status: {
          isShowResourceAdd: false,
          isShowResourceEdit: false,
          isShowOperation: false
        },
        parentItem: null,
        resourceId: '',
        resourceIdForOperation: '',
        isParent: false
      }
    },
    created() {
      this.queryResource();
    },
    watch: {
      'resourceId': function () {
        this.resourceIdForOperation = this.resourceId;
      }
    },
    methods: {
      //查询所有资源
      queryResource() {
        var self = this;

        var getIconByType = function(type) {
          let icon = "icon-ap-navsetting";
          switch (type) {
                  // 系统资源
            case "1" :
              icon = "icon-zixitong";
              break;
                  // 顶部资源
            case "2" :
              icon = "icon-ap-navsetting";
              break;
                  // 门户资源
            case "3" :
              icon = "icon-menhu";
              break;
                  // 子系统
            case "4" :
              icon = "icon-ziyuanguanli";
              break;
          }
          return icon;
        };

        self.$store.dispatch("queryResource", {}).then(function (tree) {
          tree = _.map(tree, function (item) {
            item.icon = getIconByType(item.resourceType);

            return item;
          });
          self.treeData = tree;
        }).catch(function (message) {
          if (message && typeof message === "string") {
            self.$message.error(message);
          }
        })
      },
      addResource(data){
        var self=this;
        self.$refs.tree.addItem(data.resourceParentId, data);
        var node = self.$refs.tree.getCurrentItem();
        if (node && node.item) {
          if (!node.item.open) {
            self.$refs.tree.toggle({id: data.parentId});
          }
        }
      },
      //资源树点击事件
      selectTreeItem(itemId, item, path, obj) {
        this.isParent = (obj.child && obj.child.length > 0);
        this.resourceId = itemId;
        item.fontIconName = item.icon;
        this.parentItem = item;
        this.parentItem.resourcePath = path;
        this.status.isShowResourceAdd = false;
        this.status.isShowResourceEdit = true;
        this.status.isShowOperation = true;
      },
      //显示资源添加页面
      showResourceAdd() {
        var current = this.$refs.tree.getCurrentItem();

        if (!current.item || (current.item && current.item.level < 4)) {
          if (!this.status.isShowResourceAdd) {
            this.status.isShowOperation = false;
            this.status.isShowResourceEdit = false;
            this.status.isShowResourceAdd = true;
            this.resourceIdForOperation = '';
          }
        } else {
          this.$message.warning(this.$t('resource.msg.not_add'));
        }
      },
      //关闭资源添加页面
      closeResourceAddPage() {
        this.status.isShowResourceAdd = false;

        if (this.resourceId) {
          this.status.isShowResourceEdit = true;
          this.status.isShowOperation = true;
          this.resourceIdForOperation = this.resourceId;
        }
      },
      //关闭资源修改页面
      closeResourceEditPage() {
        this.resourceId = null;
        this.parentItem = null;
        this.$refs.tree.resetSelected();
        this.status.isShowResourceEdit = false;
        this.status.isShowOperation = false;

      },
      //更新资源树
      updateTreeItem(id, item) {
        if (id && !_.isEmpty(item)) {
          this.$refs.tree.updateItem(id, item);
        }
        this.resourceId = '';
        this.status.isShowResourceEdit = false;
        this.status.isShowOperation = false;
      },
      //删除资源树中的项
      removeTreeItem(id) {
        if (id) {
          this.$refs.tree.removeItem(id);
        }
      },
      //移动
      changePosition(direction) {
        var self = this;

        var pre = null, next = null;

        //移动组织机构
        if (!self.resourceId || !self.parentItem) {
          self.$message.warning(self.$t('resource.msg.need_selected'));
          return;
        }

        if (direction === 'up') {
          pre = this.$refs.tree.getPreItem();

          if (!pre.original) {
            self.$message.warning(self.$t('resource.msg.un_up'));

          } else {
            self.changePositionAction(self.resourceId, pre.original.resourceId).then(function () {
              self.$refs.tree.moveUp();

            }).catch(function (message) {
              if (message && typeof message === "string") {
                self.$message.error(message);
              } else {
                self.$message.error(self.$t('resource.msg.move_fail'));
              }
            });
          }

        } else if (direction === 'down') {
          next = this.$refs.tree.getNextItem();

          if (!next.original) {
            self.$message.warning(self.$t('resource.msg.un_down'));

          } else {
            self.changePositionAction(self.resourceId, next.original.resourceId).then(function () {
              self.$refs.tree.moveDown();
            }).catch(function (message) {
              self.$message.error(typeof message === "string" ? message : self.$t('resource.msg.move_fail'));
            });
          }
        }
      },
      changePositionAction(sourceId, targetId) {
        var self = this;

        var params = {
          upId: sourceId,
          downId: targetId
        };

        return self.$store.dispatch("changePositionByResource", params);
      }
    }
  }
</script>
