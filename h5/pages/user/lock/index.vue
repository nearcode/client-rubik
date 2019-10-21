<template>
	<!-- 安全中心 -->
	<view class="lock page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl">锁仓管理</view>
			<view class="lockList">
				<view class="cu-list menu" @tap="lock">
					<view class="cu-item arrow">
						<view class="content">
							<text class="text-black text-df font-col">锁仓记录</text>
						</view>
					</view>
				</view>
				<view class="cu-list menu" @tap="unlock">
					<view class="cu-item arrow">
						<view class="content">
							<text class="text-black text-df font-col">释放记录</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		components: {

		},
		computed: {

		},
		onShow() {

		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			lock(){
				uni.navigateTo({
					url:'/pages/user/lock/lockUser'
				})
			},
			unlock(){
				uni.navigateTo({
					url:'/pages/user/lock/unlock'
				})
			}

		}
	}
</script>

<style lang="less" scoped>
	.lock {
		width: 100%;

		.safetyText {
			width: 94%;
			height: 80upx;
			line-height: 80upx;
			margin: 0 auto;
		}

		.lockList {
			width: 100%;

			.cu-list {
				width: 96%;
				margin: 0 auto;
				border-bottom: 1px solid #eee;
			}

			.textRight {
				display: block;
				float: right;
			}

			.content {
				line-height: 80upx;
			}

			.arrow {
				padding-right: 66upx;
			}
		}

		.cu-item {
			padding: 0;
		}
	}
</style>
