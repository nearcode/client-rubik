<template>
	<view class=" bg-white exchange solid-top">
		<good-nav-bar show="true" bgcolor="#FFFFFF" borderbottom="`true`">
			<block slot="backIcon">
				<text style="font-weight: bold;" class="icon iconfont icon-liebiao text-black" @tap="toSearchCoin('left')"></text>
			</block>
			<block slot="content">
				<text style="font-weight: bold;">{{pair | toString}}</text>
			</block>
			<block slot="rightIcon">
				<text class="icon iconfont icon-shujutongji text-black" @tap="toKline"></text>
			</block>
		</good-nav-bar><!-- 自定义导航 -->
		<view class="flex align-start trade padding-top-xs">
			<!-- 买卖 -->
			<view class="basis-lg padding-xs margin-xs radius">
				<!-- 买卖切换 -->
				<view class="flex">
					<view class="flex flex-direction flex-sub radius-xs justify-around">
						<button class="cu-btn buy" :class="[tradeActive=='buy'?'back-green':'fonts-color']" @click="tradeTab('buy')">买入</button>
					</view>
					<view class="flex flex-direction flex-sub radius-xs justify-around">
						<button class="cu-btn sell" :class="[tradeActive=='sell'?'bg-red':'fonts-color']" @click="tradeTab('sell')">卖出</button>
					</view>
				</view>
				<view class="trade_form">
					<form>
						<!-- 价格 -->
						<view class="margin-top-sm">
							<input type="number" class="price_input padding-left-sm margin-bottom-xs text-bold text-df font-color" v-model="tradeForm.price"
							 placeholder="价格" placeholder-class="inpl-grey"></input>
							<text class="text-xs font-grey">≈ {{$common.toCNY(pair,tradeForm.price ||0)}} CNY</text>
						</view>
						<!-- 数量-->
						<view class="margin-top-sm">
							<input type="number" class="amount_input padding-left-sm margin-bottom-xs text-bold text-df font-color" v-model="tradeForm.amount"
							 placeholder="数量" placeholder-class="inpl-grey"></input>
							<text class="text-xs font-grey">
								<text v-if="tradeActive==='buy'">可用：{{$tools.util.toFixed(buyBalance?buyBalance:0)}} {{baseCoin}}</text>
								<text v-if="tradeActive=='sell'">可用：{{$tools.util.toFixed(sellBalance?sellBalance:0)}} {{coin}}</text></text>
						</view>
						<!-- 滑动 -->
						<view class="block cf margin-top-xs margin-bottom">
							<!-- {{progressVal}} -->
							<slider value="0" block-size="20" v-model="progressVal" @change="rangeSell" step="5" activeColor="#03C086"
							 backgroundColor="#e54d42" />
							<!-- <slider value="0" block-size="20" v-model="tradeForm.progress" @change="rangeSell" step="5" /> -->
						</view>
						<!-- 交易额 -->
						<view class="margin-top-lg">
							<text class="text-df text-bold" style="color:#ADBAC4">交易额{{getTotal}}</text>
						</view>
						<!-- 买卖按钮 -->
						<view class="flex flex-direction flex-sub justify-around margin-top-lg">
							<button class="cu-btn" :class="tradeActive=='buy'?'back-green':'bg-red'" @click="trade">
								{{tradeActive=='buy'?'买入':'卖出'}} {{coin}}</button>
						</view>
					</form>
				</view>
			</view>
			<!-- 深度 -->
			<view class="depth basis-sm padding-bottom-xs padding-top-sm margin-left-lg">
				<view class="grid col-2 margin-bottom-xs text-gray">
					<view class="text-sm">价格</view>
					<view class="text-sm">数量</view>
				</view>
				<!-- 卖深度 -->
				<view class="depth_asks">
					<view class="grid col-2  depthSellBg " :key="k" :style="{'background-size':v.width ? v.width+'% 100%':'0% 0%'}"
					 v-for="(v,k) in depthList.asks" @click="toValue(v.price,v.amount)">
						<view class="text-xs text-red">{{v.price}}</view>
						<view class="text-xs text-gray">{{v.amount}}</view>
					</view>
				</view>
				<!-- 最新价 -->
				<view class="padding-xs depth_lastPrice">
					<text class="text-sm text-bold" :class="tickers[pair]&&tickers[pair].change>=0?'text-green':'text-red'">{{tickers[pair]?tickers[pair].last:0}}</text>
					<text class="text-xs margin-left-xs" :class="tickers[pair]&&tickers[pair].change>=0?'text-green':'text-red'">{{(tickers[pair]?tickers[pair].change:0)}}%</text>
					<text class="text-xs block text-gray">≈ ￥{{$common.toCNY(pair,tickers[pair]?tickers[pair].last:0)}}</text>
				</view>
				<!-- 买深度 -->
				<view class="depth_bids">
					<view class="grid col-2 depthBuyBg" :key="k" :style="{'background-size':v.width ? v.width+'% 100%':'0% 0%'}" v-for="(v,k) in depthList.bids"
					 @click="toValue(v.price,v.amount)">
						<view class="text-xs font-green">{{v.price}}</view>
						<view class="text-xs text-gray">{{v.amount}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 委托记录 -->
		<view class="cu-bar solid-bottom padding-sm text-bold font-color text-lg">当前委托</view>
		<view class="padding-xs order_history text-center">
			<view class="" v-if="myOrders.length>0">
				<view class=" text-gray flex padding-top-sm padding-bottom-sm text-bold">
					<view class="text-xs flex-sub">时间</view>
					<view class="text-xs flex-sub">方向</view>
					<view class="text-xs flex-sub">价格</view>
					<view class="text-xs flex-sub">数量</view>
					<view class="text-xs flex-sub">成交量</view>
					<view class="text-xs flex-sub">操作</view>
				</view>

				<view class=" text-gray flex align-center padding-top-xs padding-bottom-xs" v-for="(v,k) in myOrders" :key="k">
					<view class="text-xs flex-sub">{{v.create | formatTime('hh:mm:ss')}}</view>
					<view class="text-xs flex-sub">
						<text class="text-green" v-if="v.type===1">买入</text>
						<text class="text-red" v-else>卖出</text>
					</view>
					<view class="text-xs flex-sub">
						{{v.price}}
					</view>
					<view class="text-xs flex-sub">{{v.amount}}</view>
					<view class="text-xs flex-sub">
						{{$common.autoFixed(v.price*v.amount)}}
					</view>
					<view class="text-xs flex-sub">
						<text class="text-xs text-red" @click="cancelOrder(v.id)">取消</text>
					</view>
				</view>
			</view>

			<view v-else class="nodatas flex flex-direction justify-center align-center">
				<text class="lg text-gray icon-form " style="color:#c6cfd6"></text>
				<view class="text-df text-center text-black" style="color:#c6cfd6">没有相关记录</view>
			</view>

		</view>
		<!-- <uni-drawer :visible="showTickers" mode="showTickers" @close="closeDrawer('showTickers')">
			<tickers-list :tickers="tickers" :pair="pair" v-show="showTickers" @showTickers="onTickers"></tickers-list>
		</uni-drawer> -->

		<neil-modal :auto-close="false" :show="tradeConfirm.show" @close="closeModal()" :title="tradeConfirm.title" @cancel="bindBtn('cancel')"
		 @confirm="bindBtn('confirm')">
			<view class="padding-sm text-sm" v-if="tradeConfirm.data.market">
				<view>{{tradeConfirm.title}}价格：{{tradeConfirm.data.price}} {{$common.getBaseCoin(tradeConfirm.data.market) }}</view>
				<view>{{tradeConfirm.title}}数量：{{tradeConfirm.data.amount}} {{$common.getCoin(tradeConfirm.data.market)}}</view>
				<view> {{tradeConfirm.title}}资金：{{$common.autoFixed(tradeConfirm.data.price * tradeConfirm.data.amount)}}
					{{$common.getBaseCoin(tradeConfirm.data.market)}}</view>
				<view>手续费：{{tradeConfirm.fee}} {{tradeConfirm.pair}}</view>
				<view class="text-red text-sm">警告：当前为 {{$common.getBaseCoin(tradeConfirm.data.market)}}交易对，挂错价格，成功后将无法取消。</view>

			</view>
		</neil-modal>

		<view class="sidebars">
			<uni-drawer :visible="showLeft" mode="left" @close="closeDrawer('left')">
				<scroll-view style="height:100vh" scroll-y="true">
					<sidebar :currentMarket="pair"></sidebar>
				</scroll-view>
			</uni-drawer>
		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	// import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	//import tickersList from './searchCoin.vue'
	import baseApi from '@/api/base'
	import config from '@/config'
	import exchangeApi from '@/api/exchange'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import {
		mapState
	} from 'vuex'

	import sockets from '@/api/socket.js';

	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
	import Sidebar from '@/pages/exchange/searchCoin';


	export default {
		components: {
			uniDrawer,
			Sidebar,
			neilModal
		},
		data() {
			return {
				price: {},
				showTickers: false,
				tradeActive: 'buy',
				tradeForm: {
					'price': '',
					'amount': '',
					'progress': '',
				}, //交易表单
				pair: '',
				isConnect: false,
				balances: {}, //余额
				websock: null,
				coin: null,
				baseCoin: null,
				socket: null,
				myOrders: [], //获取用户挂单
				depthList: {
					asks: [],
					bids: []
				},
				tradeConfirm: {
					show: false,
					content: '',
					data: {}
				}, //控制交易确定框
				tickers: {}, //tickers
				currentMarket: '',
				showLeft: false,
				errortype: '',
				apiError: '',
				succmsg: '',
			}
		},
		computed: {
			...mapState(['markets', 'isLogin']),
			errormsg: function() {
				if (this.apiErrorValue) {
					return this.apiErrorValue;
				} else {
					return '';
				}
			},
			apiErrorValue:function(){//即时弹出
				if(this.apiError){
					this.errortype = 'top';
					return this.apiError;
				}else{
					return '';
				}
			},
			succmsgValue:function(){//即时弹出
				if(this.succmsg){
					this.errortype = 'top';
					return this.succmsg;
				}else{
					return '';
				}
			},
			getTotal() {
				let total = this.$tools.util.toFixed(this.tradeForm.price * this.tradeForm.amount, 8);
				if (isNaN(total)) total = 0;
				return total;
			},
			// 计算可用余额
			buyBalance() {
				if (!this.pair) return;
				let coins = this.$common.getBaseCoin(this.pair),
					balance = this.balances[coins] ? this.balances[coins].available : 0; //币种数量
				return balance || 0;
			},
			sellBalance() {
				if (!this.pair) return;
				let coins = this.$common.getCoin(this.pair),
					balance = this.balances[coins] ? this.balances[coins].available : 0; //币种数量
				return balance || 0;
			},
			progressVal() {
				// console.log(this.buyBalance);
				let pro;
				if (this.tradeActive === 'buy') {
					pro = (this.tradeForm.amount * this.tradeForm.price / this.buyBalance) * 100;
				} else {
					pro = (this.tradeForm.amount / this.sellBalance) * 100;
				}
				if (pro > 100) pro = 100;
				if (pro == NaN) pro = 0;
				return pro;
			}
		},
		onLoad() {

		},
		onShow() {
			this.$store.commit("getMarkets");
			//获取交易对
			this.pair = uni.getStorageSync("currentMarket") || '';
			console.log('pair', this.pair);
			//页面跳转触发买卖页面切换
			this.tradeActive = uni.getStorageSync('exchange_type') || 'buy';
			uni.removeStorageSync('exchange_type');

			this.clearData();
			var that = this
			//从本地数据创建深度曲线
			this.depthList = uni.getStorageSync("depthList" + this.pair) || {
				asks: [],
				bids: []
			};
			this.creatDepthList(this.depthList);
			//链接socket，获取余额，tikers，我的挂单，深度等数据
			this.socketInit();
		},
		//控制头部按钮
		onNavigationBarButtonTap(e) {
			console.log(e)
			if (e.idx == 'kline') {
				uni.navigateTo({
					url: "chart/chart"
				})
			} else if (e.idx == 'tickers') {
				//this.showTickers = true;
				uni.navigateTo({
					url: "/pages/market/searchCoin?fromUrl=exchange"
				})
			}
		},
		methods: {
			hideMsg(type){
				this.errortype = type;
			},
			toSearchCoin(e) {
				if (e === 'left') {
					this.showLeft = !this.showLeft;
				}
			},
			toKline() {
				uni.navigateTo({
					url: "chart/chart"
				})
			},
			//清空数据
			clearData() {
				this.tradeForm.price = '';
				this.tradeForm.amount = '';
			},
			//链接soket
			socketInit() {
				this.socket = new sockets.WebSocket(config.socketUrl, (e) => {
					this.socket.send({
						"type": "subscibe:market",
						"data": this.pair
					})
				}, (e) => {
					let res = this.$tools.util.toJson(e.data);
					switch (res.type) {
						//余额
						case 'market:balances':
							this.balances = res.data;
							break;
							//tickers
						case 'market:tickers':
							this.tickers = res.data;
							let tickers = res.data;
							let tickerList = [];
							for (let item in tickers) {
								tickers[item]['market'] = item;
								tickers[item]['change'] = this.$tools.util.toFixed(tickers[item]['change'], 2);
								tickerList.push(tickers[item])
							}
							uni.setStorageSync("tickers", tickerList || []);
							break;
							//ticker:update
						case 'market:ticker:update':
							break;
							//深度数据
						case 'market:depth':
							this.creatDepthList(res.data);
							uni.setStorageSync("depthList" + this.pair, res.data || {
								asks: [],
								bids: []
							});
							break;

							//最新成交
						case 'market:orderHistory':

							break;
							//最新成交更新单条
						case 'market:history:add':

							break;
							//我的挂单
						case 'market:myOrders':
							this.myOrders = res.data || [];
							break;
							//我的成交记录
						case 'market:myOrderHistory':
							break;
					}
				})
			},
			NavigationButtonTap(type) {
				if (type == 'kline') {
					uni.navigateTo({
						url: "chart/chart"
					})
				} else if (type == 'menu') {
					this.showTickers = true;
				}
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
					let listNumber = 5;
					// console.log(dataArr)
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
				if (this.depthList['asks']) {
					this.depthList['asks'].reverse();
				}

				this.tt(this.depthList.asks, this.depthList.bids);
			},
			// 切换买卖按钮
			tradeTab(type) {
				this.tradeActive = type;
			},
			// 取消挂单
			async cancelOrder(id) {
				this.apiError = ''; //重置
				this.succmsg = ''; //重置
				if (this.errormsg) { //如果报错
					this.errortype = 'top'
					return false;
				}
				try {
					let result = await exchangeApi.cancel(id);
					this.marketMyOrders();
					this.getBalances(); //取消之后获取余额
					this.succmsg = '取消成功';
				} catch (e) {
					if (!e) {
						this.apiError = this._consts.networkFail;
						return;
					}
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
			// // 获取用户挂单
			async marketMyOrders() {
				// this.ordersLoading = true;
				let data = {
					market: this.pair
				};
				try {
					let result = await exchangeApi.getMyOrders(data);
					console.log(result)
					// this.ordersLoading = false;
					this.myOrders = result.data || [];
				} catch (e) {

				}
			},
			//买卖
			trade() {
				// 操作前，若未登录跳转去登录
				if (!this.isLogin()) {
					return uni.navigateTo({
						url: '/pages/login/login'
					})
				}
				let type = this.tradeActive;


				if (!this.tradeForm.price || !this.tradeForm.amount) return;

				//提交的数据
				let data = {
					market: this.pair,
					price: this.tradeForm.price,
					amount: this.tradeForm.amount
				};
				// 读取手续费
				for (let item of this.markets) {
					let base = this.$common.getBaseCoin(this.pair);
					let coin = this.$common.getCoin(this.pair);
					if (item.coin == coin && item.base == base) {
						data.fee = item.fee || '';
					}
				}

				let Tips = '',
					num = 1,
					fee = '',
					pair = '';
				if (type == 'buy') {
					Tips = '买入';
					num = 1;
					fee = data.amount * data.fee;
					pair = this.$common.getCoin(data.market);
				} else {
					num = -1;
					Tips = '卖出';
					fee = (data.price * data.amount) * data.fee;
					pair = this.$common.getBaseCoin(data.market);
				}
				data.type = num;

				let confirmHtml = "";
				// 	`<view>${Tips}价格：${data.price} ${this.$common.getBaseCoin(data.market)}</view><br/>
				//                 <view>${Tips}数量：${data.amount} ${this.$common.getCoin(data.market)}</view><br/>
				// 	<view> ${Tips}资金：${this.$common.autoFixed(data.price * data.amount)} ${this.$common.getBaseCoin(data.market)}</view><br/>
				//                 <view>手续费：${fee} ${pair}</view><br/>
				//                 <view class="text-red text-sm">警告：当前为 ${this.$common.getBaseCoin(data.market)}交易对，挂错价格，成功后将无法取消。</view>`;

				this.tradeConfirm.show = true;
				this.tradeConfirm.pair = pair;
				this.tradeConfirm.fee = fee;
				this.tradeConfirm.content = confirmHtml;
				this.tradeConfirm.title = Tips;
				this.tradeConfirm.data = data;
			},

			bindBtn(type) {
				if (type === 'confirm') {
					this.trades();
				}
			},
			// 确定买卖
			async trades() {
				this.apiError = '';//重置
				this.succmsg = '';//重置
				if (this.errormsg) { //如果报错
				    this.errortype = 'top'
					return false;
				}
				try {
					let result = await exchangeApi.order(this.tradeConfirm.data);
					// 提交之后刷新余额
					this.getBalances();
					this.succmsg = '提交成功';
					this.$set(this.tradeConfirm, 'show', false)
					this.marketMyOrders();
				} catch (e) {
					if (!e) {
						this.apiError = this._consts.networkFail;
						return false;
					}
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
			// 关闭买卖确定框
			closeModal(type) {
				this.tradeConfirm.show = false;
			},
			// 币种菜单关闭回调
			// 获取币余额
			async getBalances() {
				try {
					let result = await baseApi.getBalances();
					this.balances = result.data;
				} catch (e) {

				}
			},
			// 点击传值
			toValue(price, amount) {
				if (price == '--') price = 0;
				if (amount == '--') amount = 0;

				this.$set(this.tradeForm, 'price', this.$common.toNumber(price));
				this.$set(this.tradeForm, 'amount', this.$common.toNumber(amount));
			},
			// 滑块
			rangeSell(e) {
				//余额为0，不可用

				console.log(typeof e)

				let progressVal = e.detail.value;
				// console.log('value 发生变化：' + e.detail.value)
				if (this.tradeActive === 'buy') {
					console.log('tradeForm.price', this.tradeForm.price)
					if (!this.tradeForm.price) return this.$set(this.tradeForm, 'amount', 0);
					console.log((((this.buyBalance * progressVal) / 100) / this.tradeForm.price))
					this.$set(this.tradeForm, 'amount', this.$tools.util.toFixed(this.$tools.util.toFixed(this.buyBalance *
						progressVal / 100, 8) / this.tradeForm.price, 8));
				} else {
					this.$set(this.tradeForm, 'amount', this.$tools.util.toFixed(this.sellBalance * progressVal / 100, 8))
				}
			},
			closeDrawer(mode) {
				this.showTickers = false;
				this.showLeft = false;
			},
			// 根据子组件传递的参数控制抽屉的显示隐藏
			onTickers(data) {
				this.showTickers = data;
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
				console.log('pair', newValue);
				this.pair = this.currentMarket;
			},
			pair(val, old) {
				console.log('111')
				console.log('pair', this.pair);

				if (!this.pair) return;
				// 1动态更改头部标题
				let pair = this.pair.split('_')[0] + '/' + this.pair.split('_')[1];
				uni.setNavigationBarTitle({
					title: pair,
				});
				// 2截取当前交易对
				this.coin = this.$common.getCoin(this.pair);
				this.baseCoin = this.$common.getBaseCoin(this.pair);
				// 3创建深度列表
				let depthList = uni.getStorageSync("depthList" + this.pair) || {
					asks: [],
					bids: []
				};
				this.creatDepthList(depthList);
				// 4发送socket
				if (this.socket) {
					this.socket.send({ //取消订阅旧的交易对
						"type": "unsubscibe:market",
						"data": old
					});

					this.socket.send({ //订阅新的交易对
						"type": "subscibe:market",
						"data": this.pair
					})
				}
			}
		},
		onHide() {
			console.log('关闭连接')
			this.isConnect = false;
			if (this.socket) {
				this.socket.send({
					"type": "unsubscibe:market",
					"data": this.pair
				});
				this.socket.close();
			}
		}
	}
</script>

<style lang="less" scoped>
	uni-slider {
		margin-left: 15upx;
		/deep/ .uni-slider-handle-wrapper {
			height: 20upx;
		}
	}

	.fonts-color {
		color: #8C9FAD;
	}

	.exchange {
		button.buy_btn {
			background-color: #03ad8f;
			color: #fff;
		}

		button.sell_btn {
			background-color: #d14b64;
			color: #fff;
		}

		// 		.text-green {
		// 			color: #03ad8f;
		// 		}
		// 
		// 		.text-red {
		// 			color: #d14b64;
		// 		}
		// 
		.navig_head {
			display: block;
			height: 80upx;

			// height: calc(var(--status-bar-height) + 80upx);
			.navigation {
				position: fixed;
				left: 0;
				width: 100%;
				height: 80upx;
				// padding: 7px 3px;
				overflow: hidden;
				z-index: 998;
				color: #1f3f59;
				background-color: #fff;
				transition-property: all;

				.page_head {
					font-size: 35upx;
					overflow: hidden;
					height: 80upx;
					line-height: 80upx;
				}
			}

		}

		.trade {
			border-bottom: 10px solid #f7f7fb;

			button {
				position: relative;
				font-weight: bold;
				font-size: 26upx;
				border-radius: 3px;

				// overflow: hidden;
			}

			.buy::before {
				content: "";
				position: absolute;
				right: -20upx;
				top: 0;
				background: #fff;
				width: 40upx;
				height: 105%;
				transform: skew(-27deg, 0deg);
				-moz-transform: skew(-27deg, 0deg);
				-webkit-transform: skew(-27deg, 0deg);
			}

			.sell::before {
				content: "";
				position: absolute;
				left: -20upx;
				top: -3upx;
				background: #fff;
				width: 40upx;
				height: 105%;
				transform: skew(-27deg, 0deg);
				-moz-transform: skew(-27deg, 0deg);
				-webkit-transform: skew(-27deg, 0deg);
			}

			.trade_form {

				.price_input,
				.amount_input {
					height: 72.91upx;
					line-height: 72.91upx;
					// border: 1upx solid rgba(0, 0, 0, 0.1);
					border-radius: 5.2upx;
					border: 1.04upx solid #8C9FAD;
				}
			}
		}

		.depth {
			.depth_lastPrice {}

			.depth_asks,
			.depth_bids {
				height: 240upx;
				overflow: hidden;
			}

			.depth_bids {
				.depthBuyBg {
					// height: 48upx;
					// line-height: 48upx;
					height: 34upx;
					line-height: 34upx;
					background: linear-gradient(#f0faf9, #f0faf9) no-repeat;
					background-position: 100%;
					background-size: 0% 100%;

					text {
						height: 45.83upx;
						line-height: 45.83upx;
					}
				}
			}

			.depth_asks {
				.depthSellBg {
					// height: 48upx;
					// line-height: 48upx;
					height: 34upx;
					line-height: 34upx;
					background: linear-gradient(#fdf5f6, #fdf5f6) no-repeat;
					background-position: 100%;
					background-size: 0% 100%;

					text {
						height: 45.83upx;
						line-height: 45.83upx;
					}
				}
			}
		}

		.order_history {
			min-height: 600upx;
		}
	}
</style>
