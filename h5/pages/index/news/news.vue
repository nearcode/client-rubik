<template>
	<view class="news page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="newsContent" v-if="isShow">
				<view class="newsTitle text-xl text-bold font-color">{{news.data.title}}</view>

				<view v-if='news.data.cover != ""' class="newsImg margin-bottom-sm">
					<image :src="news.data.cover" mode="widthFix"></image>
				</view>
				<view class="newsText font-color">
					<!-- <rich-text :nodes="news.data.content"></rich-text> -->
					<view class="" v-html="news.data.content">
						{{news.data.content}}
					</view>
				</view>
				<view class="newsTime text-df font-color">{{news.data.create | formatTime('yyyy-MM-dd')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import base from '@/api/base.js';
	export default {
		data() {
			return {
				news: {},
				isShow: false
			}
		},
		async onLoad(options) {
			this.news = await base.showNews(options.id);
			this.isShow = true;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.news {
		width: 100%;

		.newsContent {
			width: 94%;
			height: 100%;
			;
			margin: 0 auto;

			.newsTitle {
				width: 100%;
				height: 100upx;
				text-align: center;
				line-height: 100upx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.newsText {
				width: 100%;
			}

			.newsImg {
				text-align: center;
			}

			.newsTime {
				width: 100%;
				height: 80upx;
				line-height: 80upx;
				;
				text-align: right;
			}

			a {
				word-break: break-all;
			}
		}
	}
</style>
