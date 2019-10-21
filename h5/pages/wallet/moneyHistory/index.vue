<template>
	<!-- 币明细 -->
	<view class="coinDetail page bg-white">

		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">


			<view class="text-xxl text-blue text-bold coinDetailText">{{currentCoin.coin}}</view>
			<view class="coinDetailHead">
				<view class="oneMid">
					<text class="midLeft text-gray">可用</text>
					<text class="midMid text-gray">冻结</text>
					<text class="midRight text-gray">折合(CNY)</text>
				</view>
				<view class="oneMid oneFoot">
					<text class="midLeft text-df font-color text-bold">{{currentCoin.available}}</text>
					<text class="midMid text-df font-color text-bold">{{currentCoin.freeze}}</text>
					<text class="midRight text-df font-color text-bold">{{$common.toCNY(currentCoin.coin,currentCoin.available)}}</text>
				</view>
			</view>
			<view class="bg-gray" style="height:25upx;width: 100%;"></view>
			<view class="coinDetailContent">
				<view class="text-xxl font-color coinRecord margin-top-sm">财务记录</view>
				<view class="coinDetailList" v-if="history && history.length">
					<view class="coinDetailOne" v-for="(item,index) in history" @tap="goOnce(item._id,item.type)" :key="index">
						<view class="oneHead text-bold text-lg font-color">{{$common.getMode(item.method,item.type)}}</view>
						<view class="oneMid">
							<text class="midLeft text-gray">数量</text>
							<text class="midMid text-gray">状态</text>
							<text class="midRight text-gray">时间</text>
						</view>
						<view class="oneMid oneFoot font-color text-df">
							<text class="midLeft">{{item.amount}}</text>
							<text class="midMid">{{item.result == 1?"已完成":"未完成"}}</text>
							<text class="midRight">
								{{item.create | formatTime('hh:mm MM/dd ')}}
							</text>
						</view>
					</view>

					<view class="uni-loadmore text-center padding-top padding-bottom" v-if="showLoadMore">
						<text class="">{{loadMoreText}}</text>
					</view>
				</view>

				<view v-else class="nodatas flex flex-direction justify-center align-center">
					<text class="lg text-gray icon-form " style="color:#c6cfd6"></text>
					<view class="text-df text-center text-black" style="color:#c6cfd6">没有相关记录</view>
				</view>

			</view>
			<view class="coinDetailFoot bg-white">
				<view class="footIcon" :class="coins[coin]['deposit'] ?'action':'' " @tap=" coins[coin]['deposit'] && slectStyle(0)">
					<view class="flex flex-direction justify-center align-center">
						<text class="iconStyle icon iconfont icon-3"></text>
						<text class="iconMsg text-sm">充值</text>
					</view>
				</view>
				<!-- <view class="footIcon" :class='(currentIcon==1?"action":"")' @tap="slectStyle(1)"> -->
				<view class="footIcon" :class=" coins[coin]['withdraw'] ?'action':'' " @tap=" coins[coin]['withdraw'] && slectStyle(1)">
					<view class="flex flex-direction justify-center align-center">
						<text class="iconStyle icon iconfont icon-tixian"></text>
						<text class="iconMsg text-sm">提现</text>
					</view>
				</view>
				<!-- <view class="footIcon" :class='(currentIcon==2?"action":"")' @tap="slectStyle(2)">
				<navigator url="../transfer">
					<text class="iconStyle icon iconfont icon-querenzhangdan"></text>
					<text class="iconMsg text-sm">转帐</text>
				</navigator>
			</view> -->
				<view class="footIcon action" @tap="slectStyle(3)">
					<view class="flex flex-direction justify-center align-center">
						<text class="iconStyle icon iconfont icon-3"></text>
						<text class="iconMsg text-sm">交易</text>
					</view>
				</view>
			</view>
		</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerSingleArray"></mpvue-picker>
	</view>
</template>


