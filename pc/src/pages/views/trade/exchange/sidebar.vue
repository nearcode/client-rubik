<template>
    <div class="sidebar">
        <el-card class="box-card" style="height: 100%" shadow="never">
            <div slot="header" class="clearfix header">
                <!--市场选择-->
                <el-tabs v-model="activeName" stretch @tab-click="handleClick">
                    <el-tab-pane :label="item" v-for="item in getMarkets" :key="item" :name="item"></el-tab-pane>
                    <el-tab-pane label="自选" name="optional"></el-tab-pane>
                </el-tabs>
                <!--币种搜索-->
                <el-input size="mini" clearable v-model="search"
                          :placeholder="'搜索'+(activeName==='optional'?'自选区':activeName+'交易区')"
                          prefix-icon="el-icon-search"></el-input>
            </div>
            <!--{{tickersList}}-->
            <div class="text item trickers_table" style="overflow:hidden;">
                <!--币种列表-->
                <!--<el-scrollbar style="height: 100%">-->
                <el-table :data="orderTickers" :row-style="rowStyle" :row-class-name="tableRowClassName"
                          @row-click="goExchange"
                          ref="tickersTable"
                          style="width: 100%"
                           height="390"
                          size="mini"
                          highlight-current-row>
                           <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
                    <!--币种-->
                    <el-table-column prop="pair" label="币种" align="left" min-width="100" sortable>
                        <template slot-scope="scope">
                            <i class="iconCoin"><img :src="getCoinIcon($common.getCoin(scope.row.pair))" alt=""></i>
                            <span style="display: inline-block;vertical-align: middle;">
                                <span style="white-space: nowrap;" v-if="activeName!= 'optional'">{{scope.row.pair | getCoin}}</span>
                                <span v-else style="white-space: nowrap;">{{scope.row.pair | toString}}</span>
                                <p class="cn_name">{{coins[scope.row.pair.split('_')[0]]|getDictValue('chineseName')}}</p>
                            </span>
                        </template>
                    </el-table-column>
                    <!--价格-->
                    <el-table-column prop="last" label="价格" align="left" min-width="100" sortable>
                        <template slot-scope="scope" class="price">
                            <span :class="tickersColor(scope.row.change ||0)">{{scope.row.last | autoNumber}}</span>
                            <p class="cn_name">￥{{scope.row.pair | toCNY(scope.row.last) }}</p>
                        </template>
                    </el-table-column>

                    <el-table-column prop="change" label="涨跌幅" width="90" sortable align="right">
                        <template slot-scope="scope">
                            <span :class="tickersColor(scope.row.change ||0)">{{(scope.row.change || 0) | toFixedEx(2)}}%</span>
                            <i :class="tickersColor(scope.row.change ||0,'icon')"></i>
                        </template>
                    </el-table-column>
                    <!--自选区-->
                    <el-table-column width="30" align="right">
                        <template slot="header" slot-scope="scope">
                            <i class="icon-star_empty"></i>
                        </template>
                        <template slot-scope="scope">
                            <i class="fa fa-fw" style="cursor:pointer" @click.stop="setfavorites(scope.row.pair)"
                               :class="scope.row.star?'icon-star':'icon-star_empty'"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <!--</el-scrollbar>-->
            </div>

        </el-card>

    </div>
</template>

