<template>
	<view class="c2c bg-white">
		<view class="c2cWrap clearfix">
			<view class="moneyCNY text-lg text-gray">{{$store.state.getBance(this.coin)+' '}}<text class="text-bold">CNY</text></view>
			<view class="c2cUp clearfix">
				<view class="c2cLeft">
					<view class="c2cLeftHead">
						<view class="head">
							<text class="leftHead text-lg text-white">买入CNY</text>
						</view>
					</view>
					<view class="leftContent">
						<view class="buyPrice">
							<input type="number" class="priceInp" disabled="true" v-model="buyPrice"  placeholder="价格" />
							<text class="buyType text-gray">CNY</text>
						</view>
						<view class="buyPrice buyNum">
							<input type="number" class="priceInp" v-model="buyNum" placeholder="数量" />
							<text class="buyType text-gray">CNY</text>
						</view>
						<view class="buyPrice">
							<view class="buyText text-df">需要<text class="needMoney text-red">{{$tools.util.toFixed(buyPrice*buyNum,5)}}</text>CNY</view>
						</view>
						<view class="buyPrice buyNum">
							<text class="buy text-white text-lg" @tap="trade(1)" :disable="disable">立即买入</text>
						</view>
					</view>
					
				</view>
				<view class="c2cLeft c2cRight">
					<view class="c2cLeftHead">
						<view class="headRight">
							<text class="rightHead text-lg text-black">卖出CNY</text>
						</view>
					</view>
					
					<view class="leftContent rightContent">
						<view class="buyPrice">
							<input type="number" class="priceInp" disabled="true" v-model="sellPrice"  placeholder="价格" />
							<text class="buyType text-gray">CNY</text>
						</view>
						<view class="buyPrice buyNum">
							<input type="number" class="priceInp" v-model="sellNum"  placeholder="数量" />
							<text class="buyType text-gray">CNY</text>
						</view>
						<view class="buyPrice">
							<view class="buyText text-df">获得<text class="needMoney text-red">{{$tools.util.toFixed(sellPrice*sellNum,5)}}</text>CNY</view>
						</view>
						<view class="buyPrice buyNum">
							<text class="sell text-black text-lg" @tap="trade(-1)" :disable="disable">立即卖出</text>
						</view>
					</view>
					
				</view>
			</view>
			<view class="msg">
				<view class="msgHead text-lg text-gray">温馨提示:</view>
				<text class="msgText text-gray">1、买卖商户均为实名认证商户，并提供保障金，可放心兑换。</text>
				<text class="msgText text-gray">2、商家处理时间为9:00-21:00，非处理时间的订单会在第二天9:00开始处理，一般接单后两小时内完成交易，最长处理时间不会超过24小时。请在下单后30分钟内完成付款，否则会延迟到账。</text>
				<text class="msgText text-gray">3、单天最多只能发起10笔买卖订单。</text>
				<text class="msgText text-gray">4、禁止使用微信、支付宝、他人代付、ATM及柜台转账等第三方转账。请务必使用本人绑定的银行卡通过手机银行或网银进行汇款，其他任何方式汇款都会造成延迟处理。</text>
			</view>
			
			
			
			
		</view>
	</view>
</template>

<script>
	import c2c from '@/api/c2c.js';
	import base from '@/api/base.js';
	export default {
		data() {
			return {
				coin: '', 
				buyPrice:0,
				buyNum:1,
				sellPrice:0,
				sellNum:1,
				disable: false,
			}
		},
		onShow() {
			this.getInfo();
			this.$store.commit('getBalances');
		},
		methods: {
			async getInfo(){
				let localRes = uni.getStorageSync("c2c");
				// console.log(localRes)
				if (localRes) {
					this.buyPrice = localRes.buyPrice;
					this.sellPrice = localRes.sellPrice;
					this.coin = localRes.coin;
				}
				try{
					let res = await c2c.getInfo();
					console.log(res)
					this.buyPrice = res.buyPrice;
					this.sellPrice = res.sellPrice;
					this.coin = res.coin;
					uni.setStorageSync("c2c", res);
				}catch(e){
				}
				// this.getBalance(this.coin);
				// console.log(this.$store.state.getBance(this.coin))
				// this.$store.state.getBance(this.coin)
			},
			async trade(type){
				let amount,price;
			    //type类型等于1为买入，-1为卖出
			    if(type == 1){
					amount = this.buyNum;
			    }else{
					amount = this.sellNum;
			    }
				try{
					this.disable = true;
					await c2c.buyAndSell({
						coin: this.coin,
						type,
						amount
					});
					// this.$tools.util.showToast("下单成功");
					uni.showToast({
						title:"下单成功"
					})
					type == 1?this.buyNum = 0: this.sellNum = 0;
					this.disable = false;
				}catch(e){
					console.error(e)
					uni.showToast({
						title:e.error,
						icon:'none'
					})
					// this.$tools.util.showToast(this.$t(e.error));
					this.disable = false;
				}
			}
		},
		onNavigationBarButtonTap(e){
			// console.log(e)
			uni.navigateTo({
				url:"./transactionReaord"
			})
		},
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
	.c2c{
		width: 100%;
		min-height: 100vh;
		height: 100%;
		.c2cWrap{
			width: 94%;
			height: 100%;
			// border: 1px solid red;
			margin: 0 auto;
			.moneyCNY{
				line-height: 50upx;
				text-align: right;
			}
			.c2cUp{
				width: 100%;
				height: auto;
			}
			.c2cLeft{
				width: 50%;
				float: left;
				
				.c2cLeftHead{
					width: 100%;
					position: relative;
					line-height: 70upx;
					text-align: center;
					.head{
						width: 100%;
						height: 70upx;
						border-right: 70upx solid transparent;
						border-top: 70upx solid #03C086;
						
						.leftHead{
							width: 100%;
							height: 70upx;
							position: absolute;
							left: 0;
							top:0;
						}
					}
				}
				
				.headRight{
					width: 100%;
					border-left: 70upx solid transparent;
					border-bottom: 70upx solid #E7EBEE;
					
					.rightHead{
						width: 100%;
						height: 70upx;
						position: absolute;
						left: 0;
						top:0;
					}
				}
				.leftContent{
					width: 97%;
					height: 360upx;
					margin-top: 40upx;
					
					.buyPrice{
						width: 100%;
						height: 70upx;
						position: relative;
						
						.priceInp{
							width: 100%;
							height: 70upx;
							border: 1px solid #eee;
							border-radius: 8upx;
							text-indent: 6upx;
						}
						
						.buyType{
							width: 70upx;
							height: 70upx;
							line-height: 70upx;
							position: absolute;
							top: 0;
							right: 0;
						}
						.buyText{
							width: 100%;
							line-height: 60upx;
							overflow: hidden;
							display: flex;
							.needMoney{
								width: auto;
								max-width:66%;
								display: block;
								 overflow: hidden;
							}
						}
						.buy,.sell{
							width: 90%;
							height: 70upx;
							line-height: 70upx;
							text-align: center;
							display: block;
							background: #03C086;
							border-radius: 8upx;
							margin: 0 auto;
						}
						.sell{
							background: #E7EBEE;
						}
						
					}
					.buyNum{
						margin-top:30upx;
					}
					
				}
				.rightContent{
					margin-left:3%;
				}
			}
			
			.msg{
				width: 100%;
				
				.msgHead{
					height: 80upx;
					line-height: 80upx;
				}
				.msgText{
					width: 100%;
					height: auto;
					display: block;
					line-height: 46upx;
					padding: 8upx 0;
				}
			}
			
		}
	}
</style>
