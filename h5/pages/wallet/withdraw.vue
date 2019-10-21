<template>
	<!-- 提币 -->
	<view class="withdraw page bg-white">
		<nav-bar show="true" @back="back" @history="history"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title ex-text text-xxl">
				<text class='text-bold font-col'>提币</text>
			</view>

			<view class="selectcoin flex justify-between align-center padding-left-sm padding-right-sm">
				<text class="font-col">{{selectcoin}}</text>
				<view class="">
					<!-- <text class='select' @tap="showSinglePicker">选择币种</text> -->
					<text class='select' @tap="selectCoin">选择币种</text>
					<text style="color:#c2ddf1" class="lg text-gray icon-right"></text>
				</view>
			</view>

			<form class="wallet-form">
				<text class="label">提币地址</text>
				<view class="group flex justify-between align-center">
					<input data-id="address" maxlength="-1" placeholder="输入或长按粘贴地址" v-model="address" type="text" placeholder-class="inputplaceholder"
					 @input="clearInput" :adjust-position="adjustposition" />
					<view data-id="address" class="icon-roundclosefill" v-if="showClearIcon.address" @click="clearIcon"></view>
					<text class="margin-left lg text-gray icon-scan font-col" @tap="scan"></text>
				</view>

				<text class="label">数量</text>
				<view class="amountgroup group flex justify-between align-center">
					<view class="wrap flex flex-direction">
						<view class="addborder flex justify-between">
							<view class="width100 flex justify-between align-center text-xxl">
								<input data-id="amount" maxlength="-1" :placeholder="'最小提币数量'+ withdrawalLimit" v-model="amount" type="number"
								 placeholder-class="inputplaceholder" @input="clearInput" />
								<view data-id="amount" class="icon-roundclosefill" v-if="showClearIcon.amount" @click="clearIcon"></view>
							</view>
							<!-- <input class="" maxlength="-1" v-model="amount" placeholder="最小提币数量160" type="digit" placeholder-class="inputplaceholder" /> -->
							<view class="flex justify-end align-center basis-sm">
								<text class="coin placeholder-col text-sm">{{selectcoin}}</text>
								<text class="all padding-left text-bold font-col" @tap="selectAll">全部</text>
							</view>
						</view>
						<view class="margin-top-xs">
							<text class="variable text-sm">可用数量{{balances[selectcoin] ? balances[selectcoin]['available'] : 0}} {{selectcoin}}</text>
						</view>
					</view>
				</view>

				<text class="label">手续费</text>
				<view class="group flex justify-between align-center">
					<text class="amount font-col">{{withdrawalFee}}</text>
					<text class="coin text-sm text-bold" style="color:#99A6AE">{{selectcoin}}</text>
				</view>
			</form>
			<view class="submit">
				<view class="flex justify-between align-center text-bold font-col">
					<text class="tips">到账数量</text>
					<text>{{totalAmount}} {{selectcoin}}</text>
				</view>
				<button class="cu-btn block margin-tb-sm lg text-white" :disabled="disabled" @tap="submit">提币</button>
			</view>
		</view>
		<code-verify-new :type="type" :vAccount="vAccount" :buttonText="buttonText" @confirmTrue="toConfirm" @togglePopups="togglePopups"></code-verify-new>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype"
		 @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	import common from '@/common';
	import base from '@/api/base.js';
	import {
		mapState
	} from 'vuex';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import codeVerifyNew from '@/components/verify/codeVerifyNew.vue';
	import wallet from '@/api/wallet.js';


	export default {
		data() {
			return {
				vAccount: '',
				selectcoin: 'CSDN', //币种
				address: '', //提现地址
				amount: '', //提现金额
				amountError: '',
				disabledValue: false, //这个需固定不能为true就行
				disabledCodeValue: false,
				showClearIcon: {
					'address': false,
					'amount': false
				},
				code: '', //验证码
				type: '',
				h5Top: true,
				showmask: false, //不显遮罩
				adjustposition: true,

				account: '',
				buttonText: '提交',
				withdrawalLimit: 0,
				withdrawalFee: 0,
				apiError: '', //接口错误
				errortype: '',
				succmsg: '',
			}
		},
		components: {
			codeVerifyNew
		},
		computed: {
			...mapState(['coins', 'balances', 'mobile', 'email']),
			disabled: function() {
				return (this.selectcoin && this.address && this.amount) ? (this.disabledValue ? true : false) : true
			},
			errormsg: function() {
				if (this.amountError || this.apiErrorValue) {
					return this.amountError+' '+this.apiErrorValue;
				} else {
					return '';
				}
			},
			apiErrorValue:function(){//即时弹出
				if(this.apiError){
					this.errortype = 'top';
					return this.apiError;
				}else{
					return '';
				}
			},
			succmsgValue:function(){//即时弹出
				if(this.succmsg){
					this.errortype = 'top';
					return this.succmsg;
				}else{
					return '';
				}
			},
			disabledCode: function() {
				return (this.code) ? (this.disabledCodeValue ? true : false) : true
			},
			totalAmount: function() {
				let sxf = this.$common.toPoint(this.coins[this.selectcoin]['withdrawalFee'], this.amount) //计算手续费
				console.log(this.sxf)
				let amount = parseFloat(this.amount)
				if (amount - sxf > 0) {
					return this.$tools.util.autoFloat(amount - sxf)
				} else {
					return 0
				}

			}
		},
		onLoad(options) {
			if (options.selectcoin) {
				this.selectcoin = options.selectcoin
			}
			console.log(this.balances)
		},
		onShow() {
			this.withdrawalLimit = this.coins[this.selectcoin]['withdrawalLimit'] || 0;
			this.withdrawalFee = this.coins[this.selectcoin]['withdrawalFee'] || 0;
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			if (currPage.name) {
				this.selectcoin = currPage.name;
			}
		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			if (index === 0) {
				uni.navigateBack({
					delta: 1,
				})
			} else {
				uni.navigateTo({
					//url: "/pages/wallet/history?coin=" + this.selectcoin + "&type=-1"
					url: "/pages/wallet/history?coin=" + this.selectcoin,
				})
			}
		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			scan() {
				this.apiError = '';
				this.succmsg = '';
				uni.hideKeyboard();

				let that = this;
				//#ifdef APP-PLUS
				uni.scanCode({
					scanType: ['qrCode'],
					success(res) {
						console.log('扫码类型：' + res.scanType);
						console.log('扫码内容：' + res.result);
						console.log('扫码路径' + res.path)

						//this.dataset = res.result;
						console.log('扫码结果' + res.result); //http://g7t4bf.natappfree.cc/#/pages/pay/pay?type=pay&uid=88&amount=
						if (!res.result) return
						let result = res.result;
						let address;
						let amount;
						if (result.indexOf('|') != -1) {
							let data = result.split('|');
							if (!data) return false;
							address = data[0];
							amount = data[1];
						} else {
							address = result;
							amount = '';
						}
						that.amount = amount;
						that.address = address;
					},
					fail(e) {
						that.apiError = '扫码失败，请重新扫码';
						//common.util.showToast('扫码失败，请重新扫码')
					},
					complete(e) {
						// console.log(e)
					}
				})
				//#endif
			},
			togglePopups(type) { //监听取消按钮
				this.authCode = '';
				this.type = type;
			},
			toConfirm(authCode) {
				this.code = authCode;
				this.submit();
			},
			history() {
				uni.navigateTo({
					//url: "/pages/wallet/history?coin=" + this.selectcoin + "&type=-1"
					url: "/pages/wallet/history?coin=" + this.selectcoin,
				})
			},
			selectCoin() {
				uni.navigateTo({
					url: '/pages/wallet/selectCoin?jumpUrl=withdraw'
				})
			},
			clearInput: function(event) {
				let id = event.target.dataset.id;
				if (event.target.value.length > 0) {
					this.showClearIcon[`${id}`] = true;
				} else {
					this.showClearIcon[`${id}`] = false;
				}
			},
			clearIcon: function(event) {
				let id = event.target.dataset.id;
				this[`${id}`] = '';
				this.showClearIcon[`${id}`] = false;
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			clearData() {
				this.address = '';
				this.amount = '';
			},
			async submit() {
				this.succmsg = '';
				this.apiError = '';
				if (!(this.selectCoin && this.amount && this.address)) return false;
				if (this.errormsg) {
					this.errortype = 'top';
					return false;
				}
				this.disabledValue = true;
				try {
					//let res = await base.withdraw(
					let res = await wallet.withdraw(
						this.address,
						this.amount,
						this.selectcoin,
						this.code
					);
					//common.util.showToast('提币成功');
					this.succmsg = '提币成功';
					this.type = ''; //隐藏验证码框
					//更新余额
					this.$store.commit('getBalances');
					this.disabledValue = false;
				} catch (e) {
					this.disabledValue = false;
					if (!e) {
						this.apiError = this._consts.networkFail;
						return false;
					}
					if (e.error) {
						//common.util.showToast(this.$t(e.error))
						this.apiError = this.$t(e.error);
					}
					if (e.verify) { //验证类型
						this.type = 'bottom';
						this.vAccount = e.verify;
					}
					
				}
			},
			selectAll() {
				this.amount = this.balances[this.selectcoin]['available']
			},
			// 单列
			showSinglePicker() {
				this.pickerValueArray = this.pickerSingleArray
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			onCancel(e) {
				console.log(e)
			},
			onConfirm(e) {
				console.log(e)
				this.pickerText = JSON.stringify(e)
				this.selectcoin = e.label
			},
			//单列
		},
		watch: {
			amount: function(val) {
				val = parseFloat(val)
				if (val < this.coins[this.selectcoin]['withdrawalLimit']) { //检测提币最小额
					this.amountError = '最小提币数量' + this.coins[this.selectcoin]['withdrawalLimit']
				} else if (this.totalAmount > this.balances[this.selectcoin]['available']) { //到账数量大于余额
					this.amountError = '余额不足'
				} else if (this.totalAmount == 0) {
					this.amountError = '数量需大于手续费'
				} else {
					this.amountError = ''
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.withdraw {
		// position: relative;

		.selectcoin {
			background-color: #f7f6fb;
			margin-top: 67upx;
			margin-bottom: 60upx;

			.select {
				color: #98a6b3;
			}

			text {
				line-height: 80upx;
			}

		}

		form {
			.amountgroup {
				border-bottom: 0 none;
			}

			.wrap {
				width: 100%;

				.addborder {
					border-bottom: 1px solid #f0eff3;
					padding-bottom: 10upx;
				}

				.coin {
					border-right: 1px solid #f0eff3;
					padding-right: 20upx;
				}

				.variable {
					color: #c6cfd6;
				}

			}

			.amouts {
				border: none;
			}

			.sxf {
				.coin {
					color: #99a6ae;
					margin-bottom: 10upx;
				}
			}
		}

		.submit {
			margin-top: 200upx;

			.tips {
				color: #8c9fad;
			}
		}
	}
</style>
