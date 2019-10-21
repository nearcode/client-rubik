<template>
	<!-- 手机号设置页面 -->
	<view class="bg-white page setMobile">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-xxl text-bold">{{mobile?"更改":"绑定"}}手机号</view>
			<view class="setContent">
				<form class="wallet-form">
					<text class="label">新手机号码</text>
					<view class="group">
						<input type="number" v-model="newmobile" maxlength="11" placeholder="请输入新手机号" placeholder-class="inputplaceholder" />
					</view>
					<text class="label">手机验证码</text>
					<view class="group flex justify-between align-center">
						<input type="number" v-model="code" maxlength="6" placeholder="请输入验证码" placeholder-class="inputplaceholder" />
						<count-down codeType="mobileCode" :account="newmobile" id="count2"></count-down>
					</view>
				</form>
				<view class="submit">
					<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="bindMobile">{{mobile?"更改":"绑定"}}</button>
				</view>
			</view>
		</view>
		<code-verify-new :type="type" :vAccount="vAccount" :buttonText="buttonText" @confirmTrue="toConfirm" @togglePopups="togglePopups"></code-verify-new>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	import base from '@/api/base.js';
	import countDown from '@/components/countdown/countdown.vue';
	import codeVerifyNew from '@/components/verify/codeVerifyNew.vue';
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				vAccount: '',
				type: '',
				newmobile: "",
				code: '',
				authCode: '',
				account: '',
				regphone: /^1[3456789]\d{9}$/, //手机号码正则
				disabledValue: false,
				buttonText: '提交',
				errortype: '',
				apiError: '',
				succmsg: '',
			}
		},
		components: {
			countDown,
			codeVerifyNew
		},
		computed: {
			...mapState(['mobile']),
			disabled() {
				return (this.newmobile && this.code) ? (this.disabledValue ? true : false) : true
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
		onShow() {

		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			togglePopups(type) { //监听取消按钮
				this.authCode = '';
				this.type = type;
			},
			toConfirm(authCode) {
				this.authCode = authCode;
				this.disabledValue = true;
				this.sure();
			},
			bindMobile() {
				if (!this.regphone.test(this.newmobile)) {
					this.apiError = "请输入正确的手机号";
					return
				}
				this.disabledValue = true;
				this.sure()
			},
			async sure() {
				this.apiError = ''; //重置
				this.succmsg = ''; //重置
				if (this.errormsg) { //如果报错
					this.errortype = 'top'
					return false;
				}
				try {
					await base.bindMobile(this.newmobile, this.code, this.authCode);
					this.type = ''; //关闭验证框
					this.succmsg = "手机绑定成功";
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/user/safetyCenter/safetyCenter',
						})
					}, 2000)
					this.disabledValue = false;
				} catch (e) {
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
	.clearfix:after {
		content: ".";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden
	}

	.setMobile {
		width: 100%;
		height: 93.3vh;
		overflow: hidden;

		.setContent {
			width: 94%;
			height: 100%;
			margin: 0 auto;
		}
	}
</style>
