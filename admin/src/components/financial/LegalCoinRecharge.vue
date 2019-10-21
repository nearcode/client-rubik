<template>
    <div class="PaymentRecords">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>薪付宝管理</el-breadcrumb-item>
                <el-breadcrumb-item>银行记录</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
                <!--<el-button icon="el-icon-download">导出</el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <el-tabs v-model="action" type="card" @tab-click="handleClick">
                <el-tab-pane :label="`充值`" name="1">
                    <el-table :data="resultList" border class="table"
                              v-loading="loading" ref="multipleTable"
                              @selection-change="handleSelectionChange">
                        <el-table-column prop="date" label="时间" width="180">
                            <template slot-scope="scope">
                                {{scope.row.create | toTimeStr}}
                            </template>
                        </el-table-column>
                        <el-table-column label="用户">
                            <template slot-scope="scope">
                        <span>
                            {{scope.row|getDictValue('uid')}}
                        </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="币种">
                            <template slot-scope="scope">
                        <span>
                            {{scope.row|getDictValue('coin')}}
                        </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="分类" align="center">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.type==1">
                                    充值
                                </el-tag>

                                <el-tag type="danger" v-if="scope.row.type==-1">
                                    提现
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row|getDictValue('amount')}}
                            </template>
                        </el-table-column>

                        <el-table-column label="银行卡" align="center" min-width="200">
                            <template slot-scope="scope">
                                {{scope.row|getDictValue('cardNumber')}}
                            </template>
                        </el-table-column>

                        <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                        <span v-for="item in results" :key="item.index">
                            <el-tag :type="item.type" v-if="item.index===scope.row.result">{{item.text}}</el-tag>
                        </span>
                            </template>
                        </el-table-column>
                        <!--<el-table-column label="操作" align="center" min-width="120">-->
                        <!--<template slot-scope="scope">-->
                        <!--&lt;!&ndash;<el-button size="mini" @click="openAudit(scope.row)">审核</el-button>&ndash;&gt;-->
                        <!--<div v-if="scope.row.type==-1">-->
                        <!--<el-button size="mini" @click="openAudit(scope.row._id,2)" type="primary">通过</el-button>-->
                        <!--<el-button size="mini" @click="openAudit(scope.row._id,5)" type="danger">取消</el-button>-->
                        <!--</div>-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`提现`" name="-1">
                    <el-table :data="resultList" border class="table"
                              v-loading="loading" ref="multipleTable"
                              @selection-change="handleSelectionChange">
                        <el-table-column prop="date" label="时间" width="180">
                            <template slot-scope="scope">
                                {{scope.row.create | toTimeStr}}
                            </template>
                        </el-table-column>
                        <el-table-column label="用户">
                            <template slot-scope="scope">
                        <span>
                            {{scope.row|getDictValue('uid')}}
                        </span>
                            </template>
                        </el-table-column>

                    <el-table-column label="真实姓名">
                            <template slot-scope="scope">
                                  {{scope.row|getDictValue('truename')}}
                            </template>
                        </el-table-column>

                        <el-table-column label="币种">
                            <template slot-scope="scope">
                        <span>
                            {{scope.row|getDictValue('coin')}}
                        </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="分类" align="center">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.type==1">
                                    充值
                                </el-tag>

                                <el-tag type="danger" v-if="scope.row.type==-1">
                                    提现
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row|getDictValue('amount')}}
                            </template>
                        </el-table-column>

                        <el-table-column label="银行卡" align="center" min-width="200">
                            <template slot-scope="scope">
                                {{scope.row|getDictValue('cardNumber')}}
                            </template>
                        </el-table-column>

                        <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                        <span v-for="item in results" :key="item.index">
                            <el-tag :type="item.type" v-if="item.index===scope.row.result">{{item.text}}</el-tag>
                        </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" min-width="120">
                            <template slot-scope="scope">
                                <!--<el-button size="mini" @click="openAudit(scope.row)">审核</el-button>-->
                                <div v-if="scope.row.type==-1 && scope.row.result==0">
                                    <el-button size="mini" :disabled="getPerms('singpay:bankhistory:passAndCancel')" @click="openAudit(scope.row._id,2)" type="primary">通过
                                    </el-button>
                                    <el-button size="mini" :disabled="getPerms('singpay:bankhistory:passAndCancel')" @click="openAudit(scope.row._id,5)" type="danger">取消
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
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
    import payApi from '@/api/singpay'

    export default {
        name: "records",
        data() {
            return {
                resultList: [],
                action: '1',
                editVisible: false,
                editBtnLoad: false,
                currentPage: 1,
                multipleSelection: [],
                merchantList: [],
                totalItems: 0,
                delVisible: false,
                loading: true,
                form: {},
                data: {
                    deposit: {},
                    withdraw: {}
                },
                results: [
                    {text: '待审核', index: 0, type: 'warning'},
                    {text: '成功', index: 1, type: 'success'},
                    {text: '通过', index: 2, type: 'success'},
                    {text: '银行进行中', index: 3, type: 'warning'},
                    {text: '银行失败', index: 4, type: 'danger'},
                    {text: '取消', index: 5, type: 'danger'},
                ]

            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            async openAudit(id, type) {
                // this.form=item || {};
                // console.log(item);
                // this.editVisible=true;

                let result = null, text = '';

                if (type == 2) {
                    text = '通过'
                } else if (type == 5) {
                    text = '取消'
                }

                this.$confirm('你确定' + text + '吗', '提示', {}).then(async () => {

                    let data = {
                        result: type,
                        id
                    };

                    try {
                        let result = await payApi.setHistoryResult(data);
                        this.getData();
                        this.$notify.success(this.$t(text + '成功'));
                    } catch (e) {

                    }

                })
            },
            // 搜索
            search() {
                this.getData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                // this.$refs.multipleTable.toggleRowSelection(row);
                // console.log(JSON.stringify(this.multipleSelection))
            },
            // 获取数据
            async getData() {
                this.loading = true;
                let data = {
                    p: this.currentPage,
                    type: this.action
                };
                try {
                    let result = await payApi.getBankHistory(data);
                    this.resultList = result.data;
                    this.totalItems = result.count;
                    this.loading = false;
                } catch (e) {

                }
            },
            onSubmit() {
                // setHistoryResult
            },
            // 切换tabs
            handleClick(tab, event) {
                this.action = tab.name;
                this.currentPage = 1;
                this.resultList = [];
                this.totalItems = 0;
                this.getData();
            },
        }
    }
</script>

<style scoped>

</style>
