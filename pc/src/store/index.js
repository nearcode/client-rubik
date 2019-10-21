import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import common from "@/common"
import config from "@/config";
import base from "@/api/base";
import c2cApi from "@/api/c2c";
import exchangeApi from "@/api/exchange";
import color from './color'

const store = new Vuex.Store({
    state: {
        username: "",
        uid: '',
        truename: '',
        mobile: '',
        coins: {},
        email: '',
        webTitle: '',
        avatarUrl: '',
        authLevel: '',
        payPassword: false,
        baiduAi: {},
        balances: {},
        baseCoinList: [],
        links: [],
        c2cInfo: {},
        businessLogo: '',
        businessName: '',
        address: '',
        lastUrl: '',
        tickers: null,
        tickersList: {},
        banners: [],
        markets: [],
        logo: null,
        favicon: null,
        contacts:[],
        appLogo: null,
        coinsTags:[],
        discount:"",
        vip:"0",
        inviteCode:"",
        appVersion:{}, //app版本
        theme:"white",
        themeColor: "#14889A", // 主题颜色
        oldThemeColor: "#14889A", // 上一次主题颜色
        screenWidth: document.documentElement.clientWidth, //屏幕宽度
        screenHeight: document.documentElement.clientHeight, //屏幕高度
        isLogin() {
            let token = localStorage.getItem('token');
            if (!token) return false;
            let result = token.split('.')[1];
            result = result.replace(new RegExp("\r\n", "gm"), "");
            result = result.replace(new RegExp("\"", "gm"), "\'");
            result = result.replace(/ /g, '')
            result = result.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
            result = result.replace('-', '+').replace('_', '/');
            // console.log(common.base64.decode(result))
            try {
                let exp = JSON.parse(common.base64.decode(result)).exp;
                if (!exp) return false;
                return Math.round(new Date().getTime() / 1000) <= exp;
            } catch (e) {
                return false;
            }
        },
        // 获取单币种余额
        getBance(coin) {
            let balances = localStorage.getItem('balances');
            return balances[coin] ? balances[coin].available : 0;
        }
    },
    
    mutations: {
        // 改变主题颜色
        setThemeColor(state, themeColor) {
            state.theme = themeColor;
            console.log(themeColor)
            document.body.className = state.theme;
            localStorage.setItem('theme',themeColor);
        },
        // 获取Tickers
        async getTickers(state, callback) {
            try {
                let result = await exchangeApi.marketTickers();
                let res = result.data;
                for (let pair in res) {
                    res[pair].pair = pair;
                    res[pair].name = pair.split('_')[0] + '/' + pair.split('_')[1];
                }
                state.tickers = JSON.stringify(res);
                localStorage.tickers = JSON.stringify(res);
                // if (!localStorage.pair) localStorage.pair = this.$common.getDefaultMarket();
                let lastPrices = {};
                for (let ticker in res) {
                    lastPrices[ticker] = res[ticker].last || 0
                }
                localStorage.lastPrices = JSON.stringify(lastPrices);
                callback && callback(res)
            } catch (e) {

            }
        },
        // 先获取所有币种数量
        async getBalances(state, callback) {
            try {
                let data = await base.getBalances();
                let arr = data.data;
                arr[config.defaultCoin].available = arr[config.defaultCoin].available.toFixed(2) //保留两位小数
                state.balances = arr;
                localStorage.getItem("balances", state.balances);
                callback && callback(arr);
            } catch (e) {}
        },
        async getInfo(state, callback) {
            let info = {};
            let setInfo = () => {
                state.uid = info.uid;
                state.authLevel = info.authLevel;
                state.businessName = info.businessName;
                state.webTitle = info.siteInfo.title;
                document.title = state.webTitle;
                state.address = info.address;
                state.businessLogo = info.businessLogo;
                state.truename = info.truename;
                state.username = info.username;
                state.discount = info.discount;
                state.vip = info.vip;
                state.links = info.siteInfo.links;
                state.banners = info.siteInfo.banners;
                state.logo = info.siteInfo.logo;
                state.inviteCode = info.siteInfo.inviteCode;
                state.favicon = info.siteInfo.favicon;
                state.contacts = info.siteInfo.contacts;
                state.appLogo = info.siteInfo.appLogo
                state.mobile = info.mobile;
                state.baseCoinList = info.baseCoinList;
                state.email = info.email;
                state.coins = info.coins;
                state.payPassword = info.payPassword;
                state.avatarUrl = info.authLevel;
                config.baiduAi = state.baiduAi = info.baiduAi;
            }
            // try{
            //     info = JSON.parse(localStorage.getItem('info'))||{}
            //     if (Object.keys(info).length != 0) {
            //         setInfo()
            //         callback && callback(info)
            //     }
            // }catch(e){
            // }
            base.getInfo().then((res)=>{
                info = res;
                setInfo()
                localStorage.setItem('favicon', state.favicon)
                localStorage.setItem('info', JSON.stringify(info));
                // if (Object.keys(info).length == 0) {
                    callback && callback(res)
                // }
            }).catch(()=>{})
        },
        async getMarkets(state, callback) {
            try {
                state.markets = await exchangeApi.getMarkets();
                localStorage.setItem("baseCoinList", JSON.stringify(state.markets));
            } catch (e) {
                console.log(e)
            }
        },
        setTickers(state, tickers) {
            state.tickersList = tickers;
        },
        // 获取app版本
        async getAppList(state,callback){
          
            try{
                let result= await base.appList();

                state.appVersion =result.data;

                localStorage.setItem('appVersion',JSON.stringify(state.appVersion));
                
                callback && callback( state.appVersion );
            }catch(e){
                
            }
        },
          // 获取币种标签
          async getCoinsTags(state,callback){
          
            try{
                let result= await base.getCoinsTags();

                state.coinsTags =result.data;

                localStorage.setItem('coinsTags',JSON.stringify(state.coinsTags));
                
                callback && callback(state.coinsTags );
            }catch(e){
                
            }
        },
        async getC2C(state, callback) {
            if (Object.keys(state.c2cInfo).length > 0) {
                return callback && callback(state.c2cInfo)
            };

            try {
                // state.baseInfo=JSON.parse( localStorage.getItem('baseInfo')) || {};

                let result = await c2cApi.getC2C();

                state.c2cInfo = result.data;

                callback && callback(state.c2cInfo);
                localStorage.setItem("c2cInfo", JSON.stringify(state.c2cInfo));

            } catch (e) {
                callback && callback()
            }

        }
    },
    modules:{
        color
    }
});
export default store