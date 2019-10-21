<template>
	<view class="market bg-white page">
		<good-nav-bar show="true" bgcolor="#FFFFFF">
			<block slot="content">行情</block>
			<block slot="rightIcon">
				<text class="icon iconfont icon-unie036 font-gray" @tap="searchCoin"></text>
			</block>
		</good-nav-bar><!-- 自定义导航 -->

		<!-- 菜单 -->
		<view class="tabList">
			<scroll-view scroll-x class="bg-white nav text-center">
				<view class="cu-item text-bold" v-for="(item,index) in getMarkets" :class="item==activeName?'cur text-blue':'font-gray'"
				 :data-name="item" :key="index" @tap="tabTimeNav" :data-id="item">
					{{item}}
				</view>
				<view class="cu-item text-bold" :class="activeName=='optional'?'cur text-blue':'font-gray'" @tap="tabTimeNav"
				 :data-name="'optional'">{{'自选'}}</view>
			</scroll-view>
		</view>

		<view class="dataContent">
			<view class="dataHead flex justify-between align-center solid-bottom">
				<view class="explain flex justify-start align-center">
					<text>名称</text>
					<view class="sort flex flex-direction justify-center align-center">
						<view class="ctnswrap" @tap="sortData('coin',1)">
							<text :class="[sortDataName == 'coin' && sortDataType == 1?'font-color':'']" class="up ctns icon iconfont icon-upsj"></text>
						</view>
						<view class="ctnswrap" @tap="sortData('coin',0)">
							<text :class="[sortDataName == 'coin' && sortDataType == 0?'font-color':'']" class="down ctns icon iconfont icon-downsj"></text>
						</view>
					</view>
				</view>
				<view class="explain flex justify-start align-center">
					<text class="explainMid">最新价</text>
					<view class="sort flex flex-direction justify-center align-center">
						<view class="ctnswrap" @tap="sortData('last',1)">
							<text :class="[sortDataName == 'last' && sortDataType == 1?'font-color':'']" class="up ctns icon iconfont icon-upsj"></text>
						</view>
						<view class="ctnswrap" @tap="sortData('last',0)">
							<text :class="[sortDataName == 'last' && sortDataType == 0?'font-color':'']" class="down ctns icon iconfont icon-downsj"></text>
						</view>
					</view>
				</view>
				<view class="explain  flex justify-start align-center">
					<text class="explainRight">涨跌幅</text>
					<view class="sort flex flex-direction justify-center align-center">
						<view class="ctnswrap" @tap="sortData('change',1)">
							<text :class="[sortDataName == 'change' && sortDataType == 1?'font-color':'']" class="up ctns icon iconfont icon-upsj"></text>
						</view>
						<view class="ctnswrap" @tap="sortData('change',0)">
							<text :class="[sortDataName == 'change' && sortDataType == 0?'font-color':'']" class="down ctns icon iconfont icon-downsj"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="dataListWrap">
				<view v-if="orderTickers.length>0" class="dataList flex justify-between align-center solid-bottom" @click="tabMarket(item.market)"
				 v-for="(item,indexs) in orderTickers" :key="indexs">
					<view class="dataMid  flex flex-direction justify-center align-center">
						<view class="dataMidUp flex justify-between align-center margin-bottom-xs">
							<view class="dataMidLeft">
								<text class="dataName text-bold font-color text-df">
									<!-- {{$common.strToArray(item.market,"_",0)}} -->
									{{item.market_coin}}
								</text>
								<!-- <text class="text-gray text-xs">/{{$common.strToArray(item.market,"_",1)}}</text> -->
								<text class="font-grey text-xs">/{{item.market_base}}</text>
							</view>
							<text class="dataGain font-color text-bold">{{item.last}}</text>
						</view>
						<view class="dataMidUp flex justify-between align-center text-sm">
							<view class="dataMidLeft">
								<text class="dataNo text-grey">24H量 {{item.baseVol}}</text>
							</view>
							<text class="dataGain dataPrice font-gray">&yen;{{item.toCNY}}</text>
						</view>
					</view>
					<view class="dataRight  flex justify-center align-center">
						<text class="dataRText text-white text-df" :class="item.change<=0?'back-red':'back-green'">{{item.change}}%</text>
					</view>
				</view>
			</view>
			<view v-if="orderTickers.length <= 0 " style="text-align: center; line-height:160upx;font-size:30upx;">
				{{this.activeName == 'optional'?"没有自选数据":'没有数据'}}
			</view>
		</view>


	</view>
</template>

