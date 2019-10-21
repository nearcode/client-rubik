<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>等级管理</el-breadcrumb-item>
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
                <el-form :inline="true" :model="data" class="demo-form-inline">
                    <el-form-item>
                        <el-button type="primary" @click="addAdmin" :disabled="getPerms('sys:vipLevel:update')">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column
                    label="账户"
                   >
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('uid')}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="minBet" label="等级">
                    <template slot-scope="scope">
                       {{scope.row | getDictValue('level')}}
                    </template>
                </el-table-column>

                <el-table-column prop="minBet" label="手续费比例">
                    <template slot-scope="scope">
                       {{scope.row | getDictValue('discount')}}
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" :disabled="getPerms('sys:vipLevel:update')" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" :disabled="getPerms('sys:vipLevel:del')" class="red"
                                   @click="delAdmin(scope.row)">删除
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

        <!-- 编辑弹出框 -->
        <el-dialog :title="(form.dialogType=='add'?'添加':'修改')+'等级'"  @close="closeDialog('form')" :visible.sync="editVisible" :close-on-click-modal="false" width="600px">
            <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                  <el-form-item prop="uid" label="账户">
                     <el-input v-model="form.uid"></el-input>
                 <span v-if="form.userAccount">{{form.userAccount}}</span>
                </el-form-item>

                  <el-form-item prop="level" label="等级">
                    <el-input type="number" v-model="form.level"></el-input>
                </el-form-item>

                  <el-form-item prop="discount" label="手续费比例">
                    <el-input type="text" v-model="form.discount"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from "vuex"
import _ from "lodash"
import adminApi from "@/api/admin"

    export default {
        name: "Administrator",
        data() {
             let validCaptcha = (rule, value, callback) => {
               
                if (!value) {
                    return callback(new Error("账号不能为空"));
                }
                  this.form.userAccount="";
        
                this.getUserInfo(this, value, (item) => { //获取单个用户信息
                    this.$set(this.form,"userAccount",item.mobile || item.email);
                        return callback();
                    })
            };
            return {
                resultList: [],
                totalItems: 0,
                currentPage:1,
                loading: false,
                data: {
                    user: '',
                    region: ''
                },
                form: {},
                editVisible: false,
                rules: {
                     uid: [
                        {validator: validCaptcha, trigger: ["change","blur"] }
                    ],
                }
            }
        }, 
        mounted() {
            this.getData();
        },
         computed: {
            ...mapState(['coins']),
        },
        methods: {
              // 关闭弹窗重置表单
            closeDialog(formName) {
                if (formName) {
                    this.resetForm(this, formName);
                }
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            }, 
            handleSelectionChange(val) {
                this.multipleSelection = val;
                // this.$refs.multipleTable.toggleRowSelection(row);
                console.log(JSON.stringify(this.multipleSelection))
            },
            // 获取数据
            async getData() {
                let data = {
                    p:this.currentPage
                }

               try{
                let result = await adminApi.userLevelList(data);
                this.resultList = result.data;
                this.totalItems = result.count;

               }catch(e){

               }
            },
            // 新增
            addAdmin() {
                this.editVisible = true;
                this.form['dialogType']='add';
            },
            // 修改
            handleEdit(item){
                this.editVisible = true;
                this.form=_.cloneDeep(item);
                this.form['dialogType']='edit';
            },
            onSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        try{
                            let result =await adminApi.userLevelUpdate({
                                    "uid": this.form.uid,
                                    "level":this.form.level,
                                    "discount":this.form.discount,
                                });
                            this.editVisible = false;
                            this.getData();
                            if(this.form['dialogType']=='add'){
                                this.$message.success('添加成功')
                            }else{
                                this.$message.success('修改成功')
                            }
                        }catch(e){

                        }


                    } else {
                        return false;
                    }
                });

            },
            // 删除
            delAdmin(row) {
                if(!row) return;
                this.$confirm(`你确定删除吗?`, '提示', {
                 
                }).then(async () => {
                    try{
                        let result =await adminApi.userLevelDel({
                            uid:row.uid
                        });
                        this.getData();
                        this.$message.success('删除成功');
                    }catch(e){

                    }
                }).catch(() => {
                });
            }
        }

    }
</script>

<style scoped>

</style>
