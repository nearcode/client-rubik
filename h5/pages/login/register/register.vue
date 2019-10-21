<template>
	<!-- 注册页面 -->
	<view class="register page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="open" v-if="showMarks">
			<img class="wechat-guide" src="/static/image/wechat_guide.png" alt="" srcset="">
			<p>请点击右上角...按钮，选择[在浏览器打开]，登录交易所app即可领取分享</p>
		</view>
		<view class="layouts">


			<view class="titles flex flex-direction">
				<text style="margin-bottom:0" class="head-title text-xxl font-col text-bold">{{regType}}注册</text>
				<view class="flex justify-start align-center text-red text-sm margin-top">
					<text class="icon iconfont icon-emiguanyuwomen "></text>
					<text class="margin-left-xs">国家或地区注册后不能修改</text>
				</view>

			</view>
			<form class="">
				<view class="area" @tap="selectArea">
					<text class="font-col text-bold text-xl">{{area}}</text>
					<text class="icon-triangledownfill"></text>
				</view>
				<view class="phone flex justify-between align-center" v-if="regType=='手机'">
					<view class="text-xl">
						<text class="font-col text-bold">{{'+'+phoneCode}}</text>
						<text class="icon-triangledownfill"></text>
					</view>
					<view class="phones width100 flex justify-between align-center text-xl">
						<input class="font-col" data-id="mobile" type="text" placeholder="手机号码" v-model="mobile" placeholder-class="inputplaceholder"
						 @input="clearInput" />
						<view data-id="mobile" class="icon-roundclosefill" v-if="showClearIcon.mobile" @click="clearIcon"></view>
					</view>
				</view>

				<view class="phone flex justify-between align-center" v-else>
					<view class="phones width100 flex justify-between align-center text-xl">
						<input class="font-col" data-id="email" type="text" placeholder="邮箱" v-model="email" placeholder-class="inputplaceholder"
						 @input="clearInput" />
						<view data-id="email" class="icon-roundclosefill" v-if="showClearIcon.email" @click="clearIcon"></view>
					</view>
				</view>

				<view class="submit">
					<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="submit">下一步</button>
				</view>

				<view class="margin-top">
					<text class="text-blue text-df" @tap="reg(regType)">{{regType=='手机'?'邮箱':'手机'}}注册</text>
				</view>

				<view class="login margin-top text-lg flex justify-start align-center">
					<text class="text-bold">已有账号？</text>
					<text class="action text-bold margin-left-xs" @tap="login">登录</text>
				</view>
			</form>
		</view>
		<show-msg v-if="errormsg" :errormsg="errormsg" :errortype="errortype" @hideMsg="hideMsg" id="msgUniPopup"></show-msg>
	</view>
</template>

