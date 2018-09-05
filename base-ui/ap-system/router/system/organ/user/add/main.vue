<!-- 员工管理 -->
<style scoped>
    .app_form {
        text-align: left;
        width: 70%;
    }
</style>
<template>
    <div id="ap_system_staff_add" v-if="value">
        <div class="panel">
            <div class="panel-heading">
                <h2 class="panel-title">{{$t('organ.label.user_add')}}</h2>
                <div class="panel-opt">
                    <ul>
                        <li @click="save"><i class="icon iconfont icon-ap-save1"></i></li>
                        <li @click="clearForm"><i class="icon iconfont icon-ap-empty"></i></li>
                        <li @click="close"><i class="icon iconfont icon-ap-close"></i></li>
                    </ul>
                </div>
            </div>
            <div class="panel-body" style="overflow-y: auto;min-height: 300px;"
                 :style="{'height': (this.$store.state.min_height-$store.state.base_height_difference) + 'px'}">
                <el-form class="app_form" ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-form-item :label="$t('organ.label.user_username')" prop="userAccount" required>
                        <el-input v-model="form.userAccount" :placeholder="$t('organ.label.user_name')" :minlength=2
                                  :maxlength=30></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('common.label.password')" prop="userPassword" required>
                        <el-input type="password" v-model="form.userPassword"
                                  :placeholder="$t('common.label.enter_password')" :minlength=6
                                  :maxlength=30></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('common.label.confirm_password')" prop="s_password" required>
                        <el-input type="password" v-model="form.s_password"
                                  :placeholder="$t('common.label.enter_password')" :minlength=6
                                  :maxlength=30></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('organ.label.user_phone')" prop="userTelnumber">
                        <el-input v-model="form.userTelnumber" auto-complete="off"
                                  :placeholder="$t('organ.label.user_enter_phone')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('organ.label.user_email')" prop="userMail">
                        <el-input v-model="form.userMail" :placeholder="$t('organ.label.enter_email')"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="userName">
                        <el-input v-model="form.userName" auto-complete="off" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="userGender">
                        <el-select v-model="form.userGender" :placeholder="请选择性别">
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
                        <el-select v-model="form.userNation" :placeholder="请输入民族">
                            <el-option
                                    v-for="item in $store.state.nation"
                                    :label="item.libraryName"
                                    :value="item.libraryCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="住址" prop="userAddress">
                        <el-input type="textarea" row="2" v-model="form.userAddress" auto-complete="off"
                                  placeholder="请输入住址"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" prop="idCard">
                        <el-input v-model="form.idCard" auto-complete="off" placeholder="请输入身份证号码"></el-input>
                    </el-form-item>
                    <el-form-item label="座机号" prop="userDomicile">
                        <el-input v-model="form.userDomicile" auto-complete="off" placeholder="请输入座机号"></el-input>
                    </el-form-item>
                    <el-form-item label="生日" prop="userBirth">
                        <el-date-picker v-model="form.userBirth" type="date" :editable="false"
                                        placeholder="请选择生日"></el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {Validate, constant} from "utils";
    import md5 from "md5";

    export default{
        props: {
            value: {
                type: Boolean,
                default: false
            },
            organ: {
                type: Object,
                default: null
            }
        },
        data(){
            return {
                dict_code: {
                    GENDER: "gender",
                    NATION: "nation"
                },
                restaurants: [],
                form: {
                    userAccount: "",
                    userPassword: '',
                    s_password: '',
                    userTelnumber: '',
                    userMail: '',
                    organId: '',
                    userName: "",
                    userGender: "",
                    userPosition: "",
                    userNation: "",
                    userAddress: "",
                    idCard: "",
                    userDomicile: "",
                    userBirth: ""
                },
                /* 检测员工属性  */
                rules: null
            }
        },
        watch: {
            "value": function () {
                if (!this.value) {
                    this.clearForm();
                }
            }
        },
        created() {
            this.initRules();
        },
        methods: {
            initRules() {
                var self = this;
                this.rules = {
                    userAccount: [
                        {required: true, message: this.$t('organ.label.user_name'), trigger: 'blur'},
                        {min: 2, max: 15, message: this.$t('organ.msg.organ_len_15')},
                        {validator: Validate.trim, trigger: "blur"},
                        {
                            validator: Validate.code,
                            message: this.$t('organ.msg.organ_user_name_validate'),
                            trigger: "blur"
                        }
                    ],
                    userMail: [
                        {type: "email", message: this.$t('organ.msg.email_fail'), trigger: 'blur'},
                        {validator: Validate.trim, trigger: "blur"}
                    ],
                    userTelnumber: [
                        {validator: Validate.phone, trigger: 'blur'},
                        {validator: Validate.trim, trigger: "blur"}
                    ],
                    userPassword: [
                        {required: true, message: this.$t('organ.msg.enter_password'), trigger: 'blur'},
                        {min: 6, max: 30, message: this.$t('organ.msg.organ_len_30')},
                        {validator: Validate.trim, trigger: "blur"},
//            {validator: function (rule,value,callback) {
//              if (self.form.s_password !== "" && self.form.s_password !== null && value !== self.form.s_password) {
//                callback("两次密码输入不一样");
//              } else {
//                callback();
//              }
//            }}
                    ],
                    s_password: [
                        {required: true, message: this.$t('organ.msg.enter_again_password'), trigger: 'blur'},
                        {min: 6, max: 30, message: this.$t('organ.msg.organ_len_30')},
                        {validator: Validate.trim, trigger: "blur"},
                        {
                            validator: function (rule, value, callback) {
                                if (self.form.userPassword !== "" && self.form.userPassword !== null && value !== self.form.userPassword) {
                                    callback("两次密码输入不一样");
                                } else {
                                    callback();
                                }
                            }
                        }
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
            clearForm() {
                var self = this;
                self.form.organId = "";
                this.$refs.form.resetFields();
            },
            getOrgan() {
                var self = this;

                var o = {
                    organId: "",
                    organName: ""
                };

                if (self.organ) {
                    o = {organId: self.organ.organId, organName: self.organ.organName};
                }
                return o;
            },
            save() {
                var self = this;

                var o = self.getOrgan();
                if (o.organId) {
                    self.form.organId = o.organId;
                } else {
                    self.$message.error(self.$t('organ.msg.parameter_fail'));
                }

                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.saveUserInfo();
                    }
                });
            },
            saveUserInfo() {
                var self = this;

                var params = _.clone(self.form);
                delete params.s_password;
                params.userPassword = md5(params.userPassword);  // md5加密

                self.$store.dispatch("saveUserRegInfo", params).then(function () {
                    self.$message.success(self.$t('common.msg.add_success'));
                    self.close();
                }).catch(function (error) {
                    self.$message.error(typeof error === "string" ? error : self.$t('common.msg.increase_fail'));
                });
            },
            close() {
                this.clearForm();
                this.$emit("close");
            }
        }
    }
</script>
