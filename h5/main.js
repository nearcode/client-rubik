import Vue from 'vue'
import App from './App'
import store from './store'
import * as filters from '@/filters'

import navBar from '@/components/nav/nav.vue';
Vue.component('navBar',navBar)

import goodNavBar from '@/components/nav/goodNav.vue';
Vue.component('goodNavBar',goodNavBar)

import showMsg from '@/components/showMsg/showMsg';
Vue.component('showMsg',showMsg)

Vue.prototype.$store = store;

import VueI18n from 'vue-i18n';
Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: uni.getStorageSync('language')||'zh',
	messages: {
		'zh': require('@/js/lang/zh'),
		'en': require('@/js/lang/en')
	},
	silentTranslationWarn: true //关闭错误提示
})  

Vue.prototype._i18n = i18n;

import common from '@/js/common'

import _consts from '@/config/const';
Vue.prototype._consts = _consts;

Vue.config.productionTip = false

App.mpType = 'app'

 //公共函数
Vue.prototype.$common=common;
import $tools from '@/common'
Vue.prototype.$tools=$tools;

Vue.prototype.$eventBus = new Vue(); // Global event bus

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

const app = new Vue({
	i18n, 
    ...App
})
app.$mount()
