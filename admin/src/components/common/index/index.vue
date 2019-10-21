<template>
   <div class="main">
       <!-- <v-crumbs ></v-crumbs> -->
     <span class="text slideShine">欢迎登录后台管理系统</span>
<!-- <h1 class="text">Welcome to login system !</h1> -->
           <!-- <div v-if="false">
                <form >
                url:<el-input v-model="role.url" placeholder="url" clearable/><br>
                perms:<el-input  v-model="role.perms" placeholder="perms" clearable/><br>
                <el-button @click="addUrl()">
                    提交
                </el-button>
            </form>
        <br> -->
                <!--用户列表highlight-current-row-->
            <!-- <el-table :data="resultList" border style="width: 100%" class="table"
                      v-loading="loading" ref="multipleTable">
                <el-table-column label="perms" prop="perms">
                   
                </el-table-column>
                <el-table-column label="route">
                    <template slot-scope="scope">
                        <span> {{scope.row.route}}</span>
                    </template>
                </el-table-column>
              
                <el-table-column label="注册时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.create | toTimeStr}}
                    </template>
                </el-table-column>
              
                <el-table-column label="name" prop="name" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" round icon="el-icon-edit"
                                   :disabled="getPerms('sys:user:edit')"
                                   @click="handleEdit(scope.row.id,scope.row._id)">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
           </div> -->
   </div>
</template>

<script>
    // import {mapState} from 'vuex'
    // import adminApi from '@/api/admin'
    // import vCrumbs from "../crumbs.vue";
  

    // export default {
    //     name: "index",
    //     data(){
    //         return{
    //             loading:false,
    //               role:{},
    //               resultList:[]
    //         }
    //     },
    //     components: {
    //        vCrumbs
    //     },
    //     mounted(){
    //         this.getData();
    //     },
    //     methods:{
    //          async addUrl(){
    //             try{
    //                 let data={
    //                     url:this.role.url,
    //                     perms:this.role.perms
    //                 }

    //                 let result =await adminApi.bindURLPerms(data);
    //                 this.getData();
    //                 this.$message.success('添加成功')  
    //             }catch(e){

    //             }
                
    //         },
    //         async getData(){
    //             let result=await adminApi.getAdminRole();
    //             // console.log(result)
    //             this.resultList=result;
    //         },
    //         async handleEdit(){

    //         }
    //     }
    // }
</script>

<style scoped>
@keyframes typing { from { width: 0; } }
	@keyframes blink-caret { 50% { border-color: transparent; } }
	h1 {
		font: bold 200% Consolas, Monaco, monospace;
		border-right: .1em solid;
		width: 16.5em; /* fallback */
		width: 30ch; /* # of chars */
		margin: 2em 1em;
		white-space: nowrap;
		overflow: hidden;
		animation: typing 20s steps(30, end), /* # of steps = # of chars */
					blink-caret .5s step-end infinite alternate;
	}
   .main{
      position: initial;
        width: 100%;
        height: 100%;
     
   }
   .text{
    position: absolute;
    transform: translate(-50%, -50%);
    top:30%;
    left: 50%;
    font-weight: bold;
    /* font-family: '微软雅黑'; */
    /* text-align: center; */
   
    /* color: #CCCCCC; */
    /* text-shadow: -1px -1px 0px #000, 1px 1px 0px #Fff; */
   }
   .slideShine{
        font-size: 50px;
        background:#ddd -webkit-linear-gradient(left,#ddd,#4d2b9b 50%,#051c6a 80%,#ddd) no-repeat 0 0;
     /* background:#ddd -webkit-linear-gradient(left,#4d2b9b 0%,#1626ad 50%,#051c6a 90%,#4d2b9b) no-repeat 0 0; */
     background-size:20% 100%; 
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     /* font-size: 36px; */
     /* text-align: center; */
     /* font-weight: bold; */
     text-decoration: underline;
}
.slideShine {-webkit-animation: slideShine 6s linear infinite;animation: slideShine 6s linear infinite;}
@-webkit-keyframes slideShine {
     0% {
          background-position: 0 0;
        }
     100% {
          background-position: 100% 100%;
      }
 }
 @keyframes slideShine {
      0% {background-position: 0 0; }
     100% {background-position:150% 150%; }
 }
</style>
