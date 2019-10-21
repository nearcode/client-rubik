// import Vue from 'vue';
import axios from 'axios'
import store from 'src/store'
import {Message} from 'element-ui';
// import router from '@/router';
import {i18n} from '@/common/language'
import {Notification} from 'element-ui';


// let apiUrl = ''
// let HOST = process.env.HOST;
// console.log(HOST)
// if(HOST === 'prod'){
//     apiUrl = 'http://10.1.28.221:12001'
// }
// if(HOST === 'test'){
//     apiUrl = 'http://10.88.10.31:12002'
// }
// // axios.defaults.baseURL = apiUrl;


// axios 配置
axios.defaults.baseURL = window.API_URL;
// axios.defaults.timeout = 5000

// http request 拦截器
axios.interceptors.request.use(config => {

        if (store.state.isLogin()) {
            config.headers.Authorization = 'Bearer ' + localStorage.token
        }
        return config
    },
    err => {
        console.error('错误的传参', 'fail');
        return Promise.reject(err)
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data && response.data.token) {  //当token存在的时候就更新token
            localStorage.token = response.data.token;
        }
        return response;
    },
    error => {
        console.error(error.response)
        if (error && error.response) {
            switch (error.response.status) {
                case 401:
                    Message.error('权限不足');
                    // router.push({path: '/403'});
                    break;
                case 404:
                    Message.error('请求路径错误');
                    break;
                case 500:
                    Message.error('服务器异常');
                    break;
                // this.$router.push({path: '/403'});
                // // 返回 401 清除token信息并跳转到登录页面
                // store.commit('logout')&&store.commit('logout').then(() => {
                //     this.router.push({path: '/login'});
                // }).catch(err => {
                //     console.log(err)
                // });
            }
            function message() {
                if (error.response.data && !error.response.data.authType && !error.response.data.verify) {
                    if (error.response.data.message) {
                        return error.response.data.message;
                    } else if (error.response.data.error) {
                        return error.response.data.error;
                    } else {
                        return error.response.data;
                    }
                }
            }
            if(!error.response.data.authType ){
                // Message.error(i18n.t(message()))
                Notification({
                    title: '提示',
                    message: i18n.t(message()),
                    type:'error'
                    // duration: 0
                });
            }
        }else {
            Notification({
                title: '提示',
                message: '网络出现问题，请稍后再试',
                type:'error'
                // duration: 0
            });
        }
        return Promise.reject(error.response)   // 返回接口返回的错误信息
    });

export default axios
