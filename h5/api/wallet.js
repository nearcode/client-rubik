import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.walletUrl)

export default {
	//获取充币提现地址
	async addCoin(coin){
		return await httpClient.get('/address/'+coin);
	},
	//提现数字币
	async withdraw(address,amount,coin,authCode,memo) {
		return await httpClient.post('/withdraw',{
			address,
			amount,
			coin,
			authCode,
			memo
		});
	},
}