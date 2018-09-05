<template>
  <sinosoft_modal v-model="value" :title="$t('organ.label.organ_add')">
    <li @click="save" slot="opt"><i class="icon iconfont icon-ap-save1"></i></li>
    <li @click="clear" slot="opt"><i class="icon iconfont icon-ap-empty"></i></li>
    <el-form class="app_form" ref="addForm" :model="organAdd" :rules="rules" label-width="100px">
      <el-form-item :label="$t('organ.label.organ_name')" prop="organName" required>
        <el-input v-model="organAdd.organName" :maxlength=20 :placeholder="$t('organ.label.enter_organ_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('organ.label.organ_code')" prop="organCode" required>
        <el-input v-model="organAdd.organCode" :maxlength=20 :placeholder="$t('organ.label.enter_organ_code')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('organ.label.organ_desc')" prop="organDesc">
        <el-input v-model="organAdd.organDesc" type="textarea" :maxlength=100 :rows="2" :placeholder="$t('organ.label.enter_organ_desc')"></el-input>
      </el-form-item>
    </el-form>
  </sinosoft_modal>
</template>

<script>
  import {Validate, constant} from "utils";
  import sinosoft_modal from 'components/dialog';

  export default{
    components: {
      sinosoft_modal
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      parentNode: {
        type: Object,
        default: null
      }
    },
    watch: {
      value(value) {
        if (value) {
          this.clear();
        }
        this.$emit("input", this.value);
      }
    },
    data() {
      return {
        organAdd: {
          organName: '',
          organCode: '',
          organDesc: '',
          organPath: ''
        },
        rules: null
      }
    },
    created() {
      this.initRules();
    },
    methods: {
      initRules() {
        this.rules = {
          organName: [
            {required: true, message: this.$t('organ.msg.organ_need_name'), trigger: 'blur'},
            {min: 2, max: 20, message: this.$t('organ.msg.organ_len_20')},
            {validator: Validate.trim, trigger: "blur"},
            {validator: Validate.name, trigger: "blur"}
          ],
          organCode: [
            {required: true, message: this.$t('organ.msg.organ_need_code'), trigger: 'blur'},
            {min: 2, max: 20, message: this.$t('organ.msg.organ_len_20')},
            {validator: Validate.trim, trigger: "blur"},
            {validator: Validate.code, trigger: "blur"}
          ]
        };
      },
      save() {
        var self = this;

        self.$refs.addForm.validate((valid) => {
          if (valid) {
            var orgLevel = 1, pId = '0';

            if (self.parentNode) {
              pId = self.parentNode.organId;
              orgLevel = self.parentNode.organLevel + 1;
            }

            var path = "0";

            if (self.parentNode) {
              var pPath =  self.parentNode.organPath ? (self.parentNode.organPath + "_") : "";
              path = pPath + self.parentNode.organId;
            }

            self.$store.dispatch('saveOrgan', {
              organParentId: pId,
              organLevel: orgLevel,
              organName: self.organAdd.organName,
              organDesc: self.organAdd.organDesc,
              organCode: self.organAdd.organCode,
              organPath: path
            }).then(function (data) {
              self.$message.success(self.$t('common.msg.increase_success'));
              self.$emit("add", data);
              self.close();

            }).catch(function (error) {
              self.$message.error(typeof error === "string" ? error : self.$t('common.msg.increase_fail'));
            });
          }
        });
      },
      close() {
        var self = this;
        self.value = false;
      },
      clear() {
        this.$refs.addForm.resetFields();
      }
    }
  }
</script>
