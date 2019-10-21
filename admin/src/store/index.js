import Vue from 'vue'
import Vuex from 'vuex'
import {stat} from 'fs';

Vue.use(Vuex);

import common from "@/common"
import config from "@/config";
import base from "@/api/base";
import admin from "@/api/admin";
import exchange from "@/api/ex";
import apiMain from "@/api/main";
import {Message} from 'element-ui';
import mvmApi from "@/api/mvm"

const store = new Vuex.Store({
    state: {
        webTitle: '',
        markets: [],
        coins: {},
        lastPrices: {},
        merchantFee: 0,
        level: 0,
        uid: '',
        uid2: 0,
        webLogo: window.LOGO,
        username: '',
        email: '',
        authType: {},
        favorites: [],
        lastPage: '',
        mobile: '',
        perms:[],
        roleType:null,
        adminRoleList:[],//角色列表
        roleMenu:[],//当前用户权限菜单
        roleId:null,
        issuerCoins:{
            isRun:false,
            coins:[]
        }, //mvm 当前项目方支持币种
        permissions:[], //权限
        menuRouteLoaded:false,//改变菜单和路由的加载状态
        adminLevelList: {1: '管理员', 2: '超级管理员', 4: '客服', 6: '编辑', 7: '财务'},
        ArticleType: {1: '新闻', 2: '公告', 3: '声明', 4: '上币', 5: '协议', 6: '个人帮助',7:'企业帮助'},
        // 保存登录状态
        isLogin: function () {
            let token = localStorage.token;
            if (!token) return false;
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace('-', '+').replace('_', '/');
            let exp = JSON.parse(window.atob(base64)).exp;
            if (!exp) return false;
            console.log(Math.round(new Date().getTime() / 1000), exp)
            return Math.round(new Date().getTime() / 1000) <= exp;
        },
        login(state) {
            state.isLogin()
        },
       
        // 判断手机号码是否绑定成功
        bindSuccess(state, val) {
            state.mobile = val
        },
        getLevel() {
            let token = localStorage.token;
            if (!token) return 0;
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace('-', '+').replace('_', '/');
            console.log(window.atob(base64))
            try {
                let level = JSON.parse(window.atob(base64)).level;
                return level;
            } catch (e) {
                return 0
            }

        }
    },
 
    mutations: {
        async getAdminRoleList(state){
            state.adminRoleList= JSON.parse( localStorage.getItem('adminRoleList')) || [];
            try{
                state.adminRoleList=await admin.roleList();
                localStorage.setItem('adminRoleList', JSON.stringify(state.adminRoleList));
            }catch(e){

            }
        },
        async getBalances(state, callback) {
            try {
                let data = await base.getBalances();
                let arr = data.data;
                arr[config.defaultCoin].available = arr[config.defaultCoin].available.toFixed(2)//保留两位小数
                state.balances = arr;
                localStorage.getItem("balances", state.balances);
                callback && callback(arr);
            } catch (e) {
            }
        },
        logout(state) {
            console.log('退出登录')
            window.localStorage.removeItem('token');
            localStorage.clear();
            window.location.reload();//退出登录后清除vuex内容
            state.level = null;
            state.isLogin()
        },
        //获取初始信息
        async getInfo(state, callback) {
            try {
                let info = await admin.getInfo();
                state.webTitle = info.siteInfo.title;
                state.merchantFee = info.merchantFee;
                state.autoWithdrawalBalance = info.autoWithdrawalBalance;
                state.unprocessedOrders = info.unprocessedOrders;
                state.links = info.siteInfo.links;
                state.referrers = info.siteInfo.referrers || {coins: {}, stocks: {}}
                // document.title = state.webTitle+'后台管理系统';
                // localStorage.markets = JSON.stringify(info.baseCoinList);
                // localStorage.baseCoin = info.baseCoinList[0];
                state.coins = info.coins;
                state.allCoins = info.allCoins;
                state.isMaster = info.isMaster;
                localStorage.coins = JSON.stringify(info.coins);
                state.lastPrices = info.lastPrices;
                localStorage.lastPrices = JSON.stringify(state.lastPrices || '{}');
                localStorage.merchantFee = info.merchantFee;
                localStorage.tencentCaptchaAppid = info.tencentCaptchaAppid;
                if (!info.uid) return callback && callback(info);
                state.uid = info.uid;
                state.uid2 = info._id;
                state.roleType=info.roleType;
                state.username = info.username;
                state.email = info.email;
                state.roleId=info.roleId;
                state.authType = info.authType;
                state.favorites = info.favorites || [];
                localStorage.favorites = JSON.stringify(state.favorites)
                state.mobile = info.mobile;
                localStorage.setItem('mobile', info.mobile);
                // state.baseCoinList = info.baseCoinList;
                // state.baseCoin = info.baseCoinList[0];
                window.localStorage.webTitle = info.siteInfo.title;
                state.level = state.getLevel();
                callback && callback(info)
            } catch (e) {
                console.error(e)
            }

        },
        // 创建菜单
        async menuCreate(state,callback){
            try{
               console.log(apiMain)
                let result = await admin.menuCreate({menu:apiMain});
            
                Message.success('菜单更新成功')
            }catch(e){

            }
            callback && callback(true)
        },
        //c2c/setting
        async getPermissions(state, callback) {
            // if (state.permissions.length > 0) {
            //     return callback && callback(state.permissions)
            // };
            state.permissions =JSON.parse(localStorage.getItem('permissions')) || [];

            try {
                let result=await admin.menuList();
                let data=[];
                data.push({
                    "id": 0,
                    "name": "根目录",
                    "children": result
                });
                
                state.permissions = data;

                localStorage.setItem('permissions',JSON.stringify(state.permissions))

                callback && callback(state.permissions)
            } catch (e) {
                console.log(e)
            }

        },
        async getRoleMenu(state,callback){//获取当前角色菜单
            if(!state.isLogin()) return;
            if( state.menuRouteLoaded ) return callback && callback(state.roleMenu);

            
            store.commit('menuRouteLoaded', true) //保存当前角色菜单状态
            try {
                state.roleMenu=await admin.getRole();

                // localStorage.setItem('roleMenu',JSON.stringify(state.roleMenu);

                callback && callback(state.roleMenu)
            }catch (e) {

            }
        },
        setPerms(state, perms){  // 用户权限标识集合
            state.perms = perms;
        },
        menuRouteLoaded(state,menuRouteLoaded){ //改变用户菜单加载状态
            state.menuRouteLoaded = menuRouteLoaded;
        },
        async getMarkets(state, callback) {
            try {
                state.markets = await exchange.getMarkets();
            } catch (e) {
                console.log(e)
            }
        },
        // mvm 获取当前账号支持的币种
        async issuerGet(state, callback) {
            if(state.issuerCoins.isRun) return;
            try {
                state.issuerCoins['coins'] =(await mvmApi.issuerGet()).coins;
                state.issuerCoins['isRun'] = 'true';
            } catch (e) {
                console.log(e)
            }
        },
    }
});

export default store
