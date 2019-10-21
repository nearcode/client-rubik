<template>
	<view class="page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="ex-text text-xxl">
				<text class='text-bold font-col'>公告列表</text>
			</view>

			<view class="cu-list">
				<view v-for="(item,index) in newsList" :key="index" class="cu-item font-col text-df flex justify-between align-center solid-bottom"
				 @tap="showContent(item._id)">
					<text class="title text-cut">{{item.title}}</text>
					<text class="time text-sm">{{item.create | formatTime('yyyy/MM/dd hh:mm:ss')}}</text>
				</view>
				<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import base from '@/api/base.js';
	export default {
		data() {
			return {
				newsList: [],
				p: 1, //当前页
				limit: 20, //每页显示条数
				count: 0, //总页数
				pagesize: 0,
				type: '',
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		async onShow() {
			if (this.p == 1) {
				let newsListStorage = uni.getStorageSync('newsList');
				if (!newsListStorage) {
					uni.showLoading({
						title: '加载中...'
					})
				}
				this.newsList = newsListStorage || [];
				this.newsList = await this.getNewsList();
				uni.setStorageSync('newsList', this.newsList); //缓存第一页数据
				if (this.newsList && Object.keys(this.newsList).length) {
					uni.hideLoading();
				}
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			showContent(_id) {
				uni.navigateTo({
					url: '/pages/index/news/news?id=' + _id,
				})
			},
			async more() {
				this.p++;
				this.pagesize += this.limit;
				let newsList = await this.getNewsList();
				console.log('newsList', newsList)
				this.newsList = this.newsList.concat(newsList);
				if (newsList.length < this.limit) {
					this.loadMoreText = "没有更多数据了!"
				}
			},
			async getNewsList() {
				var data = [];
				try {
					let res = await base.getNewsList(
						this.type,
						this.limit,
						this.p
					);
					this.count = res.count
					console.log(res)
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

<style lang="less" scoped>
	.ex-text {
		padding-top: 61.97upx;
		margin-bottom: 57.81upx;
	}

	.cu-item {
		line-height: 83.85upx;
	}

	.title {
		color: #1F3F58;
		width: 65%;
	}

	.time {
		color: #8E9EAB;
	}

	.solid-bottom::after {
		border-bottom: 0.5px solid #CCCCCC !important;
	}
</style>
