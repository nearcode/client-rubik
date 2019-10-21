<template>
	<!-- 登录页 -->
	<view class="login page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">


			<view style="padding-top:0" class="layouts" ref="abc">
				<view class="logo">
					<view class="images margin-top">
						<image :src="logo" mode="widthFix"></image>
					</view>
					<!-- <text>登录交易所</text> -->
				</view>

				<view class="errorposit flex justify-start align-center text-red text-sm margin-bottom">
					<text v-show="captchaError" class="icon iconfont icon-emiguanyuwomen "></text>
					<text v-show="captchaError" class="margin-left-xs">{{captchaError}}</text>
				</view>

				<form class="wallet-form">
					<view class="group flex justify-between align-center">
						<input type="text" data-id="account" placeholder="邮箱或手机号" v-model="account" placeholder-class="inputplaceholder"
						 @input="clearInput" />
						<view data-id="account" class="icon-roundclosefill" v-if="showClearIcon.account" @click="clearIcon"></view>
					</view>
					<view class="group margin-top-xl flex justify-between align-center">

						<input v-if="showEyesIcon.password" style="border-width:0;outline:none" type="text" data-id="password"
						 placeholder="密码" v-model="password" placeholder-class="inputplaceholder" @input="clearInput" />

						<input v-if="!showEyesIcon.password" style="border-width:0;outline:none" type="password" data-id="password"
						 placeholder="密码" v-model="password" placeholder-class="inputplaceholder" @input="clearInput" />

						<view class="flex justify-end align-center">
							<view data-id="password" :class="[showEyesIcon.password?'text-blue icon-attentionfill':'icon-attentionforbidfill']"
							 class="margin-right-xs" v-if="showClearIcon.password" @click="eyesIcon"></view>
							<view data-id="password" class="icon-roundclosefill" v-if="showClearIcon.password" @click="clearIcon"></view>
						</view>
					</view>

					<get-captcha v-if="account && password" :creatCaptcha="creatCaptcha" @captchaEvent="captchaEvent"></get-captcha>

					<view class="submit">
						<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="submit">登录</button>
					</view>

					<view class="margin-top">
						<text class="text-blue text-df" @tap="forgetPW">忘记密码</text>
					</view>

					<view class="singIn margin-top text-lg flex justify-start align-center">
						<text class="text-bold">还没有账号？</text>
						<text class="action text-bold margin-left-xs" @tap="register">注册</text>
					</view>
				</form>
			</view>
		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>

		<code-verify-new :vAccount="vAccount" :type="type" :account="account" :dataCaptcha="{'auType':'captcha','captchaId':captchaId,'captcha':captcha}"
		 codeType="loginCode" :buttonText="buttonText" @confirmTrue="toConfirm" @togglePopups="togglePopups"></code-verify-new>

	</view>
</template>

<script>
	import base from '@/api/base.js';
	import common from '@/common';
	import codeVerifyNew from '@/components/verify/codeVerifyNew.vue';
	import {
		mapState
	} from 'vuex';
	import getCaptcha from '@/components/verify/getCaptcha.vue';

	export default {
		data() {
			return {
				vAccount: '',
				account: '',
				password: '',
				code: '',
				showClearIcon: {
					'account': false,
					'password': false,
				},
				showEyesIcon: {
					'password': false,
				},
				disabledCodeValue: false,
				regphone: /^1[3456789]\d{9}$/, //手机号码正则
				regemail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //邮箱正则
				accountError: '',
				passwordError: '',
				codeError: '',
				apiError: '', //接口错误
				errortype: '',
				type: '',
				reg: /^[0-9]+$/, //匹配纯数字
				codeTime: 0, //倒计时开始始为0
				timer: null,

				buttonText: '提交',

				captchaId: '',
				captcha: '', //图像验证码
				captchaError: '', //图像验证码错误信息
				succmsg: '',
			}
		},
		components: {
			codeVerifyNew,
			getCaptcha,
		},
		computed: {
			...mapState(['logo']),
			disabled: function() {
				return (this.account && this.password && this.captcha && !this.captchaError) ? (this.disabledValue ? true : false) :
					true
			},
			disabledCode: function() {
				return (this.code) ? (this.disabledCodeValue ? true : false) : true
			},
			errormsg: function() {
				if (this.accountError || this.passwordError || this.apiErrorValue) {
					return this.accountError + ' ' + this.passwordError + ' ' + this.apiErrorValue;
				} else {
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
				if (this.account && this.password) {
					return true
				} else {
					return false
				}
			}
		},
		onLoad() {
			this.$store.commit('getInfo');
		},
		onShow() {
		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			back() {
				uni.switchTab({
					url: "/pages/index/index"
				})
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
				this.login();
			},
			forgetPW() {
				uni.navigateTo({
					url: '/pages/login/forgetPW/forgetPW'
				})
			},
			register() {
				uni.navigateTo({
					url: '/pages/login/register/register'
				})
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
			submit() {
				this.login();
			},
			async login() {
				this.apiError = ''; //重置
				this.succmsg = ''; //重置
				if (this.errormsg) { //如果报错
					this.errortype = 'top'
					return false;
				}
				this.disabledValue = true;
				try {
					let res = await base.login(
						this.$common.trim(this.account),
						this.code,
						this.$common.trim(this.password),
						365,
						this.captcha,
						'captcha',
						this.captchaId
					);
					this.succmsg = '登入成功';
					common.util.setToken(res.token);
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/loading/loading'
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
						this.apiError = this.$t(e.error);
					}
					if (e.verify) { //验证类型
						this.vAccount = e.verify;
						this.type = 'bottom'
					}
					if (e.token) common.util.setToken(e.token); //更新token
				}
			}
		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			if (index === 0) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			} else {

			}
		},
		onBackPress() {
			uni.switchTab({
				url: "/pages/index/index"
			})
		},
		watch: {
			account: function(val) {
				if (!val) return false;
				if (this.reg.test(val)) { //如果是纯数字，验证手机
					if (!this.regphone.test(val)) {
						this.accountError = '手机格式不正确'
					} else {
						this.accountError = ''
					}
				} else {
					if (!this.regemail.test(val)) {
						this.accountError = '邮箱格式不正确'
					} else {
						this.accountError = ''
					}
				}
			},
			password: function(val) {
				if (val.length < 8) {
					this.passwordError = '密码长度不小于8位'
				} else {
					this.passwordError = ''
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.errorposit {
		height: 50upx;
	}

	.login {
		.cancel {
			color: #888;
		}

		.layouts {

			// 			padding-top: 10%;
			// 
			.logo {
				margin-bottom: 80upx;

				text {
					color: #c6cfd6;
				}

				.images {
					width: 280upx;
					height: 85upx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.singIn {
				margin-top: 360upx;
				color: #8da0ae;

				.action {
					color: #1b82d2;
				}
			}
		}

	}
</style>
