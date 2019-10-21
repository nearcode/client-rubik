import config from '@/config';
import common from '@/common';

var httpClient = common.http.init(config.baseUrl)

export default {
	//获取banners
	async getBanners(){
		let data = await httpClient.get('/banners');
		return data
	},
	
    //获取币价格
	async getPrices(){
		let data = await httpClient.get('/market/prices');
		return data
	},
	//转帐
	async transfer(coin,amount,address,authCode){
		return await httpClient.post('/account/transfer', {
			coin,
			amount,
			address,
			authCode
		})
	},
	
	//转账记录
	async transferHistory(coin, limit, p) {
		return await httpClient.get('/account/transfer/history', {
			coin: coin,
			limit: limit,
			p: p
		})
	},
	//财务记录
	// async moneyHistory(coin, limit, p) {
	// 	return await httpClient.get('/account/money/history', {
	// 		coin: coin,
	// 		limit: limit,
	// 		p: p
	// 	})
	// },
	//财务一条记录明细
	async moneyHistoryDetail(id) {
		return await httpClient.get('/account/money/history/'+id)
	},
    //获取用户信息
	async getInfo() {
		let data = await httpClient.get('/info');
		return data
	},

	//忘记密码-获取重置密码验证码-->获取验证码
	async resetPasswordCode(account,auType,captchaId,captcha) {
		let data = await httpClient.post('/resetPassword/getCode', {
			account,auType,captchaId,captcha
		});
		return data
	},
	//忘记密码-重置密码
	async resetPassword(account,code,password,auType,captchaId,captcha) {
		let data = await httpClient.post('/resetPassword',{
			account,code,password,auType,captchaId,captcha
		})
		return data;
	},

	async getBalances() {
		let data = await httpClient.get('/account/balances');
		return data
	},

	async authLogin(code) {
		let data = await httpClient.post('/auth/login', {
			code: code
		});
		return data
	},


	//获取公告
	async getNotice(type, limit, p) {
		let data = await httpClient.get('/notice/list', {
			type,
			limit,
			p
		});
		return data
	},
	//设置全部已读->公告
	async setAllReadNotice() {
		let data = await httpClient.post('/notice/allRead');
		return data
	},
	//获取通知详细内容
	async getDetails(id, type) {
		// return await httpClient.get('/notice/show/' + id)
		return await httpClient.get('/notice/' + id)
	},
	// 登入
	async login(account, code, password,expires = 365,captcha,auType,captchaId) {
		let data = await httpClient.post('/login', {
			account: account,
			code: code,
			password: password,
			expires:expires,
			captcha:captcha,
			auType:auType,
			captchaId:captchaId
		});
		return data
	},
	//登录时-->获取验证码
	async getLoginCode(account,auType,captchaId,captcha) {
		let data = await httpClient.post('/signin/code',{
			account,auType,captchaId,captcha
		})
		return data
	},
	//注册时-->获取验证码
	async getSignUpCode(account,auType,captchaId,captcha) {
		let data = await httpClient.post('/signup/getCode', {
			account,
			auType,
			captchaId,
			captcha
		})
		return data
	},
	// 注册
	async signup(account, code, password,area,referrerId,captcha,auType,captchaId) {
		let data = await httpClient.post('/signup', {
			account: account,
			code: code,
			password: password,
			area:area,
			referrerId:referrerId,
			captcha:captcha,
			auType:auType,
			captchaId:captchaId
		})
		return data
	},
	//获取绑定邮箱或者手机验证码
	async getBindEmailOrMobileCode(account) {
		return await httpClient.post('/account/getBindEmailOrMobileCode', {
			account: account
		});
	},
	async setPayPassword(payPassword, code) {
		return await httpClient.post('/account/setPayPassword', {
			payPassword: payPassword,
			code: code
		});
	},
	async setPayPassword(payPassword, code) {
		return await httpClient.post('/account/setPayPassword', {
			payPassword: payPassword,
			code: code
		});
	},
	//修改支付密码
	async changePayPassword(code, newPayPassword, oldPayPassword) {
		return await httpClient.post('/account/changePayPassword', {
			code,
			newPayPassword,
			oldPayPassword
		});
	},
	async setEmail(email, code, authCode) {
		return await httpClient.post('/account/bindEmail', {
			email,
			code,
			authCode
		});
	},
	async bindMobile(mobile, code, authCode) {
		return await httpClient.post('/account/bindMobile', {
			mobile,
			code,
			authCode
		});
	},
	//添加银行卡
	async addBankcard(param) {
		return await httpClient.post('/account/bankcard/add', param)
	},
	async getBankList() {
		return await httpClient.get('/account/bankcard/list');
	},
	async setAddress(mobile, name, region, street) {
		return await httpClient.post('/account/setAddress', {
			mobile: mobile,
			name: name,
			region: region,
			street: street
		})
	},
	async uploadTextImg(content, screenshots) {
		return await httpClient.post('/account/feedback/add', {
			content: content,
			screenshots: screenshots
		})
	},
	//商户认证
	async certificate(param) {
		return await httpClient.post('/account/merchantCA', param)
	},
	//用户认证
	// async addVerified(truename, number, code, cardType) {
	// 	let res = await httpClient.post('/account/userCA', {
	// 		code: code,
	// 		cardNumber: number,
	// 		truename: truename,
	// 		cardType: cardType,
	// 	});
	// 	return res;
	// },
	
	async addVerified(truename, number,mobile, code, cardType, type) {
		let res = await httpClient.post('/account/realname/request', {
			code: code,
			mobile: mobile,
			cardNumber: number,
			truename: truename,
			cardType: cardType,
			type: type
		});
		return res;
	},

	// 更换手机验证码
	async getCode() {
		return await httpClient.get('/account/getCode');
	},

	//获取通知详情
	async getNoticeDetail(id) {
		return await httpClient.get('/notice/show/' + id);
	},
	//设置全部通知 (已读1 \ 清除0)
	async setNoticeAllStatus(status) {
		return await httpClient.post('/notice/setNoticeAllStatus', {
			status
		});
	},
	//添加收获地址
	async addAddress(mobile, name, region, street) {
		return await httpClient.post('/account/address/add', {
			mobile,
			name,
			region,
			street
		});
	},
	//收货地址列表
	async getAddressList() {
		let data = await httpClient.get('/account/address/list');
		return data
	},
	//修改收货地址信息
	async editAddressList(id, mobile, name, region, street) {
		return await httpClient.post('/account/address/edit', {
			id,
			mobile,
			name,
			region,
			street
		});
	},

	//删除收货地址
	async delAddress(id) {
		return await httpClient.post('/account/address/del', {
			id
		});
	},
	//收货地址默认设置
	async setDefaultAddress(id) {
		return await httpClient.post('/account/address/default', {
			id
		});
	},

	//设置默认银行卡
	async setDefaultBankCard(id) {
		return await httpClient.post('/account/bankcard/default', {
			id
		});
	},
	//删除银行卡
	async delBankCard(id) {
		return await httpClient.post('/account/bankcard/del', {
			id
		});
	},
	//修改登录密码
	async changePassword(newPassword, oldPassword) {
		return await httpClient.post('/account/changePassword', {
			newPassword,
			oldPassword
		});
	},
	//删除单个通知
	async delNoticeSingle(id) {
		return await httpClient.post('/notice/del/' + id);
	},
	//获取认证信息结果/
	async getCertificateStatus(authLevel) {
		return await httpClient.get('/account/getCertificateStatus?authLevel=' + authLevel);
	},
	///account/avatar 更新用户头像
	async changeAvatar(avatar) {
		return await httpClient.post('/account/avatar', {
			avatar
		});
	},
	async getMoneyHistody(id) {
		return await httpClient.get('/account/money/history/' + id);
	},
	//account/resetPayPassword 重设支付密码
	async resetPayPassword(code,idCardNumber,payPassword,trueName) {
		return await httpClient.post('/account/resetPayPassword', {
			code,
			idCardNumber,
			payPassword,
			trueName
		});
	},
	///account/edit/user更新用户资料
	// async editUser(avatar,gender,userName) {
	// 	return await httpClient.post('/account/user/edit', {
	// 		avatar,
 //            gender,
 //            userName
	// 	});
	// },

//修改用户信息
	async editUser(avatar,gender,username) {
		return await httpClient.post('/account/update/user', {
			avatar,
	        gender,
	        username,
		});
	},
	//新闻列表/news/show/{id}
	async showNews(id) {
		return await httpClient.get('/news/show/'+id);
	},
	
	//新闻列表
	async getNewsList(type,limit,p) {
		return await httpClient.get('/news',{
			type,limit,p
		});
	},
	async getHelpList(type,limit,p) {
		return await httpClient.get('/news?type='+type);
		// return await httpClient.get('/news',{
		// 	type,
		// 	limit,
		// 	p
		// });
	},
	//提交设备号
	async deviceUpdate(){
		var pinf = plus.push.getClientInfo();
		var cid = pinf.clientid;//客户端标识
		console.log("cid "+cid) 
		return await httpClient.post("/device/update", {cid});
	},
	//获取充币提现地址
    async addCoin(coin){
		return await httpClient.get('/account/wallet/address/'+coin);
	},
	//获取二维码地址
	async qrcode(text){
		return await httpClient.get('/qrcode?text='+text);
	},
	//提现数字币
    async withdraw(address,amount,coin,code) {
		return await httpClient.post('/account/wallet/withdraw',{
			address,
			amount,
			coin,
			code
		});
	},
	//获取提现地址
    async getWalletAddress(coin){
        return (await httpClient.get('/account/wallet/address/'+coin));
    },
	//财务记录
	async moneyHistory(coin,type,limit,p) {
		return await httpClient.get('/account/money/history',{
			coin,
			type,
			limit,
			p
		});
	},
	//获取被推荐人
	async getReferrer(coin,type) {
		return await httpClient.get('/account/getReferrer');
	},
	//获取验证类型
	async getAuType(type,captchaType,height,width){
	    return await httpClient.post('/auType',{
			type,captchaType,height,width
		});
	},
	//验证类型，判断验证码是否正确
	async auTypeVerify(type,id,value){
	    return await httpClient.post('/auType/verify',{
			type,id,value
		});
	},
	//获取实名认证结果
	async getCertificate(authLevel) {
		return await httpClient.get('/account/realname?type=' + authLevel);
	},
	
	//更新app
	async updateUrl(name) {
		return await httpClient.get('/app/version?name=' + name);
	},
}
