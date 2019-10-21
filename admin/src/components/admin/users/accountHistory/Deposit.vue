<template>
    <div>
        <el-table :data="resultList.depositHistory" show-summary border class="table"
                  v-loading="loading" ref="multipleTable">
            <el-table-column prop="coin" label="充值单号">
                <template slot-scope="scope">
                    {{scope.$index}}
                </template>
            </el-table-column>
            <el-table-column label="充值时间">
                <template slot-scope="scope">
                    {{scope.row.date | toTimeStr}}
                </template>
            </el-table-column>
            <el-table-column label="充值币种">
                <template slot-scope="scope">
                    <span v-text="scope.row.lockBalance"></span>
                </template>
            </el-table-column>
            <el-table-column label="充值金额">
                <template slot-scope="scope">
                    <span v-text="scope.row.balance"></span>
                </template>
            </el-table-column>
            <el-table-column label="TXID" align="center">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column label="到账地址" prop="balance" align="center">
            </el-table-column>
            <el-table-column label="状态" prop="balance" align="center">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "Deposit"
    }
</script>

<style scoped>

</style>
