<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>资金变化</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download" @click="excel">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-select v-model="action" placeholder="筛选时间">
                    <el-option label="按天" value="day"></el-option>
                    <el-option label="按时" value="hour"></el-option>
                </el-select>
            </div>
            <el-table :data="resultList" max-height="700" border class="table" v-loading="loading" ref="multipleTable">
                <el-table-column v-for="item in titleList"
                                 :label="item"
                                 :key="item"
                                 :fixed="item=='时间'"
                                 width="180"
                                 prop="create">
                    <template slot-scope="scope">
                        <span v-if="item!='时间'">{{scope.row[item] | autoNumber}}</span>
                        <span v-if="item=='时间'">{{scope.row['create'] | toTimeStr}}</span>
                    </template>
                </el-table-column>

            </el-table>
            <!--分页-->
            <div class="pagination" v-if="totalItems>1">
                <el-pagination background @current-change="handleCurrentChange" :page-size="20"
                               layout="prev, pager, next"
                               :total="totalItems">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from "lodash"
    import baseApi from "@/api/admin"
    import {mapState} from "vuex"

    export default {
        name: "MoneyChange",
        data() {
            return {
                resultList: [],
                loading: true,
                action: 'day',
                currentPage: 1,
                totalItems: 0,
                titleList: []
            }
        }, 
        mounted() {
            this.getData();
        },
        watch: {
            action(val, oldval) {
                this.getData()
            }
        },
        computed: {
            ... mapState(['coins']),
        },
        methods: {
            // 导出
            excel() {
                this.export({
                    url: '/admin/snapshotBalanceList',
                    title: '资金变化',
                    data: {
                        action: this.action,
                        p: this.currentPage
                    }
                })
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            async getData() {
                this.loading = true;
                this.resultList = [];
                this.titleList = ['时间'];

                for (let coin in this.coins) {
                    if (!this.coins[coin].disable) this.titleList.push(coin);
                }

                let info={
                    action:this.action,
                    p:this.currentPage
                };

                try{
                    let result=await baseApi.financeSnapshoot(info);
                     this.loading = false;
                    
                   
                    for (let item of result.data) {
                        let data = {};
                        data.create = item.create;
                        _.extend(data, item.balances);
                        this.resultList.push(data);
                    }
                    this.totalItems = result.count;
                }catch(e){

                }
            }
        }

    }
</script>

<style scoped>

</style>
