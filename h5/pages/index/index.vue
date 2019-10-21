<template>
	<!-- 首页 -->
	<view class="index bg-white">
		<nav-bar show="false"></nav-bar>
		<view class="navigation clearfix">
			<view class="images" @tap="openMenu('left')">
				<text class="logoimg icon iconfont icon-userlogo" style="color:#215481"></text>
			</view>
			<view class="indexTitle">
				<image :src="logo" mode="aspectFit" class="titleImg"></image>
			</view>
		</view>
		
		<!-- <navigator url="/pages/market/test/test">11111</navigator> -->
		<!-- 图片轮播 -->
		<view class="imgView clearfix">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper id="swiper1" class="swiper" @change="swiperImg" indicator-dots="true" circular='true' autoplay="true"
					 interval="4000" duration="500" previous-margin="30upx" next-margin="30upx">
						<swiper-item v-for="(imgObj,index) in banners" :key="index">
							<image :src="imgObj.url" mode="aspectFill" class="swiper-item" :class="{currentStyle:currentIndex==index}"></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<!-- 消息轮播 -->
		<view class="newsWrap">
			<text class="newsImg icon iconfont icon-svg45-copy"></text>
			<view class="newsView flex justify-between align-center">
				<view class="page-section swiper flex-sub">
					<view class="page-section-spacing">
						<swiper id="swiper2"  indicator-dots="indicatorDots" indicator-color="rgba(0,0,0,0)" indicator-active-color="rgba(0,0,0,0)" class="swiper" vertical="true" autoplay="true" circular='true' interval="5000" duration="500">
							<swiper-item v-for="(newObj,index) in newsList" :key="index">
								<navigator :url="'./news/news?id='+newObj._id">
									<view class="swiper-item text-cut" style="color:#1F3F58">{{newObj.title}}</view>
								</navigator>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="morelist">
					<text class="font-color" @tap="getMore">查看更多</text>
					<text class="icon iconfont icon-gengduo margin-right-xs text-bold"></text>
				</view>

			</view>
		</view>

		<!-- 币信息 -->
		<view class="msgViewWrap">
			<view class="msgView flex justify-between align-center">
				<view class="msgOne" v-for="(item,index) in topList" :key="index">
					<text class="msgText msgSame text-sm">{{$common.strToArray(item.market,"_",0)+'/'+$common.strToArray(item.market,"_",1)}}</text>
					<text class="msgNum msgSame font-green text-lg">{{item.last}}</text>
					<text class="msgSame font-green text-sm">{{item.change}}%</text>
					<text class="msgUsNum msgSame text-grey text-sm">&yen;{{item.last}}</text>
				</view>
			</view>
		</view>

		<view class="empty bg-gray"></view>

		<view class="dataView">
			<view class="tabView text-bold text-gray">
				<view v-for="(tab,index) in tabBars" :key="tab.id" class="tabList" :class="tabIndex==index ? 'currentTab' : ''" :id="tab.id"
				 :data-current="index" @click="tapTab">{{tab.name}}</view>
			</view>
			<view class="dataContent padding-bottom">
				<view v-if="tabIndex=='0'">
					<view class="dataList flex justify-between align-center solid-bottom" v-for="(item,index) in ascTickers" :key="index"
					 @tap="tabMarket(item.market)">
						<text class="dataIndex font-green text-bold text-df margin-right-xs">{{index+1}}.</text>
						<view class="dataMid flex flex-direction justify-center align-center">
							<view class="dataMidUp flex justify-between align-center margin-bottom-xs">
								<view class="dataMidLeft">
									<text class="dataName text-bold text-df font-color">
										{{$common.strToArray(item.market,"_",0)}}
									</text>
									<text class="baseName text-xs">/{{$common.strToArray(item.market,"_",1)}}</text>
								</view>
								<text class="dataGain font-color text-bold">{{item.last}}</text>
							</view>
							<view class="dataMidUp flex justify-between align-center">
								<view class="dataMidLeft">
									<text class="dataNo text-sm text-gray">24H量 {{item.baseVol}}</text>
								</view>
								<text class="dataGain dataPrice text-gray">&yen;{{$common.toCNY(item.market,item.last)}}</text>
							</view>
						</view>
						<view class="dataRight flex justify-center align-center">
							<text class="dataRText text-white text-df" :class="item.change<=0?'back-red':'back-green'">{{item.change | toFixed(2)}}%</text>
						</view>
					</view>
				</view>
				
				<view v-if="tabIndex=='1' ">
					<view class="dataList flex justify-between align-center solid-bottom" v-for="(item,index) in descTickers" :key="index"
					 @tap="tabMarket(item.market)">
						<text class="dataIndex font-green text-bold text-df margin-right-xs">{{index+1}}.</text>
						<view class="dataMid flex flex-direction justify-center align-center">
							<view class="dataMidUp flex justify-between align-center margin-bottom-xs">
								<view class="dataMidLeft">
									<text class="dataName text-bold text-df font-color">
										{{$common.strToArray(item.market,"_",0)}}
									</text>
									<text class="baseName text-xs">/{{$common.strToArray(item.market,"_",1)}}</text>
								</view>
								<text class="dataGain font-color text-bold">{{item.last}}</text>
							</view>
							<view class="dataMidUp flex justify-between align-center">
								<view class="dataMidLeft">
									<text class="dataNo text-sm text-gray">24H量 {{item.baseVol}}</text>
								</view>
								<text class="dataGain dataPrice text-gray">&yen;{{$common.toCNY(item.market,item.last)}}</text>
							</view>
						</view>
						<view class="dataRight flex justify-center align-center">
							<text class="dataRText text-white text-df" :class="item.change<=0?'back-red':'back-green'">{{item.change | toFixed(2)}}%</text>
						</view>
					</view>
				</view>
				
				<view v-if="tabIndex == '2'">
					<view class="dataList flex justify-between align-center solid-bottom" v-for="(item,index) in dealTickers" :key="index"
					 @tap="tabMarket(item.market)">
						<text class="dataIndex font-green text-bold text-df margin-right-xs">{{index+1}}.</text>
						<view class="volume">
							<text class="dataName text-bold font-color text-df">
								{{$common.strToArray(item.market,"_",0)}}
							</text>
							<text class="baseName text-xs">/{{$common.strToArray(item.market,"_",1)}}</text>
						</view>
						<view class="volumeNum text-df font-color">24H量 {{item.baseVol}}</view>

					</view>

				</view>
				<view v-if="Object.keys(this.tickers).length <= 0" style="text-align: center; line-height:160upx;font-size:30upx; ">
					没有数据
				</view>
			</view>
		</view>
		<!-- 侧边栏 -->

		<view class="sidebars">
			<uni-drawer :visible="showLeft" mode="left" @close="closeDrawer('left')">
				<scroll-view style="height:100vh" scroll-y="true">
					<sidebar></sidebar>
				</scroll-view>
			</uni-drawer>
		</view>

	</view>
