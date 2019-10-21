// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import base from './common/base';

import { i18n } from './common/language';
// import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
// import 'font-awesome/css/font-awesome.css';

import * as filters from './filters/filters.js';
import Verify from './pages/common/verify'; //密码验证框

Vue.use(base) //公共函数
Vue.use(ElementUI, { size: 'small',zIndex: 300 });
Vue.component('Verify', Verify);

Vue.prototype.$eventBus = new Vue(); // Global event bus

Vue.config.productionTip = false;

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    components: { App },
    template: '<App/>'
})