<script>
	import base from '@/api/base.js';
	import common from '@/common';
	import area from '@/js/area/area.js';
	import config from '@/config';

	export default {
		data() {
			return {
				area: '中国',
				phoneCode: '86',
				mobile: '',
				mobileError: '',
				emailError: '',
				email: '',
				code: '',
				referrerId: '',
				disabledValue: false, //这个需固定不能为true就行
				showClearIcon: {
					'mobile': false,
					'email': false,
				},
				regType: '手机',
				type: '', //当值为'bottom'时显示验证码框
				regphone: /^1[3456789]\d{9}$/, //手机号码正则
				regemail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //邮箱正则
				codeTime: 0, //倒计时开始始为0
				apiError: '', //接口错误
				errortype: '',
				showMarks: false,
				schemaUrl: '',
			}
		},
		computed: {
			account: function() {
				return this.mobile ? this.mobile : this.email
			},
			disabled: function() {
				return (this.mobile || this.email) ? (this.disabledValue ? true : false) : true
			},
			errormsg: function() {
				if (this.mobile && this.mobileError) {
					return this.mobileError
				} else if (this.email && this.emailError) {
					return this.emailError
				} else {
					return '';
				}
			}
		},
		onLoad(option) {
			this.referrerId = option.referrerId == undefined ? '' : option.referrerId;
			console.log(this.referrerId)
			// if (this.referrerId) {
			// 	this.schemaUrl = config.schemaUrl + 'type=invitation&referrerId=' + this.referrerId
			// 	console.log('schemaUrl', this.schemaUrl)
			// }

		},
		onShow() {
			if (uni.getStorageSync('selectArea')) {
				let selectArea = this.$tools.util.toJson(uni.getStorageSync('selectArea'));
				this.area = selectArea.zn;
				this.phoneCode = selectArea.code;
			}

			if (this.$common.is_Show_Jump()) {
				this.showMarks = true;
			} else {
				this.showMarks = false;
			}
		},
		onReady() {
			// var that = this;
			// if (!this.$common.is_Show_Jump() && this.referrerId) {
			// 	var openApp = that.openApp;
			// 	var a = document.createElement('a'); // 创建a标签
			// 	a.setAttribute('href', this.schemaUrl); // href链接
			// 	a.onclick = that.openApp();
			// 	a.click(); // 自执行点击事件
			// }
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
			// openApp() {
			// 	var clickedAt = +new Date;
			// 	setTimeout(function() {
			// 		!(window.document.webkitHidden || document.hidden) && setTimeout(function() {
			// 			if (+new Date - clickedAt < 2000) {
			// 				uni.redirectTo({
			// 					url: '/pages/user/shareApp/shareApp'
			// 				})
			// 			}
			// 		}, 500);
			// 	}, 500)
			// },
			selectArea() {
				uni.navigateTo({
					url: './selectArea'
				})
			},
			reg(regType) {
				this.resetData();
				this.regType = regType == '手机' ? '邮箱' : '手机';

			},
			login() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			resetData() {
				this.email = '';
				this.mobile = '';
				this.mobileError = '';
				this.emailError = '';
				this.errortype = '';
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
			async submit() {
				if (!(this.email || this.mobile)) return false;
				if (this.errormsg) { //如果报错
					this.errortype = 'top';
					return false;
				} else {
					uni.navigateTo({
						url: './setPw?account=' + this.account + '&area=' + this.area + '&regType=' + this.regType + '&referrerId=' +
							this.referrerId
					})
				}

			},
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
		watch: {
			mobile: function(val) {
				if (!this.regphone.test(val)) {
					this.mobileError = '手机格式不正确'
				} else {
					this.mobileError = ''
				}
			},
			email: function(val) {
				if (this.email && !this.regemail.test(val)) {
					this.emailError = '邮箱格式不正确'
				} else {
					this.emailError = '';
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.open {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background: #000;
		opacity: 0.5;

		p {
			width: 461upx;
			height: 27upx;
			font-size: 26upx;
			font-family: 'PingFang-SC-Bold';
			font-weight: bold;
			color: rgba(255, 255, 255, 1);

			position: absolute;
			top: 353upx;
			left: 107upx;
		}

		.wechat-guide {

			position: absolute;
			width: 161upx;
			height: 239upx;
			top: 98upx;
			right: 73upx;
		}
	}

	.register {
		.layouts{
			padding-left: 5%;
			padding-right: 5%;
		}
		.icon-roundclosefill,
		.icon-attentionforbidfill {
			color: #c6cfd6;
		}

		.titles {
			margin-bottom: 140upx;

			.singIn {
				color: #25435b;
			}
		}

		form {
			.icon-triangledownfill {
				color: #c6cfd6;
			}

			.phone {
				margin-top: 50upx;
				border-bottom: 1px solid #0073d0;
				padding-bottom: 20upx;
			}

			input {
				width: 100%;
				padding-left: 10upx;
			}
		}

		.submit {
			button {
				margin-top: 85upx;
				background-color: #0073d0;
				height: 93upx;
			}

			uni-button[disabled]:not([type]),
			uni-button[disabled][type=default] {
				background-color: #d0d9de !important;
			}
		}

		.login {
			margin-top: 360upx;
			color: #8da0ae;

			.action {
				color: #1b82d2;
			}
		}

		#codeUniPopup {
			.uni-popup-bottom {
				border-top-left-radius: 20upx !important;

				.code {
					.bar {
						border-bottom: 1px solid #f8f8f8;
					}

					.codeinput {
						border-bottom: 1px solid #0073d0;
						padding-bottom: 20upx;

						input {
							width: 80%;
							padding: 0upx !important;
							text-align: left;
						}
					}

					.submit {
						button {
							margin-top: 85upx;
							background-color: #0073d0;
							height: 93upx;
						}

						uni-button[disabled]:not([type]),
						uni-button[disabled][type=default] {
							background-color: #d0d9de !important;
						}
					}

				}
			}


		}

	}
</style>
