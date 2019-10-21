import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.lockUrl)

export default {

	// 锁仓规则列表
	async lockRuleList(params) {
		return await httpClient.get('/lockRule/list', params)
	},
	// 发起锁仓
	async lockUserCreate(data) {
		return await httpClient.post('/lockUser/create', data)
	},
	// 锁仓记录
	async lockUserList(data) {
		return await httpClient.get('/lockUser/list', data)
	},
	// 加仓
	async lockUserupdate(data) {
		return await httpClient.post('/lockUser/update', data)
	},
	// 查看规则
	async lockRule(data) {
		return await httpClient.get('/lockRule',data)
	},
	// 解锁记录
	async unlockHistory(data) {
		return await httpClient.get('/unlock/history',data)
	},
}
