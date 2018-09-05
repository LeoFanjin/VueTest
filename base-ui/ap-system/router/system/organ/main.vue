<!-- 员工管理 -->
<style scoped lang="less" src="./style.less"></style>

<template>
  <div id="ap_system_organ" class="container-fluid">
    <div id="leftDiv" class="col-xs-3">
      <div class="panel">
        <div class="panel-heading">
          <h2 class="panel-title">{{$t('organ.label.organ')}}</h2>
          <div class="panel-opt">
            <ul>
              <li @click="showOrganAdd" v-permissions="{options: this.$store.state.options, opt: 'ORGAN_02'}"><i class="icon iconfont icon-ap-add"></i></li>
            </ul>
          </div>
        </div>
        <div class="panel-body organTree sinosoft_tree " @click="clearSelect" :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">
          <sinosoft_tree ref="tree" typeMap="type" :data="treeData" idKey="organId" :map="treeMap"
                         :parentKey="parentKey" :showOpt="showOpt" @onEditItem="showEditOrgan"
                         @onRemoveItem="removeOrgan" @onCurrentItem="selectTreeItem"></sinosoft_tree>
        </div>
      </div>
    </div>
    <div id="rightDiv" class="col-xs-9">
      <staff_list v-model="status.showList" :organ="current" @showAdd="showAdd" @showUpdate="showUpdate"></staff_list>
      <staff_add v-model="status.showAdd" :organ="current" @close="closeAdd"></staff_add>
      <staff_update v-model="status.showUpdate" :item="update.item" :organ="current" @close="closeUpdate"></staff_update>
    </div>
    <organ_add v-model="status.showOrganAdd" :parentNode="current" @add="addSuccess"></organ_add>
    <organ_update v-model="status.showOrganUpdate" :currentNode="organUpdate.item" @save="getAllOrganByTree"></organ_update>
  </div>
</template>

<script>
  import staff_list from "./user/list/main.vue";
  import staff_add from "./user/add/main.vue";
  import staff_update from "./user/update/main.vue";
  import organ_add from "./organ/add/main.vue";
  import organ_update from "./organ/update/main.vue";
  import sinosoft_tree from "components/tree";
  import {tree} from "utils";

  export default {
    components: {
      staff_list,
      staff_add,
      staff_update,
      organ_add,
      organ_update,
      sinosoft_tree
    },
    data() {
      return {
        treeData: [],
        parentKey: "organParentId",
        treeMap: {
          child: 'children',
          label: 'organName'
        },
        current: null,
        update: {
          item: null
        },
        status: {
          showList: true,
          showAdd: false,
          showUpdate: false,
          showOrganAdd: false,
          showOrganUpdate: false
        },
        organUpdate: {
          item: null
        },
        showOpt: {
          edit: false,
          remove: false
        }
      }
    },
    created() {
      var self = this;

      self.getAllOrganByTree();
      self.showOpt = {
        edit: self.auth('ORGAN_03'),
        remove: self.auth('ORGAN_04'),
      };
    },
    watch: {
      'formInline.page': 'queryEmployeeInfoList'
    },
    methods: {
      //判断权限
      auth(opt) {
        let flag = true, options = this.$store.state.options;

        var verify = function () {
          if (!_.findWhere(options, {operationCode: opt})) {
            flag = false;
          }
        };

        if (options && options.length > 0) {
          verify();
        } else {
          flag = false;
        }
        return flag;
      },
      //查询机构岗位树
      getAllOrganByTree() {
        var self = this;

        self.$store.dispatch("queryOrganization").then(function (tree) {
          self.treeData = _.map(tree, function (item) {
            item.icon = "icon-ap-organization";
            return item;
          });
        }).catch(function (message) {
          if (message && typeof message === "string") {
            self.$message.error(message);
          }
        })
      },
      //树点击事件
      selectTreeItem(itemId, item, path) {
        var self = this;

        if (itemId && item) {
          self.status.showList = true;
          self.status.showAdd = false;
          self.status.showUpdate = false;

          self.current = {
            organId: item.organId,
            organName: item.organName,
            organLevel: item.organLevel,
            organPath: path
          };
        } else {
          self.$message.error(self.$t('common.msg.system_error'));
        }
      },
      //清除选中
      clearSelect() {
        if (this.status.showList) {
          this.$refs.tree.resetSelected();
          this.current = null;
        }
      },
      showAdd() {
        this.status.showList = false;
        this.status.showAdd = true;
      },
      closeAdd() {
        this.status.showList = true;
        this.status.showAdd = false;
      },
      showUpdate(item) {
        this.status.showList = false;
        this.status.showUpdate = true;
        this.update.item = item;
      },
      closeUpdate() {
        this.status.showList = true;
        this.status.showUpdate = false;
      },
      /* 组织机构相关 */
      //显示添加组织页面
      showOrganAdd() {
        this.status.showOrganAdd = true;
      },
      //新增组织成功
      addSuccess(organ) {
        if (organ) {
          organ.icon = "&#xe70;";
          this.$refs.tree.addItem(organ.organParentId, organ);
        }
      },
      //显示修改组织页面
      showEditOrgan(organId, item) {
        if (organId && !_.isEmpty(item)) {
          this.organUpdate.item = item;
          this.status.showOrganUpdate = true;
        }
      },
      //删除组织
      removeOrgan(organId, organ, item) {
        var self = this;

        if (item && (!item.child || item.child.length > 0)) {
          self.$message.warning(self.$t('organ.msg.o_child_no_remove'));
        } else {
          self.$confirm(self.$t('organ.msg.sure_remove'), self.$t('common.label.prompt'), {
            confirmButtonText: self.$t('common.label.determine'),
            cancelButtonText: self.$t('common.label.cancel'),
            type: 'warning'
          }).then(function () {
            self.$store.dispatch('removeOrgan', {
              organId: organId
            }).then(function () {
              self.$message.success(self.$t('common.msg.delete_success'));
              self.$refs.tree.removeItem(organId);
              if (self.current.organId === organId) {
                self.clearSelect();
              }
            }).catch(function (error) {
              self.$message.error(typeof error === "string" ? error : self.$t('common.msg.remove_fail'));
            });
          }).catch(function () {
          });
        }
      }
    }
  }
</script>
