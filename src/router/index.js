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
                    // 基础信息管理
                    name: 'baseInfo',
                    path: '/baseInfo',
                    component: resolve => require(['../components/page/platform/base-info.vue'], resolve),
                    meta: { title: '基础信息' }
                },
                {
                    // 设备管理
                    name: 'device',
                    path: '/device',
                    component: resolve => require(['../components/page/platform/device-home.vue'], resolve),
                    meta: { title: '设备' }
                },
                {
                    // 方案管理
                    name: 'project',
                    path: '/project',
                    component: resolve => require(['../components/page/project/project-home.vue'], resolve),
                    meta: { title: '方案' }
                },
                {
                    // 方案新增
                    name: 'projectAdd',
                    path: '/projectAdd',
                    component: resolve => require(['../components/page/project/project-add.vue'], resolve),
                    meta: { title: '新增方案' }
                },
                {
                    // 素材管理
                    name: 'file',
                    path: '/file',
                    component: resolve => require(['../components/page/file/file.vue'], resolve),
                    meta: { title: '素材管理' }
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
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    // 模板测试
                    path: '/test',
                    component: resolve => require(['../components/page/Test.vue'], resolve),
                    meta: { title: '测试' }
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
