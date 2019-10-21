<template>
	<!-- 安全中心 -->
	<view class="lock page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl">释放记录</view>
			<view class="" v-if="history && Object.keys(history).length">
				<!-- <view class="top flex justify-center align-center text-center font-color">
					<text class="flex-sub">时间</text>
					<text class="flex-sub">名称</text>
					<text class="flex-sub">币种</text>
					<text class="flex-sub">数量</text>

				</view>
				<view class="list flex flex-direction justify-center align-center">
					<view v-for="(item,index) of history" :key="index" class="sing flex justify-center align-center text-center margin-bottom-xs">
						<text class="flex-sub">{{item.create | formatTime('MM/dd hh:mm')}}</text>
						<text class="flex-sub">{{item.ruleName}}</text>
						<text class="flex-sub">{{item.coin}}</text>
						<view class="flex-sub flex justify-between align-center">
							<text class="">{{item.amount | toFixed(2)}}</text>
							<text class="text-blue">{{item.memo}}</text>
						</view>
					</view>
				</view> -->
				
				<view class="cu-list menu-avatar">
					<view class="cu-item" v-for="(item,index) of history" :key="index">
						<view class="content">
							<view class="text-grey">{{item.ruleName}}</view>
							<view class="text-gray text-sm">
								{{item.amount | toFixed(8)}} {{item.coin}}
							</view>
						</view>
						<view class="action" style="text-align: right;width: auto;">
							<view class="text-grey text-xs">{{item.create | formatTime('MM/dd hh:mm')}}</view>
							<view v-if="item.memo" class="cu-tag round bg-blue sm">{{item.memo}}</view>
						</view>
					</view>
				</view>
				
			</view>

			<view v-else class="nodatas flex flex-direction justify-center align-center">
				<text class="lg text-gray icon-form" style="color:#c6cfd6"></text>
				<view class="text-df text-center text-black" style="color:#c6cfd6">没有相关记录</view>
			</view>

			<view class="uni-loadmore text-center padding-top padding-bottom" v-if="showLoadMore">
				<text class="">{{loadMoreText}}</text>
			</view>

		</view>
	</view>
</template>

<script>
	import lock from '@/api/lock'
	export default {
		data() {
			return {
				history: [],
				count: 0, //总页数
				pagesize: 0,
				limit: 20,
				p: 1,
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		components: {},
		computed: {

		},
		async onShow() {
			if (this.p == 1) {
				this.history = uni.getStorageSync('unlockHistory') || [];
				this.history = await this.getHistory();
				uni.setStorageSync('unlockHistory', this.history); //缓存第一页数据
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
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			async getHistory() {
				let data = [];
				try {
					let res = await lock.unlockHistory(this.p, this.limit);
					this.count = res.count || 0;
					data = res.data || [];
					return data;
				} catch (e) {
					return data;
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.cu-item{
		border-bottom:0.5px solid #ddd;
	}
	.cu-list.menu-avatar>.cu-item .content{
		left:20upx;
	}
	
	.lock {
		.top {
			text {
				padding: 20upx;
				font-size: 30upx;
			}
		}

		.sing {
			width: 100%;

			text {
				font-size: 25upx;
			}
		}
	}
</style>