<script>
	import base from "@/api/base.js";
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';

	import {
		mapState
	} from 'vuex';


	export default {
		data() {
			return {
				currentIcon: 0,
				coin: '',
				currentCoin: '',
				history: '',
				type: '',
				count: 0, //总页数
				pagesize: 0,
				limit: 8,
				p: 1,
				loadMoreText: "加载中...",
				showLoadMore: false,
				//单列开始
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [],
				themeColor: '#007AFF',
				//单列结束
			}
		},
		components: {
			mpvuePicker
		},
		computed: {
			...mapState(['coins', 'markets']),
			pickerSingleArray() { //去重提取baseCoin
				let markets = [];
				let marketsObj = [];
				let data = this.markets;
				for (let item of data) {
					if (markets.indexOf(item.base) == -1 && item.coin == this.coin) {
						markets.push(item.base);
						let obj = {
							label: item.base
						}
						marketsObj.push(obj)
					}
				}
				return marketsObj;
			},
		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			if (index === 0) {
				uni.navigateBack({
					delta: 1,
				})
			}
		},
		onLoad(option) {
			console.log(option.coin)
			this.coin = option.coin;
			console.log(this.getCoin(option.coin))
			this.currentCoin = this.getCoin(option.coin);
		},
		async onShow() {
			if (this.p == 1) {
				this.history = uni.getStorageSync(`${this.coin}_moneyHistory`) || [];
				this.history = await this.getHistory();
				uni.setStorageSync(`${this.coin}_moneyHistory`, this.history); //缓存第一页数据
			}
			console.log(this.history)
		},
		onReachBottom() {
			if (this.pagesize > this.count) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.more();
			}, 300);
		},
		methods: {
			// 单列开始
			onCancel(e) {
				console.log(e)
			},
			onConfirm(e) {
				uni.setStorageSync("currentMarket", this.coin + '_' + e.label);
				uni.switchTab({
					url: '/pages/exchange/exchange'
				})
			},
			showSinglePicker() {
				this.mode = 'selector';
				this.deepLength = 1;
				this.pickerValueDefault = [0];
				this.$refs.mpvuePicker.show();
			},
			// 单列结束
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			async more() {
				this.p++;
				this.pagesize += this.limit;
				let history = await this.getHistory();
				console.log('history', history)
				this.history = this.history.concat(history);
				if (history.length < this.limit) {
					this.loadMoreText = "没有更多数据了!"
				}
			},
			async getHistory() {
				var data = [];
				try {
					let res = await base.moneyHistory(
						this.coin,
						this.type,
						this.limit,
						this.p
					)
					this.count = res.count
					if (res.data) {
						data = res.data
					}
					return data;
				} catch (e) {
					return data;
				}
			},
			slectStyle: function(args) {
				this.currentIcon = args;
				switch (args) {
					case 0:
						if (this.coin == 'C2C') {
							uni.switchTab({
								url: "/pages/C2C/C2C"
							})
							return false;
						}
						uni.navigateTo({
							url: "/pages/wallet/addCoin?selectcoin=" + this.coin
						})
						break;
					case 1:
						if (this.coin == 'C2C') {
							uni.switchTab({
								url: "/pages/C2C/C2C"
							})
							return false;
						}
						uni.navigateTo({
							url: "/pages/wallet/withdraw?selectcoin=" + this.coin
						})
						break;
					case 3:
						//选择市场
						if (this.pickerSingleArray.length == 0) {
							this.$tools.util.showToast('暂无交易市场')
							return;
						};
						this.showSinglePicker();
						break;
					default:
						break;
				}
			},
			goOnce: function(id, type) {
				uni.navigateTo({
					url: '/pages/wallet/moneyHistory/detail?id=' + id + '&coin=' + this.coin + '&type=' + type
				});
			},
			getCoin: function(coins) {
				console.log(this.$store.state.balances)
				for (let Coin in this.$store.state.balances) {
					return this.$store.state.balances[coins]
				}

			}

		}
	}
</script>

<style lang="less" scoped>
	.coinDetail {

		.coinDetailText {
			margin: 0 auto;
			height: 80upx;
		}

		.coinDetailHead {
			height: 140upx;
			margin: 0 auto;

			.oneMid {
				width: 100%;
				height: 60upx;
				line-height: 60upx;
				display: flex;

				.midLeft {
					width: 225upx;
					display: block;
					overflow: hidden;
				}

				.midMid {
					width: 225upx;
					display: block;
					text-align: left;
					overflow: hidden;
				}

				.midRight {
					width: 225upx;
					display: block;
					text-align: right;
					overflow: hidden;
				}
			}

			.oneFoot {
				height: 80upx;
				line-height: 70upx;
			}

		}

		.coinDetailContent {
			height: 100%;
			margin: 0 auto;
			padding-bottom: 166upx;

			.coinRecord {
				height: 90upx;
				line-height: 90upx;
			}

			.coinDetailList {
				width: 100%;
				height: auto;

				.coinDetailOne {
					width: 100%;
					height: 230upx;
					border-bottom: 1px solid #eee;

					.oneHead {
						width: 100%;
						height: 90upx;
						line-height: 90upx;
					}

					.oneMid {
						width: 100%;
						height: 60upx;
						line-height: 60upx;
						display: flex;

						.midLeft {
							width: 280upx;
							display: block;
							overflow: hidden;
						}

						.midMid {
							width: 160upx;
							display: block;
							text-align: left;
							overflow: hidden;
						}

						.midRight {
							width: 235upx;
							display: block;
							text-align: right;
							overflow: hidden;
						}

						.empty {
							display: block;
							width: 30upx;
						}
					}

					.oneFoot {
						height: 80upx;
						line-height: 70upx;

						.empty1 {
							display: block;
							width: 30upx;
							margin-right: -10upx;
							text-align: right;
							transform: rotate(90deg);
							-ms-transform: rotate(90deg);
							-moz-transform: rotate(90deg);
							-webkit-transform: rotate(90deg);
							-o-transform: rotate(90deg);
						}
					}
				}
			}
		}

		.coinDetailFoot {
			width: 100%;
			height: 160upx;
			// border: 1px solid red;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.footIcon {
				width: 120upx;
				height: 120upx;
				// margin: 10upx 0 0 54upx;
				border: 1px solid #eee;
				color: #e1dfdf;

				.iconStyle {
					display: block;
					width: 120upx;
					height: 76upx;
					font-size: 55upx;
					line-height: 76upx;
					text-align: center;
				}

				.iconMsg {
					width: 100%;
					height: 40upx;
					display: block;
					text-align: center;
					line-height: 40upx;
				}
			}

			.action {
				border: 1px solid #1883D5;
				color: #1883D5;
				border-radius: 5.2upx;
			}
		}
	}
</style>
