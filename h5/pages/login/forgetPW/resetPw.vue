<template>
	<!-- 设置密码 -->
	<view class="password page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="titles flex flex-direction">
				<text style="margin-bottom:0" class="head-title text-xxl font-col text-bold">重新设置密码</text>
				<view class="flex justify-start align-center text-red text-sm margin-top">
					<text class="icon iconfont icon-emiguanyuwomen " v-show="showPassWordError || captchaError"></text>
					<text class="margin-left-xs" v-show="showPassWordError">密码长度不少于8位</text>
					<text v-show="captchaError" class="margin-left-xs">{{captchaError}}</text>
				</view>
			</view>
			<form class="wallet-form">
				<view class="group flex justify-between align-center">
					<view class="width100 flex justify-between align-center">
						<input v-if="showEyesIcon.password" class="font-col" style="border-width:0;outline:none" data-id="password" type="text"
						 placeholder="请输入密码" v-model="password" placeholder-class="inputplaceholder" @input="clearInput" />

						<input v-if="!showEyesIcon.password" class="font-col" style="border-width:0;outline:none" data-id="password" type="password"
						 placeholder="请输入密码" v-model="password" placeholder-class="inputplaceholder" @input="clearInput" />

						<view class="flex justify-end align-center">
							<view data-id="password" :class="[showEyesIcon.password?'text-blue icon-attentionfill':'icon-attentionforbidfill']"
							 class="margin-right-xs" v-if="showClearIcon.password" @click="eyesIcon"></view>
							<view data-id="password" class="icon-roundclosefill" v-if="showClearIcon.password" @click="clearIcon"></view>
						</view>
					</view>
				</view>

				<view class="group flex justify-between align-center">
					<view class="width100 flex justify-between align-center">
						<input v-if="showEyesIcon.repassword" class="font-col" style="border-width:0;outline:none" data-id="repassword"
						 type="text" placeholder="请再次输入密码" v-model="repassword" placeholder-class="inputplaceholder" @input="clearInput" />
						<input v-if="!showEyesIcon.repassword" class="font-col" style="border-width:0;outline:none" data-id="repassword"
						 type="password" placeholder="请再次输入密码" v-model="repassword" placeholder-class="inputplaceholder" @input="clearInput" />

						<view class="flex justify-end align-center">
							<view data-id="repassword" :class="[showEyesIcon.repassword?'text-blue icon-attentionfill':'icon-attentionforbidfill']"
							 class="margin-right-xs" v-if="showClearIcon.repassword" @click="eyesIcon"></view>
							<view data-id="repassword" class="icon-roundclosefill" v-if="showClearIcon.repassword" @click="clearIcon"></view>
						</view>
					</view>
				</view>

				<get-captcha v-if="repassword && password" :creatCaptcha="creatCaptcha" @captchaEvent="captchaEvent"></get-captcha>

				<view class="submit">
					<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="submit">重置</button>
				</view>

			</form>
		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>

		<code-verify-new :type="type" :vAccount="vAccount" :account="account" :dataCaptcha="{'auType':'captcha','captchaId':captchaId,'captcha':captcha}"
		 codeType="resetloginPasswordCode" :buttonText="buttonText" @confirmTrue="toConfirm" @togglePopups="togglePopups"
		 @getCaptchaAgain="getCaptchaAgain"></code-verify-new>
	</view>
</template>

