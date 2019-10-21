import config from '@/config';
import common from '@/common';

let httpClient = common.http.init(config.payUrl);

function init (){
    return [{
        "name":"薪付宝管理",
        "sort":0,
        "type": 0,
        "url":"/singpay/",
        "icon": "el-icon-lx-copy",
        "perms":"",
        "children":[{
            "name":"银行记录",
            "sort":0,
            "type": 1,
            "url":"/singpay/bankhistory",
            "perms":"",
            "children":[
              {
                "name":"查看",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"singpay:bankhistory:view",
                "children":null
              },
              {
                "name":"通过或取消",
                "sort":0,
                "type": 2,
                "url":"",
                "perms":"singpay:bankhistory:passAndCancel",
                "children":null
              }
            ]
          },
          {
            "id":59,
            "name":"企业申请",
            "parentId":37,
            "sort":0,
            "type": 1,
            "url":"/singpay/enterprise",
            "perms":"",
            "children":[
              {
                "id":106,
                "name":"查看",
                "parentId":59,
                "type": 2,
                "sort":0,
                "url":"",
                "perms":"singpay:enterprise:view",
                "children":null
              }
            ]
          },
        ]
    }]
}

export default {
    init,
    //获取企业申请记录
    async getApplyList(){
        return (await httpClient.get('/admin/singpay/apply/list'));
    },
    // 获取法币充提记录
    async getBankHistory(data){
        return (await httpClient.get('/admin/singpay/bank/history',data));
    },
    // 审核法币提现
    async setHistoryResult(data){
        return (await httpClient.post('/admin/singpay/bank/setHistoryResult',data));
    },

}
