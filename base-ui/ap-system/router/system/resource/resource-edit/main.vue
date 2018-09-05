<!--资源修改-->
<style scoped lang="less" src="./style.less"></style>

<template>
  <div id="ap_sys_resource_update" v-show="showEdit">
    <div class="panel">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('resource.label.resource_detail')}}</h2>
        <div class="panel-opt">
          <ul>
            <li @click="saveResource" v-permissions="{options: $store.state.options, opt: 'RESOURCE_03'}"><i class="icon iconfont icon-ap-save1"></i></li>
            <li @click="resetEditForm" v-permissions="{options: this.$store.state.options, opt: 'RESOURCE_03'}"><i class="icon iconfont icon-ap-reset1"></i></li>
            <li @click="removeResource" v-permissions="{options: this.$store.state.options, opt: 'RESOURCE_04'}"><i class="icon iconfont icon-ap-delete"></i></li>
            <li @click="closeEditForm"><i class="icon iconfont icon-ap-close"></i></li>
          </ul>
        </div>
      </div>
      <div class="panel-body" :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">
        <el-form class="app_form" :model="editForm" ref="editForm" :rules="editRules" label-width="100px">
          <el-form-item :label="$t('resource.label.resource_name')" prop="resourceName">
            <el-input v-model="editForm.resourceName" :placeholder="$t('resource.label.resource_name')" :minlength=2 :maxlength=20 :disabled="this.isCanEdit"></el-input>
          </el-form-item>
          <el-form-item :label="$t('resource.label.resource_type')" prop="resourceType">
            <el-select v-model="editForm.resourceType" :placeholder="$t('resource.label.resource_type')" :disabled="this.isCanEdit">
              <el-option v-for="item in $store.state[dict_code.RESOURCE_TYPE]" :label="item.libraryName" :value="item.libraryCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('resource.label.resource_url')" prop="resourceAddress">
            <el-input type="textarea" v-model="editForm.resourceAddress" :maxlength=50 :placeholder="$t('resource.label.resource_url')" :disabled="this.isCanEdit"></el-input>
          </el-form-item>
          <el-form-item :label="$t('resource.label.resource_note')" prop="resourceDesc">
            <el-input type="textarea" v-model="editForm.resourceDesc" :maxlength=100 :placeholder="$t('resource.label.resource_note')" :disabled="this.isCanEdit"></el-input>
          </el-form-item>
          <el-form-item :label="$t('resource.label.resource_icon')" prop="resourceIconAddress">
            <el-input v-model="editForm.resourceIconAddress" :placeholder="$t('resource.label.resource_icon')" :disabled="this.isCanEdit"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {Validate, constant} from "utils";
  import Promise from "bluebird";
  import _ from "underscore"

  export default {
    props: {
      showEdit: {
        type: Boolean,
        default: false
      },
      parentNode: {
        type: Object,
        default: null
      },
      itemId: {
        type: String,
        default: ''
      },
      isParent: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dict_code: {
          RESOURCE_TYPE: constant.dict_type.RESOURCE_TYPE
        },
        editForm: {
          resourceName: '',
          resourceType: '',
          resourceAddress: '',
          resourceDesc: '',
          parentResourceId: '',
          resourceIconAddress: ''
        },
        editRules: null,
        cloneDetail: {},
        isCanEdit: null
      }
    },
    watch: {
      "itemId": "init",
      "showEdit": function () {
        if (!this.showEdit) {
          this.$refs.editForm.resetFields();
          this.cloneDetail = {};
        } else {
          this.init();
        }
      }
    },
    created() {
      var self = this;

      self.initRules();
      self.isCanEdit = self.auth();
    },
    methods: {
      //判断权限
      auth() {
        let flag = true, options = this.$store.state.options;

        var verify = function () {
          var result = _.filter(options,function (item) {
            if (item.operationCode === "RESOURCE_03") {
             return item;
            }
          });
          if (result.length !== 0) {
            flag = false;
          } else {
            flag = true;
          }
        };

        if (options && options.length > 0) {
          verify();
        } else {
          flag = true;
        }
        return flag;
      },
      initRules() {
        this.editRules = {
          resourceName: [
            {required: true, message: this.$t('resource.msg.need_name'), trigger: 'blur'},
            {min: 2, max: 20, message: this.$t('resource.msg.length_20')},
            {validator: Validate.trim, trigger: "blur"}
          ],
          resourceType: [
            {required: true, message: this.$t('resource.msg.need_type'), trigger: 'change'},
            {validator: Validate.trim, trigger: "blur"}
          ]
        };
      },
      //初始化
      init() {
        var self = this;

        if (self.itemId) {
          self.editForm = {
            resourceName: self.parentNode.resourceName,
            resourceType: self.parentNode.resourceType,
            resourceLevel: self.parentNode.resourceLevel,
            resourceAddress: self.parentNode.resourceAddress,
            resourceDesc: self.parentNode.resourceDesc,
            resourceParentId: self.parentNode.resourceParentId,
            resourceIconAddress: self.parentNode.resourceIconAddress
          };
          self.cloneDetail = _.clone(self.editForm);
        }
      },
      //保存资源
      saveResource() {
        var self = this;

        self.$refs.editForm.validate(function (valid) {
          if (valid) {
            self.$store.dispatch('modifyResource', {
              resourceId: self.itemId,
              resourceName: self.editForm.resourceName,
              resourceAddress: self.editForm.resourceAddress,
              resourceType: self.editForm.resourceType,
              resourceDesc: self.editForm.resourceDesc,
              resourceIconAddress: self.editForm.resourceIconAddress
            }).then(function () {
              //修改子资源的资源类型
//              if (self.cloneDetail.resourceType !== self.editForm.resourceType
//                && self.parentNode.child
//                && self.parentNode.child.length > 0) {
//
//                return Promise.all(self.parentNode.child).map(function (sub) {
//                  return self.$store.dispatch('modifyResource', {
//                    resourceId: sub.id,
//                    resourceType: self.editForm.resourceType
//                  });
//                });
//              } else {
                return Promise.resolve(null);
//              }
            }).then(function () {
              self.$emit("save", self.itemId, {
                resourceId: self.itemId,
                resourceName: self.editForm.resourceName,
                resourceAddress: self.editForm.resourceAddress,
                resourceType: self.editForm.resourceType,
                resourceLevel: self.editForm.resourceLevel,
                resourceDesc: self.editForm.resourceDesc,
                resourceParentId: self.editForm.resourceParentId,
                resourceIconAddress: self.editForm.resourceIconAddress,
                icon: self.editForm.resourceIconAddress
              });
              self.$message.success(self.$t('common.msg.update_success'));
            }).catch(function (error) {
              self.$message.error(typeof error === "string" ? error : self.$t('common.msg.update_fail'));
            });
          }
        });
      },
      //重置
      resetEditForm() {
        var self = this;

        if (!_.isEmpty(self.cloneDetail)) {
          self.editForm = _.clone(self.cloneDetail);
        }
      },
      //删除
      removeResource() {
        var self = this;

        if (self.isParent) {
          self.$message.warning(self.$t('resource.msg.not_delete'));

        } else {
          self.$confirm(self.$t('common.label.sure_remove'), self.$t('common.label.prompt'), {
            confirmButtonText: self.$t('common.label.determine'),
            cancelButtonText: self.$t('common.label.cancel'),
            type: 'warning'
          }).then(function () {
            self.$store.dispatch('removeResource', {
              resourceId: self.itemId
            }).then(function () {
              self.$message.success(self.$t('common.msg.delete_success'));
              self.closeEditForm();
              self.$emit("remove", self.itemId);
            }).catch(function (error) {
              self.$message.error(typeof error === "string" ? error : self.$t('common.msg.delete_fail'));
            });
          }).catch(function () {
          });
        }
      },
      //关闭
      closeEditForm() {
        this.$refs.editForm.resetFields();
        this.cloneDetail = {};
        this.$emit("close");
      }
    }
  }
</script>
