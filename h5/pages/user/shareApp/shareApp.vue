<template>
	<view class="bg-white page padding-bottom">
		<view v-show="showTips" class="tips">
			<text class="text-center">点击右上角，选择“在浏览器中打开”</text>
			<image src="/static/image/shareApp/safari_open_arrow.png" mode=""></image>
		</view>
		<view class="layout">
			<view class="logo text-center">
				<image :src="logo" mode="widthFix"></image>
			</view>
			<view class="kh text-center">
				<view class="title">{{title}}</view>
				<view>快速便捷的全网交易平台</view>
			</view>
			<view class="download text-center">
				<button :disabled="h5Url?false:true" class="cu-btn block line-blue lg margin-bottom-xl" @tap="openH5">
					<!-- <image class="margin-right-sm" src="/static/image/shareApp/apple.png"></image> -->
					<text class="icon iconfont icon-h5 margin-right-xs"></text>
					<text>H5版地址</text>
				</button>

				<button :disabled="appIosDownloadUrl?false:true" class="cu-btn block line-blue lg margin-bottom-xl" @tap="downloadIOS">
					<!-- <image class="margin-right-sm" src="/static/image/shareApp/apple.png"></image> -->
					<text class="icon iconfont icon-apple margin-right-xs"></text>
					<text>IOS企业版下载</text>
				</button>
				
				<view v-show="showIosBtn" class="showIosBtn text-center margin-bottom-xl" @tap="iosDetail">
					<text class="">查看信任步骤</text>
				</view>
				
				<button :disabled="appAndroidDownloadUrl?false:true" class="cu-btn block bg-blue margin-tb-sm lg" @tap="downloadAndroid">
					<!-- <image class="margin-right-sm" src="/static/image/shareApp/ad.png"></image> -->
					<text class="icon iconfont icon-ad margin-right-xs"></text>
					<text>Android版下载</text>
				</button>
			</view>
		</view>

	</view>

	</view>
</template>

<script>
	import config from '@/config';
	import {
		mapState
	} from 'vuex';
	import base from '@/api/base';

	export default {
		data() {
			return {
				appAndroidDownloadUrl: '',
				appIosDownloadUrl: '',
				h5Url: '',
				showTips: false,
				showIosBtn:false,
			}
		},
		computed: {
			...mapState(['logo', 'title']),
		},
		async onLoad() {
			this.$store.commit('getInfo');
			uni.showLoading({
				title: '加载中...'
			})
			let res = await base.updateUrl('EXCHANGE');
			this.appAndroidDownloadUrl = res.data.androidUrl || '';
			this.appIosDownloadUrl = res.data.iosUrl || '';
			this.h5Url = res.data.h5Url || '';
			uni.hideLoading();
		},
		async onShow() {
			if (this.$common.is_Show_Jump()) {
				this.showTips = true;
			} else {
				this.showTips = false;
			}
		},
		methods: {
			openH5() {
				window.location.href = this.h5Url;
			},
			downloadIOS() {
				if(this.$common.getMobile() != 'ios'){
					this.$tools.util.showToast('请用iPhone打开此页面');
				}else{
					this.showIosBtn = true;
					window.location.href = this.appIosDownloadUrl;
				}
			},
			downloadAndroid() {
				window.location.href = this.appAndroidDownloadUrl;
			},
			iosDetail(){
				uni.navigateTo({
					url:"/pages/user/shareApp/install_guide"
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.tips {
		position: relative;
		height: 200upx;
		background: rgb(34, 34, 34);
		color: rgb(220, 220, 220);
		padding: 0 80upx;

		image {
			width:200upx;
			height:100upx;
			position: absolute;
			top: 20upx;
			right: 20upx;
		}
		text{
			line-height: 200upx;
		}
	}

	.icon {
		font-size: 50upx;
	}

	.icon-apple {
		color: '#1883d5';
	}

	.icon-ad {
		color: '#FFFFFF';
	}

	.layout {
		padding-left: 15%;
		padding-right: 15%;

		// max-width: 750upx;
		.logo {
			image {
				//width:200upx;
				//height:200upx;
				width: 400upx;
				margin-top: 200upx;
			}
		}

		.kh {
			.title {
				font-size: 50upx;
				font-weight: bold;
				margin-bottom: 10upx;
			}

			image {
				width: 485upx;
				height: 132upx;
				margin-top: 100upx;
			}

			margin-top:20upx;
		}

		.download {
			margin-top: 150upx;

			button {
				height: 100upx;

				image {
					width: 40upx;
					height: 50upx;
				}
			}

		}
	}
</style>
