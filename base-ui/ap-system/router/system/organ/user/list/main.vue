<style scoped lang="less" src="./style.less"></style>
<template>
  <div v-if="value">
    <div class="panel">
      <div class="panel-heading">
        <h2 class="panel-title">{{$t('organ.label.user_list')}}</h2>
        <div class="panel-opt">
          <div class="search">
            <input class="search-input"
                   type="text"
                   v-model="formInline.userAccount"
                   :placeholder="$t('organ.label.user_enter_name')"
                   @keyup.enter="inputSearchUser"
                  >
            <span class="search-button" @click="inputSearchUser"><i class="icon iconfont icon-ap-search"></i></span>
          </div>
          <ul>
            <li @click="showAdd" v-permissions="{options: $store.state.options, opt: 'USER_02'}"><i
              class="icon iconfont icon-ap-add"></i></li>
            <li @click="deleteUserInfo" v-permissions="{options: $store.state.options, opt: 'USER_04'}"><i
              class="icon iconfont icon-ap-delete"></i></li>
          </ul>
        </div>
      </div>
      <div class="panel-body" style="overflow-y: auto;min-height: 300px;" @click="clearSelect"
           :style="{'height': ($store.state.min_height-$store.state.base_height_difference) + 'px'}">
        <el-table
          :height="$store.state.min_height-$store.state.base_height_difference-80"
          :data="items"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column width="40" type="selection" v-if="this.isCanSelected"></el-table-column>
          <el-table-column prop="rownum" :label="$t('organ.label.Serial_number')" width="70"
                           align="center"></el-table-column>
          <el-table-column min-width="80" :label="$t('organ.label.user_username')" show-overflow-tooltip align="left">
            <template scope="scope">
              <a class="pointer" @click="showUpdate(scope.row)">{{scope.row.userAccount}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="userTelnumber" min-width="140" :label="$t('organ.label.user_phone')" show-overflow-tooltip
                           align="left"></el-table-column>
          <el-table-column prop="userMail" min-width="140" :label="$t('organ.label.user_email')" show-overflow-tooltip
                           align="left"></el-table-column>
          <el-table-column prop="userName" min-width="80" label="姓名" show-overflow-tooltip
                           align="left"></el-table-column>
          <el-table-column prop="userGender" min-width="80" label="性别" show-overflow-tooltip
                           align="left"></el-table-column>
          <el-table-column prop="userPosition" min-width="80" label="职位" show-overflo w-tooltip
                           align="left"></el-table-column>
          <el-table-column prop="userNation" min-width="80" label="民族" show-overflow-tooltip
                           align="left"></el-table-column>
        </el-table>
        <div class="col-xs-12 feet">
          <sinosoft_page v-model="formInline.pageIndex" :limit="formInline.pageSize"
                         :total="page.total"></sinosoft_page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import sinosoft_page from "components/page2";
  import Promise from "bluebird";
  import {dict, constant} from "utils";

  export default {
    components: {
      sinosoft_page
    },
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
    data() {
      return {
        items: [],
        page: {
          total: 0
        },
        formInline: {
          pageIndex: 1,
          pageSize: 20,
          organId: '',
          userAccount: ''
        },
        deleteItem: [],
        isCanSelected:true
      }
    },
    watch: {
      'organ': 'searchUserList',
      'value': function () {
        if (this.value) {
          this.searchUserList();
        }
      },
      'formInline.pageIndex': 'queryEmployeeInfoList'
    },
    created() {
      var self = this;

      self.isCanSelected = self.auth();
      self.queryEmployeeInfoList();
    },
    methods: {
      //判断权限
      auth() {
        let flag = true, options = this.$store.state.options;

        var verify = function () {
          var result = _.filter(options,function (item) {
            if (item.operationCode === "USER_04") {
              return item;
            }
          });
          if (result.length !== 0) {
            flag = true;
          } else {
            flag = false;
          }
        };

        if (options && options.length > 0) {
          verify();
        } else {
          flag = false;
        }
        return flag;
      },
      queryEmployeeInfoList() {
        let self = this;

        self.$store.dispatch("queryEmployeeInfoList", _.clone(self.formInline)).then(function (data) {
            if (data) {
              self.page.total = data.pageInfo.totleInfo;
              self.items = data.rows;

              if (_.isArray(self.items)) {
                self.items = _.map(self.items, function (item, index) {

                  _.map(self.$store.state["nation"],function (ite) {
                    if (ite.libraryCode == item.userNation) {
                      item.userNation = ite.libraryName;
                    }
                  });
                  _.map(self.$store.state["gender"],function (ite) {
                    if (ite.libraryCode == item.userGender) {
                      item.userGender = ite.libraryName;
                    }
                  });
                  _.map(self.$store.state["position"],function (ite) {
                    if (ite.libraryCode == item.userPosition) {
                      item.userPosition = ite.libraryName;
                    }
                  });
                  item.rownum = (self.formInline.pageIndex - 1) * self.formInline.pageSize + (index + 1);
                  return item;
                });
            }
          }
        }).catch(function(){});
      },
      //搜索
      searchUserList() {
        var self = this;

        if (self.formInline.pageIndex !== 1) {
          self.formInline.pageIndex = 1;
        } else {
          self.formInline.organId = "";
          if (self.organ) {
            self.formInline.organId = self.organ.organId;
          }
          self.queryEmployeeInfoList();
        }

      },
      inputSearchUser() {
        var self = this;

        if (!/^\w+$/.test(this.formInline.userAccount)){
          this.$message.warning(self.$t('organ.msg.organ_user_name_validate'))
        } else {
          if (self.formInline.pageIndex !== 1) {
            self.formInline.pageIndex = 1;
          } else {
            self.formInline.organId = "";
            if (self.organ) {
              self.formInline.organId = self.organ.organId;
            }
            self.queryEmployeeInfoList();
          }
        }
      },
      handleSelectionChange(val) {
        this.deleteItem = val;
      },
      goPage(path) {
        if (path) {
          this.$router.push({path: path});
        }
      },
      deleteUserInfo() {
        var self = this;

        if (this.deleteItem.length > 0) {
          self.$confirm(self.$t('organ.msg.confirm_remove_user'), '', {
            type: "info",
            confirmButtonText: self.$t('common.label.determine'),
            cancelButtonText: self.$t('common.label.cancel')
          }).then(function () {
            var userIdArray = _.map(self.deleteItem, function (item) {
              return item.userId;
            });
            self.$store.dispatch("removeEmployeeInfo", {userId: userIdArray.join(",")}).then(function () {
              self.queryEmployeeInfoList();
              self.$message.success(self.$t('common.msg.delete_success'));
            }).catch(function () {
              self.$message.error(self.$t('common.msg.remove_fail'));
            });
          }).catch(function () {
          });
        } else {
          self.$message.info(self.$t('organ.msg.chioce_remove_user'));
        }
      },
      close() {
        this.value = false;
        this.$emit("close");
      },
      showAdd() {
        if (this.organ && this.organ.organId) {
          this.$emit("showAdd");
        } else {
          this.$message.info(this.$t('organ.msg.need_selected_organ'));
        }
      },
      showUpdate(row) {
        this.$emit("showUpdate", row);
      }
    }
  }
</script>
