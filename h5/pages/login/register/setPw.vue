<template>
	<!-- 设置密码 -->
	<view class="password page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar>
		<view class="layouts">
			<view class="titles flex flex-direction">
				<text style="margin-bottom:0;margin-top:0" class="head-title text-xxl font-col text-bold">设置密码</text>
				<view class="errorposit flex justify-start align-center text-red text-sm margin-top">
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

				<view v-if="!readonlyHold && inviteCode" class="group flex justify-between align-center">
					<view class="width100 flex justify-between align-center">
						<input class="font-col" style="border-width:0;outline:none" data-id="referrerId" type="text" placeholder="邀请码(必填)"
						 v-model="referrerId" placeholder-class="inputplaceholder" @input="clearInput" />
						<view class="flex justify-end align-center">
							<view data-id="referrerId" class="icon-roundclosefill" v-if="showClearIcon.referrerId" @click="clearIcon"></view>
						</view>
					</view>
				</view>
				
				<view v-if="!readonlyHold && !inviteCode" class="group flex justify-between align-center">
					<view class="width100 flex justify-between align-center">
						<input class="font-col" style="border-width:0;outline:none" data-id="referrerId" type="text" placeholder="邀请码(选填)"
						 v-model="referrerId" placeholder-class="inputplaceholder" @input="clearInput" />
						<view class="flex justify-end align-center">
							<view data-id="referrerId" class="icon-roundclosefill" v-if="showClearIcon.referrerId" @click="clearIcon"></view>
						</view>
					</view>
				</view>
				
				<!-- 如果从微信等的邀请的页面过来 -->
				<view v-if="readonlyHold" class="group flex justify-between align-center">
					<view class="width100 flex justify-between align-center">
						<input :disabled="readonlyHold" class="font-col" style="color:#25435b;border-width:0;outline:none" type="text"
						 v-model="referrerId" placeholder-class="inputplaceholder" />
					</view>
				</view>


				<get-captcha v-if="password && repassword" :creatCaptcha="creatCaptcha" @captchaEvent="captchaEvent"></get-captcha>

				<view class="submit">
					<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="submit">注册</button>
				</view>
			</form>
		</view>

		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype"
		 @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue"
		 :errortype="errortype" @hideMsg="hideMsg"></show-msg>

		<code-verify-new :type="type" :vAccount="vAccount" :account="account" :dataCaptcha="{'auType':'captcha','captchaId':captchaId,'captcha':captcha}"
		 codeType="registerCode" :buttonText="buttonText" @confirmTrue="toConfirm" @togglePopups="togglePopups"></code-verify-new>

	</view>
</template>

<script>
	import base from '@/api/base.js';
	import common from '@/common';
	import codeVerifyNew from '@/components/verify/codeVerifyNew.vue';
	import getCaptcha from '@/components/verify/getCaptcha.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				vAccount: '',
				password: '',
				repassword: '',
				referrerId: '',
				disabledValue: false, //这个需固定不能为true就行
				disabledCodeValue: false,
				showClearIcon: {
					'password': false,
					'repassword': false,
					'referrerId': false
				},
				showEyesIcon: {
					'password': false,
					'repassword': false,
				},
				account: '',
				code: '',
				area: '',
				reg: /^[0-9]+$/, //匹配纯数字
				passwordError: '',
				repasswordError: '',
				apiError: '',
				type: '',
				errortype: '',
				regType: '',
				codeTime: 0,
				buttonText: '提交',

				sleepsTimer: null,
				timer: null,

				captchaId: '',
				captcha: '', //图像验证码
				captchaError: '', //图像验证码错误信息
				readonlyHold: false,
				succmsg: '',
				referrerIdError: '',
			}
		},
		computed: {
			...mapState(['inviteCode']),
			disabled: function() {
				if (this.password && this.repassword && this.captcha && !this.captchaError) {
					if (this.inviteCode) {
						if (!this.referrerId) {
							return true;
						}
					}
					return this.disabledValue ? true : false
				} else {
					return true;
				}

				//return (this.password && this.repassword && this.captcha && !this.captchaError) ? (this.disabledValue ? true : false) :true
			},
			passwordtype: function() {
				return this.showEyesIcon.password ? 'text' : 'password';
			},
			errormsg: function() {
				if (this.passwordError || this.repasswordError || this.captchaError || this.apiErrorValue || this.referrerIdError) {
					return this.passwordError + ' ' + this.repasswordError + ' ' + this.captchaError + ' ' + this.apiErrorValue + ' ' + this.referrerIdError;
				} else {
					if (this.password != this.repassword) {
						return '两次密码不一致'
					} else {
						return ''
					}
				}
			},
			apiErrorValue: function() { //即时弹出
				if (this.apiError) {
					this.errortype = 'top';
					return this.apiError;
				} else {
					return '';
				}
			},
			succmsgValue: function() { //即时弹出
				if (this.succmsg) {
					this.errortype = 'top';
					return this.succmsg;
				} else {
					return '';
				}
			},
			creatCaptcha: function() { //判断是否走图像验证接口
				if (this.account && this.password) {
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
		onLoad(options) {
			this.account = options.account
			this.area = options.area
			this.regType = options.regType
			this.referrerId = options.referrerId
			if (this.referrerId) {
				this.readonlyHold = true;
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
				//验证密码
				if (!(this.account && this.password && this.area)) return false;
				if (this.errormsg) { //如果报错
					this.errortype = 'top';
					return false;
				}
				this.disabledValue = true;
				try {
					let res = await base.signup(
						this.account,
						this.code,
						this.$common.trim(this.password),
						this.area,
						this.referrerId,
						this.captcha,
						'captcha',
						this.captchaId
					);
					this.succmsg = '注册成功';
					common.util.setToken(res.token);
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/loading/loading'
						})
					}, 1500)
					this.disabledValue = false;
				} catch (e) {
					this.disabledSingUp = false;
					if (!e) {
						this.apiError = this._consts.networkFail;
						return false;
					}
					if (e.error) {
						if (Object.keys(e.error).length == 0) {
							console.log('注册结果返回length=0')
						}
						if (e.error === {}) {
							this.apiError = this._consts.networkFail;
						} else {
							this.apiError = this.$t(e.error)
							if (e.error == '验证码不正确') {
								this.type = 'bottom' //验证码框显示
							}
						}
					}
					if (e.verify) { //验证类型
						this.vAccount = e.verify;
						this.type = 'bottom'
					}
					this.disabledValue = false;
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
		watch: {
			password: function(val) {
				if (val.length < 8) {
					this.passwordError = '密码长度不小于8位'
				} else {
					this.passwordError = ''
				}
			},
			repassword: function(val) {
				if (val.length < 8) {
					this.repasswordError = '重复密码长度不小于8位'
				} else {
					this.repasswordError = ''
				}
			},
			referrerId: function(val) {
				if (this.inviteCode) {
					if (!val) {
						this.referrerIdError = '验证码必填';
					} else {
						this.referrerIdError = '';
					}
				}
			},
		},
		components: {
			codeVerifyNew,
			getCaptcha
		}
	}
</script>

<style lang="less" scoped>
	.errorposit {
		height: 50upx;
	}

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
