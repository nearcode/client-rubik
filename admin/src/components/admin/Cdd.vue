<template>
    <div class="info">
        <!--图片预览-->
        <preview ref="preview2" :photo="photo"></preview>
        <!--审核弹框-->

        <el-dialog :title="form.truename+' 信息'" :close-on-click-modal="false" :visible.sync="outerVisible"
                   width="600px">
            <el-form ref="form" :model="form" label-width="120px">
                <!--用户ID-->
                <el-form-item label="用户ID:">
                    <span>{{form |getDictValue('uid')}}</span>
                </el-form-item>
                <!--真实姓名-->
                <el-form-item label="真实姓名">
                    <el-input v-model="form.truename"></el-input>
                </el-form-item>
                <!--证件号码-->
                <el-form-item label="证件号码">
                    <el-input v-model="form.cardNumber"></el-input>
                </el-form-item>
                <!--企业名称-->
                <el-form-item label="企业名称:" v-if="form.type==3">
                    <span>{{form |getDictValue('businessName')}}</span>
                </el-form-item>
                 <!--企业类型-->
                <el-form-item label="类型:" v-if="form.type==3">
                    <span>{{businessType[form.businessType]}}</span>
                </el-form-item>
                <!--企业营业执照号-->
                <el-form-item label="企业营业执照号:" v-if="form.type==3">
                    <span>{{form |getDictValue('businessNumber')}}</span>
                </el-form-item>
                <!--企业地址-->
                <el-form-item label="企业电话:" v-if="form.type==3">
                    <span>{{form |getDictValue('businessPhone')}}</span>
                </el-form-item>
                 <!--企业电话-->
                <el-form-item label="企业地址:" v-if="form.type==3">
                    <span>{{form |getDictValue('businessAddress')}}</span>
                </el-form-item>
             
                <!--企业LOGO-->
                <el-form-item label="企业LOGO:" v-if="form.type==3">
                    <div class="certification-img" style="text-align: left">
                        <div class="pre-img">
                            <img :src="form.businessLogo" v-if="form.businessLogo"
                                 @click="showSfz(form.businessLogo)" alt="企业LOGO">
                        </div>
                    </div>
                </el-form-item>
                <!--企业营业执照-->
                <el-form-item label="企业营业执照:" v-if="form.type==3">
                    <div class="certification-img"  style="text-align: left">
                        <div class="pre-img">
                            <img :src="form.businessLicense" v-if="form.businessLicense"
                                 @click="showSfz(form.businessLicense)" alt="企业营业执照">
                        </div>
                    </div>
                </el-form-item>
                   <!--店铺照-->
                <el-form-item label="店铺照:" v-if="form.type==3">
                    <div class="certification-img" style="text-align: left">
                        <div class="pre-img">
                            <img :src="form.storeImg " v-if="form.storeImg "
                                 @click="showSfz(form.storeImg )" alt="店铺照">
                        </div>
                    </div>
                </el-form-item>
                   <!--店铺人全照-->
                <el-form-item label="店铺人前照:" v-if="form.type==3">
                    <div class="certification-img" style="text-align: left">
                        <div class="pre-img">
                            <img :src="form.storeVpersonImg" v-if="form.storeVpersonImg"
                                 @click="showSfz(form.storeVpersonImg)" alt="店铺人全照">
                        </div>
                    </div>
                </el-form-item>
                <!--证件-->
                <el-form-item label="证件" v-if="form.type!=1">
                    <el-row :gutter="20" style="margin-bottom: 0">
                        <el-col :span="6">
                            <div class="certification-img">
                                <div class="pre-img">
                                    <img :src="form.frontCard" v-if="form.frontCard"
                                         @click="showSfz(form.frontCard)" alt="身份证正面">
                                </div>
                                <p>身份证正面</p>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="certification-img">
                                <div class="pre-img">
                                    <img :src="form.backCard" v-if="form.backCard"
                                         @click="showSfz(form.backCard)" alt="身份证反面">
                                </div>
                                <p>身份证反面</p>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="certification-img">
                                <div class="pre-img">
                                    <img :src="form.handCard" v-if="form.handCard"
                                         @click="showSfz(form.handCard)" alt="手持签证照">
                                </div>
                                <p>手持签证照</p>
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="拒绝原因" v-if="form&&form.reply && form.authLevel!=3">
                    <span class="red">{{form.reply}}</span>
                </el-form-item>
            </el-form>
            <!--拒绝理由-->
            <el-dialog width="600px" title="拒绝理由 (选择或自定义理由)" :visible.sync="innerVisible" append-to-body>
                <el-form ref="data" :model="data" label-width="100px">
                    <el-form-item label="请选择理由">
                        <el-select v-model="data.reply" placeholder="请选择">
                            <el-option :value="item" v-for="item in NoReason" :key="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="自定义理由">
                        <el-input type="textarea" v-model="data.reply"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible=false">取消</el-button>
                    <el-button type="primary" @click="reasonSubmit(form._id,form.uid)" :loading="reasonBtn">确定
                    </el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" v-if="form.dialogType == 'edit'" @click="edit(form)">修改</el-button>
               <span v-else>
                    <el-button @click="pass(form._id,form.uid)">通过</el-button>
                <el-button type="primary" @click="Refused">拒绝</el-button>
               </span>
                
            </div>
        </el-dialog>


        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!--<el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>-->
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>实名认证</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-form :inline="true" :model="formInline" @keyup.enter.native="search" class="demo-form-inline">
                    <el-form-item label="认证状态">
                        <el-select v-model="formInline.certified" clearable placeholder="认证状态">
                            <el-option v-for="(v,k) in statusList" :label="v.text" :key="k"
                                       :value="v.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="提交时间">
                        <el-col :span="11">
                            <el-date-picker
                                v-model="formInline.startTime"
                                type="datetime"
                                value-format="timestamp"
                                placeholder="选择开始时间" style="width: 100%;">
                            </el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker
                                v-model="formInline.endTime"
                                type="datetime"
                                value-format="timestamp"
                                placeholder="选择结束时间" style="width: 100%;">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>

                    <el-form-item>
                        <el-input placeholder="可搜索UID/邮箱/手机号码" clearable v-model="formInline.findText">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
                <el-table-column
                    label="用户"
                    width="180">
                    <template slot-scope="scope">
                        {{scope.row.uid}}
                    </template>
                </el-table-column>
                <el-table-column label="实名" prop="truename" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.truename | noData}}
                    </template>
                </el-table-column>
                <el-table-column label="认证类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type && authTypeList[scope.row.type]"
                              :style="{'color':authTypeList[scope.row.type].color}">{{authTypeList[scope.row.type].text}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="v.type" v-for="(v,k) in statusList" :key="k"
                                v-if="scope.row.result==v.value">
                            {{v.text}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="申请时间" min-width="180">
                    <template slot-scope="scope">
                        {{scope.row.create | toTimeStr}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="getPerms('sys:realname:audit')" @click="handleEdit(scope.row)">审核
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" :disabled="getPerms('sys:realname:edit')" @click="handleEdit(scope.row,'edit')">修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination" v-if="totalItems>1">
                <el-pagination background @current-change="handleCurrentChange" :page-size="20"
                               layout="prev, pager, next"
                               :total="totalItems">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import preview from "src/components/common/PreviewPicture"
    import adminApi from "@/api/admin"
    import admin from "../../api/admin";

    export default {
        name: "Cdd",
        data() {
            return {
                photo: '',
                loading: false,
                formInline: {
                   
                },
                form: {
                    credentials: {
                        handImg: '',
                        idCardA: '',
                        idCardB: ''
                    }
                },
                reasonBtn: false,//拒绝按钮置灰
                sfz2: false,
                currentPage: 1,
                resultList: [],
                totalItems: '',
                outerVisible: false,
                innerVisible: false,
                data: {}, //实名认证等级 1绑定了身分证号或护照号 2.上传身分证或护照照片 3.视频验证过
                NoReason: ['照片不清晰', '身份信息不完整', '非本人', '不允许涂改', '手持纸张需写上' + localStorage.webTitle + '和日期'],
                statusList: [
                    // {text: '认证通过', value: 1, type: ''},
                    // {text: '申请认证', value: 0, type: 'warning'},
                    // {text: '未通过', value: -1, type: 'danger'},

                    {text: '未提交', value: 0, type: 'info'},
                    {text: '审核中', value: 1, type: 'warning'},
                    {text: '未通过', value: 2, type: 'danger'},
                    {text: '已通过', value: 3, type: 'success'},
                ],
                authTypeList: {
                    1: {type: 1, text: '初级', color: '#67C23A'},
                    2: {type: 2, text: '高级', color: '#409EFF'},
                    3: {type: 3, text: '企业', color: '#E6A23C'},
                },
                businessType:{
                    1:'个体户',
                    2:'公司'
                }
            }
        },

        mounted() {
            this.getData();
        },
        methods: {
            async search() {
                // if (!this.formInline.findText && !this.formInline.startTime) return;
                // this.loading = true;
                this.getData();
                // try {
                //     let result = await adminApi.searchUser({
                //         text: this.formInline.findText,
                //         certified: this.formInline.certified, //1认证通过，0未认证，-1认证未通过 2企业认证
                //         p: this.currentPage,
                //         startTime: this.formInline.startTime && this.formInline.startTime / 1000,
                //         endTime: this.formInline.endTime && this.formInline.endTime / 1000
                //     });
                //     this.loading = false;
                //     this.resultList = result.data;
                //     this.totalItems = result.count;
                // } catch (e) {

                // }
            },
            showSfz(url) {
                if (!url) return;
                this.photo = url;
                this.$refs.preview2.show()
            }
            ,
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            }
            ,
            async getData() {
                this.loading = true;
                let p = this.currentPage;
                try {
                    let result = await adminApi.getUsersByAuthLevel({
                        text: this.formInline.findText,
                        certified: this.formInline.certified, //1认证通过，0未认证，-1认证未通过 2企业认证
                        p: this.currentPage,
                        startTime: this.formInline.startTime && this.formInline.startTime / 1000,
                        endTime: this.formInline.endTime && this.formInline.endTime / 1000
                    });
                    this.loading = false;
                    this.resultList = result.data;
                    this.totalItems = result.count;
                } catch (e) {

                }
            },
            // 审核弹框
            handleEdit(item,type) {
                if (!item) return;
                this.form = item;
                this.$set(this.form,'dialogType',type);
                this.outerVisible = true;
            },
            // 通过审核
            pass(_id, uid) {
                if (!_id || !uid) return;
                this.$confirm('你确定通过审核吗？')
                    .then(async _ => {
                        let data = {
                            id: _id,
                            result: 'pass',
                            uid: uid
                        };
                        try {
                            let result = await adminApi.setCertificate(data);
                            this.outerVisible = false;
                            this.getData();
                            this.$message.success('审核通过');
                        } catch (e) {

                        }
                    })
                    .catch(_ => {
                    });
            },
            // 拒绝审核弹框
            Refused() {
                this.innerVisible = true;
            },
            // 修改按钮
            edit(item) {
                if (!item) return;
                this.$confirm('你确定修改吗？')
                    .then(async _ => {
                        try {
                            let result = await adminApi.realnameEdit({
                                uid:item.uid,
                                type:item.type,
                                truename:item.truename,
                                cardNumber:item.cardNumber
                            });
                            this.outerVisible = false;
                            this.getData();
                            this.$message.success('修改成功');
                        } catch (e) {

                        }
                    })
                    .catch(_ => {
                    });
            },
            // 拒绝确认按钮
            async reasonSubmit(_id, uid) {
                if (!_id || !uid) return;
                if (!this.data.reply) return this.$message.warning('理由不能为空，请选择或自定义理由');
                this.reasonBtn = true;

                let data = {
                    id: _id,
                    result: 'fail',
                    uid: uid,
                    reply: this.data.reply
                };
                try {
                    let result = await adminApi.setCertificate(data);
                    this.outerVisible = false;
                    this.getData();
                    this.innerVisible = false;
                    this.outerVisible = false;
                    this.reasonBtn = false;
                    this.data = {};
                    this.$message.success('操作成功');
                } catch (e) {

                }
            }
        },
        components: {
            preview
        }
    }
</script>

<style scoped>
    .line {
        text-align: center;
    }

    .pre-img {
        width: 80px;
        height: 80px;
        overflow: hidden;
        display: inline-block;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }

    .pre-img img {
        width: 100%;
        height: 100%;
    }

    .certification-img {
        text-align: center;

    }

    .certification-img .pre-img img {
        cursor: zoom-in;
    }


</style>
