var getAgent = require("./agent").getAgent;
var cookie = require("./cookie");
var Storage = require("./storage");

const getURI = (loginPage, jump) => {
  var uri = loginPage;
  if (jump && loginPage.indexOf("?") !== -1) {
    uri += "&jump=" + encodeURIComponent(jump);
  } else if (jump) {
    uri += "?jump=" + encodeURIComponent(jump);
  }
  return uri;
};
const logout = (self, jump) => {
  let pre = "", ieV = getAgent();
  /* ie9及以下需要手动加# */
  if (ieV && ieV <= 9 && !self) {
    pre = "/#";
  }
  let loginPage = pre + "/login";

  if (G) {
    loginPage = pre + (G.loginPage ? G.loginPage : "/login");
    // Storage.remove(G.storage_key);
    //
    // if (G.loginPage) {
    //   loginPage = pre + G.loginPage; //如果配置文件有loginPage则跳到配置文件的loginPage
    // }
  }
  // if (self) {
  //   self.$router.push(loginPage);
  // } else {
  if (!G.autonomously) {
    cookie.removeCookie("token");
  } else {
    Storage.remove(G.storage_key);
  }
  window.location.href = getURI(loginPage, jump);
  // }
};

module.exports = logout;
