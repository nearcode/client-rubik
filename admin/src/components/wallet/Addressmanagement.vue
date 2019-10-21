<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>钱包地址管理</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-form :inline="true" :model="data" class="demo-form-inline">
                    <el-form-item label="筛选币种">
                        <el-select v-model="data.region" placeholder="请选择币种">
                            <el-option label="ETH" value="shanghai"></el-option>
                            <el-option label="BTC" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>


                    <el-form-item label="筛选状态">
                        <el-select v-model="data.region" placeholder="请选择状态">
                            <el-option label="可用" value="shanghai"></el-option>
                            <el-option label="不可用" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>





                    <el-form-item label="搜索">
                        <el-input v-model="input" placeholder="请输入地址"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>


                </el-form>
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="日期"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="币种"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        label="状态"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="地址">
                    </el-table-column>
                </el-table>
                <!--</div>-->
            </div>
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
    export default {
        name: "Addressmanagement",
        data() {
            return {
                resultList: [],
                totalItems: 0,
                loading: true,
                data: {
                    user: '',
                    region: ''
                },
                form: {},
                selectWeb: '',
                editVisible: false,
                tableData:[
                    {
                        date: '2016-05-01',
                        name: 'btc',
                        state: '可用',
                        address: 'NbQNhjZdl5qN6Xgyt9KKU8ViEjJadLgp7'

                    },
                    {
                        date: '2016-05-02',
                        name: 'btc',
                        state: '可用',
                        address: 'NbQNhjZdl5qN6Xgyt9KKU8ViEjJadLgp7'

                    },
                    {
                        date: '2016-05-01',
                        name: 'ETH',
                        state: '不可用',
                        address: 'NbQNhjZdl5qN6Xgyt9KKU8ViEjJadLgp7'

                    },
                    {
                        date: '2016-05-02',
                        name: 'ETH',
                        state: '可用',
                        address: 'NbQNhjZdl5qN6Xgyt9KKU8ViEjJadLgp7'

                    },

                ],
            }
        },
        methods:{
            onSubmit() {
                if(!this.form.account || !this.form.level) return this.$message.error('信息不能为空');
                this.$axios({
                    method: 'post',
                    url: '/admin/addAdmin',
                    data: {
                        account: this.form.account,
                        siteId: this.selectWeb,
                        level: this.form.level
                    }
                }).then(result => {
                    this.getData();
                    this.$message.success('添加成功');
                    this.form = {};
                    this.editVisible = false;
                }).catch(error => {
                    if(error.data.message) this.$message.error(error.data.message);
                });
            },
            addAdmin(){

            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();

            }, handleSelectionChange(val) {
                this.multipleSelection = val;
                // this.$refs.multipleTable.toggleRowSelection(row);
                console.log(JSON.stringify(this.multipleSelection))
            },
        }
    }
</script>

<style scoped>

</style>
