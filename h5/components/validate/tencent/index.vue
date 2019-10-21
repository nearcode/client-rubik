<template>
    <div>
        
    </div>
</template>
    
<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            // 加载验证码
            loadV2Script() {
// 				console.log(window.TencentCaptcha)
// 				let pages = getCurrentPages();
// 				console.log(pages)
// 				// #ifdef APP-PLUS 
// 				var pages = getCurrentPages();  
//                 var page = pages[pages.length - 1];  
//                 var currentWebview = page.$getAppWebview();  
//                 // #endif  
// 
				//#ifdef H5
                if (typeof window.TencentCaptcha === "function") {
                    return Promise.resolve();//如果已经加载就直接放回
                } else {
                    return new Promise(resolve => {
                        var script = document.createElement("script");
						script.src = "https://ssl.captcha.qq.com/TCaptcha.js";
                        script.async = true;
                        script.onload = script.onreadystatechange = function (){
                            if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete"){
                                resolve();
                                script.onload = script.onreadystatechange = null;
                            }
                        };
                        document.getElementsByTagName("head")[0].appendChild(script);

                    });
                }
				//#endif
				
            },
            // 滑块验证
            vaptch(callback){
				let appid = uni.getStorageSync('tencentCaptchaAppid')
				if(typeof(appid) == 'number') {
					appid = appid+''
				}
                if (!appid) callback();
                //腾讯
                this.loadV2Script().then(() => {
                    var captcha1 = new TencentCaptcha(appid,callback);
                    captcha1.show(); // 显示验证码
                });
            },
        }
    }
</script>

    