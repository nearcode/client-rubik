<template>
	<view class="seeDetail bg-white">
		
		<view class="seeWrap clearfix">
			<view class="detailTitle text-bold text-lg">{{detail.type == 1?"收款订单":"付款订单(请按提示信息向该卖家汇款)"}}</view>
			<view class="detailSame">
				<text class="detailLeft text-df text-gray">收款方户名:</text>
				<text class="detailRight text-bold text-df text-black">{{detail.bankcard.truename}}</text>
			</view>
			<view class="detailSame">
				<text class="detailLeft text-df text-gray">收款方开户行:</text>
				<text class="detailRight text-bold text-df text-black">{{detail.bankcard.name}}</text>
			</view>
			<view class="detailSame">
				<text class="detailLeft text-df text-gray">收款方帐号(禁止使用支付宝和微信):</text>
				<text class="detailRight text-bold text-df text-black">{{detail.bankcard.number}}</text>
			</view>
			<view class="detailSame">
				<text class="detailLeft text-df text-gray">收款方手机号:</text>
				<text class="detailRight text-bold text-df text-black">{{detail.bankcard.mobile}}</text>
			</view>
			<view class="detailSame">
				<text class="detailLeft text-df text-gray">转帐金额:</text>
				<text class="detailRight text-bold text-df text-black">{{detail.price}}</text>
			</view>
			<view class="detailSame" v-if="detail.type == -1">
				<text class="detailLeft text-df text-gray">转帐备注(必填):</text>
				<text class="detailRight text-bold text-df text-black">{{detail.id}}</text>
			</view>
			<view class="detailSame">
				<text class="detailLeft text-df text-gray">状态:</text>
				<text class=" markMsg text-bold text-df text-black">{{detail.result == 1?"已完成":"未完成"}}</text>
			</view>
			
			<view class="sure">
				<text class="makeMoney bg-blue" @tap="makeMoney(detail._id,'C')" v-if="detail.type == 1 && !markOrColse">打款</text>
				<text class="makeMoney bg-blue" @tap="makeMoney(detail._id,'T')" v-if="detail.type == -1 && !markOrColse">打款</text>
				<view class="makeMoney bg-gray text-bold" @click="close" v-if="markOrColse">关闭</view>
			</view>
		</view>
	</view>
</template>

<script>
	import C2C from '@/api/c2c.js'
	export default {
		data() {
			return {
				detail:{},
				markOrColse:false
			}
		},
		onShow() {
			// console.log(uni.getStorageSync("detail"))
			this.detail = uni.getStorageSync("detail");
		},
		methods: {
			//确认打款
			makeMoney:function(id,arg){
				// console.log(arg)
				let that = this;
				uni.showModal({
					title:"提示",
					content:"确定打款吗？",
					success:function(res){
						if(res.confirm){
							if(arg == "C"){
								that.sureConfirm(id);
							}else if(arg == "T"){
								that.sellConfirm(id);
							}
						}
					}
				})
			},
			//充值打款
			async sureConfirm(id){
				try{
					let result = await C2C.sureConfirm(id);
					console.log(result.suc)
					if(result.suc){
						this.markOrColse = true;
					}
				}catch(e){
					//TODO handle the exception
				}
			},//提现打款
			async sellConfirm(id){
				try{
					let result = await C2C.sellConfirm(id);
					// console.log(result.suc)
					if(result.suc){
						this.markOrColse = true;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			close(){
				uni.navigateBack({
					delta:1
				})
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
	.seeDetail{
		width: 100%;
		height: 100%;
		min-height: 100vh;
		
		.seeWrap{
			width: 94%;
			height: 100%;
			margin: 0 auto;
			
			.detailTitle{
				width: 100%;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
			}
			.detailMoney{
				width: 100%;
				height: 55upx;
				line-height:55upx;
				text-align: center;
			}
			.detailSame{
				width: 100%;
				min-height: 60upx;
				height: auto;
				border-bottom: 1px solid #eee;
				line-height: 60upx;
				float: left;
				margin-top:30upx;
				
				.detailLeft{
					width: 35%;
					height: 100%;
					display: block;
					overflow: hidden;
					float: left;
				}
				.detailRight{
					width: 65%;
					height: 100%;
					display: block;
					float: left;
					text-align: right;
					overflow: hidden;
				}
				.markMsg{
					width: 65%;
					display: block;
					float: left;
					height: auto;
					text-align: right;
				}
				.msrkStyle{
					line-height: 45upx;
					word-wrap:break-word;
				}
			}
			.sure{
				width: 100%;
				height: 70upx;
				float: left;
				margin-top: 70upx;
			}
			.makeMoney{
				width: 90%;
				height: 70upx;
				display: block;
				line-height: 70upx;
				text-align: center;
				margin-left:5%;
				border-radius: 10upx;
			}
		}
	}
</style>
