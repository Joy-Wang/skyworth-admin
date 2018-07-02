import base from './skyworth-util'
import _$ from 'jquery'
import Vue from 'vue'
/**
 * Returns 当前组件需要的查询条件
 * @attribute queryCondition
 * @type Object
 */
export const getQueryCondition = () => {
  return {
    start: 0,
    limit: 10,
    results: 0,
    pageIndex: 1
  }
}

/**
 * Returns 获取下一个分页请求参数
 * @param  preParam 上一条分页请求参数
 * @type Object
 */
export const getNextParam = (preParam) => {
  preParam = preParam || {start: 0, limit: 10, results: 0, pageIndex: 1}
  let nextParam = {
    start: preParam.start + preParam.limit,
    limit: preParam.limit,
    results: preParam.results,
    pageIndex: preParam.pageIndex + 1
  }
  return nextParam
}

/**
 * 简单对象保存
 * @param obj.url 查询地址。必须是全路径
 * @param obj.dataType 默认为 'json'
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthSave = (obj) => {
  const url = base.getRoot() + obj.url
  const dataType = obj.dataType || 'json'
  const param = obj.param || {}
  const success = obj.success
  const async = obj.async !== false
  let loading = obj.loading !== false
  // loading && Indicator.open('加载中...') // 打开loading
  _dealPostParam(param)
  _$.ajax({
    url: url,
    type: 'POST',
    data: param,
    async: async,
    dataType: dataType,
    crossDomain: true,
    xhrFields: {withCredentials: true},
    success: function (data) {
      // loading && Indicator.close() // 关闭loading
      success(data)
    },
    error: function (XMLHttpRequest) {
      // loading && Indicator.close() // 关闭loading
      dealError(XMLHttpRequest, obj)
    }
  })
  setTimeout(() => {
    // Indicator.close()
  }, 4000)
}
/**
 * 保存复杂对象的方法,复杂对象的更新contentType采用'application/jsoncharset=utf-8'
 * 复杂对象包括 List,Map,List<Map>
 * 参数采用标准的json格式
 * @param obj.url 查询地址。必须是全路径
 * @param obj.dataType 默认为 'json'
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthComplexSave = (obj) => {
  const url = base.getRoot() + obj.url
  const dataType = obj.dataType || 'json'
  const param = obj.param || {}
  const success = obj.success
  const async = obj.async !== false
  let loading = obj.loading !== false
  // loading && Indicator.open('加载中...') // 打开loading
  _dealPostParam(param)
  _$.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify(param),
    async: async,
    dataType: dataType,
    crossDomain: true,
    xhrFields: {withCredentials: true},
    contentType: 'application/json',
    success: function (data) {
      // loading && Indicator.close() // 关闭loading
      success(data)
    },
    error: function (XMLHttpRequest) {
      // loading && Indicator.close() // 关闭loading
      dealError(XMLHttpRequest, obj)
    }
  })
  setTimeout(() => {
    // Indicator.close()
  }, 4000)
}

/**
 * 查询方法
 * @param obj.url 查询地址。必须是全路径
 * @param obj.dataType 默认为 'json'
 * @param obj.param 查询参数
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthQuery = (obj) => {
  const url = base.getRoot() + obj.url
  const dataType = obj.dataType || 'json'
  const param = obj.param || {}
  const async = obj.async !== false
  const success = obj.success
  let loading = obj.loading !== false
  // loading && Indicator.open('加载中...') // 打开loading
  _dealPostParam(param)
  _$.ajax({
    url: url,
    type: 'GET',
    data: param,
    async: async,
    dataType: dataType,
    crossDomain: true,
    xhrFields: {withCredentials: true},
    success: function (data) {
      success(data)
      // loading && Indicator.close() // 关闭loading
    },
    error: function (XMLHttpRequest) {
      // loading && Indicator.close() // 关闭loading
      dealError(XMLHttpRequest, obj)
    }
  })
  setTimeout(() => {
    // Indicator.close()
  }, 4000)
}

/**
 * 通过复杂对象的查询数据的方法,复杂对象的更新contentType采用'application/jsoncharset=utf-8'
 * 参数采用标准的json格式
 * @param obj.url 查询地址。必须是全路径
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 *
 */
