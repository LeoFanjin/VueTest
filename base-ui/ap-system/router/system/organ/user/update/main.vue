<!-- 员工管理 -->
<style scoped>
  .app_form {
    text-align: left;
    width: 70%;
  }
</style>
<template>
  <div id="ui_system_user_update" v-if="value">
    <div class="panel">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('organ.label.modify_user_info')}}</h2>
        <div class="panel-opt">
          <ul>
            <li @click="initPassword" v-permissions="{options: this.$store.state.options, opt: 'USER_03'}"><i class="icon iconfont icon-ap-resetpassword"></i></li>
            <li @click="submitForm" v-permissions="{options: this.$store.state.options, opt: 'USER_03'}"><i class="icon iconfont icon-ap-save1"></i></li>
            <li @click="resetEditForm" v-permissions="{options: this.$store.state.options, opt: 'USER_03'}"><i class="icon iconfont icon-ap-reset1"></i></li>
            <li @click="close"><i class="icon iconfont icon-ap-close"></i></li>
          </ul>
        </div>
      </div>

      <div class="panel-body" style="overflow-y: auto;min-height: 300px;"
           :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">
        <el-form class="app_form" ref="form" :model="form" :rules="rules" label-width="90px">
          <!-- 员工名 username -->
          <el-form-item :label="$t('organ.label.user_username')" prop="userAccount" required>
            <el-input v-model="form.userAccount" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('organ.label.user_phone')" prop="userTelnumber">
            <el-input v-model="form.userTelnumber" auto-complete="off"
                      :placeholder="$t('organ.label.user_enter_phone')" :disabled="this.isCanEdit"></el-input>
          </el-form-item>
          <el-form-item :label="$t('organ.label.user_email')" prop="userMail">
            <el-input v-model="form.userMail" :placeholder="$t('organ.label.user_enter_email')" :disabled="this.isCanEdit"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="userName">
            <el-input v-model="form.userName" placeholder="姓名" :disabled="this.isCanEdit"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="userGender">
            <el-select v-model="form.userGender" clearable placeholder="性别">
              <el-option
                      v-for="item in $store.state.gender"
                      :label="item.libraryName"
                      :value="item.libraryCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位" prop="userPosition">
            <el-select v-model="form.userPosition" placeholder="请输入职位">
              <el-option
                      v-for="item in $store.state.position"
                      :label="item.libraryName"
                      :value="item.libraryCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="userNation">
            <el-select v-model="form.userNation" clearable placeholder="民族">
              <el-option
                      v-for="item in $store.state.nation"
                      :label="item.libraryName"
                      :value="item.libraryCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" placeholder="身份证号" :disabled="this.isCanEdit"></el-input>
          </el-form-item>
          <el-form-item label="座机号" prop="userDomicile">
            <el-input v-model="form.userDomicile" placeholder="座机号" :disabled="this.isCanEdit"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="userAddress">
            <el-input
                    type="textarea"
                    :rows="2" v-model="form.userAddress" placeholder="地址" :disabled="this.isCanEdit"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="userBirth">
            <el-date-picker v-model="form.userBirth" type="date" :editable="false" :disabled="this.isCanEdit"
                            placeholder="生日"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {Validate, constant} from "utils";
  import Moment from "moment";

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      organ: {
        type: Object,
        default: null
      },
      item: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        cloneDetail: {},
        query: {
          userId: ''
        },
        form: {
          userId: '',
          userAccount: "",
          userPassword: '',
          s_password: '',
          userTelnumber: '',
          userMail: '',
          organId: '',
          "userName":"",
          "userGender":"",
          "userPosition":"",
          "userNation":"",
          "userAddress":"",
          "idCard":"",
          "userDomicile":"",
          "userBirth":""
        },
        /* 检测员工属性  */
        rules: null,
        isCanEdit: null
      }
    },
    watch: {
      "item": function () {
        if (this.item) {
          this.initUserInfo();
        }
      },
      "value": function () {
        if (!this.value) {
          this.clearForm();
        }
      }
    },
    created() {
      this.initRules();
      this.isCanEdit = this.auth();
    },
    methods: {
      //判断权限
      auth() {
        let flag = true, options = this.$store.state.options;

        var verify = function () {
          var result = _.filter(options,function (item) {
            if (item.operationCode === "USER_03") {
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
        this.rules = {
          userAccount: [
            {required: true, message: this.$t('organ.msg.user_enter_account'), trigger: 'blur'},
            {min: 2, max: 15, message: this.$t('organ.msg.organ_len_15')},
            {validator: Validate.trim, trigger: "blur"}
          ],
          userMail: [
            {type: "email", message: this.$t('organ.msg.email_fail'), trigger: 'blur'},
            {validator: Validate.trim, trigger: "blur"}
          ],
          userTelnumber: [
            {validator: Validate.phone, trigger: 'blur'},
            {validator: Validate.trim, trigger: "blur"}
          ],
          userName: [
            {required: true, message: "姓名必填", trigger: 'blur'},
            {max: 30, message: "长度不能超过 30 个字符"}
          ],
          userPosition: [
            {max: 30, message: "长度不能超过 30 个字符"}
          ],
          userAddress: [
            {max: 100, message: "长度不能超过 100 个字符"}
          ],
          idCard: [
            {validator: Validate.identity, required: false, trigger: 'blur'}
          ],
          userDomicile: [
            {max: 30, message: "长度不能超过 30 个字符"}
          ]
        };
      },
      initUserInfo() {
        var self = this;

        if (!self.item) {
          return;
        }

        self.$store.dispatch("queryEmployeeInfoDetail", {userId: self.item.userId}).then(function (data) {
          self.form = data;
          self.cloneDetail = _.clone(self.form);
        }).catch(function (error) {
          if (error && typeof error === 'string') {
            self.$message.error(error);
          }
        });
      },
      submitForm() {
        var self = this;

        this.$refs.form.validate(function (valid) {
          if (valid) {
            self.$store.dispatch("modifyUserRegInfo", {
              userId: self.form.userId,
              userTelnumber: self.form.userTelnumber,
              userMail: self.form.userMail,
              userName: self.form.userName,
              userGender: self.form.userGender,
              userPosition: self.form.userPosition,
              userNation: self.form.userNation,
              userAddress: self.form.userAddress,
              idCard: self.form.idCard,
              userDomicile: self.form.userDomicile,
              userBirth: self.form.userBirth ?  Moment(self.form.userBirth).format('YYYY-MM-DD') + " 00:00:00" : ""
            }).then(function () {
              self.$message.success(self.$t('common.msg.update_success'));
              self.close();
            }).catch(function (error) {
              self.$message.error(typeof error === "string" ? error : self.$t('common.msg.update_fail'));
            });
          }
        });
      },
      //重置
      resetEditForm() {
        var self = this;

        self.$refs.form.resetFields();
        if (!_.isEmpty(self.cloneDetail)) {
          self.form = _.clone(self.cloneDetail);
        }
      },
      clearForm() {
        this.$refs.form.resetFields();
        this.cloneDetail = {};
      },
      /** 初始化密码 */
      initPassword() {
        var self = this;

        self.$confirm(self.$t('organ.msg.sure_init_password'), '', {
          type: "success",
          confirmButtonText: self.$t('common.label.determine'),
          cancelButtonText: self.$t('common.label.cancel')
        }).then(() => {
          self.$store.dispatch("initPassword", {userId: self.form.userId}).then(function () {
            self.$message.success(self.$t('organ.msg.init_pass_success'));
          }).catch(function (error) {
            self.$message.error(typeof error === "string" ? error : self.$t('organ.msg.init_pass_fail'));
          });
        }).catch(function () {
        });
      },
      close() {
        this.clearForm();
        this.$emit("close");
      }
    }
  }
</script>
