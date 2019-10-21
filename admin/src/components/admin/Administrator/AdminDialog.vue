<template>
    <!-- 编辑弹出框 -->
    <el-dialog :title="(dialogType=='add'?'添加':'修改')+'管理'" v-if="showDialog" :visible.sync="showDialog"  :close-on-click-modal="false" @close="closeDialog('info')"
               width="600px">
        <el-form ref="info" :model="info" :rules="rules" label-width="80px">
            <el-form-item label="对方账户" prop="toUser" v-if="dialogType!='edit'">
                <el-input v-model="info.toUser"></el-input>
                 <span style="" v-if="info.userAccount">{{info.userAccount}}</span>
            </el-form-item>
            <el-form-item label="设置级别" prop="level">
                <el-select v-model="info.level">
                    <el-option :key="k" :label="v.name" v-for="(v,k) in adminRoleList" :value="v.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('info')">确 定</el-button>
        </span>
    </el-dialog>

</template>

<script>
    import {mapState} from "vuex"

    export default {
        name: "UpDateCoin",
        props: [],//用来接收父组件传给子组件的数据
        data() {

            let validCaptcha = (rule, value, callback) => {
                 this.info.userAccount="";
                if (!value) {
                    return callback(new Error("账号不能为空"));
                }
        
                this.getUserInfo(this, value, (item) => { //获取单个用户信息
                this.$set(this.info,"userAccount",item.mobile || item.email)
                       return callback();
                })
            };
            return {
                showDialog: false,
                callback: '', //回调函数
                cancelCall: '',
                dialogType: '',//弹框类型
                info: {
                    userAccount:''
                },
                rules: {
                    toUser: [
                        {validator: validCaptcha, trigger: ["change",'blur'] }
                    ],
                    level: [
                        {required: true, message: '请选择等级', trigger: ['change','blur']},
                    ]
                }
            }
        },
          computed: {
            ... mapState(['adminRoleList']),
        },
        methods: {
            // 关闭弹窗重置表单
            closeDialog(formName) {
                // if(formName) this.resetForm(this,formName);
            },
            //验证通过就执行
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('upData', this.info);
                        this.callback && this.callback();
                    } else {
                        return false;
                    }
                });
            },
            // 初始化
            init(parent) {
                this.info = {};
                this.parent = parent;
            },
            // 显示
            show(datas) {
                this.info = {};
                this.$nextTick(() => {
                    this.dialogType = datas.dialogType;
                    if (datas.info) {
                        this.info = datas.info;
                        this.$set(this.info,'level',Number(datas.info.level))
                    };
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

<style scoped>

</style>
