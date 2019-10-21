<template>
	<view class="bindEmail bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-xxl text-bold text-black">{{email?"更改邮箱":"绑定邮箱"}}</view>
			<view class="content">
				<form class="wallet-form">
					<text class="label">邮箱</text>
					<view class="group">
						<input type="text" v-model="newemail" class="emailInp" placeholder="输入邮箱地址" placeholder-class="inputplaceholder" />
					</view>
				</form>
			</view>

			<view class="submit">
				<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="bindEmail">下一步</button>
			</view>
		</view>
		<show-msg v-if="errormsg" :errormsg="errormsg" :errortype="errortype" @hideMsg="hideMsg" id="msgUniPopup"></show-msg>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				newemail: '',
				regemail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //邮箱正则
				disabledValue: false,
				apiError: '', //接口错误
				errortype: '',
			}
		},
		computed: {
			...mapState(['email']),
			disabled() {
				return (this.newemail) ? (this.disabledValue ? true : false) : true
			},
			errormsg: function() {
				if (this.apiError) {
					this.errortype = 'top';
					return this.apiError;
				} else {
					return '';
				}
			},
		},
		onShow() {},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			bindEmail() {
				this.apiError = '';
				this.disabledValue = true;
				if (!this.regemail.test(this.newemail)) {
					this.apiError = "请输入正确的邮箱";
				} else {
					uni.navigateTo({
						url: '/pages/user/safetyCenter/setEmail/getEmailCode?email=' + this.newemail
					})
					this.disabledValue = false;
				}

			},
		},
		watch: {
			newemail() {
				this.disabledValue = false;
			}
		}
	}
</script>

<style lang="less" scoped>
	.bindEmail {
		height: 100vh;
		position: relative;

		.content {
			width: 94%;
			height: auto;
			margin: 0 auto;
		}

		.submit {
			width: 94%;
			position: absolute;
			left: 3%;
			bottom: 31.25upx;
		}
	}
</style>
