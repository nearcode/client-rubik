<template>
	<!-- 历史记录 -->
	<view class="history page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back" @history="history"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">


			<view class="head-title ex-text text-xxl">
				<text class='text-bold font-col'>历史记录</text>
			</view>
			<view class="historyContent">
				<view class="historyList" v-if="history && history.length">
					<view class="historyOne" v-for="(item,index) of history" :key="index">
						<view class="oneHead text-bold text-lg font-color">{{item.type==1 ? '普通充币':(item.method == 1?'普通转账':'普通提币')}}</view>
						<view class="oneMid">
							<text class="midLeft text-gray">数量</text>
							<text class="midMid text-gray">状态</text>
							<text class="midRight text-gray">时间</text>
							<text class="empty"></text>
						</view>
						<view class="oneMid oneFoot font-color">
							<text class="midLeft text-lg">{{item.amount|autoFixed}}</text>
							<text class="midMid text-lg">{{status(item.result)}}</text>
							<text class="midRight text-lg">{{item.create | formatTime('hh:mm MM/dd')}}</text>
							<text class="empty1 text-bold">…</text>
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
	</view>
</template>

<script>
	// status 1 成功 2 取消 3 失败 -1待审核 0处理中
	import base from '@/api/base.js';

	export default {
		data() {
			return {
				history: [],
				coin: '',
				count: 0, //总页数
				pagesize: 0,
				limit: 8,
				p: 1,
				loadMoreText: "加载中...",
				showLoadMore: false,
				type: '',
			}
		},
		components: {

		},
		computed: {

		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			if (index === 0) {
				uni.navigateBack({
					delta: 1,
				})
			}
		},
		onLoad(options) {
			this.coin = options.coin
			this.type = options.type
		},
		async onShow() {
			if (this.p == 1) {
				this.history = uni.getStorageSync(`${this.coin}_transfer_history`) || [];
				this.history = await this.getHistory()
				uni.setStorageSync(`${this.coin}_transfer_history`, this.history); //缓存第一页数据
			}
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
			status(status) {
				switch (status) {
					case -1:
						return '待审核';
					case 0:
						return '处理中';
					case 1:
						return '成功';
					case 2:
						return '取消';
					case 3:
						return '失败';
					default:
						break;
				}
			},

		},

	}
</script>

<style lang="less" scoped>
	.history {
		width: 100%;
		// height: 100vh;

		.historyContent {
			// width: 94%;
			height: 100%;
			margin: 0 auto;

			.historyText {
				height: 80upx;
			}

			.historyList {
				width: 100%;
				height: auto;

				.historyOne {
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
	}
</style>
