import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.lockUrl);

function init() {
  let data = [
    {
      "name": "锁仓管理",
      "sort": 0,
      "icon": "el-icon-lx-copy",
      "url": "/lock/",
      "type": 0,
      "perms": "",
      "children": [
        {
          "name": "锁仓规则",
          "sort": 0,
          "icon": "",
          "parentName": "锁仓管理",
          "url": "/lock/rules",
          "type": 1,
          "perms": "",
          "children": [
            {
              "name": "查看",
              "sort": 0,
              "icon": "",
              "parentName": "锁仓规则",
              "url": "",
              "type": 2,
              "perms": "lock:rules:view",
              "children": null
            },
            {
              "name": "新增",
              "sort": 0,
              "icon": "",
              "parentName": "锁仓规则",
              "url": "",
              "type": 2,
              "perms": "lock:rules:add",
              "children": null
            },
            {
              "name": "修改",
              "sort": 0,
              "icon": "",
              "parentName": "锁仓规则",
              "url": "",
              "type": 2,
              "perms": "lock:rules:edit",
              "children": null
            },
            {
              "name": "删除",
              "sort": 0,
              "icon": "",
              "parentName": "锁仓规则",
              "url": "",
              "type": 2,
              "perms": "lock:rules:del",
              "children": null
            },
            {
              "name": "解锁",
              "sort": 0,
              "icon": "",
              "parentName": "锁仓规则",
              "url": "",
              "type": 2,
              "perms": "lock:rules:unlock",
              "children": null
            },
          ]
        },
        // {
        //   "name": "模式列表",
        //   "sort": 0,
        //   "icon": "",
        //   "parentName": "锁仓管理",
        //   "url": "/lock/pattern",
        //   "type": 1,
        //   "perms": "",
        //   "children": [
        //     {
        //       "name": "查看",
        //       "sort": 0,
        //       "icon": "",
        //       "parentName": "模式列表",
        //       "url": "",
        //       "type": 2,
        //       "perms": "lock:pattern:view",
        //       "children": null
        //     },

        //   ]
        // },
        {
          "name": "释放记录",
          "sort": 0,
          "icon": "",
          "parentName": "锁仓管理",
          "url": "/lock/release",
          "type": 1,
          "perms": "",
          "children": [
            {
              "name": "查看",
              "sort": 0,
              "icon": "",
              "parentName": "释放记录",
              "url": "",
              "type": 2,
              "perms": "lock:release:view",
              "children": null
            },

          ]
        }, {
          "name": "锁仓查询",
          "sort": 0,
          "icon": "",
          "parentName": "锁仓管理",
          "url": "/lock/query",
          "type": 1,
          "perms": "",
          "children": [
            {
              "name": "查看",
              "sort": 0,
              "icon": "",
              "parentName": "锁仓查询",
              "url": "",
              "type": 2,
              "perms": "lock:query:view",
              "children": null
            }, {
              "name": "解锁",
              "sort": 0,
              "icon": "",
              "parentName": "锁仓查询",
              "url": "",
              "type": 2,
              "perms": "lock:query:unlock",
              "children": null
            },
          ]
        }, {
          "name": "业绩",
          "sort": 0,
          "icon": "",
          "parentName": "锁仓管理",
          "url": "/lock/result",
          "type": 1,
          "perms": "",
          "children": [
            {
              "name": "查看",
              "sort": 0,
              "icon": "",
              "parentName": "业绩",
              "url": "",
              "type": 2,
              "perms": "lock:result:view",
              "children": null
            },

          ]
        },
      ]
    }
  ];
  return data;
}
export default {
  init,
  // 新增锁仓规则
  async lockRuleAdd(data) {
    return await httpClient.post('/admin/lockRule/create', data);
  },

  // 锁仓规则列表
  async lockRuleList(data) {
    return await httpClient.get('/admin/lockRule/list', data);
  },
  // 删除锁仓规则
  async lockRuleDel(data) {
    return await httpClient.post('/admin/lockRule/del', data);
  },
  // 修改锁仓规则
  async lockRuleEdit(data) {
    return await httpClient.post('/admin/lockRule/edit', data);
  },
  // 解锁
  async unlock(data) {
    return await httpClient.post('/admin/unlock', data);
  },
  // 解锁记录
  async unlockHistory(data) {
    return await httpClient.get('/admin/unlock/history', data);
  },
  // 锁仓详细(new)
  async lockUserHistory(data) {
    return await httpClient.get('/admin/lockRule/history', data);
  },
  // 锁仓业绩
  async lockRule(data) {
    return await httpClient.get('/admin/lockRule/result', data);
  },
  // 锁仓查询
  async lockUserQuery(data) {
    return await httpClient.get('/admin/lockUser/list', data);
  },
  // 锁仓查询-解锁
  async lockExit(data) {
    return await httpClient.post('/admin/lockUser/exit', data);
  },
}
