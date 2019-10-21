import common from '@/common'
var Fly = require("flyio/dist/npm/wx")
function init(baseURL){
	var fly = new Fly
	// http request 拦截器
	fly.interceptors.request.use((request) => {
		request.baseURL = baseURL
		try{
			//给所有请求添加自定义header
			request.headers.Authorization = 'Bearer ' + uni.getStorageSync('token')
			//console.log(request.baseURL+request.url)
			//可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
			// alert(request.baseURL+request.url)
		}catch(e){
			//TODO handle the exception
		}
		
		return request;
	})
	
	// http response 拦截器
	//添加响应拦截器，响应拦截器会在then/catch处理之前执行
	fly.interceptors.response.use(
		(response) => {
			//只将请求结果的data字段返回
			return response.data
		},
		(error) => {
			console.log(error.response)
			console.log(JSON.stringify(error.response))
			if(error.response == undefined){
				console.log('网络失败https')
				//common.util.showToast('网络异常')
			}
			//console.log(JSON.stringify(error.response))
			//发生网络错误后会走到这里
			if (error.response) {
				switch (error.response.status) {
					case 401:
					    console.log('401error')
					    var pages = getCurrentPages()
					    var page = pages[pages.length - 1];
					    console.log('当前页',page.route);
					    if(page.route == 'pages/user/shareApp/shareApp') return false;//二维码页面不需要登录
						if(page.route == 'pages/exchange/chart/chart') return false;
						// 返回 401 清除token信息并跳转到登录页面
						uni.removeStorageSync('token')		
						uni.navigateTo({
							url:"/pages/login/login"
						})
				}
			}
			return Promise.reject(error.response?error.response.data:"")
		}
	)
	return fly;
}
export default {
	init
}
