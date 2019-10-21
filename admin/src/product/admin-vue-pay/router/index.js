export default [
    {
        path: '/sys/enterprise',
        component: resolve => require(['@/components/system/enterprise/enterprise.vue'], resolve),
        meta: {title: '企业申请'}
    },
]
