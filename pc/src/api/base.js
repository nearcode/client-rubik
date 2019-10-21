import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.baseUrl)

export default {
    //转账记录
    async transferHistory(coin, limit, p) {
        return await httpClient.get('/transfer/history', {
            coin, limit, p
        })
    },

    async getInfo() {
        let data = await httpClient.get('/info');
        return data
    },

    //忘记密码-获取重置密码验证码-->获取验证码
    async resetPasswordCode(account, token) {
        return await httpClient.post('/resetPassword/getCode', {
            account, token
        });
    },
    //忘记密码-重置密码
    async resetPassword(data) {
        return await httpClient.post('/resetPassword', data);
    },

    async getBalances() {
        let data = await httpClient.get('/money/balances');
        return data
    },

    async authLogin(code) {
        let data = await httpClient.post('/auth/login', {
            code: code
        });
        return data
    },


    //获取公告
    async getNotice() {
        let data = await httpClient.get('/notice/list');
        return data
    },
    //设置全部已读->公告
    async setAllReadNotice() {
        let data = await httpClient.post('/notice/allRead');
        return data
    },
    //获取通知详细内容
    async getDetails(id) {
        return await httpClient.get('/notice/show/' + id)
    },
    // 登入
    async login(data) {
        return await httpClient.post('/login', data);
    },
    //登录时-->获取验证码
    async getLoginCode() {
        return await httpClient.get('/signin/getCode')
    },

    //注册时-->获取验证码
    async getSignUpCode(account, token) {
        return await httpClient.post('/signup/getCode', {
            account, token
        })
    },
    // 注册
    async signup(data) {
        return await httpClient.post('/signup', data)
    },
    async addVerified(truename, number, mobile, code) {
        let res = await httpClient.post('/money/userCA', {
            code: code,
            mobile: mobile,
            cardNumber: number,
            truename: truename,
            cardType: "idcard"
        });
        return res;
    },
    // async getBindEmailOrMobileCode(account) {
    //     return await httpClient.post('/money/getBindEmailOrMobileCode', {
    //         account: account
    //     });
    // },
    async setPayPassword(payPassword, code) {
        return await httpClient.post('/money/setPayPassword', {
            payPassword, code
        });
    },
    async setEmail(email, code, authCode) {
        return await httpClient.post('/money/setEmail', {
            email,
            code,
            authCode
        });
    },
    async bindMobile(mobile, code, authCode) {
        return await httpClient.post('/money/bindMobile', {
            mobile,
            code,
            authCode
        });
    },
    //添加银行卡
    async addBankcard(data) {
        return await httpClient.post('/account/bankcard/add', data);
    },
    // 银行卡列表
    async getBankList() {
        return await httpClient.get('/account/bankcard/list');
    },
    // 设置默认银行卡
    async defaultCard(id) {
        return await httpClient.post('/account/bankcard/default', {id});
    },

    // 删除银行卡
    async delBankcard(id) {
        return await httpClient.post('/account/bankcard/del', {id});
    },

    async setAddress(mobile, name, region, street) {
        return await httpClient.post('/money/setAddress', {
            mobile, name, region, street
        })
    },
    async uploadTextImg(content, screenshots) {
        return await httpClient.post('/money/feedback/add', {
            content, screenshots
        })
    },
    //商户认证
    async certificate(param) {
        return await httpClient.post('/money/merchantCA', param)
    },

    // //实名认证1级
    // async accUserCA(param) {
    //     return await httpClient.post('/account/userCA', param)
    // },

    // //实名认证2级
    // async accUserCA2(param) {
    //     return await httpClient.post('/account/userCA2', param)
    // },
    // 提交实名(new)
    async realnameRequest(data){
        return await httpClient.post('/account/realname/request', data)
    },
    //获取用户实名认证状态
    async getCertificateStatus(param) {
        return (await httpClient.get('/account/realname', param)).data
    },

    // 更换手机验证码
    async getCode() {
        return await httpClient.get('/money/getCode');
    },

    //获取通知详情
    async getNoticeDetail(id) {
        return await httpClient.get('/notice/show/' + id);
    },

    //获取新闻列表
    async newsList(p, limit, coin, type) {
        return await httpClient.get('/news', {
            p: p || 1,
            limit: limit || 20,
            coin: coin || '',
            type: type || ''
        });
    },

    //获取新闻详细内容
    async newsShow(id) {
        return await httpClient.get('/news/show/' + id);
    },

    //获取验证码（登录后敏感操作）
    async getAccountCode() {
        return await httpClient.get('/account/getCode');
    },

    //转账
    async accTransfer(data) {
        return await httpClient.post('/account/transfer', data);
    },
   

    //获取用户资金
    async getAccMoney() {
        return await httpClient.get('/account/balances');
    },

    //设置邮箱
    async accSetEamil(data) {
        return await httpClient.post('/account/bindEmail', data);
    },

    //绑定手机号
    async accBindMobile(authCode, code, mobile) {
        return await httpClient.post('/account/bindMobile', {
            authCode, code, mobile
        });
    },

    //设置邮箱
    async getBindEmailOrMobileCode(account) {
        return await httpClient.post('/account/getBindEmailOrMobileCode', {account});
    },

    //改变密码
    async changePassword(newPassword, oldPassword) {
        return await httpClient.post('/account/changePassword', {
            newPassword, oldPassword
        });
    },
    //获取单币种余额
    async getBalance(coin) {
        return await httpClient.get('/account/getBalance/' + coin);
    },
    //获取财务记录
    async getMoneyHistory(data) {
        return await httpClient.get('/account/money/history', data);
    },

   
    //获取推荐人列表
    async getReferrer(data) {
        return await httpClient.get('/account/getReferrer',data);
    },

    //获取二维码
    async getQrcode(text) {
        return await httpClient.get('/qrcode', {
            text
        });
    },
    //获取图片验证码
    async getcaptcha(data) {
        return await httpClient.post('/auType', data);
    },

    //判断验证码是否正确
     async auTypeVerify(data) {
        return await httpClient.post('/auType/verify', data);
     },
    //登录时通过图片验证码获取短信验证码
      async getSigninCode(data) {
        return await httpClient.post('/signin/code', data);
     },
    //注册时通过图片验证码获取短信验证码
      async signupCode(data) {
        return await httpClient.post('/signup/code', data);
     },
      //重置时通过图片验证码获取短信验证码
      async forgetPassCode(data) {
        return await httpClient.post('/resetPassword/code', data);
     },

    //  工单系统

    //  创建工单
    async workorderAdd(data) {
        return await httpClient.post('/workorder/add', data);
     },
    //   工单列表
    async workorderList(data) {
        return await httpClient.get('/workorder/list', data);
    },
    
     //   工单类型
     async workorderTypes(data) {
        return await httpClient.get('/workorder/types', data);
    },
      //   回复工单
    async workorderReply(data) {
        return await httpClient.post('/workorder/reply', data);
    },
    // 关闭工单
    async workorderClose(data) {
        return await httpClient.post('/workorder/close', data);
    },
      //   查看回复
    async workorderReplyList(data) {
        return await httpClient.get('/workorder/reply/list', data);
    },
     // 获取app版本（单个）传name值
    async appVersion(data){
        return await httpClient.get('/app/version', data);
    },
    // 获取app列表
    async appList(data){
        return await httpClient.get('/app/list', data);
    },
    // 获取banners
    async getBanners(data){
        return await httpClient.get('/banners', data);
    },
    // 获取标签
    async getCoinsTags(data){
        return await httpClient.get('/coins/tags', data);
    },
    // 获取关系树
    async referrerTree(data){
        return await httpClient.get('/account/referrer/tree', data);
    },
}
