import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import * as util from '../static/js/skyworth-util'; // 工具方法
import * as skyGlobal from '../static/js/skyworth-global'; // 工具方法全局
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import Vuex from 'vuex';
import store from './store/store.js'

Vue.use(ElementUI, { size: 'small' });
Vue.use(skyGlobal);
Vue.use(Vuex)
Vue.prototype.$axios = axios;

//  使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('sky_username');
    const sessionId = localStorage.getItem('sessionId');
    if(!role && to.path !== '/login' && to.path !== '/register'){ // 未登录&&不是登录&&不是注册，限制用户在未登录的状态下手动修改URL
        next('/login');
    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    }else{
        if(to.matched.some(record => record.meta.requiresAuth)){
        }
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            // next({query: {sessionId: '1'}})
            next()
        }
    }
})

window.eventBus = new Vue()
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');