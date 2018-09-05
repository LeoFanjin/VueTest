<!--资源添加-->
<style scoped lang="less" src="./style.less"></style>

<template>
  <div id="ap_sys_resource_add" v-show="showAdd">
    <div class="panel">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('resource.label.add_resource')}}</h2>
        <div class="panel-opt">
          <ul>
            <li @click="addResource"><i class="icon iconfont icon-ap-save1"></i></li>
            <li @click="cleanAddForm"><i class="icon iconfont icon-ap-empty"></i></li>
            <li @click="closeResourceAdd"><i class="icon iconfont icon-ap-close"></i></li>
          </ul>
        </div>
      </div>
      <div class="panel-body"
           :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">
        <el-form class="app_form" :model="addForm" ref="addForm" :rules="addRules" label-width="100px">
          <el-form-item :label="$t('resource.label.resource_name')" prop="resourceName">
            <el-input v-model="addForm.resourceName" :placeholder="$t('resource.label.resource_name')" :minlength=2 :maxlength=20></el-input>
          </el-form-item>
          <el-form-item :label="$t('resource.label.resource_type')" prop="resourceType">
            <el-select v-model="addForm.resourceType" :placeholder="$t('resource.label.resource_type')">
              <el-option v-for="item in $store.state[dict_code.RESOURCE_TYPE]" :label="item.libraryName"
                         :value="item.libraryCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('resource.label.resource_url')" prop="resourceAddress">
            <el-input type="textarea" v-model="addForm.resourceAddress" :maxlength=50 :placeholder="$t('resource.label.resource_url')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('resource.label.resource_note')" prop="resourceDesc">
            <el-input type="textarea" v-model="addForm.resourceDesc" :maxlength=100 :placeholder="$t('resource.label.resource_note')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('resource.label.resource_icon')" prop="resourceIconAddress">
            <el-input v-model="addForm.resourceIconAddress" :placeholder="$t('resource.label.resource_icon')"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {Validate, constant} from "utils";

  export default {
    props: {
      showAdd: {
        type: Boolean,
        default: false
      },
      parentNode: {
        type: Object,
        default: null
      }
    },
    watch: {
      "showAdd": function () {
        if (this.parentNode && this.parentNode.resourceType) {
          this.addForm.resourceType = this.parentNode.resourceType;
        }
        if (!this.showAdd) {
          this.cleanAddForm();
        }
      }
    },
    data(){
      return {
        dict_code: {
          RESOURCE_TYPE: constant.dict_type.RESOURCE_TYPE
        },
        addForm: {
          resourceName: '',
          resourceType: '',
          resourceAddress: '',
          resourceDesc: '',
          resourceIconAddress: ''
        },
        addRules: null
      }
    },
    created() {
      this.initRules();
    },
    methods: {
      initRules() {
        this.addRules = {
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
      //保存资源
      addResource() {
        var self = this;

        self.$refs.addForm.validate(function (valid) {
          if (valid) {
            var resLevel = 1, pId = '';

            if (self.parentNode !== null) {
              pId = self.parentNode.resourceId;
              resLevel = self.parentNode.resourceLevel + 1;
            }
            if (self.addForm.resourceIconAddress === "") {
              self.addForm.resourceIconAddress = "&#xe61;";
            } else {
              self.addForm.resourceIconAddress = self.addForm.resourceIconAddress;
            }

            var path = "0";

            if (self.parentNode) {
              var pPath =  self.parentNode.resourcePath ? (self.parentNode.resourcePath + "_") : "";
              path = pPath + self.parentNode.resourceId;
            }

            self.$store.dispatch('addResource', {
              resourceName: self.addForm.resourceName,
              resourceAddress: self.addForm.resourceAddress,
              resourceType: self.addForm.resourceType,
              resourceDesc: self.addForm.resourceDesc,
              resourceIconAddress: self.addForm.resourceIconAddress,
              resourceParentId: pId,
              resourceLevel: resLevel,
              resourcePath: path
            }).then(function (data) {
              self.$message.success(self.$t('common.msg.add_success'));
              self.$emit("add",data);
              self.closeResourceAdd();

            }).catch(function (error) {
              self.$message.error(typeof error === "string" ? error : self.$t('common.msg.add_fail'));
            });
          }
        });
      },
      //清空
      cleanAddForm() {
        this.$refs.addForm.resetFields();
      },
      //关闭
      closeResourceAdd() {
        this.$refs.addForm.resetFields();
        this.$emit("close");
      }
    }
  }
</script>
