import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.c2cUrl);
function init() {
    let data = [{
        "id": 38,
        "name": "C2C管理",
        "parentId": 0,
        "sort": 0,
        "url": "/c2c/",
        "icon": "el-icon-lx-copy",
        "perms": "",
        "children": [{
                "id": 49,
                "name": "设置",
                "parentId": 38,
                "sort": 0,
                "type": 1,
                "url": "/c2c/setting",
                "perms": "",
                "children": [{
                        "id": 51,
                        "name": "查看",
                        "parentId": 49,
                        "sort": 0,
                        "url": "",
                        "type": 2,
                        "perms": "c2c:setting:view",
                        "children": null
                    },
                    {
                        "id": 52,
                        "name": "修改",
                        "parentId": 49,
                        "sort": 0,
                        "url": "",
                        "type": 2,
                        "perms": "c2c:setting:edit",
                        "children": null
                    }
                ]
            },
            {
                "id": 50,
                "name": "服务商",
                "parentId": 38,
                "sort": 0,
                "type": 1,
                "url": "/c2c/merchant",
                "perms": "",
                "children": [{
                        "id": 53,
                        "name": "查看",
                        "parentId": 50,
                        "sort": 0,
                        "url": "",
                        "type": 2,
                        "perms": "c2c:merchant:view",
                        "children": null
                    },
                    {
                        "id": 54,
                        "name": "删除",
                        "parentId": 50,
                        "sort": 0,
                        "type": 2,
                        "url": "",
                        "perms": "c2c:merchant:del",
                        "children": null
                    },
                    {
                        "id": 138,
                        "name": "添加",
                        "parentId": 50,
                        "sort": 0,
                        "type": 2,
                        "url": "",
                        "perms": "c2c:merchant:add",
                        "children": null
                    }
                ]
            },
            {
                "id": 198,
                "name": "交易记录",
                "parentId": 38,
                "type": 1,
                "sort": 0,
                "url": "/c2c/history",
                "perms": "",
                "children": [{
                    "id": 201,
                    "name": "查看",
                    "parentId": 198,
                    "type": 2,
                    "sort": 0,
                    "url": "",
                    "perms": "c2c:history:view",
                    "children": null
                }]
            },
            {
                "name": "充提订单",
                "type": 1,
                "sort": 0,
                "url": "/c2c/order",
                "perms": "",
                "children": [{
                    "name": "查看",
                    "sort": 0,
                    "type": 2,
                    "url": "",
                    "perms": "c2c:order:view",
                    "children": null
                },{
                    "name": "转账",
                    "sort": 0,
                    "type": 2,
                    "url": "",
                    "perms": "c2c:order:transfer",
                    "children": null
                }]
            },
            {
                "id": 200,
                "name": "审核列表",
                "parentId": 38,
                "sort": 0,
                "type": 1,
                "url": "/c2c/verify",
                "perms": "",
                "children": [{
                        "id": 203,
                        "name": "查看",
                        "parentId": 200,
                        "sort": 0,
                        "url": "",
                        "type": 2,
                        "perms": "c2c:verify:view",
                        "children": null
                    },
                    {
                        "id": 204,
                        "name": "审核",
                        "parentId": 200,
                        "sort": 0,
                        "type": 2,
                        "url": "",
                        "perms": "c2c:verify:audit",
                        "children": null
                    }
                ]
            }
        ]
    }]
    return data;
}
export default {
    init,
    // 获取c2c设置状态
    async getC2C() {
        return await httpClient.get("/c2c")
    },
    // 设置C2C
    async setC2C(data) {
        return await httpClient.post("/admin/c2c/set",data)
    },
    // 下买单和卖单
    async buyAndSell(amount,coin,price,type) {
        return await httpClient.post("/buyAndSell",{
            amount,coin,price,type
        })
    },
   
    // 用户充值提现记录
    async userTradelist(p,limit,result) {
        return await httpClient.get("/user/tradelist",{
            p,limit,result
        })
    },
   
   
    // 确认买单
    async buyConfirm(id) {
        return await httpClient.post("/buy/confirm",{
            id
        })
    },
    // 确认卖单
    async sellConfirm(id) {
        return await httpClient.post("/sell/confirm",{
            id
        })
    },
    // 取消订单
    async orderCancel(id) {
        return await httpClient.post("/cancel",{
            id
        })
    },

    // 新增服务商
    async addMerchant(data) {
        return await httpClient.post("/admin/c2c/merchant/add",data)
    },
    // 删除服务商
    async delMerchant(data) {
        return await httpClient.post("/admin/c2c/merchant/del",data)
    },

    // 获取服务商列表
    async getMerchantList(p,limit) {
        return await httpClient.get("/admin/c2c/merchant/list",{
            p,limit
        })
    },

    // 获取审核列表 / 交易记录
    async getC2cHistory(data) {
        return await httpClient.get("/admin/c2c/history",data)
    },

    // 审核
    async setHistoryResult(data) {
        return await httpClient.post("/admin/c2c/setHistoryResult",data)
    },
    


    // exchange
    // 获取c2c配置信息
    async getC2C() {
        return await httpClient.get("/c2c");
    },
    // 代理商充值提现记录
    async merchantTradeList(data) {
        return await httpClient.get("/merchant/history", data)
    },

    // 用户充值提现记录列表
    async history(p,limit=20,result) {
        let post = {p,limit};
        if (result) {
            post['result'] = result;
        }
        return await httpClient.get("/user/history",post)
    },
    // c2c记录-详细
    async historyDetailed(id) {
        return await httpClient.get("/user/history/"+id)
    },

    // 服务商确认卖单
    async merchantSellConfirm(id) {
        return await httpClient.post("/merchant/sellConfirm",{
            id
        })
    },
    // 服务商确认买单
    async merchantBuyConfirm(id) {
        return await httpClient.post("/merchant/buyConfirm",{
            id
        })
    },

    // 下买单和卖单
    async buyAndSell(data) {
        return await httpClient.post("/user/trade",data)
    },
    // 用户取消订单
    async userCancel(id) {
        return await httpClient.post("/user/cancel", {
            id
        })
    },
    // 确认买单
    async buyConfirm(id) {
        return await httpClient.post("/user/buyConfirm",{id})
    },
    // 代理商设置
    async merchantSetting(data) {
        return await httpClient.post("/merchant/setting",data)
    },

    // 获取代理商设置
    async getMerchant(data) {
        return await httpClient.get("/merchant",data)
    },
    // /admin/c2c/transfer
    async c2cTransfer(data) {
        return await httpClient.post("/admin/c2c/transfer",data)
    },
}
