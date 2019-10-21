<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>项目列表</el-breadcrumb-item>
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
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-button type="primary" icon="delete" class="handle-del mr10" :disabled="statusType!=0"
                           @click="setStatus('status',1,'审核通过')">
                    审核通过
                </el-button>
                <el-button type="danger" icon="delete" class="handle-del mr10" :disabled="statusType!=1"
                           @click="setStatus('status',-2,'审核不通过')">
                    审核不通过
                </el-button>
                <el-button type="success" icon="delete" class="handle-del mr10" :disabled="statusType!=2"
                           @click="setStatus('status',3,'强制成功')">
                    设置成功
                </el-button>
                <el-button icon="delete" class="handle-del mr10"
                           :disabled="statusType!=0 && statusType!=5 && statusType!=3"
                           @click="setStatus('status',5,'退款')">退款
                </el-button>
                <el-button type="primary" icon="delete" @click="toAddProject" class="handle-del mr10">创建新项目
                </el-button>
            </div>

            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column
                    label="标题"
                    width="400"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="用户" align="center">
                    <template slot-scope="scope">
                        <span>
                             <el-tooltip placement="top">
                            <div slot="content" class="name-wrapper">
                                <p>真实姓名: {{ scope.row.createUser.truename | noData }}</p>
                            </div>

                            <span>{{scope.row.createUser.username}}</span>
                        </el-tooltip>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column prop="level" label="目标" width="150">
                    <template slot-scope="scope">
                        {{scope.row.goal}}
                    </template>
                </el-table-column>

                <el-table-column label="时间" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.date | toTimeStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="项目状态" prop="status" width="150" align="center" :filter-method="filterHandler" column-key="status" :filters="status">
                    <template slot-scope="scope">
                        <el-tag :type="v.type" v-for="(v,k) in status" :key="k" v-if="v.value==scope.row.status">
                            {{v.text}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row._id)">编辑
                        </el-button>
                        <!--<el-button type="text" icon="el-icon-delete" class="red"-->
                        <!--@click="delAdmin(scope.row._id)">删除-->
                        <!--</el-button>-->
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
    export default {
        name: "project",
        data() {
            return {
                formInline: {},
                loading: true,
                currentPage: 1,
                resultList: [],
                multipleSelection: [],
                statusType: 0,
                totalItems: 0,
                // status: {'-2': '项目失败', 0: '待审核', 1: '审核通过', 2: '项目进行中', 3: '项目强制成功', 5: '已退款'}
                status: [
                        {text: '项目失败',value:-2,type:'danger'},
                        {text: '待审核',value:0,type:'warning'},
                        {text: '审核通过',value:1,type:''},
                        {text: '项目进行中',value:2,type:''},
                        {text: '项目强制成功',value:3,type:'success'},
                        {text: '已退款',value:5,type:'danger'},
                    ]
            }
        }, mounted() {
            this.getData();
        },
        watch: {
            $route(to, from) {
                if (to.path == "/ICO") {
                    this.getData();
                }
            }
        },

        methods: {
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            toAddProject() {
                this.$router.push('/addProject')
            },
            // 获取数据
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/admin/project?p=' + this.currentPage
                }).then(result => {
                    this.resultList = result.data.resultList;
                    this.totalItems = result.data.totalItems;
                    this.loading = false;
                }).catch(error => {
                    if (error && error.data.message) {
                        this.$message.error(this.$t(error.data.message));
                    }
                })
            },
            setStatus(status, type, val) {
                let data = this.multipleSelection;
                if (data.length == 0) return this.$message('请选择项目');
                let _this = this;
                this.$confirm('你确定' + val + '吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    for (let i = 0; i < data.length; i++) {
                        this.$axios({
                            method: 'post',
                            url: '/admin/project/status',
                            data: {
                                id: data[i]._id,
                                status: type
                            }
                        }).then((result) => {
                            _this.getData();
                            this.$message.success('设置状态成功!');
                        }).catch(error => {
                            if (error && error.data.message) {
                                this.$message.error(this.$t(error.data.message));
                            }
                        })
                    }
                }).catch(() => {
                });

                this.multipleSelection = [];
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                for (let i in val) {
                    this.statusType = val[i].status;
                }

                console.log(val);
                // this.$refs.multipleTable.toggleRowSelection(row);
                console.log(JSON.stringify(this.multipleSelection))
            }, handleEdit(_id) {
                this.$router.push({
                    // name: 'addNews',
                    path: 'editProject',
                    // params: {id: _id}
                    query: {id: _id}
                })
            }
        }

    }
</script>

<style scoped>

</style>
