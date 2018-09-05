<!--资源管理-->
<style scoped lang="less" src="./style.less"></style>

<template>
  <div id="ui_system_auth_permission">
    <div class="panel">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('auth.label.p_manage')}}</h2>
        <div class="panel-opt">
          <ul>
            <!-- 绑定许可 -->
            <li v-if="!status.isDisablePmtBind" @click="bindPermission" v-permissions="{options: $store.state.options, opt: 'PERMISSION_05'}"><i class="icon iconfont icon-ap-bind"></i></li>
            <!-- 新增许可 -->
            <li @click="showPermissionAdd" v-permissions="{options: $store.state.options, opt: 'PERMISSION_02'}"><i class="icon iconfont icon-ap-add"></i></li>
            <!-- 重置许可 -->
            <li v-if="!status.isDisabledResetPerms" @click="resetPermissionCheck" v-permissions="{options: $store.state.options, opt: 'PERMISSION_05'}"><i class="icon iconfont icon-ap-reset1"></i></li>
          </ul>
        </div>
      </div>
      <div class="panel-body" :style="{'height': ($store.state.min_height-$store.state.base_height_difference - 55)/2 + 'px'}">
        <div id="permissionList" class="widget-body">
          <table>
            <thead>
              <tr>
                <th class="check"><input type="checkbox" v-model="status.isAllPmtChecked" @change="onCkeckAllPermission" :disabled="status.isDisableCheckAllPermission"></th>
                <th class="content">{{$t('auth.label.p_name')}}</th>
                <th class="icon">{{$t('auth.label.bind_obj')}}</th>
                <th class="opt">{{$t('auth.label.opt')}}</th>
              </tr>
            </thead>
            <tbody>
              <!--许可添加-->
              <tr v-if="status.isShowPermissionAdd">
                <td class="check">&nbsp;</td>
                <td class="content">
                  <input v-model="permissionAdd.permissionName" class="form-control input-sm" maxlength="20" :placeholder="$t('auth.label.p_name')"/>
                </td>
                <td class="icon">
                  <i class="icon iconfont icon-ap-organization"></i>
                  <i class="icon iconfont icon-ap-role2"></i>
                  <i class="icon iconfont icon-ap-role1"></i>
                </td>
                <td class="opt">
                  <a class="pointer edit" @click="savePermission"><i class="icon iconfont icon-ap-save1"></i>&nbsp;</a>
                  <a class="pointer remove" @click="cancelPermissionAdd"><i class="icon iconfont icon-ap-delete"></i></a>
                </td>
              </tr>
              <!--许可列表-->
              <tr v-for="item in permissions">
                <td class="check"><input id="item.permissionId" v-model="item.checked" type="checkbox" @change="onPermissionCheck(item)" :disabled="status.isDisableCheckAllPermission || item.isDisable"></td>
                <td class="content link" :title="item.permissionName" :class="{active: item.active}" @click="onPermissionClick(item)" v-if="!item.isShowEdit">
                  <div>
                    {{item.permissionName}}
                  </div>
                </td>
                <td class="content" v-if="item.isShowEdit">
                    <input v-model="item.permissionName" class="form-control input-sm" maxlength="20" :placeholder="$t('auth.label.p_name')"/>
                </td>
                <td class="icon">
                  <i class="icon iconfont icon-ap-organization" :class="{blue: item.type === 'organ'}"></i>
                  <i class="icon iconfont icon-ap-role2" :class="{green: item.type === 'user'}"></i>
                  <i class="icon iconfont icon-ap-role1" :class="{black: item.type === 'role'}"></i>
                </td>
                <td class="opt">
                  <a class="pointer edit" v-permissions="{options: $store.state.options, opt: 'PERMISSION_03'}"
                     v-if="item.isShowEdit" @click="modifyPermission(item)"><i class="icon iconfont icon-ap-save1"></i></a>
                  <a class="pointer edit" v-permissions="{options: $store.state.options, opt: 'PERMISSION_03'}"
                     v-if="!item.isShowEdit" @click="updatePermission(item)"><i class="icon iconfont icon-ap-modify"></i>
                  </a>
                  <a class="pointer remove" v-permissions="{options: $store.state.options, opt: 'PERMISSION_04'}"
                     @click="removePermission(item)"><i class="icon iconfont icon-ap-delete"></i></a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!--角色-->
    <div class="panel panel-role">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('auth.label.role_manage')}}</h2>
        <div class="panel-opt">
          <ul>
            <!--<el-tooltip :content="$t('common.label.binding')"  placement="top">-->
              <li @click="bindRole" v-if="!status.isDisableRoleBind" v-permissions="{options: $store.state.options, opt: 'ROLE_05'}"><i class="icon iconfont icon-ap-bind"></i></li>
            <!--</el-tooltip>-->
            <!--<el-tooltip :content="$t('auth.label.add')" placement="top" >-->
              <li @click="showRoleAdd" v-permissions="{options: $store.state.options, opt: 'ROLE_02'}"><i class="icon iconfont icon-ap-add"></i></li>
            <!--</el-tooltip>-->
            <!--<el-tooltip :content="$t('common.label.reset')" placement="top">-->
              <li @click="resetRoleCheck"  v-if="!status.isDisableResetRole"
                  v-permissions="{options: $store.state.options, opt: 'ROLE_05'}"><i class="icon iconfont icon-ap-reset1"></i></li>
            <!--</el-tooltip>-->
          </ul>
        </div>
      </div>
      <div class="panel-body"
           :style="{'height': ($store.state.min_height-$store.state.base_height_difference-55)/2 + 'px'}">
        <div id="roleList" class="widget-body">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" v-model="status.isAllRoleChecked" @change="onCkeckAllRole" :disabled="status.isDisableCheckAllRole"></th>
                <th>{{$t('auth.label.role_name')}}</th>
                <th>{{$t('auth.label.opt')}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="status.isShowRoleAdd">
                <td class="check">&nbsp;</td>
                <td class="content"><input v-model="roleAdd.roleName" class="form-control input-sm" maxlength="20" :placeholder="$t('auth.label.role_name')"/></td>
                <td class="opt">
                  <a @click="saveRole" class="pointer edit"><i class="icon iconfont icon-ap-save1"></i></a>
                  <a @click="cancelRoleAdd" class="pointer remove"><i class="icon iconfont icon-ap-delete"></i></a>
                </td>
              </tr>
              <tr v-for="item in roles">
                <td class="check">
                  <input id="item.roleId" v-model="item.checked" type="checkbox" @change="onRoleCheck(item)" :disabled="status.isDisableCheckAllRole">
                </td>
                <td class="content link" :title="item.roleName" v-show="!item.isShowEdit" :class="{active: item.active}" @click="onRoleClick(item)">
                  <div>{{item.roleName}}</div>
                </td>
                <td class="conent" v-show="item.isShowEdit">
                  <input v-model="item.roleName" class="form-control input-sm" maxlength="20" :placeholder="$t('auth.label.role_name')"/>
                </td>
                <td class="opt">
                  <a class="pointer edit" v-permissions="{options: $store.state.options, opt: 'ROLE_03'}" v-show="item.isShowEdit"
                     @click="modifyRole(item)"><i class="icon iconfont icon-ap-save1"></i></a>
                  <a class="pointer edit" v-permissions="{options: $store.state.options, opt: 'ROLE_03'}" v-show="!item.isShowEdit"
                     @click="updateRole(item)"><i class="icon iconfont icon-ap-modify"></i></a>
                  <a class="pointer remove" v-permissions="{options: $store.state.options, opt: 'ROLE_04'}"
                     @click="removeRole(item)"><i class="icon iconfont icon-ap-delete"></i></a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      parentNode: {
        type: Object,
        default: function () {
          return null;
        }
      },
      nodeType: {
        type: String,
        default: ''
      },
      permissionList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      roleList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        status: {
          isShowPermissionAdd: false,
          isDisabledResetPerms: true,
          isDisablePmtBind: true,
          isDisableCheckAllPermission: true,
          isAllPmtChecked: false,
          isShowRoleAdd: false,
          isDisableCheckAllRole: true,
          isDisableResetRole: true,
          isDisableRoleBind: true,
          isAllRoleChecked: false
        },
        permissionAdd: {permissionName: ''},
        permissions: [],
        searchPermissionForm: {permissionName: ''},
        selectedPermission: [],

        roleAdd: {roleName: ''},
        roles: [],
        searchRoleForm: {permissionName: ''},
        selectedRole: '',
        checkedRole: []
      }
    },
    watch: {
      "permissionList": "init",
      "parentNode": function () {
        var self = this;

        if (self.parentNode) {
          self.clearCurrentPermission();
          self.clearCurrentRole();
        }
      }
    },
    created() {
      this.queryAllPermission();
      this.queryAllRole();
    },
    methods: {
      init() {
        var self = this;

        if (self.nodeType == 'organ') {

            //点了机构或岗位
            self.status.isDisablePmtBind = false;           //放开许可的绑定按钮
            self.status.isDisableCheckAllPermission = false;//放开许可全选选择框
            self.status.isDisabledResetPerms = false;       //放开许可取消按钮

            self.status.isDisableRoleBind = true;          //放开许可的绑定按钮
            self.status.isDisableCheckAllRole = true;      //放开许可全选选择框
            self.status.isDisableResetRole = true;         //放开许可取消按钮

            self.initPermissionCheck('organ');
            self.initRoleCheck();
        } else if (self.nodeType == 'permission') {
            // 点了许可
            self.status.isDisablePmtBind = true;            //禁用许可的绑定按钮
            self.status.isDisableCheckAllPermission = true; //禁用许可全选选择框
            self.status.isDisabledResetPerms = true;        //禁用许可取消按钮

            self.status.isDisableRoleBind = true;          //放开许可的绑定按钮
            self.status.isDisableCheckAllRole = true;      //放开许可全选选择框
            self.status.isDisableResetRole = true;         //放开许可取消按钮

            // 取消角色选中状态
            self.initPermissionCheck();
            self.initRoleCheck();
        } else if (self.nodeType == 'role') {
            //点了角色
            self.status.isDisablePmtBind = false;               //放开许可的绑定按钮
            self.status.isDisableCheckAllPermission = false;    //放开许可全选选择框
            self.status.isDisabledResetPerms = false;           //放开许可取消按钮

            self.status.isDisableRoleBind = true;          //放开许可的绑定按钮
            self.status.isDisableCheckAllRole = true;      //放开许可全选选择框
            self.status.isDisableResetRole = true;         //放开许可取消按钮

            self.initPermissionCheck();
            self.initRoleCheck();

        } else if (self.nodeType == 'user') {
          //点了用户
          self.status.isDisableRoleBind = false;          //放开许可的绑定按钮
          self.status.isDisableCheckAllRole = false;      //放开许可全选选择框
          self.status.isDisableResetRole = false;         //放开许可取消按钮

          self.status.isDisablePmtBind = false;           //放开许可的绑定按钮
          self.status.isDisableCheckAllPermission = false;//放开许可全选选择框
          self.status.isDisabledResetPerms = false;       //放开许可取消按钮

          self.initPermissionCheck();
          self.initRoleCheck();
        }
      },
      initPermissionCheck(type) {
        var self = this;
        var isCanBindPermission = false;
        _.each(self.$store.state.options,function (item) {
          if (item.operationCode === "PERMISSION_05"){
            isCanBindPermission = true;
          }
        });
        self.permissions = _.map(self.permissions, function (item) {
          var results = _.where(self.permissionList, {permissionId: item.permissionId});
          var organResult = null;
          if (results.length > 1) {
            organResult = _.findWhere(results, {type: 'organ'});
          }
          var result = results.length > 0 ? organResult ? organResult : results[0] : null;
          item.isDisable = false;
          if (result) {
            item.checked = true;
            item.type = type || result.type;
            item.isDisable = (self.nodeType === 'user' && result.type !== 'user');
          } else {
            item.checked = false;
            item.type = '';
          }
          if (self.nodeType == 'permission') {
            item.checked = false;
            item.type = '';
          }
          item.isDisable = !isCanBindPermission;
          self.status.isDisableCheckAllPermission = !isCanBindPermission;
          return item;
        });
        self.isAllCheckedPmt();
      },
      isAllCheckedPmt() {
        var self = this;

        self.status.isAllPmtChecked = (self.permissions.length !== 0 && _.where(self.permissions, {checked: true}).length === self.permissions.length );
      },
      initRoleCheck() {
        var self = this;
        var isCanBindRole = false;
        _.each(self.$store.state.options,function (item) {
          if (item.operationCode === "ROLE_05"){
            isCanBindRole = true;
          }
        });
        self.roles = _.map(self.roles, function (item) {
          var result = _.findWhere(self.roleList, {roleId: item.roleId});
          if (result) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          if (self.nodeType !== 'user') {
            item.checked = false;
          }
          return item;
        });
        if (self.nodeType !== 'user' || !isCanBindRole) {
          self.status.isAllRoleChecked = false;
          self.status.isDisableCheckAllRole = true;
        }
        self.isAllCheckedRole();
      },
      isAllCheckedRole() {
        var self = this;

        self.status.isAllRoleChecked = ( self.roles.length !== 0 && _.where(self.roles, {checked: true}).length === self.roles.length );
      },
      //查询所有许可
      queryAllPermission() {
        var self = this;

        self.$store.dispatch("queryAllPermission").then(function (data) {
          self.permissions = _.map(data, function (item) {
            item.isShowEdit = false;
            item.checked = false;
            return item;
          });
        }).catch(function (error) {
          if (error && typeof error === 'string') {
            self.$message.error(error);
          }
        })
      },
      //显示新增许可
      showPermissionAdd() {
        var self = this, flag = true;

        _.map(self.permissions, function(item) {
          if (item.isShowEdit) {
            flag = false;
          }
        });

        if (this.status.isShowPermissionAdd || !flag) {
          this.$message.warning(this.$t('auth.msg.have_unfinished'));
        } else {
          this.status.isShowPermissionAdd = true;
        }
      },
      //取消新增许可
      cancelPermissionAdd() {
        this.permissionAdd.permissionName = '';
        this.status.isShowPermissionAdd = false;
      },
      //保存新增许可
      savePermission() {
        var self = this;

        if (!self.permissionAdd.permissionName) {
          self.$message.warning(self.$t('auth.msg.p_need_name'));

        } else {
          self.$store.dispatch('savePermission', {permissionName: self.permissionAdd.permissionName}).then((data) => {
            if (data) {
              self.$message.success(self.$t('auth.msg.add_success'));
              self.permissions.push({
                permissionId: data.permissionId,
                permissionName: self.permissionAdd.permissionName,
                isShowEdit: false
              });
              self.cancelPermissionAdd();
            }
          }).catch((error) => {
            self.$message.error(typeof error === "string" ? error : self.$t('auth.msg.add_fail'));
          });
        }
      },
      //显示许可修改
      updatePermission(item) {
        var self = this;
        var flag = true;

        _.each(self.permissions, (item) => {
          if (item.isShowEdit) {
            flag = false;
          }
        });
        if (this.status.isShowPermissionAdd || !flag) {
          this.$message.warning(this.$t('auth.msg.have_unfinished'));
        } else {
          item.isShowEdit = true;
        }
      },
      //保存许可修改
      modifyPermission(item) {
        var self = this;

        if (item.permissionName == '') {
          self.$message.warning(self.$t('auth.msg.p_need_name'));
        } else {
          self.$store.dispatch('modifyPermission', {
            permissionId: item.permissionId,
            permissionName: item.permissionName
          }).then(function () {
            item.isShowEdit = false;
            self.$message.success(self.$t('common.msg.update_success'));
          }).catch(function (error) {
            self.$message.error(typeof error === "string" ? error : self.$t('common.msg.update_fail'));
          });
        }
      },
      //删除许可
      removePermission(item) {
        var self = this;

        self.$confirm(self.$t('auth.msg.p_sure_remove'), self.$t('common.msg.prompt'), {
          confirmButtonText: self.$t('common.msg.determine'),
          cancelButtonText: self.$t('common.msg.cancel'),
          type: 'warning'
        }).then(function () {
          self.$store.dispatch('removePermission', {permissionId: item.permissionId}).then(function () {
            self.$message.success(self.$t('common.msg.delete_success'));
            self.queryAllPermission();
          }).catch(function (error) {
            self.$message.error(typeof error === "string" ? error : self.$t('auth.msg.remove_fail'));
          });
        }).catch(function () {});
      },
      //许可选择事件
      onPermissionCheck(item) {
        var self = this;

        var tempArray = [];

        if (item.checked) {
          self.selectedPermission.push(item.permissionId);
          tempArray = _.uniq(self.selectedPermission);
          if (_.where(self.permissions, {checked: true}).length === self.permissions.length && !self.status.isAllPmtChecked) {
            self.status.isAllPmtChecked = true;
          }
        } else {
          tempArray = _.without(self.selectedPermission, item.permissionId);
          if (_.where(self.permissions, {checked: true}).length !== self.permissions.length && self.status.isAllPmtChecked) {
            self.status.isAllPmtChecked = false;
          }
        }

        self.selectedPermission = tempArray;
      },
      //许可点击事件
      onPermissionClick(permissionItem) {
        var self = this;

        var permissionId = permissionItem.permissionId;

        self.$store.dispatch("queryOperationsByPermission", {permissionId: permissionId}).then(function(data) {
          self.permissions = _.map(self.permissions, function(item) {
            item.active = (item.permissionId === permissionItem.permissionId);
//            item.checked = false;
            return item;
          });
//          self.clearCurrentRole();
          self.$emit("permissionClick", permissionId, data);
        }).catch(function (error) {
          self.$message.error(typeof error === "string" ? error : self.$t('common.msg.query_fail'));
        });
      },
      //绑定许可
      bindPermission() {
        var self = this;

        if (self.parentNode && self.parentNode.id) {
          self.bindPermissionOrganOrUser();
        } else {
          self.bindPermissionRole();
        }
      },
      //为机构绑定许可
      bindPermissionOrganOrUser() {
        let self = this;
        let permissionIds = [], bindPermissions = [];

        let bindPermission = function(objId, permissionIds)  {

          let oldPerIds = _.map(self.permissionList, function (item) {
            return item.permissionId;
          }).join(',');

          if (oldPerIds === permissionIds) {
            return Promise.reject(self.$t('auth.msg.permission_not_modify'));
          }

          if (self.parentNode.type === 'organ') {
            return self.$store.dispatch("bindPermissionOrgan", {organId: objId, permissionId: permissionIds});
          } else if (self.parentNode.type === 'user') {
            return self.$store.dispatch("bindPermissionUser", {userId: objId, permissionId: permissionIds});
          } else {
            return Promise.reject(self.$t('auth.msg.bind_fail'));
          }
        };

        _.each(self.permissions, function(item) {
          if (item.checked && !item.isDisable) {
            permissionIds.push(item.permissionId);
            bindPermissions.push(item);
          }
        });

        bindPermission(self.parentNode.id, permissionIds.join(',')).then(function () {
          _.each(self.permissions, function(item) {
            if (item.checked && !item.isDisable) {
              item.type = self.parentNode.type;
            }
          });
          self.$message.success(self.$t('auth.msg.bind_success'));
          self.$emit("permissionOrganBind", bindPermissions);
        }).catch(function (error) {
          self.$message.error(typeof error === "string" ? error : self.$t('auth.msg.bind_fail'));
        });
      },
      //许可全选
      onCkeckAllPermission() {
        var self = this;

        if (self.status.isAllPmtChecked) {
          self.permissions = _.map(self.permissions, function (item) {
            item.checked = true;
            return item;
          });
        } else {
          self.permissions = _.map(self.permissions, function (item) {
            if (!item.isDisable) {
              item.checked = false;
            }
            return item;
          });
        }
      },
      //角色全选
      onCkeckAllRole() {
        var self = this;

        if (self.status.isAllRoleChecked) {
          self.roles = _.map(self.roles, function (item) {
            item.checked = true;
            return item;
          });
        } else {
          self.roles = _.map(self.roles, function (item) {
            item.checked = false;
            return item;
          });
        }
      },
      //重置许可选择
      resetPermissionCheck() {
        var self = this;

        self.permissions = _.map(self.permissions, function (item) {
          var result = _.findWhere(self.permissionList, {permissionId: item.permissionId});
          if (result) {
            item.checked = true;
            item.type = result.type;
          } else {
            item.checked = false;
            item.type = '';
          }
          return item;
        });
        if (_.where(self.permissions, {checked: true}).length === self.permissions.length && !self.status.isAllPmtChecked) {
          self.status.isAllPmtChecked = true;
        }
        if (_.where(self.permissions, {checked: true}).length !== self.permissions.length && self.status.isAllPmtChecked) {
          self.status.isAllPmtChecked = false;
        }
      },
      //为角色绑定许可
      bindPermissionRole() {
        var self = this;

        if (self.selectedRole === '') {
          this.$message.warning(this.$t('auth.msg.select_role'));

        } else {
          var selectedPermissions = [];

          _.each(self.permissions, (item) => {
            if (item.checked) {
              selectedPermissions.push(item.permissionId);
            }
          });

          let oldPerIds = _.map(self.permissionList, function (item) {
            return item.permissionId;
          }).join(',');

          if (oldPerIds === selectedPermissions.join(',')) {
            return self.$message.error(self.$t('auth.msg.permission_not_modify'));
          }

          self.$store.dispatch("bindPermissionRole", {
            roleId: self.selectedRole,
            permissionId: selectedPermissions.join(',')
          }).then(() => {
            _.each(self.permissions, (item) => {
              if (item.checked) {
                item.type = 'role';
              }
            });
            self.$message.success(self.$t('auth.msg.bind_success'));
            self.onRoleClick(self.selectedRole);
          }).catch((error) => {
            self.$message.error(typeof error === "string" ? error : self.$t('auth.msg.bind_fail'));
          });
        }
      },
      //查询所有角色
      queryAllRole() {
        var self = this;

        self.$store.dispatch("queryAllRole").then((data) => {
          self.roles = _.map(data, (item) => {
            item.isShowEdit = false;
            item.checked = false;
            return item;
          });
        }).catch((error) => {
          if (error && typeof error === 'string') {
            self.$message.error(error);
          }
        });
      },
      //员工绑定角色
      bindRole() {
        var self = this;

        if (self.parentNode && self.parentNode.type === 'user') {
          var selectedRoles = [], bindRoles = [];

          _.map(self.roles, function (item) {
            if (item.checked) {
              selectedRoles.push(item.roleId);
              bindRoles.push(item);
            }
          });
          let oldRoleIds = _.map(self.roleList, function (item) {
            return item.roleId;
          }).join(',');

          if (oldRoleIds === selectedRoles.join(',')) {
            return self.$message.error(self.$t('auth.msg.role_not_modify'));
          }
          self.$store.dispatch("saveRoleBind", {
            userId: self.parentNode.id,
            roleId: selectedRoles.join(',')
          }).then(function () {
            self.$message.success(self.$t('auth.msg.bind_success'));
            self.$emit("roleEmployeeBind", bindRoles);

            self.roleList = _.map(selectedRoles,function (item) {
              return {roleId: item}
            });
          }).catch(function (error) {
            self.$message.error(typeof error === "string" ? error : self.$t('auth.msg.bind_fail'));
          });
        } else {
          self.$message.warning(self.$t('auth.msg.choice_user'));
        }
      },

      //重置角色选择
      resetRoleCheck() {
        var self = this;

        self.roles = _.map(self.roles, function (item) {
          var result = _.findWhere(self.roleList, {roleId: item.roleId});
          if (result) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        });

        if (_.where(self.roles, {checked: true}).length === self.roles.length && !self.status.isAllRoleChecked) {
          self.status.isAllRoleChecked = true;
        }
        if (_.where(self.roles, {checked: true}).length !== self.roles.length && self.status.isAllRoleChecked) {
          self.status.isAllRoleChecked = false;
        }
      },
      //显示角色添加
      showRoleAdd() {
        var self = this, flag = true;

        _.map(self.roles, function (item) {
          if (item.isShowEdit) {
            flag = false;
          }
        });

        if (self.status.isShowRoleAdd || !flag) {
          self.$message.warning(self.$t('auth.msg.have_unfinished'));
        } else {
          self.status.isShowRoleAdd = true;
        }
      },
      //取消新增角色
      cancelRoleAdd() {
        this.roleAdd.roleName = '';
        this.status.isShowRoleAdd = false;
      },
      //保存新增角色
      saveRole() {
        let self = this, roleName = self.roleAdd.roleName;

        if (roleName == '') {
          self.$message.warning(self.$t('auth.msg.role_name'));

        } else {
          self.$store.dispatch('saveRole', {roleName}).then((data) => {
            self.roles.push({
              roleId: data.roleId,
              roleName: roleName,
              isShowEdit: false
            });
            self.cancelRoleAdd();
            self.$message.success(self.$t('auth.msg.add_success'));
          }).catch((error) => {
            self.$message.error(typeof error === "string" ? error : self.$t('auth.msg.add_fail'));
          });
        }
      },
      //显示角色修改
      updateRole(item) {
        var self = this, flag = true;

        _.map(self.roles, (item) => {
          if (item.isShowEdit) {
            flag = false;
          }
        });

        if (self.status.isShowRoleAdd || !flag) {
          self.$message.warning(self.$t('auth.msg.have_unfinished'));
        } else {
          item.isShowEdit = true;
        }
      },
      //保存角色修改
      modifyRole(item) {
        var self = this;

        if (item.roleName == '') {
          self.$message.warning(self.$t('auth.msg.role_name'));

        } else {
          self.$store.dispatch('modifyRole', {
            roleId: item.roleId,
            roleName: item.roleName
          }).then(function () {
            item.isShowEdit = false;
            self.$message.success(self.$t('common.msg.update_success'));

          }).catch(function (error) {
            self.$message.error(typeof error === "string" ? error : self.$t('common.msg.update_fail'));
          });
        }
      },
      //删除角色
      removeRole(item) {
        var self = this;

        self.$confirm(self.$t('auth.msg.sure_remove'), self.$t('common.msg.prompt'), {
          confirmButtonText: self.$t('common.msg.determine'),
          cancelButtonText: self.$t('common.msg.cancel'),
          type: 'warning'
        }).then(() => {
          self.$store.dispatch('removeRole', {
            roleId: item.roleId,
          }).then(() => {
            self.$message.success(self.$t('common.msg.delete_success'));
            self.queryAllRole();
          }).catch((error) => {
            self.$message.error(typeof error === "string" ? error : self.$t('auth.msg.remove_fail'));
          });
        }).catch(() => {
        });
      },
      //角色选中事件
      onRoleCheck(item) {
        var self = this;

        var tempArray = [];

        if (item.checked) {
          self.checkedRole.push(item.roleId);
          tempArray = _.uniq(self.checkedRole);

          if (_.where(self.roles, {checked: true}).length === self.roles.length && !self.status.isAllRoleChecked) {
            self.status.isAllRoleChecked = true;
          }
        } else {
          tempArray = _.without(self.checkedRole, item.roleId);
          if (_.where(self.roles, {checked: true}).length !== self.roles.length && self.status.isAllRoleChecked) {
            self.status.isAllRoleChecked = false;
          }
        }
        self.checkedRole = tempArray;
      },
      //角色点击事件
      onRoleClick(roleItem) {
        let self = this, roleId = null;

        if (roleItem && typeof roleItem === 'string') {
          roleId = roleItem;
        } else {
          roleId = roleItem.roleId;
        }

        self.$store.dispatch('findPermissionByRole', {roleId: roleId}).then((data) => {
          if (data && _.isArray(data)) {
            self.selectedRole = roleId;

            self.roles = _.map(self.roles, function (item) {
              item.active = (item.roleId == roleId);
              item.checked = false;
              return item;
            });
            self.clearCurrentPermission();
            self.$emit("roleClick", _.map(data, (item) => {
              item.type = 'role';
              return item;
            }));
          }
        }).catch(function (error) {
          self.$message.error(typeof error === "string" ? error : self.$t('common.msg.query_fail'));
        });
      },
      //清空许可选中状态
      clearCurrentPermission() {
        var self = this;

        self.permissions = _.map(self.permissions, function (item) {
          item.active = false;
          return item;
        });
      },
      //清空角色选中状态
      clearCurrentRole() {
        var self = this;

        self.roles = _.map(self.roles, function (item) {
          item.active = false;
          return item;
        });
      }
    }
  }
</script>
