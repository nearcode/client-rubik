<template>
	<view class="selectCoin page">
		<nav-bar show="false"></nav-bar>
		<list :searchContent="searchContent" :jumpUrl="jumpUrl" @paramClick="paramClick"></list>
	</view>
</template>

<script>
import list from '@/components/indexs/directory';

export default {
	data() {
		return {
			jumpUrl:'',
			searchContent:'',
		};
	},
	computed:{
		
	},
	onNavigationBarSearchInputChanged(e){
		// this.$tools.util.showToast(e.text)
		this.searchContent = e.text;
	},
	onNavigationBarButtonTap(){
		uni.navigateBack({
			delta:1,
		})
	},
	onLoad(options) {
		this.jumpUrl = options.jumpUrl
	},
	components: {
		list
	},
	onShow() {
		this.$store.commit('getInfo');
	},
	methods: {
		paramClick(e) {
			console.log(JSON.stringify(e));
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]; //上一个页面
			//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
			prevPage.type = e.type;
			prevPage.name = e.name;
			let coin = e.name;
			if(this.jumpUrl){
				if(this.jumpUrl=='addCoin'){
					uni.redirectTo({
						url:'/pages/wallet/addCoin?selectcoin='+coin
					})
				}
				if(this.jumpUrl=='withdraw'){
					uni.redirectTo({
						url:'/pages/wallet/withdraw?selectcoin='+coin
					})
				}
				
				if(this.jumpUrl=='transfer'){
					uni.redirectTo({
						url:'/pages/wallet/transfer?selectcoin='+coin
					})
				}
			}else{
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
	.selectCoin{
		background-color:#f7f6fb;
	}
</style>