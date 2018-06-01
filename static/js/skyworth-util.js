/**
 * Created by Jarek on 2017/5/25.
 */
export default {
  /**
   * 获取项目跟路径
   * @returns {*}
   */
  getRoot: function () {
    return (window.webRoot ? window.webRoot + '/' : null) || ''
    // return 'http://172.20.114.62:8082/tvmanage'
  },
  getVersion: function () {
    return window.version
  },
  /**
   * 是否为正整数
   */
  isPositiveNum: function (s) {
    var re = /^[0-9]*[1-9][0-9]*$/
    return re.test(s)
  },
  /**
   * 判断对象是否为空对象｛｝
   * @param obj 对象
   */
  isEmptyObject: function (obj) {
    if (obj === undefined) { //  null undefined 返回true
      return true
    }
    if (!obj) {
      return false
    }
    for (var n in obj) {
      return false
    }
    return true
  },
  /**
   * 判断空字符串
   * @param str 字符串
   */
  isStringEmpty: function (str) {
    if (typeof str === 'string') {
      return !str || str === null || str === ''
    } else {
      return false
    }
  },
  /**
   * 判断是否是数字类型
   * @param num 数字
   */
  isNumberEmpty: function (num) {
    if (typeof num === 'number') {
      return true
    } else {
      return false
    }
  },

  /**
   * 布尔值取反
   * @param boolVal 布尔值
   **/
  boolReverse: function (boolVal) {
    return !boolVal
  },
  /**
   * 加操作
   * @returns {*}
   */
  addOperate: function () {
    var args = arguments
    if (args && args.length > 0) {
      for (var i = 0, sum = 0; i < args.length; i++) {
        sum += args[i]
        if (i === args.length - 1) {
          return sum
        }
      }
    }
  },
  /**
   *两整数之差
   */
  diffInt: function (a, b) {
    var arg1 = parseInt(a, 10)
    var arg2 = parseInt(b, 10)
    if (isNaN(arg1) || isNaN(arg2)) {
      return
    }
    return arg1 - arg2
  },
  /**
   *两浮点数之差
   */
  diffFloat: function (a, b) {
    var arg1 = parseFloat(a)
    var arg2 = parseFloat(b)
    if (isNaN(arg1) || isNaN(arg2)) {
      return
    }
    return arg1 - arg2
  },
  /**
   *两浮点数之和
   */
  addFloat: function (a, b) {
    var arg1 = parseFloat(a)
    var arg2 = parseFloat(b)
    if (isNaN(arg1) || isNaN(arg2)) {
      return
    }
    return arg1 + arg2
  },
  /**
   *三个浮点数之差
   */
  diffThreeFloat: function (a, b, c) {
    var arg1 = parseFloat(a)
    var arg2 = parseFloat(b)
    var arg3 = parseFloat(c)
    if (isNaN(arg1) || isNaN(arg2) || isNaN(arg3)) {
      return
    }
    return arg1 - arg2 - arg3
  },

  // 计算两时间相差天数 time0,time1为时间毫秒数
  diffDays: function (time0, time1) {
    var d0 = new Date(Number(time0))
    d0.setSeconds(0)
    d0.setMinutes(0)
    d0.setHours(0)
    d0.setMilliseconds(0)
    var d1 = new Date(Number(time1))
    d1.setSeconds(0)
    d1.setMinutes(0)
    d1.setHours(0)
    d1.setMilliseconds(0)
    return (d0.getTime() - d1.getTime()) / 1000 / 60 / 60 / 24
  },
  /**
   * 或操作
   * @returns {number}
   */
  orOperate: function () {
    var args = arguments
    if (args && args.length > 0) {
      for (var i = 0, sum = 0; i < args.length; i++) {
        sum = sum || args[i]
        if (i === args.length - 1) {
          return sum
        }
      }
    }
  },
  /**
   * 如果val1 === val2 那么返回targetVal
   * @param val1
   * @param val2
   * @param targetVal
   * @returns {String}
   * @private
   */
  getTargetVal: function (val1, val2, targetVal) {
    if (val1 === val2) {
      return targetVal
    } else {
      return ''
    }
  },
  /**
   * 判断两个字符串是否相等
   * @param val1
   * @param val2
   * @returns {boolean}
   */
  strEqual: function (val1, val2) {
    if (val1 === val2) {
      return true
    } else {
      return false
    }
  },
  /**
   * 判断两个字符串是否不等
   * @param val1
   * @param val2
   * @returns {boolean}
   */
  strNoEqual: function (val1, val2) {
    if (val1 !== val2) {
      return true
    } else {
      return false
    }
  },

  /**
   * 移除字符串中所有的空格
   * @param str
   * @returns {*}
   */
  trimStr: function (str) {
    if (str === null) {
      return ''
    }
    return str.replace(/\s/g, '')
  },

  /**
   * 校验传入的值是否合法
   * 非法输入：屏蔽null undefined 只含空白的字符串 NaN function
   * @param val
   */
  validVal: function (val) {
    var type
    if (val === undefined || val === null) {
      return false
    }
    type = typeof val
    switch (type) {
      case 'string':
        if (this.trimStr(val) === '') {
          return false
        }
        break
      case 'number':
        return !isNaN(val)
      case 'function':
        return false
      case 'object':
        return this.isEmptyObject()
    }
    return true
  },

  /**
   * 对象相等：规则认定 具有相同的属性，且属性值也相同
   * @param a
   * @param b
   * @returns {boolean}
   */
  isEqualValue: function (a, b) {
    if (typeof a !== 'object' || typeof b !== 'object') {
      return false
    }
    var aProp = Object.getOwnPropertyNames(a)
    var bProp = Object.getOwnPropertyNames(b)
    if (aProp.length !== bProp.length) {
      return false
    }
    for (var i = 0; i < aProp.length; i++) {
      var propName = aProp[i]
      if (a[propName] !== b[propName]) {
        return false
      }
    }
    return true
  },

  /**
   * 查看对象元素是否在对象数组中
   * @param list
   * @param ele
   */
  containObj: function (list, ele) {
    var flag = false
    for (var i = 0; i < list.length; i++) {
      if (this.isEqualValue(list[i], ele)) {
        flag = true
        break
      }
    }
    return flag
  },

  /**
   * 去重 对象数组
   * @param arr
   */
  uniqueArray: function (arr) {
    var r = []
    for (var i = 0; i < arr.length; i++) {
      if (!this.containObj(r, arr[i])) {
        r.push(arr[i])
      }
    }
    return r
  }
}
