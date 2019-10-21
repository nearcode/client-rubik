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

if (process.env.NODE_ENV == 'development') {
    // var domain = '192.168.2.134';
    var domain = "127.0.0.1";
    // var domain = '192.168.31.82';
    // let domain = '192.168.31.50';
    var baseUrl = `http://${domain}:4001/api/v1`;
    var payUrl = `http://${domain}:4002/api/v1`;
    var c2cUrl = `http://${domain}:4004/api/v1`;
    var socketUrl = `ws://${domain}:4003`;
    var exchangeUrl = `http://${domain}:4003/api/v1`;
    var walletUrl = `http://${domain}:4010/api/v1`;
    var lockUrl = `http://${domain}:4015/api/v1`;
    var diceUrl = `http://${domain}:4040/api/v1`;
    var wsdiceUrl = 'ws://'+domain+':4040';
} else {
    //正式
    var protocol = window.location.protocol;
    var domain = getMainHost();

    //保护措施，不能修改，本地测试不影响
    if (document.domain != "localhost" && document.domain != "127.0.0.1") {
        domain = getMainHost();
    }

    var baseUrl = protocol + `//baseapi.${domain}/api/v1`;
    var c2cUrl = protocol + `//c2capi.${domain}/api/v1`;
    var exchangeUrl = protocol + `//exapi.${domain}/api/v1`;
    var socketUrl = (protocol=="http:"?"ws":"wss")+`://exapi.${domain}`;
    var walletUrl=protocol+`//walletapi.${domain}/api/v1`;
    var lockUrl=protocol+`//lockapi.${domain}/api/v1`;
    var diceUrl=protocol+`//diceapi.${domain}/api/v1`;
    var wsdiceUrl = (protocol=='http:'?'ws':'wss')+`://diceapi.${domain}`;
}

let mainSite= false;
let isRenBi = false;

module.exports = {
    baseUrl,
    // payUrl,
    diceUrl,
    getMainHost,
    mainSite,
    isRenBi,
    walletUrl,
    c2cUrl,
    lockUrl,
    socketUrl,
    wsdiceUrl,
    exchangeUrl
};