<template>
	<view class="wallet page">
		<nav-bar show="false" barColor="#1883d5"></nav-bar><!-- 自定义导航 -->
		<view class="top flex flex-direction justify-start align-start shadow-blur bg-color">
			<text class="font-ts text-xs margin-top-sm">总资产帐户折合（CNY）{{closeEyesValue}}</text>
			<view class="banlance" v-if="closeEyesValue == false ">
				<text class="text-lg text-white margin-right-xs">≈ {{$common.toCNYs(balanceDatas) | toFixed(8)}}</text>
			</view>

			<view class="banlance" v-else>
				<text class="font-ts text-sm margin-left-xs">≈***</text>
			</view>
			<view class="eyes text-df" @tap="closeEyes">
				<text class="icon iconfont icon-ai44 font-ts"></text>
			</view>

			<view class="bts flex justify-between align-center margin-top-lg margin-bottom text-sm">
				<navigator class="text-center" url="/pages/wallet/selectCoin?jumpUrl=addCoin">充币</navigator>
				<navigator class="text-center" url="/pages/wallet/selectCoin?jumpUrl=withdraw">提币</navigator>
				<navigator class="text-center" url="/pages/wallet/selectCoin?jumpUrl=transfer">转账</navigator>
			</view>
		</view>
		<view class="searcharea bg-white text-df">
			<view class="search bg-white flex justify-between align-center">
				<view class="flex justify-start align-center text-df">
					<text style="color:#a0a0a0" class="icon-search margin-left-xs margin-right-xs"></text>
					<input class="text-df" type="text" v-model="searchCoin" placeholder="搜索币种资产" placeholder-class="inpl-gray" />
				</view>

				<view class="flex justify-end align-center text-df">
					<text class="hide margin-right-xs padding-left-sm" style="color:#a0a0a0">隐藏小于&yen;1</text>
					<view class="checkboxSt">
						<checkbox style="transform: scale(0.8)" :class="[checked?'checked':'']" @tap="hide"></checkbox>
					</view>
				</view>

			</view>
		</view>

		<view class="history flex flex-direction margin-top-xs padding-bottom-xxl">
			<view class="group padding-left padding-right flex flex-direction justify-start" @tap="go(item.coin)" v-for="(item,index) in balancesValue"
			 :key="index" v-if="item.coin">
				<view class="flex justify-between align-center margin-bottom-xs margin-top">
					<text class="coin text-df text-bold">{{item.coin}}</text>
					<text class="icon iconfont icon-gengduo"></text>
				</view>
				<view v-if="closeEyesValue== false " class="flex justify-between align-center">
					<view class="flex flex-direction justify-start flex-sub">
						<text class="ky margin-bottom-xs">可用</text>
						<text class="amount">{{item.available | autoFixed}}</text>
					</view>
					<view class="flex flex-direction justify-start flex-sub">
						<text class="ky margin-bottom-xs">冻结</text>
						<text class="amount">{{item.freeze}}</text>
					</view>
					<view class="flex flex-direction justify-start flex-sub text-right">
						<text class="ky margin-bottom-xs">折合（CNY）</text>
						<text class="amount">{{item.coin | toCNY(item.available)}}</text>
					</view>
				</view>

				<view v-else class="flex justify-between align-center">
					<view class="flex flex-direction justify-start">
						<text class="ky margin-bottom-xs">可用</text>
						<text class="amount">***</text>
					</view>
					<view class="flex flex-direction justify-start">
						<text class="ky margin-bottom-xs">冻结</text>
						<text class="amount">***</text>
					</view>
					<view class="flex flex-direction justify-start">
						<text class="ky margin-bottom-xs">折合（CNY）</text>
						<text class="amount">***</text>
					</view>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	import exchange from '@/api/exchange.js';
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				checked: uni.getStorageSync('checked') || '',
				searchCoin: '',
			}
		},
		components: {},
		//计算
		computed: {
			...mapState(['balances', 'closeEyesValue']),
			balanceDatas() {
				let data = {};
				for (let i in this.balances) {
					data[i] = this.$common.autoFixed(this.balances[i].available);
				}
				return data;
			},
			balancesValue() {
				return this.dealBalance(this.searchCoin, this.checked);
			},
		},
		onLoad() {

		},
		onShow() {
			if (!this.$store.state.isLogin()) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			} else {
				this.$store.commit('getBalances');
			}
			this.checked = uni.getStorageSync('checked') || '';
		},
		methods: {
			dealBalance(searchCoin, checked) {
				let balances = this.balances;
				//1过滤搜索
				if (searchCoin) {
					balances = this.filterSearchCoin(searchCoin);
				}
				//2隐藏小于1
				if (checked) {
					balances = this.filterLittleAmount(balances, checked);
				}
				return balances;
			},
			filterSearchCoin(searchCoin) { //过滤搜索
				let blCoins = Object.keys(this.balances);
				let newBalances = {};
				for (let item of blCoins) {
					if (item.indexOf(searchCoin.toUpperCase().trim()) != -1) {
						newBalances[item] = this.balances[item]
					}
				}
				return newBalances
			},
			filterLittleAmount(balances, checked) {//隐藏小于1
				let newBalances = {};
				for (let i in balances) {
					if (this.$common.toCNY(balances[i]['coin'], balances[i]['available']) >= 1) {
						newBalances[i] = balances[i]
					}
				}
				return newBalances
			},
			hide() {
				this.checked = uni.getStorageSync('checked') ? '' : 'checked';
				uni.setStorageSync('checked', this.checked);
			},
			closeEyes() {
				let closeEyesValue = this.closeEyesValue ? false : true;
				this.$store.commit('closeEyes', closeEyesValue);
			},
			go: function(coin) {
				uni.navigateTo({
					url: '/pages/wallet/moneyHistory/index?coin=' + coin
				})
			}
		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			if (index === 0) {
				this.closeEyes()
			}
		},

	}
