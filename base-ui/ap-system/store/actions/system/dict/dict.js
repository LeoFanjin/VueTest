import {API} from "utils";
import Promise from "bluebird";

/**
 * 根据类型查询数据字典项
 * @params: {itemCode: ''}
 */
export const queryDataItemByType = (store, params) => {
  let key = params.libraryCode;

  if (key) {
    if (!store.state[key] || store.state[key].length === 0) {
      var param = {
        url: G.base_api + "/ap-system/findChildLibrary.do",
        dataType: 'json',
        commit: store.commit,
        data: params
      };

      return API.post(param).then(function (data) {
        if (data && data.length > 0) {
          store.commit("SET_DICT", {key: params.libraryCode, value: data});
        }
        return Promise.resolve(data);
      });
    } else {
      return Promise.resolve(store.state[key]);
    }
  } else {
    return Promise.resolve([]);
  }
};

/**
 * 查询数据字典
 */
export const queryDataItemList = ({commit}, params) => {
  var param = {
    url: G.base_api + "/ap-system/findLibrary.do",
    dataType: "json",
    commit: commit,
    data: params
  };
  return API.post(param);
};

/**
 * 新增数据字典
 */
export const saveDict = ({commit}, params) => {
  var param = {
    url: G.base_api + "/ap-system/saveLibrary.do",
    dataType: "json",
    commit: commit,
    data: params
  };
  return API.post(param);
};

/**
 * 修改数据字典
 */
export const modifyDataItemById = ({commit}, params) => {
  var param = {
    url: G.base_api + "/ap-system/modifyLibrary.do",
    dataType: "json",
    commit: commit,
    data: params
  };
  return API.post(param);
};

/**
 * 删除数据字典
 */
export const removeDataItemById = ({commit}, params) => {
  var param = {
    url: G.base_api + "/ap-system/removeLibrary.do",
    dataType: "json",
    commit: commit,
    data: params
  };
  return API.post(param);
};

export const initDict = ({commit, state}, params) => {
  if (!state.isInit) {
    var param = {
      url: G.base_api + "/ap-system/findLibrary.do",
      dataType: "json",
      commit: commit,
      data: params
    };

    return API.post(param).then(function (data) {
      if (_.isArray(data)) {
        commit("INIT_DICT", data);
        return Promise.resolve(null);
      }
    });
  } else {
    return Promise.resolve(null);
  }
};