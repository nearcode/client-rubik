import Vue from 'vue'
import Router from 'vue-router'
// import store from 'src/store/index'
import Main from './main.js'
import store from '@/store/index'
import index from '@/pages/common/index'
// import games from './main/games'
// import { Loading } from 'element-ui';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';

// 游戏
// const gameIndex = resolve => require(['@/games/pages/common/index'], resolve);
// import games from './main/games.js'

// const index = resolve => require(['@/pages/common/index'], resolve);
// const Login = resolve => require(['@/pages/login/login'], resolve);
Vue.use(Router);

let myRouter = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            redirect: '/',
            component: index,
            children: Main
        },
        // {
        //     path: '/games',
        //     name: 'games',
        //     redirect: '/games',
        //     meta: {
        //         title: '游戏'
        //     },
        //     component: gameIndex,
        //     children: games
        // },
        {
            path: '/login',
            name: 'login',
            meta: {
                title: '登录'
            },
            component: resolve => require(['@/pages/login/login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/'
        }, {
            path: '/loading',
            name: 'loading',
            meta: {
                title: 'loading'
            },
            component: resolve => require(['@/pages/loading/loading.vue'], resolve)
        },

        {
            path: '/signup',
            name: 'signup',
            meta: {
                title: '注册'
            },
            component: resolve => require(['@/pages/signup/signup.vue'], resolve)
        },
        {
            path: '/forgetPass',
            name: 'forgetPass',
            meta: {
                title: '重置密码'
            },
            component: resolve => require(['@/pages/forgetPass/forgetPass.vue'], resolve)
        }, {
            path: '/appDownload',
            name: 'appDownload',
            meta: {
                title: 'APP下载'
            },
            component: resolve => require(['@/pages/common/appDownload/index.vue'], resolve)
        },
    ]
});

myRouter.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})

//使用钩子函数对路由进行权限跳转
myRouter.beforeEach((to, from, next) => {
    // 动态设置网站标题
    let loop = () => {
        if (store.state.webTitle) {
            let _title = store.state.webTitle;
            if (to.meta.title) {
                document.title = _title + ' - ' + to.meta.title;
            } else {
                document.title = _title;
            }
            if (store.state.favicon) {
                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = store.state.favicon;
                document.getElementsByTagName('head')[0].appendChild(link);
            };
            return
        } else if (to.meta.title) {
            document.title = to.meta.title;
            return
        }
        setTimeout(loop, 100)
    };
    setTimeout(loop, 100);
    let _path = to.path;


  
    // let loadingInstance = Loading.service();

    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        if (!localStorage.getItem('token')) {
            next('/login')
        } else {
            next();

            // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            //     // loadingInstance.close();
            //   });
        }
    } else {
        next();

    }
    NProgress.done();


});

// myRouter.beforeEach((to, from, next) => {
//   let pathName = to.path.split('/')[1];
//
//   let isLogin =localStorage.getItem('token');
//
//   // 未登录可以访问的页面
//   let arr = ['home','trade',''];
//   // 已登录不可以访问的页面
//   let sarr = ['login', 'signup'];
//
//   // 已经登陆过 要跳转login时
//   if (sarr.indexOf(to.name) !== -1 && isLogin) {
//     next('/');
//     return false
//   }
//   if (!isLogin) {
//     if (arr.indexOf(pathName) === -1) {
//       // 如果是登录页面路径，就直接next()
//       if (to.path === '/login') {
//         next()
//       } else { // 不然就跳转到登录；
//         next('/login')
//       }
//     } else {
//       next()
//     }
//     return false
//   } else {
//     next()
//   }
// });

export default myRouter
