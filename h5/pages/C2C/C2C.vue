<template>
	<view class="c2c page bg-white">
		<good-nav-bar show="true" bgcolor="#FFFFFF" borderbottom="`true`">
			<block slot="content">
				<text style="font-weight: bold;">C2C交易</text>
			</block>
			<block slot="rightText">
				<text class="text-sm font-color" @tap="toBankCard">银行卡</text>
			</block>
		</good-nav-bar><!-- 自定义导航 -->
		<view class="c2cWrap clearfix">
			<view class="moneyCNY text-lg text-gray margin-bottom-xs">{{$store.state.getBance(this.coin)+' '}}<text class="text-bold">CNY</text></view>
			<view class="c2cUp clearfix">
				<view class="c2cLeft">
					<view class="c2cLeftHead">
						<view class="head">
							<text class="leftHead text-lg text-white">买入C2C</text>
						</view>
					</view>
					<view class="leftContent">
						<view class="buyPrice">
							<input type="number" style="color:#E56D4A" class="priceInp" disabled="true" v-model="buyPrice" placeholder="价格"
							 placeholder-class="inpl-grey" />
							<text class="buyType text-gray">CNY</text>
						</view>
						<view class="buyPrice buyNum">
							<input type="number" style="color:#1F3F58" class="priceInp" v-model="buyNum" placeholder="数量" placeholder-class="inpl-grey" />
							<text class="buyType text-gray">C2C</text>
						</view>
						<view class="buyPrice">
							<view class="buyText text-df font-grey">需要<text class="needMoney text-red margin-left-xs margin-right-xs">{{$tools.util.toFixed(buyPrice*buyNum,5)}}</text>CNY</view>
						</view>
						<view class="buyPrice buyNum">
							<text :class="[disableBuy?'bts':'buy']" class="text-white text-lg" @tap="trade(1)" :disableBuy="disableBuy">立即买入</text>
						</view>
					</view>

				</view>
				<view class="c2cLeft c2cRight">
					<view class="c2cLeftHead">
						<view class="headRight">
							<text class="rightHead text-lg text-white">卖出C2C</text>
						</view>
					</view>

					<view class="leftContent rightContent">
						<view class="buyPrice">
							<input type="number" style="color:#03C086" class="priceInp" disabled="true" v-model="sellPrice" placeholder="价格"
							 placeholder-class="inpl-grey" />
							<text class="buyType text-gray">CNY</text>
						</view>
						<view class="buyPrice buyNum">
							<input type="number" style="color:#1F3F58" class="priceInp" v-model="sellNum" placeholder="数量" placeholder-class="inpl-grey" />
							<text class="buyType text-gray">C2C</text>
						</view>
						<view class="buyPrice">
							<view class="buyText text-df font-grey">获得<text style="color:#03C086" class="needMoney margin-left-xs margin-right-xs">{{$tools.util.toFixed(sellPrice*sellNum,5)}}</text>CNY</view>
						</view>
						<view class="buyPrice buyNum">
							<text :class="[disableSell?'bts':'sell']" class="text-lg" @tap="trade(-1)" :disableSell="disableSell">立即卖出</text>
						</view>
					</view>

				</view>
			</view>

		</view>

		<view class="tiao"></view>

		<view class="history">
			<view class="cu-bar">
				<view class="action">
					<text class="text-lg font-color">交易记录</text>
				</view>
				<view class="action">
					<text style="color:#1883D5;" class="text-lg" @tap="notice">买卖须知</text>
				</view>
			</view>
			<view v-if="historyList && Object.keys(historyList).length">
				<view v-for="(item,index) in historyList" :key="index" class="cu-item solid-top margin-bottom-sm" @tap="go(item,item.type)">
					<view class="content flex justify-between align-center padding-left padding-right">
						<view class="flex justify-start align-end">
							<text :class="item.type == 1?'greens':'reds'" class="text-df greens">{{item.type == 1?'买入':'卖出'}}C2C</text>
							<text class="text-sm margin-left-sm text-grey">{{item.create | formatTime('MM-dd hh:mm')}}</text>
						</view>
						<text class="text-df" :class="getStatus(item.type,item.result).color">{{getStatus(item.type,item.result).text}}</text>
					</view>

					<view class="detail flex justify-between align-center padding-left padding-right">
						<view class="flex flex-direction text-left">
							<text class="font-gray">数量（C2C）</text>
							<text class="font-color margin-top-xs">{{item.amount}}</text>
						</view>

						<view class="flex flex-direction text-left">
							<text class="font-gray">单价（¥）</text>
							<text class="font-color margin-top-xs">{{item.price}}</text>
						</view>

						<view class="flex flex-direction text-left">
							<text class="font-gray">合计（¥）</text>
							<text class="font-color margin-top-xs">{{item.price*item.amount ||0}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="TRContent nodatas flex flex-direction justify-center align-center">
				<text class="lg text-gray icon-form " style="color:#c6cfd6"></text>
				<view class="text-df text-center text-black" style="color:#c6cfd6">没有相关记录</view>
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
	import base from '@/api/base.js';
	export default {
		data() {
			return {
				coin: '',
				buyPrice: 0,
				buyNum: 1,
				sellPrice: 0,
				sellNum: 1,
				disable: false,
				historyList: {},
				disableBuy: false,
				disableSell: false,
				errortype: '',
				apiError: '',
				succmsg: '',
			}
		},
		computed: {
			errormsg: function() { //收集弹出
				if (this.apiErrorValue) {
					return this.apiErrorValue;
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
		onShow() {
			if (!this.$store.state.isLogin()) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			} else {
				this.getInfo();
				this.$store.commit('getBalances');
				this.history();
			}
		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			toBankCard() {
				uni.navigateTo({
					url: '/pages/user/bankCard/index'
				})
			},
			async history() {
				try {
					this.historyList = await c2c.history();
					// console.log(this.historyList)
				} catch (e) {

				}
			},
			go(item, type) {
				// console.log(type)
				uni.setStorageSync('detail', item)
				uni.navigateTo({
					url: '/pages/C2C/transactionDetail?type=' + type
				})
			},
			getStatus(type, num) {
				switch (num) {
					case 0:
						return {
							'color': 'text-red',
							'text': '待处理'
						};
					case 1:
						return {
							'color': 'text-green',
							'text': '成功'
						};
					case 2:
						return {
							'color': 'text-gray',
							'text': '取消充值'
						};
					case 3:
						return {
							'color': 'text-grey',
							'text': '已过期'
						};
					case -1:
						if (type == -1) {
							return {
								'color': 'text-orange',
								'text': '审核中'
							};
						} else {
							return {
								'color': 'text-blue',
								'text': '待确认'
							};
						}

					default:
						return {
							'color': 'text-blue',
							'text': '无此状态'
						};
				}
			},
			notice() {
				uni.navigateTo({
					url: "/pages/C2C/notice"
				})
			},
			async getInfo() {
				let localRes = uni.getStorageSync("c2c");
				// console.log(localRes)
				if (localRes) {
					this.buyPrice = localRes.buyPrice;
					this.sellPrice = localRes.sellPrice;
					this.coin = localRes.coin;
				}
				try {
					let res = await c2c.getInfo();
					console.log(res)
					this.buyPrice = res.buyPrice;
					this.sellPrice = res.sellPrice;
					this.coin = res.coin;
					uni.setStorageSync("c2c", res);
				} catch (e) {}
				// this.getBalance(this.coin);
				// console.log(this.$store.state.getBance(this.coin))
				// this.$store.state.getBance(this.coin)
			},
			async trade(type) {
				this.apiError = ''; //重置
				this.succmsg = ''; //重置
				if (this.errormsg) { //如果报错
					this.errortype = 'top'
					return false;
				}
				let amount, price;
				//type类型等于1为买入，-1为卖出
				if (type == 1) {
					amount = this.buyNum;
					this.disableBuy = true;
				} else {
					amount = this.sellNum;
					this.disableSell = true;
				}
				try {
					await c2c.buyAndSell({
						coin: this.coin,
						type,
						amount
					});
					// this.$tools.util.showToast("下单成功");
					this.succmsg = '下单成功';
					type == 1 ? this.buyNum = 0 : this.sellNum = 0;
					this.history();
					if (type == 1) {
						this.disableBuy = false;
					} else {
						this.disableSell = false;
					}
				} catch (e) {
					console.error(e)
					if (!e) {
						if (type == 1) {
							this.disableBuy = false;
						} else {
							this.disableSell = false;
						}
						this.apiError = this._consts.networkFail;
						return false;
					}
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
					// this.$tools.util.showToast(this.$t(e.error));
					if (type == 1) {
						this.disableBuy = false;
					} else {
						this.disableSell = false;
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.bts {
		border: 1px solid #C6CFD6;
		color: #C6CFD6;
	}

	.greens {
		color: #03C086;
	}

	.reds {
		color: #E56D4A;
	}

	.history {
		padding-bottom: 114.58upx;

		.content {
			height: 80.72upx;
		}
	}

	.tiao {
		height: 26.04upx;
		background-color: #F7F6FB;
		width: 100%;
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

	.c2c {
		width: 100%;

		// min-height: 100vh;
		// height: 100%;
		.c2cWrap {
			width: 94%;
			height: 100%;
			// border: 1px solid red;
			margin: 0 auto;

			.moneyCNY {
				line-height: 50upx;
				text-align: right;
			}

			.c2cUp {
				width: 100%;
				height: auto;
			}

			.c2cLeft {
				width: 50%;
				float: left;

				.c2cLeftHead {
					width: 100%;
					position: relative;
					line-height: 70upx;
					text-align: center;

					.head {
						width: 100%;
						height: 70upx;
						background-color: #E56D4A;
						border-top-left-radius: 3px;
						border-bottom-left-radius: 3px;
						line-height: 70upx;

						&::after {
							content: "";
							position: absolute;
							right: -10%;
							top: 0;
							background: #fff;
							width: 22%;
							height: 105%;
							-ms-transform: skew(-27deg, 0deg);
							transform: skew(-27deg, 0deg);
							-moz-transform: skew(-27deg, 0deg);
							-webkit-transform: skew(-45deg, 0deg);
						}
					}
				}

				.headRight {
					width: 100%;
					height: 70upx;
					background-color: #03C086;
					border-top-right-radius: 3px;
					border-bottom-right-radius: 3px;
					line-height: 70upx;

					&::after {
						content: "";
						position: absolute;
						left: -10%;
						top: 0;
						background: #fff;
						width: 22%;
						height: 105%;
						-ms-transform: skew(-27deg, 0deg);
						transform: skew(-27deg, 0deg);
						-moz-transform: skew(-27deg, 0deg);
						-webkit-transform: skew(-45deg, 0deg);
					}
				}

				.leftContent {
					width: 97%;
					height: 360upx;
					margin-top: 40upx;

					.buyPrice {
						width: 100%;
						height: 70upx;
						position: relative;

						.priceInp {
							width: 100%;
							height: 70upx;
							border: 1px solid #C6CFD6;
							border-radius: 8upx;
							text-indent: 6upx;
							padding-left: 20.31upx;
							padding-right: 20.31upx;
						}

						.buyType {
							width: 70upx;
							height: 70upx;
							line-height: 70upx;
							position: absolute;
							top: 0;
							right: 0;
						}

						.buyText {
							width: 100%;
							line-height: 60upx;
							overflow: hidden;
							display: flex;

							.needMoney {
								width: auto;
								max-width: 66%;
								display: block;
								overflow: hidden;
							}
						}

						.buy,
						.sell,
						.bts {
							width: 90%;
							height: 70upx;
							line-height: 70upx;
							text-align: center;
							display: block;
							// background: #03C086;

							border-radius: 8upx;
							margin: 0 auto;
						}

						.buy {
							color: #E56D4A;
							border: 1px solid #E56D4A;
						}

						.sell {
							// background: #E7EBEE;
							color: #03C086;
							border: 1px solid #03C086;
						}

					}

					.buyNum {
						margin-top: 30upx;
					}

				}

				.rightContent {
					margin-left: 3%;
				}
			}

		}
	}
</style>
