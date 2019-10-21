<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>对账</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-button type="primary">
                    金额 ￥ <span>{{balanceDatas | toCNY |autoNumber}}</span>
                    现金 ￥ <span>{{balanceDatas | toC2C |autoNumber}}</span>
                </el-button>
                <span style="color: #5e6d82;font-size: 14px">资金： <span class="green">绿色</span>代表网站资金， <span class="red">红色</span>代表钱包资金</span>
            </div>
            <div class="container-fluid" v-loading="loading">
                <el-row :gutter="15">
                    <el-col :span="6" v-for="(v,k) in resultList" :key="k" style="margin-bottom: 10px">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>{{k}}</span>
                            </div>
                            <div class="text item">
                                <!--网站资金-->
                                <p>
                                    <el-tag type="success">{{v | autoNumber}}</el-tag>
                                </p>
                                <!--钱包资金-->
                                <!--<p>-->
                                    <!--<el-tag type="danger">- {{v.wallet | autoNumber}}</el-tag>-->
                                <!--</p>-->
                                <!--&lt;!&ndash;网站减去钱包&ndash;&gt;-->
                                <!--<p>-->
                                    <!--<el-tag>= {{(v.site - v.wallet) | autoNumber}}</el-tag>-->
                                <!--</p>-->

                            </div>
                        </el-card>
                    </el-col>
                </el-row>


                <el-card v-if="false" class="footer box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>补充USDT</span>
                    </div>
                    <div class="text item">
                        以价格
                        <el-tag
                            v-html="resultList.allMarket.addUSDT.CNY /resultList.allMarket.addUSDT.USDT"></el-tag>
                        元，{{resultList.allMarket.addUSDT.CNY>0?'卖出':'买入'}}
                        <el-tag
                            v-html="(resultList.allMarket.addUSDT.USDT >0?resultList.allMarket.addUSDT.USDT :-resultList.allMarket.addUSDT.USDT)"></el-tag>
                        USDT

                        <el-button @click="reset()" type="primary" size="mini">重置</el-button>
                    </div>
                    <div class="text item">

                        以价格
                        <el-tag
                            v-html="resultList.allMarket.addBTC.CNY/ resultList.allMarket.addBTC.BTC "></el-tag>
                        元，
                        {{resultList.allMarket.addBTC.CNY>0?'卖出':'买入'}}
                        <el-tag
                            v-html="(resultList.allMarket.addBTC.BTC>0?resultList.allMarket.addBTC.BTC:-resultList.allMarket.addBTC.BTC)"></el-tag>
                        <span>BTC</span>

                        <el-button @click="reset()" type="primary" size="mini">重置</el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from "lodash"
    import adminApi from "@/api/admin"

    export default {
        name: "Info",
        data() {
            return {
                resultList: {
                    allMarket: {
                        addUSDT: {},
                        addBTC: {},
                        walletBalances: {},
                        balances: {}
                    }
                },
                balances: [],
                totalItems: 0,
                loading: true,
                formInline: {
                    user: '',
                    region: ''
                },
                selectWeb: '',
                balanceDatas:{}
            }
        },
        mounted() {
            this.getData();

        },
        computed: {
            // allMarket() {
            //     return this.resultList
            // }
        },
        methods: {
            // 获取数据
            async getData() {
                this.loading = true;
                try {
                    let result= await  adminApi.financeBalances();
                    this.loading = false;
                    this.resultList = result.data;

                    let data=result.data;

                    for (let i in data) {
                        this.balanceDatas[i] = data[i];
                        // resultList.push(data[i]);
                    }
                    console.log(this.balanceDatas)
                }catch (e) {

                }
                // this.$axios({
                //         method: 'get',
                //         url: '/admin/getInfo'
                //     }
                // ).then(result => {
                //     this.loading = false;
                //     this.resultList = result.data;
                //
                //     if (_.isEmpty(this.resultList.allMarket)) {
                //         this.resultList.allMarket = {
                //             addUSDT: {},
                //             addBTC: {},
                //         }
                //     }
                //     if (_.isEmpty(this.resultList.allMarket.addBTC)) {
                //         this.resultList.allMarket.addBTC = {BTC: 0, CNY: 0}
                //     }
                //     if (_.isEmpty(this.resultList.allMarket.addUSDT)) {
                //         this.resultList.allMarket.addUSDT = {CNY: 0, USDT: 0}
                //     }
                //
                //     let balances = [];
                //
                //     for (let coin in this.resultList.balances) {
                //         let data = {
                //             site: this.resultList.balances[coin],
                //             wallet: this.resultList.walletBalances[coin] || 0
                //         };
                //         data.cha = data.site - data.wallet;
                //         data.order = data.wallet == 0 ? 0 : data.cha;
                //         data.coin = coin;
                //         balances.push(data);
                //     }
                //     this.balances = balances.sort(function (a, b) {
                //         return b.order - a.order;
                //     });
                //
                // }).catch(error => {
                //     if (error && error.data.message)
                //         this.$message.error(this.$t(error.data.message));
                // })
            },
            // 重置
            reset() {
                this.$confirm('你确定重置吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/resetAllMarketTotal'
                    }).then((result) => {
                        this.resultList.allMarkets = {};
                        this.$message.success('重置成功');
                    }).catch((error) => {
                        if (error.data && error.data.message) {
                            this.$message.error(this.$t(error.data.message));
                        }
                    });
                }).catch((error) => {})
            }
        }
    }
</script>

<style scoped>
    .container-fluid {
        background-color: #eef1f6;
        padding: 15px 15px 5px;
    }

    .text.item p {
        margin-bottom: 5px;
    }

    .el-row {
        margin-bottom: 20px !important;

    }

    .el-row:last-child {
        margin-bottom: 0 !important;
    }

    .box-card .item {
        padding: 10px 0;
    }

    .footer.box-card .item:first-child {
        border-bottom: 1px solid #ebeef5;
    }
</style>
