<template>
	<!-- 身份认证 -->
	<view v-show="showPage" class="userca page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">


			<view class="userContent" v-if="status == 0">
				<form class="wallet-form">
					<view class="head-title ex-text text-xxl">
						<text class='text-bold font-col'>身份认证</text>
					</view>

					<view class="area flex flex-direction justify-start align-start">
						<view class="title font-col">国家或地区</view>
						<view class="margin-top-sm margin-top-xl">
							<text class="text-bold">中国</text>
						</view>
					</view>

					<text class="label">姓名</text>
					<view class="group flex justify-between align-center">
						<input class="" data-id="truename" maxlength="-1" v-model="truename" placeholder="请输入您的姓名" type="text"
						 placeholder-class="inputplaceholder" @input="clearInput" />
						<view data-id="truename" class="icon-roundclosefill" v-if="showClearIcon.truename" @click="clearIcon"></view>
					</view>

					<text class="label">身份证号</text>
					<view class="group flex justify-between align-center">
						<input class="" data-id="idcard" v-model="idcard" placeholder="请输入身份证号" type="text" placeholder-class="inputplaceholder" @input="clearInput" />
						<view data-id="idcard" class="icon-roundclosefill" v-if="showClearIcon.idcard" @click="clearIcon"></view>
					</view>

					<text class="label">手机号</text>
					<view class="group flex justify-between align-center">
						<text v-if="phone" class="mobileclass font-col">{{mobile}}</text>
						<input v-else v-model="mobile" placeholder="请输入手机号" type="text" placeholder-class="styleInp inputplaceholder"
						 @blur="onBlur" />
					</view>

					<text class="label">验证码</text>
					<view class="group flex justify-between align-center">
						<input class="mobileCode" data-id="code" maxlength="-1" v-model="code" placeholder="请输入验证码" type="number"
						 placeholder-class="inputplaceholder" @input="clearInput" />
						<view data-id="code" class="icon-roundclosefill" v-if="showClearIcon.code" @click="clearIcon"></view>
						<!-- <view class="getCode text-df bg-blue"  @tap="getCode()">{{this.codetime}}</view> -->
						<count-down :account="phone?'':mobile" id="count2"></count-down>
					</view>

					<view class="submit">
						<button class="cu-btn block bg-blue margin-tb-sm lg" :disabled="disabled" @tap="submit">下一步</button>
					</view>

				</form>
			</view>

			<view v-if="status ==3" class="statusOne">
				<view class="wrapimage padding-top-xl text-center">
					<image src="/static/image/paycard/success.png" mode=""></image>
				</view>

				<!-- <view class="positionView">
				<view class="statusMsg text-bold text-xl text-black text-center">恭喜您审核通过</view>
				<view class="statusMsg1 text-gray text-ms text-center">已完成身份认证审核，快去区块行情市场投资吧</view>
				<button type="primary" class="backBut" @tap="back" style="background: #1883D5;">完成</button>
			</view> -->

				<view class="positionView">
					<view style="color:#00CA8B" class="statusMsg text-bold text-xl text-black text-center">恭喜</view>
					<view class="statusMsg1 text-gray text-ms text-center">您的身份认证已完成</view>
					<button type="primary" class="backBut" @tap="back" style="background: #1883D5;">完成</button>
				</view>

			</view>
			<view v-if="status==1" class="statusTwo">
				<view class="wrapimage padding-top-xl text-center">
					<image src="/static/image/paycard/status.png" mode=""></image>
				</view>
				<view class="positionView">
					<view class="statusMsg text-bold text-xl text-black text-center">提交中，请等待管理员审核</view>
					<view class="statusMsg1 text-gray text-ms text-center">预订一个工作日内审核完成，审核结果会短信通知到您的注册手机上</view>
					<button type="primary" class="backBut" @tap="back" style="background: #1883D5;">完成</button>
				</view>
			</view>
			<view v-if="status==2" class="statusThree">
				<view class="wrapimage padding-top-xl text-center">
					<image src="/static/image/paycard/fail.png" mode=""></image>
				</view>
				<view class="positionView">
					<view class="statusMsg text-bold text-xl text-black text-center">抱歉您审核未通过</view>
					<view class="statusMsg1 text-gray text-ms text-center">身份证验证未通过，请您24小时之后再试</view>
					<button type="warn" class="backBut" @tap="newUserCa" style="background: #1883D5;">重新认证</button>
				</view>
			</view>
		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype"
		 @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue"
		 :errortype="errortype" @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	// import navBar from '@/components/nav/nav.vue';
	import base from '@/api/base';
	import countDown from '@/components/countdown/countdown.vue';
	import consts from '@/config/const.js';

	export default {
		data() {
			return {
				status: '',
				area: '',
				disabledValue: false, //这个需固定不能为true就行
				truename: '',
				idcard: '',
				code: '',
				mobile: this.$store.state.mobile,
				isMob: true,
				phone: this.$store.state.mobile,
				type: '',
				cardType: '1', //1是身份证，2表示护照
				flag: false,
				isGet: true,
				regphone: /^1[3456789]\d{9}$/, //手机号码正则
				codetime: "获取验证码",
				showClearIcon: {
					'truename': false,
					'idcard': false,
					'code': false,
					'mobile': false
				},
				showPage: false,
				errortype: '',
				apiError: '',
				succmsg: '',
				mobileError: '',
			}
		},
		components: {
			countDown,
		},
		computed: {
			disabled: function() {
				return (this.truename && this.idcard && this.mobile && this.code && this.isMob) ? (this.disabledValue ? true :
					false) : true
			},
			errormsg: function() {
				if (this.mobileError || this.apiErrorValue) {
					return this.mobileError + ' ' + this.apiErrorValue;
				} else {
					return '';
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
		},
		onLoad() {
			// this.$store.commit("authLevel")
		},
		onShow() {
			this.mobile = this.phone;
			this.flag = this.mobile != "" ? true : false;
			this.type = this.mobile != "" ? 'text' : 'number';
			this.getstatus();
		},
		methods: {
			newUserCa() {
				this.status = 0;
			},
			hideMsg(type) {
				this.errortype = type;
			},
			onBlur(e) {
				this.mobileError = '';
				if (!this.regphone.test(this.mobile)) {
					this.isMob = false;
					this.mobileError = '请输入正确的手机号';
				} else {
					this.mobileError = '';
					this.isMob = true;
				}
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			async submit() {
				this.apiError = ''; //重置
				this.succmsg = ''; //重置
				if (this.errormsg) { //如果报错
					this.errortype = 'top'
					return false;
				}
				this.disabledValue = true;
				try {
					let res = await base.addVerified(this.truename, this.idcard, this.mobile, this.code, this.cardType, 1);
					// console.log(res)
					this.succmsg = '认证成功';
					this.$store.commit('getInfo');
					this.getstatus();
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
				}
			},
			async getstatus() {
				uni.showLoading({
					title: '加载中...'
				})
				//let result = await base.getCertificateStatus(consts.authLevel.primary);
				let result = await base.getCertificate(consts.authLevel.primary);
				this.status = result.data.result;
				//this.status = 3
				this.showPage = true; //显示页面
				uni.hideLoading()
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
		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			if (index === 0) {
				uni.navigateBack({
					delta: 1,
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.userca {
		width: 100%;

		.userContent {
			width: 94%;
			margin: 0 auto;
		}

		form {

			.area {
				margin-top: 60upx;
				margin-bottom: 30upx;
			}

			.submit {
				margin-top: 120upx;
			}
		}

		.mobileclass {
			font-size: 32upx;
		}

		.statusOne,
		.statusTwo,
		.statusThree {
			border-top: 1.04upx solid rgba(228, 237, 242, 1);

			.wrapimage {
				image {
					width: 403upx;
					height: 414upx;
				}
			}
		}

		.positionView {
			width: 94%;
			height: 400upx;
			// border: 1px solid red;
			position: absolute;
			bottom: 10upx;
			left: 3%;

			.statusMsg {
				height: 80upx;
				// line-height: 80upx;
			}

			.statusMsg1 {
				height: 80upx;
				line-height: 80upx;
			}

			.backBut {
				margin-top: 100upx;
			}
		}
	}
</style>
