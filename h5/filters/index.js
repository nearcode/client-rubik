import common from '@/js/common';
import tools from '@/common';

// let autoNumber = function(n, len){
//     var number = common.toNumber(n);
//     var str = new BigNumber(number).toString().split('.')[1];
//     var n = common.getAutoNumber(number);
//     if (str && str.length > n) n = str.length;
//     return common.toFixedEx(number, len || n);
// }
let toFixed = function(amount,n){
    return tools.util.toFixed(amount,n);
}

let autoFixed = function(n){
    return common.autoFixed(n);
}
let toFixedEx = function(number, len){
   // return common.toFixedEx(number, len);
   return tools.util.toFixed(number, len);
}
let toCNYs = function (datas) {
    return common.toCNYs(datas);
}
let toCNY = function(coin, data){
    return common.toCNY(coin, data);
}
let getCoin = function(str){
    return common.getCoin(str);
}
let getBaseCoin = function(str){
    return common.getBaseCoin(str);
}
let getCoinLogo = function(str){
	return common.getCoinLogo(str);
}
let getSymbol = function(str){
    return common.getSymbol(str);
}
let estimate = function(str){
    return common.estimate(str);
}

//CNN_BTC  转换为BTC/CNN
let toString = function(str) {
    var arr = str.split('_')
    var newStr = arr[0] + '/' + arr[1]
    return newStr
}
let getDictValue = function (data, item, def="--") {
    let items = item.split(".");
    try {
        for (let item of items){
            data = data[item]
        }
        return data || def;
    }catch (e) {
        return def;
    }
};
let marketToName = function(market) {
	return tools.util.marketToName(market);
}

//BTC_CNY 转成 BTC/CNY；
let marketToPair = function(str){
	return common.marketToPair(str);
}

let formatTime = function(time, format="MM-dd hh:mm"){
	return tools.date.toString(time,format);
}

export {
    toString,//后端显示币种名转换前端显示名
    // autoNumber, //不会省略多出的小数
    autoFixed,  //会省略多出的小数
    toFixedEx,  //调整小数点位数
    toCNY,      //估算人民币价值
	toCNYs,
    getCoin,    //获取交易对币名，C2C_BTC BTC/C2C == BTC
    getBaseCoin,    //获取交易对主币名 C2C_BTC BTC/C2C == C2C
    getSymbol,      //获取币所对应的符号
    estimate,   //估算数值 100000 = 10万 1000=1000
	marketToName,
	getDictValue,
	toFixed,
	marketToPair,
	formatTime
}


/*autoNumber  价格 、宽度自动，一般用于价格*/
/* autoFixed 数量 过滤参数   eg: 1000.12345678   转换为1000.12 一般用于数量*/
/*toCNY   转换人名币   coin：币种名，，data数量，   {BTC:0.1} 可以多币种转换  eg:toCNY({BTC:0.1, ETH:1,...等})*/