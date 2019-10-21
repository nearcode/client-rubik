<template>
	<view class="transactionReaord bg-white">
		<view class="TRContent" v-if="Object.keys(historyList).length">
			<view class="transOne" v-for="(item,index) in historyList" :key="index" >
				<view class="oneUp oneUpH">
					<view class="upLeft text-lg text-bold">{{item.type==1?"买入":"卖出"}}</view>
					<view class="upRight text-lg text-bold text-red">&yen; {{item.price*item.amount ||0}}</view>
				</view>
				<view class="oneUp">
					<view class="midLeft text-df text-gray">单价:<text class="text-lg">{{item.price}}</text></view>
					<view class="midRight text-df text-gray">数量:<text class="text-lg">{{item.amount}}</text></view>
				</view>
				<view class="oneUp">
					<view class="footLeft text-df text-gray">{{item.create | formatTime('yyyy-MM-dd')}}</view>
					<view class="footRight clearfix">
						<text class="payMsg bg-cyan text-sm" @tap='go(item,item.type)'>付款信息</text>
						<!-- <text class="handle bg-gray text-sm text-black" v-if="item.type==1">{{getStatus(item.result)}}</text> -->
						<text class="handle bg-gray text-sm text-black">{{getStatus(item.result)}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="TRContent nodatas flex flex-direction justify-center align-center">
			<text class="lg text-gray icon-form " style="color:#c6cfd6"></text>
			<view class="text-df text-center text-black" style="color:#c6cfd6">没有相关记录</view>
		</view>

	</view>
</template>

<script>
	import c2c from '@/api/c2c.js';
	export default {
		data() {
			return {
				historyList:{}
			}
		},
		onShow() {
			this.history();
		},
		methods: {
			async history() {
				try {
					this.historyList = await c2c.history();
					// console.log(this.historyList)
				} catch (e) {}
			},
			go(item,type){
				// console.log(type)
				uni.setStorageSync('detail',item)
				uni.navigateTo({
					url:'/pages/C2C/transactionDetail?type='+type
				})
			},
			getStatus(num){
				switch(num){
					case 0:
						return "待处理";
					case 1:
						return "成功";
					case 2:
						return "取消提现";
					case 3:
						return "已过期";
					case -1:
						return "审核中";
					default:
						return "无此状态";
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.clearfix:after {
		content: ".";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}
	.clearfix{
		zoom: 1;
	}
	.transactionReaord{
		width: 100%;
		min-height: 100vh;
		height: 100%;
		
		.TRContent{
			width: 96%;
			height: 100%;
			margin: 0 auto;
			
			.transOne{
				width: 100%;
				height: 210upx;
				margin-bottom: 20upx;
				border-bottom: 1px solid #eee;
				// border-radius: 10upx;
				
				.oneUp{
					width: 100%;
					height: 70upx;
					// border: 1px solid red;
					
					display: flex;
					line-height: 70upx;
					.upLeft{
						width: 30%;
						text-indent: 10upx;
						
						// background: #eee;
					}
					.upRight{
						width: 70%;
						text-align: right;
					}
					.midLeft,.midRight{
						width: 50%;
						text-align: right;
						overflow: hidden;
					}
					.midRight{
						
					}
					.footLeft{
						width: 50%;
					}
					.footRight{
						width:50%;
						
						.payMsg,.handle{
							width: 140upx;
							height: 50upx;
							line-height: 55upx;
							border-radius: 8upx;
							text-align: center;
							float: left;
							margin: 10upx 0 10upx 40upx;
						}
						
					}
				}
				.oneUpH{
					line-height: 85upx;
				}
				
			}
		}
	}
</style>
