<template>
	<view class="setEmail page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-xxl text-bold text-black">谷歌验证码</view>
			<view class="content">
				<form class="wallet-form">
					<text class="label">密钥</text>
					<view class="group">
						<input type="text" v-model="newemail" class="emailInp" placeholder="请输入新邮箱" placeholder-class="inputplaceholder" />
					</view>
					<text class="label">谷歌验证码</text>
					<view class="group flex justify-between align-center">
						<input type="number" maxlength="6" v-model="code" class="emailCodeInp" placeholder="请输入验证码" placeholder-class="inputplaceholder" />
						<count-down codeType="emailCode" :account="newemail" id="count2"></count-down>
					</view>
				</form>

				<view class="submit">
					<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="bindGoogle">开启谷歌验证</button>
				</view>
			</view>
		</view>
		<code-verify-new :type="type" :vAccount="vAccount" :buttonText="buttonText" @confirmTrue="toConfirm" @togglePopups="togglePopups"></code-verify-new>
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
				newemail: '',
				code: '',
				codeTime: 0,
				authCode: '',
				regemail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //邮箱正则
				account: '', //验证方式
				buttonText: '提交',
				disabledValue: false,
			}
		},
		components: {
			countDown,
			codeVerifyNew
		},
		computed: {
			...mapState(['email']),
			disabled() {
				return (this.newemail && this.code) ? (this.disabledValue ? true : false) : true
			},
		},
		onShow() {},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			togglePopups(type) { //监听取消按钮
				this.authCode = '';
				this.type = type;
			},
			togglePopup(type) {
				this.type = type
			},
			toConfirm(authCode) {
				this.authCode = authCode;
				this.disabledValue = true;
				this.sure();
			},
			bindGoogle() {
				if (!this.regemail.test(this.newemail)) {
					uni.showToast({
						title: "请输入正确的邮箱",
						icon: 'none'
					})
					return
				}
				this.disabledValue = true;
				this.sure()
			},
			async sure() {
				try {
					await base.setEmail(this.newemail, this.code, this.authCode);
					console.log('成功')
					this.type = ''; //关闭验证框
					uni.showToast({
						title: "邮箱绑定成功",
						icon: "none"
					})
					// this.$store.commit('getInfo');
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						})
					}, 1500)
					this.disabledValue = false;
				} catch (e) {
					console.log('失败')
					this.disabledValue = false;
					if (!e) return;
					if (e.error) {
						this.type = '';
						uni.showToast({
							title: this.$t(e.error),
							icon: 'none',
							duration: 1000 //持续的时间
						});
					}

					if (e.verify) { //验证类型
						this.type = 'bottom';
						this.vAccount = e.verify;
					}
				}

			},
		},
	}
</script>

<style lang="less" scoped>
	.setEmail {
		width: 100%;
		height: auto;

		.content {
			width: 94%;
			height: auto;
			margin: 0 auto;
		}

	}
</style>
