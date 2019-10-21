<template>

    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>推荐奖励</el-breadcrumb-item>
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
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="分红" name="stocks">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="添加级别">
                            <el-input v-model="form.levels[k]" :placeholder="'第'+(k+1)+'级'" class="addLeves" v-for="(v,k) in form.levels" :key="k">
                                <el-button slot="append" icon="el-icon-delete" @click="del(form.levels[k],'form')"></el-button>
                            </el-input>

                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :loading="btnLoading" @click="onSubmit('stocks')" :disabled="getPerms('sysSettings:recommended:edit')">保存</el-button>
                            <el-button @click="addLevel('form')" >添加级别</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="送币" name="coins">
                    <el-form ref="data" :model="data" label-width="80px">
                        <el-form-item label="添加级别">
                            <el-input v-model="data.levels[i]" :placeholder="'第'+(i+1)+'级'" class="addLeves" v-for="(v,i) in data.levels" :key="i">
                                <el-button slot="append" icon="el-icon-delete" @click="del(data.levels[i],'data')"></el-button>
                            </el-input>

                        </el-form-item>
                        <el-form-item label="当日人数奖励限制">
                            <el-input v-model="data.todayMax"></el-input>
                        </el-form-item>
                        <el-form-item label="奖励币种">
                            <el-select v-model="data.coin" filterable clearable placeholder="请选择币种">
                                <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :loading="btnLoading" @click="onSubmit('coins')" :disabled="getPerms('sysSettings:recommended:edit')">保存</el-button>
                            <el-button @click="addLevel('data')" >添加级别</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Recommended",
        data() {
            return {
                btnLoading:false,
                form: {
                    levels:  [],
                },
                data: {
                    levels:  [],
                    todayMax:  '',
                    coin: '',
                },
                activeName: 'stocks'
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(){
                this.$store.commit('getInfo');
                let loop = () => {
                    if (this.$store.state.referrers) {
                        this.form= {
                            levels: this.$store.state.referrers.stocks.level || [],
                        };
                        this.data= {
                            levels: this.$store.state.referrers.coins.level || [],
                            todayMax: this.$store.state.referrers.coins.todayMax || '',
                            coin: this.$store.state.referrers.coins.coin || '',
                        };
                        return
                    }
                    setTimeout(loop, 500)
                };
                setTimeout(loop, 500);
            },
            handleClick(tab, event) {
                this.getData();
                console.log(tab, event);
            },
            // 添加域名
            addLevel(type) {
                this[type].levels.push('');
            },
            onSubmit(type) {
                this.btnLoading=true;
                let levels = [];
                let data = {};
                let result = type == 'stocks' ? this.form.levels : this.data.levels;
                for (let i in result) {
                    levels.push(result[i])
                }
                data.action = type;
                data.level = levels;
                if (type == 'coins') {
                    data.coin = this.data.coin;
                    data.todayMax = this.data.todayMax;
                }
                this.$axios({
                        method: 'post',
                        url: '/admin/addReferrersBonusLevel',
                        data:data
                    }
                ).then(result => {
                    this.btnLoading=false;
                    this.$store.commit('getInfo');
                    this.$message.success('保存成功');
                }).catch(error => {
                    this.btnLoading=false;
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            del(item,type){
                let inx=this[type].levels.indexOf(item);
                this[type].levels.splice(inx,1);
            }
        }
    }
</script>

<style scoped>
    .addLeves {
        margin-bottom: 5px;
    }

</style>
