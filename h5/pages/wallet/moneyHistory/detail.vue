<template>
	<view class="onceCoinDetail page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="once" v-if="coinTrans != '' ">
				<view class="onceNum text-bold text-blue text-xxl">{{coinTrans.data.amount}} {{coin}}</view>
				<view class="onceSame onceType">
					<text class="sameStyle text-gray text-df">类型</text>
					<text class="rightSame font-color text-df" v-if="coinTrans.data.method != 1 && this.type!=-1">{{$common.getMode(coinTrans.data.method,this.type)}}</text>
					<view class="typeRight text-right" v-if="coinTrans.data.method == 1 && this.type==-1">
						<text class="font-color text-df">转出</text>
						<!-- <text class="curryType text-gray text-df">帐号:{{coinTrans.data.account}}</text> -->
					</view>
				</view>
				
				<view class="onceSame onceAddress" v-if="coinTrans.data.method == 1">
					<text class="sameStyle text-gray text-df">对方账号</text>
					<view class="typeRight text-right">
						<text class="font-color text-df">{{coinTrans.data.account}}</text>
					</view>
				</view>
				
				<view class="onceSame onceAddress" v-if="coinTrans.data.method == 2 && this.type==-1">
					<text class="sameStyle text-gray text-df">提币地址</text>
					<view class="typeRight">
						<text class="curryType font-color text-df">{{coinTrans.data.memo}}</text>
						<text class="curryType text-gray text-df">{{coinTrans.data.address}}</text>
					</view>
				</view>
				<view class="onceSame onceStatus">
					<text class="sameStyle text-gray text-df">状态</text>
					<text class="rightSame font-color text-df">{{coinTrans.data.result == 1?"已完成":"未完成"}}</text>
				</view>
				<view class="onceSame onceFee" v-if="coinTrans.data.method != 2">
					<text class="sameStyle text-gray text-df">手续费</text>
					<text class="rightSame font-color text-df">{{this.fee || '0.00'}}</text>
				</view>
				<view class="onceSame onceDealID" v-if="coinTrans.data.method == 2">
					<text class="sameStyle text-gray text-df">区块链交易ID</text>
					<text class="rightSame anyLine font-color text-df">{{coinTrans.data.txid}}</text>
				</view>
				<view class="onceSame onceTime">
					<text class="sameStyle text-gray text-df">时间</text>
					<text class="rightSame font-color text-df">{{coinTrans.data.create | formatTime('yyyy-MM-dd')}}</text>
				</view>

			</view>
			<view v-if="coinTrans == ''" class="text-xl" style="text-align: center; line-height:160upx">
				没有相关明细记录
			</view>
		</view>
	</view>
</template>

<script>
	import base from '@/api/base.js';

	export default {
		data() {
			return {
				coinId: "",
				coin: '',
				type: '',
				coinTrans: ''
			}
		},
		components: {

		},
		onLoad(option) {
			// console.log(option)
			this.coinId = option.id;
			this.coin = option.coin;
			this.type = option.type;
			// console.log(option.id)
		},
		async onShow() {
			// console.log(this.coinId)
			this.coinTrans = await base.moneyHistoryDetail(this.coinId)
			console.log(this.coinTrans)
			// console.log( await base.getWalletAddress(this.coin) )
			// this.coinTrans.data.method = 2
			// this.coinTrans.data.account = "CNY"
		},
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
	.onceCoinDetail {
		width: 100%;

		.once {
			width: 94%;
			height: 100%;
			margin: 0 auto;

			.onceNum {
				width: 100%;
				height: 120upx;
				line-height: 120upx;
				overflow: hidden;
			}

			.onceSame {
				display: flex;
				line-height: 90upx;
				border-bottom: 1px solid #eee;

				.rightSame {
					width: 445upx;
					text-align: right;
				}
			}

			.onceType {
				width: 100%;
				height: auto;
				min-height: 90upx;
			}

			.typeRight {
				width: 445upx;
				height: 100upx;

				.curryType {
					width: 100%;
					height: 50upx;
					display: block;
					line-height: 50upx;
					text-align: right;
				}
			}

			.sameStyle {
				width: 260upx;
			}

			.anyLine {
				min-height: 90upx;
				height: auto;
				word-wrap: break-word;
				line-height: 50upx;
			}

			.onceStatus,
			.onceTime {
				width: 100%;
				height: 90upx;
			}
		}
	}
</style>
