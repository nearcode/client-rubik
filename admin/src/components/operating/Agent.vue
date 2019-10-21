<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item>经纪人管理</el-breadcrumb-item>
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
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item>
                        <el-input placeholder="输入关键字检索">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select placeholder="请选择">
                            <el-option label="UID" value=""></el-option>
                            <el-option label="待审核" value=""></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="注册时间">
                        <el-col :span="11">
                            <el-date-picker
                                v-model="formInline.s"
                                type="datetime"
                                placeholder="选择开始时间" style="width: 100%;">
                            </el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker
                                v-model="formInline.s"
                                type="datetime"
                                placeholder="选择结束时间" style="width: 100%;">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="是否经纪人">
                        <el-select placeholder="请选择">
                            <el-option label="UID" value=""></el-option>
                            <el-option label="待审核" value=""></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色名称">
                        <el-select placeholder="请选择">
                            <el-option label="UID" value=""></el-option>
                            <el-option label="待审核" value=""></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册来源">
                        <el-select placeholder="请选择">
                            <el-option label="UID" value=""></el-option>
                            <el-option label="待审核" value=""></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search"></el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column
                    label="UID"
                    width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.uid["username"]}} ({{scope.row.uid["id"]}})</span>
                    </template>
                </el-table-column>

                <el-table-column prop="PID" label="PID">
                    <template slot-scope="scope" v-if="scope.row.uid">
                        <span>{{scope.row.uid | toAccount}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="level" label="邮箱">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==0">用户</el-tag>
                        <el-tag v-if="scope.row.level==1">管理</el-tag>
                        <el-tag v-if="scope.row.level==2">超级管理</el-tag>
                        <el-tag v-if="scope.row.level==3">客服</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="手机号码" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delAdmin(scope.row._id)">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delAdmin(scope.row._id)">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="角色名称" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delAdmin(scope.row._id)">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="注册来源" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delAdmin(scope.row._id)">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
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
        name: "Article",
        data() {
            return {
                formInline: {}
            }
        }
    }
</script>

<style scoped>

</style>
