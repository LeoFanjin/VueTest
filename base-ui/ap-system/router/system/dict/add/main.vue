<!--字典添加-->
<style scoped src="./style.less"></style>

<template>
  <div id="ap_system_dict_add" v-show="showAdd">
    <div class="panel">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('dict.label.add_dict')}}</h2>
        <div class="panel-opt">
          <ul>
            <li @click="saveDict"><i class="icon iconfont icon-ap-save1"></i></li>
            <li @click="cleanAddForm"><i class="icon iconfont icon-ap-empty"></i></li>
            <li @click="closeDictAdd"><i class="icon iconfont icon-ap-close"></i></li>
          </ul>
        </div>
      </div>
      <div class="panel-body"
           :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">
        <el-form class="app_form" :model="addForm" ref="addForm" :rules="addRules" label-width="102px">
          <el-form-item :label="$t('dict.label.dict_name')" prop="libraryName" require>
            <el-input v-model="addForm.libraryName" :placeholder="$t('dict.label.dict_name')"
                      :maxlength=30></el-input>
          </el-form-item>
          <el-form-item :label="$t('dict.label.dict_code')" prop="libraryCode" require>
            <el-input v-model="addForm.libraryCode" :placeholder="$t('dict.label.dict_code')"
                      :maxlength=30></el-input>
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
      showAdd: {
        type: Boolean,
        default: false
      },
      itemId: {
        type: String,
        default: ''
      }
    },
    data(){
      return {
        addForm: {
          libraryCode: '',
          libraryName: ''
        },
        addRules: null
      }
    },
    watch: {
      "showAdd": function () {
        if (!this.showAdd) {
          this.$refs.addForm.resetFields();
        }
      }
    },
    created() {
      this.initRules();
    },
    methods: {
      initRules() {
        this.addRules = {
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
      //保存字典
      saveDict() {
        var self = this;

        self.$refs.addForm.validate((valid) => {
          if (valid) {
            var newDict = {
              libraryParentId: self.itemId,
              libraryCode: self.addForm.libraryCode,
              libraryName: self.addForm.libraryName
            };

            self.$store.dispatch('saveDict', newDict).then((data) => {
              if (data) {
                data.type = data.libraryParentId === '0' ? '1' : '2';
                self.$emit("add", data.libraryParentId, data);
              }
              //关闭悬浮层
              self.closeDictAdd();
              self.$message.success(this.$t('common.msg.add_success'));
            }).catch((error) => {
              self.$message.error(typeof error === "string" ? error : this.$t('common.msg.add_fail'));
            });
          }
        });
      },
      //清空
      cleanAddForm() {
        this.$refs.addForm.resetFields();
      },
      //关闭
      closeDictAdd() {
        this.$refs.addForm.resetFields();
        this.$emit("close");
      }
    }
  }
</script>
