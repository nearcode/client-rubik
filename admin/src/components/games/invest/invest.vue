<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
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
                        <el-button type="primary" @click="addAdmin" :disabled="getPerms('games:invest:update')">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column
                    label="币种"
                   >
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('coin')}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="minBet" label="最小投注">
                    <template slot-scope="scope">
                       {{scope.row | getDictValue('minBet')}}
                    </template>
                </el-table-column>
                

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" :disabled="getPerms('games:invest:update')" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" :disabled="getPerms('games:invest:del')" class="red"
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
        <el-dialog :title="(form.dialogType=='add'?'添加':'修改')+'币种'"  @close="closeDialog('form')" :visible.sync="editVisible" :close-on-click-modal="false" width="600px">
            <el-form ref="form" :rules="rules" :model="form" label-width="90px">
              
                <el-form-item prop="coin" label="币种">
                        <el-select v-model="form.coin" filterable allow-create :disabled="form.dialogType=='edit'">
                            <el-option :key="k" :label="k" v-for="(v,k) in coins" :value="k"></el-option>
                        </el-select>
                </el-form-item>

                  <el-form-item prop="minBet" label="最小投注">
                    <el-input type="number" v-model="form.minBet"></el-input>
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
import gamesApi from "@/api/games"

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
                rules: {
                    coin: [
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
                let result = await gamesApi.getCoins(data);
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
                                    "minBet":this.form.minBet
                                }
                        
                        try{
                            let result =await gamesApi.setCoins(data);
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
            delAdmin(coin) {
                if(!coin) return;
                this.$confirm(`你确定删除${coin}吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(async () => {
                    let data={
                            coin
                         }
                    try{
                        let result =await gamesApi.delCoin(data);
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
