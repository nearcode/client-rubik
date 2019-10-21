import { Message } from 'element-ui';
import store from '@/store';
import common from '@/filters/index.js'
import tools from '@/common'

// 全局函数
export default {
    install(Vue, options) {
        Vue.prototype.$common = common;
        Vue.prototype.$tools = tools;
        Vue.prototype.$store = store;
        // 涨跌幅颜色
        Vue.prototype.tickersColor = function (val, type) {
            let red = ' font_red',
                green = ' font_green',
                common = ' iconfont ',
                up = common + ' icon-arrowup icon-long_arrow_up',
                down = common + ' icon-arrowdown icon-long_arrow_down';

            if (val >= 0) {
                return type ? green + '' + up : green;
            } else if ((val < 0)) {
                return type ? red + '' + down : red;
            }
        };

        // 复制内容
        Vue.prototype.copy = function (e) {
            let o = document.createElement("textarea");
            let n;
            o.value = e,
                o.style.position = "absolute",
                o.style.top = -1e4,
                o.style.left = -1e4,
                document.body.appendChild(o),
                o.select();
            try {
                n = document.execCommand("copy");
            } catch (e) {

            }
            document.body.removeChild(o);
            if (n) {
                Message.success('复制成功')
            } else {
                Message.error('浏览器不支持，请手动复制！')
            }
        }

        // 获取币种图标
        Vue.prototype.getCoinIcon = function (coin) {
            if (!coin) return;
            let coins = store.state.coins;

            if (coins[coin] && coins[coin].logo) {
                return coins[coin].logo;
            } else if (coin == 'favicon') {
                return store.state.favicon;
            } else {
                return '/static/assets/coins/' + coin.toLowerCase() + '.png'
            }

        };
    }
};
