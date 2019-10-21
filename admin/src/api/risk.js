import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.riskURl);

function init() {
  let data = [
    {
      "name": "风控管理",
      "sort": 0,
      "icon": "el-icon-lx-copy",
      "url": "/risk/",
      "type": 0,
      "perms": "",
      "children": [
        // {
        //   "name": "设置",
        //   "sort": 0,
        //   "icon": "",
        //   "parentName": "风控管理",
        //   "url": "/risk/setting",
        //   "type": 1,
        //   "perms": "",
        //   "children": [
        //     {
        //       "name": "查看",
        //       "sort": 0,
        //       "icon": "",
        //       "parentName": "设置",
        //       "url": "",
        //       "type": 2,
        //       "perms": "risk:setting:view",
        //       "children": null
        //     },

        //   ]
        // },
        // {
        //   "name": "执行记录",
        //   "sort": 0,
        //   "icon": "",
        //   "parentName": "风控管理",
        //   "url": "/risk/history",
        //   "type": 1,
        //   "perms": "",
        //   "children": [
        //     {
        //       "name": "查看",
        //       "sort": 0,
        //       "icon": "",
        //       "parentName": "执行记录",
        //       "url": "",
        //       "type": 2,
        //       "perms": "risk:histroy:view",
        //       "children": null
        //     },

        //   ]
        // },
        {
          "name": "风险警告",
          "sort": 0,
          "icon": "",
          "parentName": "风控管理",
          "url": "/risk/warning",
          "type": 1,
          "perms": "",
          "children": [
            {
              "name": "查看",
              "sort": 0,
              "icon": "",
              "parentName": "风险警告",
              "url": "",
              "type": 2,
              "perms": "risk:warning:view",
              "children": null
            },

          ]
        },
      ]
    }
  ];
  return data;
}
export default {
  init,
  // 获取报警日志
  async riskLog(data) {
    return await httpClient.get('/admin/risk/alerts/log', data);
  },
  // 确认风控信息
  async riskConfirm(data) {
    return await httpClient.post('/admin/risk/alerts/confirm', data);
  },
}
