// const sortBy = require('lodash.sortby');
// const remove = require('lodash.remove');
// import {
// 	BigNumber
// } from 'bignumber.js'
// 
let defaultCoins = ['C2C', 'QC', 'CNY', 'CNYT'];

import tools from '@/common';
import base from '@/api/base';
export default {
	// getJsonData(localStorage.tickers, {})
	getJsonData: function(str, value = {}) {
		try {
			return JSON.parse(str);
		} catch (e) {
			return value;
		}
	},
	//获取数量精确度
	getAutoNumber: function(n) {
		n = Math.abs(n);
		if (n == 0) return 0;
		if (n >= 1) return 3;
		if (n >= 0.1) return 4;
		if (n >= 0.01) return 5;
		if (n > 0.001) return 6;
		return 8;
	},
	//字符转成数字类型
	toNumber: function(str, len) {
		if (!str) return 0;
		len = len || 8;
		var n = parseFloat(str);
		if (isNaN(n) || Math.abs(n) == Infinity)
			return 0;
		n = parseFloat(this.toFixedEx(n, len));
		if (n == 0)
			return Math.abs(n);
		return n * 1.0;
	},
	toFixedEx: function(n, len) {
		if (!n) return 0;
		if (n == NaN) return 0;
		if (n == Infinity) return 0;
		if (typeof len == 'undefined') len = 8;
		// return new BigNumber(n).toFixed(len);
		var re = eval("/(\\.\\d{" + len + "})\\d+$/");
		return (n + '').replace(re, "$1");
	},
	autoFixed: function(n) {
		n = this.toNumber(n);
		var len = this.getAutoNumber(n);
		//return this.toFixedEx(n, len);
		return tools.util.toFixed(n, len);
	},
	//排序 [{price:3}, {price:2}, {price:4}]
	sortBy(data, callback) {
		return sortBy(data, callback);
	},
	//var a = clone(ab)
	//ab = {ab:1}
	clone: function(obj) {
		var o;
		if (typeof obj == "object") {
			if (obj === null) {
				o = null;
			} else {
				if (obj instanceof Array) {
					o = [];
					for (var i = 0, len = obj.length; i < len; i++) {
						o.push(this.clone(obj[i]));
					}
				} else {
					o = {};
					for (var j in obj) {
						o[j] = this.clone(obj[j]);
					}
				}
			}
		} else {
			o = obj;
		}
		return o;
	},
	//从数组中删除 数据
	//remove([1,2,4], 4)
	remove(a, b) {
		return remove(a, b);
	},
	/**
	 * 1. coins="BTC" data=0.01
	 * 2. coins = {
	 *    BTC: 0.01,
	 *    ETH: 1
	 * }
	 */
	// 	toCNY: function(coins, data) {
	// 		var tickers = uni.getStorageSync('tickers');
	// 		var lastPrices = {};
	// 		for (var item of tickers) {
	// 			lastPrices[item.market] = item.last;
	// 		}
	// 		var tempData = {};
	// 		if (typeof coins == 'string') {
	// 			tempData[coins] = data;
	// 		} else
	// 			tempData = coins;
	// 		var value = 0;
	// 		for (var coin in tempData) {
	// 			var price = lastPrices[coin + '_CNY'] || 0;
	// 			if (price == 0) {
	// 				if (coin == 'C2C' || coin == 'CNY' || coin == 'EC' || coin == 'CNYT') {
	// 					price = 1;
	// 				} else
	// 					price = lastPrices[coin + '_BTC'] * localStorage.btcPrice;
	// 			}
	// 			value += this.toNumber(tempData[coin] * price)
	// 		}
	// 		return value
	// 	},
	toCNYs: function(datas) {
		var balance = 0;
		for (var pair in datas) {
			if(parseFloat(datas[pair])){//排除余额为0的币
				balance += this.toCNY(pair, datas[pair]);
			}
		}
		return balance;
	},
	setPrices: function() {
		var tickers = uni.getStorageSync('tickers') || [];
		var lastPrices = {};
		// console.log(tickers)
		var baseCoins = [];
		for (var item of tickers) {
			lastPrices[item.market] = item.last;
			if (item.market) {
				let baseCoin = this.getBaseCoin(item.market);
				if (baseCoins.indexOf(baseCoin) == -1) {
					baseCoins.push(this.getBaseCoin(item.market));
				}
			}
		}
		// console.log(baseCoins)
		// console.log(lastPrices)
		let price = {}
		//排除掉与人民币价格为1：1的币
		let noExit = [];
		for (let bs of baseCoins) {
			if (defaultCoins.indexOf(bs) != -1) {
				price[bs] = 1;
			} else {
				noExit.push(bs);
				price[bs] = 0;
			}
		}
		// console.log(noExit)
		//求出与人民币为1:1的值
		for (let base of noExit) {
			for (let b of defaultCoins) {
				if (lastPrices[base + '_' + b]) {
					price[base] = lastPrices[base + '_' + b];
					break;
				}
			}
		}
		// console.log(price)
		uni.setStorageSync('prices', price);
	},
	toCNY(market, balance) {
		balance = parseFloat(balance);
		if (!market || !balance) {
			return 0;
		}
		let price = 0;
		if (market.indexOf('_') == -1 && market.indexOf('/') == -1) { //单个币种
			// console.log(market);
			var tickers = uni.getStorageSync('tickers') || [];
			let marketNew = '';
			let last = 0;
			//检查法币估值
			for (let base of defaultCoins) { //['C2C', 'QC', 'CNY', 'CNYT']
			    if(market == base){
					return balance;
				}
				marketNew = market+'_'+base;
				for (let item of tickers) {
					if(item.market == marketNew){
						last = item.last;
						break;
					}
				}
				if(last) break;
			}
			//usdt
			if (last == 0) {
				marketNew = market+'_USDT';
				for (let item of tickers) {
					if(item.market == marketNew){
						last = item.last;
						break;
					}
				}
			}
			//BTC
			if (last == 0) {
				marketNew = market+'_BTC';
				for (let item of tickers) {
					if(item.market == marketNew){
						last = item.last;
						break;
					}
				}
			}
			return this.toCNY(marketNew, parseFloat(last)*balance);
		} else {
			var prices = tools.cache.getPrices();
			let base = this.getBaseCoin(market);
			price = prices[base];
		}
		return this.toNumber(parseFloat(price) * balance);
	},

	//ETH/BTC  转成交易对 ETH_BTC
	getPair: function(str) {
		if (!str) return '';
		var arr = str.split('/')
		var oldStr = arr[1] + '_' + arr[0]
		return oldStr
	},
	marketToPair: function(str) {
		if (!str) return '';
		return str.split('_').join('/');
	},
	//获取 主币种 
	getBaseCoin: function(str) {
		if (!str) return '';
		let arry = str.split('/');
		if (arry.length > 1) {
			return arry[1];
		} else {
			arry = str.split('_');
			return arry[1];
		}
	},
	//获取交易币种
	getCoin: function(str) {
		if (!str) return '';
		let arry = str.split('/');
		if (arry.length > 1) {
			return arry[0];
		} else {
			arry = str.split('_');
			return arry[0];
		}
	},
	//获取币种logo
	getCoinLogo: function(str) {
		if (!str) return '';
		str = str.toLocaleLowerCase()
		let arry = str.split('_');
		return arry[0];
	},
	//获取币符号
	getSymbol: function(coin) {
		if (coin == 'BTC') {
			return '฿';
		} else if (coin == 'USDT') {
			return '$';
		} else if (coin == 'CNY') {
			return '￥';
		} else return coin;
	},
	//默认的交易市场
	getDefaultMarket() {
		let tickers = this.getJsonData(uni.getStorageSync("tickers"));
		try {
			return sortBy(tickers, function(item) {
				return -item.baseVol;
			})[0].pair;
		} catch (e) {
			return '';
		}
	},
	//传交易对(BTC_ILK)获取最后的价格
	lastPrice(pair) {
		let tickers = this.getJsonData(uni.getStorageSync("tickers"));
		try {
			return tickers[pair].last;
		} catch (e) {
			return 0;
		}
	},
	//通过交易对获取行情信息
	getTicker(pair, value) {
		let tickers = this.getJsonData(uni.getStorageSync("tickers"), value);
		try {
			return tickers[pair] || value;
		} catch (e) {
			return {};
		}
	},
	//估值
	estimate(n) {
		if (n > 10000) {
			return this.autoFixed(n / 10000) + '万';
		} else {
			return this.toFixedEx(n, 2);
		}
	},

	//字符串转数组，根据索引还回(mark根据什么符号来转数组，index是需要还回数组第几个元素 )
	strToArray(str, mark, index) {
		if (!str) return '';
		//console.log(str)
		index = (index == '' || index == undefined) ? "0" : index;
		let strNew = ''
		try {
			strNew = str.split(mark)[index]
		} catch (e) {}
		return strNew;
	},
	getMode: function(method, type) {
		//type 1入 提 买  -1出 卖
		switch (method) {
			case 1:
				return type == 1 ? "转入" : "转出";
			case 2:
				return type == 1 ? "充币" : "普通提币";
			case 3:
				return type == 1 ? "进帐" : "出帐";
			case 4:
				return type == 1 ? "买入" : "卖出";
			case 5:
				return "糖果";
			case 6:
				return "转换兑换";
			case 7:
				return "赠送";
			case 8:
				return "下单";
			case 9:
				return "下单过多资金退回";
			case 10:
				return "取消订单";
			case 11:
				return "订单完成";
			case 12:
				return "时时彩";
			case 13:
				return "夺宝";
			case 14:
				return "送饭票";
			case 15:
				return "冻结";
			case 16:
				return "支付";
			case 17:
				return "迁移数据";
			default:
				return "无此状态"
		}
	},
	//字符串截图后几位 subEndString
	subEndString(str, n) {
		var str = str + ''
		return str.substring(str.length - n);
	},
	getArgVars(url) {
		var hash;
		var myJson = {};
		var hashes = url.slice(url.indexOf('://') + 3).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			myJson[hash[0]] = hash[1];
		}
		return myJson;
	},
	//计算手续费，百分数转换成小数
	toPoint(num, amout) {
		var sxf
		if (!num) {
			return 0
		}
		if (num.indexOf("%") == -1) {
			sxf = num
		} else {
			sxf = num.replace("%", "") / 100 * amout
		}
		sxf = parseFloat(sxf) //字符转数字
		//console.log(typeof(sxf))
		return sxf;
	},
	//清空两边空字符
	trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},
	addZero(val) {
		let data = 0;
		if ((val || val == 0) && val < 10) {
			data = '0' + val;
		} else {
			data = val;
		}
		return data;
	},
	getMobile() {
		if (/android/i.test(navigator.userAgent)) {
			return 'android';
		}
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			return 'ios';
		}
	},
	getUrlVars(url) {
		var hash;
		var myJson = {};
		var hashes = url.slice(url.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			myJson[hash[0]] = hash[1];
		}
		return myJson;
	},
	is_Show_Jump() {
		if (/MicroMessenger/.test(navigator.userAgent) || /QBWebViewType/.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		}
	},
	//js判断当前页面是否在微信浏览器中打开
	is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	//判断是不是移动端iPHone Safair浏览器打开的本页面
	is_IOS_Safair() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('applewebkit') > -1 && ua.indexOf('mobile') > -1 && ua.indexOf('safari') > -1 &&
			ua.indexOf('linux') == -1 && ua.indexOf('android') == -1) {
			return true;
		} else {
			return false;
		}
	},
	sleep(second) {
		second = 20
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				console.log('sleep')
				resolve()
			}, second * 1000)
		})
	},
	//检测是否认证
	async is_CA(authLevel,jumpUrl,goUrl){
		let status = 0;
		try {
			let res = await base.getCertificate(authLevel)
			status = res.data.result;
			if(status!=3){
				uni.showToast({
					title:'请先实名认证'
				})
				setTimeout(() => {
					uni.navigateTo({
						url: jumpUrl
					});
				}, 1500)
			}else{
				uni.navigateTo({
					url: goUrl
				});
			}
			return status;
		} catch (e) {
			return status;
		}
	}
}
