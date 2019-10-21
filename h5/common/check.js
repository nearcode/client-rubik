

export default {
	getExplorer: function (){
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
}
