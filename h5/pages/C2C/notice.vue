<template>
	<view class="page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-bold text-xxl">买卖须知</view>
			<view class="content padding-lr-xl">
				<text>1、买卖商户均为实名认证商户，并提供保障金，可放心兑换。</text>
				<text>2、商家处理时间为9:00-12:00,非处理时间的订单则会在第二天9:00开始处理，一般接单后两小时内完成交易，最长处理时间不超过24小时。请在下单后30分钟内完成付款，否则会延时到账。</text>
				<text>3、单天最多只能发起10笔买卖订单。</text>
				<text>4、禁止使用微信、支付宝、他人代付、ATM及柜台转账等第三方转账。请务必使用本人绑定的银行卡通过手机银行或网银进行汇款，其他任何方式汇款都会造成延迟处理。</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		components: {},
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
	.content {
		color: #1F3F58;
		line-height: 39.58upx;

		text {
			display: block;
			margin-bottom: 57.29upx;
		}
	}
</style>
