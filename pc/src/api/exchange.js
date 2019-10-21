import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.exchangeUrl);

export default {

    //获取市场行情
    async marketTickers() {
        return await httpClient.get('/tickers');
    },

    //获取交易市场列表
    async markets() {
        return await httpClient.get('/markets');
    },

    //下单
    async marketOrder(amount, market, price, type) {
        return await httpClient.post('/order', {
            amount, market, price, type
        });
    },

    //获取用户挂单
    async marketMyOrders(market) {
        return await httpClient.get('/myOrders', market);
    },

    //获取用户交易历史
    async myOrderHistory(market) {
        return await httpClient.get('/myOrderHistory',market);
    },

    //K线
    async marketKLine() {
        return await httpClient.get('/market/kline');
    },

    //订单深度
    async marketDepth(limit, market) {
        return await httpClient.post('/market/depth', {
            limit: limit,
            market: market
        });
    },

    //取消订单
    async marketCancel(id) {
        return await httpClient.post('/cancel', {
            id
        });
    },

    //获取行情
    async getTickers(){
        return (await httpClient.get('/tickers')).data;
    },
    //获取自选交易对
    async getFavorites(){
        return (await httpClient.get('/favorites')).data;
    },
    //设置自选交易对
    async setfavorites(markets){
        return await httpClient.post('/favorites/set', {
            markets
        });
    },
    //获取交易对
    async getMarkets(){
        return (await httpClient.get('/markets')).data;
    },
    //k线数据
	async getKline(market, interval){
		//1, 5, 15, 30, 60, 1440
		if (interval == '1min') {
			interval = 1;
		} else if (interval == '5min') {
			interval = 5;
		} else if (interval == '15min') {
			interval = 15;
		} else if (interval == '30min') {
			interval = 30;
		} else if (interval == '1hour') {
			interval = 60;
		} else if (interval == '1weak') {
			interval = 1440;
		}
		return (await httpClient.get('/kline', {market, interval})).data;
    },
   
    async getTrendLine(data){
        return (await httpClient.get('/trendLine',data)).data;
    },
}
