<template>
	<!-- 充币 -->
	<view class="addcoin bg-white page">
		<nav-bar show="true" @back="back" @history="history"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title ex-text text-xxl">
				<text class='font-col text-bold'>充币</text>
			</view>

			<view class="selectcoin flex justify-between align-center padding-left-sm padding-right-sm">
				<text class="font-col">{{selectcoin}}</text>
				<view class="">
					<!-- <text class='select' @tap="showSinglePicker">选择币种</text> -->
					<text class='select' @tap="selectCoin">选择币种</text>
					<text style="color:#c2ddf1" class="lg text-gray icon-right"></text>
				</view>
			</view>

			<view class="qrcode flex flex-direction justify-center align-center">
				<!-- <image src="/static/image/qrcode.png"></image> -->

				<tki-qrcode v-if="val" ref="qrcode" :val="val" :size="size" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval"
				 :loadMake="loadMake" @result="qrR" />

				<view class="save margin-bottom-xl flex justify-center">
					<text class='text-df' @tap="save">保存二维码至相册</text>
				</view>
				<view class="address flex flex-direction justify-center align-center">
					<text class='text-grey text-sm margin-bottom'>充币地址</text>
					<text class='text-grey text-sm margin-bottom'>{{address}}</text>
					<button class="tag-read cu-btn bg-grey" :data-clipboard-text="address" @tap="copy">复制</button>
				</view>
			</view>

			<!-- <view class="tips margin-top">
			<text class='text-sm'>请勿向上述地址充值任何非BAT资产，否则资产将不可找回。您充值至上述地址后，需要整个网络节点的确认，15次网络确认后到账，30次网络确认后可提币。最小充值金额：5BAT，小于最小金额的充值将不会上账且无法退回。您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。请务必确认电脑及浏览器安全，防止信息被篡改或者泄露。BAT充币仅支持以太坊transfer和transferFrom方法，使用其他方法的充币暂时无法上账，请您谅解。</text>
		</view> -->
		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype" @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype"
		 @hideMsg="hideMsg"></show-msg>
	</view>
</template>

<script>
	import common from '@/common';
	import base from '@/api/base.js';
	import config from '@/config';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	// import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import {
		mapState
	} from 'vuex';
	import Clipboard from "clipboard";
	import wallet from '@/api/wallet.js';

	export default {
		data() {
			return {
				selectcoin: '',
				address: '',
				/*二维码*/
				val: "", // 要生成的二维码值
				size: 330, // 二维码大小
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				amount: '123',
				// /*二维码*/
				msg: '',
				qrcodeSrc: '',
				type: '',
				h5Top: true,
				showmask: false, //不显遮罩
				code: '',
				codeTime: 0,
				disabledCodeValue: false,
				apiError: '', //接口错误
				errortype: '',
				succmsg: '',

			}
		},
		components: {
			// uniPopup,
			tkiQrcode,

		},
		computed: {
			...mapState(['mobile', 'email']),
			account: function() {
				if (this.mobile) return this.mobile
				if (this.email) return this.email
			},
			disabledCode: function() {
				return (this.code) ? (this.disabledCodeValue ? true : false) : true
			},
			errormsg: function() {//收集弹出
				if (this.apiErrorValue) {
					return this.apiErrorValue
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
			}
		},
		onLoad(options) {
			if (options.selectcoin) {
				this.selectcoin = options.selectcoin
			}
		},
		onShow() {
			// uni.showLoading({title: '加载中'});
			// uni.hideLoading();
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			if (currPage.name) {
				this.selectcoin = currPage.name;
			}
			this.address = uni.getStorageSync(`${this.selectcoin}_address`) || '';
			this.getAddress(); //获取提币地址
		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			if (index === 0) {
				uni.navigateBack({
					delta: 1,
				})
			} else {
				uni.navigateTo({
					//url: "/pages/wallet/history?coin=" + this.selectcoin + "&type=1"
					url: "/pages/wallet/history?coin=" + this.selectcoin,
				})
			}
		},
		methods: {
			hideMsg(type) {
				this.errortype = type;
			},
			history() {
				uni.navigateTo({
					//url: "/pages/wallet/history?coin=" + this.selectcoin + "&type=1"
					url: "/pages/wallet/history?coin=" + this.selectcoin,
				})
			},
			togglePopup(type) {
				this.type = type
			},
			selectCoin() {
				uni.navigateTo({
					url: '/pages/wallet/selectCoin?jumpUrl=addCoin'
				})
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			//二维码
			save() {
				//清空数据
				this.succmsg = '';
				this.apiError = '';
				if (!this.src) {
					this.apiError  = '保存失败';
					return false;
				}
				var that = this
				//#ifdef APP-PLUS
				uni.saveImageToPhotosAlbum({
					filePath: that.src,
					success: function() {
						that.succmsg = '已保存到相册';
					}
				});
				//#endif
			},
			qrR(res) {
				this.src = res
			},
			createQrcode(text) {
				this.val = this.$tools.base64.utf16to8(
					text
				)
			},
			//二维码
			copy() {
				//清空数据
				this.succmsg = '';
				this.apiError = '';
				var that = this
				if (this.address) {
					//#ifdef H5
					let clipboard = new Clipboard(".tag-read");
					clipboard.on("success", e => {
						// 释放内存
						clipboard.destroy();
						that.succmsg = '复制成功';
						// common.util.showToast("复制成功");
					});
					clipboard.on("error", e => {
						// 不支持复制
						that.apiError = '该浏览器不支持自动复制';
						// common.util.showToast("该浏览器不支持自动复制");
						// 释放内存
						clipboard.destroy();
					});

					//#endif

					//#ifdef APP-PLUS
					uni.setClipboardData({
						data: this.address,
						success: () => {
							//common.util.showToast('复制成功')
							that.succmsg = '复制成功'
						},
						fail: () => {
							this.apiError = '复制失败'
							//common.util.showToast('复制失败')
						}
					});
					//#endif
				} else {
					//common.util.showToast('复制的内容不能为空')
					that.apiError = '复制的内容不能为空'
				}

			},
			async getAddress() {
				//清空数据
				this.succmsg = '';
				this.apiError = '';
				uni.showLoading({
					title: '加载中...'
				})
				try {
					let res = await wallet.addCoin(this.selectcoin);
					if (res.data) {
						this.address = res.data
						this.createQrcode(res.data) //生成二维码
						uni.setStorageSync(`${this.selectcoin}_address`, res.data)
					}
					uni.hideLoading();
				} catch (e) {
					uni.hideLoading();
					if (!e) {
						this.apiError = this._consts.networkFail;
						return false;
					}
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.addcoin {

		.selectcoin {
			background-color: #f7f6fb;
			margin-bottom: 67upx;
			margin-top: 67upx;

			.select {
				color: #98a6b3;
			}

			text {
				line-height: 80upx;
			}

		}

		.qrcode {
			padding-top: 60upx;
			padding-bottom: 60upx;
			background-color: #f7f6fb;

			image {
				width: 332upx;
				height: 329upx;
			}

			.save {
				border: 1px solid #b2cdf2;
				background-color: #e9f0fa;
				margin-top: 60upx;
				width: 276upx;

				text {
					color: #006acc;
					line-height: 75upx;
				}
			}

			button {
				// width:100upx;
				height: 50upx;
				font-size: 24upx;
			}
		}

		.tips {
			color: #8d9dab;
		}
	}
</style>
