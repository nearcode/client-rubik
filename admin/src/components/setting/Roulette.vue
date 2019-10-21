<template>
    <div class="link">
        <el-dialog :title="'新增轮盘币种'" @close="resetForm('form')" :close-on-click-modal="false"
                   :visible.sync="editVisible"
                   width="600px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item prop="title" label="选择币种">
                    <el-select v-model="form.selectCoin" filterable clearable>
                        <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="URL" label="第一级">
                    <el-input v-model="form.levels.level1"></el-input>
                </el-form-item>
                <el-form-item prop="URL" label="第二级">
                    <el-input v-model="form.levels.level2"></el-input>
                </el-form-item>
                <el-form-item prop="URL" label="第三级">
                    <el-input v-model="form.levels.level3"></el-input>
                </el-form-item>
                <el-form-item prop="URL" label="第四级">
                    <el-input v-model="form.levels.level4"></el-input>
                </el-form-item>
                <el-form-item prop="URL" label="第五级">
                    <el-input v-model="form.levels.level5"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit" :loading="editBtnLoad">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>轮盘设置</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
                <!--<el-button icon="el-icon-download">导出</el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-button type="primary" @click="add()" :disabled="getPerms('sysSettings:roulette:edit')">新增</el-button>
            </div>

            <el-table :data="resultList" border v-loading="loading" class="table">
                <el-table-column prop="title" label="支持币种" sortable>
                    <template slot-scope="scope">
                        {{scope.row.coin}}
                    </template>
                </el-table-column>
                <el-table-column prop="levels" label="奖励数量">
                    <template slot-scope="scope">
                        {{scope.row.levels | toJoin}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="del(scope.row.coin)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    import _ from "lodash"

    export default {
        name: "linkSettings",
        data() {
            return {
                form: {
                    levels: {}
                },
                totalItems: 0,
                resultList: [],
                loading: false,
                selectCoin: '',
                datas: {},
                editBtnLoad: false,
                editVisible: false,

            }
        }, mounted() {
            // this.$store.commit('getInfo', this);
            this.getData();
        },
        methods: {
            getData() { //获取选中的币种
                this.$axios({
                        method: 'get',
                        url: '/roulette/coins'
                    }
                ).then(result => {
                    this.resultList = result.data;

                    let data = [];
                    let list=result.data;
                    for (let k in list) {
                        list[k].coin=k;
                        data.push(list[k])
                    }
                    this.resultList = data;
                    console.log(data)
                }).catch(error => {
                    if (error.data && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            // 重置表单
            resetForm(formName) {
                if (this.$refs[formName])
                    this.$nextTick(() => {
                        this.$refs[formName].resetFields();
                    })
            },
            // 新增
            add() {
                this.form={
                    levels: {}
                };
                this.editVisible = true;
            },
            // 确定操作
            onSubmit() {
                let levelsArray = [];
                for (let i in this.form.levels) {
                    if (this.form.levels[i]) {
                        levelsArray.push(this.form.levels[i])
                    }
                }
                if (!this.form.selectCoin || levelsArray.length != 5) return this.$message.error('参数不能为空');
                this.editBtnLoad=true;
                this.$axios({
                        method: 'post',
                        url: '/admin/setRoulettesCoin',
                        data: {
                            action: 'add',
                            coin: this.form.selectCoin,
                            levels: levelsArray
                        }
                    }
                ).then(result => {
                    this.editBtnLoad=false;
                    this.getData();
                    this.$message.success('保存成功');
                    this.editVisible = false;
                    resetForm('form')
                }).catch(error => {
                    this.editBtnLoad=false;
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            del(coin) {
                this.$confirm('你确定删除吗吗?', '提示', {}).then(() => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/setRoulettesCoin',
                        data: {
                            action: 'del',
                            coin: coin
                        }
                    }).then(result => {
                        this.getData();
                        this.$message.success('删除成功')
                    }).catch(error => {
                        this.$message.error(this.$t(error.data.message));
                    })
                }).catch(() => {

                })
            }
        }
    }
</script>

<style scoped>

</style>
