import {API} from 'utils';

/**
 * 查询我的资源权限
 * @param commit
 * @param params
 * @returns {*}
 */
export const queryMyResources = ({commit}, params) => {
  var param = {
    url: G.base_api + "/ap-system/getUserResourceList.do",
    dataType: "json",
    data: params
  };

  return API.post(param).then(function (data) {
    if (data) {
      commit('SET_RESOURCE', data);
      commit('SET_SHOW_CONTENT', true);
    }

    return Promise.resolve(data);
  });
};

/**
 * 查询我的权限
 */
export const findMyAuth = ({commit}, content) => {
  var param = {
    url: G.base_api + "/ap-system/getUserAuthList.do",
    data: content,
    commit: commit,
    dataType: "json"
  };
  return API.post(param);
};