<script>
	import exchange from '@/api/exchange.js';
	import _ from 'lodash';
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				activeName: 'optional',
				scrollLeft: 0, //tab切换left
				search: '', //搜索
				activeMarket: '',
				sortDataType: '',
				sortDataName: '',
			}
		},
		computed: {
			...mapState(['coins', 'markets', 'isLogin', 'favorites', 'tickers']),
			// search(){
			// 	return this.$common.getCoin(this.currentMarket);
			// },
			getMarkets() { //提取baseCoin
				let markets = [];
				let data = this.markets;
				// console.log('之前',this.markets)
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
				//console.log('list',list)
				return list;
			},
			// 模糊搜索
			orderTickers() {
				if (uni.getStorageSync('search_flag')) { //如果有搜索标记
					this.search = this.$common.getCoin(this.currentMarket)
					//console.log('有搜索')
				} else {
					this.search = '';
				}

				let newObj = [];
				let coins = this.coins
				if (this.tickerList.length != 0) {
					for (let item of this.tickerList) {
						//console.log(item)
						if (item.market) {
							if (this.$common.getCoin(item.market).indexOf(this.search.toUpperCase().trim()) > -1) {
								item.change = this.$tools.util.toFixed(item.change, 2);
								item.market_coin = this.$common.strToArray(item.market, "_", 0);
								item.market_base = this.$common.strToArray(item.market, "_", 1);
								item.toCNY = this.$common.toCNY(item.market, item.last);
								//console.log(item.market_coin)
								item.letter = item.market_coin.slice(0,1).toUpperCase() || '';
								if (coins[item.market_coin]) {
									item.index = coins[item.market_coin].index || 0 //添加的index默认为0
								} else {
									item.index = 0;
								}
								newObj.push(item);
							}
						}

					}
				}
				//排序
				switch (this.sortDataName) {
					case 'coin': //按照字母大小排序
						if (this.sortDataType == 1) newObj.sort((a, b) => a.letter - b.letter);
						if (this.sortDataType == 0) {
							newObj.sort((a, b)=>{
							    if(a.toString() < b.toString())
							        return 1;
							    return -1;
							})
						}
						break;
					case 'last': //按照最新价大小排序
						if (this.sortDataType == 1) newObj.sort((a, b) => a.last - b.last);
						if (this.sortDataType == 0) newObj.sort((a, b) => b.last - a.last);
						break;
					case 'change': //按照涨跌幅排序
						if (this.sortDataType == 1) newObj.sort((a, b) => a.change - b.change);
						if (this.sortDataType == 0) newObj.sort((a, b) => b.change - a.change);
						break;
					default: //根据coins里面index
						newObj.sort((a, b) => b.index - a.index);
						break;
				}
				//console.log('newObj',newObj)
				return newObj;
			}
		},
		onShow() {
			this.clearData();
			//console.log(this.tickers);
			//console.log('----------------',this.currentMarket);

			//获取市场
			this.$store.commit('getMarkets');

			//获取当前币
			let currentMarket = uni.getStorageSync('currentMarket') || '';
			this.activeName = this.$common.getBaseCoin(currentMarket);
			//console.log('activeName',this.activeName)

			//获取ticker
			this.$store.commit('getTickers')

			// 获取自选币种
			// this.$store.commit('getFavorites');
			// 
			// if(this.favorites.length>0){
			//     this.activeName = 'optional';
			// }
		},
		onNavigationBarButtonTap(e) {
			// console.log(e)

		},
		methods: {
			sortData(name, type) {
				this.sortDataType = type;
				this.sortDataName = name;
			},
			searchCoin() {
				uni.navigateTo({
					url: "/pages/market/searchCoin"
				})
			},
			clearData() {
				this.activeName = '';
				this.sortDataType = '';
				this.sortDataName = '';
			},
			//进入
			tabMarket(pair) {
				console.log(pair);
				this.activeMarket = pair;
				uni.setStorageSync("currentMarket", pair);
				uni.switchTab({
					url: "/pages/exchange/exchange"
				})
			},
			// 切换市场
			tabTimeNav(e) {
				uni.removeStorageSync('search_flag')
				this.activeName = e.currentTarget.dataset.name;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				//如果是自选区，则取请求获取数据
				if (this.activeName == 'optional') {
					this.$store.commit('getFavorites');
				}
			}
		},
		onHide() {
			uni.removeStorageSync('search_flag') //去除搜索标记
		}
	}
</script>

<style lang="less" scoped>
	.sort {
		height: 67.7upx;
		width: 50upx;

		.ctnswrap {
			// background:red;
			position: relative;
			width: 50upx;
			height: 34upx;

			// background:red;
			.ctns {
				// color:#C6CFD6;
				text-align: center;
				font-size: 28upx;
				position: absolute;
				left: 10upx;
			}

			.up {
				bottom: -8upx;

			}

			.down {
				top: -8upx;
			}
		}

	}

	.nav {
		border-bottom: 1px solid #E6E6E6;
	}

	.nav .cu-item.cur {
		border-bottom: 2px solid;
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

	.market {
		width: 100%;
		// height: 100vh;

		.nav .cu-item {
			height: 36px;
			display: inline-block;
			line-height: 36px;
			margin: 0 6px;
			padding: 0 4px;
		}

		.dataContent {
			width: 100%;

			.dataHead {
				margin: 0 auto;
				padding-left: 26.04upx;
				padding-right: 26.04upx;

				.explain {
					// width: 235upx;
					height: 100upx;
					// line-height: 67.7upx;
					color: #C6CFD6;
				}

				.explainMid {
					width: 100%;
					display: block;
					text-align: center;
				}

				.explainRight {
					display: block;
					float: right;
				}
			}

			.dataListWrap {
				width: 705upx;
				height: auto;
				margin: 0 auto;

				.dataList {
					width: 100%;
					margin: 0 auto;
					height: 104.16upx;

					.dataMid {
						width: 500upx;
						height: 60upx;
						margin-right: 41.66upx;

						.dataMidUp {
							width: 100%;
							text-indent: 10upx;

							.dataMidLeft {
								width: 53%;
								height: 100%;

								.dataName {
									font-size: 25upx;
								}

								.dataNo {
									width: 100%;
									display: block;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								}
							}

							.dataGain {
								width: 46%;
								display: block;
								text-align: right;
							}

							.dataPrice {
								font-size: 26upx;
								letter-spacing: 1upx;
							}
						}
					}

					.dataRight {
						.dataRText {
							border-radius: 2.08upx;
							width: 145.83upx;
							height: 60upx;
							display: block;
							line-height: 60upx;
							text-align: center;
						}
					}
				}
			}
		}

	}
</style>