</template>

<script>
	import _ from "lodash";
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
	import Sidebar from '@/pages/user/index.vue';
	import base from '@/api/base.js';
	import exchange from '@/api/exchange.js';
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				indicatorDots:false,
				html: '',
				title: 'Hello',
				newsList: [], //新闻
				//tickers: [], //tickers数组
				//topList: [],
				showLeft: false,
				currentIndex: 0, //banners当前图片索引
				tabIndex: 0, //涨跌幅默认索引
				dataList: [],
				tabBars: [{
					name: '涨幅榜',
					id: 'zhangfubang'
				}, {
					name: '跌幅榜',
					id: 'diefubang'
				}, {
					name: '成交量',
					id: 'chengjiaoliang'
				}],
				banners: [],
			}
		},
		components: {
			uniDrawer,
			Sidebar
		},
		computed: {
			...mapState(['logo', 'tickers']),
			topList() { //top榜
				if (Object.keys(this.tickers).length != 0) {
					//排序
					let tickers = _.clone(this.tickers);
					tickers.sort((a, b) => b.change - a.change);
					return tickers.slice(0, 3) || [];
				}
			},
			ascTickers(){
				if (Object.keys(this.tickers).length != 0){
					let ascTickers = _.clone(this.tickers);
					ascTickers.sort((a, b) => b.change - a.change);
					return ascTickers;
				}
			},
			descTickers(){
				if (Object.keys(this.tickers).length != 0){
					let descTickers = _.clone(this.tickers);
					descTickers.sort((a, b) => a.change - b.change);
					return descTickers;
				}
			},
			dealTickers(){
				if (Object.keys(this.tickers).length != 0){
					let dealTickers = _.clone(this.tickers);
					dealTickers.sort((a, b) => b.baseVol - a.baseVol);
					return dealTickers;
				}
			}
		},
		onLoad() {
			this.$store.commit('getInfo');
		},
		async onShow() {
			//获取banner
			this.banners = uni.getStorageSync('banners') || []
			this.banners = await this.getBanner();
			uni.setStorageSync('banners', this.banners);

			//获取新闻
			this.newsList = uni.getStorageSync("news") || {};
			let news = await base.getNewsList('', 5, 1);
			//await this.$common.sleep();
			this.newsList = news.data;
			uni.setStorageSync("news", this.newsList);
		},
		methods: {
			async getBanner() {
				var banners = [];
				try {
					banners = await base.getBanners();
					//await this.$common.sleep();
					return banners.data;
				} catch (e) {
					return banners
					//TODO handle the exception
				}
			},
			getMore() {
				uni.navigateTo({
					url: '/pages/index/news/list'
				})
			},
			// 点顶部小球
			openMenu: function(e) {
				if (this.$store.state.isLogin()) {
					if (e === 'left') {
						this.showLeft = !this.showLeft;
					}
					let c2cInfo = uni.getStorageSync("c2c");
					// if (c2cInfo == "") {
					this.$store.commit("getC2CInfo");
					// }
				} else {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
			},
			closeDrawer: function(e) {
				if (e === 'left') {
					this.showLeft = !this.showLeft;
				}
			},
			// 监听图片轮播
			swiperImg: function(e) {
				// console.log(e)
				this.currentIndex = e.detail.current;
			},
			newsMsg: function(id) {
				console.log(id)
			},
			async tapTab(e) { //点击tab-bar
				let tabindex = e.target.dataset.current;
				if (this.tabIndex === tabindex) {
					return false;
				} else {
					this.isClickChange = true;
					this.tabIndex = tabindex;
				}
			},
			tabMarket(pair) {
				uni.setStorageSync("currentMarket", pair);
				uni.switchTab({
					url: "/pages/exchange/exchange"
				})
			}

		},
	}
