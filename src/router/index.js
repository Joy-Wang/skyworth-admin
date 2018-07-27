import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    // 系统首页
                    name: 'dashboard',
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    // 用户中心
                    name: 'user',
                    path: '/user',
                    component: resolve => require(['../components/page/user/user-center.vue'], resolve),
                    meta: { title: '用户' }
                },
                {
                    // 基础数据管理
                    name: 'baseInfo',
                    path: '/baseInfo',
                    component: resolve => require(['../components/page/platform/base-info.vue'], resolve),
                    meta: { title: '基础数据' }
                },
                {
                    // 设备管理
                    name: 'device',
                    path: '/device',
                    component: resolve => require(['../components/page/platform/device-home.vue'], resolve),
                    meta: { title: '设备' }
                },
                {
                    // 设备新增
                    name: 'deviceAdd',
                    path: '/deviceAdd',
                    component: resolve => require(['../components/page/platform/device-add.vue'], resolve),
                    meta: { title: '设备新增' }
                },
                {
                    // 设备修改
                    name: 'deviceEdit',
                    path: '/deviceEdit',
                    component: resolve => require(['../components/page/platform/device-edit.vue'], resolve),
                    meta: { title: '设备修改' }
                },
                {
                    // 方案管理
                    name: 'project',
                    path: '/project',
                    component: resolve => require(['../components/page/project/project-home.vue'], resolve),
                    meta: { title: '方案管理' }
                },
                {
                    // 新增方案
                    name: 'projectAdd',
                    path: '/projectAdd',
                    component: resolve => require(['../components/page/project/project-add.vue'], resolve),
                    meta: { title: '新增方案' }
                },
                {
                    // 修改方案
                    name: 'projectEdit',
                    path: '/projectEdit',
                    component: resolve => require(['../components/page/project/project-edit.vue'], resolve),
                    meta: { title: '修改方案' }
                },
                {
                    // 素材管理-基础管理
                    name: 'file',
                    path: '/file',
                    component: resolve => require(['../components/page/file/file.vue'], resolve),
                    meta: { title: '基础管理' }
                },
                {
                    // 素材管理-app管理
                    name: 'app',
                    path: '/app',
                    component: resolve => require(['../components/page/file/app.vue'], resolve),
                    meta: { title: 'app管理' }
                },
                {
                    // 广告管理
                    name: 'ad',
                    path: '/ad',
                    component: resolve => require(['../components/page/ad/ad.vue'], resolve),
                    meta: { title: '广告管理' }
                },
                {
                    // 流量监控与推荐
                    name: 'flowMonitoring',
                    path: '/flowMonitoring',
                    component: resolve => require(['../components/page/flowMonitoring/flow-monitoring.vue'], resolve),
                    meta: { title: '流量监控与推荐' }
                }
            ]
        },
        {
            // 登录
            name: 'login',
            path: '/login',
            component: resolve => require(['../components/page/login/login.vue'], resolve)
        },
        {
            // 注册
            name: 'register',
            path: '/register',
            component: resolve => require(['../components/page/login/register.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
