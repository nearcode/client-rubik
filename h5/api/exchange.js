
import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.exchangeUrl)

export default {
	//获取行情
	async getTickers(){
		return (await httpClient.get('/tickers')).data;
	},
	//获取自选交易对
	async getFavorites(){
		return (await httpClient.get('/favorites')).data;
	},
	//设置自选交易对
	async setfavorites(post){
		return await httpClient.post('/favorites/set', post);
	},
	//获取交易对
	async getMarkets(){
		return (await httpClient.get('/markets')).data;
	},
	
	//下单
	async order(post){
		return (await httpClient.post('/order', post)).data;
	},
	//取消订单
	async cancel(id){
		return (await httpClient.post('/cancel', {id})).data;
	},
	//获取用户挂单
	async getMyOrders(params){
		return await httpClient.get('/myOrders', params);
	},
	//获取用户挂单记录
	async getMyOrderHistory(params){
		return await httpClient.get('/myOrderHistory', params);
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
		// return (await httpClient.get('https://coin2coin.jp/api/v3/market/kline?&nonce=367770394&request=ticks&pair=C2C_ETH&start_time=1549961929&end_time=1555145989&interval=3600', {market}));
	}
}