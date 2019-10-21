let showLevelList = {
    //超级管理员权限
    2: ["/users", "/index","/enterprise","/role" ,"/Administrator", "/cdd", "/financial", "/LegalCoinRecharge", "/givingrecords", "/info", "/ChargedHistory", "/userPosition","/transferRecord", "/WithdrawalRequest", "/CMS", "/Article", "/coin", "/coins", "/tradePair","/task","/tasklist", "/SystemSettings", "/Setting", "/linkSettings", "/BannerSetting", "/Recommended", "/C2C", "/C2CSetting", "/ServiceProviders","/c2cAuditList"]
    // 管理员权限
    ,
    1: ["/users", "/index", "/cdd", "/financial", "/info", "/ChargedHistory", "/WithdrawalRequest", "/userPosition", "/moneyChange", "/financial-1", "/financial-2", "/poj", "/share", "/ICO", "/joinorder", "/C2C", "/ServiceProviders", "/records", "/lock", "/lock", "/cents", "/CMS", "/Article", "/coin", "/coins", "/SystemSettings", "/setting", "/linkSettings", "/BannerSetting", "/Recommended"]
    ,
    // 客服权限

    4: ["/users", "/index", "/cdd","/enterprise", "/financial", "/ChargedHistory","/LegalCoinRecharge"]

    // 编辑权限
    ,
    6: ["/CMS", "/Article", "/SystemSettings", "/linkSettings", "/BannerSetting"]
    // 财务权限
    ,
    7: ["/financial", "/info", "/ChargedHistory", "/WithdrawalRequest", "/userPosition", "/moneyChange", "/financial-1", "/financial-2"]
}
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
// //测试
if (process.env.NODE_ENV == 'development') {
    // var domain = '192.168.2.134';
    // var domain = '192.168.31.82';
    // var domain = '192.168.31.50';
    var domain = "127.0.0.1";
    var adminUrl = "http://"+domain+":4006/api/v1";
    var payUrl = "http://"+domain+":4002/api/v1";
    var baseUrl="http://"+domain+":4001/api/v1";
    var c2cUrl = "http://"+domain+":4004/api/v1";
    var exchangeUrl="http://"+domain+":4003/api/v1";
    var taskUrl="http://"+domain+":4011/api/v1";
    var walletUrl="http://"+domain+":4010/api/v1";
    var gamesUrl="http://"+domain+":4040/api/v1";
    var biPayUrl="http://"+domain+":4008/api/v1";
    var robotUrl="http://"+domain+":4006/api/v1";
    var mvmUrl="http://"+domain+":4014/api/v1";
    var lockUrl="http://"+domain+":4015/api/v1";
    var riskURl = "http://"+domain+":4110/api/v1"
} else {
    //
    //正式
    var protocol = window.location.protocol;
    let domain = getMainHost();
    var adminUrl = protocol+`//adminapi.${domain}/api/v1`;
    var payUrl = protocol+`//payapi.${domain}/api/v1`;
    var baseUrl = protocol+`//baseapi.${domain}/api/v1`;
    var c2cUrl = protocol+`//c2capi.${domain}/api/v1`;
    var exchangeUrl = protocol+`//exapi.${domain}/api/v1`;
    var taskUrl = protocol+`//taskapi.${domain}/api/v1`;
    var walletUrl=protocol+`//walletapi.${domain}/api/v1`;
    var gamesUrl=protocol+`//gamesapi.${domain}/api/v1`;
    var biPayUrl=protocol+`//biPayapi.${domain}/api/v1`;
    var robotUrl=protocol+`//robotapi.${domain}/api/v1`;
    var mvmUrl=protocol+`//mvmapi.${domain}/api/v1`;
    var lockUrl=protocol+`//lockapi.${domain}/api/v1`;
    var riskURl=protocol+`//riskapi.${domain}/api/v1`;
}

module.exports = {
    adminUrl,
    payUrl,
    c2cUrl,
    biPayUrl,
    robotUrl,    
    exchangeUrl,
    taskUrl,
    walletUrl,
    baseUrl,
    lockUrl,
    gamesUrl,
    showLevelList,
    mvmUrl,
    riskURl
}

// {1:'管理员',2:'超级管理员',4:'客服',6:'编辑',7:'财务'}
// 配置等级权限菜单
