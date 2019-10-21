<template>
	<view class="market_chart ">
		<view class="chart_main">
			<!-- tickers -->
			<view class="flex padding-top-lg">
				<!-- 最新价 -->
				<view class="basis-lg padding-left-sm">
					<text class=" text-bold text-xxl" :class="(tickers[market]?tickers[market].change:0) >=0?'text-green':'text-red'">{{tickers[market]?tickers[market].last:0 | autoFixed}}</text>
					<view class="">

						<text class="text-sm text-gray">≈￥{{$common.toCNY(coin,tickers[market]?tickers[market].last:0)}}</text>
						<text class="text-sm padding-left-xs" :class="(tickers[market]?tickers[market].change:0) >=0?'text-green':'text-red'">{{(tickers[market]?tickers[market].change:0).toFixed(2)}}%</text>
					</view>
				</view>
				<!-- 价格 -->
				<view class="basis-sm padding-right-sm text-xs">
					<view class="cf">
						<text class="text-gray fl">高</text>
						<text class="text-white fr">{{$common.autoFixed(tickers[market]?tickers[market].hight:0)}}</text>
					</view>
					<view class="cf">
						<text class="text-gray fl">低</text>
						<text class="text-white fr">{{$common.autoFixed(tickers[market]?tickers[market].hight:0)}}</text>
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
					 :key="k" @click="tabTimeNav(v.resolution)">
						{{v.title}}
					</view>
				</scroll-view>
			</view>
			<!-- k线 -->
			<view class="k_line">
				<div id="trade_main" class="candle-container" ref="trade_main"></div>
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
					<view class="k_depth" v-show="TabCur=='depth'">
						<depth-chart :depthList="depthListData"></depth-chart>

					</view>
					<!-- 成交 -->
					<view class="order_history cf padding" v-show="TabCur=='order'">
						<view class="grid col-4 margin-bottom-xs text-gray">
							<view class="text-sm">时间</view>
							<view class="text-sm text-center">方向</view>
							<view class="text-sm text-center">价格</view>
							<view class="text-sm text-right">数量</view>
						</view>
						<view class="grid col-4 orderList" v-for="(v,k) in orderHistory" :key="k">
							<view class="text-xs">{{$common.toTimeStr(v.create)}}</view>
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
	import {
		mapState
	} from 'vuex'

	// var echarts = require("@/components/echarts/echarts.min.js").echarts;
	export default {
		data() {
			var language = 'zh';
			return {
				tabSelectEd: '60',
				TabCur: 'depth',
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
						chartType: 1
					}, {
						title: "en" == language ? "1week" : "周线",
						resolution: "1W",
						chartType: 1
					}
				],
				depthNav: [{
						title: '深度',
						index: 'depth'
					},
					{
						title: '成交',
						index: 'order'
					},
					{
						title: '简介',
						index: 'intro'
					},
				]
			}
		},
		components: {
			depthChart,
			vIntro
		},
		props: ['currentMarket'],
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
						data: JSON.stringify({
							"type": "unsubscibe:market",
							"data": old
						})
					});
					this.socket.send({
						data: JSON.stringify({
							"type": "subscibe:market",
							"data": val
						})
					})
				}
			}
		},
		onShow() {
			this.market = this.currentMarket || uni.getStorageSync("currentMarket");
			this.creatDepthList(this.depthList)
			this.initSocket();
			this.$nextTick(() => {
				this.initChart();
			});
		},
		onHide() {
			if (this.socket) {
				this.socket.send({
					"type": "unsubscibe:market",
					"data": this.market
				});
				this.socket.close();
			}
		},
		mounted() {
			// let v= uni.createSelectorQuery().select('#trade_main').boundingClientRect(function(e){  
			// }).exec()  
			//   console.log(v)  
			// console.log(echarts)

		},
		methods: {
			// 初始化socket
			initSocket() {
				// 创建socket
				let socket = uni.connectSocket({
					url: config.socketUrl,
					header: {
						'content-type': 'application/json'
					},
					method: 'GET',
					success: function(e) {
						//console.log("成功了！");  
					}
				});
				this.socket = socket;
				// 发起请求
				socket.onOpen(() => {
					socket.send({
						data: JSON.stringify({
							"type": "subscibe:market",
							"data": this.market
						})
					})
				})

				socket.onMessage(function(evt) {
					onMessage(evt)
				})

				// 成功后回调
				let onMessage = (data) => {
					data = JSON.parse(data.data);

					switch (data.type) {
						//余额
						case 'market:balances':
							// this.balances = data.data;
							break;
							//tickers
						case 'market:tickers':
							// console.log(data.data)
							this.tickers = data.data;
							break;
							//market:ticker:update
						case 'market:ticker:update':

							break;
							//深度数据
						case 'market:depth':

							this.depthList = data.data;
							this.depthListData = data.data;
							this.creatDepthList(this.depthList)
							// this.tt(this.saleMenu, this.buyMenu);
							// console.log(this.saleMenu)
							break;

							//最新成交
						case 'market:orderHistory':

							this.orderHistory = data.data || [];
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
				};


				// uni.onSocketOpen(function(res) {
				// 	console.log('WebSocket连接已打开！');
				// });
				// uni.onSocketMessage(function(res) {
				// 	console.log('收到服务器内容：' + res.data);
				// });
				// uni.onSocketError(function(res) {
				// 	console.log('WebSocket连接打开失败，请检查！');
				// });
			},
			// 点击跳转到交易
			goExchange(type) {
				// uni.setStorageSync("currentMarket",market);
				uni.reLaunch({
					url: '/pages/exchange/exchange'
				});
			},
			// 初始化k线
			async initChart() {
				// var aa=uni.selectorQuery.selector('#trade_main')
				// if (JSON.stringify(this.$refs.trade_main) == '{}') {
				// 	return;
				// }

				this.chart = echarts.init(this.$refs.trade_main);
				var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074',
					'#546570', '#c4ccd3'
				];
				var labelFont = 'bold 12px Sans-serif';

				function calculateMA(dayCount, data) {
					var result = [];
					for (var i = 0, len = data.length; i < len; i++) {
						if (i < dayCount) {
							result.push('-');
							continue;
						}
						var sum = 0;
						for (var j = 0; j < dayCount; j++) {
							sum += data[i - j][1];
						}
						result.push((sum / dayCount).toFixed(2));
					}
					return result;
				}


				var dates = [];
				var data = [];
				var volumes = [];

				var dataMA5 = calculateMA(5, data);
				var dataMA10 = calculateMA(10, data);
				var dataMA20 = calculateMA(20, data);
				var option = {
					animation: true,
					color: colorList,
					title: {
						show: false,
					},
					legend: {
						show: false,
					},
					dataZoom: [{
						type: 'inside',
						xAxisIndex: [0, 1],
						start: 50,
						end: 100,
						height: 20
					}],
					axisPointer: {
						link: [{
							xAxisIndex: [0, 1]
						}]
					},
					xAxis: [{
						type: 'category',
						data: dates,
						boundaryGap: false,
						axisLine: {
							lineStyle: {
								color: '#293749'
							}
						},
						axisLabel: {
							formatter: function(value) {
								return echarts.format.formatTime('MM-dd', value);
							}
						},
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							show: true
						}
					}, {
						type: 'category',
						gridIndex: 1,
						data: dates,
						scale: true,
						boundaryGap: false,
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#293749'
							}
						},
						splitNumber: 20,
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							type: 'shadow',
							label: {
								show: false
							},
							triggerTooltip: true,
						}
					}],
					yAxis: [{
						scale: true,
						splitNumber: 2,
						axisLine: {
							lineStyle: {
								color: '#293749'
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#293749'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							inside: true,
							formatter: '{value}\n'
						}
					}, {
						scale: true,
						gridIndex: 1,
						splitNumber: 2,
						axisLabel: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						}
					}],
					grid: [{
						left: 0,
						right: 0,
						top: 0,
						height: 260
					}, {
						left: 0,
						right: 0,
						height: 40,
						top: 300
					}],
					graphic: [{
						type: 'group',
						left: 'center',
						top: 70,
						width: 300,
						bounding: 'raw',
						children: [{
							id: 'MA5',
							type: 'text',
							style: {
								fill: colorList[1],
								font: labelFont
							},
							left: 0
						}, {
							id: 'MA10',
							type: 'text',
							style: {
								fill: colorList[2],
								font: labelFont
							},
							left: 'center'
						}, {
							id: 'MA20',
							type: 'text',
							style: {
								fill: colorList[3],
								font: labelFont
							},
							right: 0
						}]
					}],
					series: [{
						name: 'Volume',
						type: 'bar',
						xAxisIndex: 1,
						yAxisIndex: 1,
						itemStyle: {
							normal: {
								color: '#7fbe9e'
							},
							emphasis: {
								color: '#140'
							}
						},
						data: volumes
					}, {
						type: 'candlestick',
						name: 'Kline',
						data: data,
						itemStyle: {
							normal: {
								color: '#ef232a',
								color0: '#14b143',
								borderColor: '#ef232a',
								borderColor0: '#14b143'
							},
							emphasis: {
								color: 'black',
								color0: '#444',
								borderColor: 'black',
								borderColor0: '#444'
							}
						}
					}, {
						name: 'MA5',
						type: 'line',
						data: dataMA5,
						smooth: true,
						showSymbol: false,
						lineStyle: {
							normal: {
								width: 1
							}
						}
					}, {
						name: 'MA10',
						type: 'line',
						data: dataMA10,
						smooth: true,
						showSymbol: false,
						lineStyle: {
							normal: {
								width: 1
							}
						}
					}, {
						name: 'MA20',
						type: 'line',
						data: dataMA20,
						smooth: true,
						showSymbol: false,
						lineStyle: {
							normal: {
								width: 1
							}
						}
					}]
				};
				this.chart.setOption(option);
				this.chart.on('click', function(params) {
					if (params.componentType == 'line') {
						// 控制台打印数据的名称

					}
					console.log(params);
				});

				this.getKLine();
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
			tabTimeNav(time) {
				this.tabSelectEd = time;
				this.getKLine();
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
		}
	}
</script>
<style>
	page {
		background-color: #131f30;
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
				height: 800upx;
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
