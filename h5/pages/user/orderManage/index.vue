<template>
	<view class="page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">


			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text :class="active==0?'active':''" @tap="getActive(0)">全部委托</text>
					<text :class="active==1?'active':''" class="margin-left" @tap="getActive(1)">历史记录</text>
				</view>
			</view>

			<view v-if="active == 0" class="cu-list bg-white padding-bottom">
				<view v-if="myOrders.length">
					<view v-for="(item,index) of myOrders" :key="index">
						<view class="cu-item flex justify-between align-center padding-top">
							<view class="text-bold text-xl">
								<text :class="item.type == 1? 'greens':'reds'" class="margin-right-sm">{{item.type == 1?'买入':'卖出'}}</text>
								<text class="font-col">{{item.market | marketToPair()}}</text>
								<text class="text-sm margin-left-sm">{{item.create | formatTime('yyyy-MM-dd hh:mm:ss')}}</text>
							</view>
							<button class="cu-btn" @tap="cancel(item.id,index)">撤销</button>
						</view>

						<view class="cu-item flex justify-between align-center padding-top padding-bottom">
							<view class="flex flex-direction justify-start">
								<text class="">价格({{item.market | getBaseCoin}})</text>
								<text class="li-h font-col">{{item.price | toFixed(6)}}</text>
							</view>

							<view class="flex flex-direction justify-start">
								<text class="">数量({{item.market | getCoin}})</text>
								<text class="li-h font-col">{{item.amount | toFixed(2)}}</text>
							</view>

							<view class="flex flex-direction justify-start">
								<text class="">实际成交({{item.market | getCoin}})</text>
								<text class="li-h font-col text-right">{{item.total}}</text>
							</view>
						</view>
					</view>
				</view>

				<view v-else class="nodatas flex flex-direction justify-center align-center">
					<text class="lg text-gray icon-form " style="color:#c6cfd6"></text>
					<view class="text-df text-center text-black" style="color:#c6cfd6">没有相关记录</view>
				</view>

				<view class="uni-loadmore text-center padding-top padding-bottom" v-if="showLoadMore">
					<text class="">{{loadMoreText}}</text>
				</view>

			</view>

			<view v-if="active == 1" class="cu-list bg-white padding-left padding-right padding-bottom">

				<view v-if="myOrderHistory.length">
					<view v-for="(item,index) of myOrderHistory" :key="index">

						<view class="cu-item flex justify-between align-center padding-top">
							<view class="text-bold text-xl">
								<text :class="item.type == 0 ?'reds':'greens'  " class="margin-right-sm">{{item.type == 0 ? '自买自卖':'买入'}}</text>
								<text class="font-col">{{item.market | marketToPair()}}</text>
								<text class="text-sm margin-left-sm">{{item.create | formatTime('yyyy-MM-dd hh:mm:ss')}}</text>
							</view>
							<view>
								<text class="">已成交</text>
								<!-- <text class="icon iconfont icon-gengduo"></text> -->
							</view>
						</view>

						<view class="cu-item flex justify-between align-center padding-top padding-bottom">
							<view class="flex flex-direction justify-start">

								<text>成交总额({{item.market | getBaseCoin}})</text>
								<text class="li-h greys">{{item.money}}</text>
							</view>

							<view class="flex flex-direction justify-start">
								<text class="">委托价({{item.market | getBaseCoin}})</text>
								<text class="li-h greys">{{item.price | toFixed(6)}}</text>
								<!-- <text>成交均价({{item.market | getBaseCoin}})</text>
							<text class="li-h greys"></text> -->
							</view>

							<view class="flex flex-direction justify-start">
								<!-- <text class="">委托量({{item.market | getCoin}})</text>
							<text class="li-h greys">{{item.amount | toFixed(2) }}</text> -->
								<text>成交量({{item.market | getCoin}})</text>
								<text class="li-h greys">{{item.amount | toFixed(2) }}</text>
							</view>
						</view>

					</view>
				</view>

				<view v-else class="nodatas flex flex-direction justify-center align-center">
					<text class="lg text-gray icon-form " style="color:#c6cfd6"></text>
					<view class="text-df text-center text-black" style="color:#c6cfd6">没有相关记录</view>
				</view>

				<view class="uni-loadmore text-center padding-top padding-bottom" v-if="showLoadMore">
					<text class="">{{loadMoreText}}</text>
				</view>

			</view>
		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	import exchange from '@/api/exchange.js'

	export default {
		data() {
			return {
				active: 0,
				myOrders: [],
				myOrderHistory: [],
				count: 0, //总页数
				pagesize: 0,
				limit: 5,
				p: 1,
				loadMoreText: "加载中...",
				showLoadMore: false,
				errortype: '',
				apiError: '',
				succmsg: '',
			}
		},
		components: {

		},
		computed: {
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
		},
		onNavigationBarButtonTap(e) {
			uni.navigateBack({
				delta: 1,
			})
		},
		async onShow() {

			if (this.p == 1) {
				//获取全部委托
				this.myOrders = uni.getStorageSync('myOrders') || [];
				this.myOrders = await this.getMyOrders();
				uni.setStorageSync('myOrders', this.myOrders); //缓存第一页数据
				//获取历史记录
				this.myOrderHistory = uni.getStorageSync('myOrderHistory') || [];
				this.myOrderHistory = await this.getMyOrderHistory();
				uni.setStorageSync('myOrderHistory', this.myOrderHistory); //缓存第一页数据
			}

		},
		onReachBottom() {
			if (this.pagesize > this.count) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			// setTimeout(() => {
			if (this.active == 0) {
				this.more();
			} else {
				this.more1();
			}
			// }, 300);
		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			async cancel(id, index) {
				this.apiError = ''; //重置
				this.succmsg = ''; //重置
				try {
					await exchange.cancel(id)
					this.succmsg = '撤销成功!';
					//删掉这条记录
					this.myOrders.splice(index, 1);
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
			async more() {
				this.p++;
				this.pagesize += this.limit;
				let myOrders = await this.getMyOrders();
				console.log('myOrders', myOrders)
				this.myOrders = this.myOrders.concat(myOrders);
				if (myOrders.length < this.limit) {
					this.loadMoreText = "没有更多数据了!"
				}
			},
			async more1() {
				this.p++;
				this.pagesize += this.limit;
				let myOrderHistory = await this.getMyOrderHistory();
				console.log('myOrderHistory', myOrderHistory)
				this.myOrderHistory = this.myOrderHistory.concat(myOrderHistory);
				if (myOrderHistory.length < this.limit) {
					this.loadMoreText = "没有更多数据了!"
				}
			},
			clearData() {
				this.p = 1;
				this.pagesize = 0;
				this.showLoadMore = false;
				this.loadMoreText = "加载中...";
			},
			async getActive(type) {
				this.active = type;
				this.clearData();
				if (type == 0) {
					this.myOrders = await this.getMyOrders();
				} else {
					this.myOrderHistory = await this.getMyOrderHistory();
				}
			},
			async getMyOrders() {
				var data = [];
				try {
					let res = await exchange.getMyOrders({
						limit: this.limit,
						p: this.p
					})
					this.count = res.count
					if (res.data) {
						data = res.data
					}
					return data;
				} catch (e) {
					return data;
				}
			},
			async getMyOrderHistory() {
				var data = [];
				try {
					let res = await exchange.getMyOrderHistory({
						limit: this.limit,
						p: this.p
					})
					this.count = res.count
					if (res.data) {
						data = res.data
					}
					return data;
				} catch (e) {
					return data;
				}
			},
		}
	}
</script>

<style style="less" scoped>
	.cu-bar .action:first-child {
		margin-left: 0upx;
	}

	.font-col {
		color: #1F3F58 !important;
	}

	.active {
		font-size: 40upx;
		color: #1F3F58;
	}

	.action {
		font-weight: 700;
		color: #9FA6AC;
		font-size: 38upx;
	}

	.cu-item {
		color: #8E9EAB;
		font-size: 25upx;
	}

	.reds {
		color: #E56D4A;
	}

	.greys {
		color: #1F3F58;
	}

	.li-h {
		line-height: 78.12upx;
		font-weight: 500;
	}

	.greens {
		color: #03C086;
	}

	.cu-btn {
		color: #1883D5;
		background-color: #F7F6FB !important;
	}
</style>
