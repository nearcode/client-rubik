<template>
	<uni-popup :h5Top="h5Top" :show="show" :showmask="showmask" position="bottom" @hidePopup="togglePopup('')" class="codeUniPopup">
		<view class="code padding-left padding-right padding-bottom">
			<view class="bar flex justify-between align-center margin-bottom" style="border-bottom: 1px solid rgba(208, 217, 222, 0.52);">
				<text class="text-xl font-col text-bold">安全验证</text>
				<text class="text-df" @tap="togglePopup('')">取消</text>
			</view>		
			<form class="wallet-form">
			   <text class="account label flex flex-sub" style="line-height: 30upx;margin-top:15px">{{vAccount}}</text>
			   <view class="group flex justify-between align-center">
			   		<input class="flex flex-sub text-left" type="number" v-model="authCode" placeholder="请输入验证码"/>
			   		<view class="countdown">
			   			<view class="get-code font-col" v-if="!codeTime" @tap="getCode">获取验证码</view>
			   			<view class="time" v-else>{{ codeTime }}秒后获取</view>
			   		</view>
			   </view>
			</form>
			
			<view class="submit">
				<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabledCode" @tap="confirm">{{buttonText}}</button>
			</view>
			
		</view>
		
		<show-msg v-if="errormsg" :errormsg="errormsg" :errortype="errortype" @hideMsg="hideMsg" id="msgUniPopup"></show-msg>
		
	</uni-popup>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
   	import common from '@/common';
    import base from '@/api/base';
    import {mapState} from 'vuex';
	import showMsg from '@/components/showMsg/showMsg';

	export default {
		data() {
			return {
				authCode: '',
				disabledCodeValue: false,
				h5Top:true,
				showmask:true,//显示遮罩
				showClearIcon: {
					'authCode': false,
				},
				codeTime: 0 ,//倒计时起始值为0
				apiError:'',
				errortype:'',
			}
		},
		props: ['type', 'account', 'buttonText','codeType','dataCaptcha','vAccount'],
		components: {
			uniPopup,
			showMsg
		},
		computed: {
			disabledCode: function() {
				return (this.authCode) ? (this.disabledCodeValue ? true : false) : true
			},
			show:function(){
				if(this.type==='bottom'){
					return true;
				}else{
					return false;
				}
			},
			myaccount:function(){
				return this.account;
			},
			mycodeType:function(){
				return this.codeType;
			},
			errormsg:function(){
				if(this.apiError){
					this.errortype = 'top';
					return this.apiError
				}else{
					return '';
				}
			}
		},
		methods: {
			hideMsg(type){
				this.errortype = type;
			},
			confirm() {
				this.disabledCodeValue = true;
				this.$emit('confirmTrue',this.authCode);
				setTimeout(()=>{
					this.disabledCodeValue = false;
				},3000)
			},
			togglePopup(type) {
				this.authCode = '';
				this.$emit('togglePopups',type);
			},
			clearInput: function(event) {
				let id = event.target.dataset.id;
				if (event.target.value.length > 0) {
					this.showClearIcon[`${id}`] = true;
				} else {
					this.showClearIcon[`${id}`] = false;
				}
			},
			//获取敏感操作验证码
			async getCodeVerify() {
				try {
					let res = await base.getCode();
					console.log(JSON.stringify(res))
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e){
						this.apiError = this._consts.networkFail;
						return;
					} 
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
			//获取绑定邮箱或者手机验证码
			async getBindEmailOrMobileCode(account) {
				try {
					let res = await base.getBindEmailOrMobileCode(account);
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e){
						this.apiError = this._consts.networkFail;
						return;
					} 
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
			//获取登录验证码
			async getLoginCode() {
				console.log(this.dataCaptcha)
				try {
					let res = await base.getLoginCode(
					    this.account,
					    this.dataCaptcha.auType,
						this.dataCaptcha.captchaId,
						this.dataCaptcha.captcha
					);
					console.log(JSON.stringify(res))
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e){
						this.apiError = this._consts.networkFail;
						return;
					} 
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
					if(e.captcha == false){
						//重新获取验证码
						this.$eventBus.$emit('getCaptchaAgains');//传给子组件
					}
				}
			},
			//获取注册验证码
			async registerCode() {
				try {
					let res = await base.getSignUpCode(
					   this.account,
					   this.dataCaptcha.auType,
					   this.dataCaptcha.captchaId,
					   this.dataCaptcha.captcha
					);
					console.log(JSON.stringify(res))
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e){
						this.apiError = this._consts.networkFail;
						return;
					} 
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
					if(e.captcha == false){
						//重新获取验证码
						this.$eventBus.$emit('getCaptchaAgains');//传给子组件
					}
				}
			},
			//忘记重置登录密码
			async resetPasswordCode() {
				try {
					let res = await base.resetPasswordCode(
					this.account,
					this.dataCaptcha.auType,
					this.dataCaptcha.captchaId,
					this.dataCaptcha.captcha
					);
					console.log(JSON.stringify(res))
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e){
						this.apiError = this._consts.networkFail;
						return;
					} 
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
					if(e.captcha == false){
						//重新获取验证码
						this.$eventBus.$emit('getCaptchaAgains');//传给子组件
					}
				}
			},
			//验证码分类
			async getCode() {
				this.apiError = '';//重置
				this.endTime(); //开始倒计时
				if (this.errormsg) { //如果报错
				    this.errortype = 'top'
					return false;
				}
				console.log('codeType:'+this.codeType)
				console.log('account:'+this.account)
				switch (this.codeType) {
					case 'mobileCode':
						if (!this.account) {
							//common.util.showToast('请输入手机号码');
							this.apiError = '请输入手机号码';
							return false;
						}
						this.getBindEmailOrMobileCode(this.account);
						break;
					case 'emailCode':
						if (!this.account) {
							this.apiError = '请输入邮箱';
							//common.util.showToast('请输入邮箱');
							return false;
						}
						this.getBindEmailOrMobileCode(this.account);
						break;
					case 'loginCode':
						this.getLoginCode();
						break;
					case 'registerCode':
						this.registerCode();
						break;
					case 'resetloginPasswordCode':
					this.resetPasswordCode();
					break;
					default:
						this.getCodeVerify()
						break;
				}
			},
			// 获取验证码倒计时
			endTime() {
				if (this.timer) {
					clearInterval(this.timer)
				}
				this.codeTime = 59;
				//this.codeTime = 4;
				this.timer = setInterval(() => {
					if (this.codeTime > 0 && this.codeTime <= 59) {
						this.codeTime--;
					} else {
						clearInterval(this.timer);
					}
				}, 1000);
			}
		},
		watch:{
		}
	}
</script>

<style lang="less" scoped>
	
	.codeUniPopup {
		.uni-popup-bottom {
			
		}


	}
</style>
