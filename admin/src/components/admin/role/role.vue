<template>
    <div class="role">

        <el-dialog :title="(form.dialogType=='add'?'添加':'修改')+'角色'" @close="closeDialog('form')" :close-on-click-modal="false"
                   :visible.sync="outerVisible"
                   width="600px">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <!--用户ID-->
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="content">
                    <el-input type="textarea" :rows="3" v-model="form.content"></el-input>
                </el-form-item>
                <!--<el-form-item label="是否启用">-->
                    <!--<el-switch-->
                        <!--v-model="form.pause=true">-->
                    <!--</el-switch>-->
                <!--</el-form-item>-->
                <!--真实姓名-->
                <!--:default-expanded-keys="[2, 3]"--><!--设置默认展开-->
                <!--:default-checked-keys="[5]"--><!--设置默认选中-->
                <!--:check-strictly="true"-->
                <el-form-item label="分配权限" prop="tree">
                    <el-tree
                        :data="permissions"
                        show-checkbox
                        node-key="id"
                        ref="tree"
                        :expand-on-click-node="false"
                        :props="defaultProps"
                    >
                        <!--@check-change="handleMenuCheckChange"-->
                          <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>
                                   <i :class="node.icon"></i>
                                </span>
                                 <span>{{ node.label }}</span>
                               <span style="margin-left: 15px">{{ node.key }}</span>
                              </span>
                    </el-tree>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('form',form.dialogType)">确 定</el-button>
                <el-button @click="outerVisible=false">取 消</el-button>
            </span>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!--<el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>-->
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @clcik="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-button type="primary" @click="addRole" :disabled="getPerms('sys:role:add')">添加角色</el-button>
            </div>
            <el-table :data="resultList" border class="table"
                      v-loading="loading" ref="multipleTable">
                <el-table-column
                    label="角色名称"
                    width="180">
                    <template slot-scope="scope">
                        {{ scope.row.name | noData }}
                    </template>
                </el-table-column>

                <el-table-column prop="uid" label="描述">
                    <template slot-scope="scope" v-if="scope.row">
                        <span>{{scope.row | toAccount}}</span>
                    </template>
                </el-table-column>

                <!--<el-table-column prop="level" label="状态">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-tag>{{$store.state.adminLevelList[scope.row.level]}}</el-tag>-->
                    <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"  :disabled="getPerms('sys:role:edit')" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete"  :disabled="getPerms('sys:role:del')" class="red"
                                   @click="delRole(scope.row)">删除
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
    import adminApi from '@/api/admin';
    import {mapState} from 'vuex';
    import _ from "lodash"

    export default {
        data() {
            return {
                form: {},
                outerVisible: false,
                resultList: [],
                totalItems: 0,
                currentPage: 1,
                loading: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: ['change', 'blur']}
                    ],
                  
                }
            };
        },
        computed: {
            ... mapState(['permissions']),
            menuList() {
                let result = [];
                result = _.cloneDeep(this.permissions);
                // let role_zh = {
                //     view: '查看',
                //     edit: '修改',
                //     add: '新增',
                //     del: '删除'
                // };
                return result;
            }
        },
        mounted() {
       this.$store.commit('getPermissions',(e)=>{
             this.getData()      
       })
                
        },
        methods: {
            // 弹窗关闭事件
            closeDialog(formName) {
                if(formName)
                    this.resetForm(this,formName);
            },
            // 树节点选择监听
            handleMenuCheckChange(data, check, subCheck) {
                // console.log(data, check, subCheck)
                // // if (!subCheck) return;
                // if (check) {
                //     if (data.children != null) {
                //         data.children.forEach(element => {
                //             // console.log(element)
                //             this.$refs.tree.setChecked(element.id, true, true)
                //         });
                //     }
                //     // // 节点选中时同步选中父节点
                //     let parentId = data.parentId;
                //     this.$refs.tree.setChecked(parentId, true, false);
                //
                // } else {
                //     // 节点取消选中时同步取消选中子节点
                //     if (data.children != null) {
                //         data.children.forEach(element => {
                //             this.$refs.tree.setChecked(element.id, false, false)
                //         });
                //     }
                // }
            },
            handleEdit(data) {
                this.outerVisible = true;
                this.form=_.cloneDeep(data);
                this.form.dialogType = 'edit';

                let keyarr=[];
                for (let item of data.menuIds) {
                    if(item.type==2){
                        keyarr.push(item);
                    }
                }
                console.log(keyarr)
               
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedNodes(keyarr);
                    // this.$refs.tree.setCheckedKeys(data.menuIds);
                })

            },
             //验证通过就执行
            submitForm(formName,type) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submit(type)
                    } else {
                        return false;
                    }
                });
            },
            async submit(type) {

                let checkedNodes = this.$refs.tree.getCheckedNodes(false, true)

                let chkIds1 = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());

                let roleMenus = [];
                for (let i = 0, len = checkedNodes.length; i < len; i++) {
                    // roleId: 1,
                    // let roleMenu = {id: checkedNodes[i].id, name: checkedNodes[i].name,type:checkedNodes[i].type}
                    roleMenus.push(checkedNodes[i].id)
                }
            
                if (type == 'edit') {
                    try {
                        let data = {
                            name: this.form.name,
                            menuIds: roleMenus,
                            id:this.form.id
                        };

                        let result = await adminApi.roleEdit(data);
                        this.$message.success('修改成功');
                    } catch (e) {

                    }
                } else {
                    try {
                        let data = {
                            name: this.form.name,
                            menuIds: roleMenus
                        };

                        let result = await adminApi.roleAdd(data);
                        this.$message.success('添加成功');
                    } catch (e) {

                    }
                }

                this.getData();
                this.outerVisible=false;


                // console.log( this.$refs.tree)
                // console.log(this.$refs.tree.getCheckedNodes())
                // console.log(this.$refs.tree.getCheckedKeys())
                //   console.log(chkIds1)
                // 通过node设置
                // this.$refs.tree.setCheckedNodes([{
                //     id: 5,
                //     label: '二级 2-1'
                // }, {
                //     id: 9,
                //     label: '三级 1-1-1'
                // }]);

                // 通过key设置
                // this.$refs.tree.setCheckedKeys([3]);
            },
            addRole() {
                this.outerVisible = true;
                this.form.dialogType = 'add';
            },
            delRole(data){
                this.$confirm('你确定删除吗？', '提示', {
                    type: 'warning'
                }).then(async () => {
                    try {
                        let result = await adminApi.roleDel(data.id);
                        this.getData();
                        this.$message.success('删除成功');
                    } catch (e) {

                    }
                }).catch(error => {

                })
            },
            async getData() {
                try {
                    let reuslt = await adminApi.roleList();
                    this.resultList = reuslt;

                    console.log(reuslt);
                } catch (e) {

                }
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
