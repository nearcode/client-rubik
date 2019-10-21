import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.taskUrl);

function init (){
    let data=[
        {
          "id": 93,
          "name": "任务管理",
          "parentId": 0,
          "sort": 0,
          "icon": "el-icon-lx-copy",
          "parentName": "根目录",
          "url": "/task/",
          "type": 0,
          "perms": "",
          "children": [
            {
              "id": 94,
              "name": "任务列表",
              "parentId": 93,
              "sort": 0,
              "icon": "",
              "parentName": "任务管理",
              "url": "/task/tasklist",
              "type": 1,
              "perms": "",
              "children": [
                {
                  "id": 133,
                  "name": "查看",
                  "parentId": 94,
                  "sort": 0,
                  "icon": "",
                  "parentName": "任务列表",
                  "url": "",
                  "type": 2,
                  "perms": "task:tasklist:view",
                  "children": null
                },
                {
                  "id": 139,
                  "name": "添加",
                  "parentId": 94,
                  "sort": 0,
                  "icon": "",
                  "parentName": "任务列表",
                  "url": "",
                  "type": 2,
                  "perms": "task:tasklist:add",
                  "children": null
                },
                {
                  "id": 140,
                  "name": "修改",
                  "parentId": 94,
                  "sort": 0,
                  "icon": "",
                  "parentName": "任务列表",
                  "url": "",
                  "type": 2,
                  "perms": "task:tasklist:edit",
                  "children": null
                },
                {
                  "id": 141,
                  "name": "删除",
                  "parentId": 94,
                  "sort": 0,
                  "icon": "",
                  "parentName": "任务列表",
                  "url": "",
                  "type": 2,
                  "perms": "task:tasklist:del",
                  "children": null
                }
              ]
            }
          ]
        }
      ];

      return data;
}

export default {
    init,
    // 新增任务
    async addTask(data) {
        return await httpClient.post('/admin/task/add',data);
    },
    // 任务列表
    async taskList(p) {
        return await httpClient.get('/admin/task/list',{
            p
        });
    },
    // 删除任务
    async taskDel(id) {
        return await httpClient.post('/admin/task/del',{
            id
        });
    },
    // 关闭任务
    async taskClose(data) {
        return await httpClient.post('/admin/task/close',data);
    },
    // 停止任务
    async taskStop(data) {
        return await httpClient.post('/admin/task/stop',data);
    },

    // 启动任务
    async taskOpen(data) {
        return await httpClient.post('/admin/task/start',data);
    },
    // 修改任务
    async editTask(data) {
        return await httpClient.post('/admin/task/update',data);
    },

}
