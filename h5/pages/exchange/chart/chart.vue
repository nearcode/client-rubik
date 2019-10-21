<template>
	<view class="market_chart ">
		<good-nav-bar show="true" bgcolor="rgb(19, 30, 48)">
			<block slot="backIcon">
				<text class="icon iconfont icon-fanhui1 font-gray" @tap="back"></text>
			</block>
			<block slot="content">
				<text style="font-weight:bold;color:#C6CFD6">{{market | toString}}</text>
			</block>
			<block slot="rightIcon">
				<text class="icon iconfont" :class="contColor" @tap="setFavorit"></text>
			</block>
		</good-nav-bar><!-- 自定义导航 -->
		<view class="chart_main">
			<!-- tickers -->
			<view class="flex padding-top-lg">
				<!-- 最新价 -->
				<view class="basis-lg padding-left-sm">
					<text class=" text-bold text-xxl" :class="(tickers[market]?tickers[market].change:0) >=0?'text-green':'text-red'">{{tickers[market]?tickers[market].last:0 | autoFixed}}</text>
					<view class="">
						<text class="text-sm text-gray">
							≈￥{{$common.toCNY(market,tickers[market]?tickers[market].last:0)}}
						</text>
						<text class="text-sm padding-left-xs" :class="(tickers[market]?tickers[market].change:0) >=0?'text-green':'text-red'">
							{{(tickers[market]?tickers[market].change:0) | toFixed(2)}}%
						</text>
					</view>
				</view>
				<!-- 价格 -->
				<view class="basis-sm padding-right-sm text-xs">
					<view class="cf">
						<text class="text-gray fl">高</text>
						<text class="text-white fr">{{(tickers[market]?tickers[market].hight:0) | autoFixed }}</text>
					</view>
					<view class="cf">
						<text class="text-gray fl">低</text>
						<text class="text-white fr">{{(tickers[market]?tickers[market].hight:0) | autoFixed }}</text>
					</view>
					<view class="cf">
						<text class="text-gray fl">24H</text>
						<view class="text-white fr">{{$common.autoFixed(tickers[market]?tickers[market].vol:0)}}</view>
					</view>
				</view>
			</view>
			<!-- k线时间选择 -->
			<view>
				<scroll-view scroll-x class="text-white text-xs nav">
					<view class="cu-item" :class="tabSelectEd==v.resolution?'cur text-blue':'text-gray'" v-for="(v,k) in timeList"
					 :key="k" @click="tabTimeNav(v.resolution,v.ts)">
						{{v.title}}
					</view>
				</scroll-view>
			</view>
			<!-- k线 -->
			<view class="k_line">
				<canvas canvas-id="canvasCandle" id="canvasCandle" class="charts" disable-scroll=true @touchstart="touchCandle"
				 @touchmove="moveCandle" @touchend="touchEndCandle"></canvas>
				<!-- <view class="qiun-columns"> -->
				<!-- <view class="qiun-bg-white qiun-title-bar qiun-common-mt qiun-rows">
						<view class="qiun-title-dot-light">基本K线图（完善中）</view>
						<view style="flex: 1;qiun-rows;text-align: right;">
							<button type="default" size="mini" @tap="tapButton('in')">放大</button>
							<button type="default" size="mini" style="margin-left: 20upx;" @tap="tapButton('out')">缩小</button>
						</view>
					</view> -->
				<!-- 
					<view class="qiun-padding qiun-bg-white ">
						<slider :value="itemCount" min="5" :max="sliderMax" block-color="#f8f8f8" block-size="18" @changing="sliderMove"
						 @change="sliderMove" />
					</view> -->
				<!-- </view> -->
			</view>
			<!-- 深度切换 -->
			<view>
				<scroll-view scroll-x class="text-white text-center nav">
					<view class="cu-item" :class="TabCur==v.index?'cur text-blue':'text-gray'" v-for="(v,k) in depthNav" @tap="tabSelect"
					 :data-id="v.index" :key="k">
						{{v.title}}
					</view>
				</scroll-view>

				<scroll-view scroll-y class="trade_container">
					<!-- 深度chart -->
					<!-- <view class="k_depth" v-show="TabCur=='depth'">
						<depth-chart :depthList="depthListData"></depth-chart>

					</view> -->
					<!-- 成交 -->
					<view class="order_history cf padding" v-show="TabCur=='order'">
						<view class="grid col-4 margin-bottom-xs text-gray">
							<view class="text-sm">时间</view>
							<view class="text-sm text-center">方向</view>
							<view class="text-sm text-center">价格</view>
							<view class="text-sm text-right">数量</view>
						</view>
						<view class="grid col-4 orderList" v-for="(v,k) in orderHistory" :key="k">
							<view class="text-xs">{{v.create | formatTime('yyyy-MM-dd')}}</view>
							<view class="text-xs text-center" :class="v.type==1?'text-green':'text-red'">{{v.type==1?'买入':'卖出'}}</view>
							<view class="text-xs text-center">{{v.price}}</view>
							<view class="text-xs text-right">{{v.amount}}</view>
						</view>
						<view class="margin padding text-gray text-center" v-show="orderHistory.length==0">
							暂无数据
						</view>
					</view>
					<!-- 简介 -->
					<view class="intro" v-if="TabCur=='intro'">
						<v-intro :coin="coin"></v-intro>
					</view>
				</scroll-view>

			</view>

			<!-- 买卖深度 -->
			<view class="cf padding-xs" style="background-color: #131f30;border-top:1px solid #071724;">
				<view class=" text-gray flex">
					<view class="text-xs text-left flex-sub">买盘</view>
					<view class="text-xs text-left flex-sub">数量</view>
					<view class="text-xs text-center flex-twice">价格({{$common.getCoin(market)}})</view>
					<view class="text-xs text-right flex-sub">数量({{$common.getBaseCoin(market)}})</view>
					<view class="text-xs text-right flex-sub">卖盘</view>
				</view>

				<!-- 买卖深度 -->
				<view class="flex">
					<view class="flex-sub">
						<view class="grid col-3 depthBuyBg padding-xs" :key="k" :style="{'background-size':v.width+'% 100%'}" v-for="(v,k) in depthList.bids">
							<view class="text-xs text-gray">{{k+1}}</view>
							<view class="text-xs text-white">{{v.amount}}</view>
							<view class="text-xs text-green text-right">{{v.price}}</view>
						</view>
					</view>

					<view class="flex-sub">
						<view class="grid text-right col-3 depthSellBg padding-xs" :key="k" :style="{'background-size':v.width+'% 100%'}"
						 v-for="(v,k) in depthList.asks">
							<view class="text-xs text-red text-left">{{v.price}}</view>
							<view class="text-xs text-white">{{v.amount}}</view>
							<view class="text-xs text-gray">{{k+1}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="cu-bar btn-group footer">
			<button class="cu-btn lg bg-green shadow-blur" @click="goExchange('buy')">买入</button>
			<button class="cu-btn lg bg-red shadow-blur " @click="goExchange('sell')">卖出</button>
		</view>
	</view>
</template>

<script>
	import echarts from '@/components/echarts/echarts.min.js';
	import depthChart from './k_depth.vue';
	import vIntro from './intro.vue';
	import config from '@/config'
	import exchangeApi from '@/api/exchange.js'
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaCandle = null;
	import {
		mapState
	} from 'vuex'
	import sockets from '@/api/socket.js';

	// var echarts = require("@/components/echarts/echarts.min.js").echarts;
	export default {
		data() {
			var language = 'zh';
			return {
				rotateLabel:false,
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				itemCount: 50, //x轴单屏数据密度
				sliderMax: 100,

				tabSelectEd: '60',
				TabCur: 'order',
				chart: null, //k线
				market: '', //交易对
				depthList: { //深度数据
					asks: [],
					bids: []
				},
				depthListData: { //传递到深度线的数据，因所需数据格式不同
					asks: [],
					bids: []
				},
				coin: null,
				socket: null,
				orderHistory: [], //最新成交价
				tickers: [],
				timeList: [
					// {
					// 	title: "en" == language ? "Time" : "分时",
					// 	resolution: "0",
					// 	chartType: 3
					// },
					{
						title: "en" == language ? "1min" : "1分钟",
						resolution: "1",
						chartType: 1
					}, {
						title: "en" == language ? "5min" : "5分钟",
						resolution: "5",
						chartType: 1
					}, {
						title: "en" == language ? "30min" : "30分钟",
						resolution: "30",
						chartType: 1
					}, {
						title: "en" == language ? "1hour" : "1小时",
						resolution: "60",
						chartType: 1
					}, {
						title: "en" == language ? "1day" : "1天",
						resolution: "1440",
						chartType: 1,
						ts:1,//自定义变量
					},
					// {
					// 	title: "en" == language ? "1week" : "周线",
					// 	resolution: "1W",
					// 	chartType: 1
					// }
				],
				depthNav: [
					// {
					// 	title: '深度',
					// 	index: 'depth'
					// },
					{
						title: '成交',
						index: 'order'
					},
					{
						title: '简介',
						index: 'intro'
					},
				],
				contColor:'icon-shoucang1 font-grey',
				disable:false,
			}
			
		},
		components: {
			depthChart,
			vIntro
		},
		props: ['currentMarket'],
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(800);
			// 初始化k线
			//this.getServerData();
		},
		onShow() {
			//获取交易对
			this.market = this.currentMarket || uni.getStorageSync("currentMarket");
			//从本地数据创建深度曲线
			this.depthList = uni.getStorageSync("depthList" + this.market) || {
				asks: [],
				bids: []
			};
			this.creatDepthList(this.depthList);
			//初始化Socket
			this.socketInit();
			// 初始化k线
			this.getServerData();

			//获取自选
			this.$store.commit('getFavorites');

			//自选按钮变颜色
			this.setColor();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			async setFavorit(){
				await this.$store.commit('setFavorites', this.market);
				this.setColor();
			},
			//自选按钮变颜色
			setColor() {
				this.favorites = uni.getStorageSync('favorites') || [];
				if (!this.favorites.length) return false;
				let index = this.favorites.indexOf(this.market);
				this.contColor = index != -1 ? 'icon-shoucang hasColor':'icon-shoucang1 font-grey';
			},
			// 初始化socket
			socketInit() {
				this.socket = new sockets.WebSocket(config.socketUrl, (e) => {
					this.socket.send({
						"type": "subscibe:market",
						"data": this.market
					})
				}, (e) => {
					let res = this.$tools.util.toJson(e.data);
					switch (res.type) {
						//余额
						case 'market:balances':
							// this.balances = data.data;
							break;
							//tickers
						case 'market:tickers':
							this.tickers = res.data;
							//对象转数组，并保存本地，供估值什么的使用
							let tickerList = [];
							for (let item in this.tickers) {
								this.tickers[item]['market'] = item;
								tickerList.push(this.tickers[item])
							}
							uni.setStorageSync("tickers", tickerList);
							break;
						case 'market:ticker:update':
							break;
							//深度数据
						case 'market:depth':
							this.depthList = res.data;
							this.depthListData = res.data;
							this.creatDepthList(this.depthList)

							break;

							//最新成交
						case 'market:orderHistory':

							this.orderHistory = res.data || [];
							break;
							//最新成交更新单条
						case 'market:history:add':

							break;
							//我的挂单
						case 'market:myOrders':

							break;
							//我的成交记录
						case 'market:myOrderHistory':


							break;
					}
				})
			},
			// 点击跳转到交易
			goExchange(type) {
				//uni.setStorageSync("currentMarket",market);
				uni.setStorageSync('exchange_type', type)
				uni.reLaunch({
					url: '/pages/exchange/exchange'
				});
			},
			// 初始化k线
			async getServerData() {
				if (!this.market) return;
				let datas = {

				};
				let categories = []

				try {
					datas.data = await exchangeApi.getKline(this.market, this.tabSelectEd);
					
					//console.log('k线',datas.data);

					let Candle = {
						categories: [],
						series: []
					};
					let i = 0;

					for (let item of datas.data) {
						categories.push(this.$tools.date.toString(item[0],'MM/dd hh:mm'));
						let a = datas.data[i][3],
							b = datas.data[i][5];
						datas.data[i][3] = b;
						datas.data[i][5] = a;

						datas.data[i].shift();
						datas.data[i].shift();

						i++;
					}


					// console.error(datas)
					Candle.categories = categories;
					Candle.series.push({
						data: [],
						type: ''
					})
					Candle.series[0].data = datas.data;
					// console.log(Candle)
					_self.showCandle("canvasCandle", Candle);
				} catch (e) {

				}
			},
			showCandle(canvasId, chartData) {
				canvaCandle = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'candle',
					fontSize: 11,
					type: 'candle',
					legend: false,
					background: '#131f30',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					enableScroll: true, //开启图表拖拽功能
					xAxis: {
						fontColor: '#58667e',
						disableGrid: true, //不绘制X轴网格线
						labelCount: 3, //X轴文案数量
						//type:'grid',
						//gridType:'dash',
						fontSize: 12,
						rotateLabel:_self.rotateLabel,
						gridEval: 3,
						itemCount: this.itemCount, //可不填写，配合enableScroll图表拖拽功能使用，x轴单屏显示数据的数量，默认为5个
						scrollShow: false, //新增是否显示滚动条，默认false
						scrollAlign: 'right',
						scrollBackgroundColor: '#F7F7FF', //可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条背景颜色,默认为 #EFEBEF
						scrollColor: '#DEE7F7', //可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条颜色,默认为 #A6A6A6
					},
					yAxis: {
						fontColor: '#58667e',
						//disabled:true
						gridType: 'solid', //dash
						gridColor: '#172941',
						splitNumber: 5,

						format: (val) => {
							if(val < 1){
								return val
							}else{
								return val.toFixed(0)
							}
						}
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: false,
					dataPointShape: true,
					extra: {
						candle: {
							color: {
								upLine: '#f04864',
								upFill: '#f04864',
								downLine: '#2fc25b',
								downFill: '#2fc25b'
							},
							average: {
								show: true,
								name: ['MA5', 'MA10', 'MA30'],
								day: [5, 10, 30],
								color: ['#1890ff', '#2fc25b', '#facc14']
							}
						},
						tooltip: {
							bgColor: '#000000',
							bgOpacity: 0.7,
							gridType: 'dash',
							dashLength: 5,
							gridColor: '#1890ff',
							fontColor: '#FFFFFF',
							horizentalLine: true,
							xAxisLabel: true,
							yAxisLabel: true,
							labelBgColor: '#172941',
							labelBgOpacity: 0.95,
							labelAlign: 'left',
							labelFontColor: '#8799a3'
						}
					},
				});

			},
			touchCandle(e) {
				canvaCandle.scrollStart(e);
			},
			moveCandle(e) {
				canvaCandle.scroll(e);
			},
			touchEndCandle(e) {
				canvaCandle.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				canvaCandle.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			tapButton(type) {
				let step = 5;
				if (type == 'in') {
					_self.itemCount -= step;
					if (_self.itemCount <= 5) {
						_self.itemCount = 5;
					}
				} else {
					_self.itemCount += step;
					if (_self.itemCount >= _self.sliderMax) {
						_self.itemCount = _self.sliderMax;
					}
				}
				_self.zoomCandle(_self.itemCount);
			},
			sliderMove(e) {
				_self.itemCount = e.detail.value;
				_self.zoomCandle(e.detail.value);
			},
			zoomCandle(val) {
				canvaCandle.zoom({
					itemCount: val
				});
			},
			async getKLine() {
				// this.chart.showLoading();
				try {
					let kline = await exchangeApi.getKline(this.market, this.tabSelectEd);
					// this.chart.hideLoading();
					this.updateKline(kline);
				} catch (e) {
					console.log(e);
				}
			},
			updateKline(data) {
				// data = data.slice(0, 50);
				let dateList = [];
				let volumeList = [];
				let dataList = [];
				for (let item of data) {
					dateList.push(this.$tools.date.toString(item[0],'yyyy-MM-dd'));
					volumeList.push(item[1]);
					dataList.push([item[3], item[5], item[4], item[2]]);
				}
				console.log(dateList, volumeList, dataList);
				this.chart.setOption({
					xAxis: {
						data: dateList
					},
					series: [{
						name: 'Volume',
						data: volumeList,
					}, {
						name: 'Kline',
						data: dataList,
					}]
				});
			},
			// 创建深度列表
			creatDepthList(data) {
				this.depthList = {};

				for (let item in data) {
					this.depthList[item] = [];
					let dataArr = {};
					dataArr[item] = data[item];

					let listArr = [];
					// let listNumber = (dataArr.length > 5) ? dataArr.length : 5;
					let listNumber = 20;
					console.log(dataArr)
					for (let i = 0; i < listNumber; i++) {
						if (dataArr[item][i]) {
							listArr.push({
								amount: dataArr[item][i].amount,
								price: dataArr[item][i].price,
							})
						} else {
							listArr.push({
								amount: '--',
								price: '--',
								width: 0
							})
						}
					}
					this.depthList[item] = listArr;
				}
				// this.depthList['asks'].reverse();
				this.tt(this.depthList.asks, this.depthList.bids);
			},
			// 切换k线时间
			tabTimeNav(time,ts) {
				//console.log(ts)
				_self.rotateLabel = ts == 1?true:false;//是否开启X轴时间旋转
				this.tabSelectEd = time;
				this.getServerData();
			},
			// 切换深度/成交/简介
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			//交易量背景
			tt(e, t) {
				//组合排序
				let sort = function(a) {
					a.sort(function(e, t) {
						return e.amount - t.amount;
					});
					return a;
				};
				let medianUnit = function(e) {
					if (e.length == 0) return 1;
					let t = Math.floor(e.length / 3 * 2);
					return e[t].amount < 1 ? 1 : e[t].amount;
				};
				let width = function(e, t) {
					if (t == 0)
						return 1;
					let n = Math.round(Number(e) / t);
					return n <= 0 ? 1 : n > 160 ? 160 : n
				};

				let i = e.concat(t);
				let s = medianUnit(sort(i)) / 48;
				e.forEach((e) => {
					e.width = width(e.amount, s);
				});
				t.forEach(function(t) {
					t.width = width(t.amount, s);
				})
			}
		},
		watch: {
			currentMarket(newValue, oldValue) {
				this.market = newValue;
			},
			market(val, old) {
				this.coin = this.$common.getCoin(this.market);
				let pair = this.market.split('_')[0] + '/' + this.market.split('_')[1];
				uni.setNavigationBarTitle({
					title: pair,
				});

				if (this.socket) {
					this.socket.send({
						"type": "unsubscibe:market",
						"data": old
					});
					this.socket.send({
						"type": "subscibe:market",
						"data": val
					})
				}
			}
		},
		onHide() {
			//取消订阅，关闭socket
			if (this.socket) {
				this.socket.send({
					"type": "unsubscibe:market",
					"data": this.market
				});
				this.socket.close();
			}
		}
	}
