<!--操作-->
<style scoped lang="less" src='./style.less'></style>

<template>
  <div id='ap_system_operation' v-show='showOperation'>
    <div class="panel">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('resource.label.opt')}}</h2>
        <div class="panel-opt">
          <ul>
            <li @click='showOptAdd' v-permissions="{options: $store.state.options, opt: 'RESOURCE_03'}"><i class='icon iconfont icon-ap-add'></i></li>
          </ul>
        </div>
      </div>
      <div class='panel-body' :style="{'height': ($store.state.min_height-$store.state.base_height_difference) + 'px'}">
        <div class="operation col-xs-12">
          <div class='col-xs-4 label' align="center"><b>{{$t('resource.label.opt_name')}}</b></div>
          <div class='col-xs-5 label' align="center"><b>{{$t('resource.label.opt_code')}}</b></div>
          <div class='col-xs-3 label' align="center"><b>{{$t('resource.label.opt')}}</b></div>
        </div>
        <div class="operation col-xs-12" v-for='item in operations' v-if='operations.length > 0'>
          <div class='label col-xs-4' v-show='!item.isShowEdit' :title="item.operationName">
            {{item.operationName}}
          </div>
          <div class='label col-xs-5' v-show='!item.isShowEdit' :title="item.operationCode">
            {{item.operationCode}}
          </div>
          <div class='col-xs-4' v-show='item.isShowEdit'>
            <input v-model='item.operationName' :title="item.operationName" class="form-control input-sm"
                   :placeholder="$t('resource.label.opt_name')"/>
          </div>
          <div class='col-xs-5' v-show='item.isShowEdit'>
            <input v-model='item.operationCode' :title="item.operationName" class="form-control input-sm"
                   :placeholder="$t('resource.label.opt_code')"/>
          </div>
          <div class='col-xs-3 opt'>
              <a class="pointer edit" v-permissions="{options: $store.state.options, opt: 'RESOURCE_03'}" v-show='item.isShowEdit' @click='modifyOpt(item)'><i class="icon iconfont icon-ap-save1"></i></a>
              <a class="pointer edit" v-permissions="{options: $store.state.options, opt: 'RESOURCE_03'}" v-show='!item.isShowEdit' @click='updateOpt(item)'><i class="icon iconfont icon-ap-modify"></i></a>
              <a class="pointer remove" v-permissions="{options: $store.state.options, opt: 'RESOURCE_03'}" @click="removeOpt(item)"><i class="icon iconfont icon-ap-delete"></i></a>
          </div>
        </div>
        <div class='operation col-xs-12' v-show='status.isShowOptAdd'>
          <div class='col-xs-4'>
            <input v-model='operationAdd.operationName' class="form-control input-sm" :placeholder="$t('resource.label.opt_name')"/>
          </div>
          <div class='col-xs-5'>
            <input v-model='operationAdd.operationCode' class="form-control input-sm" :placeholder="$t('resource.label.opt_code')"/>
          </div>
          <div class='col-xs-3 opt'>
            <a class="pointer edit" v-permissions="{options: $store.state.options, opt: 'RESOURCE_03'}" @click='saveOpt'><i class="icon iconfont icon-ap-save"></i></a>
            <a class="pointer remove" v-permissions="{options: $store.state.options, opt: 'RESOURCE_03'}" @click='cancelOptAdd'><i class="icon iconfont icon-ap-delete"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      showOperation: {
        type: Boolean,
        default: false
      },
      itemId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        operationAdd: {
          operationName: '',
          operationCode: ''
        },
        operations: [],
        status: {
          isShowOptAdd: false
        },
        operationRules:null
      }
    },
    watch: {
      'itemId': 'queryOperation'
    },
    methods: {
      //查询关联的操作
      queryOperation() {
        var self = this;

        if (self.status.isShowOptAdd) {
          self.status.isShowOptAdd = false;
        }

        if (self.itemId) {
          self.$store.dispatch('queryOperation', {resourceId: self.itemId}).then(function (data) {
            self.operations = _.map(data, function (item) {
              item.isShowEdit = false;
              return item;
            });
          }).catch(function (error) {
            if (error && typeof error === 'string') {
              self.$message.error(error);
            }
          });
        } else {
          self.operations = [];
        }
      },
      //显示新增
      showOptAdd() {
        var self = this;

        if (self.itemId === '') {
          this.$message.warning(this.$t('resource.msg.need_selected'));
        } else {
          var flag = true;

          _.map(self.operations, function (item) {
            if (item.isShowEdit) {
              flag = false;
            }
          });

          if (this.status.isShowOptAdd || !flag) {
            this.$message.warning(this.$t('resource.msg.un_finished'));
          } else {
            this.status.isShowOptAdd = true;
          }
        }
      },
      //取消新增
      cancelOptAdd() {
        this.operationAdd.operationName = '';
        this.operationAdd.operationCode = '';
        this.status.isShowOptAdd = false;
      },
      //保存新增
      saveOpt() {
        var self = this;

        if (self.operationAdd.operationName === '' || self.operationAdd.operationName.trim() !== self.operationAdd.operationName) {
          self.$message.warning(self.$t('resource.msg.opt_need_name'));
          return;
        }
        if (self.operationAdd.operationName.length > 20) {
          self.$message.warning(self.$t('resource.msg.opt_name_len_20'));
          return;
        }
        if (!/^(\w|[\u4e00-\u9fa5])+$/.test(self.operationAdd.operationName)) {
          self.$message.warning(self.$t('resource.msg.opt_name_validate'));
          return;
        }

        if (self.operationAdd.operationCode === '' || self.operationAdd.operationCode.trim() !== self.operationAdd.operationCode) {
          self.$message.warning(self.$t('resource.msg.opt_need_code'));
          return;
        }
        if (self.operationAdd.operationCode.length > 20) {
          self.$message.warning(self.$t('resource.msg.opt_code_len_20'));
          return;
        }
        if (!/^\w+$/.test(self.operationAdd.operationCode)) {
          self.$message.warning(self.$t('resource.msg.opt_code_validate'));
          return;
        }

        var params = {
          resourceId: self.itemId,
          operationName: self.operationAdd.operationName,
          operationCode: self.operationAdd.operationCode
        };

        self.$store.dispatch('addOperation', params).then(function (data) {
          self.$message.success(self.$t('common.msg.add_success'));
          self.cancelOptAdd();
          self.queryOperation();
        }).catch(function (error) {
          self.$message.error(typeof error === 'string' ? error : self.$t('common.msg.add_fail'));
        });
      },
      //显示修改
      updateOpt(item) {
        var self = this, flag = true;

        _.map(self.operations, function (item) {
          if (item.isShowEdit) {
            flag = false;
          }
        });

        if (this.status.isShowOptAdd || !flag) {
          self.$message.warning(self.$t('resource.msg.un_finished'));
        } else {
          item.isShowEdit = true;
        }
      },
      //保存修改
      modifyOpt (item) {
        var self = this;

        if (item.operationName === '' || item.operationName.trim() !== item.operationName) {
          self.$message.warning(self.$t('resource.msg.opt_need_name'));
          return;
        }
        if (item.operationName.length > 20) {
          self.$message.warning(self.$t('resource.msg.opt_name_len_20'));
          return;
        }
        if (!/^(\w|[\u4e00-\u9fa5])+$/.test(item.operationName)) {
          self.$message.warning(self.$t('resource.msg.opt_name_validate'));
          return;
        }

        if (item.operationCode === '' || item.operationCode.trim() !== item.operationCode) {
          self.$message.warning(self.$t('resource.msg.opt_need_code'));
          return;
        }
        if (item.operationCode.length > 20) {
          self.$message.warning(self.$t('resource.msg.opt_code_len_20'));
          return;
        }
        if (!/^\w+$/.test(item.operationCode)) {
          self.$message.warning(self.$t('resource.msg.opt_code_validate'));
          return;
        }

        var params = {
          operationId: item.operationId,
          operationName: item.operationName,
          operationCode: item.operationCode
        };

        self.$store.dispatch('modifyOperation', params).then(function () {
          item.isShowEdit = false;
          self.$message.success(self.$t('common.msg.update_success'));
        }).catch(function (error) {
          self.$message.error(typeof error === 'string' ? error : self.$t('common.msg.update_fail'));
        });
      },
      //删除
      removeOpt(item) {
        var self = this;

        self.$confirm(self.$t('common.label.sure_remove'), self.$t('common.label.prompt'), {
          confirmButtonText: self.$t('common.label.determine'),
          cancelButtonText: self.$t('common.label.cancel'),
          type: 'warning'
        }).then(function() {
          self.$store.dispatch('removeOperation', {
            resourceId: self.itemId,
            operationId: item.operationId
          }).then(function () {
            self.$message.success(self.$t('common.msg.delete_success'));
            self.queryOperation();
          }).catch(function (error) {
            self.$message.error(typeof error === "string" ? error : self.$t('common.msg.delete_fail'));
          });
        }).catch(function () {
        });
      }
    }
  }
</script>
