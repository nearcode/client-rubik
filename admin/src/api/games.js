import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.gamesUrl);

function init () {
    return [{
        "name": "游戏管理",
        "sort": 0,
        "type": 0,
        "url": "/games/",
        "icon": "el-icon-lx-copy",
        "perms": "",
        "children": [{
            "name": "币种设置",
            "sort": 0,
            "url": "/games/invest",
            "perms": "",
            "type": 1,
            "children": [{
                "name": "查看",
                "sort": 0,
                "url": "",
                "type": 2,
                "perms": "games:invest:view",
                "children": null
            },{
                "name": "添加或修改",
                "sort": 0,
                "url": "",
                "type": 2,
                "perms": "games:invest:update",
                "children": null
            },{
                "name": "删除",
                "sort": 0,
                "url": "",
                "type": 2,
                "perms": "games:invest:del",
                "children": null
            }, ]
        }],
    }];           
}


export default {
  
    // 设置币种
    async setCoins(data) {
        return await httpClient.post("/admin/game/coins/update",data)
    },
    // 币种列表
    async getCoins(data) {
        return await httpClient.get("/coins",data)
    },
    // 删除币种
      async delCoin(data) {
        return await httpClient.post("/admin/game/coins/del",data)
    },
    init,
}