</script>
<style>
	.hasColor{
		color:#f37b1d;
	}
	.qiun-title-bar {
		width: 96%;
		padding: 10upx 2%;
		flex-wrap: nowrap;
	}

	.qiun-title-dot-light {
		border-left: 10upx solid #0ea391;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000
	}

	.qiun-charts {
		width: 750upx;
		height: 800upx;
	}

	.charts {
		width: 750upx;
		height: 800upx;
	}
</style>

<style lang="less" scoped>
	.market_chart {
		background-color: #131f30;

		button.buy_btn {
			background-color: #03ad8f;
			color: #fff;
		}

		button.sell_btn {
			background-color: #d14b64;
			color: #fff;
		}

		// 
		// 		.text-green {
		// 			color: #03ad8f;
		// 		}
		// 
		// 		.text-red {
		// 			color: #d14b64;
		// 		}

		.chart_main {
			padding-bottom: 160upx;

			.k_line {
				// height: 800upx;
				background-color: #131e30;
				border-bottom: 10px solid #071724;

				#trade_main {
					width: 100%;
					height: 800upx;
				}
			}

			.trade_container {
				min-height: 400upx;
				background-color: #131e30;

				.k_depth {
					height: 400upx;
				}

				.order_history {
					.orderList {
						padding: 10upx 0;
						color: #cfd3e9;
					}
				}
			}

			.depthSellBg {
				background: linear-gradient(rgba(250, 82, 82, .1), rgba(250, 82, 82, .1)) no-repeat;
				background-position: 0;
				background-size: 0% 100%
			}

			.depthBuyBg {
				background: linear-gradient(rgba(18, 184, 134, .1), rgba(18, 184, 134, .1)) no-repeat;
				background-position: 100%;
				background-size: 0% 100%
			}

		}

		.footer {
			background-color: #172941;
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 150upx;
			overflow: hidden;
		}
	}
</style>
