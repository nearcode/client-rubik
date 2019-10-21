import Vue from 'vue'
import Router from 'vue-router'
import store from 'src/store/index'
import Main from './main.js'
import index from '@/components/common/Home'
// import config from '@/config'

import children from "./main/index.js"


// let init =async()=>{
//    store.commit('menuCreate');
// }

// init();


// const index = resolve => require(['@/components/common/home'], resolve);
const Login = resolve => require(['@/components/signin/Login'], resolve);

Vue.use(Router);

let myRouter = new Router({
    mode: 'history',
    // base: '/',
    // mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'index',
            redirect: (to) => {
            //     // let Level = store.state.level;
            //     //
            //     // if (Level && config.showLevelList[Level]) {
            //     //     // console.log(Level, config.showLevelList[Level])
            //     //     return config.showLevelList[Level][1]; //配置当前权限等级的默认页面
            //     // } else {
                    return '/index'
            //     // }
            },
            component: index,
            // children:Main,
            children: children
        },
        // {
        //     path: '*',
        //     redirect: '/index'
        // },
        {
            path: '/loading',
            name: 'loading',
            meta: {
                title: 'loading'
            },
            component: resolve => require(['@/components/common/loading/loading.vue'], resolve)
        },
        {
            path: '/login',
            component: Login,
            meta: {title: '登录'}
        },
    ]
});

store.commit("getRoleMenu",(e)=>{
    addDynamicRoutes(store.state.roleMenu);
});

// 动态创建路由
function addDynamicRoutes(menuList) {
    
    let routers=[],perms=[];

    let loop =(data)=>{
        for (let item of data) {
            for (let router of Main){
                if(item.url==router.path){
                    routers.push(router)
                }
            }
            if(item.perms){
                perms.push(item.perms);
            }
            if(item.children){
                loop(item.children)
            }
        }
    };

    loop(menuList);
    
    store.commit('setPerms',perms);

    let newRouters=children.concat(routers);
    myRouter.addRoutes([
        {
            path: '/',
            name: 'index',
            redirect: (to) => {
                // let Level = store.state.level;
                //
                // if (Level && config.showLevelList[Level]) {
                //     // console.log(Level, config.showLevelList[Level])
                //     return config.showLevelList[Level][1]; //配置当前权限等级的默认页面
                // } else {
                    return routers[0].path
                // }
            },
            component: index,
            children: newRouters
        },
         {
            path: '*',
            redirect: '/404'
        },
    ]);
//    if(to) myRouter.push(to.path);
    // myRouter.push(newRouters[9]?newRouters[9].path:'/404')
    console.log('动态路由创建成功');
   
}

// let getLastUrl=(str,yourStr)=>str.slice(str.lastIndexOf(yourStr)) //取到浏览器出现网址的最后"/"出现的后边的字符
// //使用钩子函数对路由进行权限跳转
myRouter.beforeEach((to, from, next) => {
    let loop = () => {
        if (store.state.webTitle) {
            let _title = store.state.webTitle + '-管理系统';
            if (to.meta.title) {
                document.title = _title + ' - ' + to.meta.title;
            } else {
                document.title = _title;
            }
            return
        }
        setTimeout(loop, 0)
    };

    setTimeout(loop, 0);

    const role = localStorage.getItem('token');

    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        to.meta.permission.view ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            // Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
            //     confirmButtonText: '确定'
            // });
        } else {
  
            if(!store.state.menuRouteLoaded){
                store.commit("getRoleMenu",(e)=>{
                    addDynamicRoutes(e);
                });
            }
            next();
            // next({...to,replace:true});
        }
    }

});
export default myRouter
