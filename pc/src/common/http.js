import {i18n} from '@/common/language'
import {Notification} from 'element-ui';
import {Message} from 'element-ui';
import router from '@/router';

let Fly = require("flyio/dist/npm/fly");

function init(baseURL){
  let fly = new Fly;
  
	// http request 拦截器
	fly.interceptors.request.use((request) => {
		//给所有请求添加自定义header
		request.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
    request.baseURL = baseURL
		//可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
        // console.log(request)
        if (request.body){
		    for (var key in request.body) {
		        if (typeof request.body[key] == "undefined") delete request.body[key];
            }
        }
		return request;
	});

	// http response 拦截器
	//添加响应拦截器，响应拦截器会在then/catch处理之前执行
	fly.interceptors.response.use(
		(response) => {
      //只将请求结果的data字段返回
			return response.data
		},
		(error) => {
			// console.log(error.response);
			//发生网络错误后会走到这里
      if (error && error.response) {
        switch (error.response.status) {
          case 401:
            // Message.error('权限不足');
            // router.push({path: '/403'});
              // // 返回 401 清除token信息并跳转到登录页面
              localStorage.removeItem('token');
            break;
          case 404:
            Message.error('请求路径错误');
            break;
          case 500:
            Message.error('服务器异常');
            break;
          // this.$router.push({path: '/403'});

        }
        
        function message() {

          if (error.response.data && !error.response.data.authType && !error.response.data.verify) {
            if (error.response.data.message) {
              return error.response.data.message;
            } else if (error.response.data.error) {
              return error.response.data.error;
            } else {
              return error.response.data;
            }
          }else if(error.response.data.verify && error.response.data.error){
              return error.response.data.error;
          }
        }
    
      if(!error.response.data.authType && !error.response.data.verify){
        
          // Message.error(i18n.t(message()))
          Notification({
            title: '提示',
            message: i18n.t(message()),
            type:'error'
            // duration: 0
          });
        }else if(error.response.data.verify && error.response.data.error){
          Notification({
            title: '提示',
            message: i18n.t(message()),
            type:'error'
            // duration: 0
          });
        }
      }else {
    
        // Notification({
        //   title: '提示',
        //   message: '网络出现问题，请稍后再试',
        //   type:'error'
        //   // duration: 0
        // });
      }
			return Promise.reject(error.response?error.response.data:"")
		}
	)
	return fly;
}
export default {
	init
}
