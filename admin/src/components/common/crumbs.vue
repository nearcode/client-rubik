<template>
 
    <div class="crumbs">
          <el-breadcrumb separator="/">
            <!--<el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>-->
            <el-breadcrumb-item>
              <i class="el-icon-lx-home"></i>首页
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: v.url }" v-for="(v,k) in getCrumbs" :key="k">{{v.name}}</el-breadcrumb-item>
          
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
</template>

<script>
// import apiMain from "@/api/main.js";

export default {
  name: "crumbs",
  data() {
    return {
      list: []
    };
  },
  // beforeRouteEnter(to, from, next) {
  //     console.log(this, 'beforeRouteEnter'); // undefined
  //     console.log(to, '组件独享守卫beforeRouteEnter第一个参数');
  //     console.log(from, '组件独享守卫beforeRouteEnter第二个参数');
  //     console.log(next, '组件独享守卫beforeRouteEnter第三个参数');
  //     next(vm => {
  //         //因为当钩子执行前，组件实例还没被创建
  //         // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
  //         console.log(vm);//当前组件的实例
  //     });
  // },
  computed: {
    getTitle() {
      let path = this.$route.path;
      let title = this.$route.meta.title;

      return title;
    },
    getCrumbs() {
       let  items=[
        {
            "id":37,
            "name":"系统管理",
            "parentId":0,
            "sort":0,
            "type": 0,
            "url":"/sys/",
            "icon": "el-icon-lx-home",
            "perms":"",
            "children":[
                {
                    "id":39,
                    "name":"用户管理",
                    "parentId":37,
                    "sort":0,
                    "url":"/sys/user",
                    "perms":"",
                    "type": 1,
                    "children":[
                        {
                            "id":40,
                            "name":"查看",
                            "parentId":39,
                            "sort":0,
                            "url":"",
                            "type": 2,
                            "perms":"sys:user:view",
                            "children":null
                        },
                        {
                            "id":41,
                            "name":"修改",
                            "parentId":39,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sys:user:edit",
                            "children":null
                        },
                        {
                            "id":215,
                            "name":"财务",
                            "parentId":39,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"sys:user:finance",
                            "children":null
                        }
                    ]
                },
                {
                    "id":42,
                    "name":"管理员列表",
                    "parentId":37,
                    "sort":0,
                    "type": 1,
                    "url":"/sys/admin",
                    "perms":"",
                    "children":[
                        {
                            "id":46,
                            "name":"查看",
                            "parentId":42,
                            "sort":0,
                            "type": 2,
                            "url":"/sys/admin",
                            "perms":"sys:admin:view",
                            "children":null
                        },
                        {
                            "id":47,
                            "name":"修改",
                            "parentId":42,
                            "sort":0,
                            "type": 2,
                            "url":"/sys/admin",
                            "perms":"sys:admin:edit",
                            "children":null
                        },
                        {
                            "id":48,
                            "name":"删除",
                            "parentId":42,
                            "sort":0,
                            "type": 2,
                            "url":"/sys/admin",
                            "perms":"sys:admin:del",
                            "children":null
                        },
                        {
                            "id":98,
                            "name":"添加",
                            "parentId":42,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sys:admin:add",
                            "children":null
                        }
                    ]
                },
                {
                    "id":43,
                    "name":"角色管理",
                    "parentId":37,
                    "sort":0,
                    "type": 1,
                    "url":"/sys/role",
                    "perms":"",
                    "children":[
                        {
                            "id":95,
                            "name":"查看",
                            "parentId":43,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sys:role:view",
                            "children":null
                        },
                        {
                            "id":96,
                            "name":"添加",
                            "parentId":43,
                            "sort":0,
                            "url":"",
                            "type": 2,
                            "perms":"sys:role:add",
                            "children":null
                        },
                        {
                            "id":97,
                            "name":"修改",
                            "parentId":43,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sys:role:edit",
                            "children":null
                        },
                        {
                            "id":177,
                            "name":"删除",
                            "type": 2,
                            "parentId":43,
                            "sort":0,
                            "url":"",
                            "perms":"sys:role:del",
                            "children":null
                        }
                    ]
                },
                {
                    "id":45,
                    "name":"菜单管理",
                    "parentId":37,
                    "type": 1,
                    "sort":0,
                    "url":"/sys/menuadmin",
                    "perms":"",
                    "children":[
                        {
                            "id":99,
                            "name":"添加",
                            "type": 2,
                            "parentId":45,
                            "sort":0,
                            "url":"",
                            "perms":"sys:menuadmin:add",
                            "children":null
                        },
                        {
                            "id":100,
                            "name":"修改",
                            "parentId":45,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sys:menuadmin:edit",
                            "children":null
                        },
                        {
                            "id":101,
                            "name":"删除",
                            "parentId":45,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sys:menuadmin:del",
                            "children":null
                        },
                        {
                            "id":105,
                            "name":"查看",
                            "parentId":45,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sys:menuadmin:view",
                            "children":null
                        }
                    ]
                },
                {
                    "id":59,
                    "name":"企业申请",
                    "parentId":37,
                    "sort":0,
                    "type": 1,
                    "url":"/sys/enterprise",
                    "perms":"sys:menuadmin:add",
                    "children":[
                        {
                            "id":106,
                            "name":"查看",
                            "parentId":59,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"sys:enterprise:view",
                            "children":null
                        }
                    ]
                },
                {
                    "id":60,
                    "name":"实名认证",
                    "parentId":37,
                    "sort":0,
                    "type": 1,
                    "url":"/sys/cdd",
                    "perms":"",
                    "children":[
                        {
                            "id":107,
                            "name":"查看",
                            "parentId":60,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"sys:cdd:view",
                            "children":null
                        },
                        {
                            "id":136,
                            "name":"审核",
                            "parentId":60,
                            "sort":0,
                            "url":"",
                            "type": 2,
                            "perms":"sys:cdd:audit",
                            "children":null
                        }
                    ]
                }
            ]
        },
        {
            "id":61,
            "name":"财务管理",
            "parentId":0,
            "type": 0,
            "sort":0,
            "url":"/finance/",
            "icon": "el-icon-lx-copy",
            "perms":"",
            "children":[
                {
                    "id":62,
                    "name":"对账",
                    "parentId":61,
                    "sort":0,
                    "type": 1,
                    "url":"/finance/info",
                    "perms":"",
                    "children":[
                        {
                            "id":108,
                            "name":"查看",
                            "parentId":62,
                            "sort":0,
                            "url":"",
                            "type": 2,
                            "perms":"finance:info:view",
                            "children":null
                        }
                    ]
                },
                {
                    "id":64,
                    "name":"赠送记录",
                    "parentId":61,
                    "sort":0,
                    "type": 1,
                    "url":"/finance/give",
                    "perms":"",
                    "children":[
                        {
                            "id":110,
                            "name":"查看",
                            "parentId":64,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"finance:give:view",
                            "children":null
                        },
                        {
                            "id":196,
                            "name":"赠送",
                            "parentId":64,
                            "sort":0,
                            "url":"",
                            "type": 2,
                            "perms":"finance:give:give",
                            "children":null
                        },
                        {
                            "id":197,
                            "name":"移动",
                            "parentId":64,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"finance:give:move",
                            "children":null
                        }
                    ]
                },
                {
                    "id":65,
                    "name":"转账记录",
                    "parentId":61,
                    "sort":0,
                    "type": 1,
                    "url":"/finance/transfer",
                    "perms":"",
                    "children":[
                        {
                            "id":111,
                            "name":"查看",
                            "parentId":65,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"finance:transfer:view",
                            "children":null
                        }
                    ]
                },

                {
                    "id":67,
                    "name":"资金分布",
                    "parentId":61,
                    "sort":0,
                    "type": 1,
                    "url":"/finance/userPosition",
                    "perms":"",
                    "children":[
                        {
                            "id":113,
                            "name":"查看",
                            "parentId":67,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"finance:userPosition:view",
                            "children":null
                        }
                    ]
                },
                {
                    "id":68,
                    "name":"资金变化",
                    "parentId":61,
                    "sort":0,
                    "type": 1,
                    "url":"/finance/moneyChange",
                    "perms":"",
                    "children":[
                        {
                            "id":114,
                            "name":"查看",
                            "parentId":68,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"finance:moneyChange:view",
                            "children":null
                        }
                    ]
                }
            ]
        },
        {
            "id":76,
            "name":"CMS系统",
            "parentId":0,
            "sort":0,
            "type": 0,
            "url":"/cms/",
            "icon": "el-icon-lx-copy",
            "perms":"",
            "children":[
                {
                    "id":77,
                    "name":"文章管理",
                    "parentId":76,
                    "sort":0,
                    "type": 1,
                    "url":"/cms/article",
                    "perms":"",
                    "children":[
                        {
                            "id":120,
                            "name":"查看",
                            "parentId":77,
                            "sort":0,
                            "url":"",
                            "type": 2,
                            "perms":"cms:article:view",
                            "children":null
                        },
                        {
                            "id":174,
                            "name":"删除",
                            "parentId":77,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"cms:article:del",
                            "children":null
                        },
                        {
                            "id":175,
                            "name":"添加",
                            "parentId":77,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"cms:article:add",
                            "children":null
                        },
                        {
                            "id":176,
                            "name":"修改",
                            "parentId":77,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"cms:article:edit",
                            "children":null
                        }
                    ]
                }
            ]
        },
        {
            "id":78,
            "name":"币种管理",
            "parentId":0,
            "sort":0,
            "url":"/coin/",
            "type": 0,
            "icon": "el-icon-lx-copy",
            "perms":"",
            "children":[
                {
                    "id":79,
                    "name":"币种列表",
                    "parentId":78,
                    "sort":0,
                    "type": 1,
                    "url":"/coin/coins",
                    "perms":"",
                    "children":[
                        {
                            "id":121,
                            "name":"查看",
                            "parentId":79,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"coin:coins:view",
                            "children":null
                        },
                        {
                            "id":165,
                            "name":"添加或修改",
                            "parentId":79,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"coin:coins:addAndEdit",
                            "children":null
                        },
                        {
                            "id":166,
                            "name":"修改",
                            "parentId":79,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"coin:coins:edit",
                            "children":null
                        },
                        {
                            "id":167,
                            "name":"删除",
                            "parentId":79,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"coin:coins:del",
                            "children":null
                        }
                    ]
                },
                // {
                //   "id":80,
                //   "name":"币种选择",
                //   "parentId":78,
                //   "sort":0,
                //   "type": 1,
                //   "url":"/coin/selectCoin",
                //   "perms":"",
                //   "children":[
                //     {
                //       "id":122,
                //       "name":"查看",
                //       "parentId":80,
                //       "type": 2,
                //       "sort":0,
                //       "url":"",
                //       "perms":"coin:selectCoin:view",
                //       "children":null
                //     },
                //     {
                //       "id":168,
                //       "name":"修改",
                //       "parentId":80,
                //       "type": 2,
                //       "sort":0,
                //       "url":"",
                //       "perms":"coin:selectCoin:edit",
                //       "children":null
                //     },
                //     {
                //       "id":169,
                //       "name":"删除",
                //       "parentId":80,
                //       "sort":0,
                //       "type": 2,
                //       "url":"",
                //       "perms":"coin:selectCoin:del",
                //       "children":null
                //     },
                //     {
                //       "id":170,
                //       "name":"添加",
                //       "parentId":80,
                //       "sort":0,
                //       "type": 2,
                //       "url":"",
                //       "perms":"coin:selectCoin:add",
                //       "children":null
                //     }
                //   ]
                // }
            ]
        },
        {
            "id":83,
            "name":"系统设置",
            "parentId":0,
            "sort":0,
            "type": 0,
            "url":"/sysSettings/",
            "icon": "el-icon-lx-copy",
            "perms":"",
            "children":[
                {
                    "id":84,
                    "name":"邮箱设置",
                    "parentId":83,
                    "sort":0,
                    "type": 1,
                    "url":"/sysSettings/email",
                    "perms":"",
                    "children":[
                        {
                            "id":124,
                            "name":"查看",
                            "parentId":84,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sysSettings:email:view",
                            "children":null
                        },
                        {
                            "id":183,
                            "name":"修改",
                            "parentId":84,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:email:edit",
                            "children":null
                        }
                    ]
                },
                {
                    "id":85,
                    "name":"短信设置",
                    "parentId":83,
                    "sort":0,
                    "type": 1,
                    "url":"/sysSettings/mobileSetting",
                    "perms":"",
                    "children":[
                        {
                            "id":125,
                            "name":"查看",
                            "parentId":85,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sysSettings:mobileSetting:view",
                            "children":null
                        },
                        {
                            "id":184,
                            "name":"修改",
                            "parentId":85,
                            "sort":0,
                            "url":"",
                            "type": 2,
                            "perms":"sysSettings:mobileSetting:edit",
                            "children":null
                        }
                    ]
                },
                // {
                //   "id":86,
                //   "name":"轮盘设置",
                //   "parentId":83,
                //   "sort":0,
                //   "type": 1,
                //   "url":"/sysSettings/roulette",
                //   "perms":"",
                //   "children":[
                //     {
                //       "id":126,
                //       "name":"查看",
                //       "parentId":86,
                //       "sort":0,
                //       "url":"",
                //       "type": 2,
                //       "perms":"sysSettings:roulette:view",
                //       "children":null
                //     },
                //     {
                //       "id":180,
                //       "name":"添加",
                //       "parentId":86,
                //       "sort":0,
                //       "type": 2,
                //       "url":"",
                //       "perms":"sysSettings:roulette:add",
                //       "children":null
                //     },
                //     {
                //       "id":181,
                //       "name":"修改",
                //       "parentId":86,
                //       "sort":0,
                //       "type": 2,
                //       "url":"",
                //       "perms":"sysSettings:roulette:edit",
                //       "children":null
                //     },
                //     {
                //       "id":182,
                //       "name":"删除",
                //       "parentId":86,
                //       "sort":0,
                //       "url":"",
                //       "type": 2,
                //       "perms":"sysSettings:roulette:del",
                //       "children":null
                //     }
                //   ]
                // },
                {
                    "id":87,
                    "name":"推荐奖励",
                    "parentId":83,
                    "sort":0,
                    "type": 1,
                    "url":"/sysSettings/recommended",
                    "perms":"",
                    "children":[
                        {
                            "id":127,
                            "name":"查看",
                            "type": 2,
                            "parentId":87,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:recommended:view",
                            "children":null
                        },
                        {
                            "id":185,
                            "name":"修改",
                            "type": 2,
                            "parentId":87,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:recommended:edit",
                            "children":null
                        }
                    ]
                },
                {
                    "id":89,
                    "name":"基本设置",
                    "parentId":83,
                    "sort":0,
                    "type": 1,
                    "url":"/sysSettings/setting",
                    "perms":"",
                    "children":[
                        {
                            "id":129,
                            "name":"查看",
                            "parentId":89,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:setting:view",
                            "children":null
                        },
                        {
                            "id":187,
                            "name":"修改",
                            "type": 2,
                            "parentId":89,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:setting:edit",
                            "children":null
                        }
                    ]
                },
                {
                    "id":90,
                    "name":"友情链接",
                    "parentId":83,
                    "sort":0,
                    "type": 1,
                    "url":"/sysSettings/linkSettings",
                    "perms":"",
                    "children":[
                        {
                            "id":130,
                            "name":"查看",
                            "parentId":90,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sysSettings:linkSettings:view",
                            "children":null
                        },
                        {
                            "id":188,
                            "name":"修改",
                            "type": 2,
                            "parentId":90,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:linkSettings:edit",
                            "children":null
                        },
                        {
                            "id":189,
                            "name":"添加",
                            "parentId":90,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:linkSettings:add",
                            "children":null
                        },
                        {
                            "id":190,
                            "name":"删除",
                            "parentId":90,
                            "type": 2,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:linkSettings:del",
                            "children":null
                        }
                    ]
                },
                {
                    "id":91,
                    "name":"Banner",
                    "parentId":83,
                    "sort":0,
                    "type": 1,
                    "url":"/sysSettings/banner",
                    "perms":"",
                    "children":[
                        {
                            "id":131,
                            "name":"查看",
                            "type": 2,
                            "parentId":91,
                            "sort":0,
                            "url":"",
                            "perms":"sysSettings:banner:view",
                            "children":null
                        },
                        {
                            "id":163,
                            "name":"添加",
                            "parentId":91,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sysSettings:banner:add",
                            "children":null
                        },
                        {
                            "id":164,
                            "name":"删除",
                            "parentId":91,
                            "sort":0,
                            "type": 2,
                            "url":"",
                            "perms":"sysSettings:banner:del",
                            "children":null
                        }
                    ]
                },
                // {
                //   "id":92,
                //   "name":"网站管理",
                //   "parentId":83,
                //   "type": 1,
                //   "sort":0,
                //   "url":"/sysSettings/website",
                //   "perms":"",
                //   "children":[
                //     {
                //       "id":132,
                //       "type": 2,
                //       "name":"查看",
                //       "parentId":92,
                //       "sort":0,
                //       "url":"",
                //       "perms":"sysSettings:website:view",
                //       "children":null
                //     },
                //     {
                //       "id":191,
                //       "name":"添加",
                //       "parentId":92,
                //       "sort":0,
                //       "type": 2,
                //       "url":"",
                //       "perms":"sysSettings:website:add",
                //       "children":null
                //     },
                //     {
                //       "id":192,
                //       "name":"修改",
                //       "type": 2,
                //       "parentId":92,
                //       "sort":0,
                //       "url":"",
                //       "perms":"sysSettings:website:edit",
                //       "children":null
                //     },
                //     {
                //       "id":193,
                //       "name":"删除",
                //       "type": 2,
                //       "parentId":92,
                //       "sort":0,
                //       "url":"",
                //       "perms":"sysSettings:website:del",
                //       "children":null
                //     }
                //   ]
                // }
            ]
        }
    ];
        let  getParent=(data2, nodeId2) =>{
        var arrRes = [];
        if (data2.length == 0) {
            if (!!nodeId2) {
                arrRes.unshift(data2)
            }
            return arrRes;
        }
        let rev = (data, nodeId) => {
            for (var i = 0, length = data.length; i < length; i++) {
                let node = data[i];
                if (node.id == nodeId) {
                    arrRes.unshift(node)
                    rev(data2, node.parentId);
                    break;
                }
                else {
                    if (!!node.children) {
                        rev(node.children, nodeId);
                    }
                }
            }
            return arrRes;
        };
        arrRes = rev(data2, nodeId2);
        return arrRes;
    };


   let data= getParent(items,110);
  
   return data;
    }
  },
  mounted() {
      // console.log(apiMain)
  },
  methods: {
      
  }
};
</script>

<style scoped>
</style>
