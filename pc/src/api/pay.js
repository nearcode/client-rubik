import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.payUrl)

export default {
	async transfer(address, coin, amount, memo, payPassword) {
		let res = await httpClient.post('/transfer', {
			address, coin, amount, memo, payPassword
		});
		return res;
	},
	
	async pay(num) {
		return await httpClient.post('/wxpay', {
			amount: num
		})
	},
	
	// 提现历史记录
	async withdrawHistory(limit,p) {
		return await httpClient.get('/withdraw/history',{
			limit:limit,
			p:p
		})
	},
	
	
	// 商户请求结算
	async withdraw(params) {
		return await httpClient.post('/withdraw',params)
	}
}
