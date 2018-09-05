import Promise from 'bluebird';

/**
 * 根据类型查询字典项
 */
module.exports = {
  findItemsByType: function ($vm, dictCode) {
    if ($vm && dictCode) {
      return $vm.$store.dispatch("queryDataItemByType", {libraryCode: dictCode});
    } else {
      return Promise.resolve([]);
    }
  }
};