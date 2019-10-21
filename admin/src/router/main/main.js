import bipay from "../../api/bipay";
import lock from "../../api/lock";

export default [
    {
        path: '/sys/user',
        component: resolve => require(['@/components/admin/users/Index.vue'], resolve),
        meta: { title: '会员管理', view: true, edit: true }
    },
    {
        path: '/sys/admin',
        component: resolve => require(['@/components/admin/Administrator/Index.vue'], resolve),
        meta: { title: '管理员列表', view: true, del: true, edit: true, add: true }
    }, {
        path: '/sys/role',
        component: resolve => require(['@/components/admin/role/role.vue'], resolve),
        meta: { title: '角色管理', view: true, }
    }, {
        path: '/sys/freeTransaction',
        component: resolve => require(['@/components/admin/freeTransaction.vue'], resolve),
        meta: { title: '特权账户', view: true, }
    }, {
        path: '/sys/realname',
        component: resolve => require(['@/components/admin/Cdd.vue'], resolve),
        meta: { title: '实名认证', view: true, }
    }, {
        path: '/sys/referees',
        component: resolve => require(['@/components/admin/referees.vue'], resolve),
        meta: { title: '推荐人关系', view: true, }
    }, {
        path: '/finance/info',
        component: resolve => require(['@/components/admin/Info.vue'], resolve),
        meta: { title: '对账', view: true, }
    }, {
        path: '/finance/give',
        component: resolve => require(['@/components/financial/givingrecords/givingrecords.vue'], resolve),
        meta: { title: '赠送记录', view: true, }
    }, {
        path: '/finance/transfer',
        component: resolve => require(['@/components/financial/transferRecord.vue'], resolve),
        meta: { title: '转账记录', view: true, }
    }, {
        path: '/finance/paymentRecords',
        component: resolve => require(['@/components/admin/PaymentRecords.vue'], resolve),
        meta: { title: '支付记录', view: true, }
    }, {
        path: '/wallet/request',
        component: resolve => require(['@/components/wallet/request.vue'], resolve),
        meta: { title: '提现请求', view: true, }
    }, {
        path: '/finance/userPosition',
        component: resolve => require(['@/components/statistical/UserPosition.vue'], resolve),
        meta: { title: '资金分布', view: true, }
    }, {
        path: '/finance/moneyChange',
        component: resolve => require(['@/components/statistical/MoneyChange.vue'], resolve),
        meta: { title: '资金变化', view: true, }
    }, {
        path: '/finance/pool',
        component: resolve => require(['@/components/statistical/pool/Pool.vue'], resolve),
        meta: { title: '资金池', view: true, }
    }, {
        path: '/finance/addRecords',
        component: resolve => require(['@/components/statistical/pool/AddRecords.vue'], resolve),
        meta: { title: '补充记录', view: true, }
    }, {
        path: '/coin/coins',
        component: resolve => require(['@/components/coin/Coins.vue'], resolve),
        meta: { title: '币种列表', view: true, }
    }, {
        path: '/coin/selectCoin',
        component: resolve => require(['@/components/coin/SelectCoin.vue'], resolve),
        meta: { title: '币种选择', view: true, }
    }, {
        path: '/exchange/tradePair',
        component: resolve => require(['@/components/coin/TradePair.vue'], resolve),
        meta: { title: '交易对列表', view: true, }
    },
    {
        path: '/exchange/history',
        component: resolve => require(['@/components/exchange/history/index.vue'], resolve),
        meta: { title: '交易历史', view: true, }
    },
    {
        path: '/sysSettings/email',
        component: resolve => require(['@/components/setting/email.vue'], resolve),
        meta: { title: '邮箱设置', view: true, }
    }, {
        path: '/sysSettings/mobileSetting',
        component: resolve => require(['@/components/setting/mobileSetting.vue'], resolve),
        meta: { title: '短信设置', view: true, }
    }, {
        path: '/sysSettings/roulette',
        component: resolve => require(['@/components/setting/Roulette.vue'], resolve),
        meta: { title: '轮盘设置', view: true, }
    }, {
        path: '/sysSettings/recommended',
        component: resolve => require(['@/components/setting/Recommended.vue'], resolve),
        meta: { title: '推荐奖励', view: true, }
    },
    // {
    //     path: '/Language',
    //     component: resolve => require(['@/components/admin/Language.vue'], resolve),
    //     meta: {title: '系统语言'}
    // },
    // {
    //     path: '/Logbook',
    //     component: resolve => require(['@/components/admin/Logbook.vue'], resolve),
    //     meta: {title: '日志管理'}
    // },
    // {
    //     path: '/GiveMoney',
    //     component: resolve => require(['@/components/financial/GiveMoney/Index.vue'], resolve),
    //     meta: {title: '增币工具'}
    // },
    {
        path: '/cms/article',
        name: '/cms/article',
        component: resolve => require(['@/components/CMS/Article.vue'], resolve),
        meta: { title: '文章管理', view: true, },
    },
    {
        path: '/sysSettings/version',
        component: resolve => require(['@/components/setting/APPversion/newRelease.vue'], resolve),
        meta: { title: '发布新版本' }
    },
    // {
    //     path: '/agent',
    //     component: resolve => require(['@/components/operating/Agent.vue'], resolve),
    //     meta: {title: '经纪人管理'}
    // }, {
    //     path: '/LogonStatistics',
    //     component: resolve => require(['@/components/operating/LogonStatistics.vue'], resolve),
    //     meta: {title: '登录统计'}
    // }, {
    //     path: '/RegistrationStatistics',
    //     component: resolve => require(['@/components/operating/RegistrationStatistics.vue'], resolve),
    //     meta: {title: '注册统计'}
    // },
    {
        path: '/sysSettings/commonSettings',
        component: resolve => require(['@/components/setting/CommonSettings.vue'], resolve),
        meta: { title: '公共设置', view: true, }
    }, {
        path: '/sysSettings/setting',
        component: resolve => require(['@/components/setting/Setting.vue'], resolve),
        meta: { title: '基本设置', view: true, }
    }, {
        path: '/sysSettings/linkSettings',
        component: resolve => require(['@/components/setting/linkSettings.vue'], resolve),
        meta: { title: '友情链接', view: true, }
    }, {
        path: '/sysSettings/banner',
        component: resolve => require(['@/components/setting/BannerSetting.vue'], resolve),
        meta: { title: 'Banner设置', view: true, }
    }, {
        path: '/sysSettings/website',
        component: resolve => require(['@/components/setting/Website.vue'], resolve),
        meta: { title: '网站管理', view: true, }
    }, {
        path: '/project/share',
        component: resolve => require(['@/components/project/share.vue'], resolve),
        meta: { title: '分红', view: true, }
    }, {
        path: '/project/icoList',
        component: resolve => require(['@/components/project/project.vue'], resolve),
        meta: { title: '项目列表', view: true, }
    }, {
        path: '/project/joinorder',
        component: resolve => require(['@/components/project/joinorder.vue'], resolve),
        meta: { title: '参与记录', view: true, }
    }, {
        path: '/lock/unlock',
        component: resolve => require(['@/components/lock/index.vue'], resolve),
        meta: { title: '解锁', view: true, }
    }, {
        path: '/lock/cents',
        component: resolve => require(['@/components/lock/cents.vue'], resolve),
        meta: { title: '分币', view: true, }
    },
    // {
    //     path: '/shopkeeper',
    //     component: resolve => require(['@/components/Custom/uuex/shopkeeper.vue'], resolve),
    //     meta: {title: '掌柜列表'}
    // },
    // {
    //     path: 'thirdParty_ChargedHistory',
    //     component: resolve => require(['@/components/Custom/qkex/ChargedHistory.vue'], resolve),
    //     meta: {title: '第三方平台充提记录'}
    // }, {
    //     path: 'thirdParty_WithdrawalRequest',
    //     component: resolve => require(['@/components/Custom/qkex/WithdrawalRequest.vue'], resolve),
    //     meta: {title: '第三方平台提现请求'}
    // },
    {
        path: '/task/tasklist',
        component: resolve => require(['@/components/task/tasklist/tasklist.vue'], resolve),
        meta: { title: '任务列表', view: true, }
    }, {
        path: '/sys/menuadmin',
        component: resolve => require(['@/components/admin/menuadmin/menuadmin.vue'], resolve),
        meta: { title: '菜单管理', view: true, }
    },
    {
        path: '/robot/exchange',
        component: resolve => require(['@/components/robot/exchange'], resolve),
        meta: { title: '交易所', view: true, }
    },
    {
        path: '/robot/setting',
        component: resolve => require(['@/components/robot/setting'], resolve),
        meta: { title: '机器人设置', view: true, }
    },
    {
        path: '/singpay/bankhistory',
        component: resolve => require(['@/components/financial/LegalCoinRecharge.vue'], resolve),
        meta: { title: '银行记录' }
    },

    // c2c
    {
        path: '/c2c/merchant',
        component: resolve => require(['@/components/C2C/ServiceProviders.vue'], resolve),
        meta: { title: 'C2C服务商' }
    }, {
        path: '/c2c/history',
        component: resolve => require(['@/components/C2C/Records.vue'], resolve),
        meta: { title: 'C2C交易记录' }
    }, {
        path: '/c2c/order',
        component: resolve => require(['@/components/C2C/order.vue'], resolve),
        meta: { title: 'C2C充提订单' }
    }, {
        path: '/c2c/setting',
        component: resolve => require(['@/components/C2C/setting.vue'], resolve),
        meta: { title: 'C2C设置' }
    }, {
        path: '/c2c/verify',
        component: resolve => require(['@/components/C2C/c2cAuditList.vue'], resolve),
        meta: { title: 'C2C审核列表' }
    }, {
        path: '/wallet/history',
        component: resolve => require(['@/components/wallet/history.vue'], resolve),
        meta: { title: '历史记录' }
    },
    {
        path: '/wallet/coinSetting',
        component: resolve => require(['@/components/wallet/coinSetting.vue'], resolve),
        meta: { title: '币种设置' }
    },
    // pay
    {
        path: '/singpay/enterprise',
        component: resolve => require(['@/components/system/enterprise/enterprise.vue'], resolve),
        meta: { title: '企业申请' }
    },

    // games
    {
        path: '/games/invest',
        component: resolve => require(['@/components/games/invest/invest.vue'], resolve),
        meta: { title: '币种设置' }
    },
    // zendesk
    {
        path: '/zendesk/ticket',
        component: resolve => require(['@/components/zendesk/ticket/index.vue'], resolve),
        meta: { title: '工单列表' }
    },

    // sys
    {
        path: '/sys/vipLevel',
        component: resolve => require(['@/components/admin/vipLevel/index.vue'], resolve),
        meta: { title: '等级管理' }
    },

    // bipay
    // 币种设置
    {
        path: '/bipay/coinsetting',
        component: resolve => require(['@/components/bipay/coinsetting/index.vue'], resolve),
        meta: { title: '币种设置' }
    },
    {
        path: '/bipay/history',
        component: resolve => require(['@/components/bipay/history/index.vue'], resolve),
        meta: { title: '充提记录' }
    },
    {
        path: '/bipay/request',
        component: resolve => require(['@/components/bipay/request/index.vue'], resolve),
        meta: { title: '提现请求' }
    },

    // 币值管理
    // 交易统计
    {
        path: '/mvm/trade',
        component: resolve => require(['@/components/mvm/trade/index.vue'], resolve),
        meta: { title: '交易统计' }
    },
    // 挂单统计
    {
        path: '/mvm/order',
        component: resolve => require(['@/components/mvm/order/index.vue'], resolve),
        meta: { title: '挂单统计' }
    },
    // 持仓统计
    {
        path: '/mvm/holder',
        component: resolve => require(['@/components/mvm/holder/index.vue'], resolve),
        meta: { title: '持仓统计' }
    },
    // 充提统计
    {
        path: '/mvm/charge',
        component: resolve => require(['@/components/mvm/charge/index.vue'], resolve),
        meta: { title: '充提统计' }
    },
    // 项目方
    {
        path: '/mvm/issuer',
        component: resolve => require(['@/components/mvm/issuer/index.vue'], resolve),
        meta: { title: '项目方' }
    },

    // lock
    {
        path: '/lock/pattern',
        component: resolve => require(['@/components/lock/pattern/index.vue'], resolve),
        meta: { title: '模式列表' }
    },
    {
        path: '/lock/release',
        component: resolve => require(['@/components/lock/release/index.vue'], resolve),
        meta: { title: '释放记录' }
    },
    {
        path: '/lock/rules',
        component: resolve => require(['@/components/lock/rules/index.vue'], resolve),
        meta: { title: '锁仓规则' }
    },
    {
        path: '/finance/fee',
        component: resolve => require(['@/components/financial/fee/fee.vue'], resolve),
        meta: { title: '手续费账户' }
    },
    // risk
    {
        path: '/risk/setting',
        component: resolve => require(['@/components/risk/setting/index.vue'], resolve),
        meta: { title: '风控设置' }
    }, {
        path: '/risk/history',
        component: resolve => require(['@/components/risk/history/index.vue'], resolve),
        meta: { title: '执行记录' }
    }, {
        path: '/risk/warning',
        component: resolve => require(['@/components/risk/warning/index.vue'], resolve),
        meta: { title: '风险警告' }
    },

    // 锁仓查询
    {
        path: '/lock/result',
        component: resolve => require(['@/components/lock/result/index.vue'], resolve),
        meta: { title: '业绩' }
    }, {
        path: '/lock/query',
        component: resolve => require(['@/components/lock/query/index.vue'], resolve),
        meta: { title: '锁仓查询' }
    },

]
