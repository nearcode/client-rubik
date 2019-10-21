<template>
    <div class="sidebar">
        <!--左侧导航栏-->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#F2F5F7" active-text-color="#20a0ff"
                 element-loading-background="rgba(0, 0, 0, 0)" unique-opened router>
            <!--导航栏头部信息-->
            <template>
                <div style="height: 100px;;background-color: #324157">
                    <div class="user-info">
                        <img src="/static/img/img.jpg" class="user-avator" alt="头像">
                        <div class="user-info-cont" v-if="!collapse">
                            <div class="user-info-name" title="等级">Welcome,<span v-for="(v,k) in adminRoleList" :key="k" v-if="v.id==roleId">{{v.name}}</span></div>
                            <div title="用户信息">{{username | noData}} ({{uid | noData}})</div>
                        </div>
                    </div>
                </div>
            </template>
            <!--&lt;!&ndash;左侧导航栏&ndash;&gt;v-if="level && showLevelList[level].indexOf(item.index)!=-1"-->
            <template v-for="item in meauList" v-if="item.show">
                <template v-if="item.children">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.children"
                                  v-if="subItem.show">
                            <el-submenu v-if="subItem.children" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.children" :key="i"
                                              :index="threeItem.index">
                                    {{ threeItem.name }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
        <!--导航栏底部-->
        <transition name="el-zoom-in-bottom">
            <div class="sidebar-footer hidden-small" v-if="!collapse">
                <div title="Settings">
                    <el-tooltip class="item" effect="dark" content="设置" placement="top-start">
                        <span class="el-icon-lx-settings"></span>
                    </el-tooltip>
                </div>
                <div class="btn-fullscreen">
                    <el-tooltip effect="dark" content="全屏" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <div class="lockcms" id="id" title="Lock">
                    <el-tooltip class="item" effect="dark" content="锁定" placement="bottom">
                        <span class="el-icon-lx-attentionforbidfill"></span>
                    </el-tooltip>
                </div>
                <div title="Logout" @click="loginOut()">
                    <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
                        <span class="el-icon-lx-exit"></span>
                    </el-tooltip>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import bus from '../../api/bus';
    import config from '@/config';
    import {mapState} from 'vuex'
    import product from '@/router/config'
    import _ from "lodash"

    export default {

        data() {
            return {
                collapse: false,
                fullscreen: false,
                showLevelList: config.showLevelList,
                items2: [
                    {
                        icon: 'el-icon-lx-home',
                        index: '/users',
                        title: '系统管理',
                        show: false,
                        subs: [
                            {
                                index: '/userManager',
                                title: '会员管理'
                            },
                            {
                                index: '/Administrator',
                                title: '管理员列表'
                            }, {
                                index: '/freeTransaction',
                                title: '特权账户'
                            }, {
                                index: '/enterprise',
                                title: '企业申请'
                            }, {
                                index: '/role',
                                title: '角色管理'
                            },
                            // {
                            //     index: 'Logbook',
                            //     title: '日志管理'
                            // },
                            {
                                index: '/cdd',
                                title: '实名认证'
                            }
                            , {
                                index: 'Language',
                                title: '系统语言'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: '/financial',
                        title: '财务管理',
                        subs: [
                            {
                                index: '/info',
                                title: '对账'
                            }, {
                                index: '/ChargedHistory',
                                title: '数字币充提记录'
                            }, {
                                index: '/LegalCoinRecharge',
                                title: '法币充值记录'
                            }, {
                                index: '/givingrecords',
                                title: '赠送记录'
                            },
                            // {
                            //     index: 'PaymentRecords',
                            //     title: '支付记录'
                            // },
                            {
                                index: '/transferRecord',
                                title: '转账记录'
                            },
                            {
                                index: '/WithdrawalRequest',
                                title: '提现请求'
                            },
                            {
                                index: '/userPosition',
                                title: '资金分布'
                            }, {
                                index: '/moneyChange',
                                title: '资金变化'
                            },
                            {
                                index: '/financial-1',
                                title: '资金池',
                                subs: [
                                    {
                                        index: '/Pool',
                                        title: '查看资金'
                                    },
                                    {
                                        index: '/AddRecords',
                                        title: '补充记录'
                                    },
                                ]
                            },
                            {
                                index: '/financial-2',
                                title: '第三方平台',
                                subs: [
                                    {
                                        index: '/thirdParty_ChargedHistory',
                                        title: '充提记录'
                                    },
                                    {
                                        index: '/thirdParty_WithdrawalRequest',
                                        title: '提现请求'
                                    },
                                ]
                            }
                            // {
                            //     index: 'financial-2',
                            //     title: '赠币工具',
                            //     subs: [
                            //         {
                            //             index: 'GiveMoney',
                            //             title: '赠币工具'
                            //         },
                            //         {
                            //             index: '11-2',
                            //             title: '赠币列表'
                            //         },
                            //     ]
                            // }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: '/poj',
                        title: '项目管理',
                        subs: [
                            {
                                index: '/share',
                                title: '分红'
                            }, {
                                index: '/ICO',
                                title: '项目列表'
                            }, {
                                index: '/joinorder',
                                title: '参与记录'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: '/C2C',
                        title: 'C2C管理',
                        subs: [
                            {
                                index: '/c2c/merchant',
                                title: '服务商'
                            }, {
                                index: '/c2c/history',
                                title: '交易记录'
                            }, {
                                index: '/c2c/setting',
                                title: 'C2C设置'
                            }, {
                                index: '/c2c/verify',
                                title: 'C2C审核列表'
                            },
                            // {
                            //     index: '/c2c/order',
                            //     title: '提现订单'
                            // },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: '/lock',
                        title: '锁仓管理',
                        subs: [
                            {
                                index: '/unlock',
                                title: '解锁'
                            }, {
                                index: '/cents',
                                title: '分币'
                            }
                        ]
                    }, {
                        icon: 'el-icon-lx-copy',
                        index: '/CMS',
                        title: 'CMS系统',
                        subs: [
                            {
                                index: '/Article',
                                title: '文章管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '/coin',
                        title: '币种管理',
                        subs: [
                            {
                                index: '/coins',
                                title: '币种列表'
                            },
                            {
                                index: '/selectCoin',
                                title: '币种选择'
                            },
                            {
                                index: '/tradePair',
                                title: '交易对列表'
                            }
                        ]
                    }, {
                        icon: 'el-icon-lx-calendar',
                        index: '/task',
                        title: '任务管理',
                        subs: [
                            {
                                index: '/tasklist',
                                title: '任务列表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '/SystemSettings',
                        title: '系统设置',
                        subs: [
                            {
                                index: '/CommonSettings',
                                title: '公共设置'
                            }, {
                                index: '/email',
                                title: '邮件设置'
                            }, {
                                index: '/Setting',
                                title: '基本设置'
                            }, {
                                index: '/mobileSetting',
                                title: '短信设置'
                            }, {
                                index: '/linkSettings',
                                title: '友情链接'
                            }, {
                                index: '/BannerSetting',
                                title: 'Banner'
                            }, {
                                index: '/Website',
                                title: '网站管理'
                            }, {
                                index: '/roulette',
                                title: '轮盘设置'
                            }, {
                                index: '/Recommended',
                                title: '推荐奖励'
                            },
                            // {
                            //     icon: 'el-icon-setting',
                            //     index: 'APP',
                            //     title: 'APP版本管理',
                            //     subs: [
                            //         {
                            //             index: 'NewRelease',
                            //             title: '发布新版本'
                            //         },
                            //         {
                            //             index: 'mobileSetting',
                            //             title: 'APP版本升级记录'
                            //         }
                            //     ]
                            // }
                        ]
                    }
                    // , {
                    //     icon: 'el-icon-setting',
                    //     index: 'operating',
                    //     title: '运营管理',
                    //     subs: [
                    //         {
                    //             index: 'agent',
                    //             title: '经纪人管理'
                    //         },
                    //         {
                    //             index: 'LogonStatistics',
                    //             title: '登录统计'
                    //         },
                    //         {
                    //             index: 'RegistrationStatistics',
                    //             title: '注册统计'
                    //         }
                    //     ]
                    // },
                    // , {
                    //     icon: 'el-icon-setting',
                    //     index: 'operating',
                    //     title: '社区掌柜',
                    //     subs: [
                    //         {
                    //             index: 'shopkeeper',
                    //             title: '掌柜列表'
                    //         },
                    //         {
                    //             index: 'shopkeeperSettings',
                    //             title: '掌柜设置'
                    //         }
                    //     ]
                    // },
                ],
            }
        },
        computed: {
            ...mapState(['level','adminRoleList','roleId', 'adminLevelList', 'uid', 'username', 'permissions','roleMenu']),
            onRoutes() {
                return this.$route.path.replace('', '');
            },

            meauList() {
                // console.log(this.permissions)
                let data = _.cloneDeep(this.roleMenu) ;

                let loop = (temp, parent) => {
                    for (let item of temp) {
                        if(item.url){
                            item.index =item.url;
                        }

                       // item.icon = 'el-icon-lx-home';
                        if(item.type===2){
                           // loop(data,item.parentId)
                           //  console.log(item.parentId)
                            delete parent["children"];
                            continue;
                        }
                        if(item.children && item.children.length===0){
                            delete item["children"];
                        }
                        if (item.children) {
                            // console.log(item)
                            // loop(item.children,item.path)
                            loop(item.children, item)
                        }

                        if(item.type===0 || item.type===1){
                            item.show = true;
                        }
                    }
                };
                loop(data, data);


                // console.log(data)

                //     let permissions = [];
                //
                //     for (let i in this.permissions) {
                //         for (let k in this.permissions[i]) {
                //             if (this.permissions[i][k].view) {
                //                 permissions.push('/'+i+'/'+k);
                //             }
                //         }
                //     }
                //     console.log(permissions)
                //
                // // .replace('', '/')
                //
                //     for (let item of this.items) {
                //         product.push(item.index);
                //         for (let i of item.subs) {
                //             // console.log(i.index.split('/')[2])
                //             if (permissions.indexOf(i.index) != -1 || permissions.indexOf('/'+i.index.split('/')[2]) != -1) {
                //                 permissions.push(item.index);
                //             }
                //         }
                //     }
                //
                //     // console.error(permissions);
                //     // && config.showLevelList[this.level].indexOf(item.index) != -1
                //     let loop = (configs, items) => {
                //         // console.log(typeof this.items == "array")
                //         // if (typeof items == "array") {
                //         for (let item of items) {
                //             // item.show = false;
                //             item.show = true;
                //             if (configs.indexOf(item.index) != -1 && permissions.indexOf(item.index) != -1) {
                //                 item.show = true;
                //             }
                //             if (item.subs) {
                //                 loop(configs, item.subs)
                //             }
                //         }
                //         // }
                //     };
                //
                //     loop(product, this.items);

                // let newRouters=JSON.parse(localStorage.getItem('newRouters'));
                // // console.log(newRouters)
                // for (let item of this.items){
                //     item.show=true;
                //     let base=item.index.split('/')[1];
                //     for (let key of newRouters){
                //         if(base==key.path.split('/')[1]){
                //             item.subs.push({
                //                 index:key.path,
                //                 title:key.meta['title'],
                //                 show:true
                //             })
                //         }
                //     }
                // }

                return data;
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
        },
        mounted() {
            console.log(this.permissions)
        },
        methods: {
            // 退出登录
            loginOut() {
                this.$store.commit('logout');
                this.$router.push('/login');
            },

        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
        }
    }
</script>

<style scoped>
    .el-submenu .el-menu-item {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        padding-left: 60px !important;

    }

    .el-submenu .el-menu-item.is-active {
        background-color: rgba(255, 255, 255, .05) !important;
    }

    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 38px;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
        overflow-x: visible
    }

    .sidebar > ul {
        height: 100%;
    }

    .user-info {
        padding: 20px 20px 20px 2px;
        overflow: hidden;
        max-height: 50px;
        display: flex;
    }

    .user-avator {
        width: 50px;
        height: 50px;
        flex: none;
        display: inline-block;
        border-radius: 50%;
        background: #fff;
        border: 1px solid rgba(52, 73, 94, .44);
        padding: 4px;

    }

    .user-info-cont {
        margin-left: 10px;
        flex: auto;
        font-size: 14px;
        color: #ECF0F1;
        padding: 10px 0;
    }

    .user-info-cont div:first-child {
        font-size: 14px;
        color: #BAB8B8;
    }

    .sidebar-footer {
        bottom: 0;
        clear: both;
        display: block;
        padding: 5px 0 0;
        position: fixed;
        width: 250px;
        background: #2A3F54;
        z-index: 999;
    }

    .sidebar-footer div {
        padding: 7px 0 3px;
        text-align: center;
        width: 25%;
        font-size: 20px;
        display: block;
        float: left;
        background: #172D44;
        cursor: pointer;
        color: #5A738E;
    }
</style>