<script>
    import exchangeApi from '@/api/exchange'
    import {mapState} from 'vuex'

    export default {
        name: "sidebar",
        props: ['pair'],
        data() {
            return {
                tickers: {},
                activeName: 'optional',
                search: '',
                coinList: [],
                favorites: []
            }
        },
        created() {
        },
        watch: {
            pair(value) {
                if (value) {
                    this.pair = value;
                    this.activeName = this.$common.getBaseCoin(value);
                }
            }
        },
        computed: {
            ...mapState(['coins', 'tickersList', 'isLogin', 'markets']),
            getMarkets() {
                let markets = [];
                let data = Object.keys(this.markets).length > 0 ? this.markets : this.$common.getJsonData(localStorage.baseCoinList || "[]");

                for (let item of data) {
                    if (markets.indexOf(item.base) == -1) {
                        markets.push(item.base);
                    }
                }
                return markets;
            },
            tickerList() {
                let list = [];
                this.tickers = Object.keys(this.tickersList).length > 0 ? this.tickersList : this.$common.getJsonData(localStorage.tickers || "{}");

                for (let item in this.tickers) {
                    this.tickers[item].pair = item;
                }

                let favorites = this.favorites ? this.favorites : this.$common.getJsonData(localStorage.favorites || "[]");
                for (let pair in this.tickers) {
                    this.tickers[pair].star = null;
                }
                favorites.forEach((pair) => {
                    if (this.tickers[pair]) {
                        this.tickers[pair].star = 1;
                    }
                });

                for (let pair in this.tickers) {
                    if (this.activeName != "optional" && this.activeName == this.$common.getBaseCoin(pair)) {
                        list.push(this.tickers[pair]);
                    } else if (this.activeName == "optional" && favorites.indexOf(pair) != -1) {
                        list.push(this.tickers[pair]);
                    }
                }
                return list;
            },
            // 模糊搜索
            orderTickers() {
                let newObj = [];
                for (let item of this.tickerList) {
                    if (this.$common.getCoin(item.pair).indexOf(this.search.toUpperCase().trim()) > -1) {
                        newObj.push(item);
                    }
                }
                // 设置默认选中
                newObj.forEach((row, index) => {
                    if (row.pair === this.pair) {
                        this.$nextTick(() => {
                            this.$refs.tickersTable.setCurrentRow(newObj[index]);
                        });
                    }
                });

                return newObj;
            },
        },
        mounted() {
            this.getFavorites();
        },
        methods: {
            rowStyle() {
                return 'cursor: pointer;'
            },
            // 表格添加class
            tableRowClassName({row, rowIndex}) {
                if (row.class) {
                    if (row.change >= 0) {
                        return 'ex-up'
                    } else if (row.change < 0) {
                        return 'ex-down'
                    }
                }
            },
            // 设置自选币种
            async setfavorites(pair) {
                if (!pair) return;
                if (!this.isLogin()) return this.$router.push('/login');

                let favorites = this.favorites;
                if (this.favorites.indexOf(pair) != -1) {
                    //  _.pull(favorites, pair);
                    let n = 0;
                    for (let item of this.favorites) {
                        if (item == pair) {
                            this.favorites.splice(n, 1);
                        }
                        n++;
                    }
                }
                else favorites.push(pair);

                try {
                    let result = await exchangeApi.setfavorites(this.favorites);
                    this.$notify.success(this.$t('设置成功'));
                } catch (e) {

                }
            },
            // 获取自选币种
            async getFavorites() {
                if (!this.isLogin()) return;
                this.favorites = this.$common.getJsonData(localStorage.favorites || "[]");
                try {
                    this.favorites = await exchangeApi.getFavorites();
                } catch (e) {

                }
            },
            // 获取币种图片
            getImgUrl(pair) {
                if (!pair) return;
                return '/static/assets/coins/' + this.$common.getCoin(pair).toLowerCase() + '.png';
            },
            // 切换交易对
            goExchange(row, column, event) {
                if (!row) return;
                this.$router.push({
                    path: `/exchange/${row.pair}`,
                })
            },
            // 切换交易区
            handleClick(tab, event) {
                this.activeName = tab.name;
            },
        },
        // watch: {
        //     $route() {
        //         // 当交易对改变的时候更新
        //         this.pair = this.$route.params.pair;
        //     },
        // },
    }
</script>

<style lang="less" scoped>
    .el-table {
        /deep/ .ex-up {
            background-color: rgba(235,77,92,0.15) !important;
            td {
                background-color: rgba(235,77,92,0.15) !important;
            }
            /*animation: ex-down 2s infinite ease running*/
        }
        /deep/ .ex-down {
            background-color: rgba(235,77,92,0.15) !important;
            td {
                background-color: rgba(235,77,92,0.15) !important;
            }
            /*animation: ex-down 2s infinite ease running*/
        }
    }

    /*.sidebar /deep/ .el-scrollbar__wrap {*/
    /*overflow-x: hidden;*/
    /*}*/
    /*.sidebar /deep/ .el-scrollbar__view{*/
    /*max-height: 100%;*/
    /*}*/
    /*.sidebar /deep/ .el-card__body{*/
    /*max-height: 93%;*/
    /*}*/
    .trickers_table {

        /deep/ .el-table__row {
            padding: 0 5px;
        }
        /deep/ .el-table .cell {
            padding: 0 2px;
        }
    }

    .sidebar {
        /*display: block;*/
        /*position: absolute;*/
        /*width: 100%;*/
        /*height: 100%;*/
        /*overflow: hidden;*/
        /*overflow-y: auto;*/
    }

    .iconCoin {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }

    .cn_name {
        font-size: 12px;
        color: #909399;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sidebar /deep/ .el-card__body {
        padding: 5px;
    }

    .sidebar /deep/ .el-table--scrollable-x .el-table__body-wrapper {
        overflow: hidden;
    }

    .sidebar /deep/ .el-card__header {
        padding-bottom: 10px !important;
    }
</style>