import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.lockUrl)

export default {
	//锁仓列表
	async lockRuleList(p) {
		return await httpClient.get('/lockRule/list',{
			p:p
		});
	},
	//
	async createLock(amount,ruleId) {
		return await httpClient.post('/lockUser/create',{
			amount,ruleId
		});
	},
	async lockUserList(p,limit) {
		return await httpClient.get('lockUser/list',{
			p,limit
		});
	},
	async lockUserById(id) {
		return await httpClient.get('/lockRule?id='+id);
	},
	async updateLock(amount,ruleId) {
		return await httpClient.post('/lockUser/update',{
			amount,ruleId
		});
	},
	async unlockHistory(p,limit) {
		return await httpClient.get('/unlock/history',{
			p,limit
		});
	},
	
}