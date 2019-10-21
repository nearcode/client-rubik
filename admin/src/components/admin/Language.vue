<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>系统语言</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
                <el-form>
                    <el-form-item label="语言设置">
                        <el-radio-group v-model="Language" @change="getData" size="medium">
                            <el-radio border label="zh">中文简体</el-radio>
                            <el-radio border label="en">English</el-radio>
                            <el-radio border label="ko">한국어</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!--<el-form-item size="large">-->
                        <!--<el-button type="primary" @click="getData">立即保存</el-button>-->
                    <!--</el-form-item>-->
                </el-form>
        </div>
    </div>
</template>

<script>
    import {changeLanguage} from '@/common/language'

    export default {
        name: "Language",
        data() {
            return {
                Language: window.localStorage.getItem('lan') || 'zh'
            }
        },
        mounted() {

        },
        methods:{
            getData(){
                this.$i18n.locale=this.Language;
                changeLanguage(this.Language)
            }
        }
    }
</script>

<style scoped>

</style>
