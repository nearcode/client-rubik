<template>
	<view class="countdown">
		<!-- {{codeType}}
		{{account}} -->
		<view class="get-code font-col" v-if="!codeTime" @tap="getCode">获取验证码</view>
		<view class="time" v-else>{{ codeTime }}秒后获取</view>
		<show-msg v-if="errormsg" :errormsg="errormsg" :errortype="errortype" @hideMsg="hideMsg" id="msgUniPopup"></show-msg>
	</view>
</template>

<script>
	import common from '@/common';
	import base from '@/api/base';
	import showMsg from '@/components/showMsg/showMsg';
	import {
		mapState
	} from 'vuex';

	export default {
		props: ['start','account','codeType'],

		data() {
			return {
				codeTime: 0 ,//倒计时起始值为0
				apiError:'',
				errortype:'',
			};
		},
		components: {
			showMsg
		},
		computed:{
			...mapState(['mobile']),
			errormsg:function(){
				if(this.apiError){
					this.errortype = 'top';
					return this.apiError
				}else{
					return '';
				}
			}
		},
		onShow() {
			console.log(this.account)
		},
		methods: {
			hideMsg(type){
				this.errortype = type;
			},
			//获取敏感操作验证码
			async getCodeVerify() {
				if(!this.mobile){//如果没有手机号，也没有填入账号的情况下
					if(!this.account){
						//common.util.showToast('请输入手机/账号')
						this.apiError = '请输入手机/账号';
						return false;
					}
				}
				try {
					if (this.account) {
						try {
							let res = await base.getBindEmailOrMobileCode(this.account);
							this.$emit('sendSuss', res.suc);
						} catch (e) {
							if(!e){
								this.apiError = this._consts.networkFail;
								//common.util.showToast('网络不通');
								return false;
							}
							if(e.error)
							this.apiError = this.$t(e.error);
						}
					} else {
						try{
							await base.getCode();
						}catch(e){
							if(!e){
								this.apiError = this._consts.networkFail;
								//common.util.showToast('网络不通');
								return false;
							}
							if(e.error)
							this.apiError = this.$t(e.error);
						}
					}
				
				} catch (e) {
					if(!e){
						this.apiError = this._consts.networkFail;
						//common.util.showToast('网络不通');
						return false;
					}
					if(e.error)
					this.apiError = this.$t(e.error);
				}
			},
			//获取绑定邮箱或者手机验证码
			async getBindEmailOrMobileCode(account) {
				try {
					let res = await base.getBindEmailOrMobileCode(account);
					console.log(JSON.stringify(res))
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e) return;
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
			//获取登录验证码
			async getLoginCode() {
				try {
					let res = await base.getLoginCode();
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e) return;
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
			//获取注册验证码
			async registerCode(account, tokens) {
				try {
					let res = await base.getSignUpCode(account, tokens);
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e) return;
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
			//忘记重置登录密码
			async resetPasswordCode(account, tokens) {
				try {
					let res = await base.resetPasswordCode(account, tokens);
					this.$emit('sendSuss', res.suc);
				} catch (e) {
					if (!e) return;
					if (e.error) {
						this.apiError = this.$t(e.error);
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
				console.log(this.codeType)
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
					console.log('111')
					console.log(this.account);
						if (!this.account) {
							//common.util.showToast('请输入邮箱');
							this.apiError = '请输入邮箱';
							return false;
						}
						this.getBindEmailOrMobileCode(this.account);
						break;
					case 'loginCode':
						this.getLoginCode();
						break;
					case 'registerCode':
						this.registerCode(this.account, '');
						break;
					case 'resetloginPasswordCode':
					this.resetPasswordCode(this.account, '');
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
			account:{
				immediate: true,
				handler: function(newV) {
					if(newV && this.codeType == 'emailCode' && this.start){
						this.getCode()
					}
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	.countdown {
		width:200upx;
		text-align: right;
	}
	.get-code,
	.time {
		line-height: 80upx;
		height: 80upx;
	}

	.time {
		color: #666;
		font-size: 28upx;
	}

	.get-code {
		font-size: 28upx;
	}
</style>
