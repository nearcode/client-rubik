<template>
	<view class="padding intro">
		<!-- 币种名称 -->
		<view class="margin-bottom-lg ">
			<text class="text-lg intro_label">{{coins[coin] | getDictValue('chineseName')}} ({{coins[coin] | getDictValue('englishName')}})</text>
		</view>
		<!-- 币种资料 -->
		<view class="intro_info">
			<view class="grid col-2 margin-bottom-xs text-gray">
				<view class="text-sm">发行时间</view>
				<view class="text-sm text-right">{{coins[coin] | getDictValue('date')}}</view>
			</view>
			<view class="grid col-2 margin-bottom-xs text-gray">
				<view class="text-sm">发行总量</view>
				<view class="text-sm text-right">{{coins[coin] | getDictValue('quantum')}}</view>
			</view>
			<view class="grid col-2 margin-bottom-xs text-gray">
				<view class="text-sm">流通总量</view>
				<view class="text-sm text-right">{{coins[coin] | getDictValue('amount')}}</view>
			</view>
			<view class="grid col-2 margin-bottom-xs text-gray">
				<view class="text-sm">众筹价格</view>
				<view class="text-sm text-right">--</view>
			</view>
			<view class="grid col-2 margin-bottom-xs text-gray">
				<view class="text-sm">白皮书</view>
				<view class="text-sm text-right">--</view>
			</view>
			<view class="grid col-2 margin-bottom-xs text-gray">
				<view class="text-sm">官网</view>
				<view class="text-sm text-right">--</view>
			</view>
			<view class="grid col-2 margin-bottom-xs text-gray">
				<view class="text-sm">区块查询</view>
				<view class="text-sm text-right">--</view>
			</view>
		</view>
		<!-- 币种简介 -->
		<view class="margin-top-lg"><text class="text-lg intro_label">简介</text></view>
		<view class="margin-top-xs text-right intro_content">
			<text class="text-xs">
				{{coins[coin]|getDictValue('content')}}
			</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		props: ['coin'],
		components: {},
		computed: {
			...mapState(['coins']),
		},
		onShow() {
			console.log(this.coin)
		},
		mounted() {
			console.log(this.coin)
		},
		data() {
			return {}
		}
	}
</script>

<style lang="less" scoped>
	.intro {
		.intro_label {
			color: #cfd3e9;
			font-weight: bold;
		}

		.intro_info {
			.grid {
				border-bottom: 1px solid #071724;
				padding: 10upx 0;

				.text-right {
					color: #cfd3e9;
				}
			}

			.grid:first-child {
				border-top: 1px solid #071724;
			}
		}

		.intro_content {
			color: #cfd3e9;
			text-align: justify;
		}
	}
</style>
