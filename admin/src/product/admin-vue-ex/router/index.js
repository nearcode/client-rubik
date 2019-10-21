export default [
    {
        path: '/c2c/merchant',
        component: resolve => require(['@/components/C2C/ServiceProviders.vue'], resolve),
        meta: {title: 'C2C服务商'}
    }, {
        path: '/c2c/history',
        component: resolve => require(['@/components/C2C/Records.vue'], resolve),
        meta: {title: 'C2C交易记录'}
    }, {
        path: '/c2c/order',
        component: resolve => require(['@/components/C2C/WithdrawalOrder.vue'], resolve),
        meta: {title: 'C2C提现订单'}
    }, {
        path: '/c2c/setting',
        component: resolve => require(['@/components/C2C/setting.vue'], resolve),
        meta: {title: 'C2C设置'}
    }, {
        path: '/c2c/verify',
        component: resolve => require(['@/components/C2C/c2cAuditList.vue'], resolve),
        meta: {title: 'C2C审核列表'}
    }, {
        path: '/wallet/history',
        component: resolve => require(['@/components/wallet/history.vue'], resolve),
        meta: {title: '历史记录'}
    },
]

