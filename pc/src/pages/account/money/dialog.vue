<template>
    <div class="dialogForm">
        <!-- 提现弹出框 -->
        <el-dialog :title="dialogTitle" v-if="showDialog" :visible.sync="showDialog" :close-on-click-modal="false"
                   @close="closeDialog('info')" width="600px">


            <!--添加地址-->
            <el-dialog :close-on-click-modal="false" width="600px"
                       :title="(addressInfo.dialogType=='add'?'添加新':'修改')+'地址'" @close="closeDialog('addressForm')"
                       :visible.sync="showAppendDialog"
                       append-to-body>
                <!--新增地址-->
                <el-form ref="addressForm" :rules="addressRule" :model="addressInfo" label-width="130px">
                    <el-form-item :label="'提现'+coin+'地址'" prop="address" required>
                        <el-input v-model="addressInfo.address" placeholder="请输入提现地址"></el-input>
                    </el-form-item>

                    <el-form-item label="地址备注" prop="remark">
                        <el-input v-model="addressInfo.remark" placeholder="请输入地址备注"></el-input>
                    </el-form-item>
                    <!--验证码-->
                    <el-form-item prop="code" label="验证码">
                        <el-input v-model="addressInfo.code" tabindex="3" placeholder="请输入验证码">
                            <el-button slot="append" v-if="!codeTime" @click="getCode">获取验证码</el-button>
                            <el-button slot="append" v-else>{{codeTime}}秒后可重发</el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
                <!--操作-->
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showAppendDialog=false">取消</el-button>
                    <el-button type="primary" @click="addressSubmit('addressForm')">确定</el-button>
                </div>
            </el-dialog>

            <!--表单-->
            <el-form ref="info" :model="info" :rules="rules" label-width="80px">
                <!--可用余额-->
                <el-form-item label="可用余额" prop="available">
                    <div>
                        <span class="font_green" style="cursor: pointer" @click="setAvailable">{{(available || 0) |autoNumber}}</span>
                        {{coin}}
                    </div>
                </el-form-item>
                <!--提币地址-->
                <el-form-item label="提币地址" prop="address" class="address">
                    <el-select :loading="info.selectLoading" v-model="info.address"
                               @change="selectTrigger(info.address)"
                               :placeholder="addressList.length>0?'请选择':'您尚未设置,点击添加提币地址'"
                               style="width: 100%">
                        <el-option v-for="item in addressList" style="padding: 0 10px;" :key="item._id"
                                   :label="(item.remark || '--')+' / '+item.address"
                                   :value="item.address">
                            <!--<el-row style="font-size: 12px">-->
                            <!--<el-col :span="6">{{ item | getDictValue('remark')}}</el-col>-->
                            <!--<el-col :span="14">{{item | getDictValue('address') }}</el-col>-->
                            <!--<el-col :span="4" align="right" class="operation">-->
                            <!--<el-button-->
                            <!--size="mini"-->
                            <!--@click.stop="delAddress(item._id)"-->
                            <!--icon="fa fa-trash-o"-->
                            <!--style="padding:3px 5px!important;"-->
                            <!--&gt;</el-button>-->
                            <!--<el-button-->
                            <!--size="mini"-->
                            <!--icon="fa fa-edit"-->
                            <!--@click.stop="editAddress(item)"-->
                            <!--style="margin-left: 0;padding:3px 5px!important;"-->
                            <!--&gt;</el-button>-->
                            <!--</el-col>-->
                            <!--</el-row>-->

                            <table border="0" width="100%" class="address_table" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-size: 12px;color:#303133;" width="100">
                                        {{ item | getDictValue('remark')}}
                                    </td>
                                    <td style="font-size: 12px;color:#909399;">{{item | getDictValue('address') }}</td>
                                    <td width="50">
                                        <el-button size="mini" @click.stop="delAddress(item._id)" icon="fa fa-trash-o"
                                                   style="padding:3px 5px!important;">

                                        </el-button>

                                        <el-button size="mini" icon="fa fa-edit" @click.stop="editAddress(item)"
                                                   style="margin-left: 0;padding:3px 5px!important;">

                                        </el-button>
                                    </td>
                                </tr>
                            </table>

                        </el-option>

                        <!--添加地址-->
                        <el-option value="add" key="add" label="add" align="center">
                            添加提币地址
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--数量-->
                <el-form-item label="提现数量" prop="amount">
                    <el-input type="number" v-model="info.amount"></el-input>
                </el-form-item>

                <!--实际到账-->
                <el-form-item label="实际到账" prop="toUser">
                    <el-input
                            :value="(info.amount-coins[coin].withdrawalFee>0?info.amount-coins[coin].withdrawalFee:0)|autoFixed"
                            disabled></el-input>
                </el-form-item>
                <!--佣金-->
                <el-form-item label="佣金">
                    <div>
                        <span class="font_red">{{coins[coin].withdrawalFee}}</span>
                        {{coins[coin].isEth && coins[coin].feeCoin?coins[coin].feeCoin:coin}}
                    </div>
                </el-form-item>
            </el-form>
            <!--底部-->
            <span slot="footer" class="dialog-footer">
            <!--取消-->
        <el-button @click="showDialog = false">取 消</el-button>
                <!--确定-->
        <el-button type="primary" @click="submitForm('info')" :loading="btnLoading">确 定</el-button>
        </span>
        </el-dialog>
    </div>


