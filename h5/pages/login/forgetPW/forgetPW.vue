<template>
	<!-- 找回密码页面 -->
	<view class="password page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="titles flex flex-direction">
				<text style="margin-bottom:0" class="head-title text-xxl font-col text-bold">忘记密码</text>
				<view class="flex justify-start align-center text-red text-sm margin-top">
					<text class="icon iconfont icon-emiguanyuwomen "></text>
					<text class="margin-left-xs">找回密码后，24小时内无法提币</text>
				</view>

			</view>

			<form class="wallet-form">
				<view class="group flex justify-between align-center">
					<view class="width100 flex justify-between align-center">
						<input class="font-col" data-id="account" type="text" placeholder="邮箱或手机号码" v-model="account" placeholder-class="inputplaceholder"
						 @input="clearInput" />
						<view data-id="account" class="icon-roundclosefill" v-if="showClearIcon.account" @click="clearIcon"></view>
					</view>
				</view>
				<view class="submit">
					<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="submit">下一步</button>
				</view>
			</form>
		</view>
		<show-msg v-if="errormsg" :errormsg="errormsg" :errortype="errortype" @hideMsg="hideMsg" id="msgUniPopup"></show-msg>
	</view>
</template>

<script>
	import base from '@/api/base.js';
	import common from '@/common';

	export default {
		data() {
			return {
				account: '',
				accountError: '',
				disabledValue: false, //这个需固定不能为true就行
				showClearIcon: {
					'account': false,
				},
				regphone: /^1[3456789]\d{9}$/, //手机号码正则
				regemail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //邮箱正则
				reg: /^[0-9]+$/, //匹配纯数字
				errortype: '',
			}
		},
		computed: {
			disabled: function() {
				return (this.account) ? (this.disabledValue ? true : false) : true
			},
			errormsg: function() {
				if (this.accountError) {
					return this.accountError
				} else {
					return '';
				}
			}
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
			login() {
				uni.navigateTo({
					url: '/pages/login/login'
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
			submit() {
				if (!this.account) return false;
				if (this.errormsg) { //如果报错
					this.errortype = 'top';
					return false;
				}
				this.disabledValue = true;

				uni.navigateTo({
					url: './resetPw?account=' + this.account
				})
				this.disabledValue = false;
			},
			onNavigationBarButtonTap(e) {
				let index = e.index;
				if (index === 0) {
					uni.navigateBack({
						delta: 1,
					})
				} else {

				}
			},
		},
		watch: {
			account: function(val) {
				if (!val) return false;
				this.errortype = '';
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
