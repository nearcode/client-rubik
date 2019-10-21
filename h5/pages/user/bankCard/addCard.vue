<template>
	<view class="bankCard bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="bankCardWrap">
				<!-- <view class="addCardTitle text-xxl text-black">添加银行卡</view> -->
				<view class="head-title text-bold text-xxl">添加银行卡</view>

				<form class="wallet-form">
					<text class="label">姓名</text>
					<view class="group flex justify-between align-center">
						<view class="textSame font-col">{{truename}}</view>
					</view>

					<text class="label">银行卡号</text>
					<view class="group flex justify-between align-center">
						<input type="number" placeholder="请输入银行卡号" v-model="cardNo" />
					</view>

					<text class="label">开户银行</text>
					<view class="group flex justify-between align-center">
						<input v-if="readonly" style="color:#25435b" type="text" placeholder="请选择开户银行" v-model="bankName" disabled />
						<input v-if="!readonly" style="color:#25435b" type="text" placeholder="请手动输入开户银行" v-model="bankName" />
						<text class="lg text-gray icon-right" @tap="choseBank()"></text>
					</view>

					<text class="label">开户地址(选填)</text>
					<view class="group flex justify-between align-center">
						<input type="text" placeholder="请输入开户行地址" v-model="bankAddr" />
					</view>

					<view class="submit">
						<button class="cu-btn block bg-blue margin-tb-sm lg" :disabled="disabled" @tap="save">保存</button>
					</view>
				</form>
			</view>
		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	import base from '@/api/base';
	import common from '@/common';
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				cardNo: '',
				bankName: '',
				bankType: '',
				bankAddr: '',
				readonly: true, //卡类型设置未不能写入，当卡类型是未知银行的时候，要支持可以写入
				disabledValue: false,
				errortype: '',
				apiError: '',
				succmsg: '',
			}
		},
		components: {

		},
		computed: {
			...mapState(['truename']),
			disabled() {
				return (this.cardNo && this.bankName && this.bankType) ? (this.disabledValue ? true : false) : true
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
		onNavigationBarButtonTap(e) {
			uni.navigateBack({
				delta: 1,
			})
		},
		onLoad() {
			this.$store.commit('getInfo');
		},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			console.log(currPage.type)
			if (currPage.type == 'OTHER') {
				this.readonly = false;
				this.bankType = "OTHER";
				this.bankName = '';
			} else {
				this.readonly = true;
				this.bankName = currPage.name;
				this.bankType = currPage.type;
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
			async save() {
				this.apiError = ''; //重置
				this.succmsg = ''; //重置
				if (this.errormsg) { //如果报错
					this.errortype = 'top'
					return false;
				}
				this.disabledValue = true;
				try {
					await base.addBankcard({
						bankName: this.bankName, //银行名称
						bankType: this.bankType, //类型
						bankNumber: this.cardNo, //银行卡号
						branch: this.bankAddr, //分行地址
					})
					this.succmsg = '添加成功';
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1000)
					this.disabledValue = false;
				} catch (e) {
					this.disabledValue = false;
					if (!e) {
						this.apiError = this._consts.networkFail;
						return;
					}
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}

			},
			//选择银行
			choseBank() {
				uni.navigateTo({
					url: '/pages/user/bankCard/choseBank'
				});
			},
		},
	}
</script>

<style lang="less" scoped>
	.icon-right {
		display: block;
		width: 60upx;
		height: 60upx;
		// background-color:red;
		text-align: center;
		line-height: 60upx;
	}

	.clearfix:after {
		content: ".";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}

	.clearfix {
		zoom: 1;
	}

	.textSame {
		width: 100%;
		height: 60upx;
		line-height: 60upx;
		font-size: 32upx;
	}

	.bankCard {
		width: 100%;
		height: 100%;
		min-height: 100vh;

		.bankCardWrap {
			height: 100%;
			margin: 0 auto;

			.addCardTitle {
				width: 100%;
				height: 100upx;
				line-height: 100upx;
			}

		}

	}
</style>
