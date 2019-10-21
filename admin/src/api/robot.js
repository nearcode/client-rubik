import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.robotUrl);

function init() {
  let data = [
    {

      "name": "机器人管理",
      "parentId": 0,
      "sort": 0,
      "icon": "el-icon-lx-copy",
      "parentName": "根目录",
      "url": "/robot/",
      "type": 0,
      "perms": "",
      "children": [{
        "name": "交易所",
        "sort": 0,
        "icon": "",
        "parentName": "机器人管理",
        "url": "/robot/exchange",
        "type": 1,
        "perms": "",
        "children": [{
          "name": "查看",
          "sort": 0,
          "icon": "",
          "parentName": "交易所",
          "url": "",
          "type": 2,
          "perms": "robot:exchange:view",
          "children": null
        },{
          "name": "新增",
          "sort": 0,
          "icon": "",
          "parentName": "交易所",
          "url": "",
          "type": 2,
          "perms": "robot:exchange:add",
          "children": null
        },{
          "name": "修改",
          "sort": 0,
          "icon": "",
          "parentName": "交易所",
          "url": "",
          "type": 2,
          "perms": "robot:exchange:edit",
          "children": null
        },{
          "name": "删除",
          "sort": 0,
          "icon": "",
          "parentName": "交易所",
          "url": "",
          "type": 2,
          "perms": "robot:exchange:del",
          "children": null
        },{
          "name": "更新状态",
          "sort": 0,
          "icon": "",
          "parentName": "交易所",
          "url": "",
          "type": 2,
          "perms": "robot:exchange:state",
          "children": null
        }]
      }, {
        "name": "设置",
        "sort": 0,
        "icon": "",
        "parentName": "机器人管理",
        "url": "/robot/setting",
        "type": 1,
        "perms": "",
        "children": [{
          "name": "查看",
          "sort": 0,
          "icon": "",
          "parentName": "设置",
          "url": "",
          "type": 2,
          "perms": "robot:setting:view",
          "children": null
        },{
          "name": "更新",
          "sort": 0,
          "icon": "",
          "parentName": "设置",
          "url": "",
          "type": 2,
          "perms": "robot:setting:update",
          "children": null
        },{
          "name": "更新状态",
          "sort": 0,
          "icon": "",
          "parentName": "设置",
          "url": "",
          "type": 2,
          "perms": "robot:setting:state",
          "children": null
        }]
      }]
    }
  ];
  return data;
}

export default {
  init,
  // 更新机器人信息
  async robotUpdate(data) {
    return await httpClient.post("/admin/robot/update", data)
  },

  // 更新机器人状态
  async robotState(data) {
    return await httpClient.post("/admin/robot/state", data)
  },

  // 更新交易所状态
  async exchangeState(data) {
    return await httpClient.post("/admin/robot/exchange/state", data)
  },

  // 交易所列表
  async exchangeList(data) {
    return await httpClient.get("/admin/robot/exchange/list", data)
  },
  // 添加交易所
  async exchangeAdd(data) {
    return await httpClient.post("/admin/robot/exchange/add", data)
  },
  // 修改交易所
  async exchangeEdit(data) {
    return await httpClient.post("/admin/robot/exchange/edit", data)
  },
  // 删除交易所
  async exchangeDel(data) {
    return await httpClient.post("/admin/robot/exchange/del", data)
  },
   // 获取机器人信息
   async getRobot(data) {
    return await httpClient.get("/admin/robot", data)
  },
}
