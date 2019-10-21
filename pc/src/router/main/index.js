export default [
    {
        path: '/',
        name: 'home',
        meta: {
            title: '首页'
        },
        component: resolve => require(['@/pages/views/home/home.vue'], resolve)
    }, {
        path: '/r/:id',
        name: 'referrer',
        meta: {
            title: '来自好友的邀请注册'
        },
        component: resolve => require(['@/pages/common/referrer.vue'], resolve)
    },
   {
        path: '/trade',
        name: 'trade',
        meta: {
            title: '交易'
        },

        component: resolve => require(['@/pages/views/trade/common/index.vue'], resolve),
        children: [
            {
                path: '/exchange',
                name: 'exchange',
                meta: {
                    title: '交易'
                },
                component: resolve => require(['@/pages/views/trade/exchange/exchange.vue'], resolve)
            },{
                path: '/exchange/:pair',
                name: 'exchange2',
                meta: {
                    title: '交易'
                },
                component: resolve => require(['@/pages/views/trade/exchange/exchange.vue'], resolve)
            },
            // {
            //     path: '/Information',
            //     name: 'Information',
            //     meta: {
            //         title: '币种资料'
            //     },
            //     component: resolve => require(['@/pages/views/trade/Information/Information.vue'], resolve)
            // },{
            //     path: '/Information/:pair',
            //     name: 'Information2',
            //     meta: {
            //         title: '币种资料'
            //     },
            //     component: resolve => require(['@/pages/views/trade/Information/Information.vue'], resolve)
            // },
        ]
    },
    {
        path: '/otcTrade',
        name: 'otcTrade',
        meta: {
            title: '法币交易'
        },
        component: resolve => require(['@/pages/views/otcTrade/OtcTrade.vue'], resolve)
    }, {
        path: '/news',
        name: 'news',
        meta: {
            title: '公告'
        },
        component: resolve => require(['@/pages/views/news/news.vue'], resolve)
    }, {
        path: '/newsShow',
        name: 'newsShow',
        meta: {
            title: '查看公告'
        },
        component: resolve => require(['@/pages/views/news/NewsShow.vue'], resolve)
    },{
        path: '/newsShow/:id',
        name: 'newsShow2',
        meta: {
            title: '查看公告'
        },
        component: resolve => require(['@/pages/views/news/NewsShow.vue'], resolve)
    },
  
    // 用户中心
    {
        path: '/money',
        name: 'account',
        redirect: '/account/money',
        component: resolve => require(['@/pages/account/common/index.vue'], resolve),
        children: [
            {
                path: '/account/money',
                name: 'account.money',
                meta: {
                    title: '我的资金',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/money/money.vue'], resolve)
            }, {
                path: '/account/security',
                name: 'account.security',
                meta: {
                    title: '安全中心',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/security/security.vue'], resolve)
            }, {
                path: '/account/orders',
                name: 'account.orders',
                meta: {
                    title: '我的委单',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/orders/orders.vue'], resolve)
            },{
                path: '/account/myOrderHistory',
                name: 'account.myOrderHistory',
                meta: {
                    title: '成交记录',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/myOrderHistory/myOrderHistory.vue'], resolve)
            }, {
                path: '/account/finance',
                name: 'account.finance',
                meta: {
                    title: '财务记录',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/finance/finance.vue'], resolve)
            },
            {
                path: '/account/lock',
                name: 'account.lock',
                meta: {
                    title: '锁仓记录',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/lock/lock/index.vue'], resolve)
            },
            {
                path: '/account/release',
                name: 'account.release',
                meta: {
                    title: '释放记录',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/lock/release/index.vue'], resolve)
            },
            // {
            //     path: '/account/C2C',
            //     name: 'account.C2C',
            //     meta: {
            //         title: 'C2C管理',
            //         requireAuth: true,
            //     },
            //     component: resolve => require(['@/pages/account/c2c/c2c.vue'], resolve)
            // },
             {
                path: '/account/cdd',
                name: 'account.cdd',
                meta: {
                    title: '实名认证',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/cdd/cdd.vue'], resolve)
            },{
                path: '/account/bank',
                name: 'account.bank',
                meta: {
                    title: '支付绑定',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/bank/bank.vue'], resolve)
            },{
                path: '/account/ID_verification',
                name: 'account.ID_verification',
                meta: {
                    title: '高级认证',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/cdd/id_verification/id_verification.vue'], resolve)
            },{
                path: '/account/real',
                name: 'account.real',
                meta: {
                    title: '身份认证',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/cdd/real/real.vue'], resolve)
            },{
                path: '/account/recommended',
                name: 'account.recommended',
                meta: {
                    title: '推荐计划',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/recommended/recommended.vue'], resolve)
            },
            {
                path: '/account/referees',
                name: 'account.referees',
                meta: {
                    title: '推荐关系',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/referees/index.vue'], resolve)
            },
            {
                path: '/account/tickets',
                name: 'account.tickets',
                meta: {
                    title: '工单管理',
                    requireAuth: true,
                },
                component: resolve => require(['@/pages/account/tickets/index.vue'], resolve)
            },
        ],

    }
]