</script>

<style lang="less" scoped>
	.baseName {
		color: #C6CFD6;
	}

	.icon-gengduo:before {
		color: #1F3F58;
	}

	#open {
		position: absolute;
		z-index: 100;
	}

	.morelist {
		color: #1F3F58;
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

	.index {
		width: 100%;

		// 		height: 100vh;
		// 
		/* 顶部栏 */
		.navigation {
			width: 100%;
			// padding-top:21.35upx;
			margin-bottom: 21.35upx;
			height: 72.91upx;
			position: relative;
			overflow: hidden;
			padding-top: 21.35upx;

			.images {
				width: 51.56upx;
				height: 51.56upx;
				// border-radius: 66upx;
				overflow: hidden;
				position: absolute;
				left: 26.04upx;
				top: 21.35upx;

				.logoimg {
					font-size: 53upx;
				}
			}

			.indexTitle {
				width: 300upx;
				height: 39.06upx;
				margin: 0 auto;
				padding-top: 6.25upx;
				padding-bottom: 6.25upx;

				.titleImg {
					width: 100%;
					height: 39.06upx;
					float: left;
					// margin-top: 12upx;
				}
			}
		}

		/* 图片轮播 */
		.imgView {
			width: 100%;
			height: 300upx;

			.swiper {
				width: 100%;
				height: 300upx;

				.swiper-item {
					display: block;
					height: 280upx;
					width: 100%;
					line-height: 300upx;
					text-align: center;
					border-radius: 10upx;
					margin-top: 10upx;
				}

				.currentStyle {
					height: 300upx;
					width: 96%;
					margin-top: 0upx;
					margin-left: 2%;
				}
			}
		}

		/* 消息轮播 */
		.newsWrap {
			// width: 100%;
			// height: 70upx;
			height: 86.45upx;
			// margin-top: 10upx;
			overflow: hidden;
			padding-left: 26.04upx;
			padding-right: 26.04upx;

			.newsImg {
				height: 86.45upx;
				float: left;
				text-align: center;
				line-height: 86.45upx;
				color: #376284;
			}

			.newsView {
				height: 86.45upx;
			}

			.swiper {
				// width: 100%;
				height: 86.45upx;

			}

			.swiper-item {
				display: block;
				height: 86.45upx;
				line-height: 86.45upx;
				text-indent: 10upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		/* 币信息 */
		.msgViewWrap {
			padding-left: 26.04upx;
			padding-right: 26.04upx;

			.msgView {
				// width: 96%;
				margin: 0 auto;
				display: flex;
				padding-left: 36.45upx;
				padding-right: 36.45upx;
				padding-top: 31.25upx;
				padding-bottom: 45upx;

				border-top: 1.04upx solid #F7F6FB;

				.msgOne {
					// width: 29%;
					height: 100%;
					// margin-left: 4.5%;
					// position: relative;
					// border-bottom: 1px solid #ccc;

					.msgSame {
						width: 100%;
						text-align: center;
						display: block;
						overflow: hidden;

					}

					.msgText {
						color: #1F3F58;
					}

					.msgNum {
						height: 46.87upx;
						line-height: 46.87upx;
					}

					.msgUsNum {
						margin-top: 10.41upx;
					}

					.msgImg {
						width: 53upx;
						height: 53upx;
						border: 1px solid red;
						border-radius: 50upx;
						position: absolute;
						top: 12upx;
						right: 5upx;
					}
				}
			}

			.msgView .msgOne:nth-child(1) {
				// margin-left: 2%;
			}
		}

		.empty {
			height: 26upx;
			width: 100%;
		}

		/* 数据展示 */
		.dataView {
			width: 100%;
			height: auto;

			.tabView {
				width: 100%;
				height: 70upx;
				display: flex;
				line-height: 70upx;
				font-size: 26upx;

				.tabList {
					width: auto;
					height: 100%;
					padding: 0 10upx;
					margin-left: 16upx;
				}
			}

			.currentTab {
				font-size: 30upx;
				color: #25445C;
			}

			.dataContent {
				width: 100%;
				height: auto;
				border-top: 1px solid #F7F6FB;

				.dataList {
					width: 100%;
					height: 103.12upx;
					margin: 0 auto;
					padding-left: 26.04upx;
					padding-right: 26.04upx;


					.dataIndex {
						width: 37upx;
						display: block;
						text-align: center;
						line-height: 90upx;
					}

					.dataMid {
						width: 500upx;
						// height: 100%;
						height: 60upx;
						margin-right: 41.66upx;

						.dataMidUp {
							width: 100%;
							text-indent: 10upx;

							.dataMidLeft {
								width: 53%;
								height: 100%;

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

					.volume {
						width: 230upx;
						height: 100%;
						margin-left: 20upx;
						overflow: hidden;

						.dataName {
							line-height: 90upx;
						}

					}

					.volumeNum {
						width: 390upx;
						text-align: right;
					}
				}
			}
		}


	}
</style>
