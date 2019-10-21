<template>
    <div class="info">
        <!--审核弹框-->

        <el-dialog :title="form.name+' 信息'" :close-on-click-modal="false" :visible.sync="outerVisible"
                   width="600px">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item prop="name" label="企业名称：">
                   <span>{{form| getDictValue('name')}}</span>
                </el-form-item>
                <el-form-item prop="employee" label="雇员数量：">
                    <span>{{form| getDictValue('employee')}}</span>
                </el-form-item>
                <el-form-item prop="contact" label="联系人：">
                    <span>{{form| getDictValue('contact')}}</span>
                </el-form-item>
                <el-form-item prop="contact" label="联系电话：">
                    <span>{{form| getDictValue('mobile')}}</span>
                </el-form-item>
                <el-form-item prop="wish" label="意向：">
                    <span>{{form| getDictValue('wish')}}</span>
                </el-form-item>
                <el-form-item prop="content" label="需求：">
                    <span>{{form| getDictValue('content')}}</span>
                </el-form-item>
                <el-form-item prop="date" label="时间：">
                    <span>{{form.date |toTimeStr}}</span>
                </el-form-item>
            </el-form>

        </el-dialog>


        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!--<el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>-->
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>薪付宝管理</el-breadcrumb-item>
                <el-breadcrumb-item>企业申请</el-breadcrumb-item>
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
            <div v-if="false" class="plugins-tips">
                <el-form :inline="true" :model="formInline" @keyup.enter.native="search" class="demo-form-inline">
                    <el-form-item label="认证状态">
                        <el-select v-model="formInline.certified" clearable placeholder="认证状态">
                            <el-option v-for="(v,k) in statusList" :label="v.text" :key="k" :value="v.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="提交时间">
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
                        <el-input placeholder="可搜索UID/邮箱/手机号码" clearable v-model="formInline.findText">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
                <el-table-column
                    label="企业名称"
                    width="180"
                    prop="name">
                    <template slot-scope="scope">
                        {{scope.row | getDictValue('name')}}
                    </template>
                </el-table-column>
                <el-table-column label="雇员数量" prop="employee" align="center">
                    <template slot-scope="scope">
                        {{scope.row| getDictValue('employee')}}
                    </template>
                </el-table-column>
                <el-table-column label="联系人" prop="contact" align="center" >
                    <template slot-scope="scope">
                            {{scope.row| getDictValue('contact')}}
                    </template>
                </el-table-column>
                <el-table-column label="联系电话" prop="mobile" align="center" width="180">
                    <template slot-scope="scope">
                        {{scope.row| getDictValue('mobile')}}
                    </template>
                </el-table-column>

                <el-table-column label="意向" prop="wish">
                    <template slot-scope="scope">
                        {{scope.row| getDictValue('wish')}}
                    </template>
                </el-table-column>

                <el-table-column label="需求" prop="content" show-overflow-tooltip width="200" align="center">
                    <template slot-scope="scope">
                        {{scope.row| getDictValue('content')}}
                    </template>
                </el-table-column>

                <el-table-column label="时间" min-width="180" prop="date" align="center">
                    <template slot-scope="scope">
                        {{scope.row.date|toTimeStr}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                       <el-button size="mini" @click="handleEdit(scope.row)" :disabled="getPerms('sys:enterprise:view')">查看</el-button>
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
    import payApi from "@/api/singpay"

    export default {
        name: "Cdd",
        data() {
            return {
                loading: false,
                form: {},
                currentPage: 1,
                resultList: [],
                totalItems: '',
                outerVisible: false,
                innerVisible: false,
                data: {}, //实名认证等级 1绑定了身分证号或护照号 2.上传身分证或护照照片 3.视频验证过
            }
        },

        mounted() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            async getData() {
                this.loading = true;
                let p = this.currentPage;
                try {
                    let result = await payApi.getApplyList(p);
                    this.loading = false;
                    this.resultList = result.data;
                    this.totalItems = result.count;
                } catch (e) {

                }
            },
            // 审核弹框
            handleEdit(item) {
                if (!item) return;
                this.form=item;
                this.outerVisible = true;
            }
        }
    }
</script>

<style scoped>
    .line {
        text-align: center;
    }

    .pre-img {
        width: 80px;
        height: 80px;
        overflow: hidden;
        display: inline-block;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }

    .pre-img img {
        width: 100%;
        height: 100%;
    }

    .certification-img {
        text-align: center;

    }

    .certification-img .pre-img img {
        cursor: zoom-in;
    }


</style>
