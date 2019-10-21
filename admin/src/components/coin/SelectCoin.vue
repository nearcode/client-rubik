<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>币种管理</el-breadcrumb-item>
                <el-breadcrumb-item>选择币种</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
                <!--<el-button icon="el-icon-download">导出</el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getCoinsList">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-button type="primary" @click="showDialog">选择</el-button>
                <span style="color: #5e6d82;font-size: 14px">请选择网站需要显示的币种</span>
            </div>
            <el-dialog :title="'选择币种'" :visible.sync="dialogTableVisible">
                <el-form ref="form" :model="form" label-width="0">
                    <el-form-item>
                        <el-row>
                            <el-col :md="4" :sm="6" :xs="8" v-for="(value, key, index) in choiceCoins " :key="key">
                                <el-checkbox v-model="value.select">
                                    {{value.coin}} <small>({{value.chineseName}})</small>
                                </el-checkbox>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit()">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-table :data="resultList" v-loading="loading" border style="width: 100%" class="table">
                <el-table-column label="名称">
                    <template slot-scope="scope">
                        <span v-if="$store.state.coins[scope.row.coin]">{{$store.state.coins[scope.row.coin].chineseName | noData}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="coin" label="简称">
                    <template slot-scope="scope">
                        {{scope.row.coin}}
                    </template>
                </el-table-column>
                <el-table-column prop="select" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.row.coin)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    // import share from 'src/common/js/share.js';
    export default {
        name: "SelectCoin",
        data() {
            return {
                resultList: [],
                dialogTableVisible: false,
                dialogFormVisible: false,
                choiceCoins: [
                    {
                        coin:'',
                        chineseName:'',
                        select: false
                    }
                ],
                coinsList: [],
                form: {},
                loading: true
            };
        },

        mounted() {
            this.getCoinsList();//获取选中的币种
        },
        methods: {
            showDialog() {
                this.getPairsList();//获取所有的币种列表（弹框）
                this.dialogTableVisible = true;
            },
            getCoinsList() { //获取选中的币种
                this.loading = true;
                this.$axios({
                        method: 'get',
                        url: '/admin/getSiteInfo?data=coins'
                    }
                ).then(result => {
                    this.loading = false;
                    this.coinsList = result.data.coins;
                    let data = [];
                    let coinsList = result.data.coins;
                    for (let k in coinsList) {
                        coinsList[k].coin = k;
                        data.push(coinsList[k])
                    }
                    this.resultList = data;

                }).catch(error => {
                    if (error.data && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            getPairsList() { //获取所有的币种
                this.choiceCoins = [];
                this.$axios({
                        method: 'get',
                        url: '/admin/getConfigCoins'
                    }
                ).then(result => {
                    let coinsData = result.data;

                    for (let key in coinsData) {
                        this.choiceCoins.push({
                            coin: key,
                            chineseName: coinsData[key].chineseName,
                            select: this.coinsList && this.coinsList[key] ? true : false
                        })
                    }

                }).catch(error => {
                    if (error.data && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            // 选择网站所需要的币种
            submit() {
                let result = [];
                this.choiceCoins.forEach(function (item) {
                    if (item['select']) {
                        result.push(item['coin'])
                    }
                });
                this.$axios({
                    method: "post",
                    url: "/admin/addSiteInfoCoin",
                    data: {
                        coin: result
                    }
                })
                    .then(res => {
                        this.$message.success('添加成功!');
                        this.getCoinsList();
                        this.dialogTableVisible = false;

                    })
                    .catch(e => {
                        if (e.data.error) {

                        }
                    });

            },
            // 移除币种
            handleDelete(coin) {
                this.$confirm('你确定从网站上删除"' + coin + '"吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: "post",
                        url: "/admin/delSiteInfoCoin",
                        data: {
                            coin: coin
                        }
                    }).then(res => {
                        this.$message.success('删除成功!');
                        this.getCoinsList();
                    }).catch(e => {
                        if (e.data.error) {

                        }
                    });
                }).catch(() => {
                });

            }
        }
    }
</script>

<style>
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
</style>
