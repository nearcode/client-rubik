//工具

let setToken = function(token) {
	uni.setStorageSync('token', token)
}
let setAmount = function(mount) {
	uni.setStorageSync('amountstore', mount)
}

function showToast(title, type, time = 1500) {
	if (!title) return;
	if (title == {}) {
		title = '服务器故障'
		console.log(title)
	}
	uni.showToast({
		title: title,
		icon: type || 'none',
		duration: time, //持续的时间
	});
}

// function toFixed(amount, n) {
// 	if (!amount || amount == NaN) return 0;
// 	if (!n) n = 8;
// 	var str = amount + "";
// 	var re = eval("/(\\.\\d{" + n + "})\\d+$/");
// 	return str.replace(re, "$1");
// }

function toFixed(amount, n) {
	if (!amount || amount == NaN) return 0;
	if (!n) n = 8;
	let str = amount + "";
	if(str.indexOf('.') == -1){//整数
	    str = str + '.';
	    while(n > 0){
	    	str = str+'0';
	    	n--;
	    }
	    return str;
	}else{
		let data = str.split('.');
		let decimal = data[1];
		let length = decimal.length
		if(length == n){//直接返回
			return str;
		}else if(length > n){//截取
			decimal = decimal.slice(0,n);
			return data[0]+'.'+decimal;
		}else{//补充0
			while(n-length > 0){
				decimal = decimal+'0';
				n--;
			}
			return data[0]+'.'+decimal;
		}
	}
}

function toNum(obj, dosNum) {
	//修复第一个字符是小数点的情况.		
	if (obj != '' && obj.substr(0, 1) == '.') {
		obj = "";
	}
	obj = obj.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效	
	obj = obj.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符	
	obj = obj.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的     
	obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

	if (dosNum) {
		obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //控制只能输入两个小数
	}

	if (obj.indexOf(".") < 0 && obj != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
		if (obj.substring(0, 1) == '0' && obj.length == 2) {
			obj = obj.substring(1, obj.length);
		}
	}
	//整个数字不能超过长度为8多少的数字？
	//				if(obj.length > 6) {
	//					obj = obj.substring(0, obj.length - 1)
	//				}
	//删除空格
	obj = obj.trim(' ');
	//console.log(obj)
	return obj
}

function isWeixinOrAlipay() {
	var ua = window.navigator.userAgent.toLowerCase();
	//判断是不是微信
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return "weixin";
	}
	//判断是不是支付宝
	if (ua.match(/AlipayClient/i) == 'alipayclient') {
		return "alipay";
	}
	//哪个都不是
	return "";
}
//字符串转json
function toJson(str, value = {}) {
	try {
		return JSON.parse(str);
	} catch (e) {
		return value;
	}
}
//自动省去多出的位数
let getAutoNumber = function(amount) {
	var n = Math.abs(amount);
	if (n == 0) return 0;
	// if (this >= 10) return 2;
	// if (this >= 1) return 3;
	if (n >= 0.1) return 3;
	if (n >= 0.01) return 4;
	if (n > 0.001) return 6;
	return 8;
};
let autoFloat = function(amount){
	amount = parseFloat(amount);
	let n = getAutoNumber(amount);
	return toFixed(amount, n);
};
export default {
	setToken,
	showToast,
	setAmount,
	toFixed,
	toNum,
	getAutoNumber,
	toJson,
	isWeixinOrAlipay,
	autoFloat
}