<template>
    <div class="link">
        <el-dialog :title="(dialog_type=='add'?'添加':'修改')+'网站'+(dialog_type=='edit'?' ('+form.title+')':'')" @close="closeDialog('webForm')" :close-on-click-modal="false" :visible.sync="editVisible"
                   width="600px">
            <el-form ref="webForm" :model="form" label-width="100px">
                <el-form-item prop="title" label="网站名称">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item prop="stockName" label="平台币名称">
                    <el-input v-model="form.stockName"></el-input>
                </el-form-item>
                <el-form-item prop="domains" label="绑定域名">
                    <el-input v-model="form.domains[i]" :placeholder="'域名'+(i+1)" class="addDomains"
                              v-for="(v,i) in form.domains" :key="i">
                        <el-button slot="append" icon="el-icon-delete" @click="delLine(form.domains[i])"></el-button>
                    </el-input>
                    <el-button @click="addDomain" :disabled="getPerms('sysSettings:website:add')">添加</el-button>
                </el-form-item>
                <el-form-item prop="logo" label="网站LOGO">
                    <el-upload
                        class="avatar-uploader"
                        :action="urlAction"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-preview="handlePictureCardPreview"
                        :on-error="uploadError"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="form.logo" :src="form.logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-button v-if="form.logo" @click="showPhoto(form.logo)">预览图片</el-button>
                </el-form-item>

                <el-form-item prop="openSignup" label="开启注册">
                    <el-switch v-model="form.openSignup"></el-switch>
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
                <el-breadcrumb-item>网站管理</el-breadcrumb-item>
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
                <el-button type="primary" @click="addWeb()">新增</el-button>
            </div>

            <el-table :data="resultList" border v-loading="loading" class="table">
                <el-table-column prop="title" label="网站名称" sortable>
                </el-table-column>
                <el-table-column prop="stockName" label="平台币名称">
                </el-table-column>
                <el-table-column prop="domains" label="绑定域名">
                    <template slot-scope="scope">
                        {{scope.row.domains | toJoin}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" :disabled="getPerms('sysSettings:website:edit')">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="del(scope.row._id,scope.row.title)" :disabled="getPerms('sysSettings:website:del')">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <showPhoto ref="previewsfz" :photo="form.logo"></showPhoto>
    </div>
</template>

<script>
    import _ from "lodash"
    import showPhoto from "src/components/common/PreviewPicture";

    export default {
        name: "Website",
        components: {
            showPhoto
        },
        data() {
            return {
                urlAction: window.API_URL + '/account/upload',
                resultList: [],
                form: {
                    domains: []
                },
                dialog_type:'',
                totalItems: 0,
                loading: false,
                editBtnLoad: false,
                editVisible: false,
            }
        }, mounted() {
            this.getData();
        },
        methods: {
            // 关闭弹窗重置表单
            closeDialog(formName) {
                if (formName) this.resetForm(this, formName);
            },
            // 删除域名
            delLine(item) {
                let inx = this.form.domains.indexOf(item);
                this.form.domains.splice(inx, 1);
            },
            // 预览图片
            showPhoto(url) {
                if (!url) return;
                this.$refs.previewsfz.show()
            },
            // 添加域名
            addDomain() {
                this.form.domains.push('');
            },
            // 新增网站
            addWeb() {
                this.form = {
                    domains: []
                };
                this.dialog_type='add';
                this.editVisible = true;
            },
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/admin/siteInfoList'
                }).then(result => {
                    this.resultList = result.data.resultList;
                    let domain = this.resultList.domains;
                    for (let i in domain) {
                        console.log(domain[i])
                    }
                }).catch(error => {

                })
            },
            // 确定操作
            onSubmit() {
                if(!this.form.title || !this.form.stockName || !this.form.logo) return this.$message.error('参数不能为空')
                let domainsArray = [];
                let domain = this.form.domains;
                for (let i in domain) {
                   if(domain[i])
                    domainsArray.push(domain[i]);
                }
                if(this.dialog_type=='add'){
                    if (domainsArray.length==0) return this.$message.error('域名不能为空');
                    // 添加
                    this.$axios({
                            method: 'post',
                            url: '/admin/addSiteInfo',
                            data: {
                                title: this.form.title,
                                stockName: this.form.stockName,
                                domains: domainsArray,
                                openSignup: this.form.openSignup,
                                logo: this.form.logo
                            }
                        }
                    ).then(result => {
                        this.getData();
                        this.$message.success('保存成功');
                        this.editVisible = false;
                        this.resetForm(this, 'webForm')
                    }).catch(error => {
                        if (error && error.data.message)
                            this.$message.error(this.$t(error.data.message));
                    })
                }else {
                    if (domainsArray.length==0) return this.$message.error('域名不能为空');
                    // 修改
                    this.$axios({
                            method: 'post',
                            url: '/admin/editSiteInfo',
                            data: {
                                siteId: this.form._id,
                                title: this.form.title,
                                stockName: this.form.stockName,
                                domains: domainsArray,
                                openSignup: this.form.openSignup,
                                logo: this.form.logo
                            }
                        }
                    ).then(result => {
                        this.getData();
                        this.$message.success('保存成功');
                        this.editVisible = false;
                        this.resetForm(this, 'webForm')
                    }).catch(error => {
                        if (error && error.data.message)
                            this.$message.error(this.$t(error.data.message));
                    })
                }

            },
            handleEdit(item) {
                this.dialog_type='edit';
                this.form = _.clone(item);
                this.editVisible = true;
            },
            del(id, title) {
                this.$confirm('你确定删除“' + title + '”吗？', '提示', {
                    type: 'warning'
                }).then(() => {

                    this.$axios({
                            method: 'post',
                            url: '/admin/delSiteInfo',
                            data: {
                                siteId: id,
                            }
                        }
                    ).then(result => {
                        this.getData();
                        this.$message.success('删除成功');
                    }).catch(error => {
                        if (error && error.data.message)
                            this.$message.error(this.$t(error.data.message));
                    })

                }).catch(() => {
                });

            },

            // 上传
            handleAvatarSuccess(res, file) {
                this.$set(this.form, 'logo', res.attachment_url);
            },
            beforeAvatarUpload(file) {

            },
            // 上传出错
            uploadError(err, file, fileList) {
                this.$message.error("上传出错");
            },
            // 图片预览
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.imgVisible = true;
            },

        }
    }
</script>

<style scoped>
    .addDomains {
        margin-bottom: 5px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 100%;
        height: 178px;
        display: block;
    }

    .addDomains {
        margin-bottom: 5px;
    }
</style>
