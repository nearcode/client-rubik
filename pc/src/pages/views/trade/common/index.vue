<template>
    <div class="container-fluid">
        <!--<el-row :gutter="20">-->
        <!--<el-col :md="18" :sm="24" :xs="24" class="panel">-->
        <!--<el-card class="box-card" shadow="never">-->
        <!--<div class="text item" ref="left">-->
        <!--<el-menu :default-active="onRoutes" class="el-menu-demo" mode="horizontal"-->
        <!--@select="handleSelect" router>-->
        <!--<el-menu-item :index="v.index" :key="v.index" v-for="(v,k) in items">{{v.title}}-->
        <!--</el-menu-item>-->
        <!--</el-menu>-->

        <!--<transition name="move" mode="out-in">-->
        <!--<router-view :key="key" :pair="pair"></router-view>-->
        <!--</transition>-->
        <!--</div>-->
        <!--</el-card>-->
        <!--</el-col>-->
        <!--<el-col :md="6" :sm="24" :xs="24" class="panel" style="padding-left: 0;">-->
        <!--<v-sidebar @tickers="tickers" :pair="pair"></v-sidebar>-->
        <!--</el-col>-->
        <!--</el-row>-->

        <div class="box">
            <!-- <div class="left"> -->
                <!-- <el-card class="box-card" shadow="never"> -->
                    <!-- <div class="text item" ref="left"> -->
                        <!-- <el-menu :default-active="onRoutes" class="el-menu-demo" mode="horizontal"
                                 @select="handleSelect" router>
                            <el-menu-item :index="v.index" :key="v.index" v-for="(v,k) in items">{{v.title}}
                            </el-menu-item>
                        </el-menu> -->

                        <transition name="move" mode="out-in">
                            <router-view :pair="pair"></router-view>
                        </transition>
                    <!-- </div> -->
                <!-- </el-card> -->
            <!-- </div> -->
            <!-- <div class="right">
                <v-sidebar @tickers="tickers" :pair="pair"></v-sidebar>
            </div> -->
        </div>
    </div>
</template>

<script>
    // import vSidebar from "./sidebar.vue";
    import exchangeApi from "@/api/exchange";
    import {mapState} from 'vuex'

    export default {
        name: "account",
        components: {
            // vSidebar
        },
        data() {
            return {
                tickers: {},
                items: [
                    {
                        icon: '',
                        index: '/exchange',
                        title: '交易'
                    },
                    //  {
                    //     icon: '',
                    //     index: '/Information',
                    //     title: '资料'
                    // }
                ],
                pair: '',
            }
        },
        computed: {
            ...mapState(['markets']),
            onRoutes() {
                for (let i in this.items) {
                    if (this.$route.path.indexOf(this.items[i].index) != -1) {
                        return this.items[i].index;
                    }
                }
            },
            key() {
                return this.$route.path + Math.random();
            },
        },
        watch: {
            $route() {
                this.pair = this.$route.params.pair;
            },
            pair() {
                this.setPair();
            },
        },
        mounted() {
            this.setPair();
        },
        methods: {
            async setPair() {
                // 获取markets
                let data = Object.keys(this.markets).length > 0 ? this.markets : this.$common.getJsonData(localStorage.baseCoinList || "[]");
                //获取当前交易对
                let pair = this.pair ? this.pair : this.$route.params.pair ? this.$route.params.pair : localStorage.pair;
                let marketList = {};

                for (let item of data) {
                    marketList[item.coin + '_' + item.base] = item;
                }


                // 判断交易对是否存在,不存在就选择第一个
                if (pair && Object.keys(marketList).length > 0 && marketList[pair]) {
                    this.pair = pair;
                } else {
                    try {
                        let markets = (await exchangeApi.markets()).data;
                        this.pair = markets[0].coin + '_' + markets[0].base;
                    } catch (e) {
                        console.log(e)
                    }
                }

                if (pair) localStorage.pair = pair;
            },
            handleSelect(key, keyPath) {

                // console.log(key, keyPath);
            }
        }
    }
</script>

<style lang="less" scoped>
    .box {
        // display: flex;
        /*display: -webkit-box;*/
        margin-bottom: 20px;
        .right {
            // flex: none;
            // width: 350px;
            /*overflow: hidden;*/
            /*position: relative;*/
        }
        .left {
            // padding-right: 10px;
            // flex: auto;
            // overflow: hidden;
        }
    }

</style>