<!--字典修改-->
<style scoped lang="less" src="./style.less"></style>

<template>
  <div id="ap_system_dict_edit" v-show="showEdit">
    <div class="panel">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('dict.label.dict_detail')}}</h2>
        <div class="panel-opt">
          <ul>
            <li @click="saveDict" v-permissions="{options: this.$store.state.options, opt: 'LIBRARY_03'}"><i class="icon iconfont icon-ap-save1"></i></li>
            <li @click="resetEditForm" v-permissions="{options: this.$store.state.options, opt: 'LIBRARY_03'}"><i class="icon iconfont icon-ap-reset1"></i></li>
            <li @click="removeDict" v-permissions="{options: this.$store.state.options, opt: 'LIBRARY_04'}"><i class="icon iconfont icon-ap-delete"></i></li>
            <li @click="closeEditForm"><i class="icon iconfont icon-ap-close"></i></li>
          </ul>
        </div>
      </div>
      <div class="panel-body"
           :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">

          <el-form class="app_form" :model="editForm" ref="editForm" :rules="editRules" label-width="102px">
            <el-form-item :label="$t('dict.label.dict_name')" prop="libraryName" require>
              <el-input v-model="editForm.libraryName" :placeholder="$t('dict.label.dict_name')"
                        :maxlength=30 :disabled="isCanEdit"></el-input>
            </el-form-item>
            <el-form-item :label="$t('dict.label.dict_code')" prop="libraryCode" require>
              <el-input v-model="editForm.libraryCode" :placeholder="$t('dict.label.dict_code')"
                        :maxlength=30 :disabled="isCanEdit"></el-input>
            </el-form-item>
          </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {Validate} from 'utils';

  export default {
    props: {
      showEdit: {
        type: Boolean,
        default: false
      },
      parent: {
        type: Object,
        default: null
      },
      isParent: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        editForm: {
          libraryId: '',
          libraryParentId: '',
          libraryCode: '',
          libraryName: ''
        },
        editRules: null,
        isCanEdit: true
      };
    },
    watch: {
      "parent": "init",
      "showEdit": function () {
        if (!this.showEdit) {
          this.$refs.editForm.resetFields();
        } else {
          this.init();
        }
      }
    },
    created () {
      this.initRules();

      this.isCanEdit = this.auth();
    },
    methods: {
      initRules() {
        this.editRules = {
          libraryCode: [
            {required: true, message: this.$t('dict.msg.need_code'), trigger: 'blur'},
            {max: 30, message: this.$t('dict.msg.length_30')},
            {validator: Validate.code, trigger: "blur"},
            {validator: Validate.trim, trigger: "blur"}
          ],
          libraryName: [
            {required: true, message: this.$t('dict.msg.need_name'), trigger: 'blur'},
            {max: 30, message: this.$t('dict.msg.length_30')},
//            {validator: Validate.name, trigger: "blur"},
            {validator: Validate.trim, trigger: "blur"}
          ]
        };
      },
      //初始化
      init (){
        if (this.parent) {
          this.editForm = {
            libraryId: this.parent.libraryId,
            libraryParentId: this.parent.libraryParentId,
            libraryName: this.parent.libraryName,
            libraryCode: this.parent.libraryCode,
            type: this.parent.type
          };
        }
      },
      //判断权限
      auth() {
        let flag = true, options = this.$store.state.options;

        var verify = function () {
          var result = _.filter(options,function (item) {
            if (item.operationCode === "LIBRARY_03") {
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

      //保存
      saveDict() {
        var self = this;

        self.$refs.editForm.validate(function (valid) {
          if (valid) {
            var params = {
              libraryId: self.editForm.libraryId,
              libraryParentId: self.editForm.libraryParentId,
              libraryCode: self.editForm.libraryCode,
              libraryName: self.editForm.libraryName,
              type: self.editForm.type
            };
            self.$store.dispatch('modifyDataItemById', params).then(function () {
              self.$emit("save", self.editForm.libraryId, params);
              self.$message.success(self.$t('common.msg.update_success'));

            }).catch(function (error) {
              self.$message.error(typeof error === "string" ? error : self.$t('common.msg.update_fail'));
            });
          }
        });
      },
      //重置
      resetEditForm() {
        this.$refs.editForm.resetFields();
        this.editForm = {
          libraryId: this.parent.libraryId,
          libraryParentId: this.parent.libraryParentId,
          libraryName: this.parent.libraryName,
          libraryCode: this.parent.libraryCode
        };
      },
      //删除
      removeDict() {
        var self = this;

        if (self.isParent) {
          self.$message.warning(self.$t('dict.msg.no_remove'));
        } else {
          self.$confirm(self.$t('common.label.sure_remove'), self.$t('common.label.prompt'), {
            confirmButtonText: self.$t('common.label.determine'),
            cancelButtonText: self.$t('common.label.cancel'),
            type: 'warning'
          }).then(function () {
            self.$store.dispatch("removeDataItemById", {libraryId: self.editForm.libraryId}).then(function() {
              self.$message.success(self.$t('common.msg.delete_success'));
              self.$emit("remove", self.editForm.libraryId);
              self.closeEditForm();

            }).catch(function (message) {
              if (message && typeof message === "string") {
                self.$message.error(message);
              }
            });
          }).catch(function(){});
        }
      },
      //关闭
      closeEditForm() {
        let self = this;
        self.$refs.editForm.resetFields();
        self.$emit("close");
      }
    }
  }
</script>
