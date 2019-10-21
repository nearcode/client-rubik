<template>
	<view>
		<good-nav-bar show="true" bgcolor="#FFFFFF" borderbottom="`true`">
			<block slot="content">
				<text style="font-weight: bold;">选择银行卡</text>
			</block>
		</good-nav-bar><!-- 自定义导航 -->
		<bank-list @paramClick="paramClick"></bank-list>
	</view>
</template>

<script>
import bankList from '@/components/banklist/directory';
export default {
	data() {
		return {
		};
	},
	components: {
		bankList
	},
	methods: {
		paramClick(e) {
			// console.log(e);
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]; //上一个页面
			//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
			prevPage.type = e.type;
			prevPage.name = e.name;
// 			prevPage.setData({
// 				type: e.type,
// 				name: e.name
// 			});
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style></style>