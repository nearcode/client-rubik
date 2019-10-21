import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.exchangeUrl);

function init(){
    let data=[
        {
          "id": 81,
          "name": "交易管理",
          "parentId": 0,
          "sort": 0,
          "icon": "el-icon-lx-copy",
          "parentName": "根目录",
          "url": "/exchange/",
          "type": 0,
          "perms": "",
          "children": [
            {
              "id": 82,
              "name": "交易对列表",
              "parentId": 81,
              "sort": 0,
              "icon": "",
              "parentName": "交易管理",
              "url": "/exchange/tradePair",
              "type": 1,
              "perms": "exchange:tradePair:add",
              "children": [
                {
                  "id": 123,
                  "name": "查看",
                  "parentId": 82,
                  "sort": 0,
                  "icon": "",
                  "parentName": "交易对列表",
                  "url": "",
                  "type": 2,
                  "perms": "exchange:tradePair:view",
                  "children": null
                },
                {
                  "id": 171,
                  "name": "添加或修改",
                  "parentId": 82,
                  "sort": 0,
                  "icon": "",
                  "parentName": "交易对列表",
                  "url": "",
                  "type": 2,
                  "perms": "exchange:tradePair:addAndEdit",
                  "children": null
                },
                {
                  "id": 173,
                  "name": "删除",
                  "parentId": 82,
                  "sort": 0,
                  "icon": "",
                  "parentName": "交易对列表",
                  "url": "",
                  "type": 2,
                  "perms": "exchange:tradePair:del",
                  "children": null
                }
              ]
            },
            {
           
              "name": "交易历史",
              "sort": 0,
              "icon": "",
              "url": "/exchange/history",
              "type": 1,
              "perms": "",
              "children": [
                { 
                  "name": "查看",
                  "sort": 0,
                  "icon": "",
                  "url": "",
                  "type": 2,
                  "perms": "exchange:history:view",
                  "children": null
                },
                // {
                //   "name": "添加或修改",
                //   "sort": 0,
                //   "icon": "",
                //   "url": "",
                //   "type": 2,
                //   "perms": "exchange:history:update",
                //   "children": null
                // },
                // {
                //   "name": "删除",
                //   "sort": 0,
                //   "icon": "",
                //   "url": "",
                //   "type": 2,
                //   "perms": "exchange:history:del",
                //   "children": null
                // }
              ]
            }
          ]
        }
      ]

      return data;
}

export default {
    init,
    // 删除交易对
    async delPair(base,coin) {
        return await httpClient.post("/admin/exchange/markets/del",{
            base:base,
            coin:coin
        })
    },
    // 添加或修改交易对
    async editPair(data) {
        return await httpClient.post("/admin/exchange/markets/update",data)
    },

    //获取交易对
    async getMarkets(){
        return (await httpClient.get('/markets')).data;
    },
    // 获取交易历史
    async getOrderHistory(data){
        return (await httpClient.get('/admin/exchange/orderHistory',data));
    },

}
