import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import common from "@/common"
import config from "@/config";
import base from "@/api/base";
import c2c from "@/api/c2c";
import exchange from "@/api/exchange";
import comjs from "@/js/common";

const store = new Vuex.Store({
	state: {
		info: uni.getStorageSync('info') || {},
		title: "",
		logo: "",
		banners: [],
		username: "",
		uid: uni.getStorageSync('uid') || '',
		truename: '',
		mobile: '',
		coins: {},
		email: '',
		avatarUrl: '',
		authLevel: '',
		payPassword: false,
		baiduAi: {},
		balances: uni.getStorageSync('balances') || {},
		markets: uni.getStorageSync("markets") || [],
		favorites: uni.getStorageSync("favorites") || [],
		loadFavorites: false,
		businessLogo: '',
		businessName: '',
		tencentCaptchaAppid: '',
		contacts: '',
		avatar: '',
		gender: '',
		address: uni.getStorageSync('address') || {},
		prices: {},
		serviceProvider: uni.getStorageSync("c2c") || {},
		tickers: uni.getStorageSync("tickers") || {},
		closeEyesValue: '',
		inviteCode:'',
		isLogin() {
			try {
				let token = uni.getStorageSync('token');
				if (!token) return false;
				//console.log(token)
				var result = token.split('.')[1];
				result = result.replace(new RegExp("\r\n", "gm"), "");
				result = result.replace(new RegExp("\"", "gm"), "\'");
				result = result.replace(/ /g, '')
				result = result.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
				result = result.replace('-', '+').replace('_', '/');
				//console.log(common.base64.decode(result))
				//var exp = JSON.parse(common.base64.decode(result)).exp;
				var exp = common.util.toJson(common.base64.decode(result)).exp;
				if (!exp) return false;
				return Math.round(new Date().getTime() / 1000) <= exp;
			} catch (e) {
				return false;
			}
		},
		getBance(coin) {
			let balances = uni.getStorageSync('balances');
			return balances[coin] ? balances[coin].available : 0;
		}
	},
	mutations: {
		async getInfo(state, callback) { //获取基本信息
			let info = {};
			let setInfo = () => {
				state.uid = info.uid;
				uni.setStorageSync('uid', info.uid);
				state.title = info.siteInfo.title;
				state.logo = info.siteInfo.logo;
				state.banners = info.siteInfo.banners || [];
				state.authLevel = info.authLevel;
				state.businessName = info.businessName;
				state.businessLogo = info.businessLogo;
				state.truename = info.truename;
				state.username = info.username;
				state.mobile = info.mobile;
				state.email = info.email;
				state.coins = info.coins;
				state.gender = info.gender;
				state.inviteCode = info.siteInfo.inviteCode;
				//state.inviteCode = false;
				uni.setStorageSync("coins", JSON.stringify(state.coins));
				state.payPassword = info.payPassword;
				state.avatarUrl = info.authLevel;
				uni.setStorageSync("authLevel", state.avatarUrl);
				config.baiduAi = state.baiduAi = info.baiduAi;
				state.contacts = info.contacts || [];
				state.avatar = info.avatar;
				uni.setStorageSync("contacts", state.contacts);
				uni.setStorageSync('tencentCaptchaAppid', info.tencentCaptchaAppid);
			}

			try {
				info = uni.getStorageSync('info') || {};
				if (Object.keys(info).length != 0) {
					setInfo()
					// callback && callback(info)
				}
			} catch (e) {}
			let res;
			try {
				res = await base.getInfo();
				//await comjs.sleep();
				info = res;
				setInfo();
				uni.setStorageSync('info', info);
			} catch (e) {

			}
			callback && callback(res)
			console.log('用户ID:' + info.uid + ' ' + info.mobile)
		},
		// async getInfo(state, callback) { //获取基本信息
		// 	try {
		// 		var info = await base.getInfo();
		// 		console.log('info', info)
		// 		state.uid = info.uid;
		// 		if (!info.uid) {
		// 			uni.removeStorageSync('token')
		// 		}
		// 		state.logo = info.siteInfo.logo;
		// 		state.banners = info.siteInfo.banners || [];
		// 		state.authLevel = info.authLevel;
		// 		state.businessName = info.businessName;
		// 		state.businessLogo = info.businessLogo;
		// 		state.truename = info.truename;
		// 		state.username = info.username;
		// 		state.mobile = info.mobile;
		// 		state.email = info.email;
		// 		state.coins = info.coins;
		// 		state.gender = info.gender;
		// 		uni.setStorageSync("coins", JSON.stringify(state.coins));
		// 		state.payPassword = info.payPassword;
		// 		state.avatarUrl = info.authLevel;
		// 		uni.setStorageSync("authLevel", state.avatarUrl);
		// 		config.baiduAi = state.baiduAi = info.baiduAi;
		// 		state.contacts = info.contacts || [];
		// 		state.avatar = info.avatar;
		// 		uni.setStorageSync("contacts", state.contacts);
		// 		uni.setStorageSync('tencentCaptchaAppid', info.tencentCaptchaAppid);
		// 		console.log(uni.getStorageSync('tencentCaptchaAppid'))
		// 	} catch (e) {}
		// 	callback && callback(info)
		// },
		async getBalances(state, callback) {
			try {
				let balances = await base.getBalances();
				state.balances = balances.data
				uni.setStorageSync("balances", state.balances)
			} catch (e) {
				if (e.error == '帐户不存在' || e.error == 'PLEASE_LOGIN') {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			}
		},

		async getPrices(state, callback) { //获取币的价格
			try {
				state.prices = await base.getPrices();
				//console.log(state.prices)
			} catch (e) {
				console.log(e)
			}
		},
		async getMarkets(state, callback) {
			try {
				state.markets = uni.getStorageSync("markets");
				let markets = await exchange.getMarkets();
				//await comjs.sleep();
				state.markets = markets;
				//console.log('api-markets',state.markets)
				uni.setStorageSync("markets", state.markets);

				let curMarket = uni.getStorageSync("currentMarket");
				if (!curMarket) { //设置默认当前交易对
					if (state.markets[0]) {
						let market = state.markets[0].coin + '_' + state.markets[0].base;
						state.currentMarket = market;
						uni.setStorageSync("currentMarket", market);
					}
				}
			} catch (e) {
				console.log(e)
			}
		},
		async getFavorites(state, callback) {
			// if (!state.isLogin()) {
			// 	return callback && callback();
			// }
			// if (state.loadFavorites) {
			// 	return callback && callback();
			// }
			try {
				state.favorites = await exchange.getFavorites();
				uni.setStorageSync("favorites", state.favorites);
				state.loadFavorites = true;
				callback && callback(state.favorites);
			} catch (e) {
				callback && callback();
			}
		},
		// 设置自选币种
		async setFavorites(state, market) {
			if (!state.isLogin()) {
				return uni.navigateTo({
					url: '/pages/login/login'
				});
			}
			if (!market) return;

			if (state.favorites.indexOf(market) != -1) {
				let n = 0;
				for (let item of state.favorites) {
					if (item == market) {
						state.favorites.splice(n, 1);
					}
					n++;
				}
			} else state.favorites.push(market);

			uni.setStorageSync("favorites", state.favorites);

			try {
				let data = {
					markets: state.favorites
				};

				let result = await exchange.setfavorites(data);
				//console.log('设置成功');
				common.util.showToast('设置成功')
			} catch (e) {

			}

		},
		//关闭眼睛
		async closeEyes(state, data) {
			state.closeEyesValue = data;
		},
		// 获取 ickerst
		async getTickers(state, callback) {
			var tickerList = [];

			try {
				let tickers = await exchange.getTickers();
				//await comjs.sleep();
				//console.log('1api-tickers',tickers);
				for (let item in tickers) {
					tickers[item]['market'] = item;
					tickerList.push(tickers[item]);
				}
				state.tickers = tickerList;
				uni.setStorageSync("tickers", tickerList);
				comjs.setPrices();
			} catch (e) {
				console.log(e)
			}
			callback && callback(tickerList)
		},
		async getC2CInfo(state, callback) {
			try {
				let info = await c2c.getInfo();
				state.serviceProvider = info;
				uni.setStorageSync("c2c", info)
			} catch (e) {
				console.log(e)
			}
		},
		//退出登录
		loginOut() {
			uni.removeStorageSync("token"); //清除token
			uni.removeStorageSync('uid'); //清除uid
			uni.removeStorageSync("mycoin"); //清除我选的币
			uni.reLaunch({
				url: '/pages/login/login'
			})
		},
	}
});
export default store
