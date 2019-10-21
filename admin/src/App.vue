<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import Main from '@/router/main.js'
    import index from '@/components/common/Home'
    export default {
        mounted() {

            this.$router.push({
                path:'/loading/',
                query:{
                    redirect:location.pathname+location.search
                }
            });
        
        },
    }
</script>

<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css"; /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   !*浅绿色主题*!*/

    .el-button--mini, .el-button--mini.is-round{
        padding: 5px 10px;
    }

    @media (max-width: 766px) {
        .el-dialog {
            width: auto !important;
            margin: 10px;
        }
        .content-collapse{
            left: 0!important;
        }

    }
    .plugins-tips .el-form-item{
        margin-bottom: 0;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }

    .el-select .el-input {
        min-width: 100px;
    }
    .red{
        color: #f56c6c;
    }
    .green{
        color: #67c23a;
    }
    .pull-left{
        float: left;
    }
    .pull-right{
        float: right;
    }
    .line {
        text-align: center;
    }
</style>
