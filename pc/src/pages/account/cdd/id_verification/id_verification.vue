<template>
    <div class="At_the_bottom">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/account/cdd">实名认证</el-breadcrumb-item>
                    <el-breadcrumb-item>高级认证</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="text item" v-loading="!active">
                <el-alert type="warning" title="照片要求：" :closable="false"
                          :description="'上传身份证正反面（请确保照片的内容完整并清晰可见，身份证必须在有效期内）。手持本人身份证正面照和个人签字,个人签字的内容包含“'+webTitle+'”和当前日期（请确保照片和个人签字的内容清晰可见）。'"
                >
                </el-alert>
                <!--步骤条-->
                <el-steps :active="active" finish-status="success" style="margin: 20px 0" align-center>
                    <el-step :title="v.title" v-for="(v,k) in steps" :key="k">

                    </el-step>
                </el-steps>
                <!--步骤内容-->
                <!--步骤二-->
                <div v-if="active===1">
                    <el-row :gutter="20" class="sfz">
                        <el-col :span="8" class="sfz_col" v-for="(v,k) in sfz" :key="k">
                            <el-upload
                                    class="avatar-uploader"
                                    :action="urlAction"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess.bind(null, {'index':v.type})"
                                    :on-preview="handlePictureCardPreview"
                                    :on-error="uploadError"
                                    :before-upload="beforeAvatarUpload">
                                <img v-if="v.imageUrl" :src="v.imageUrl" class="avatar">
                                <!--示例图片-->
                                <img v-else-if="!v.imageUrl && v.sampleImgUrl" :src="v.sampleImgUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <p class="describe">{{v.title}}</p>
                        </el-col>
                    </el-row>
                    <div style="text-align: center">
                        <el-button type="primary" @click="submit"
                                   :disabled="!this.sfz.sfzC.imageUrl || !this.sfz.sfzA.imageUrl || !this.sfz.sfzB.imageUrl"
                                   :loading="ruleForm.loading">提交
                        </el-button>
                    </div>
                </div>
                <!--步骤三-->
                <div v-if="active===2" class="stepMain" style="text-align: center">
                    <div class="step_audit" v-if="resuleStatus.result==1">
                        <!--等待审核-->
                        <span class="review status_img"></span>
                        <h1>您的资料已提交审核，预计将在三个工作日内完成审核</h1>
                        <p>我们会保护您的个人信息安全,请您耐心等待！</p>
                    </div>
                    <!--审核未通过-->
                    <div class="step_audit" v-if="resuleStatus.result==2">
                        <span class="failure status_img"></span>
                        <h1>您提交的身份认证请求未通过审核，原因是：<span class="font_red">{{resuleStatus.reply}}</span></h1>
                        <el-button @click="active=1"  type="primary" plain>重新认证</el-button>
                    </div>
                </div>
                <!--步骤四-->
                <div v-if="active===3" class="stepMain step_success">
                    <span class="fa fa-5x fa-check-circle font_green"></span>
                    <h1 class="font_green">认证成功</h1>
                    <p>恭喜你，完成了高级认证</p>
                </div>

            </div>
        </el-card>
    </div>
</template>

