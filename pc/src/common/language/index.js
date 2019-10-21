import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh'
import en from './en'
import ko from './ko'

Vue.use(VueI18n);


// 语言切换
function lang() {
    let lang = window.localStorage.getItem('lang') || (navigator.language || navigator.userLanguage).substr(0, 2);
    if (lang) {
        return lang
    } else {
        return 'zh';
    }
}

localStorage.setItem('lang', lang());
const language = lang();

export const i18n = new VueI18n({
    locale: language,
    messages: {
        'zh':zh,
        'en':en,
        'ko':ko
    }
});

export function changeLanguage (lang) {
    i18n.locale = lang;
    localStorage.setItem('lang', lang)
}
