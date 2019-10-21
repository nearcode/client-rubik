<template>
	<!-- 文章 -->
	<view class="article page layouts bg-white">
		<view class="content font-color">
			<view class="title">
				{{data.title}}
			</view>
			<view class="detail" v-html="data.content">{{data.content}}</view>
		</view>
	</view>
</template>

<script>
	import common from '@/common'
	import base from "@/api/base";
	
	export default{
		data(){
			return{
				id:'',
				data: [],
			}
		},
		onLoad(options) {
			this.id = options._id
		},
		onShow() {
			this.getData(this.id);
		},
		methods: {
			async getData(id) {
				if (!id) return false;
				try {
					let res = await base.showNews(id);
		
					if (res.data) {
						console.log(res.data)
						this.data = res.data;
						this.data.create = this.$tools.date.toString(this.data.create,'yyyy年MM月dd日')
						if(this.data.title){
							uni.setNavigationBarTitle({
								title: this.data.title,
							});
						}
					}
		
				} catch (e) {
					if (!e) return;
					if (e.error) {
						uni.showToast({
							title: this.$t(e.error),
							icon: 'none',
							duration: 1500 //持续的时间
						});
					}
				}
			}
		},
	}
	
</script>

<style lang="less" scoped>
	.article{
		width: 100%;
		.content{
			margin: 0 auto;
			font-size:26.56upx;
			line-height: 39.58upx;
			.title{
				line-height:56.25upx;
				text-align:left;
				font-size:37.5upx;
				padding-left:20%;
				padding-right:20%;
				padding-bottom:98.95upx;
			}
			.detail{
				padding-left:31.25upx;
				padding-right:31.25upx;
			}
		}
		
	}
</style>