<template>
	<view class="getEmailCode bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-xxl text-bold text-black">邮箱验证码</view>
			<view class="content">
				<form class="wallet-form">
					<view class="margin-bottom-xl">
						<text class="font-gray text-df">若未收到邮件，请检查邮箱垃圾箱</text>
					</view>
					<wakary-input class="margin-bottom" type="bottom" :maxlength="maxlength" @finish="finish"></wakary-input>
					<count-down :start="start" codeType="emailCode" :account="newemail" id="count2"></count-down>
				</form>
			</view>

			<view class="submit">
				<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="bindEmail">完成</button>
			</view>
		</view>
		<code-verify-new :type="type" :vAccount="vAccount" :buttonText="buttonText" @confirmTrue="toConfirm" @togglePopups="togglePopups"></code-verify-new>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	import base from '@/api/base.js';
	import wakaryInput from "@/components/verify/wakary-input.vue";
	import countDown from '@/components/countdown/countdown.vue';
	import codeVerifyNew from '@/components/verify/codeVerifyNew.vue';
	export default {
		data() {
			return {
				newemail: '',
				disabledValue: false,
				codeAry: [],
				maxlength: 5,
				code: '',
				start: true,

				vAccount: '',
				type: '',
				authCode: '',
				buttonText: '提交',
				apiError: '', //接口错误
				errortype: '',
				succmsg: '',
			}
		},
		components: {
			countDown,
			wakaryInput,
			codeVerifyNew
		},
		computed: {
			disabled() {
				return (this.newemail && this.code) ? (this.disabledValue ? true : false) : true
			},
			errormsg: function() {
				if (this.apiErrorValue) {
					return this.apiErrorValue;
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
		},
		onLoad(options) {
			this.newemail = options.email;
			console.log('dd' + this.newemail)
		},
		onShow() {

		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			togglePopups(type) { //监听取消按钮
				this.authCode = '';
				this.type = type;
			},
			toConfirm(authCode) {
				this.authCode = authCode;
				this.disabledValue = true;
				this.bindEmail();
			},
			finish(code) {
				console.log(code)
				this.code = code;
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			inputCode() {
				showCodeDialog: true;
			},
			async bindEmail() {
				this.apiError = ''; //重置
				this.succmsg = ''; //重置
				if (this.errormsg) { //如果报错
					this.errortype = 'top'
					return false;
				}
				try {
					await base.setEmail(this.newemail, this.code, this.authCode);
					console.log('成功')
					this.type = ''; //关闭验证框
					this.succmsg = '邮箱绑定成功';
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/user/safetyCenter/safetyCenter',
						})
					}, 2000)
					this.disabledValue = false;
				} catch (e) {
					console.log('失败')
					this.disabledValue = false;
					if (!e) {
						this.apiError = this._consts.networkFail;
						return;
					}
					if (e.error) {
						this.type = '';
						this.apiError = this.$t(e.error);
					}

					if (e.verify) { //验证类型
						this.type = 'bottom';
						this.vAccount = e.verify;
					}
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.getEmailCode {
		height: 100vh;

		.content {
			width: 94%;
			height: auto;
			margin: 0 auto;
		}

		.submit {
			position: absolute;
			width: 94%;
			left: 3%;
			bottom: 31.25upx;
		}
	}
</style>
