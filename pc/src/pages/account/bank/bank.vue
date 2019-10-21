<template>
    <div class="At_the_bottom cdd">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>支付绑定</span>
            </div>

            <div class="text item">
                <!--提示实名认证-->
                <el-alert v-if="authLevel<=0" title="请先完成实名认证" type="error" close-text="去认证>" @close="goCdd"
                          style="margin-bottom: 10px;"></el-alert>
                <!--未绑定银行卡-->
                <el-card shadow="never" align="center" v-if="!bankList || bankList.length===0">
                    <p class="el-table__empty-text">暂未绑定银行卡</p>
                </el-card>
                <!--银行卡列表-->
                <el-row :gutter="20" v-else>
                    <el-col :span="12" v-for="(v,k) in bankList" :key="k">
                        <!--backgroundImage:'url('+imgUrl(v.type.toUpperCase())+')'-->
                        <el-card shadow="never" class="banksList"  ref="alltab"
                                 :style="{backgroundColor:bankCardColor[v.type],borderColor:bankCardColor[v.type]}"
                                 :key="k">
                            <section style="overflow: hidden">
                                <div class="card_icon">
                                    <img :src="'/static/assets/bankCards/'+v.type+'.png'" alt="">
                                </div>
                                <div class="pull-left">
                                    <h3 class="card_title">{{v.name | noData}}
                                        <small>({{v.branch | noData}})</small>
                                    </h3>
                                    <p class="card_prompt" style="">{{v.number | noData}}</p>
                                </div>
                                <div class="btn_group">
                                    <el-button size="mini" type="success" v-if="v.isDefault">默认卡</el-button>
                                    <el-button size="mini" type="primary" v-if="!v.isDefault"
                                               @click="defaultCard(v._id)">设为默认
                                    </el-button>
                                    <el-button size="mini" type="danger" @click="delBankcard(v._id)">删除</el-button>
                                </div>
                            </section>
                            <!--定位图-->
                            <img class="bankLogo" :draggable="false" :src="'/static/assets/bankCards/'+v.type+'.png'" alt="">
                        </el-card>
                    </el-col>
                </el-row>

                <div style="margin: 10px 0;overflow: hidden;">
                    <el-button class="btn-block" type="primary" plain :disabled="authLevel<=0" @click="addBankCard">+
                        添加银行卡
                    </el-button>
                </div>
            </div>

        </el-card>

        <!--添加银行卡-->
        <el-dialog title="添加银行卡" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
                <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm" size="medium" label-width="100px">
                    <el-form-item prop="bankName" label="开户行名称">
                        <el-select v-model="ruleForm.bankName" ref="select" filterable
                                   placeholder="请选择开户行,可搜索">
                            <el-option v-for="(v,k) in banks" :key="k" :label="v.name" :value="v.code">
                                <img class="select__icon" :src="'/static/assets/bankCards/'+v.code+'.png'"
                                     style="height:36px">
                                {{v.name}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="bankNumber" label="卡号">
                        <el-input type="text" v-model="ruleForm.bankNumber" :onChange="changeCard(ruleForm.bankNumber)" placeholder="卡号"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <!--<el-form-item prop="bankType" label="类型">-->
                    <!--<el-input type="text" v-model="ruleForm.bankType" placeholder="类型"-->
                    <!--autocomplete="off"></el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item prop="branch" label="分支行">
                        <el-input type="text" v-model="ruleForm.branch" placeholder="分支行"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addBankCardsubmit('ruleForm')">确 定</el-button>
  </span>
        </el-dialog>

    </div>
</template>

<script>
    import baseApi from '@/api/base'
    import banks from '@/common/banks/banks.json'
    import {mapState} from 'vuex'

    export default {
        name: "bank",
        data() {
            return {
                dialogVisible: false,
                ruleForm: {},
                banks: {},
                rules: {
                    bankName: [
                        {required: true, message: '请输入开户行名称', trigger: ['change', 'blur']},
                    ],
                    bankNumber: [
                        {required: true, message: '请输入卡号', trigger: ['change', 'blur']},
                    ],
                    // bankType: [
                    //     {required: true, message: '请选择类型', trigger: ['change', 'blur']},
                    // ],
                    branch: [
                        {required: true, message: '请输入分支行', trigger: ['change', 'blur']},
                    ],
                },
                bankList: [],
                bankCardColor: {
                    BJBANK: 'rgb(241, 117, 127)', //"北京银行"
                    BOHAIB: 'rgb(75, 77, 160)', //"博海银行"
                    CCB: 'rgb(65, 141, 199)', //"建设银行",
                    DLB: 'rgb(241, 117, 127)', //"大连银行"
                    CMB: 'rgb(250, 140, 141)', //"招商银行",
                    SHBANK: 'rgb(84, 99, 166)', //"上海银行",
                    SPABANK: 'rgb(234, 150, 106)', //"平安银行",
                    CMBC: 'rgb(51, 150, 254)', //"民生银行",
                    PSBC: 'rgb(78, 165, 120)', //"邮政储需银行",
                    ORBANK: 'rgb(224, 107, 89)', //"鄂尔多斯银行",
                    NBBANK: 'rgb(240, 165, 108)', //"宁波银行",
                    GDB: 'rgb(236, 77, 99)', //"广发银行",
                    ICBC: 'rgb(225, 90, 107)', //"工商银行",
                    ABC: 'rgb(64, 173, 150)', //"农业银行",
                    HXBANK: 'rgb(237, 126, 115)', //"华夏银行",
                    BOC: 'rgb(183, 75, 91)', //"中国银行",
                    COMM: 'rgb(75, 77, 160)', //"交通银行",
                    SPDB: 'rgb(50, 88, 153)', //"浦发银行",
                    CIB: 'rgb(51, 104, 158)', //"兴业银行",
                    CITIC: 'rgb(241, 117, 127)', //"中信银行",
                    shenzhen_bank: 'rgb(77, 167, 219)', //"深圳银行",
                    HZCB: 'rgb(58, 151, 220)', //"杭州银行",
                    NJCB: 'rgb(241, 117, 127)', //"南京银行",
                    CEB: 'rgb(144, 90, 166)', //"光大银行",
                    HUISHANG: 'rgb(241, 117, 127)', //"微商银行",
                    SHRCB: 'rgb(39, 107, 175)', //上海农商银行
                    OTHER: 'rgb(125, 137, 221)', //"未知银行"
                },
            }
        },
        computed: {
            ...mapState(['truename','authLevel']),
        },
        mounted() {
            this.getBankList();
            this.banks = banks;
        },
        updated(){
            this.$nextTick(function(){
                if(this.$refs.alltab){
                    console.log( this.$refs.alltab)
                }
            })
        },
        methods: {
            imgUrl(type) {

                return '/static/assets/bankCards/' + type + '.png'
            },
            changeCard(newVal){
                if(newVal) {

                    let val=newVal.replace(/\s/g,'').replace(/(.{4})/g,"$1 ");
                    console.log(val);
                }

            },
            // 添加银行卡
            addBankCard() {
                this.dialogVisible = true;
            },
            // 确认添加银行卡
            addBankCardsubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        try {
                            let data = {
                                bankName: this.banks[this.ruleForm.bankName].name,
                                bankNumber: this.ruleForm.bankNumber,
                                bankType: this.ruleForm.bankName, //类型
                                branch: this.ruleForm.branch  //分支行
                            };
                            let result = await baseApi.addBankcard(data);
                            this.getBankList();
                            this.dialogVisible = false;
                            this.$notify.success(this.$t('添加成功'));
                        } catch (e) {

                        }
                    }
                })

            },
            // 获取银行卡列表
            async getBankList() {
                let result = await baseApi.getBankList();
                this.bankList = result.data;
                try {
                    this.bankList.sort(function (a, b) { //根据默认卡排序
                        return b.isDefault - a.isDefault;
                    });

                } catch (e) {

                }

            },
            // 删除银行卡
            delBankcard(id) {
                if (!id) return;
                this.$confirm('确认删除此卡？')
                    .then(async () => {
                        try {
                            let result = await baseApi.delBankcard(id);
                            this.$notify.success(this.$t('删除成功'));
                            this.getBankList();
                        } catch (e) {

                        }
                    })
                    .catch(_ => {
                    });
            },
            // 设置默认银行卡
            defaultCard(id) {
                if (!id) return;
                this.$confirm('确定设置为默认卡？')
                    .then(async () => {
                        try {
                            let result = await baseApi.defaultCard(id);
                            this.$notify.success(this.$t('设置成功'));
                            this.getBankList();
                        } catch (e) {

                        }
                    })
                    .catch(_ => {
                    });
            },
            // 关闭弹框
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            // 跳转到认证界面
            goCdd() {
                this.$router.push('/account/cdd')
            }
        }
    }
</script>

<style lang="less" scoped>
    .select__icon {
        width: 20px;
        height: 20px !important;
        vertical-align: middle;
    }

    .cdd {
        .item {
            margin-bottom: 10px;
            .card_icon {
                float: left;
                margin-right: 28px;
                width: 80px;
                height: 80px;
                background-color: rgba(255, 255, 255, .8);
                border-radius: 50%;
                img {
                    width: 100%;
                }
            }
            .banksList:before {

            }
            .banksList {
                overflow: hidden;
                position: relative;
                margin-bottom: 10px;
                background-color: #C0C4CC;
                height: 150px;
                min-width: 330px;
                background-repeat: no-repeat;
                background-position: 75%;
                .btn_group {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    z-index: 99;
                }
                img.bankLogo {
                    overflow: auto;
                    margin: auto;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 15%;
                    opacity: 0.2;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

            }
            .card_title {
                margin: 15px 0 10px 0;
                font-size: 16px;
                font-weight: bold;
                color: #fff;
            }
            .card_prompt {
                color: #F2F6FC;
                font-size: 14px;
            }
            .card_button {
                margin-top: 30px;
            }
        }
    }
</style>