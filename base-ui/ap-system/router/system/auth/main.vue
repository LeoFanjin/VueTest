<!--资源管理-->
<style scoped lang="less" src="./style.less"></style>

<template>
  <div id="ap_system_auth" class="container-fluid">
    <div id="leftDiv" class="col-xs-3">
      <div class="panel">
        <div class="panel-heading">
          <h2 class="panel-title">{{$t('auth.label.organ')}}</h2>
        </div>
        <div class="panel-body organTree sinosoft_tree tree"
             :style="{'height': (this.$store.state.min_height - $store.state.base_height_difference) + 'px'}">
          <sinosoft_tree ref="tree" typeMap="type" :typeSettings="organAndPositionTypeMap" :data="treeData" idKey="id"
                         :map="treeMap" :parentKey="parentKey" @onCurrentItem="selectTreeItem"></sinosoft_tree>
        </div>
      </div>
    </div>
    <div id="middleDiv" class="col-xs-5">
      <permission :parentNode="parent" :permissionList="permissionList" :roleList="roleList" :nodeType="nodeType"
                  @permissionClick="onPermissionClick" @roleClick="onRoleClick"
                  @permissionRoleBind="onPermissionRoleBind" @permissionOrganBind="onPermissionOrganBind"></permission>
    </div>
    <div id="rightDiv" class="col-xs-4">
      <resource :operationList="operationList" :selectedPermissionId="permissionId"></resource>
    </div>
  </div>
</template>

<script>
  import Promise from 'bluebird';
  import sinosoft_tree from "components/tree";
  import permission from "./permission/main.vue";
  import resource from "./resource/main.vue";
  import {tree} from 'utils';
  var organAndPositionTypeMap = tree.organAndPositionTypeMap;

  export default {
    components: {
      permission,
      resource,
      sinosoft_tree
    },
    data() {
      return {
        organAndPositionTypeMap: organAndPositionTypeMap,
        treeData: [],
        parentKey: "parentId",
        treeMap: {
          child: 'children',
          label: 'name'
        },
        parent: null,
        nodeType: '',
        roleList: [],
        permissionList: [],
        operationList: [],
        permissionId: ''
      }
    },
    created() {
      this.queryOrganization();
    },
    methods: {
      //查询所有组织机构及人员
      queryOrganization() {
        var self = this;

        self.$store.dispatch("queryAuthOrganization").then(function (tree) {
          self.treeData = _.map(tree, function (item) {
            if (!item.id) {
              item = null;
            }
            if (item.type === "organ") {
              item.icon = "icon-ap-organization";
            } else {
                item.icon = "icon-ap-role2"
            }

            return item;
          });
        }).catch(function (message) {
          if (message && typeof message === "string") {
            self.$message.error(message);
          }
        })
      },
      //资源树点击事件
      selectTreeItem(itemId, item, path) {
        item.type = item.type || 'user';

        if (item.type === 'organ') {
          this.queryAuthorityByOrgan(item);

        } else if (item.type === 'user') {
          this.queryAuthorityByUser(item);
        }
      },
      queryAuthorityByOrgan(node) {
        var self = this;

        self.$store.dispatch("queryPermissionByOrgan", {
          organId: node.id
        }).then((data) => {
          if (data && _.isArray(data)) {
            self.permissionList = data;

            self.parent = node;
            self.nodeType = node.type;
            self.permissionId = '';
            self.operationList = [];
          }
        });
      },
      //查询相应的许可
      queryAuthorityByUser(node) {
        var self = this;

        Promise.all([
          self.$store.dispatch("queryPermissionByUser", {userId: node.id}),
          self.$store.dispatch("queryPermissionByOrgan", {organId: node.parentId}),
          self.$store.dispatch("queryRoleByUser", {userId: node.id})
        ]).spread((userPermissions, organPermissions, userRoles) => {

          if (userPermissions && _.isArray(userPermissions) && organPermissions && _.isArray(organPermissions)) {
            self.permissionList = _.map(organPermissions, (item) => {
              item.type = 'organ';
              return item;
            });

            _.each(userPermissions, (item) => {
              var obj = _.findWhere(self.permissionList, {permissionId: item.permissionId});
              if (!obj) {
                item.type = 'user';
                self.permissionList.push(item);
              }
            });
          }
          if (userRoles && _.isArray(userRoles)) {
            self.roleList = userRoles;
          }
          self.parent = node;
          self.nodeType = node.type;
          self.permissionId = '';
          self.operationList = [];
        }).catch((message) => {
          if (message && typeof message === "string") {
            self.$message.error(message);
          }
        });
      },
      //点击许可触发的事件
      onPermissionClick(id, operations) {
        //取消机构树的选中状态
        this.permissionId = id;
        this.operationList = operations;
        this.nodeType = 'permission';
      },
      //点击角色触发的事件
      onRoleClick(permissions) {
        //取消机构树的选中状态
        this.$refs.tree.resetSelected();
        this.parent = null;
        this.roleList = [];
        this.permissionList = permissions;
        this.operationList = [];
        this.permissionId = '';
        this.nodeType = 'role';
      },
      //角色绑定许可后触发的事件
      onPermissionRoleBind() {
        if (this.parent) {
          this.queryAuthorityByUser(this.parent);
        }
      },
      //机构、岗位绑定许可后触发的事件
      onPermissionOrganBind() {
        if (this.parent) {
          this.selectTreeItem(null, this.parent);
        }
      }
    }
  }
</script>
