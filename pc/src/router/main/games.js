const gameIndex = resolve => require(['@/games/pages/common/index'], resolve);
export default [
    // {
    //     path: '/games',
    //     name: 'games',
    //     redirect: '/games',
    //     meta: {
    //         title: '游戏'
    //     },
    //     component: gameIndex,
    //     children: [
    //         {
    //             path: '/games/dice',
    //             name: 'dice',
    //             meta: {
    //                 title: '骰子'
    //             },
    //             component: resolve => require(['@/games/pages/views/dice/index.vue'], resolve)
    //         }, {
    //             path: '/dice/banker',
    //             name: 'banker',
    //             meta: {
    //                 title: '成为庄家'
    //             },
    //             component: resolve => require(['@/games/pages/views/dice/banker/index.vue'], resolve)
    //         }, {
    //             path: '/dice/historybooks',
    //             name: 'historybooks',
    //             meta: {
    //                 title: '投注记录'
    //             },
    //             component: resolve => require(['@/games/pages/views/dice/historybooks/index.vue'], resolve)
    //         }
    //     ]
    // },

]

