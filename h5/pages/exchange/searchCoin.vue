<template>
	<view class="searchCoin bg-white">
		<nav-bar show="false"></nav-bar><!-- 自定义导航 -->
		<!-- 交易市场 -->
		<scroll-view scroll-x class="text-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item text-bold" :class="activeName==item?'cur text-blue':'text-gray'" :data-id="item.index"
			 :data-name="item" @tap="tabTimeNav" v-for="(item,index) in getMarkets" :key="item.index">{{item}}</view>

			<view class="cu-item text-bold" :class="activeName=='optional'?'cur text-blue':'text-gray'" @tap="tabTimeNav"
			 :data-name="'optional'">{{'自选'}}</view>
		</scroll-view>
		<!-- 搜索币种 -->
		<view class="searchWrap flex justify-start align-center">
			<text class="searchIcon icon iconfont icon-unie036 font-gray text-sm margin-left margin-right-xs"></text>
			<input class="searchInp text-df" type="text" placeholder="搜索币种" placeholder-class="inpl-grey" v-model="search"
			 selection-start="10" confirm-type="search" @confirm="searchCoinType" />
		</view>
		<scroll-view scroll-y class="tickers_list">
		<view class="grid col-2 tickers_item padding-sm" v-if="orderTickers.length>0" @click="tabMarket(item.market)" :class="item.market==activeMarket?'active':''"
		 v-for="(item,index) of orderTickers" :key="index">
			<view class="text-sm"><text class="text-bold font-color">{{item.market |getCoin}} </text><text class="text-xs font-gray">/{{item.market|getBaseCoin}}</text></view>
			<view class="text-sm text-right" :class="item.change>=0?'text-green':' text-red'">{{item.last}}</view>
		</view>
		<view v-if="orderTickers.length<=0" class="padding text-center text-gray">
			暂无数据
		</view>
		</scroll-view>
	</view>
</template>

<script>
	import exchangeApi from '@/api/exchange'
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				isFocus: true,
				activeName: 'optional',
				scrollLeft: 0, //tab切换left
				search: '', //搜索
				activeMarket: '',
				// currentMarket:'',
			}
		},
		props:['currentMarket'],
		computed: {
			...mapState(['tickers', 'markets', 'isLogin', 'favorites']),
			getMarkets() {
				let markets = [];
				let data = this.markets;
				for (let item of data) {
					if (markets.indexOf(item.base) == -1) {
						markets.push(item.base);
					}
				}
				return markets;
			},
			tickerList() {
				let list = [];
				let tickers = this.tickers;
				// console.log('---------------')
				// console.log(this.tickers)
				let favorites = this.favorites;
				for (let item of tickers) {
					let pair = item["market"];
					//console.log(pair)
					if (this.activeName != "optional" && this.activeName == this.$common.getBaseCoin(pair)) {
						list.push(item);
					} else if (this.activeName == "optional" && favorites.indexOf(pair) != -1) { //从tickers中过滤favorites
						list.push(item);
					}
				}
				// console.log('list',list)
				return list;
			},
			// 模糊搜索
			orderTickers() {
				//console.log(this.search)
				let newObj = [];
				for (let item of this.tickerList) {
					if (item.market) {
						if (this.$common.getCoin(item.market).indexOf(this.search.toUpperCase().trim()) > -1) {
							newObj.push(item);
						}
					}
				}
				// newObj.sort((a, b) => b.baseVol - a.baseVol);
				console.log('newObj',newObj)
				return newObj;
			}
		},
		watch: {
			currentMarket: {
				immediate: true,
				handler: function(newValue) {
					if (newValue) this.activeMarket = newValue;
					this.activeName = this.$common.getBaseCoin(newValue);
				}
			},
		},
		onShow() {
		},
		methods: {
			// 获取自选币种
			async getFavorites() {
				if (!this.isLogin()) return;
				this.$store.commit('getFavorites');
			},
			tabMarket(pair) {
				this.activeMarket = pair;
				uni.setStorageSync("currentMarket", pair);
				uni.navigateTo({
					url: "/pages/exchange/chart/chart"
				})
			},
			// 切换市场
			tabTimeNav(e, item) {
				this.search = '';
				this.activeName = e.currentTarget.dataset.name;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				//如果是自选区，则取请求获取数据
				if (this.activeName == 'optional') {
					this.$store.commit('getFavorites');
				}
			},
		}

	}
</script>

<style lang="less" scoped>
	.nav .cu-item.cur {
		border-bottom: 2px solid;
	}

	.searchCoin {
		width: 100%;
		height: 100vh;

		.tickers_list {
			max-height: 80vh;

			.tickers_item {
				border-bottom: 1px solid #F8F8F9;
			}

			.tickers_item.active {
				background-color: #F8F8F9;
			}

		}

		.searchWrap {
			width: 100%;
			height: 80upx;
			border-top: 1px solid #F8F8F9;
			border-bottom: 1px solid #F8F8F9;
			position: relative;

			.searchInp {}

			.btnClose {
				width: 118upx;
				height: 80upx;
				float: left;
				font-size: 26upx;
				line-height: 80upx;
				text-align: center;
				border-left: 1px solid #F8F8F9;
			}
		}
	}
</style>
