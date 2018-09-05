<template>
  <sinosoft_modal v-model="value" :title="$t('organ.label.modify_organ')">
    <li slot="opt"  @click="update"><i class="icon iconfont icon-ap-save1"></i></li>
    <li slot="opt"  @click="reset"><i class="icon iconfont icon-ap-reset1"></i></li>
    <el-form class="app_form" ref="editForm" :model="editForm" :rules="rules" label-width="100px">
      <el-form-item :label="$t('organ.label.organ_name')" prop="organName" required>
        <el-input v-model="editForm.organName" :maxlength=20
                  :placeholder="$t('organ.label.enter_organ_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('organ.label.organ_code')" prop="organCode" required>
        <el-input v-model="editForm.organCode" :maxlength=20
                  :placeholder="$t('organ.label.enter_organ_code')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('organ.label.organ_desc')" prop="organDesc">
        <el-input v-model="editForm.organDesc" type="textarea" :maxlength=100 :rows="2"
                  :placeholder="$t('organ.label.enter_organ_desc')"></el-input>
      </el-form-item>
    </el-form>
  </sinosoft_modal>
</template>

<script>
  import {Validate, constant} from "utils";
  import sinosoft_modal from 'components/dialog';

  export default {
    components: {
      sinosoft_modal
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      currentNode: {
        type: Object,
        default: function () {
          return null;
        }
      }
    },
    data() {
      return {
        cloneOrgan: {
          organName: '',
          organCode: '',
          organDesc: ''
        },
        editForm: {
          organId: '',
          organName: '',
          organCode: '',
          organDesc: ''
        },
        rules: null
      }
    },
    watch: {
      value(value) {
        this.$emit("input", value);
      },
      currentNode(value) {
        if (value) {
          this.editForm = value;
          this.cloneOrgan = _.clone(value);
        } else {
          this.editForm = {
            organId: '',
            organName: '',
            organCode: '',
            organDesc: ''
          };
          this.cloneOrgan = null;
        }
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
      update() {
        var self = this;

        self.$refs.editForm.validate(function (valid) {
          if (valid) {
            var newOrgan = {
              organId: self.editForm.organId,
              organName: self.editForm.organName,
              organCode: self.editForm.organCode,
              organDesc: self.editForm.organDesc
            };

            self.$store.dispatch('modifyOrgan', newOrgan).then(function () {
              self.$message.success(self.$t('common.msg.update_success'));
              self.$emit("save", newOrgan.organId, newOrgan);
              self.close();
            }).catch(function (error) {
              self.$message.error(typeof error === "string" ? error : self.$t('common.msg.update_fail'));
            });
          }
        });
      },
      close() {
        this.$refs.editForm.resetFields();
        this.value = false;
      },
      reset() {
        this.$refs.editForm.resetFields();
        this.editForm = _.clone(this.cloneOrgan);
      }
    }
  }
</script>
