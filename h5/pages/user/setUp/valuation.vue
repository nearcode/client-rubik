<template>
	<!-- 计价方式 -->
	<view class="valuation page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl">{{title}}</view>
			<view class="valuationType">
				<view class="valuationOne" v-for="(item,index) in valuationList" :data-name="item.name" :data-id="item.id" :key="index"
				 @click="checkLang">
					<text class="text-lg font-color">{{item.name}}</text>
					<text class="checkedLang icon iconfont icon-xuanze" v-show="item.id == currentLang"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "计价方式",
				currentLang: 1,
				valuationList: [{
						id: 1,
						name: '人民币(CNY)'
					},
					{
						id: 2,
						name: '美元(CNY)'
					},
					{
						id: 3,
						name: '韩元(CNY)'
					},
					{
						id: 4,
						name: '日元(CNY)'
					}
				]
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			checkLang: function(e) {
				// console.log(e)
				this.currentLang = e.currentTarget.dataset.id;
				// console.log(e.currentTarget.dataset.name)
				uni.setStorage({
					key: "selectType",
					data: {
						id: "valuation",
						name: e.currentTarget.dataset.name
					}
				})
				uni.navigateBack({
					delta: 1
				})
			}
		}


	}
</script>

<style lang="less" scoped>
	.valuation {
		width: 100%;

		.valuationText {
			width: 94%;
			height: 80upx;
			line-height: 80upx;
			margin: 0 auto;
		}

		.valuationType {
			width: 100%;
			height: auto;

			.valuationOne {
				width: 94%;
				margin: 0 auto;
				line-height: 80upx;
				border-bottom: 1px solid #eee;

				.checkedLang {
					float: right;
					margin-right: 20upx;
					color: rgba(24, 131, 213, 1);
					line-height: 34px;
				}
			}
		}

	}
</style>
