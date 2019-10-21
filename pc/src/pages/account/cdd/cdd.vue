<template>
    <div class="At_the_bottom cdd">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>实名认证</span>
            </div>
            <div class="text item">
                <el-card shadow="never ">
                    <section style="overflow: hidden">
                        <div class="card_icon">
                            <img src="/static/assets/ico/id_card.png" alt="">
                        </div>
                        <div class="pull-left">
                            <h3 class="card_title">身份认证</h3>
                            <p class="card_prompt" style="">为了您的账户安全，请完善身份认证</p>
                        </div>
                        <!--<el-button class="pull-right card_button" @click="goVerification('/account/real')">已认证</el-button>-->
                        <el-button type="" class="pull-right card_button" @click="goVerification('/account/real')">{{authLevel>0?'已认证':'立即认证'}}</el-button>
                    </section>
                </el-card>
            </div>
            <div class="text item">
                <el-card shadow="never ">
                    <section style="overflow: hidden">
                        <div class="card_icon">
                            <img src="/static/assets/ico/id_card.png" alt="">
                        </div>
                        <div class="pull-left">
                            <h3 class="card_title">高级认证</h3>
                            <p class="card_prompt">
                                <span v-if="authLevel>0">为了您的账户安全，请完善高级认证</span>
                                <span v-else>请先完成身份认证，再进行高级认证</span>
                            </p>
                        </div>
                        <el-button v-if="authLevel>0" class="pull-right card_button" @click="goVerification('/account/ID_verification')">{{authLevel==3?'已认证':'立即认证'}}</el-button>
                    </section>
                </el-card>
            </div>
        </el-card>
    </div>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        name: "cdd",
        data(){
            return{
                realStatus: {0: '未提交', 1: '审核中', 2: '未通过', 3: '通过'},
            }
        },
        computed: {
            ...mapState(['truename','authLevel']),
        },
        methods:{
          goVerification(type){
              this.$router.push(type)
          }
        }
    }
</script>

<style lang="less" scoped>
    .cdd {
        .item {
            margin-bottom: 10px;
            .card_icon {
                float: left;
                margin-right: 28px;
                width: 80px;
                height: 80px;
                img {
                    width: 100%;
                }
            }
            .card_title {
                margin: 15px 0 10px 0;
                font-size: 16px;
                font-weight: bold
            }
            .card_prompt {
                color: #909399;
                font-size: 12px;
            }
            .card_button {
                margin-top: 30px;
            }
        }
    }
</style>