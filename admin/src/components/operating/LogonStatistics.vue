<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item>登录统计</el-breadcrumb-item>
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
        <el-card v-if="false" class="box-card" shadow="hover" style="margin-bottom: 10px;width: 100%">
            <div slot="header" class="clearfix">
                <span>汇总：数据更新时间: 2019-1-18 15:25:00</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div>
                <el-row :gutter="12">
                    <el-col :span="6">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalItems||0}}</div>
                                    <div>用户总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="登录时间">
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
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search"></el-button>
                    </el-form-item>
                </el-form>

                <code class="red">统计数据可能会有延迟，请注意数据更新时间</code>
                <!--登入人数总汇-->
                <el-row :gutter="12">
                    <el-col :span="6">
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>登录人数</span>
                            </div>
                            <div>
                                1000000
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>参与交易人数</span>
                            </div>
                            <div>
                                1000000
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>完成充值人数</span>
                            </div>
                            <div>
                                1000000
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>提现人数</span>
                            </div>
                            <div>
                                1000000
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

            </div>
            <el-alert style="margin-bottom: 5px;" title="数据更新时间：2019-1-8 15:41:00" type="warning" :closable="false"></el-alert>
            <!--数据时间-->
            <!--<p style="font-size: 14px;color:#909399;margin-bottom: 5px;">数据更新时间：2019-1-8 15:41:00</p>-->
            <!--数据列表-->
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column
                    label="时间"
                    width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.uid["username"]}} ({{scope.row.uid["id"]}})</span>
                    </template>
                </el-table-column>

                <el-table-column label="登录人数">
                    <template slot-scope="scope" v-if="scope.row.uid">

                    </template>
                </el-table-column>

                <el-table-column label="参与交易人数">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>

                <el-table-column label="完成充值人数" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delAdmin(scope.row._id)">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="提现人数" width="150" align="center">
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
        name: "LogonStatistics",
        data() {
            return {
                formInline: {}
            }
        }
    }
</script>

<style scoped>

</style>
