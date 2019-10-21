<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>CMS系统</el-breadcrumb-item>
                <el-breadcrumb-item>文章管理</el-breadcrumb-item>
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
                    <el-form-item label="文章分类">
                        <el-select v-model="formInline.type" filterable clearable placeholder="请选择">
                            <el-option v-for="(v,k) in ArticleType" :label="v" :value="k"
                                       :key="k"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布日期">
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
                        <el-input placeholder="输入文章标题或内容关键字模糊查询" clearable v-model="formInline.findText">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
                    </el-form-item>
                </el-form>
                <div style="margin-top: 15px;">
                    <el-button type="primary" :disabled="multipleSelection.length==0 && getPerms('cms:article:del')" icon="delete" @click="delAll">批量删除
                    </el-button>
                        <el-button type="danger" icon="delete" class="handle-del mr10" @click="()=>{this.$router.push('/addNews')}" :disabled="getPerms('cms:article:add')">添加文章
                        </el-button>
                </div>
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

                <el-table-column label="分类" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{$store.state.ArticleType[scope.row.type]}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="level" label="发布者" width="150">
                    <template slot-scope="scope">
                        --
                    </template>
                </el-table-column>

                <el-table-column label="发布时间" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.date | toTimeStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="150" align="center">
                    <template slot-scope="scope">
                        --
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" :disabled="getPerms('cms:article:edit')" @click="handleEdit(scope.row._id)">编辑
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
    import adminApi from "@/api/admin"
    import {mapState} from 'vuex';

    export default {
        name: "Article",
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
                multipleSelection: []
            }
        },
        computed: {
            ...mapState(['ArticleType']),
        },
        mounted() {
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
                this.loading = true;
                let data = {
                    text: this.formInline.findText,
                    type: this.formInline.type, //1认证通过，0未认证，-1认证未通过 2待审核
                    p: this.currentPage,
                    startTime: this.formInline.startTime,
                    endTime: this.formInline.endTime
                };

                try {
                    let result = await adminApi.searchNews(data);
                    this.loading = false;
                    this.resultList = result.data;
                    this.totalItems = result.count;
                } catch (e) {

                }
                // this.$axios({
                //     method: 'get',
                //     url: '/news/search',
                //     params: {
                //         text: this.formInline.findText,
                //         type: this.formInline.type, //1认证通过，0未认证，-1认证未通过 2待审核
                //         p: this.currentPage,
                //         startTime:this.formInline.startTime,
                //         endTime:this.formInline.endTime
                //     }
                // }).then(result => {
                //     this.loading=false;
                //     this.resultList = result.data.resultList;
                //     this.totalItems = result.data.totalItems;
                // })
            },
            // 获取数据
            async getData() {
                let p = this.currentPage;
                try {
                    let result = await adminApi.newsList(p);
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
                if (data.length == 0) return this.$message.error('请选择文章');
                this.$confirm('你确定删除选中的文章吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(async () => {
                    for (let i = 0; i < data.length; i++) {
                        try {
                            let result = await adminApi.delNews({_id: data[i]._id});
                            this.getData();
                            this.$message.success('删除成功');
                        } catch (e) {

                        }
                    }
                    this.multipleSelection = [];
                }).catch(error => {

                })
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
