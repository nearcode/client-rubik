import Vue from 'vue';

import router from './router';
import config from './config' // 配置信息
import base from './common/js/base' // 配置信息
import store from 'src/store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import 'element-ui/lib/theme-chalk/display.css'
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
import App from './App';
import "babel-polyfill";
import { i18n } from './common/language'
import Verify from './components/common/verify' //密码验证框
import * as filters from './filters/filters.js'
import adminApi from '@/api/admin'


Vue.component('Verify', Verify);
Vue.use(base);  //公共函数
Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$config = config; // 将control控制函数挂载到vue的原型上

//获取指定用户信息
Vue.prototype.getUserInfo = function (self, account, callback) {
    if (!account) return;
    clearTimeout(self._inter);
    self._inter = setTimeout(async () => {
        try {
            let result = await adminApi.getUserInfo(account);
            callback(result.data)
        } catch (e) {

        }
    }, 1000 * 1.5);
};

Vue.prototype.getPerms = function (str) {
    if (!str) return true;
    // console.log(store.state.perms);
    let permissions = store.state.perms || [];
    if (permissions.indexOf(str) != -1) {
        return false
    } else {
        return true
    }
}


Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
