<!--字典管理-->
<style scoped lang="less" src="./style.less"></style>

<template>
  <div id="ap_system_dict" class="container-fluid">
    <div id="leftDiv" class="col-xs-3">
      <div class="panel">
        <div class="panel-heading">
          <h2 class="panel-title">{{$t('dict.label.dict_manage')}}</h2>
          <div class="panel-opt">
            <ul>
              <li @click="showDictAdd" v-permissions="{options: this.$store.state.options, opt: 'LIBRARY_02'}"><i class="icon iconfont icon-ap-add"></i></li>
            </ul>
          </div>
        </div>
        <div class="panel-body sinosoft_tree tree"
             :style="{'height': (this.$store.state.min_height - $store.state.base_height_difference) + 'px'}">
          <sinosoft_tree typeMap="type" :typeSettings="dictTypeMap" ref="tree" :data="treeData" idKey="libraryId"
                         :map="treeMap" :parentKey="parentKey" @onCurrentItem="selectTreeItem"></sinosoft_tree>
        </div>
      </div>
    </div>
    <div id="rightDiv" class="col-xs-9">
      <dict_add :showAdd="status.isShowDictAdd" :itemId="dictId" @close="closeDictAddPage" @add="saveDict"></dict_add>
      <dict_edit :showEdit="status.isShowDictEdit" :parent="parentItem" :isParent="isParent" @close="closeDictEditPage"
                 @save="updateTreeItem" @remove="removeTreeItem"></dict_edit>
    </div>
    <div id="labelDiv" class="col-xs-9" v-if="!status.isShowDictAdd && !status.isShowDictEdit">
      <div class="alert alert-warning fade in">
        {{$t('dict.label.view_details')}}
      </div>
    </div>
  </div>
</template>

<script>
  import sinosoft_tree from "components/tree";
  import dict_add from "./add/main.vue";
  import dict_edit from "./edit/main.vue";
  import {tree} from 'utils';
  var dictTypeMap = tree.dictTypeMap;

  export default {
    components: {
      dict_add,
      dict_edit,
      sinosoft_tree
    },
    data() {
      return {
        lang: {},
        dictTypeMap: dictTypeMap,
        treeData: [],
        parentKey: "libraryParentId",
        treeMap: {
          child: 'children',
          label: 'libraryName'
        },
        status: {
          isShowDictAdd: false,
          isShowDictEdit: false
        },
        isParent: false,
        parentItem: null,
        dictId: "0"
      }
    },
    created() {
      this.lang = this.$t('dict');
      this.queryDataItemList();
    },
    methods: {
      //查询全部数据字典
      queryDataItemList() {
        var self = this;

        self.$store.dispatch("queryDataItemList").then(function (tree) {
          tree = _.map(tree, function (item) {
            item.type = (!item.libraryParentId || item.libraryParentId === '0') ? '1' : '2';
            item.icon = (!item.libraryParentId || item.libraryParentId === '0') ? 'icon-ap-dictionary2' : 'icon-ap-option';
            return item;
          });
          self.treeData = tree;
        }).catch(function (message) {
          if (message && typeof message === "string") {
            self.$message.error(message);
          }
        });
      },
      //字典树点击事件
      selectTreeItem(itemId, item, path, obj) {
        if (obj.child && obj.child.length > 0) {
          this.isParent = true;
        } else {
          this.isParent = false;
        }
        this.dictId = itemId;
        this.parentItem = item;
        this.openDetail();
      },
      openDetail() {
        this.status.isShowDictAdd = false;
        this.status.isShowDictEdit = true;
      },
      //显示添加数据字典页面
      showDictAdd() {
        var self = this;
        var current = self.$refs.tree.getCurrentItem();

        if (!current.item || (current.item && current.item.level < 2)) {
          this.status.isShowDictAdd = true;
          this.status.isShowDictEdit = false;
        } else {
          this.$message.warning(self.$t('dict.msg.not_add'));
        }
      },
      //关闭字典添加页面
      closeDictAddPage() {
        this.status.isShowDictAdd = false;
        if (this.dictId && this.dictId !== '0') {
          this.openDetail();
        }
      },
      saveDict(parentId, item) {
        if (parentId && !_.isEmpty(item)) {
          this.$refs.tree.addItem(parentId, item);
        }
      },
      //关闭字典修改页面
      closeDictEditPage() {
        this.dictId = "0";
        this.parentItem = null;
        this.$refs.tree.resetSelected();
        this.status.isShowDictEdit = false;
      },
      //更新字典树
      updateTreeItem(id, item) {
        if (id && !_.isEmpty(item)) {
          this.$refs.tree.updateItem(id, item);
        }

        this.closeDictEditPage();
      },
      //删除字典树中的项
      removeTreeItem(id) {
        if (id) {
          this.$refs.tree.removeItem(id);
        }
      }
    }
  }
</script>
