import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.biPayUrl);

function init(){
    // /bipay/coinsetting
    return [{
        "name":"BIPAY管理",
        "sort":0,
        "type": 0,
        "url":"/bipay/",
        "icon": "el-icon-lx-copy",
        "perms":"",
        "children":[{
            "name":"币种设置",
            "sort":0,
            "type": 1,
            "url":"/bipay/coinsetting",
            "perms":"",
            "children":[
              {
                "name":"查看",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"bipay:coinsetting:view",
                "children":null
              },
              {
                "name":"更新",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"bipay:coinsetting:update",
                "children":null
              }
            ]
          },{
            "name":"充提记录",
            "sort":0,
            "type": 1,
            "url":"/bipay/history",
            "perms":"",
            "children":[
              {
                "name":"查看",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"bipay:history:view",
                "children":null
              }
            ]
          },{
            "name":"提现请求",
            "sort":0,
            "type": 1,
            "url":"/bipay/request",
            "perms":"",
            "children":[
              {
                "name":"查看",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"bipay:request:view",
                "children":null
              },
              {
                "name":"通过",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"bipay:request:pass",
                "children":null
              },
              {
                "name":"确认",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"bipay:request:confirm",
                "children":null
              },
              {
                "name":"取消",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"bipay:request:cancel",
                "children":null
              }
            ]
          },]
        }]
}

export default {
    init,
    // 更新支持币种
    async coinsUpdate(data) {
        return await httpClient.post('/admin/bipay/coins/update',data);
    },
     // 获取币种
     async getCoins(data) {
        return await httpClient.get('/coins',data);
    },
      // 获取充提记录
      async bankHistory(data) {
        return await httpClient.get('/admin/bipay/bank/history',data);
    },
//     /admin/bank/history/pass
// /admin/bank/history/cancel
  // 提现通过
  async bankHistoryPass(data) {
    return await httpClient.post('/admin/bipay/bank/pass',data);
  },
  // 提现取消
  async bankHistoryCancel(data) {
    return await httpClient.post('/admin/bipay/bank/cancel',data);
  },
  // 提现确认
  async bankConfirm(data) {
    return await httpClient.post('/admin/bipay/bank/confirm',data);
  },
  // 提现请求
  async withdrawRequest(data) {
    return await httpClient.get('/admin/bipay/withdraw/request',data);
  },
}
