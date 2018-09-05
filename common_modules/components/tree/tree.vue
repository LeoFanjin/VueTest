<script>
  import uuid from 'uuid';

  /**
   * 树组件(tree)
   * name: sinosoft_tree
   * props:
   *  data        数据源
   *  dataSource  数据源 (一般不用)
   *  parentId    顶级父节点ID   默认值: 0
   *  level       顶级节点level  默认值: 1
   *  pPath       顶级path  默认值: ''
   *  map         映射管理  默认值:{label: 'content', child: 'child'}
   *  typeMap     类型字段 默认值: ''
   *  typeSettings 类型设置,如果使用typeSettings,必须使用typeMap  demo: [{name: 'type_a', icon: '', showChecked: true/false}]
   *  parentKey    父ID Key 默认值: 'parentId'
   *  showChecked  是否显示复选框
   *  canChecked   复选框是否可点击
   *  baseId       跟ID,默认值: '0'
   *  idKey        id Key  默认值: 'id'
   *  defaultIcon  默认图标
   *  isActive     是否可点击
   *  showOpt      是否显示操作按钮 (修改、删除)
   *  isLazy       是否使用懒加载
   *  lazyFunction 懒加载回调函数
   *
   * events:
   *  onCurrentItem(id, original, path, source) 选中某节点
   *  selectChecked(selectItems, selectitem)    点击复选框
   *  onEditItem(id, original, source)          上传前调用
   *  onRemoveItem(id, original, source)        上传前调用
   *
   * methods:
   *  resetSelected()    清空所有选中状态
   *  addItem(parentId, item)  新增节点
   *  updateItem(id, item)  修改节点
   *  removeItem(id)  删除节点
   *  selectedItems(ids)  选中复选框
   *  cleanSelected()  清空复选框选中状态
   *  getCurrentItem()  获得当前节点
   *  getNextItem(current)  获得下一个节点
   *  getPreItem(current)  获得上一个节点
   *  moveUp(id)  上移
   *  moveDown(id)  下移
   *  getItemById(id)  获取指定ID节点信息
   */
  export default {
    name: 'sinosoft_tree',
    props: {
      /* 数据源 */
      data: Array,
      dataSource: Array,
      /* 父节点ID */
      parentId: {
        type: String,
        default: '0'
      },
      level: {
        type: Number,
        default: 1
      },
      pPath: {
        type: String,
        default: ''
      },
      /* 映射关系 */
      map: {
        type: Object,
        default: function () {
          return {label: 'content', child: 'child'};
        }
      },
      typeMap: '',
      typeSettings: {
        type: Array,
        default: function () {
          return [];
        }   // [{name: 'type_a', icon: '', showChecked: true/false}]
      },
      parentKey: {
        type: String,
        default: ''
      },
      /* 是否显示复选框 */
      showChecked: {
        type: Boolean,
        default: false
      },
      /* 复选框是否可编辑 */
      canChecked: {
        type: Boolean,
        default: true
      },
      /* 根ID */
      baseId: {
        type: String,
        default: '0'
      },
      /* idKey */
      idKey: {
        type: String,
        default: 'id'
      },
      /* 默认图标 */
      defaultIcon: {
        type: String,
        default: ''
      },
      /* 是否可点击 */
      isActive: {
        type: Boolean,
        default: true
      },
      /* 是否显示编辑和删除操作 */
      showOpt: {
        type: Boolean,
        default: false
      },
      /* 是否支持树的加载 */
      isLazy: {
        type: Boolean,
        default: false
      },
      /* 懒加载函数 ,需要isLazy为true */
      lazyFunction: {
        type: Function,
        default: null
      }
    },
    computed: {
      tree() {
        var self = this;

        self.source = _.map(self.source, function (item) {
          if (item.parentId === self.parentId) {
            item.level = self.level;
          }
          return item;
        });

        var data = _.chain(self.source)
          .clone()
          .filter(function (item) {
            return item.parentId === self.parentId;
          }).sortBy('index').value();

        data = _.map(data, function (item) {
          item.child = _.filter(self.source, function (i) {
            return i.parentId === item.id;
          });
          if (item.showChecked && !self.showCheckedDiv) {
            self.showCheckedDiv = true;
          }
          return item;
        });
        return data;
      }
    },
    watch: {
      'dataSource': 'generateSource',
      'data': 'generateSource'
    },
    data() {
      return {
        id: 'sinosoft_tree_',
        nodeSetting: {
          id: '',             // 节点
          index: '',
          active: false,      // 是否被选中
          open: false,        // 是否被打开
          icon: '',           // 图标
          isChecked: false,   // 有复选框状态下是否被选中
          type: 'default',    // 类型,默认为default
          content: '',        // 节点名称
          level: null,        // 层级
          child: [],          // 子树数组
          parentId: '',       // 父节点ID
          hasOpen: false,     // 是否展开过,用于懒加载
          original: {}        // 原始数据
        },
        showCheckedDiv: false,
        icon: {
          open: '&#xe62b;',
          close: '&#xe60a;'
        },
        source: [],
        path: ''
      };
    },
    created() {
      this.id += uuid.v1();
      this.generateSource();

      this.path = this.pPath;
      this.setPath();
    },
    methods: {
      /**
       * 生成数据源
       */
      generateSource() {
        var self = this;

        if (self.dataSource) {
          self.source = self.dataSource;
        } else {
          self.source = self.conversionSource(self.data);
        }
      },
      /**
       * 转换数据源
       * @param data 数据源
       * @returns {Array} 转换后的值
       */
      conversionSource(data) {
        var self = this;
        var list = [];

        var map = self.map;

        if (self.parentKey) {
          list = self.defaultTree(data, map);
        } else {
          self.parentKey = 'parentId';
          list = self.transformTreeData(data);
          list = self.defaultTree(list, map);
        }

        return list;
      },
      /**
       * 默认树结构
       */
      defaultTree(data) {
        var self = this;

        data = _.chain(data).map(function (item, index) {
          return self.generateItemOriginal(item, null, index + 1);
        }).sortBy('index').value();

        return data;
      },
      transformTreeData(data) {
        var self = this;

        var childKey = self.map.child;
        var treeData = [];

        var recursionData = function (items, parentId) {
          _.each(items, function (i) {
            if (i[childKey]) {
              recursionData(i[childKey], i[self.idKey]);
            }
            delete i[childKey];
            i[self.parentKey] = parentId;
            treeData.push(i);
          });
        };

        _.each(data, function (item) {
          if (item[childKey]) {
            recursionData(item[childKey], item[self.idKey]);
          }
          delete item[childKey];
          item[self.parentKey] = self.baseId;
          treeData.push(item);
        });
        return treeData;
      },
      /**
       * 设置path
       */
      setPath() {
        var self = this;

        self.path = self.pPath;

        if (self.path) {
          self.path += '_' + self.parentId;
        } else if (self.parentId && self.parentId !== '0') {
          self.path += self.parentId;
        }
      },
      // 初始化树结构数据源
      setTree(data) {
        var self = this;

        var map = self.map;
        if (self.parentKey) {
          data = self.transformTreeData(data);
          data = self.defaultTree(data, map);
        } else {
          data = self.defaultTree(data, map);
        }

        return data;
      },
      /**
       * 生成每个节点Original数据
       */
      generateItemOriginal(newItem, oldItem, index) {
        var self = this;
        var map = self.map;

        var node = _.clone(self.nodeSetting);
        node.id = newItem[self.idKey];
        if (index) {
          node.index = index;
        }
        node.original = newItem;                    // 源

        if (newItem[self.parentKey]) {                // 父ID
          node.parentId = newItem[self.parentKey];
        } else {
          node.parentId = self.baseId;
        }

        if (self.defaultIcon) {                       // 默认ICON
          node.icon = self.defaultIcon;
        }

        if(newItem.open) {
          node.open = newItem.open;
        }

        if (newItem.isChecked) {                      // 是否被选中
          node.isChecked = newItem.isChecked;
        }

        if (self.typeMap) {
          node.type = newItem[self.typeMap];

          if (self.typeSettings && self.typeSettings.length > 0) {
            _.each(self.typeSettings, function (item) {
              if (node.type === item.name) {
                node.icon = item.icon || '';
                node.showChecked = item.showChecked || false;
              }
            });
          }
        }

        if (newItem.icon) {
          node.icon = newItem.icon;
        }

        if (map && !_.isEmpty(map)) {
          var labelArray = map.label.split('|');

          _.each(labelArray, function (label) {
            if (newItem[label] || newItem[label] === 0) {
              node.content = newItem[label];              // 显示内容
              return;
            }
          });

          if (_.isEmpty(oldItem)) {
            if (_.isArray(newItem[map.child])) {
              node.child = newItem[map.child];
            }
          } else {
            node.child = oldItem.child;
            node.open = oldItem.open;
          }


        }
        return node;
      },
      /**
       * 展开收起树节点
       * @param cItem  节点对象
       */
      toggle(cItem) {
        var self = this;

        self.source = _.map(self.source, function (item) {
          if (item.id === cItem.id) {
            item.open = !item.open;
            // 懒加载查询子数据
            if (item.open && self.isLazy && self.lazyFunction && item.child && item.child.length === 0) {
              // 执行懒加载函数
              self.lazyFunction(item.id, item).then(function(child) {
                if (_.isArray(child) && child.length > 0) {
                  _.each(child, function (item2) {
                    if (!_.findWhere(self.source, {id: item2[self.idKey]})) {
                      self.addItem(item.id, item2);
                    }
                  });
                } else {
                  item.hasOpen = true;
                }
              }).catch(function(e){});
            }
          }
          return item;
        });

      },
      /**
       * 点击某个节点触发事件
       * @param cItem 节点对象
       */
      selectItem(cItem) {
        var self = this;

        if (cItem && self.isActive) {
          self.source = _.map(self.source, function (item) {
            if (item.id === cItem.id) {
              item.active = true;
            } else {
              item.active = false;
            }
            return item;
          });
          self.$emit('onCurrentItem', cItem.id, cItem.original, self.path, cItem);
        }
      },
      // 监听下级点击事件
      onCurrentItem(currentId, current, path, cItem) {
        var self = this;
        self.$emit('onCurrentItem', currentId, current, path, cItem);
      },
      /**
       * 选中某个节点出发事件
       * @param selectItem 选中节点对象
       */
      onSelectChecked(selectItem) {
        var self = this;

        var flag = true;

        self.$emit('selectChecked', _.filter(self.source, function (item) {
          return item.isChecked;
        }), selectItem.original, flag);
      },
      // 监听下级选中事件
      onChildSelectItem(selectItems, selectItem) {
        var self = this;

        self.$emit('selectChecked', selectItems, selectItem);
      },
      //触发修改事件
      onEditItem(itemId, original, item) {
        this.$emit("onEditItem", itemId, original, item);
      },
      // 出发删除事件
      onRemoveItem(itemId, original, item) {
        this.$emit("onRemoveItem", itemId, original, item);
      },
      /**   以下是可外部调用方法    **/
      /**
       * 清除所有选中状态
       */
      resetSelected() {
        var self = this;
        self.source = _.map(self.source, function (item) {
          item.active = false;
          return item;
        });
      },
      /**
       * 添加树节点
       * @param parentId  父节点ID
       * @param item      节点数据
       */
      addItem(parentId, item) {
        var self = this;

        if (!_.isEmpty(item)) {
          if (parentId) {
            item[self.parentKey] = parentId;
          }

          var index = 0;
          if (self.source.length > 0) {
            index = self.source[self.source.length - 1].index + 1;
          }

          self.source.push(self.generateItemOriginal(item, null, index));
        }
      },
      /**
       * 修改树节点
       * @param id  节点ID
       * @param item 节点数据
       */
      updateItem(id, item) {
        var self = this;

        if (id && !_.isEmpty(item)) {
          self.source = _.map(self.source, function (i) {
            if (i.id === id) {
              i = self.generateItemOriginal(item, i, i.index);
            }
            return i;
          });
        }
      },
      /**
       * 删除树节点
       * @param id 节点ID
       */
      removeItem(id) {
        var self = this;

        var getSubIds = function (items, parentId) {
          var ids = [];
          _.each(items, function (item) {
            if (item.parentId === parentId) {
              _.union(ids, getSubIds(items, item.id));
              ids.push(item.id);
            }
          });
          ids.push(parentId);
          return ids;
        };

        if (id) {
          self.source = _.filter(self.source, function (i) {
            return !_.contains(getSubIds(self.source, id), i.id);
          });
        }
      },
      /**
       * 选中复选框
       * @param ids 节点ID集(,分割)
       */
      selectedItems(ids) {
        var self = this;

        if (ids && ids.length > 0) {
          // 获取需要打开的ids
          var getNeedOpenIds = function (pId) {
            var ids = [];
            _.each(self.source, function (item) {
              if (pId !== self.baseKey && pId === item.id) {
                ids = _.union(ids, getNeedOpenIds(item.parentId));
                ids.push(item.id);
              }
            });
            return ids;
          };

          var needOpenIds = [];
          self.source = _.map(self.source, function (item) {
            if (_.contains(ids, item.id)) {
              item.isChecked = true;
              needOpenIds = _.union(needOpenIds, getNeedOpenIds(item.parentId));

              self.$emit('selectChecked', _.filter(self.source, function (item) {
                return item.isChecked;
              }), item.original);

            } else {
              item.isChecked = false;
            }
            return item;
          });

          self.source = _.map(self.source, function (item) {
            if (_.contains(needOpenIds, item.id)) {
              item.open = true;
            } else {
              item.open = false;
            }
            return item;
          });
        }
      },
      /**
       * 清空所有复选框选中状态
       */
      cleanSelected() {
        var self = this;
        self.source = _.map(self.source, function (item) {
          item.isChecked = false;
          return item;
        });
      },
      /**
       * 获得当前节点
       * @returns {{original: null, item}}
       */
      getCurrentItem() {
        var self = this;

        var current = _.findWhere(self.source, {active: true});

        return {
          original: current ? current.original : null,
          item: current
        };
      },
      /**
       * 获得下一个节点
       * @param current
       * @returns {{original: null, item: null}}
       */
      getNextItem(current) {
        var self = this, currentItem = null;

        if (current) {
          currentItem = current;
        } else {
          var c = self.getCurrentItem();
          currentItem = c ? c.item : null;
        }

        var peers = _.chain(self.source).filter(function (item) {
          return item.parentId === currentItem.parentId;
        }).sortBy('index').value();

        var next = {
          original: null,
          item: null
        };
        _.each(peers, function (item) {
          if (item.index > currentItem.index && !next.original) {
            next.original = item.original;
            next.item = item;
          }
        });
        return next;
      },
      /**
       * 获得上一个节点
       * @param current
       * @returns {{original: null, item: null}}
       */
      getPreItem(current) {
        var self = this, currentItem = null;

        if (current) {
          currentItem = current;
        } else {
          var c = self.getCurrentItem();
          currentItem = c ? c.item : null;
        }

        var peers = _.chain(self.source).filter(function (item) {
          return item.parentId === currentItem.parentId;
        }).sortBy(function (item) {
          return item.index ? -item.index : item.index;
        }).value();

        var pre = {
          original: null,
          item: null
        };
        _.each(peers, function (item) {
          if (item.index < currentItem.index && !pre.original) {
            pre.original = item.original;
            pre.item = item;
          }
        });

        return pre;
      },
      /**
       * 向上移动
       * @param id 节点ID
       */
      moveUp(id) {
        var self = this;

        var currentItem = id ? self.getItemById(id) : self.getCurrentItem();

        if (currentItem.item) {
          var preItem = self.getPreItem(currentItem.item);

          if (preItem.item) {
            var currentIndex = currentItem.item.index;
            var preIndex = preItem.item.index;

            self.source = _.map(self.source, function (item) {
              if (item.id === currentItem.item.id) {
                item.index = preIndex;
              }
              if (item.id === preItem.item.id) {
                item.index = currentIndex;
              }
              return item;
            });
          }
        }
      },
      /**
       * 向下移动
       * @param id 节点ID
       */
      moveDown(id) {
        var self = this;

        var currentItem = id ? self.getItemById(id) : self.getCurrentItem();

        if (currentItem.original) {
          var nextItem = self.getNextItem(currentItem.item);

          if (nextItem.item) {
            var currentIndex = currentItem.item.index;
            var preIndex = nextItem.item.index;

            self.source = _.map(self.source, function (item) {
              if (item.id === currentItem.item.id) {
                item.index = preIndex;
              }
              if (item.id === nextItem.item.id) {
                item.index = currentIndex;
              }
              return item;
            });
          }
        }
      },
      /**
       * 获得指定节点信息
       * @param id 节点ID
       */
      getItemById(id) {
        return id ? _.findWhere(this.source, {id: id}) : {original: null, item: null};
      }
    }
  };
