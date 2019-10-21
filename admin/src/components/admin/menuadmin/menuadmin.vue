<template>
    <div class="role">
        <!--添加子菜单-->
        <el-dialog :title="(form.dialogType=='add'?'添加':'修改')+'子菜单'" :close-on-click-modal="false" @close="closeDialog('form')" :visible.sync="outerVisible"
                   width="600px">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="上级菜单">
                    <span style="color: red;">{{form.parentName}}</span>
                </el-form-item>
                <!--用户ID-->
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <!--<el-form-item label="描述">-->
                    <!--<el-input type="textarea" :rows="3" v-model="form.truename"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="是否启用">-->
                    <!--<el-switch-->
                        <!--v-model="form.pause=true">-->
                    <!--</el-switch>-->
                <!--</el-form-item>-->
                <!--真实姓名-->
                <el-form-item label="路径" v-if="form.type!=2">
                   <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="code" v-if="form.type===2">
                    <el-input v-model="form.perms"></el-input>
                </el-form-item>
                <el-form-item label="图标" v-if="form.type!=2 && form.type!=1">
                    <el-select v-model="form.icon" clearable>
                        <el-option v-for="(v,k) in iconList" :key="k" :value="v">
                            <i :class="v"></i>
                            <span>{{v}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.type" disabled @change="changeType(form.type)">
                        <el-option v-for="(v,k) in typeList" :key="k" :value="v.index" :label="v.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit(form.dialogType)">确 定</el-button>
                <el-button @click="outerVisible=false">取 消</el-button>
            </span>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!--<el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>-->
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
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
                <el-button type="primary" @click="addMenu" :disabled="getPerms('sys:menuadmin:add')">添加子菜单</el-button>
                 <el-button  @click="upData" :disabled="upDataBtn">更新菜单</el-button>
            </div>
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-card shadow="never" class="box-card">
                        <div slot="header" class="clearfix">
                            <span>目录结构</span>
                        </div>
                        <div  class="text item">
                            <!--:check-on-click-node="true"-->
                            <!--:check-strictly="true"-->
                            <!--default-expand-all-->
                            <el-tree
                                :data="resultList"
                                :default-expanded-keys="[treeEd.id]"
                                node-key="id"
                                ref="tree"
                                :props="defaultProps"
                                highlight-current
                                :expand-on-click-node="false"
                                :default-checked-keys="[treeEd.id]"
                                @node-click="handleNodeClick"
                                @check-change="handleMenuCheckChange"
                            >
                          <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>
                                   <i :class="node.icon"></i>
                                </span>
                                 <span>{{ node.label }}</span>
                               <span>{{ node.type }}</span>
                               <span style="margin-left: 15px">{{ node.key }}</span>
                              </span>
                            </el-tree>
                        </div>
                    </el-card>

                </el-col>
                <el-col :span="16">
                    <el-table :data="childrenList" border class="table"
                              v-loading="loading" ref="multipleTable">
                        <el-table-column
                            label="名称"
                            width="180">
                            <template slot-scope="scope">
                               <span>
                                   {{scope.row.name}}
                               </span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="type" label="类型">
                            <template slot-scope="scope">
                                <el-tag v-for="(v,k) in typeList" :type="v.type" v-if="scope.row.type===v.index" :key="k">{{v.name}}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column prop="level" label="路径">
                            <template slot-scope="scope">
                                <el-tag>{{scope.row.perms?scope.row.perms:scope.row.url}}</el-tag>
                            </template>
                        </el-table-column>

                        <!--<el-table-column prop="uid" label="描述">-->
                            <!--<template slot-scope="scope" v-if="scope.row">-->
                                <!--<span>{{scope.row | toAccount}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->

                        <el-table-column label="操作" width="150" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" :disabled="getPerms('sys:menuadmin:edit')" @click="handleEdit(scope.row)">编辑
                                </el-button>
                                <el-button type="text" icon="el-icon-delete" :disabled="getPerms('sys:menuadmin:del')" class="red"
                                           @click="delMenu(scope.row.id)">删除
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
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import adminApi from '@/api/admin';
    // import exchangeApi from '@/api/ex';
    import c2cApi from '@/api/c2c';
    import taskApi from '@/api/task';
    import robotApi from '@/api/robot';
 
    import {mapState} from 'vuex';
    import _ from "lodash"

    export default {
        data() {
            return {
                form: {},
                treeEd:{
                    id:0,
                    name:'根目录'
                },
                outerVisible: false,
                resultList: [],
                totalItems: 0,
                currentPage: 1,
                loading: false,
                upDataBtn:false,
                childrenList:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                iconList:[
                    'el-icon-lx-home',
                    'el-icon-lx-copy',
                    'el-icon-setting',
                    'el-icon-share',
                    'el-icon-menu',
                    'el-icon-bell',
                    'el-icon-edit-outline',
                    'el-icon-upload',
                    'el-icon-news',
                    'el-icon-printer',
                    'el-icon-message',
                    'el-icon-service',
                    'el-icon-location',
                    'el-icon-tickets',
                    'el-icon-sold-out',
                    'el-icon-sort',
                    'el-icon-goods',
                    'el-icon-mobile-phone'
                ],
                typeList:[
                    {name:'目录',index:0,type:"info"},
                    {name:'菜单',index:1,type:"warning"},
                    {name:'按钮',index:2,type:""}
                ]
            };
        },
        computed: {
            ... mapState(['permissions']),
        },
        mounted() {
            this.getData();

            this.resultList =JSON.parse(localStorage.getItem('permissions')) || [];
        },
        methods: {
            upData(){
                this.upDataBtn=true;
               this.$store.commit('menuCreate',(e)=>{
                        this.upDataBtn=false;
               });
            },
            // 树节点选择监听
            handleMenuCheckChange(data, check, subCheck) {
            },
            // 获取树选中节点
            handleNodeClick(data) {
                this.treeEd=data;
                let res=[];
                let getChildren=(data,pid)=>{
                   for (let item of data){
                       if(item.id===pid){
                           res=item.children || [];
                       }
                       if(item.children){
                           getChildren(item.children,pid)
                       }
                   }
                };
                getChildren(this.resultList,data.id);

                this.childrenList=res;
            },
            // 关闭弹窗重置表单
            closeDialog(formName) {
                if(formName) this.resetForm(this,formName);
            },
            // 选择类型
            changeType(type){
                if(type === 2){
                    this.$set(this.form,'url','');
                }else {
                    this.$set(this.form,'prams','');
                }
            },
            async submit(type) {
                if(this.form.type===2){
                    this.form.url=null;
                }else if(this.form.type===1){
                    this.form.perms=null;
                    this.form.icon=null;
                }else {
                    this.form.perms=null;
                }
                let data={
                    name:this.form.name,
                    url:this.form.url,
                    icon:this.form.icon,
                    parentId:this.treeEd.id || 0,
                    perms:this.form.perms,
                    type:this.form.type,
                    parentName:this.treeEd.name,
                    id:this.form.id
                };

                if(type=='edit'){
                    try {
                        let reuslt =await adminApi.editMenu(data);
                        this.$message.success('修改成功');
                    }catch (e) {

                    }
                }else {
                    try {
                        let reuslt =await adminApi.addMenu(data);
                        this.$message.success('添加成功');
                    }catch (e) {

                    }
                }


                    // let init =async()=>{
                    //      let importURL=this.form.url.replace(/\//g,'')+'Api';
                      
                    //     return;
                    //       let data={
                    //         menu:importURl.init()
                    //     }
                    //     try{
                    //         let result =await adminApi.menuCreate(data);
                    //     }catch(e){
                            
                    //     }
                    // }
                    // if(this.form.type==0){
                    //     init();
                    // }
                    

                this.getData();
                this.outerVisible=false;

            },
            // 删除菜单
            delMenu(id){
                this.$confirm('删除菜单，该菜单下面的子菜单也会删除！', '提示', {
                    type: 'warning'
                }).then(async () => {
                    try {
                        let result =await adminApi.delMenu(id);
                        this.getData();
                    
                        this.$message.success('删除成功');
                    }catch (e) {

                    }
                }).catch(

                )
            },
            handleEdit(data){
                this.outerVisible=true;
                this.form=_.cloneDeep(data);
                this.form.dialogType='edit';
                console.log(data)
            },
            // 添加菜单
            addMenu() {
                this.outerVisible=true;

                this.form.dialogType='add';
                this.$set(this.form,'parentName',this.treeEd.name || '根目录');
                this.$set(this.form,'url',this.treeEd.url);


                if(this.treeEd.id===0){
                    this.$set(this.form,'type',0)
                }else if (this.treeEd.type===0){
                    this.$set(this.form,'type',1)
                } else if (this.treeEd.type===1){
                    this.$set(this.form,'type',2);
                    this.$set(this.form,'perms',this.treeEd.url.replace('/',"").split('/').join(':'));
                    // this.$set(this.form,'perms',)
                }

            },
            // 获取菜单列表
            async getData() {
                 this.$store.commit('getPermissions',(e)=>{

                    this.resultList=e;

                    this.$nextTick(() => {
                        if(this.$refs.tree){
                            this.$refs.tree.setCurrentKey(this.treeEd.id);
                        }
                    });
                    this.handleNodeClick(this.treeEd);
                 })
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
        }
    };
</script>

<style scoped>

</style>