</script>

<style lang="less" scoped>
	// .uni-input-placeholder{
	// 	color:#a0a0a0;
	// }
	uni-checkbox .uni-checkbox-input {
		border: 0.52upx solid #CCCCCC !important;
	}
	
	page{
		// width:100vw;
		// overflow-x: hidden;
	}

	.wallet {
		background-color: #FFFFFF;

		.font-ts {
			color: #c8e4fa;
		}

		.main-col {
			color: #999999;
		}

		.top {
			padding-left: 3%;
			padding-right: 3%;
			position: relative;
			overflow:hidden;
			.banlance {
				margin-top: 25upx;
			}

			.eyes {
				position: absolute;
				right: 0upx;
				top: 0upx;
				display: block;
				width: 80upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				// background:red;
				//text-align: center;
			}

			.bts {
				width: 100%;
				navigator {
					background-color: #0f7ccf;
					border: 1px solid #3492da;
					// font-size: 24upx;
					color: #f4f7fa;
					width: 187.5upx;
					height: 52.08upx;
					line-height: 52.08upx;
					display: block;

				}
			}
		}

		.searcharea {
			padding-left: 25upx;
			padding-right: 25upx;
			padding-top: 20upx;
			padding-bottom: 20upx;
			.search {
				border: 0.52upx solid #e9e9e9;
				border-radius: 6.77upx;
				height: 90.1upx;
				line-height: 90.1upx;

				.hide {
					border-left: 1px solid #e0e0e0;
					line-height: 35upx;
				}

				.checkboxSt {
					width: 90upx;
					height: 90upx;
					line-height: 90upx;
					text-align: center;
				}

			}
		}

		.history {
			padding-bottom: 78.12upx;
			.group {
				border-top: 1px solid #f3f3f3;
				height: 156.25upx;
				text {
					// font-size: 24upx;
					color: #999999;
				}

				.coin {
					color: rgba(24, 131, 213, 1);
				}

				.amount {
					color: #333333;
					font-size: 21.87upx;
				}

				.ky {
					font-size: 18.75upx;
				}

				.icon-gengduo {
					color: #9a9a9a;
				}
			}
		}
	}
</style>
