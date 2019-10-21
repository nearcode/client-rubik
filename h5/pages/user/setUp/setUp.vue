<template>
	<!-- 设置 -->
	<view class="setUp page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl">设置</view>
			<view class="setList">
				<view class="cu-list menu">
					<view class="cu-item" :class="menuArrow?'arrow':''" @tap="setLanguage">
						<view class="content">
							<a hover-class="none">
								<text class="text-black text-df font-col">语言</text>
								<text class="textRight text-grey text-sm">{{language}}</text>
							</a>
						</view>
					</view>
					<view class="cu-item" :class="menuArrow?'arrow':''" @tap="setComputed">
						<view class="content">
							<a>
								<text class="text-black text-df font-col">计价方式</text>
								<text class="textRight text-grey text-sm">{{valuation}}</text>
							</a>
						</view>
					</view>
					<!-- 	<view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content">
						<navigator url="" hover-class="none">
							<text class="text-black text-df">行情刷新频率</text>
							<text class="textRight text-grey text-sm">仅在WIFI下实时行情</text>
						</navigator>
					</view>
				</view>
				<view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content">
						<navigator url="" hover-class="none">
							<text class="text-black text-df">涨跌色</text>
							<text class="textRight text-grey text-sm">红涨绿跌</text>
						</navigator>
					</view>
				</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuArrow: true,
				language: "简体中文",
				valuation: '人民币(CNY)'
			}
		},
		onShow() {
			let that = this
			uni.getStorage({
				key: "selectType",
				success(res) {
					// console.log(res)
					switch (res.data.id) {
						case 'language':
							that.language = res.data.name;
							break;
						case 'valuation':
							that.valuation = res.data.name;
							break;
					}
					uni.removeStorage({
						key: "selectType"
					})

				}
			})
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			setLanguage() {
				uni.navigateTo({
					url: '/pages/user/setUp/language',
				})
			},
			setComputed() {
				uni.navigateTo({
					url: '/pages/user/setUp/valuation',
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.setUp {
		width: 100%;

		.setText {
			width: 94%;
			height: 80upx;
			line-height: 80upx;
			margin: 0 auto;
		}

		.setList {
			width: 100%;

			.cu-list {
				width: 96%;
				margin: 0 auto;
				border-bottom: 1px solid #eee;
				// border-radius: 0;
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
