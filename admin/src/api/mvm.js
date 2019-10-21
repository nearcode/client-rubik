import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.mvmUrl);

function init() {
  let data = [
    {
      "name": "币值管理",
      "sort": 0,
      "icon": "el-icon-lx-copy",
      "url": "/mvm/",
      "type": 0,
      "perms": "",
      "children": [
        {
          "name": "充提统计",
          "sort": 0,
          "icon": "",
          "parentName": "币值管理",
          "url": "/mvm/charge",
          "type": 1,
          "perms": "",
          "children": [
            {
              "id": 133,
              "name": "查看",
              "parentId": 94,
              "sort": 0,
              "icon": "",
              "parentName": "充提统计",
              "url": "",
              "type": 2,
              "perms": "mvm:charge:view",
              "children": null
            },

          ]
        }, {
          "name": "交易统计",
          "sort": 0,
          "icon": "",
          "parentName": "币值管理",
          "url": "/mvm/trade",
          "type": 1,
          "perms": "",
          "children": [
            {
              "id": 133,
              "name": "查看",
              "parentId": 94,
              "sort": 0,
              "icon": "",
              "parentName": "交易统计",
              "url": "",
              "type": 2,
              "perms": "mvm:trade:view",
              "children": null
            },

          ]
        },
        {
          "name": "挂单统计",
          "sort": 0,
          "icon": "",
          "parentName": "币值管理",
          "url": "/mvm/order",
          "type": 1,
          "perms": "",
          "children": [
            {
              "id": 133,
              "name": "查看",
              "parentId": 94,
              "sort": 0,
              "icon": "",
              "parentName": "挂单统计",
              "url": "",
              "type": 2,
              "perms": "mvm:order:view",
              "children": null
            },

          ]
        },
        {
          "name": "持仓统计",
          "sort": 0,
          "icon": "",
          "parentName": "币值管理",
          "url": "/mvm/holder",
          "type": 1,
          "perms": "",
          "children": [
            {
              "id": 133,
              "name": "查看",
              "parentId": 94,
              "sort": 0,
              "icon": "",
              "parentName": "持仓统计",
              "url": "",
              "type": 2,
              "perms": "mvm:holder:view",
              "children": null
            },

          ]
        }, {
          "name": "项目方",
          "sort": 0,
          "icon": "",
          "parentName": "币值管理",
          "url": "/mvm/issuer",
          "type": 1,
          "perms": "",
          "children": [
            {
              "name": "查看",
              "sort": 0,
              "icon": "",
              "parentName": "项目方",
              "url": "",
              "type": 2,
              "perms": "mvm:issuer:view",
              "children": null
            },
            {
              "name": "添加或修改",
              "sort": 0,
              "icon": "",
              "parentName": "项目方",
              "url": "",
              "type": 2,
              "perms": "mvm:issuer:upDate",
              "children": null
            },
            {
              "name": "删除",
              "sort": 0,
              "icon": "",
              "parentName": "项目方",
              "url": "",
              "type": 2,
              "perms": "mvm:issuer:del",
              "children": null
            },
          ]
        }
      ]
    }
  ];
  return data;
}

export default {
  init,
  // 新增发行方
  async issuerAdd(data) {
    return await httpClient.post('/admin/mvm/issuer/coins/upsert', data);
  },
  // 获取项目方列表
  async issuerList(data) {
    return await httpClient.get('/admin/mvm/issuer/list', data);
  },
  // 删除项目方
  async issuerDel(data) {
    return await httpClient.post('/admin/mvm/issuer/del', data);
  },
  // 充提统计
  async depositAndWithdrawStat(data) {
    return await httpClient.get('/admin/mvm/depositAndWithdraw/stat', data);
  },
  //  挂单统计
  async orderingStat(data) {
    return await httpClient.get('/admin/mvm/ordering/stat', data);
  },
  // 交易统计
  async tradeStat(data) {
    return await httpClient.get('/admin/mvm/trade/stat', data);
  },
  // 持仓统计
  async holderStat(data) {
    return await httpClient.get('/admin/mvm/holder/stat', data);
  },
  // 当前账号支持的币种
  async issuerGet(data) {
    return (await httpClient.get('/admin/mvm/issuer/get', data)).data;
  },
}
