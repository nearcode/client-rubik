<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path :'/cms/article'}">文章管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{id?'修改':'添加'}}新闻</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="newsForm" :model="form" :rules="rules" label-width="80px">
                <el-form-item prop="sort" label="文章排序">
                    <el-input placeholder="" v-model="form.sort">
                    </el-input>
                </el-form-item>
                <el-form-item prop="title" label="文章标题">
                    <el-input v-model="form.title" placeholder="输入文章标题">
                    </el-input>
                </el-form-item>
                <el-form-item prop="type" label="文章类别">
                    <el-select v-model="form.type" @change="selectCoin(form.type)">
                        <el-option v-for="(v,k) in ArticleType" :label="v" :value="k" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="coin" label="选择币种" v-if="coinList">
                    <el-select v-model="form.coin" filterable clearable>
                        <el-option v-for="(v,k) in coinList" :label="v" :value="v" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <!--文章封面-->
                <el-form-item prop="cover" label="文章封面">

                    <el-upload
                        class="avatar-uploader"
                        :action="urlAction"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-preview="handlePictureCardPreview"
                        :on-error="uploadError"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-button v-if="imageUrl" @click="showPhoto">预览图片</el-button>
                </el-form-item>
                <!--文章内容-->
                <el-form-item prop="content" label="文章内容">
                    <!--<quill-editor ref="myTextEditor" :action="urlAction" v-model="form.content"-->
                    <!--:options="editorOption" @change="onEditorChange"></quill-editor>-->
                    <u-editor :id="id" :config="config" @input="changeContent" ref="ue" :defaultMsg="form.content"></u-editor>
                </el-form-item>
                <!--提交-->
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('newsForm')">提交</el-button>
                </el-form-item>
            </el-form>

        </div>
        <showPhoto ref="previewsfz" :photo="imageUrl"></showPhoto>
    </div>
</template>

<script>
    // import 'quill/dist/quill.core.css';
    // import 'quill/dist/quill.snow.css';
    // import 'quill/dist/quill.bubble.css';
    // import {quillEditor} from 'vue-quill-editor';
    import showPhoto from "src/components/common/PreviewPicture";
    import adminApi from "@/api/admin";
    import config from "@/config"

    import UE from '@/components/common/ueditor/ueditor.vue'

    export default {
        name: "addNews",
        data() {
            return {
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 300
                },
                ArticleType: this.$store.state.ArticleType,
                id: this.$route.query.id,
                coinList: {},
                form: {},
                urlAction: config.baseUrl + '/account/upload',
                imageUrl: '',
                editorOption: {
                    placeholder: '请在此处开始输入……'
                },
                rules: {
                    title: [{required: true, message: '标题不能为空', trigger: ['change', 'blur']}],
                    type: [{required: true, message: '请选择类别', trigger: ['change', 'blur']}],
                    // content: [{required: true, message: '内容不能为空', trigger: ['change', 'blur']}],
                }
            }
        },
        mounted() {
            if (this.id) this.getData();
        },
        methods: {
            selectCoin(type) {
                if (type == "1" || type == "2" || type == '3') {
                    this.coinList = Object.keys(this.$store.state.coins);
                } else {
                    this.coinList = {}
                }
            },
            async getData() {
                try {
                    let result = await adminApi.newsShow(this.id);
                    this.form = result.data;
                    console.log(this.form.content)
                    this.$set(this.form, 'content' ,result.data.content)
                    this.imageUrl = result.data.cover;
                    let num = result.data.type.toString();
                    this.$set(this.form, 'type', num)
                } catch (e) {

                }
            },
            changeContent(){
                // console.log(this.$refs.ue.getUEContent())
                // this.form.content = this.$refs.ue.getUEContent();
            },
            // 预览图片
            showPhoto(url) {
                if (!this.imageUrl) return;
                this.$refs.previewsfz.show()
            },
            handleAvatarSuccess(res, file) {
                console.log(res)
                // this.imageUrl = URL.createObjectURL(file.raw);
                this.imageUrl = res.data;
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
                this.$message.error("上传出错");
            },
            // 图片预览
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.imgVisible = true;
            },

            // 文章内容
            // onEditorChange({editor, html, text}) {
            //     this.form.content = html;
            // },
            //验证通过就执行
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submit()
                    } else {
                        return false;
                    }
                });
            },
            // 提交数据
            async submit() {
                let content = this.$refs.ue.getUEContent(); // 调用子组件方法
                this.form.content = content;
                if (!content) return;

                if (this.id) {//修改新闻
                    let data = {
                        id: this.id,
                        title: this.form.title,
                        type: this.form.type,
                        cover: this.imageUrl,
                        content: this.form.content
                    };
                    try {
                        let result = await adminApi.editNews(data);
                        this.$router.push('/cms/article');
                        this.resetForm(this, 'newsForm');
                        this.$message.success('修改成功！');
                    } catch (e) {

                    }
                } else { //添加新闻

                    let data = {
                        title: this.form.title,
                        type: this.form.type,
                        content: this.form.content,
                        coin: this.form.coin,
                        sort: this.form.sort,
                        // datas: this.form.info,
                        cover: this.imageUrl
                    };
                    try {
                        let result = await adminApi.addNews(data);
                        this.$router.push('/cms/article');
                        this.resetForm(this, 'newsForm');
                        this.$message.success('添加成功！');
                    } catch (e) {

                    }

                }
            }
        },
        // beforeRouteEnter(to, from, next) {
        //
        //     // Object.assign(this.$data, this.$options.data());
        //     next();
        // },
        watch: {
            $route(to, from) {
                if (to.name == 'addNews') {
                    this.imageUrl = '';
                    this.resetForm(this, 'newsForm');
                }
                // if(to.path == '/editNews'){
                this.id = this.$route.query.id;
                // }

            }, id() {
                if (this.id) this.getData();
            },
        },
        components: {
            // quillEditor,
            showPhoto,
            uEditor: UE
        },
    }

</script>

<style scoped>
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
</style>
