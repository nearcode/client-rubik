<template>
    <div>
        <div class="plugins-tips">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="币种">
                    <el-select v-model="form.selectCoin" placeholder="请选择">
                        <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="resultList.balances" show-summary border class="table"
                  v-loading="loading" ref="multipleTable">
            <el-table-column prop="coin" label="币种">
                <template slot-scope="scope">
                    {{scope.$index}}
                </template>
            </el-table-column>
            <el-table-column label="余额">
                <template slot-scope="scope">
                    {{scope.row.allBalance | autoFixed}}
                    <!--<span>{{// scope.row.date | toTimeStr}}</span>-->
                </template>
            </el-table-column>
            <el-table-column label="冻结">
                <template slot-scope="scope">
                    <span v-text="scope.row.lockBalance"></span>
                </template>
            </el-table-column>
            <el-table-column label="可用">
                <template slot-scope="scope">
                    <span v-text="scope.row.balance"></span>
                </template>
            </el-table-column>
            <el-table-column label="私募冻结" align="center">
                <template slot-scope="scope">
                    <!--<span>{{scope.row.amount | autoFixed}}</span>-->
                </template>
            </el-table-column>
            <el-table-column label="提现中" prop="balance" align="center">
            </el-table-column>
            <el-table-column label="代币锁仓" prop="balance" align="center">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "UserAssets",
        data(){
            return{
                form:{},
                resultList:[]
            }
        }
    }
</script>

<style scoped>

</style>
