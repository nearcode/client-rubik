import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.c2cUrl)

export default {
	//获取行情
	async getInfo(){
		return (await httpClient.get('/c2c')).data;
	},
	//买卖
	async buyAndSell(post){
		return (await httpClient.post('/user/trade', post)).data;
	},
	//获取订单
	async history(){
		return (await httpClient.get('/user/history')).data;
	},
	//获取订单详细
	async info(id){
		return (await httpClient.get('/user/history/'+id)).data;
	},
	//取消c2c订单
	async cancel(id){
		return (await httpClient.post('/user/cancel', {id}));
	},
	//用户确认买单
	async buyConfirm(id){
		return (await httpClient.post('/user/buyConfirm', {id}));
	},
	//代理商充值提现记录
	async depositOrWithdraw(){
		return (await httpClient.get('/merchant/history')).data;
	},
	//获取代理商
	async getMerchant(){
		return (await httpClient.get('/merchant')).data;
	},
	//修改代理商
	async setMerchant(isOpenDeposit,isOpenWithdraw,max,min){
		let data = await httpClient.post('/merchant/setting',{
			isOpenDeposit:isOpenDeposit,
			isOpenWithdraw:isOpenWithdraw,
			max:max,
			min:min
		});
		return data;
	},
	//确认买单
	async sureConfirm(id){
		return (await httpClient.post('/merchant/buyConfirm',{id}))
	},
	//确认卖单
	async sellConfirm(id){
		return (await httpClient.post('/merchant/sellConfirm',{id}))
	}
}