export const skyworthComplexQuery = (obj) => {
  const url = base.getRoot() + obj.url
  const dataType = obj.dataType || 'json'
  const param = obj.param || {}
  const success = obj.success
  const async = obj.async !== false
  let loading = obj.loading !== false
  // loading && Indicator.open('加载中...') // 打开loading
  _dealPostParam(param)
  _$.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify(param),
    async: async,
    dataType: dataType,
    crossDomain: true,
    xhrFields: {withCredentials: true},
    contentType: 'application/json',
    success: function (data) {
      // loading && Indicator.close() // 关闭loading
      success(data)
    },
    error: function (XMLHttpRequest) {
      // loading && Indicator.close() // 关闭loading
      dealError(XMLHttpRequest, obj)
    }
  })
  setTimeout(() => {
    // Indicator.close()
  }, 4000)
}

/**
 * 查询方法
 * @param obj.url 查询地址。必须是全路径
 * @param obj.dataType 默认为 'json'
 * @param obj.param 查询参数
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthDelete = (obj) => {
  const url = base.getRoot() + obj.url
  const dataType = obj.dataType || 'json'
  const param = obj.param || {}
  const async = obj.async !== false
  const success = obj.success
  let loading = obj.loading !== false
  // loading && Indicator.open('加载中...') // 打开loading
  _dealPostParam(param)
  _$.ajax({
    url: url,
    type: 'delete',
    data: param,
    async: async,
    dataType: dataType,
    crossDomain: true,
    xhrFields: {withCredentials: true},
    success: function (data) {
      success(data)
      // loading && Indicator.close() // 关闭loading
    },
    error: function (XMLHttpRequest) {
      // loading && Indicator.close() // 关闭loading
      dealError(XMLHttpRequest, obj)
    }
  })
  setTimeout(() => {
    // Indicator.close()
  }, 4000)
}

/**
 * 通过复杂对象的查询数据的方法,复杂对象的更新contentType采用'application/jsoncharset=utf-8'
 * 参数采用标准的json格式
 * @param obj.url 查询地址。必须是全路径
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 *
 */
export const skyworthComplexDelete = (obj) => {
  const url = base.getRoot() + obj.url
  const dataType = obj.dataType || 'json'
  const param = obj.param || {}
  const success = obj.success
  const async = obj.async !== false
  let loading = obj.loading !== false
  // loading && Indicator.open('加载中...') // 打开loading
  _dealPostParam(param)
  _$.ajax({
    url: url,
    type: 'delete',
    data: JSON.stringify(param),
    async: async,
    dataType: dataType,
    crossDomain: true,
    xhrFields: {withCredentials: true},
    contentType: 'application/json',
    success: function (data) {
      // loading && Indicator.close() // 关闭loading
      success(data)
    },
    error: function (XMLHttpRequest) {
      // loading && Indicator.close() // 关闭loading
      dealError(XMLHttpRequest, obj)
    }
  })
  setTimeout(() => {
    // Indicator.close()
  }, 4000)
}

