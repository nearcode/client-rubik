import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.c2cUrl)
export default {
    // 获取c2c配置信息
    async getC2C() {
        return await httpClient.get("/c2c");
    },
    // 代理商充值提现记录
    async merchantTradeList(type, result) {
        return await httpClient.get("/merchant/history", {
            type, result
        })
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



}
