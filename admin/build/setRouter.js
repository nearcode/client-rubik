'use strict'
// 动态设置VUE 路由
const fs = require('fs')
const path = require('path')
// const hostConfig = require('../hostConfig')
let routerMainUrl = path.resolve(__dirname, '../src/router/main.js')
let menuMainUrl = path.resolve(__dirname, '../src/api/main.js')
// let projectPath = path.resolve(__dirname, '../src/product')
let configArgv = process.env.npm_config_argv

let runType = JSON.parse(configArgv).cooked[1]
let cooked = JSON.parse(configArgv).cooked[2]
// let menuModule = JSON.parse(configArgv).cooked[3];

let params = require('./params');
let modules = params().m;

// let itemType = ''
// if (cooked) {
//     itemType = cooked.split('-')[1]
// }

let moduleType = '';
if (modules) {
    moduleType = modules.split(",");
}


console.log(cooked, runType)

const setRouter = function (argument) {
    // let arr = ['main']  // 默认公共的组件 比如个人中心，登录，注册什么的
    let menu = ['base'] //菜单模块
    if (runType === 'dev') { // 开发环境
        // if(itemType){
        //     arr.push(itemType)
        // }

        for (let item of moduleType) {
            menu.push(item);
        }

        console.log(menu)
    }
    if (runType === 'build') { // 生产环境
        // if (!itemType) {
        //     console.error('ERRL: 打包参数错误，\n 交易所项目请执行：npm run build -ex， \n 支付请执行： npm run build -pay')
        //     return false
        // }

        // arr = ['main', ' ' + itemType]

        for (let item of moduleType) {
            menu.push(item);
        }

        console.log(menu)
    }

    // if (hostConfig.ex_open === '1') {
    //   arr.push(' ex') // eslint 规定数组后面要先有个空格，不然编译就会报eslint的错误 打包的时候也会报错
    // }
    // if (hostConfig.otc_open === '1') {
    //   arr.push(' otc')
    // }
    // if (hostConfig.co_open === '1') {
    //   arr.push(' contract')
    // }
    // let arrString = arr.join(',')
    // let routerContent = ''
    // arr.map((item) => {
    //     item = item.replace(/(^\s*)|(\s*$)/g, '') // 正则是为了去掉前面的空格 因为 import 的路径不能有空格
    //     console.log(item)
    //     if (item === 'main') {
    //         routerContent += `import ${item} from './${item}/main.js'\n`
    //     } else {
    //         routerContent += `import ${item} from '@/product/admin-vue-${item}/router/index.js'\n`
    //     }
    // })

    // routerContent += 'let content=[]\n'
    // routerContent += `let routerArr = content.concat(${arrString})\nexport default routerArr\n`
    // fs.writeFile(routerMainUrl, routerContent, (err, data) => {
    //     console.log('\n', routerContent)
    //     console.log('router设置成功')
    // })



    let apiContent = '';
    menu.map((item) => {
        item = item.replace(/(^\s*)|(\s*$)/g, '');
        if (item === 'base') {
            apiContent += `import ${item} from '@/api/admin.js'\n`
        } else {
            apiContent += `import ${item} from '@/api/${item}.js'\n`
        }

    })

    for (let index in menu) {
        menu[index] += '.init()';
    }

    let menuString = menu.join(',');

    apiContent += 'let content=[]\n'
    apiContent += `let menuArr = content.concat(${menuString})\nexport default menuArr\n`
    fs.writeFile(menuMainUrl, apiContent, (err, data) => {
        console.log('\n', apiContent)
        console.log('模块设置成功')
        console.log('module，\n npm run build -m=c2c,ex,task,robot,wallet,singpay,games,bipay,mvm,lock')
    })

}
setRouter()