<script>
	import base from '@/api/base.js';
	import common from '@/common';
	import codeVerifyNew from '@/components/verify/codeVerifyNew.vue';
	import getCaptcha from '@/components/verify/getCaptcha.vue';

	export default {
		data() {
			return {
				vAccount: '',
				code: '',
				codeError: '',
				password: '',
				repassword: '',
				passwordError: '',
				repasswordError: '',
				apiError: '',
				disabledValue: false, //这个需固定不能为true就行
				disabledCodeValue: false,
				showClearIcon: {
					'password': false,
					'repassword': false,
				},
				showEyesIcon: {
					'password': false,
					'repassword': false,
				},
				account: '',
				regType: '',
				type: '', //当值为'bottom'时显示验证码框
				codeTime: 0, //倒计时开始始为0
				errortype: '',
				buttonText: '提交',
				timer: null,
				captchaId: '',
				captcha: '', //图像验证码
				captchaError: '', //图像验证码错误信息
				succmsg: '',
			}
		},
		computed: {
			disabled: function() {
				return (this.password && this.repassword && this.captcha && !this.captchaError) ? (this.disabledValue ? true :
					false) : true
			},
			passwordtype: function() {
				return this.showEyesIcon.password ? 'text' : 'password';
			},
			disabledCode: function() {
				return (this.code) ? (this.disabledCodeValue ? true : false) : true
			},
			errormsg: function() {
				if (this.passwordError || this.repasswordError || this.apiErrorValue) {
					return this.passwordError + ' ' + this.repasswordError + ' ' + this.apiErrorValue;
				}else{
					return '';
				}
			},
			apiErrorValue:function(){//即时弹出
				if(this.apiError){
					this.errortype = 'top';
					return this.apiError;
				}else{
					return '';
				}
			},
			succmsgValue:function(){//即时弹出
				if(this.succmsg){
					this.errortype = 'top';
					return this.succmsg;
				}else{
					return '';
				}
			},
			creatCaptcha: function() { //判断是否走图像验证接口
				if (this.account && this.password && this.repassword) {
					return true
				} else {
					return false
				}
			},
			showPassWordError() {
				if (this.password.length >= 8 && this.repassword.length >= 8) {
					return false;
				} else {
					return true;
				}
			}
		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			captchaEvent(data) { //获取验证码
				this.captchaError = data.captchaError;
				this.captcha = data.captcha;
				this.captchaId = data.captchaId;
				if (data.captchaType == false) { //重新获取验证码
					this.type = '';
				}
			},
			togglePopups(type) { //监听取消按钮
				this.code = '';
				this.type = type;
			},
			toConfirm(authCode) {
				this.code = authCode;
				this.submit();
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			resetData() {

			},
			clearInput: function(event) {
				let id = event.target.dataset.id;
				if (event.target.value.length > 0) {
					this.showClearIcon[`${id}`] = true;
				} else {
					this.showClearIcon[`${id}`] = false;
				}
			},
			clearIcon: function(event) {
				let id = event.target.dataset.id;
				this[`${id}`] = '';
				this.showClearIcon[`${id}`] = false;
			},
			eyesIcon: function(event) {
				let id = event.target.dataset.id;
				this.showEyesIcon[`${id}`] = this.showEyesIcon[`${id}`] ? false : true;
			},
			async submit() {
				this.apiError = '';
				this.succmsg = '';
				if (!(this.account && this.password)) return false;
				if (this.errormsg) { //如果报错
					this.errortype = 'top';
					return false;
				}
				this.disabledValue = true;
				try {
					let res = await base.resetPassword(
						this.account,
						this.code,
						this.$common.trim(this.password),
						'captcha',
						this.captchaId,
						this.captcha
					);

					this.succmsg = '重置成功';

					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login',
						})
					}, 1500)

					this.disabledValue = false;
				} catch (e) {
					this.disabledValue = false;
					if (!e) {
						this.apiError = this._consts.networkFail;
						return false;
					}
					if (e.error) {
						if (Object.keys(e.error).length == 0) {
							console.log('结果返回length=0')
						}
						if (e.error === {}) {
							console.log('网络故障')
							this.apiError = this._consts.networkFail;
						} else {
							if (e.error == '验证码不正确') {
								this.type = 'bottom'; //验证码框显示
							}
							this.apiError = this.$t(e.error)
						}
					}
					if (e.verify) { //验证类型
						this.vAccount = e.verify;
						this.type = 'bottom'
					}
					// if(e.token) localStorage.token = this.$store.state.token = e.token;//更新token
				}
			},
			onNavigationBarButtonTap(e) {
				let index = e.index;
				if (index === 0) {
					uni.navigateBack({
						delta: 1,
					})
				} else {

				}
			}
		},
		onLoad(options) {
			this.account = options.account

		},
		watch: {
			password: function(val) {
				if (val.length < 8) {
					this.passwordError = '密码长度不少于8位'
				} else {
					this.passwordError = ''
				}
			},
			repassword: function(val) {
				if (val.length < 8) {
					this.repasswordError = '密码长度不少于8位'
				} else {
					this.repasswordError = ''
				}
			}
		},
		components: {
			codeVerifyNew,
			getCaptcha
		}
	}
</script>

<style lang="less" scoped>
	.password {
		.layouts {
			padding-left: 5%;
			padding-right: 5%;
			.titles {
				margin-bottom: 140upx;
				.singIn {
					color: #25435b;
				}
			}
		}
	}
</style>
