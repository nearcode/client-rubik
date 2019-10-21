<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path :'/ICO'}">项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{id?'修改':'添加'}}项目</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="addProjectForm" :model="form" label-width="100px">
                <el-form-item prop="title" label="项目标题">
                    <el-input v-model="form.title" placeholder="输入项目标题">
                    </el-input>
                </el-form-item>
                <el-form-item prop="token" label="Token">
                    <el-input v-model="form.token" placeholder="">
                    </el-input>
                </el-form-item>
                <el-form-item prop="coin" label="目标:">
                    <el-form :inline="true">
                        <el-form-item label="币种">
                            <el-select v-model="form.coin" filterable clearable placeholder="请选择币种">
                                <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数量">
                            <el-input v-model="form.goal" placeholder="数量"></el-input>
                        </el-form-item>
                    </el-form>
                </el-form-item>
                <el-form-item prop="isOfficial" label="是否官方">
                    <el-select v-model="form.isOfficial"  placeholder="请选择">
                        <el-option label="否" value="0"></el-option>
                        <el-option label="是" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="least" label="最小参与">
                    <el-input v-model="form.least" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="max" label="最大参与">
                    <el-input v-model="form.max" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="total" label="项目总量">
                    <el-input v-model="form.total" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="rate" label="项目评级">
                    <div class="block">
                        <el-rate
                            v-model="form.rate"
                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                        </el-rate>
                    </div>
                </el-form-item>
                <el-form-item prop="lockTime" label="锁定时间">
                    <el-date-picker
                        v-model="form.lockTime"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="选择锁定时间" style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="proportion" label="兑换比例">
                    <el-input v-model="form.proportion" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="fee" label="手续费">
                    <el-input v-model="form.fee" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="startTime" label="开始时间">
                    <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="选择开始时间" style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="endTime" label="结束时间">
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="选择结束时间" style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="logo" label="封面图片地址">
                    <el-input v-model="form.logo" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="links.site" label="网站">
                    <el-input v-model="form.links.site" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="links.book" label="白皮书">
                    <el-input v-model="form.links.book" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="links.facebook" label="Facebook">
                    <el-input v-model="form.links.facebook" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="links.twitter" label="推特">
                    <el-input v-model="form.links.twitter" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="links.linkedin" label="LinkedIn">
                    <el-input v-model="form.links.linkedin" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="links.github" label="源码">
                    <el-input v-model="form.links.github" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="info" label="描述">
                    <el-input v-model="form.info" type="textarea" placeholder=""></el-input>
                </el-form-item>

                <el-form-item prop="content" label="主要内容">
                    <quill-editor ref="myTextEditor" v-model="form.content"
                                  :options="editorOption"></quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">提交</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';

    export default {
        name: "addProject",
        data() {
            return {
                isModify: false,
                ArticleType: this.$store.state.ArticleType,
                id: this.$route.query.id,
                form: {
                    content: '',
                    links: {}
                },
                editorOption: {
                    placeholder: '请在此处开始输入……'
                }
            }
        },
        mounted() {
            if (this.id) this.getData();
        },
        methods: {
            // 通过id获取内容数据
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/project/get/' + this.id,
                }).then(result => {
                    this.form = result.data;
                    let num = result.data.isOfficial.toString();
                    this.$set(this.form, 'isOfficial', num)
                }).catch(error => {
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            // 文章内容
            onEditorChange({editor, html, text}) {
                this.form.content = html;
            },
            // 提交数据
            submit() {
                if (this.id) {//修改
                    this.form.id = this.id;
                    this.$axios({
                            method: 'post',
                            url: '/project/edit',
                            data: this.form
                        }
                    ).then(result => {
                        this.$router.push('/ICO');
                        this.$message.success('修改成功！');
                    }).catch(error => {
                        if (error.data && error.data.message)
                            this.$message.error(this.$t(error.data.message));
                    })
                } else { //添加
                    this.$axios({
                            method: 'post',
                            url: '/project/add',
                            data: this.form
                        }
                    ).then(result => {
                        this.$router.push('/ICO');
                        this.$message.success('添加成功！');
                    }).catch(error => {
                        if (error.data && error.data.message)
                            this.$message.error(this.$t(error.data.message));
                    })

                }
            }
        },
        watch: {
            $route(to, from) {
                if (to.path == '/addProject') {
                    this.resetForm(this, 'addProjectForm');
                }
                if (to.path == '/editProject') {
                    this.id = this.$route.query.id;
                }

            }, id() {
                if (this.id) this.getData();
            },
        },
        components: {
            quillEditor
        },
    }
</script>

<style scoped>
    .block {
        display: inline-block;
    }
</style>
