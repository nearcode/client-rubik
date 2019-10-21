<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>工单管理</el-breadcrumb-item>
                <el-breadcrumb-item>工单列表</el-breadcrumb-item>
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
            <!-- <div class="plugins-tips">
                <el-form :inline="true" :model="data" class="demo-form-inline">
                    <el-form-item>
                        <el-button type="primary" @click="addAdmin" :disabled="getPerms('games:invest:updata')">新增</el-button>
                    </el-form-item>
                </el-form>
            </div> -->
            <el-table :data="resultList" border @row-click="handleEdit" row-class-name="cell_style" class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column
                    label="工单标题"
                   >
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('subject')}}</span>
                    </template>
                </el-table-column>

            
                <el-table-column prop="min" label="工单类型">
                    <template slot-scope="scope">
                       {{scope.row | getDictValue('type')}}
                    </template>
                </el-table-column>

                <el-table-column prop="min" label="创建账户">
                    <template slot-scope="scope">
                       {{scope.row | getDictValue('uid')}}
                    </template>
                </el-table-column>

                <el-table-column prop="min" label="工单状态">
                    <template slot-scope="scope">
                      <el-tag :type="v.type" v-for="(v,k) in results" :key="k" v-if="v.id==scope.row.result">{{v.text}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="min" label="创建时间">
                    <template slot-scope="scope">
                       {{scope.row | getDictValue('create') | toTimeStr}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" :disabled="getPerms('zendesk:ticket:view')"  @click.stop="handleEdit(scope.row)">查看
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" v-if="scope.row.result!=3" :disabled="getPerms('zendesk:ticket:close')" class="red"
                                   @click.stop="workorderClose(scope.row)">关闭
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
import {mapState} from "vuex"
import _ from "lodash"
import baseApi from "@/api/admin"

    export default {
        name: "ticket",
        data() {
            return {
                resultList: [],
                times:null,
                pending:[],//待处理订单
                totalItems: 0,
                currentPage:1,
                loading: false,
                data: {
                    user: '',
                    region: ''
                },
                 results: [
        {
          id: 1,
          type: "warning",
          text: "待处理"
        },
        {
          id: 2,
          type: "danger",
          text: "处理中"
        },
        {
          id: 3,
          type: "success",
          text: "处理完成"
        }
      ],
                form: {},
                editVisible: false,
                rules: {
                    coin: [
                        {required: true, message: '参数不能为空', trigger: 'blur'}
                    ],
                }
            }
        }, 
        mounted() {
            this.getData();
            this.times=setInterval(() => {
                 this.getData();
            }, 1000*10);
            Notification.requestPermission().then(function (permission) {
            console.log('用户是否允许通知： ',permission === 'granted' ? '允许' : '拒绝');
            });
           
        },
         destroyed(){
             clearInterval(this.times);
              console.log('执行了')
        },
         computed: {
            ...mapState(['coins']),
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            }, 
            handleSelectionChange(val) {
                this.multipleSelection = val;
                // this.$refs.multipleTable.toggleRowSelection(row);
                console.log(JSON.stringify(this.multipleSelection))
            },
            // 获取数据
            async getData() {
               try{
                let result = await baseApi.workorderList({
                    p:this.currentPage
                });
                
                this.resultList = result.data;
                this.totalItems = result.count;



                for(let item of this.resultList){
                    if(item.result==1 && this.pending.indexOf(item.id) ==-1){
                        this.pending.push(item.id);

                         Notification.requestPermission((permission)=> {  
                        if (permission == "granted") {
                            var notification = new Notification(`您有新的工单待处理`,{  
                                dir: "auto",  
                                lang: "zh-CN",  
                                tag: "testNotice",  
                                // icon:'el-icon-close-notification',  
                                body: `您有${this.pending.length}条新的工单待处理，请及时处理！`
                            });   
                        }else{
                             Notification.requestPermission();
                            console.log('没有权限,用户拒绝:Notification');
                        }
                })
                    }
                }

              
               }catch(e){

               }
            },
            // 设置状态
            workorderClose(row){
                if(!row) return;
                  this.$confirm(`你确定关闭吗?`, '提示', {}).then(
                      async () => {
                        try{
                            let result = await baseApi.workorderClose({id:row.id});
                            this.getData();
                            this.$message.success('设置成功')
                            }catch(e){

                            }
                        }).catch(() => {

                        });
            },
            // 查看详细
            handleEdit(row){
                 if (!row || this.getPerms('zendesk:ticket:view')) return;
                this.$router.push(`/zendesk/ticket/${row.id}`);
            },
            onSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        
                            let data={
                                    "coin": this.form.coin,
                                    "min":this.form.min
                                }
                        
                        try{
                            let result =await baseApi.setCoins(data);
                            this.editVisible = false;
                            this.getData();
                            if(this.form['dialogType']=='add'){
                                this.$message.success('添加成功')
                            }else{
                                this.$message.success('修改成功')
                            }
                        }catch(e){

                        }


                    } else {
                        return false;
                    }
                });

            },
            // 删除
            delAdmin(coin) {
                if(!coin) return;
                this.$confirm(`你确定删除${coin}吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(async () => {
                    let data={
                            coin
                         }
                    try{
                        let result =await baseApi.delCoin(data);
                        this.getData();
                        this.$message.success('删除成功');
                    }catch(e){

                    }
                }).catch(() => {
                });
            }
        }

    }
</script>

<style scoped>
    .table /deep/ .cell_style{
        cursor: pointer!important;
    }
</style>
