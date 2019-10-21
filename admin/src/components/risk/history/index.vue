<template>
    <div class="coins">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>风控管理</el-breadcrumb-item>
                <el-breadcrumb-item>执行记录</el-breadcrumb-item>
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
           <el-table v-loading="loading"
                      :data="resultList"
                      border class="table">
                <el-table-column prop="chineseName" label="时间" sortable>
                </el-table-column>
                <el-table-column prop="alias" label="类型">
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="!scope.row.disable">开启</el-tag>
                        <el-tag type="danger" v-if="scope.row.disable">禁用</el-tag>
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
    import adminApi from "@/api/admin"

    export default {
        name: "history",
        data() {
            return {
                resultList: [],
                totalItems: 0,
                currentPage:1,
                loading: true,
                search: '',
                datas: {},
                editVisible: false,
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            async searchCoin(coin){
                if(!coin) return;
                try{
                    let result = await adminApi.searchCoin({coin});
                    this.resultList = result.data;
                    this.totalItems = result.count;
                }catch(e){

                }
            },
              // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            }, 
            // 把数据赋值过来
            setData(data) {
                this.datas = data
            },
            // 新增币种
            addCoin() {
                let layer = this.$refs.UpDateCoinDialog;
                layer.init(this);
                layer.show({
                    dialogType: '添加',
                    info: '',
                    callback: this.addSubmit
                })
            },
            // 获取数据
            async getData() {
                let data={
                    p:this.currentPage
                }
                try {
                    let result = await adminApi.getCoins(data);
                    // let resultList = [];
                    // let data = result.data;
                    // for (let i in data) {
                    //     // data[i].coin = i;
                    //     resultList.push(data[i])
                    // }
                    this.loading = false;
                    this.resultList = result.data;
                    this.totalItems = result.count;
                    
                } catch (e) {

                }
            },
         
            async addSubmit() {
                this.datas['coin']=this.datas.alias;
                try {
                    let result = await adminApi.addCoin({
                          data:this.datas
                    });
                    this.getData();
                    this.$message.success('设置成功');
                    this.$refs.UpDateCoinDialog.cancel();
                    this.$store.commit("getInfo");
                } catch (e) {

                }
            },
            async editSubmit() {
                this.datas['coin']=this.datas.alias;

                try {
                    let result = await adminApi.editCoin({
                        data:this.datas
                    });
                    this.getData();
                    this.$message.success('修改成功');
                    this.$refs.UpDateCoinDialog.cancel();
                } catch (e) {

                }
            },
            // 修改币种
            handleEdit(item) {
                console.log(item)
                let layer = this.$refs.UpDateCoinDialog;
                layer.init(this);
                layer.show({
                    dialogType: '修改',
                    info: item,
                    callback: this.editSubmit
                })
            },
            //删除币种
            deleteCoin(coin) {
                if (!coin) return;
                this.$confirm('你确定删除"' + coin + '"吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let result = await adminApi.delCoin(coin);
                        this.getData();
                        this.$message.success('删除成功!');
                    }catch (e) {

                    }
                }).catch(() => {
                });
            }
        }
    }
</script>

<style scoped>
    .font_blue {
        color: #409EFF !important;
    }
</style>
