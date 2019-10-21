<template>
	<view class="transactionDetail bg-white">
		<good-nav-bar show="true" bgcolor="#FFFFFF" borderbottom="`true`">
			<block slot="backIcon">
				<text class="icon iconfont icon-fanhui1 font-gray" @tap="back"></text>
			</block>
			<block slot="content">
				<text style="font-weight: bold;">C2C交易详情</text>
			</block>
		</good-nav-bar><!-- 自定义导航 -->
		<view class="detailWrap">
			<view class="buyMsg" v-if="type==1">
				<view class="detailTitle font-color text-bold text-lg">汇款单</view>
				<view class="detailMoney text-red text-lg">&yen;{{detail.price*detail.amount}}</view>

				<view class="detailMoney text-red text-lg" v-if="detail.result == 0">待处理</view>
				<view class="detailMoney text-green text-lg" v-if="detail.result == 1">成功</view>
				<view class="detailMoney text-gray text-lg" v-if="detail.result == 2">取消充值</view>
				<view class="detailMoney text-grey text-lg" v-if="detail.result == 3">已过期</view>
				<!-- <view class="detailMoney text-blue text-lg" v-if="detail.result == 4">处理中</view> -->
				<view class="detailMoney text-blue text-lg" v-if="detail.result == -1">待确认</view>

				<view class="detailSame">
					<text class="detailLeft text-df text-gray">收款方户名:</text>
					<view class="flex justify-end align-center">
						<text class="detailRight text-bold text-df font-color">{{detail.merchants.truename}}</text>
						<text class="icon iconfont icon-copy text-df font-color" :data-clipboard-text="detail.merchants.truename" @tap="copy(detail.merchants.truename)"></text>
					</view>

				</view>
				<view class="detailSame">
					<text class="detailLeft text-df text-gray">收款方开户行:</text>
					
					<text class="detailRight text-bold text-df font-color">{{detail.merchants.name+' '+ (detail.merchants.branch || '')}}</text>
				</view>
				<view class="detailSame">
					<text class="detailLeft text-df text-gray">收款方手机号码:</text>
					<text class="detailRight text-bold text-df font-color">{{detail.merchants.mobile}}</text>
				</view>
				<view class="detailSame">
					<text class="detailLeft text-df text-gray">收款方帐号:</text>
					<view class="flex justify-end align-center">
						<text class="detailRight text-bold text-df font-color">{{detail.merchants.number}}</text>
						<text class="icon iconfont icon-copy text-df font-color" :data-clipboard-text="detail.merchants.number" @tap="copy(detail.merchants.number)"></text>
					</view>
				</view>
				<view class="detailSame">
					<text class="detailLeft text-df text-gray">备注:</text>
					<text class=" markMsg text-bold text-df font-color" :class='getStrLength(detail.txid)>17?"msrkStyle":""'>{{detail.id}}</text>
				</view>

				<view class="detailSame">
					<text class="text-df text-red">特别提示：备注序号，必须用本人绑定的银行卡打款</text>
				</view>

			</view>

			<view class="sellMsg clearfix" v-if="type==-1">
				<view class="detailSame">
					<text class="detailLeft text-df text-gray">服务商户名:</text>
					<view class="flex justify-end align-center">
						<text class="detailRight text-bold text-df text-black">{{detail.merchants.truename}}</text>
						<text class="icon iconfont icon-copy text-df font-color" :data-clipboard-text="detail.merchants.truename" @tap="copy(detail.merchants.truename)"></text>
					</view>
				</view>
				<view class="detailSame">
					<text class="detailLeft text-df text-gray">服务商手机号:</text>
					<view class="flex justify-end align-center">
						<text class="detailRight text-bold text-df text-black">{{detail.merchants.mobile}}</text>
						<text class="icon iconfont icon-copy text-df font-color" :data-clipboard-text="detail.merchants.mobile" @tap="copy(detail.merchants.mobile)"></text>
					</view>
				</view>
				<view class="detailSame">
					<text class="detailLeft text-df text-gray">转帐金额:</text>
					<text class="detailRight text-bold text-df text-red">{{detail.price*detail.amount}}</text>
				</view>
				<view class="detailSame">
					<text class="detailLeft text-df text-gray">状态:</text>
					<!-- <text class="detailRight text-bold text-df text-black">待处理</text> -->
					<text class="detailRight text-red text-df" v-if="detail.result == 0">待处理</text>
					<text class="detailRight text-green text-df" v-if="detail.result == 1">成功</text>
					<text class="detailRight text-gray text-df" v-if="detail.result == 2">已取消</text>
					<text class="detailRight text-blue text-df" v-if="detail.result == 4">处理中</text>
					<text class="detailRight text-grey text-df" v-if="detail.result == 5">已过期</text>
					<text class="detailRight text-orange text-df" v-if="detail.result == -1">审核中</text>

				</view>
			</view>

			<view class="btnWrap">
				<!-- 已转账 -->
				<button v-if="detail.result == -1" :disabled="disabled" @click="confirm(detail._id)" class="btn back-green">
					<span>已转帐</span>
				</button>

				<!-- 取消订单 -->
				<button v-if="detail.result == -1" :disabled="disabled" @click="cancel(detail._id)" class="btn back-red">
					<span class="text-white">取消订单</span>
				</button>
			</view>

		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype"
		 @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue"
		 :errortype="errortype" @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	import c2c from '@/api/c2c.js';
	import Clipboard from "clipboard";
	export default {
		data() {
			return {
				detail: {},
				disabled: false,
				type: 0,
				str: "备注信息",
				apiError: '', //接口错误
				errortype: '',
				succmsg: '',
			}
		},
		computed: {
			errormsg: function() { //收集弹出
				if (this.apiErrorValue) {
					return this.apiErrorValue
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
			}
		},
		onLoad(option) {
			// console.log(option.type)
			this.type = option.type;
		},
		onShow() {
			this.detail = uni.getStorageSync("detail");
			// this.detail.result = -1
			// console.log(this.detail)
		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			copy(copyData) {
				//清空数据
				this.succmsg = '';
				this.apiError = '';
				var that = this
				if (copyData) {
					//#ifdef H5
					let clipboard = new Clipboard(".icon-copy");
					clipboard.on("success", e => {
						// 释放内存
						clipboard.destroy();
						that.succmsg = '复制成功';
					});
					clipboard.on("error", e => {
						// 不支持复制
						that.apiError = '该浏览器不支持自动复制';
						// 释放内存
						clipboard.destroy();
					});

					//#endif

					//#ifdef APP-PLUS
					uni.setClipboardData({
						data: copyData,
						success: () => {
							that.succmsg = '复制成功'
						},
						fail: () => {
							that.apiError = '复制失败'
						}
					});
					//#endif
				} else {
					//common.util.showToast('复制的内容不能为空')
					that.apiError = '复制的内容不能为空'
				}
			},
			back() {
				uni.navigateBack({
					delta: 1,
				})
			},
			getStrLength(str) {
				return str.length;
			},
			//取消订单
			async cancel(id) {
				//清空数据
				this.succmsg = '';
				this.apiError = '';
				let that = this;
				this.disabled = true;
				try {
					let res = await c2c.cancel(id);
					if (res.suc) {
						this.succmsg = "订单取消成功";
						that.detail.result = 2;
					}
				} catch (e) {
					this.disabled = false;
					if (!e) {
						this.apiError = this._consts.networkFail;
						return false;
					}
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
			//确认
			async confirm(id) {
				//清空数据
				this.succmsg = '';
				this.apiError = '';
				let that = this;
				this.disabled = true;
				try {
					let res = await c2c.buyConfirm(id);
					if (res.suc) {
						this.succmsg = "订单确认成功";
						that.detail.result = 0;
					}
				} catch (e) {
					this.disabled = false;
					if (!e) {
						this.apiError = this._consts.networkFail;
						return false;
					}
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			}
		}

	}
</script>

<style lang="less" scoped>
	.icon-copy {
		display: block;
		// background-color:red;
		width: 50upx;
		height: 50upx;
		line-height: 50upx;
		text-align: center;
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

	.transactionDetail {
		width: 100%;
		height: 100%;
		min-height: 100vh;

		.detailWrap {
			width: 96%;
			height: 100%;
			margin: 0 auto;

			.detailTitle {
				width: 100%;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
			}

			.detailMoney {
				width: 100%;
				height: 55upx;
				line-height: 55upx;
				text-align: center;
			}

			.detailSame {
				width: 100%;
				min-height: 60upx;
				height: auto;
				border-bottom: 1px solid #eee;
				line-height: 60upx;
				float: left;
				margin-top: 30upx;

				.detailLeft {
					width: 35%;
					height: 100%;
					display: block;
					overflow: hidden;
					float: left;
				}

				.detailRight {
					width: 65%;
					height: 100%;
					display: block;
					float: left;
					text-align: right;
					overflow: hidden;
				}

				.markMsg {
					width: 65%;
					display: block;
					float: left;
					height: auto;
					text-align: right;
				}

				.msrkStyle {
					line-height: 45upx;
					word-wrap: break-word;
				}
			}

			.btnWrap {
				width: 100%;
				height: auto;
				float: left;
				margin-top: 50upx;
			}

			.btn {
				margin-top: 30upx;
			}
		}
	}
</style>
