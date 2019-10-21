import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.baseUrl);

function init() {

  return [
    {
      "id": 37,
      "name": "系统管理",
      "parentId": 0,
      "sort": 0,
      "type": 0,
      "url": "/sys/",
      "icon": "el-icon-lx-home",
      "perms": "",
      "children": [
        {
          "id": 39,
          "name": "用户管理",
          "parentId": 37,
          "sort": 0,
          "url": "/sys/user",
          "perms": "",
          "type": 1,
          "children": [
            {
              "id": 40,
              "name": "查看",
              "parentId": 39,
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "sys:user:view",
              "children": null
            },
            {
              "id": 41,
              "name": "修改",
              "parentId": 39,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:user:edit",
              "children": null
            },
            {
              "id": 215,
              "name": "财务",
              "parentId": 39,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sys:user:finance",
              "children": null
            }
          ]
        },
        {
          "id": 42,
          "name": "管理员列表",
          "parentId": 37,
          "sort": 0,
          "type": 1,
          "url": "/sys/admin",
          "perms": "",
          "children": [
            {
              "id": 46,
              "name": "查看",
              "parentId": 42,
              "sort": 0,
              "type": 2,
              "url": "/sys/admin",
              "perms": "sys:admin:view",
              "children": null
            },
            {
              "id": 47,
              "name": "修改",
              "parentId": 42,
              "sort": 0,
              "type": 2,
              "url": "/sys/admin",
              "perms": "sys:admin:edit",
              "children": null
            },
            {
              "id": 48,
              "name": "删除",
              "parentId": 42,
              "sort": 0,
              "type": 2,
              "url": "/sys/admin",
              "perms": "sys:admin:del",
              "children": null
            },
            {
              "id": 98,
              "name": "添加",
              "parentId": 42,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:admin:add",
              "children": null
            }
          ]
        },
        {
          "id": 43,
          "name": "角色管理",
          "parentId": 37,
          "sort": 0,
          "type": 1,
          "url": "/sys/role",
          "perms": "",
          "children": [
            {
              "id": 95,
              "name": "查看",
              "parentId": 43,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:role:view",
              "children": null
            },
            {
              "id": 96,
              "name": "添加",
              "parentId": 43,
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "sys:role:add",
              "children": null
            },
            {
              "id": 97,
              "name": "修改",
              "parentId": 43,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:role:edit",
              "children": null
            },
            {
              "id": 177,
              "name": "删除",
              "type": 2,
              "parentId": 43,
              "sort": 0,
              "url": "",
              "perms": "sys:role:del",
              "children": null
            }
          ]
        },
        {
          "id": 45,
          "name": "菜单管理",
          "parentId": 37,
          "type": 1,
          "sort": 0,
          "url": "/sys/menuadmin",
          "perms": "",
          "children": [
            {
              "id": 99,
              "name": "添加",
              "type": 2,
              "parentId": 45,
              "sort": 0,
              "url": "",
              "perms": "sys:menuadmin:add",
              "children": null
            },
            {
              "id": 100,
              "name": "修改",
              "parentId": 45,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:menuadmin:edit",
              "children": null
            },
            {
              "id": 101,
              "name": "删除",
              "parentId": 45,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:menuadmin:del",
              "children": null
            },
            {
              "id": 105,
              "name": "查看",
              "parentId": 45,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:menuadmin:view",
              "children": null
            }
          ]
        },
        {
          "name": "等级管理",
          "type": 1,
          "sort": 0,
          "url": "/sys/vipLevel",
          "perms": "",
          "children": [
            {
              "name": "添加或查看",
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sys:vipLevel:update",
              "children": null
            },
            {
              "name": "删除",
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:vipLevel:del",
              "children": null
            },
            {
              "name": "查看",
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sys:vipLevel:view",
              "children": null
            }
          ]
        },
        {
          "id": 60,
          "name": "实名认证",
          "parentId": 37,
          "sort": 0,
          "type": 1,
          "url": "/sys/realname",
          "perms": "",
          "children": [
            {
              "id": 107,
              "name": "查看",
              "parentId": 60,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sys:realname:view",
              "children": null
            },
            {
              "id": 136,
              "name": "审核",
              "parentId": 60,
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "sys:realname:audit",
              "children": null
            },
            {
              "name": "修改",
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "sys:realname:edit",
              "children": null
            },
          ]
        },
        {
          "id": 60,
          "name": "推荐人关系",
          "parentId": 37,
          "sort": 0,
          "type": 1,
          "url": "/sys/referees",
          "perms": "",
          "children": [
            {
              "id": 107,
              "name": "查看",
              "parentId": 60,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sys:referees:view",
              "children": null
            },
          ]
        }
      ]
    },
    {
      "id": 61,
      "name": "财务管理",
      "parentId": 0,
      "type": 0,
      "sort": 0,
      "url": "/finance/",
      "icon": "el-icon-lx-copy",
      "perms": "",
      "children": [
        {
          "id": 62,
          "name": "对账",
          "parentId": 61,
          "sort": 0,
          "type": 1,
          "url": "/finance/info",
          "perms": "",
          "children": [
            {
              "id": 108,
              "name": "查看",
              "parentId": 62,
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "finance:info:view",
              "children": null
            }
          ]
        },
        {
          "id": 64,
          "name": "赠送记录",
          "parentId": 61,
          "sort": 0,
          "type": 1,
          "url": "/finance/give",
          "perms": "",
          "children": [
            {
              "id": 110,
              "name": "查看",
              "parentId": 64,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "finance:give:view",
              "children": null
            },
            {
              "id": 196,
              "name": "赠送",
              "parentId": 64,
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "finance:give:give",
              "children": null
            },
            {
              "id": 197,
              "name": "移动",
              "parentId": 64,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "finance:give:move",
              "children": null
            }
          ]
        },
        {
          "id": 65,
          "name": "转账记录",
          "parentId": 61,
          "sort": 0,
          "type": 1,
          "url": "/finance/transfer",
          "perms": "",
          "children": [
            {
              "id": 111,
              "name": "查看",
              "parentId": 65,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "finance:transfer:view",
              "children": null
            }
          ]
        },

        {
          "id": 67,
          "name": "资金分布",
          "parentId": 61,
          "sort": 0,
          "type": 1,
          "url": "/finance/userPosition",
          "perms": "",
          "children": [
            {
              "id": 113,
              "name": "查看",
              "parentId": 67,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "finance:userPosition:view",
              "children": null
            }
          ]
        },
        {
          "id": 68,
          "name": "资金变化",
          "parentId": 61,
          "sort": 0,
          "type": 1,
          "url": "/finance/moneyChange",
          "perms": "",
          "children": [
            {
              "id": 114,
              "name": "查看",
              "parentId": 68,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "finance:moneyChange:view",
              "children": null
            }
          ]
        }, {
          "name": "手续费账户",
          "sort": 0,
          "type": 1,
          "url": "/finance/fee",
          "perms": "",
          "children": [
            {
              "name": "查看",
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "finance:fee:view",
              "children": null
            },
            {
              "name": "划转",
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "finance:fee:transfer",
              "children": null
            }, {
              "name": "划转详细",
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "finance:fee:history",
              "children": null
            }
          ]
        }
      ]
    },
    {
      "id": 76,
      "name": "CMS系统",
      "parentId": 0,
      "sort": 0,
      "type": 0,
      "url": "/cms/",
      "icon": "el-icon-lx-copy",
      "perms": "",
      "children": [
        {
          "id": 77,
          "name": "文章管理",
          "parentId": 76,
          "sort": 0,
          "type": 1,
          "url": "/cms/article",
          "perms": "",
          "children": [
            {
              "id": 120,
              "name": "查看",
              "parentId": 77,
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "cms:article:view",
              "children": null
            },
            {
              "id": 174,
              "name": "删除",
              "parentId": 77,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "cms:article:del",
              "children": null
            },
            {
              "id": 175,
              "name": "添加",
              "parentId": 77,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "cms:article:add",
              "children": null
            },
            {
              "id": 176,
              "name": "修改",
              "parentId": 77,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "cms:article:edit",
              "children": null
            }
          ]
        }
      ]
    },
    {
      "name": "工单管理",
      "sort": 0,
      "type": 0,
      "url": "/zendesk/",
      "icon": "el-icon-lx-copy",
      "perms": "",
      "children": [
        {
          "name": "工单列表",
          "sort": 0,
          "type": 1,
          "url": "/zendesk/ticket",
          "perms": "",
          "children": [
            {
              "name": "查看",
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "zendesk:ticket:view",
              "children": null
            },
            {
              "name": "关闭",
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "zendesk:ticket:close",
              "children": null
            },
            // {
            //   "name":"添加",
            //   "type": 2,
            //   "sort":0,
            //   "url":"",
            //   "perms":"zendesk:ticket:add",
            //   "children":null
            // },
            // {
            //   "name":"修改",
            //   "type": 2,
            //   "sort":0,
            //   "url":"",
            //   "perms":"zendesk:ticket:edit",
            //   "children":null
            // }
          ]
        }
      ]
    },
    {
      "id": 78,
      "name": "币种管理",
      "parentId": 0,
      "sort": 0,
      "url": "/coin/",
      "type": 0,
      "icon": "el-icon-lx-copy",
      "perms": "",
      "children": [
        {
          "id": 79,
          "name": "币种列表",
          "parentId": 78,
          "sort": 0,
          "type": 1,
          "url": "/coin/coins",
          "perms": "",
          "children": [
            {
              "id": 121,
              "name": "查看",
              "parentId": 79,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "coin:coins:view",
              "children": null
            },
            {
              "id": 165,
              "name": "添加",
              "parentId": 79,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "coin:coins:add",
              "children": null
            },
            {
              "name": "修改",
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "coin:coins:edit",
              "children": null
            },
            {
              "id": 167,
              "name": "删除",
              "parentId": 79,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "coin:coins:del",
              "children": null
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
      "id": 83,
      "name": "系统设置",
      "parentId": 0,
      "sort": 0,
      "type": 0,
      "url": "/sysSettings/",
      "icon": "el-icon-lx-copy",
      "perms": "",
      "children": [
        {
          "id": 84,
          "name": "邮箱设置",
          "parentId": 83,
          "sort": 0,
          "type": 1,
          "url": "/sysSettings/email",
          "perms": "",
          "children": [
            {
              "id": 124,
              "name": "查看",
              "parentId": 84,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sysSettings:email:view",
              "children": null
            },
            {
              "id": 183,
              "name": "修改",
              "parentId": 84,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:email:edit",
              "children": null
            }
          ]
        },
        {
          "id": 85,
          "name": "短信设置",
          "parentId": 83,
          "sort": 0,
          "type": 1,
          "url": "/sysSettings/mobileSetting",
          "perms": "",
          "children": [
            {
              "id": 125,
              "name": "查看",
              "parentId": 85,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sysSettings:mobileSetting:view",
              "children": null
            },
            {
              "id": 184,
              "name": "修改",
              "parentId": 85,
              "sort": 0,
              "url": "",
              "type": 2,
              "perms": "sysSettings:mobileSetting:edit",
              "children": null
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
          "id": 87,
          "name": "推荐奖励",
          "parentId": 83,
          "sort": 0,
          "type": 1,
          "url": "/sysSettings/recommended",
          "perms": "",
          "children": [
            {
              "id": 127,
              "name": "查看",
              "type": 2,
              "parentId": 87,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:recommended:view",
              "children": null
            },
            {
              "id": 185,
              "name": "修改",
              "type": 2,
              "parentId": 87,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:recommended:edit",
              "children": null
            }
          ]
        },
        {
          "id": 89,
          "name": "基本设置",
          "parentId": 83,
          "sort": 0,
          "type": 1,
          "url": "/sysSettings/setting",
          "perms": "",
          "children": [
            {
              "id": 129,
              "name": "查看",
              "parentId": 89,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:setting:view",
              "children": null
            },
            {
              "id": 187,
              "name": "修改",
              "type": 2,
              "parentId": 89,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:setting:edit",
              "children": null
            }
          ]
        },
        {
          "name": "APP更新",
          "sort": 0,
          "type": 1,
          "url": "/sysSettings/version",
          "perms": "",
          "children": [
            {
              "name": "更新",
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:version:update",
              "children": null
            },
            {
              "name": "删除",
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:version:del",
              "children": null
            },
            {
              "name": "查看",
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:version:view",
              "children": null
            },
          ]
        },
        {
          "id": 90,
          "name": "友情链接",
          "parentId": 83,
          "sort": 0,
          "type": 1,
          "url": "/sysSettings/linkSettings",
          "perms": "",
          "children": [
            {
              "id": 130,
              "name": "查看",
              "parentId": 90,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sysSettings:linkSettings:view",
              "children": null
            },
            {
              "id": 188,
              "name": "修改",
              "type": 2,
              "parentId": 90,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:linkSettings:edit",
              "children": null
            },
            {
              "id": 189,
              "name": "添加",
              "parentId": 90,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:linkSettings:add",
              "children": null
            },
            {
              "id": 190,
              "name": "删除",
              "parentId": 90,
              "type": 2,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:linkSettings:del",
              "children": null
            }
          ]
        },
        {
          "id": 91,
          "name": "Banner",
          "parentId": 83,
          "sort": 0,
          "type": 1,
          "url": "/sysSettings/banner",
          "perms": "",
          "children": [
            {
              "id": 131,
              "name": "查看",
              "type": 2,
              "parentId": 91,
              "sort": 0,
              "url": "",
              "perms": "sysSettings:banner:view",
              "children": null
            },
            {
              "id": 163,
              "name": "添加",
              "parentId": 91,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sysSettings:banner:add",
              "children": null
            },
            {
              "id": 164,
              "name": "删除",
              "parentId": 91,
              "sort": 0,
              "type": 2,
              "url": "",
              "perms": "sysSettings:banner:del",
              "children": null
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
}

export default {
  init,
  // 个人信息
  async getInfo() {
    return await httpClient.get('/admin/base/info');
  },
  // 登入
  async login(account, code, password) {
    return await httpClient.post('/admin/base/signin', {
      account,
      code,
      password
    });
  },
  //获取登录验证码
  async getLoginCode(account, password) {
    return await httpClient.post('/admin/base/signin/code/get', {
      account,
      password
    });
  },
  // 获取用户列表
  async getUserList(data) {
    return await httpClient.get('/admin/base/users/list', data);
  },
  // 获取实名认证人数
  async getUserStatis() {
    return await httpClient.get('/admin/base/users/stat');
  },

  //获取单个用户信息
  async getUserInfo(id) {
    // /admin/getUserInfo
    return await httpClient.get('/admin/base/userinfo/tiny', {
      id
    });
  },

  //修改用户信息
  async changeUserInfo(data) {
    return await httpClient.post('/admin/base/userinfo/change', data);
  },

  //管理员列表
  async adminList() {
    return await httpClient.get('/admin/base/admin/list');
  },

  //新增管理员
  async addAdmin(account, roleId) {
    return await httpClient.post('/admin/base/admin/add', {
      account,
      roleId
    });
  },

  //修改管理员
  async editAdmin(id, roleId) {
    return await httpClient.post('/admin/base/admin/edit', {
      id,
      roleId
    });
  },

  //删除管理员
  async delAdmin(_id) {
    return await httpClient.post('/admin/base/admin/del', {
      _id
    });
  },

  //获取用户认证列表
  async getUsersByAuthLevel(data) {
    return await httpClient.get('/admin/base/realname/list', data);
  },

  //搜索用户
  async searchUser(params) {
    return await httpClient.get('/admin/base/search/user', params);
  },

  //审核用户认证信息
  async setCertificate(data) {
    return await httpClient.post('/admin/base/realname/check', data);
  },

  // 修改实名认证信息
  async realnameEdit(data) {
    return await httpClient.post('/admin/base/realname/edit', data);
  },

  //获取转账记录
  async transferHistory(p, limit, skip, uid, toUid) {
    return await httpClient.get('/admin/base/transfer/history', {
      p,
      limit,
      skip,
      uid,
      toUid
    });
  },

  //获取新闻列表
  async newsList(p, limit, coin, type) {
    return await httpClient.get('/admin/base/news/list', {
      p,
      limit,
      coin,
      type
    });
  },
  //查看单条新闻列表
  async newsShow(id) {
    return await httpClient.get('/admin/base/news/show', {
      id
    });
  },

  //新闻公告搜索
  async searchNews(data) {
    return await httpClient.get('/admin/base/news/search', data);
  },

  //添加新闻
  async addNews(data) {
    return await httpClient.post('/admin/base/news/add', data);
  },

  //删除新闻
  async delNews(data) {
    return await httpClient.post('/admin/base/news/del', data);
  },

  //修改编辑新闻
  async editNews(data) {
    return await httpClient.post('/admin/base/news/edit', data);
  },

  //coins
  async getCoins(data) {
    return await httpClient.get('/admin/base/coins', data);
  },

  //添加或修改币种
  async addCoin(data) {
    return await httpClient.post('/admin/base/coins/add', data);
  },
  async editCoin(data) {
    return await httpClient.post('/admin/base/coins/edit', data);
  },
  //搜索币种
  async searchCoin(data) {
    return await httpClient.get('/admin/base/coins/search', data);
  },

  //删除币种
  async delCoin(coin) {
    return await httpClient.post('/admin/base/coins/del', {
      coin: coin
    });
  },

  //获取网站基本设置
  async siteInfo() {
    return await httpClient.get('/admin/base/siteInfo');
  },

  //修改网站基本设置
  async changeSiteInfo(data) {
    return await httpClient.post('/admin/base/siteinfo/change', data);
  },

  //添加友情链接
  async addLink(title, url) {
    return await httpClient.post('/admin/base/link/add', {
      title,
      url
    });
  },

  //修改/编辑友情链接
  async editLink(id, title, url) {
    return await httpClient.post('/admin/base/link/edit', {
      _id: id,
      title: title,
      url: url
    });
  },

  //删除友情链接
  async delLink(id) {
    return await httpClient.post('/admin/base/link/del', {
      _id: id
    });
  },

  //添加banner
  async addBanner(banner) {
    return await httpClient.post('/admin/base/banner/add', {
      banner
    });
  },

  //bannerList
  async bannerList(data) {
    return await httpClient.get('/admin/base/banner/list', data);
  },

  //删除banner
  async delBanner(id) {
    return await httpClient.post('/admin/base/banner/del', {
      id
    });
  },

  //财务资产列表(对账)
  async financeBalances(id) {
    return await httpClient.get('/admin/base/finance/balances');
  },

  //财务资产列表(资金分布)
  async balancePosition(data) {
    return await httpClient.post('/admin/base/getPosition', data);
  },

  //加钱扣钱
  async balanceAdd(data) {
    return await httpClient.post('/admin/base/balance/add', data);
  },



  //赠送记录
  async giveHistory(data) {
    return await httpClient.get('/admin/base/give/history', data);
  },

  //单个用户财务列表
  async userFinance(uid) {
    return await httpClient.get('/admin/base/user/finance/balances', {
      uid
    });
  },

  async permissionsList() {
    return (await httpClient.get('/admin/base/permissions/list')).data;
  },

  //添加菜单
  async addMenu(data) {
    return (await httpClient.post('/admin/base/menu/add', data)).data;
  },

  //菜单列表
  async menuList(data) {
    return (await httpClient.get('/admin/base/menu/list', data)).data;
  },

  //删除菜单
  async delMenu(id) {
    return (await httpClient.post('/admin/base/menu/del', {
      id
    })).data;
  },

  //修改菜单
  async editMenu(data) {
    return (await httpClient.post('/admin/base/menu/edit', data)).data;
  },

  //添加角色
  async roleAdd(data) {
    return (await httpClient.post('/admin/base/role/add', data)).data;
  },
  //角色列表
  async roleList(data) {
    return (await httpClient.get('/admin/base/role/list', data)).data;
  },
  //修改角色
  async roleEdit(data) {
    return (await httpClient.post('/admin/base/role/edit', data)).data;
  },
  //删除角色
  async roleDel(id) {
    return (await httpClient.post('/admin/base/role/del', {
      id
    })).data;
  },
  //获取当前角色列表
  async getRole() {
    return (await httpClient.get('/admin/base/role/menu')).data;
  },
  //添加后台perms
  async bindURLPerms(data) {
    return (await httpClient.post('/admin/base/route/add', data)).data;
  },
  //添加后台perms
  async getAdminRole(data) {
    return (await httpClient.get('/admin/base/route/list', data)).data;
  },
  //创建菜单
  async menuCreate(data) {
    return (await httpClient.post('/admin/base/menu/create', data)).data;
  },
  // 资金变化
  async financeSnapshoot(data) {
    return await httpClient.get('/admin/base/finance/snapshoot', data);
  },
  // 工单管理

  // 工单列表
  async workorderList(data) {
    return await httpClient.get('/admin/base/workorder/list', data);
  },
  // 工单回复
  async workorderReply(data) {
    return await httpClient.post('/admin/base/workorder/reply', data);
  },

  // 工单详细
  async workorderDetail(data) {
    return await httpClient.get('/admin/base/workorder/detail', data);
  },
  // 工单回复列表
  async workorderReplyList(data) {
    return await httpClient.get('/admin/base/workorder/reply/list', data);
  },
  // 关闭工单
  async workorderClose(data) {
    return await httpClient.post('/admin/base/workorder/close', data);
  },

  // 更新用户等级
  async userLevelUpdate(data) {
    return await httpClient.post('/admin/base/userLevels/update', data);
  },
  // 删除用户等级
  async userLevelDel(data) {
    return await httpClient.post('/admin/base/userLevels/del', data);
  },

  // 获取用户等级列表
  async userLevelList(data) {
    return await httpClient.get('/admin/base/userLevels/list', data);
  },

  // 更新APP
  async appUpdate(data) {
    return await httpClient.post('/admin/base/app/update', data);
  },
  // 获取app版本
  async appVersion(data) {
    return await httpClient.get('/base/app/version', data);
  },
  // app列表
  async appList(data) {
    return await httpClient.get('/admin/base/app/list', data);
  },

  // 删除APP版本
  async appDel(data) {
    return await httpClient.post('/admin/base/app/del', data);
  },
  // 获取币种标签
  async coinsTags(data) {
    return await httpClient.get('/coins/tags', data);
  },
  // 获取关系树
  async referrerTree(data) {
    return await httpClient.post('/admin/base/referrer/tree', data);
  },
  // 手续费账户
  async freeAccount(data) {
    return await httpClient.get('/admin/base/finance/fee/account', data);
  },
  // 划转
  async freeTransfer(data) {
    return await httpClient.post('/admin/base/finance/fee/transfer', data);
  },
  // 划转记录
  async feeTransferHistory(data) {
    return await httpClient.get('/admin/base/finance/fee/transfer/history', data);
  },

}
