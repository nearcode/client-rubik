<template>
    <div class="link">
        <el-dialog :title="'友情链接'" @close="resetForm('form')" :close-on-click-modal="false" :visible.sync="editVisible"
                   width="600px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item prop="title" label="链接标题">
                    <el-input v-model="form.title" placeholder="请输入链接标题"></el-input>
                </el-form-item>
                <el-form-item prop="URL" label="链接网址">
                    <el-input v-model="form.url" placeholder="请输入链接网址"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit" :loading="editBtnLoad">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>友情链接</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
                <!--<el-button icon="el-icon-download">导出</el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip class="item" effect="d  ark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-button type="primary" @click="addLink()" :disabled="getPerms('sysSettings:linkSettings:add')">新增</el-button>
            </div>

            <el-table :data="resultList" border v-loading="loading" class="table">
                <el-table-column prop="title" label="标题" sortable>
                </el-table-column>
                <el-table-column prop="url" label="网址">
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" :disabled="getPerms('sysSettings:linkSettings:edit')">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="del(scope.row._id)" :disabled="getPerms('sysSettings:linkSettings:del')">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    import _ from "lodash"
    import adminApi from '@/api/admin'

    export default {
        name: "linkSettings",
        data() {
            return {
                form: {},
                totalItems: 0,
                loading: false,
                selectCoin: '',
                datas: {},
                editBtnLoad: false,
                editVisible: false,
                resultList: [],
                dialogType:''
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.$store.commit('getInfo');
                let loop = () => {
                    if (this.$store.state.links) {
                        this.resultList = this.$store.state.links;
                        return
                    }
                    setTimeout(loop, 500)
                };
                setTimeout(loop, 500);
            },
            // 重置表单
            resetForm(formName) {
                if (this.$refs[formName])
                    this.$nextTick(() => {
                        this.$refs[formName].resetFields();
                    })
            },
            // 新增
            addLink() {
                this.form = {};
                this.dialogType='add';
                this.editVisible = true;
            },
            // 确定操作
            async onSubmit() {
                if (!this.form.title || !this.form.url) return this.$message.error('参数不能为空');
                let title= this.form.title, url= this.form.url,id=this.form._id;

                if(this.dialogType=='add'){
                    try {
                        let result= await adminApi.addLink(title,url);
                        this.getData();
                        this.$message.success('添加成功');
                        this.editVisible = false;
                        this.resetForm('form');
                    }catch (e) {

                    }
                }else {
                    try {
                        let result= await adminApi.editLink(id,title,url);
                        this.getData();
                        this.$message.success('修改成功');
                        this.editVisible = false;
                        this.resetForm('form');
                    }catch (e) {

                    }
                }

            },
            handleEdit(item) {
                this.form = _.clone(item);
                this.dialogType='edit';
                this.editVisible = true;
            },
            del(id) {
                if(!id) return;
                this.$confirm('你确定删除吗吗?', '提示', {}).then(async () => {
                    try {
                        let result= await adminApi.delLink(id);
                        this.getData();
                        this.$message.success('删除成功');
                    }catch (e) {

                    }
                }).catch(() => {

                })
            }
        }
    }
</script>

<style scoped>

</style>