<script>
    import config from '@/config'
    import baseApi from '@/api/base'
    import {mapState} from 'vuex'

    export default {
        name: "ID_verification",
        data() {
            return {
                active: null,
                urlAction: config.baseUrl + '/account/upload',
                ruleForm: {},
                rules: {},
                steps: [
                    {
                        title: '上传有效证件',
                        description: ''
                    }, {
                        title: '等待审核'
                    }, {
                        title: '完成高级认证'
                    },
                ],
                sfz: {
                    sfzA: {type: 'sfzA', title: "本人身份证正面照片", imageUrl: '',sampleImgUrl:'/static/assets/idcard/idcard-f.png'},
                    sfzB: {type: 'sfzB', title: "本人身份证反面照片", imageUrl: '',sampleImgUrl:'/static/assets/idcard/idcard-b.png'},
                    sfzC: {type: 'sfzC', title: "手持本人身份证正面照和个人签字", imageUrl: '',sampleImgUrl:'/static/assets/idcard/COINKOCH-idcardh.jpeg'},
                },
                resuleStatus:null
            };
        },
        // 计算属性
        computed: {
            ...mapState(['webTitle','authLevel']),
        },
        mounted() {
            this.getStatus();
        },
        methods: {
            // 获取状态
            async getStatus() {
            if(this.authLevel<=0) return;
                try {
                    let result = await baseApi.getCertificateStatus({type:2});
                  
                    this.resuleStatus = result;
                    switch (result.result) {
                        case 0:
                            this.active = 1;
                            break;
                        case 1:
                        case 2:
                            this.active = 2;
                            break;
                        case 3:
                            this.active = 3;
                            break;
                    }
                } catch (e) {

                }
            },
            async submit() {
                if (!this.sfz.sfzC.imageUrl || !this.sfz.sfzA.imageUrl || !this.sfz.sfzB.imageUrl) return this.$notify.error('信息不完整');
                let data = {
                    // code: '', //验证码
                    type:2,
                    handCard: this.sfz.sfzC.imageUrl, //手持照
                    frontCard: this.sfz.sfzA.imageUrl, //身份证正面
                    backCard: this.sfz.sfzB.imageUrl //身份证反面
                };
                try {
                    let result = await baseApi.realnameRequest(data);
                    this.getStatus();
                } catch (e) {

                }
            },
            handleAvatarSuccess(obj, res,) {
                this.$set(this.sfz[obj.index], 'imageUrl', res.data);
                // this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg/png/gif';
                // const isLt2M = file.size / 1024 / 1024 < 2;
                // //
                // // if (!isJPG) {
                // //     this.$message.error('上传头像图片只能是 JPG 格式!');
                // // }
                // if (!isLt2M) {
                //     this.$message.error('上传头像图片大小不能超过 2MB!');
                // }
                // return  isJPG && isLt2M;
                return
            },
            // 上传出错
            uploadError(err, file, fileList) {
                this.$message.error(err);
            },
            // 图片预览
            handlePictureCardPreview(file) {
                // this.dialogImageUrl = file.url;
                // this.imgVisible = true;
            },
            // 下一步
            next() {
                if (this.active++ > 2) this.active = 1;
            }
        }
    }
</script>

<style lang="less" scoped>
    .step_success {
        text-align: center;
        padding: 20px 0;
        h1 {
            font-size: 18px;
            font-weight: 500;
            padding: 10px;
        }
        p {
            color: #606266;
        }
    }

    .step_audit {
        padding: 15px 0;
        span.status_img {
            display: block;
            width: 60px;
            height: 60px;
            margin: auto;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;

        }
        span.review{
            background-image: url("/static/assets/ico/review.svg");
        }
        span.failure{
            background-image: url("/static/assets/ico/AuditFailure.svg") ;
        }
        h1 {
            padding: 15px;
            font-size: 16px;
            font-weight: bold
        }
        p {
            color: #909399;
            font-size: 12px;
        }
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        width: 100%;
        height: 200px;
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
        width: 100%;
        height: 200px;
        line-height: 200px;
        text-align: center;
        overflow: hidden;
    }

    .avatar {
        width: 100%;
        height: 200px;
        display: block;
    }

    .stepMain {
        width: 500px;
        margin: auto
    }

    .sfz {
        /*overflow: hidden;*/
        padding: 15px 20px;
        /*margin: auto;*/
        text-align: center;
        .sfz_col {
            border-radius: 4px;
            /*width: 230px;*/
            /*height: 230px;*/
            padding: 10px;
            display: inline-block;
            /*margin-right: 15px;*/
            border: 1px dashed #ddd;
            p.describe {
                color: #909399;
            }
        }
    }
</style>