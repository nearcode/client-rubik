<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>交易管理</el-breadcrumb-item>
                <el-breadcrumb-item>交易历史</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-form :inline="true" :model="formInline" @keyup.enter.native="search" class="demo-form-inline">
                    <el-form-item label="交易对">
                        <el-select v-model="formInline.type" filterable clearable placeholder="请选择">
                            <el-option v-for="(v,k) in markets" :label="v.coin+'/'+v.base" :value="v.coin+'_'+v.base"
                                       :key="k"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择时间">
                        <el-col :span="11">
                            <el-date-picker
                                v-model="formInline.startTime"
                                type="datetime"
                                value-format="timestamp"
                                placeholder="选择开始时间" style="width: 100%;">
                            </el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker
                                v-model="formInline.endTime"
                                type="datetime"
                                value-format="timestamp"
                                placeholder="选择结束时间" style="width: 100%;">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="可输入邮箱/手机号/uid" clearable v-model="formInline.text">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column
                    label="交易对"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('market') | toString}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="level" label="买方账户" width="150">
                    <template slot-scope="scope">
                         <span>{{scope.row | getDictValue('bidUid')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="卖方账户" width="150">
                    <template slot-scope="scope">
                         <span>{{scope.row | getDictValue('askUid')}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="时间" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.create | toTimeStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="价格" width="150" align="center">
                    <template slot-scope="scope">
                         <span>{{scope.row | getDictValue('price')}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="数量" width="150" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('amount')}}</span>
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
    import exchangeApi from "@/api/ex"
    import {mapState} from 'vuex';

    export default {
        name: "exchangeHistory",
        data() {
            return {
                formInline: {
                    startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
                    endTime:new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
                },
                loading: true,
                currentPage: 1,
                resultList: [],
                totalItems: 0,
                multipleSelection: [],

            }
        },
        computed: {
            ...mapState(['markets']),
        },
        mounted() {
            this.$store.commit('getMarkets')
            this.getData();
        },
        watch: {
            $route(to, from) {
                if (to.path == "/Article") {
                    this.getData();
                }
            }
        },
        methods: {
            
            async search() {
                this.getData();
            },
            // 获取数据
            async getData() {
                let p = this.currentPage;
                try {
                    let result = await exchangeApi.getOrderHistory( {
                    text: this.formInline.text,
                    market: this.formInline.type, //1认证通过，0未认证，-1认证未通过 2待审核
                    p: this.currentPage,
                    startTime: this.formInline.startTime / 1000,
                    endTime: this.formInline.endTime / 1000
                });
                    this.resultList = result.data;
                    this.totalItems = result.count;
                    this.loading = false;
                } catch (e) {

                }
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            // 删除
            delAll() {
                let data = this.multipleSelection;
                // if (data.length == 0) return this.$message.error('请选择文章');
                // this.$confirm('你确定删除选中的文章吗', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     closeOnClickModal: false,
                //     type: 'warning',
                //     dangerouslyUseHTMLString: true
                // }).then(async () => {
                //     for (let i = 0; i < data.length; i++) {
                //         try {
                //             let result = await adminApi.delNews({_id: data[i]._id});
                //             this.getData();
                //             this.$message.success('删除成功');
                //         } catch (e) {

                //         }
                //     }
                //     this.multipleSelection = [];
                // }).catch(error => {

                // })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val);
                // this.$refs.multipleTable.toggleRowSelection(row);
                console.log(JSON.stringify(this.multipleSelection))
            }, handleEdit(_id) {
                this.$router.push({
                    // name: 'addNews',
                    path: '/editNews',
                    // params: {id: _id}
                    query: {id: _id}
                })
            }
        }

    }
</script>

<style scoped>

</style>
