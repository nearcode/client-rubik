import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.diceUrl)

export default {

    // 投资
    async invest(data) {
        return await httpClient.post('/invest', data)
    },
    // 撤资
    async divest(data) {
        return await httpClient.post('/divest', data)
    },
    // 获取投资信息
    async investor(data) {
        return await httpClient.get('/investor', data)
    },
    // 投注
    async roll(data) {
        return await httpClient.post('/roll', data)
    },
    // 投注记录
    async rollHistory(data) {
        return await httpClient.get('/roll/history', data)
    },
    // 获取玩家投注记录
    async rollPlayerHistory(data) {
        return await httpClient.get('/roll/playerHistory', data)
    },
    // 获取币种
    async getCoins(data) {
        return await httpClient.get(' /coins', data)
    },
   

}
