<template>
	<!-- 安全中心 -->
	<view class="safetyCenter page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<!-- <view class="safetyText text-black text-bold text-xxl">安全中心</view> -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl">安全中心</view>
			<view class="safetyList">
				<view class="cu-list menu">
					<view class="cu-item" :class="menuArrow?'arrow':''" @click="setMobile">
						<view class="content">
							<text class="text-black text-df font-col">手机</text>
							<text class="textRight text-grey text-sm" v-if="mobile">{{mobile}}</text>
							<text class="textRight text-grey text-sm" v-else>未绑定</text>
						</view>
					</view>
					<view class="cu-item" :class="menuArrow?'arrow':''" @click="setEmail">
						<view class="content">
							<text class="text-black text-df font-col">邮箱</text>
							<text class="textRight text-grey text-sm" v-if="email">{{email}}</text>
							<text class="textRight text-grey text-sm" v-else>未绑定</text>
						</view>
					</view>
					<view class="cu-item" :class="menuArrow?'arrow':''" @click="setGoogle">
						<view class="content">
							<text class="text-black text-df font-col">谷歌身份验证器</text>
							<text class="textRight text-grey text-sm">未绑定</text>
						</view>
					</view>
					<!-- <view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content">
						<text class="text-black text-df">支付定</text>
						<text class="textRight text-grey text-sm">未绑定</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black text-df">手势密码</text>
						<switch  @change="SetGesture" class="textRight"  :class="isGesture?'checked':''"></switch>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">
						<text class="text-black text-df">指纹登录</text>
						<switch  @change="SetFingerprint" class="textRight" :class="isFingerprint?'checked':''"></switch>
					</view>
				</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import navBar from '@/components/nav/nav.vue';
	export default {
		data() {
			return {
				isGesture: false,
				isFingerprint: false,
				menuArrow: true
			}
		},
		components: {
			navBar
		},
		computed: {
			...mapState(['mobile', 'email']),
		},
		onShow() {
			this.$store.commit('getInfo');
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			SetGesture(e) {
				this.isGesture = e.detail.value
			},
			SetFingerprint(e) {
				this.isFingerprint = e.detail.value
			},
			setMobile() {
				uni.navigateTo({
					url: '/pages/user/safetyCenter/setMobile/setMobile'
				})
			},
			setEmail() {
				uni.navigateTo({
					//url:'/pages/user/safetyCenter/setEmail/setEmail'
					url: '/pages/user/safetyCenter/setEmail/bindEmail'
				})
			},
			setGoogle() {
				return false;
				uni.navigateTo({
					url: '/pages/user/safetyCenter/setGoogle/setGoogle'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.safetyCenter {
		width: 100%;

		.safetyText {
			width: 94%;
			height: 80upx;
			line-height: 80upx;
			margin: 0 auto;
		}

		.safetyList {
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
