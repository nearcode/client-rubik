<template>
    <!--:before-close="handleClose"-->
    <div class="Administrator">
        <el-dialog
            ref="dialog"
            title="新增服务商"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            @close="closeDialog('form')"
            width="600px"
        >
            <el-form ref="form" :model="form" :rules="rules" :label-position="'right'" :size="'medium'" label-width="80px">
                <!--对方账户-->
                <el-form-item label="对方账户" prop="toUser">
                    <el-input v-model="form.toUser" size="large" @input="getUser" placeholder="对方账户"></el-input>
                    <span v-if="userAccount.account">{{userAccount.account}}</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="form.loading" @click="onSubmit('form')">确 定</el-button>
            </span>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>C2C交易</el-breadcrumb-item>
                <el-breadcrumb-item>服务商列表</el-breadcrumb-item>
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
                <el-button @click="openAddMerchant()" :disabled="getPerms('c2c:merchant:add')">新增</el-button>
            </div>
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
                <el-table-column label="用户名">
                    <template slot-scope="scope">
                        <span>
                             <el-tooltip placement="top">
                            <div slot="content" class="name-wrapper">
                                <p>真实姓名: {{ scope.row.truename | noData }}</p>
                            </div>

                            <span>{{scope.row.username}} ({{scope.row.uid}})</span>
                        </el-tooltip>
                           </span>
                    </template>
                </el-table-column>

                <el-table-column label="账户">
                    <template slot-scope="scope">
                        <span>{{scope.row | toAccount}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="deleteMerchant(scope.row.uid)" :disabled="getPerms('c2c:merchant:del')">删除
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
    import c2cApi from '@/api/c2c'

    export default {
        name: "ServiceProviders",
        data() {
             let validCaptcha = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("账号不能为空"));
                }
               
                 return callback();
            };
            return {
                resultList: [],
                loading: true,
                currentPage: 1,
                totalItems: 0,
                dialogVisible: false,
                form: {
                    
                },
                userAccount:{},
                data: {},
                rules: {
                    toUser: [
                         {validator: validCaptcha, trigger: ["change",'blur'] }
                    ],
                }
            }
        },
         mounted() {
            // console.error('服务商',this.$router)
            this.getData();
        },
        methods: {
            getUser(val){
                this.userAccount={};
                if(!val) return;
                this.$set(this.form,'loading',true)
                this.getUserInfo(this, val, (item) => { //获取单个用户信息
                    this.userAccount=item;
                    this.$set(this.userAccount,"account",item.mobile || item.email)
                    this.$set(this.form,'loading',false)
                   
                })
            },
            closeDialog(formName) {
                 this.userAccount={};
                if (formName) this.resetForm(this, formName);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            async getData() {
                try {
                    let result=await c2cApi.getMerchantList(this.currentPage);
                    this.resultList=result.data;
                    this.loading=false;
                }catch (e) {

                }
            },
            // 新增服务商
            openAddMerchant() {
                this.dialogVisible = true;
            },
            //验证通过就执行
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addMerchant()
                    } else {
                        return false;
                    }
                });
            },
            // 新增确认
            async addMerchant() {
                if (!this.form.toUser || !this.userAccount.id) return;
                let data = {
                    merchantID: this.userAccount.id
                };
                try {
                    let result = await c2cApi.addMerchant(data);
                    this.getData();
                    this.dialogVisible = false;
                    this.$message.success('添加成功!');
                } catch (e) {

                }
            },
            //删除服务商
            deleteMerchant(id) {
                if (!id) return;
                this.$confirm('你确定删除该服务商吗？', '提示', {
                    type: 'warning'
                }).then(async () => {
                    let data={
                        merchantID:id
                    };
                    try {
                        let result =await c2cApi.delMerchant(data);
                        this.getData();
                        this.$message.success('删除成功!');
                    }catch (e) {

                    }
                }).catch(() => {
                });
            }
        },

    }
</script>

<style scoped>

</style>
