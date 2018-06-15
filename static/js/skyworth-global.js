// 全局函数
exports.install = function (Vue, options) {
    // 定义缓存
    Vue.prototype.setLocalStorage = function (item, value) {
        localStorage.setItem(item, value)
    }
    Vue.prototype.getLocalStorage = function (item) {
        return localStorage.getItem(item)
    }
    Vue.prototype.removeLocalStorage = function (item) {
        localStorage.removeItem(item)
    }
    Vue.prototype.setSessionStorage = function (item, value) {
        sessionStorage.setItem(item, value)
    }
    Vue.prototype.getSessionStorage = function (item) {
        return sessionStorage.getItem(item)
    }
    Vue.prototype.removeSessionStorage = function (item) {
        sessionStorage.removeItem(item)
    }

};