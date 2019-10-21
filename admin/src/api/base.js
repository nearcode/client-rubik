import config from '@/config';
import common from '@/common';
// import { generateCodeFrame } from '_vue-template-compiler@2.6.10@vue-template-compiler';
console.log(common)
let httpClient = common.http.init(config.baseUrl);

export default {
    // 个人信息
    async getInfo() {
        return await httpClient.get('/info');
    },
      //获取验证码（登录后敏感操作）
      async getAccountCode() {
        return await httpClient.get('/account/getCode');
    },

    async getBalances(coin) {
        return await httpClient.get('/account/getBalance/'+coin);
    },
  
   
}