</template>

<script>
    import baseApi from "@/api/base"
    import walletApi from "@/api/wallet"
    import {mapState} from "vuex"
    import _ from "lodash"

    export default {
        name: "UpDateCoin",
        props: [],//用来接收父组件传给子组件的数据
        data() {
            let validatePass = (rule, value, callback) => {
                if (value == 0) {
                    callback(new Error('数量不能为0'));
                } else if (value < this.coins[this.coin].withdrawalLimit) {
                    callback(new Error(this.coin + "提现最低不能小于" + this.coins[this.coin].withdrawalLimit));
                } else {
                    callback();
                }

            };

            return {
                showDialog: false, //提现弹框
                showAppendDialog: false, //添加新地址弹框
                callback: '', //回调函数
                cancelCall: '',
                dialogType: '',//弹框类型
                info: {
                    selectLoading: false
                }, //提现表单
                addressInfo: {},
                toUserInfo: {}, //用户信息
                addressList: [], //地址列表
                selectEd: null, //获取选中地址
                coin: '', //币种
                codeTime: null,
                btnLoading: false,
                available: null, //币种余额
                addressRule: {
                    address: [
                        {required: true, message: '提币地址不能为空', trigger: ['change', 'blur']},
                    ],
                    code: [
                        {required: true, message: '验证码不能为空', trigger: ['change', 'blur']},
                    ],
                },
                rules: {
                    address: [
                        {required: true, message: '提币地址不能为空', trigger: ['change', 'blur']},
                    ],
                    amount: [
                        {required: true, message: '数量不能为空', trigger: ['change', 'blur']},
                        {validator: validatePass,trigger: ['change', 'blur']},
                    ]
                }
            }
        },
        computed: {
            ...mapState(['coins', 'markets']),
            dialogTitle() {
                let title = null;
                if (this.dialogType == 'withdraw') {
                    title = this.coin + ' 提现'
                }
                return title
            }
        },
        methods: {
            setAvailable() {
                this.$set(this.info, 'amount', this.available.toFixed(8));
            },
            async getBalance() {
                if (!this.coin) return;
                this.available = null;

                try {
                    let result = await baseApi.getBalance(this.coin);
                    this.available = result.data.available;
                } catch (e) {

                }
            },
            // 获取地址列表
            async getAddressList() {
                if (!this.coin) return;
                this.$set(this.info, 'selectLoading', true);
                
                try {
                     
                    let result = await walletApi.getWithdrawAddress(this.coin);
                    this.$set(this.info, 'selectLoading', false);

                    this.addressList = result.data || [];
                    if (this.addressList.length === 0) {
                        this.$set(this.info, 'address', null);
                    } else if (this.addressList.length > 0) {
                        this.$set(this.info, 'address', result.data[0].address)
                    }
                } catch (e) {
                    this.$set(this.info, 'selectLoading', false);
                }
            },
            // 删除地址
            delAddress(id) {
                if (!id) return;
                this.$confirm('你确定删除该地址吗？', '提示').then(async () => {
                    let data = {
                        id
                    };
                    try {
                        let result = await walletApi.delWithdrawAddress(data);
                        this.getAddressList();
                        this.$notify.success(this.$t('删除成功'));
                    } catch (e) {

                    }
                })
            },
            // 修改地址
            editAddress(item) {
                if (!item) return;
                this.addressInfo = _.cloneDeep(item);
                this.addressInfo.dialogType = 'edit';
                this.showAppendDialog = true;
                console.log(item)
            },

            // 验证码定时器
            endTime() {
                this.codeTime = 59;
                let timers = setInterval(() => {
                    if (this.codeTime > 0 && this.codeTime < 60) {
                        this.codeTime--;
                    } else {
                        clearInterval(timers);
                    }
                }, 1000);
            },
            // 获取验证码
            async getCode() {
                try {
                    let result = await baseApi.getAccountCode();
                    this.$notify.success(this.$t('CODE_HAS_SEND'));
                    this.endTime();
                } catch (e) {
                    console.log(e)
                }
            },
            // 关闭弹窗重置表单
            closeDialog(formName) {
                this.clearUSerInfo();
                if (formName) {
                    this.$nextTick(() => {
                        if (this.$refs[formName]) {
                            this.$refs[formName].resetFields(); //重置表单
                            this.$refs[formName].clearValidate();//重置验证信息
                        }
                    })
                }
                // if(formName) this.resetForm(this,formName);
            },
            // 关闭清空
            clearUSerInfo() {
                this.$set(this.toUserInfo, 'account', '');
                this.toUserInfo = {};
            },
            // 获取选中地址
            selectTrigger(val) {
                // let choosenItem = this.addressList.filter(item => item.address === val)[0];
                // console.log(choosenItem)
                if (val == 'add') {
                    this.info.address = null;
                    this.showAppendDialog = true;
                    this.addressInfo.dialogType = 'add';
                }
            },
            // 修改提现地址
            async editWithdrawAddress(data) {
                try {
                    let result = await walletApi.editWithdrawAddress(data);
                    this.showAppendDialog = false;
                    this.getAddressList();
                    this.$notify.success(this.$t('修改成功'));
                } catch (e) {

                }
            },
            // 添加提现地址
            async addWithdrawAddress(data) {
                try {
                    let result = await walletApi.addWithdrawAddress(data);
                    this.showAppendDialog = false;
                    this.getAddressList();
                    this.$notify.success(this.$t('添加成功'));
                } catch (e) {

                }
            },
            // 确定设置地址
            async addressSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {

                        let data = {
                            address: this.addressInfo.address,
                            code: this.addressInfo.code,
                            remark: this.addressInfo.remark,
                            coin: this.coin
                        };

                        if (this.addressInfo.dialogType === 'add') {

                            this.addWithdrawAddress(data);

                        } else if (this.addressInfo.dialogType === 'edit') {
                            data.id = this.addressInfo._id;

                            this.editWithdrawAddress(data);
                        }

                    } else {
                        return false;
                    }
                });
            },
            //验证通过就执行
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.info.coin = this.coin;
                        this.$emit('upData', this.info);
                        this.callback && this.callback();
                    } else {
                        return false;
                    }
                });
            },
            // 显示
            show(datas) {
                this.info = {};
                this.$nextTick(() => {
                    this.addressList = [];  //切换时候清空地址列表
                    this.dialogType = datas.dialogType;
                    this.coin = datas.coin;
                    if (datas.info) this.info = datas.info;
                    this.getAddressList();
                    this.getBalance();
                    this.showDialog = true;
                });

                this.callback = datas.callback;
                this.cancelCall = datas.cancel;

            },
            // 取消
            cancel() {
                this.showDialog = false;
            }
        }
    }
</script>

<style lang="less" scoped>
    .address /deep/ .el-select-dropdown__item {
        padding: 0 5px !important;

    }

    .address {
        .address_table {
            border-collapse: collapse;
        }
    }
</style>
