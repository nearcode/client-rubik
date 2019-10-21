<template>
    <el-container class="panel At_the_bottom">
        <section class="container">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="source">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/news'}">公告</el-breadcrumb-item>
                <el-breadcrumb-item style="width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                    {{result.title}}
                </el-breadcrumb-item>
            </el-breadcrumb>
            <el-card class="box-card" shadow="never" style="min-height: 600px;">
                <div slot="header" class="clearfix">
                    <span style="font-weight: bold">{{result.title}}</span>
                </div>
                <div>
                    <div align="center" v-if="result.cover">
                        <img :src="result.cover" style="max-width: 100%" alt="">
                    </div>
                    <div class="news_content">
                        <div class="article_con" v-html="result.content" v-loading="!result.content"></div>
                    </div>
                </div>
            </el-card>
            <p style="text-align: right;font-size: 12px;padding: 15px">发布时间：{{result.create | toTimeStr}}</p>
            <!--</el-col>-->
            <!--</el-row>-->
        </section>
    </el-container>
</template>

<script>
    import baseApi from "@/api/base";

    export default {
        name: "newsShow",
        data() {
            return {
                id: this.$route.params.id,
                result:{}
            }
        },
        mounted() {
            if (this.id) this.getData();
        },
        methods: {
            async getData() {
                try {
                    let result = await baseApi.newsShow(this.id);
                    this.result=result.data;
                } catch (e) {

                }
            },
        },
        watch: {
            $route(to, from) {
                this.id = this.$route.params.id;
            },
            id() {
                if (this.id) this.getData();
            },
        },
    }
</script>

<style scoped>
    .announcement_list {
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }

    .source {
        padding-bottom: 20px;
    }

    .news_content {
        margin-top: 15px;
        text-align: justify;
        line-height: 2;
    }
</style>