/**
 * 用简单的参数从服务器 get 一个对象
 * @param obj.url 查询地址。必须是全路径
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.dataType 默认为 'json'
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthGet = (obj) => {
  skyworthQuery(obj)
}

/**
 *
 * 用复杂的参数从服务器 get 一个对象 contentType采用'application/jsoncharset=utf-8'
 * 复杂参数包括 List,Map,List<Map>
 * 参数采用标准的json格式
 * @param obj.url 查询地址。必须是全路径
 * @param obj.dataType 默认为 'json'
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthComplexGet = (obj) => {
  skyworthComplexQuery(obj)
}

/**
 * post 一个简单对象到服务器
 * @param obj.url 查询地址。必须是全路径
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.dataType 默认为 'json'
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthPost = (obj) => {
  skyworthSave(obj)
}

/**
 *
 * Post 一个复杂对象到服务器 contentType采用'application/jsoncharset=utf-8'
 * 复杂对象包括 List,Map,List<Map>
 * 参数采用标准的json格式
 * @param obj.url 查询地址。必须是全路径
 * @param obj.dataType 默认为 'json'
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthComplexPost = (obj) => {
  skyworthComplexSave(obj)
}

/**
 * 简单对象更新
 * @param obj.url 查询地址。必须是全路径
 * @param obj.param 查询参数。
 * @param obj.loading loading展示标识:true展示, false 或者不填写不展示
 * @param obj.dataType 默认为 'json'
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthUpdate = (obj) => {
  skyworthSave(obj)
}

/**
 * 更新复杂对象的方法,复杂对象的更新contentType采用'application/jsoncharset=utf-8'
 * 复杂对象包括 List,Map,List<Map>
 * 参数采用标准的json格式
 * @param obj.url 查询地址。必须是全路径
 * @param obj.dataType 默认为 'json'
 * @param obj.param 查询参数。
 * @param obj.success 查询成功的回调函数。
 * @param obj.error 查询失败的回调函数。如果没有特殊处理建议不赋值，方法提供了默认处理
 */
export const skyworthComplexUpdate = (obj) => {
  skyworthComplexSave(obj)
}

// error 回调处理
let dealError = (XMLHttpRequest, ajaxParam) => {
  if (Vue.__$toast) { // 确保每次只弹出一个 toast, 手动处理的不在此列
    Vue.__$toast.close()
  }
  console.error('ajax请求参数', JSON.stringify(ajaxParam))
  if (ajaxParam.error) {
    ajaxParam.error(XMLHttpRequest)
  } else {
    var msg = XMLHttpRequest.responseText
    var toastMsg = msg
    switch (XMLHttpRequest.status) {
      case 400:
        msg = '参数错误'
        break
      case 401:
        msg = '未登录，请登录！'
        break
      case 403:
        msg = '没有操作权限！'
        break
      case 404:
        msg = '404啦...快去检查链接!'
        // TODO 需要404页面
        break
      case 405:
        msg = '方法不允许请求!请检查方法的RequestMethod前后端配置是否一致'
        break
      case 408:
        msg = '请求超时...！'
        toastMsg = '网络连接失败'
        break
      case 413:
        msg = '请求数据超大,请查看是否上传了大附件'
        break
      case 500:
        msg = '服务出错' + msg
        toastMsg = '网络连接失败,请检查网络连接'
        break
      case 502:
        msg = toastMsg = '网络连接失败,请检查网络连接'
        break
      case 504:
        msg = toastMsg = '网络连接失败,请检查网络连接'
        break
      case 631:
        break
      case 632:
        break
      default :
        msg = '未知的错误'
        toastMsg = '网络连接失败,请检查网络连接'
    }
    // 打印错误消息
    console.error(msg)
    Vue.__$toast = Toast({message: toastMsg})
  }
}
//  处理更新和创建的参数
let _dealPostParam = (param) => {
  delete param.pageIndex
  delete param.results
  delete param.createdAt //  创建时间
  delete param.updatedAt //  更新时间
  delete param.operatorId  //  操作人
  delete param.createdBy //  创建人
  delete param.updatedBy //  更新人
  // dealParams(param, false) //  删除无意义字段 null undefined
}
/**
 * 删除无意义字段 null undefined ''
 */
let dealParams = (params, isDelBlackStr) => {
  if (isDelBlackStr === undefined) {
    isDelBlackStr = true
  }
  if (!base.isEmptyObject(params)) {
    for (var p in params) {
      if ((params[p] === '' && isDelBlackStr) || (params[p] !== 0 && params[p] !== false && !params[p] &&
        (typeof params[p] !== 'boolean' || typeof params[p] !== 'number'))) {
        delete params[p]
      }
    }
  }
}

