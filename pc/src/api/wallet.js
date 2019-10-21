import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.walletUrl)

export default {
	//  //数字币提现
    //  async walletWithdraw(data) {
    //     return await httpClient.post('/withdraw',data);
    // },
    // //获取数字币地址
    // async getWalletAddress(coin){
    //     return await httpClient.get('/address/'+coin);
    // },
     //添加提现地址
     async addWithdrawAddress(data) {
        return await httpClient.post('/withdrawAddress/add', data);
    },

    //获取提现地址列表
    async getWithdrawAddress(coin) {
        return await httpClient.get('/withdrawAddress/'+coin);
    },

    //删除提现地址
    async delWithdrawAddress(data) {
        return await httpClient.post('/withdrawAddress/del', data);
    },

    //修改提现地址
    async editWithdrawAddress(data) {
        return await httpClient.post('/withdrawAddress/update', data);
    },

    //用户提现
    async actwithdraw(data) {
        return await httpClient.post('/withdraw', data);
    },

    //获取充值地址
    async getDepositAddress(coin) {
        return await httpClient.get('/address/'+coin);
    },
}
