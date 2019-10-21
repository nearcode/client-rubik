<template>
	<view class="bankCard bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="head-title text-bold text-xxl margin-left">银行卡</view>
		<view class="cardList" v-for="(item,index) in cardList" :key="index" v-if="cardList.length>0">
			<uni-swipe-action :options="options" @click="bindClick(item._id)">
				<view class="cardOne" :style="'background-image: url(static/bankCards/'+item.type+'.png);'">
					<view class="bgStyle" :style="'background:'+bankBG[item.type]">
						<view class="cardHead">
							<view class="headLeft">
								<text :style="'background-image: url(static/bankCards/'+item.type+'.png);'" class="bankImage"></text>
								<text class="text-lg text-black">{{item.name}}</text>
							</view>
							<view class="headRight clearfix">
								<text class="checkbox" @tap="setDefault(item._id)">
									<text class="isChecked bg-blue" v-if="item.isDefault"></text>
								</text>
								<text :class="{'dfcolor':item.isDefault}">默认</text>
							</view>
						</view>
						<view class="textSame text-lg text-black">{{item.truename}}</view>
						<view class="textSame text-xl text-black">**** **** ****{{item.numbers}}</view>
					</view>
				</view>
			</uni-swipe-action>
			<view class="empty bg-gray"></view>
		</view>


		<view style="height: 130upx;width: 100%;"></view>

		<view class="cardSave bg-white">
			<view class="add" @tap="toAddBankCar">
				<view>
					<button class="" style="background-color:rgba(24,131,213,1);color:#FFFFFF">添加</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
	import base from '@/api/base'
	import bankBGC from '@/components/banklist/bankColor.json';

	import consts from '@/config/const.js';

	export default {
		components: {
			uniSwipeAction
		},
		data() {
			return {
				isChecked: true,
				bankBG: {},
				cardList: [

				],
				options: [{
					text: '删除',
					style: {
						backgroundColor: 'rgb(255,58,49)'
					}
				}]
			}
		},
		computed: {

		},
		onNavigationBarButtonTap(e) {
			uni.navigateBack({
				delta: 1,
			})
		},
		onShow() {
			this.getCardList();
			// console.log(bankBGC.bankCardColor.BJBANK)
			this.bankBG = bankBGC.bankCardColor;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			async toAddBankCar() {
				await this.$common.is_CA(consts.authLevel.primary, '/pages/user/userCA',
					'/pages/user/bankCard/addCard')
			},
			async getAuthLevel(callback) {
				try {
					//let res = await base.getCertificateStatus(consts.authLevel.primary)
					let res = await base.getCertificate(consts.authLevel.primary)
					callback(res.data.result)
				} catch (e) {
					console.log(e.error)
				}
			},
			onChecked(index) {
				let num = this.cardList[index].checked ? 0 : index;
				let that = this;
				this.cardList.filter(function(obj, index) {
					obj.checked = false;
					that.cardList[num].checked = true;
				})

			},
			async bindClick(id) {
				let red = await base.delBankCard(id);
				this.getCardList();
			},
			async getCardList() {
				try {
					let res = await base.getBankList();
					// console.log(res)
					if (res.data) {
						//银行卡后四位切
						let oldarr = res.data;
						let newarr = oldarr;
						for (let i = 0; i < oldarr.length; i++) {
							newarr[i]['numbers'] = this.$common.subEndString(oldarr[i]['number'], 4)
						}
						let results = newarr;
						let sortarr = this.orderByDefault(results); //根据默认排序
						this.cardList = sortarr;
						uni.setStorageSync('cardList', this.cardList)
					} else {
						this.cardList = [];
						uni.removeStorageSync('cardList');
					}

				} catch (e) {
					if (!e) return;
					if (e.error) {
						uni.showToast({
							title: this.$t(e.error),
							icon: 'none',
							duration: 1000 //持续的时间
						});
					}
				}
			},
			orderByDefault(data) {
				let arr = [];
				let defaultItem;
				for (let i = 0; i < data.length; i++) {
					if (data[i]['isDefault'] != 1) {
						arr.push(data[i])
					} else {
						defaultItem = data[i];
					}
				}
				if (defaultItem) {
					arr.unshift(defaultItem);
				}
				return arr;
			},
			async setDefault(id) {
				let that = this;
				if (!id) return false;
				try {
					let res = await base.setDefaultBankCard(id);
					// console.log(res)
					that.getCardList();
					//隐藏滑动
				} catch (e) {
					if (!e) return;
					if (e.error) {
						uni.showToast({
							title: e.error,
							icon: 'none',
							duration: 1000 //持续的时间
						});
					}
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.dfcolor {
		color: rgba(24, 131, 213, 1)
	}

	.clearfix:after {
		content: ".";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}

	.clearfix {
		zoom: 1;
	}

	.bankCard {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		position: relative;
		overflow: hidden;

		.addCardTitle {
			width: 94%;
			height: 130upx;
			line-height: 160upx;
			margin: 0 auto;
		}

		.empty {
			width: 100%;
			height: 22upx;
		}

		.cardList {
			width: 100%;
			height: auto;

			.cardOne {
				width: 100%;
				height: 240upx;
				margin: 0 auto;
				background-size: 240upx;
				background-repeat: no-repeat;
				background-position: 75% 0upx;

				.bgStyle {
					width: 100%;
					height: 100%;
				}

				.cardHead {
					width: 100%;
					height: 100upx;
					display: flex;
					line-height: 100upx;

					.headLeft {
						width: 65%;

						.bankImage {
							width: 70upx;
							height: 50upx;
							display: block;
							background-size: 50upx;
							background-repeat: no-repeat;
							background-position: 60% 0upx;
							float: left;
							margin: 25upx 10upx 25upx 20upx;
						}
					}

					.headRight {
						width: 35%;

						.checkbox {
							width: 26upx;
							height: 26upx;
							float: left;
							display: block;
							border: 2px solid gray;
							margin: 30upx 15upx 30upx 130upx;

							.isChecked {
								width: 19upx;
								height: 19upx;
								display: block;
								margin: 4upx;
							}

						}
					}
				}

				.textSame {
					width: 100%;
					height: 60upx;
					line-height: 60upx;
					text-indent: 20upx;
				}

			}
		}

		.cardSave {
			width: 100%;
			height: 130upx;
			position: fixed;
			bottom: 0;
			left: 0;

			.add {
				width: 94%;
				// height: 60upx;
				margin: 0 auto;
			}
		}

	}
</style>
