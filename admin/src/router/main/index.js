export default [
    {
        path: '/index',
        component: resolve => require(['@/components/common/index/index.vue'], resolve),
        meta: {title: '首页'}
    },
    {
        path: '/404',
        component: resolve => require(['@/components/page/404.vue'], resolve),
        meta: {title: '404'}
    }, {
        path: '/403',
        component: resolve => require(['@/components/page/403.vue'], resolve),
        meta: {title: '403'}
    },
    {
        path: '/addNews',
        name: 'addNews',
        component: resolve => require(['@/components/CMS/addNews.vue'], resolve),
        meta: {title: '添加文章'},
    }, {
        path: '/editNews',
        name: 'editNews',
        component: resolve => require(['@/components/CMS/addNews.vue'], resolve),
        meta: {title: '修改文章'},
    }, {
        path: '/accountHistory',
        component: resolve => require(['@/components/admin/users/accountHistory.vue'], resolve),
        meta: {title: '账户记录'}
    }, {
        path: '/accountHistory/:uid',
        name:'accountHistory2',
        component: resolve => require(['@/components/admin/users/accountHistory.vue'], resolve),
        meta: {title: '账户记录'},
    }, {
        path: '/addProject',
        name: 'addProject',
        component: resolve => require(['@/components/project/addProject.vue'], resolve),
        meta: {title: '添加项目'}
    }, {
        path: '/editProject',
        name: 'editProject',
        component: resolve => require(['@/components/project/addProject.vue'], resolve),
        meta: {title: '修改项目'}
    },
    {
        path: '/zendesk/ticket/:id',
        name:'ticket',
        component: resolve => require(['@/components/zendesk/ticket/detailed.vue'], resolve),
        meta: {title: '工单详细'}
    },{
        path: '/lock/release/:id',
        name:'release',
        component: resolve => require(['@/components/lock/release/detailed.vue'], resolve),
        meta: {title: '释放详细'}
    },{
        path: '/lock/rules/:id',
        component: resolve => require(['@/components/lock/rules/detailed.vue'], resolve),
        meta: { title: '锁仓详细' }
    }, {
        path: '/finance/fee/:id',
        component: resolve => require(['@/components/financial/fee/history.vue'], resolve),
        meta: { title: '划转详细' }
    },{
        path: '/lock/query/detail',
        component: resolve => require(['@/components/lock/query/detailed.vue'], resolve),
        meta: { title: '收益明细' }
    }, 
]
