<template>
	<!-- 关于我们 -->
	<view class="aboutUs page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl">关于我们</view>
			<view class="aboutList">
				<view class="cu-list menu">
					<view class="cu-item" :class="menuArrow?'arrow':''">
						<view class="content">
							<view hover-class="none">
								<text class="text-black text-df font-col">联系我们</text>
							</view>
						</view>
					</view>
					<view class="cu-item" :class="menuArrow?'arrow':''">
						<view class="content">
							<view url="" hover-class="none">
								<text class="text-black text-df font-col">隐私政策</text>
							</view>
						</view>
					</view>
					<!--#ifdef APP-PLUS -->
					<view class="cu-item" @tap="checkUpdate">
						<view class="content">
							<view class="flex justify-between align-center margin-right">
								<text class="text-black text-df font-col">版本({{version}})</text>
								<text v-if="!isLoad" class="textRight text-sm" :class="versionText[1]">{{versionText[0]}}</text>
								<view v-if="isLoad" class="cu-load" :class="isLoad?'loading':''"></view>
							</view>
						</view>
					</view>
					<!--#endif-->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import update from '@/js/update.js';
	export default {
		data() {
			return {
				version: '',
				newVersion: '',
				menuArrow: true,
				isLoad: false,
			}
		},
		computed: {
			versionText() {
				// if(!this.newVersion) return ['获取新版本号失败','text-red'];
				let newVersion = 0;
				let version = 0;
				if (this.newVersion) {
					newVersion = parseInt(this.newVersion.replace(/\./g, "")); //取消字符串中出现的所有.
				}
				if (this.version) {
					version = parseInt(this.version.replace(/\./g, "")); //取消字符串中出现的所有.
				}

				if (newVersion > version) {
					return ['最新版本V' + this.newVersion, 'text-red']
				} else {
					return ['暂无更新', 'text-gray']
				}
			}
		},
		onShow() {
			//#ifdef APP-PLUS
			//获取当前版本
			update.getCurrentVersion().then((version) => {
				this.version = version
				console.log('老版本' + this.version)
			});

			//获取新版本
			update.checkVersion().then((res) => {
				this.newVersion = res[0];
				console.log('新版本' + this.newVersion)
			}).catch((e) => {
				console.log(e)
			});
			//#endif
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			checkUpdate() {
				//#ifdef APP-PLUS
				this.isLoad = true
				update.handUpdate().then(() => {
					this.isLoad = false
				}).catch((e) => {
					this.isLoad = false
				});
				//#endif
			},

		}
	}
</script>

<style lang="less" scoped>
	.aboutUs {
		width: 100%;
		height: 100vh;

		.aboutText {
			width: 94%;
			height: 80upx;
			line-height: 80upx;
			margin: 0 auto;
		}

		.aboutList {
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
