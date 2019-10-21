<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>赠币工具</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="130px">
                <el-form-item label="业务类型">
                    <span>赠币转账</span>
                </el-form-item>
                <el-form-item label="业务场景">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option label="红包活动" value="shanghai"></el-option>
                        <el-option label="其他" value="beijing"></el-option>
                        <el-option label="金币兑换" value="beijing"></el-option>
                        <el-option label="注册" value="beijing"></el-option>
                        <el-option label="实名认证" value="beijing"></el-option>
                        <el-option label="邀请" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="币种">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option label="红包活动" value="shanghai"></el-option>
                        <el-option label="其他" value="beijing"></el-option>
                        <el-option label="金币兑换" value="beijing"></el-option>
                        <el-option label="注册" value="beijing"></el-option>
                        <el-option label="实名认证" value="beijing"></el-option>
                        <el-option label="邀请" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联用户和数量">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">导入模板</el-button>
                    <el-button>确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
            <script>
                export default {
                    data() {
                        return {
                            form: {
                                name: '',
                                region: '',
                                date1: '',
                                date2: '',
                                delivery: false,
                                type: [],
                                resource: '',
                                desc: ''
                            }
                        }
                    },
                    methods: {
                        onSubmit() {
                            console.log('submit!');
                        }
                    }
                }
            </script>
<style scoped>

</style>
