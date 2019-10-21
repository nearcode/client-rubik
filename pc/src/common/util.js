//工具

let setToken = function (token) {
    uni.setStorageSync('token', token)
}
let setAmount = function (mount) {
    uni.setStorageSync('amountstore', mount)
}
function showToast(title, type){
	if (!title) return;
	uni.showToast({
		title: title,
		icon: type||'none',
		duration: 1500 //持续的时间
	});
}
function toFixed(amount,n) {
	if(!amount || amount == NaN) return 0;
	if(!n) n = 8;
	var str = parseFloat(amount).toFixed(9);
	var re = eval("/(\\.\\d{" + n + "})\\d+$/");
	return str.replace(re, "$1");
}

function toNum(obj,dosNum) {
	//修复第一个字符是小数点的情况.		
	if(obj != '' && obj.substr(0, 1) == '.') {
		obj = "";
	}
	obj = obj.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效	
	obj = obj.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符	
	obj = obj.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的     
	obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	
	if(dosNum){
		obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //控制只能输入两个小数
	}

	if(obj.indexOf(".") < 0 && obj != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
		if(obj.substring(0, 1) == '0' && obj.length == 2) {
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
export default {
	setToken,
	showToast,
	setAmount,
	toFixed,
	toNum
}