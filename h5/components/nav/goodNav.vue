<template>
	<view class="nav" :class="[borderbottom?'solid-bottom':'']">
		<view class="ex-bar flex justify-between align-center text-xl">
			<view class="status_bar">
				<view class="top_view"></view>
			</view>
		</view>
		<view v-if="show=='true'" class="heights">
			<view :style="{background:bgcolor?bgcolor:'#FFFFFF'}" class="ex-text flex justify-between align-center padding text-df">
				<view class="back">
					<slot name="backIcon"></slot>
					<slot name="backText"></slot>
				</view>
				<view class="title font-color">
					<slot name="content"></slot>
					<slot name="myimage"></slot>
				</view>
				<view class="right">
					<slot name="rightText"></slot>
					<slot name="rightIcon"></slot>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			borderbottom: {
				type: String,
				default: ''
			},
			bgcolor: {
				type: String,
				default: ''
			},
			show: {
				type: String,
				default: 'false'
			},
			showbackonly: {
				type: String,
				default: 'false'
			}
		},
		data() {
			return {}
		},
		methods: {

		}
	}
</script>

<style lang="less" scoped>
	.nav {
		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}
		.top_view {
			height: var(--status-bar-height);
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 996;
			background-color: #FFFFFF;
		}

		.ex-text {
			width: 100%;
			position: fixed;
			top: var(--status-bar-height);
			z-index:997;
			font-size: 40upx;
			height: 100upx;
		}

		.heights {
			height: 102upx;
		}
	}
</style>
