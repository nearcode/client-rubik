<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>钱包管理</el-breadcrumb-item>
                <el-breadcrumb-item>币种设置</el-breadcrumb-item>
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
                        <el-button type="primary" @click="addAdmin" :disabled="getPerms('wallet:coinSetting:update')">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column
                    label="名称"
                   >
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('coin')}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="type" label="种类">
                    <template slot-scope="scope">
                       {{scope.row | getDictValue('type')}}
                    </template>
                </el-table-column>
                <el-table-column prop="contract" label="合约地址">
                    <template slot-scope="scope">
                        {{scope.row | getDictValue('contract')}}
                    </template>
                </el-table-column>
                <el-table-column prop="decimal" label="精度">
                    <template slot-scope="scope">
                      {{scope.row | getDictValue('decimal')}}
                    </template>
                </el-table-column>
                 <el-table-column prop="fee" label="手续费">
                    <template slot-scope="scope">
                      {{scope.row | getDictValue('fee')}}
                    </template>
                </el-table-column>
                <el-table-column prop="parent" label="关联">
                    <template slot-scope="scope">
                        {{scope.row | getDictValue('parent')}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" :disabled="getPerms('wallet:coinSetting:update')" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" :disabled="getPerms('wallet:coinSetting:del')" class="red"
                                   @click="delAdmin(scope.row.coin)">删除
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
        <el-dialog :title="(form.dialogType=='add'?'添加':'修改')+'钱包币种'"  @close="closeDialog('form')" :visible.sync="editVisible" :close-on-click-modal="false" width="600px">
            <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                <el-form-item prop="coin" label="名称">
                    <el-input v-model="form.coin"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="种类">
                   <el-select
                        v-model="form.type"
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择或自定义">
                      <el-option :key="k" :label="v" v-for="(v,k) in kindList" :value="v"></el-option>
                    </el-select>

                </el-form-item>

                  <el-form-item prop="url" label="服务器地址">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>

                  <el-form-item prop="user" label="账户">
                    <el-input v-model="form.user"></el-input>
                </el-form-item>

                  <el-form-item prop="password" label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                
                <el-form-item prop="contract" label="合约地址">
                    <el-input v-model="form.contract"></el-input>
                </el-form-item>

                  <el-form-item prop="decimal" label="精度">
                    <el-input type="number" v-model="form.decimal"></el-input>
                </el-form-item>

                  <el-form-item prop="fee" label="手续费">
                    <el-input type="number" v-model="form.fee"></el-input>
                </el-form-item>

                <el-form-item prop="parent" label="关联">
                        <el-select filterable v-model="form.parent">
                            <el-option :key="k" :label="v.coin" v-for="(v,k) in resultList" :value="v.coin"></el-option>
                        </el-select>
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
import walletApi from "@/api/wallet"
import _ from "lodash"

    export default {
        name: "Administrator",
        data() {
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
                kindList: ['ERC20','OMNI'],
                rules: {
                    coin: [
                        {required: true, message: '参数不能为空', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '参数不能为空', trigger: 'blur'}
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
                let result = await walletApi.walletCoinList(data);
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
                        
                            let data={
                                    "coin": this.form.coin,
                                    "contract": this.form.contract,
                                    "decimal": this.form.decimal,
                                    "parent":this.form.parent,
                                    "fee":this.form.fee,
                                    "user":this.form.user,
                                    "password": this.form.password,
                                    "url":this.form.url,
                                    "type":this.form.type
                                }
                        
                        try{
                            let result =await walletApi.walletCoinAdd(data);
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
            // 删除管理员
            delAdmin(coin) {
                if(!coin) return;
                this.$confirm('你确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(async () => {
                    let data={
                            coin
                         }
                    try{
                        let result =await walletApi.walletCoinDel(data);
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
