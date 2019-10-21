import {BigNumber} from 'bignumber.js'

BigNumber.config({ERRORS: false, DECIMAL_PLACES: 10, EXPONENTIAL_AT: 1e+9});
import common from '@/filters';

let autoNumber = function (n, len) {
    if(n=='--') return n;
    return common.autoFixed(n);
    // var number = common.toNumber(n);
    // var str = new BigNumber(number).toString().split('.')[1];
    // var n = common.getAutoNumber(number);
    // if (str && str.length > n) n = str.length;
    // return common.toFixedEx(number, len || n);
}
let autoFixed = function (n) {
    return common.autoFixed(n);
}
let toFixedEx = function (number, len) {
    return common.toFixedEx(number, len);
}
let toCNY = function (coin, data) {
    return common.toCNY(coin, data);
}
let toC2C = function (coin, data) {
    return common.toC2C(coin, data);
}
let toCNYs = function (datas) {
    return common.toCNYs(datas);
}
let getCoin = function (str) {
    return common.getCoin(str);
}
let getBaseCoin = function (str) {
    return common.getBaseCoin(str);
}
let getSymbol = function (str) {
    return common.getSymbol(str);
}
let estimate = function (str) {
    return common.estimate(str);
}
let toDate = function (date, detail) {
    var newDate = new Date(date)
    var year = newDate.getFullYear()
    var month = newDate.getMonth() + 1
    var day = newDate.getDate()
    var hours = newDate.getHours()
    var minutes = newDate.getMinutes()
    var seconds = newDate.getSeconds()
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (day >= 0 && day <= 9) {
        day = '0' + day
    }

    if (detail) {
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }
    return year + '-' + month + '-' + day
}
// 年份
let toYear = function (val) {
    var date = new Date(val)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}
// 时间
let timer = function (val) {
    if (!val) return ' -- : -- ';
    var date = new Date(val*1000);
    let padDate = function (va) {
        return va < 10 ? '0' + va : va;
    };
    return padDate(date.getHours()) + ':' + padDate(date.getMinutes()) + ':' + padDate(date.getSeconds());
}
// 日期加时间
let toTimeStr = function (val) {
    if (!val) return ' -- : -- ';
    let date = new Date(val*1000);

    let padDate = function (va) {
        return va < 10 ? '0' + va : va;
    };
    let month = padDate(date.getMonth() + 1);
    let day = padDate(date.getDate());
    let hour = padDate(date.getHours());
    let minutes = padDate(date.getMinutes());
    let seconds = padDate(date.getSeconds());

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
}
//CNN_BTC  转换为BTC/CNN
let toString = function (str) {
    if(!str) return;
    var arr = str.split('_')
    var newStr = arr[0] + '/' + arr[1]
    return newStr
}

let toAccount = function (str) {
    if (str.mobile) return str.mobile;
    else if (str.email) return str.email;
    else return '--';
};

let toName = function (str, val) {
    let newStr;
    if (str.username) newStr = str.username;
    else if (str.truename) newStr = str.truename;
    else newStr = '--';
    if (val) return newStr + ' - ' + val;
    return newStr;
};

let noData = function (str, val) {
    if(str || str===0){
        return str;
    }else {
        return '--';
    }

};
// 数组以逗号分隔
let toJoin = function (str, val) {
    if(str) {
        return str.join(',');
    }else {
        return '--';
    }
};

// 涨跌颜色
let tickersColor = function (val) {
    if(!val) return;

    let red='font-red',green='font-green';

    if (val >0){
        return red
    }else if ((val < 0)) {
        return green
    }
};
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

export {
    toString,//后端显示币种名转换前端显示名
    autoNumber, //自动调整价格小数位数
    autoFixed,  //自动调整数量小数位数
    toFixedEx,  //调整小数点位数
    toCNY,      //估算人民币价值
    toCNYs,
    toC2C,      //估算人民币价值
    getCoin,    //获取交易对币名，C2C_BTC BTC/C2C == BTC
    getBaseCoin,    //获取交易对主币名 C2C_BTC BTC/C2C == C2C
    getSymbol,      //获取币所对应的符号
    estimate,   //估算数值 100000 = 10万 1000=1000
    toDate, //时间
    toYear, //年份
    timer, //时间
    toTimeStr, //日期加时间
    toAccount, //优先显示手机号
    toName, //优先显示真实姓名
    noData,
    toJoin,
    getDictValue,
    tickersColor //涨跌颜色
}


/*autoNumber  价格 、宽度自动，一般用于价格*/
/* autoFixed 数量 过滤参数   eg: 1000.12345678   转换为1000.12 一般用于数量*/
/*toCNY   转换人名币   coin：币种名，，data数量，   {BTC:0.1} 可以多币种转换  eg:toCNY({BTC:0.1, ETH:1,...等})*/
