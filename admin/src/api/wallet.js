import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.walletUrl)

function init() {
    let data = [{
        "name": "钱包管理",
        "parentId": 0,
        "sort": 0,
        "type": 0,
        "url": "/wallet/",
        "icon": "el-icon-lx-copy",
        "perms": "",
        "children": [{
                "id": 39,
                "name": "提现请求",
                "sort": 0,
                "url": "/wallet/request",
                "perms": "",
                "type": 1,
                "children": [{
                    "id": 40,
                    "name": "查看",
                    "parentId": 39,
                    "sort": 0,
                    "url": "",
                    "type": 2,
                    "perms": "wallet:request:view",
                    "children": null
                },
                {
                    "name": "取消",
                    "sort": 0,
                    "url": "",
                    "type": 2,
                    "perms": "wallet:request:cancel",
                    "children": null
                },
                {
                    "name": "通过",
                    "sort": 0,
                    "url": "",
                    "type": 2,
                    "perms": "wallet:request:pass",
                    "children": null
                }]
            },
            {
                "id": 42,
                "name": "历史记录",
                "sort": 0,
                "type": 1,
                "url": "/wallet/history",
                "perms": "",
                "children": [{
                    "id": 46,
                    "name": "查看",
                    "parentId": 42,
                    "sort": 0,
                    "type": 2,
                    "perms": "wallet:history:view",
                    "children": null
                }]
            },
            {

                "name": "币种设置",
                "sort": 0,
                "type": 1,
                "url": "/wallet/coinSetting",
                "perms": "",
                "children": [{
                    "name": "查看",
                    "sort": 0,
                    "type": 2,
                    "perms": "wallet:coinSetting:view",
                    "children": null
                },{
                  "name": "添加或修改",
                  "sort": 0,
                  "type": 2,
                  "perms": "wallet:coinSetting:update",
                  "children": null
              },{
                "name": "删除",
                "sort": 0,
                "type": 2,
                "perms": "wallet:coinSetting:del",
                "children": null
            }]
            }
        ]
    }];

    return data;
}
export default {
    init,
    //钱包充提记录
    async walletHistory(data) {
        return await httpClient.get('/admin/wallet/history', data);
    },
    //提现请求
    async getRequest(data) {
        return await httpClient.get('/admin/wallet/request', data);
    },
    //取消提现
    async walletCancel(data) {
        return await httpClient.post('/admin/wallet/cancel', data);
    },
    //提现通过
    async walletPass(data) {
        return await httpClient.post('/admin/wallet/pass', data);
    },
    //钱包币种添加修改
    async walletCoinAdd(data) {
        return await httpClient.post('/admin/wallet/coin/update', data);
    },
    //钱包币种删除
    async walletCoinDel(data) {
        return await httpClient.post('/admin/wallet/coin/del', data);
    },
    //钱包币种列表
    async walletCoinList(data) {
      return await httpClient.get('/admin/wallet/coin/list', data);
  },
}
