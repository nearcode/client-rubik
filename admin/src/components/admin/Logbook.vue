<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>日志管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <!--<el-input placeholder="请输入内容">-->
                    <!--<el-button slot="append" icon="el-icon-search"></el-button>-->
                <!--</el-input>-->
                <el-button type="danger" icon="delete" class="handle-del mr10">搜索
                </el-button>
                <div class="pull-right">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

                <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column
                        label="用户"
                        width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.uid["username"]}} ({{scope.row.uid["id"]}})</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="uid" label="账户">
                        <template slot-scope="scope" v-if="scope.row.uid">
                            <span>{{scope.row.uid | toAccount}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="level" label="操作表名">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.level==0">用户</el-tag>
                            <el-tag v-if="scope.row.level==1">管理</el-tag>
                            <el-tag v-if="scope.row.level==2">超级管理</el-tag>
                            <el-tag v-if="scope.row.level==3">客服</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作类型" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                            </el-button>
                            <el-button type="text" icon="el-icon-delete" class="red"
                                       @click="delAdmin(scope.row._id)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="IP地址" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                            </el-button>
                            <el-button type="text" icon="el-icon-delete" class="red"
                                       @click="delAdmin(scope.row._id)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                            </el-button>
                            <el-button type="text" icon="el-icon-delete" class="red"
                                       @click="delAdmin(scope.row._id)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作说明" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                            </el-button>
                            <el-button type="text" icon="el-icon-delete" class="red"
                                       @click="delAdmin(scope.row._id)">删除
                            </el-button>
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
        name: "Logbook",

    }
</script>

<style scoped>

</style>
