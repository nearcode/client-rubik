<template>
	<!-- 语言设置 -->
	<view class="language page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl">{{title}}</view>
			<view class="languageType">
				<view class="languageOne" v-for="(item,index) in langList" :data-name="item.name" :data-id="item.id" :key="index"
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
				title: "语言",
				currentLang: 1,
				langList: [{
						id: 1,
						name: '简体中文'
					},
					{
						id: 2,
						name: 'English'
					},
					{
						id: 3,
						name: '한국어'
					},
					{
						id: 4,
						name: '日本語'
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
						id: "language",
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
	.language {
		width: 100%;

		.languageText {
			width: 94%;
			height: 80upx;
			line-height: 80upx;
			margin: 0 auto;
		}

		.languageType {
			width: 100%;
			height: auto;

			.languageOne {
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