</script>
<style lang="less" scoped src="./tree.less"></style>

<template>
  <ul v-if="tree && tree.length > 0">
    <li v-for="item in tree" :class="{'tree-node': (item && item.child.length > 0) || (isLazy && !item.hasOpen), 'tree-open': item.open}">
      <i class="tree-icon" @click.stop="toggle(item)"></i>
      <div class="tree_checkbox" v-if="showCheckedDiv || showChecked">
        <input type="checkbox" :disabled="!canChecked" v-model="item.isChecked" @change="onSelectChecked(item)"
               v-if="showChecked || item.showChecked">
      </div>
      <div class="tree-content" :class="{active: item.active, pointer: isActive}" @click.stop="selectItem(item)"
           :title="item.content">
        <i v-if="item.icon" class="icon iconfont" :class="item.icon">&nbsp;</i>
        <div class="t_label">
          {{item.content}}
        </div>
      </div>
      <div class="tree-opt" v-if="showOpt">
        <a class="edit" @click.stop="onEditItem(item.id, item.original, item)" v-if="showOpt.edit">
          <i class="icon iconfont icon-ap-modify"></i>
        </a>
        <a class="remove" v-if="showOpt.remove" @click.stop="onRemoveItem(item.id, item.original, item)">
          <i class="icon iconfont icon-ap-delete"></i>
        </a>
      </div>
      <sinosoft_tree
        ref="child"
        v-show="item.open"
        :dataSource="source"
        :parentId="item.id"
        :parentKey="parentKey"
        :idKey="idKey"
        :pPath="path"
        :map="map"
        :level="level + 1"
        :isActive="isActive"
        :defaultIcon="defaultIcon"
        :showChecked="showChecked"
        :canChecked="canChecked"
        :showOpt="showOpt"
        :isLazy="isLazy"
        :lazyFunction="lazyFunction"
        @onCurrentItem="onCurrentItem"
        @selectChecked="onChildSelectItem"
        @onEditItem="onEditItem"
        @onRemoveItem="onRemoveItem"
      >
      </sinosoft_tree>
    </li>
  </ul>
</template>
