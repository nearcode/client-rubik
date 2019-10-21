<template>
	<view class="lock page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl flex justify-between align-center">
				<text>锁仓记录</text>
				<button class="cu-btn bg-blue" @tap="lock">锁仓</button>
			</view>
			<view v-if="lockUserList && Object.keys(lockUserList).length">
				<!-- <view class="top flex justify-center align-center text-center font-color">
					<text class="flex-sub">时间</text>
					<text class="flex-sub">名称</text>
					<text class="flex-sub">币种</text>
					<text class="flex-sub">数量</text>
					<text class="flex-sub">状态</text>
					<text class="flex-sub">操作</text>
				</view>
				<view v-for="(item,index) of lockUserList" :key="index" class="list flex flex-direction justify-center align-center">
					<view class="sing flex justify-center align-center text-center margin-bottom-xs">
						<text class="flex-sub">{{item.create | formatTime('MM/dd hh:mm')}}</text>
						<text class="flex-sub">{{item.ruleName}}</text>
						<text class="flex-sub">{{item.coin}}</text>
						<text class="flex-sub">{{item.amount}}</text>
						<text class="flex-sub" :class="getStatus(item.result).color">{{getStatus(item.result).text}}</text>
						<text class="update flex-sub text-blue" @tap="action(item.ruleId,item.balance)">升级</text>
					</view>
				</view>	 -->
				
				<view class="cu-list menu-avatar">
					<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) of lockUserList" :key="index" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index" @tap="action(item.result,item.ruleId,item.balance)" :data-result="item.result">
						
						<view class="content">
							<view class="text-grey">{{item.ruleName}}</view>
							<view class="text-gray text-lg">
								{{item.amount}} {{item.coin}}
							</view>
						</view>
						<view class="action" style="text-align: right;width: auto;">
							<view class="text-grey text-sm">{{item.create | formatTime('MM/dd hh:mm')}}</view>
							<view :class="getStatus(item.result).bg" class="cu-tag round lg text-white">{{getStatus(item.result).text}}</view>
							
						</view>
						<view v-if="item.result != 1" class="margin-left">
						   <text class="lgIcon lg text-gray text-bold">></text>
						</view>
						<view class="move">
							<view class="bg-red" @tap="action(item.result,item.ruleId,item.balance)">升级</view>
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
</template>

<script>
	import lock from '@/api/lock'
	export default {
		data() {
			return {
				lockUserList:[],
				count: 0, //总页数
				pagesize: 0,
				limit: 20,
				p: 1,
				loadMoreText: "加载中...",
				showLoadMore: false,
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
			}
		},
		components: {

		},
		computed: {

		},
		async onShow() {
			if (this.p == 1) {
				this.lockUserList = uni.getStorageSync('lockUserList') || [];
				this.lockUserList = await this.getLockUserList();
				uni.setStorageSync('lockUserList', this.lockUserList); //缓存第一页数据
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
			// ListTouch触摸开始
			ListTouchStart(e) {
				// console.log(e)
				if(e.currentTarget.dataset.result == '1') return;
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				if(e.currentTarget.dataset.result == '1') return;
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if(e.currentTarget.dataset.result == '1') return;
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			async more() {
				this.p++;
				this.pagesize += this.limit;
				let lockUserList = await this.getLockUserList();
				console.log('lockUserList', lockUserList)
				this.lockUserList = this.lockUserList.concat(lockUserList);
				if (lockUserList.length < this.limit) {
					this.loadMoreText = "没有更多数据了!"
				}
			},
			getStatus(result) {
				switch (result) {
					case 0:
						return {
							'text': '进行中',
							'color': 'text-orange',
							'bg':'bg-orange'
						}
						break;
					case 1:
						return {
							'text': '已完成',
							'color': 'text-green',
							'bg':'bg-green'
						}
						break;
					// case 2:
					// 	return {
					// 		'text': '取消',
					// 		'color': 'text-gray'
					// 	}
					// 	break;
					default:
						return {
							'text': '待定义',
							'color': 'text-red',
							'bg':'bg-red',
						}
						break;
				}
			},
			async action(result,ruleId,balance) {
				if(result == 1) return false;
				if (!ruleId) return false;
				uni.navigateTo({
					url: '/pages/user/lock/updateLock?ruleId=' + ruleId+'&balance='+balance,
				})
			},
			async getLockUserList() {
				let data = [];
				try {
					let res = await lock.lockUserList(this.p,this.limit);
					this.count = res.count || 0;
					data = res.data || []
					return data;
				} catch (e) {
					return data;
					//TODO handle the exception
				}
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			lock() {
				uni.navigateTo({
					url: '/pages/user/lock/addLockUser',
				});
			}
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

		.update {
			text-decoration: underline;
		}
	}
</style>
