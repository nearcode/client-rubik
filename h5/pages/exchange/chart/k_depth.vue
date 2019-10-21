<template>
	<view>
		<div id="k_depthMain" style="height: 400upx;" ref="k_depthMain"></div>
		<!-- <web-view id="kdepth" src="/hybrid/html/ceshi.html"></web-view> -->
	</view>
</template>

<script>
	import echarts from '@/components/echarts/echarts.min.js';
	var wv; //计划创建的webview

	export default {
		props: ['depthList'],
		data() {
			var language = 'zh';
			return {
				depthChart: null,
			}
		},

		onShow() {
			this.$nextTick(() => {
				this.initChart();
			});
			// this.initChart();
		},
		mounted() {
			// this.$nextTick(() => {
			// this.initChart();
			// });
		},

		onReady() {
			// // #ifdef APP-PLUS
			// var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			// console.log(currentWebview)
			// setTimeout(function() {
			// 	wv = currentWebview.children()[0]
			// 	wv.setStyle({
			// 		top: 150,
			// 		height: 300
			// 	})
			// }, 1000); //如果是页面初始化调用时，需要延时一下
			// // #endif
		}
	,
	watch: {
			depthList(val) {
				this.initChart();
			}
		},
		methods: {
			async initChart() {
				var datas = this.depthList;

				var asks = [], //卖
					bids = [], //买
					priceList = [],
					amountList = [];

				datas.bids = datas.bids.reverse();

				let priceNum = 'price',
					amountNum = 'amount';

				for (let item of datas.bids) {
					bids.push(item[amountNum]);
					priceList.push(item[priceNum]);

					asks.unshift(null);

					amountList.push(item[amountNum]);
				}
				for (let item of datas.asks) {
					asks.push(item[amountNum]);

					priceList.push(item[priceNum]);

					bids.push(null);

					amountList.push(item[amountNum]);
				}

				if (priceList.length % 2 == 0) {
					// priceList.pop();
					// bids.pop();
					// asks.shift();
				};


				// console.log(bids, asks)
				// console.log(amountList)
				// console.log(priceList)
				// asks.reverse()
				// dataList =  asks.reverse().concat(bids);

				this.depthChart = echarts.init(document.getElementById('k_depthMain'));
				var option = {
					grid: {
						left: 0,
						top: 50,
						right: 0,
						bottom: 30
					},
					tooltip: {
						// show: true,
						// confine: true, //是否跟随鼠标
						trigger: 'axis',
						axisPointer: {
							type: 'line',
							lineStyle: {
								color: 'rgba(0, 0, 0, 0)'
							}
						},
						backgroundColor: '#355475',
						textStyle: {
							color: '#fff',
							fontSize: '14px'
						},
						extraCssText: 'box-shadow: 0 0 16px 0 rgba(0, 0, 0, .2);border-radius: 4px;',
						position: function(point, params, dom, rect, size) {
							var pos = point[0];
							// 当到最右边时候tip框显示在左边
							if (pos > size.viewSize[0] / 2) {
								pos = pos - size.contentSize[0];
							}
							return [pos, '16%'];
						},
						formatter: function(params, ticket, callback) {
							console.log(params)
							var res = null;
							for (var i = 0, l = params.length; i < l; i++) {
								if (params[i].value) {
									res = '委托价\n' + params[i].value + '\n';
									res += '累计\n' + params[i].axisValue;
								}
							}
							return res;
						}
					},
					legend: {
						icon: 'rect',
						// data: [{
						// 		name: '买单',
						// 		icon: 'rect'
						// 	},
						// 	{
						// 		name: '卖单',
						// 		icon: 'rect'
						// 	}
						// ],
						// selected: {
						// 	'买单': true,
						// 	'卖单': true
						// },
						itemWidth: 10,
						itemHeight: 10,
						textStyle: {
							color: 'while'
						},
						pageIconColor: '#4CC453'
					},
					xAxis: {
						type: 'category',
						axisLine: { //坐标轴线
							show: true,
							lineStyle: {
								color: '#293749'
							}
						},
						axisTick: { //刻度设置
							show: false,
							lineStyle: {
								color: '#87a2cd'
							}
						},
						// axisLabel: {
						// 	show: false
						// },
						// axisLabel: {
						// 	interval: 5,
						// },
						boundaryGap: false,
						data: priceList
					},
					yAxis: [{
						type: 'value',
						// splitNumber:3,
						// splitLine: {
						// 	show: true,
						// 	lineStyle: {
						// 		color: '#9ca9b5'
						// 	}
						// },
						// axisLine: {
						// 	show: true,
						// 	lineStyle: {
						// 		color: '#9ca9b5'
						// 	},
						// },

						// 	formatter: ('{value} ')
						// },
						position: 'right',
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							inside: true,
							verticalAlign: "middle",
							textStyle: {
								color: '#293749'
							}
						},
						// max: function(value) { //设置y轴最大值
						// 	return value.max + 30;
						// }
					}],
					series: [{
							name: '买单',
							type: 'line',
							stack: '买单',
							smooth: 0, //设置k线平滑度
							symbol: 'circle',
							showSymbol: false,
							symbolSize: 3,
							sampling: 'average',
							itemStyle: {
								normal: {
									color: '#03c086'
								}
							},
							// step: 'middle',
							lineStyle: {
								normal: {
									color: '#03c086'
								}
							},
							areaStyle: {
								color: '#03c086'
							},
							areaStyle: { //区域填充样式
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: 'rgba(3,190,133,1)'
										},
										{
											offset: 0.7,
											color: 'rgba(3,190,133,0.1)'
										}
									], false)
								}
							},
							data: bids,
						},
						{
							name: '卖单',
							type: 'line',
							smooth: 0.1,
							stack: '卖单',
							symbol: 'circle',
							showSymbol: false,
							symbolSize: 3,
							sampling: 'average',
							// step: 'middle',
							itemStyle: {
								normal: {
									color: '#e94c4c'
								}
							},

							lineStyle: {
								normal: {
									color: '#e94c4c'
								}
							},
							areaStyle: {
								color: '#392332'
							},
							areaStyle: { //区域填充样式
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0.7,
											color: 'rgba(239,35,42,0.1)'
										},
										{
											offset: 0,
											color: 'rgba(239,35,42,1)'
										}
									], false)
								}
							},
							data: asks,
						}
					]

				};

				this.depthChart.setOption(option);
			},
			updateKline(data) {

			},
		}
	}
</script>

<style>
</style>
