let baseUrl;
let payUrl;
let socketUrl;
let webUrl;
let exchangeUrl;
let walletUrl;
let domain;
let c2cUrl;
let lockUrl;
// let appIosDownloadUrl = "itms-services://?action=download-manifest&url=https://datares.oss-cn-shanghai.aliyuncs.com/maibi/maibi.plist";
// let appAndroidDownloadUrl = "https://datares.oss-cn-shanghai.aliyuncs.com/maibi/maibi.apk";
let schemaUrl = 'maibi://';
let protocol;

function getMainHost() {
    let key = `mh_${Math.random()}`;
    let keyR = new RegExp(`(^|;)\\s*${key}=12345`);
    let expiredTime = new Date(0);
    let domain = document.domain;
    let domainList = domain.split('.');

    let urlItems = [];
    // 主域名一定会有两部分组成
    urlItems.unshift(domainList.pop());
    // 慢慢从后往前测试
    while (domainList.length) {
        urlItems.unshift(domainList.pop());
        let mainHost = urlItems.join('.');
        let cookie = `${key}=${12345};domain=.${mainHost}`;

        document.cookie = cookie;

        //如果cookie存在，则说明域名合法
        if (keyR.test(document.cookie)) {
            document.cookie = `${cookie};expires=${expiredTime}`;
            return mainHost;
        }
    }
}

//包升级后端参数地址/自动检测一天一次
let update = {};

uni.setStorageSync('test', 3)

if (process.env.NODE_ENV == 'development') {
	console.log('开发环境')
	// domain = "192.168.1.17";
	if (uni.getStorageSync('test') == "1") {
		domain = "192.168.31.82";
	}
	if (uni.getStorageSync('test') == "2") {
		domain = "192.168.31.50"
	}
	if (uni.getStorageSync('test') == "3") {
		domain = "127.0.0.1"
	}

	webUrl = 'http://' + domain + ':8080';
	webUrl = 'http://192.168.31.143:8081';
	baseUrl = 'http://' + domain + ':4001/api/v1';
	payUrl = 'http://' + domain + ':4002/api/v1';
	exchangeUrl = 'http://' + domain + ':4003/api/v1';
	c2cUrl = 'http://'+domain+':4004/api/v1';
	//payUrl = 'http://singpay.natapp1.cc/api/v1';
	socketUrl = 'ws://' + domain + ':4003';
	walletUrl = 'http://'+ domain+':4010/api/v1';
	lockUrl = 'http://'+ domain+':4015/api/v1';
	// update.url = 'http://192.168.1.20:8080/static/update.txt';
	update.expires = 1000 * 60; //1分钟
	//console.log(domain)
	//console.log(baseUrl)
} else {
	console.log('生产环境');
	// #ifdef H5
	protocol =  window.location.protocol;
	// domain = getMainHost();
	protocol = 'https:';
	// domain = '99ex.co';
	domain = 'renbi.io';
	
	if (document.domain != "localhost" && document.domain != "127.0.0.1") {
        domain = getMainHost();
    }
	// #endif
	
	// #ifdef APP-PLUS
	protocol =  'https:';
	//domain = 'mai.bi';
    //domain = '99ex.co';
    domain = 'renbi.io';
	// #endif
	
	console.log('domain', domain);
	
	webUrl = `${protocol}//${domain}`;
    baseUrl = `${protocol}//baseapi.${domain}/api/v1`;
    c2cUrl = `${protocol}//c2capi.${domain}/api/v1`;
    exchangeUrl = `${protocol}//exapi.${domain}/api/v1`;
    socketUrl = (protocol=='http:'?'ws':'wss')+`://exapi.${domain}`;
	walletUrl = `${protocol}//walletapi.${domain}/api/v1`;
	lockUrl = `${protocol}//lockapi.${domain}/api/v1`;
	update.expires = 1000 * 60*60; //1小时
	console.log(baseUrl);
}

let shareAppUrl = webUrl + '/#/pages/user/shareApp/shareApp';//分享app下载地址

module.exports = {
	baseUrl,
	payUrl,
	exchangeUrl,
	socketUrl,
	webUrl,
	update,
	c2cUrl,
	schemaUrl,
	walletUrl,
	shareAppUrl,
	lockUrl
}