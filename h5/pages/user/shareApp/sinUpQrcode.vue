<template>
	<!--二维码-->
	<view id="" class="page bg-white">
		<good-nav-bar show="true">
			<block slot="backIcon">
				<text class="icon iconfont icon-fanhui1 font-gray" @tap="back"></text>
			</block>
			<block slot="content">分享app二维码</block>
		</good-nav-bar><!-- 自定义导航 -->
		<view class="qrcode flex flex-direction justify-between align-center">
			<view class="pic">
				<tki-qrcode ref="qrcode" :val="val" :size="size" :lv="lv" :onval="onval"
				 :loadMake="loadMake" @result="qrR" />
			</view>
			<text class="text-xl margin-tb">扫一扫，分享app</text>
			<button class="tag-read cu-btn lg round bg-blue margin-top-xl" :data-clipboard-text="val" @tap="copy">
				复制链接
			</button>
		</view>
		
		<!-- <textarea id="copy">复制链接成功</textarea> -->

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
    import common from "@/common";
	import config from '@/config';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	import Clipboard from "clipboard";
	export default {
		data() {
			return {
				val: '', // 要生成的二维码值
				size: 260, // 二维码大小
				icon: '', // 二维码图标
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
			}
		},
		computed:{
			...mapState(['uid']),
		},
		methods: {
			back(){
				uni.navigateBack({
					delta:1,
				})
			},
			qrR(res) {
				this.src = res
			},
			createQrcode() { //显示二维码
			
				this.val = this.$tools.base64.utf16to8(
					config.webUrl + "/#/pages/login/register/register?referrerId=" + this.uid 
				)
				console.log(this.val)
			},
			copy(){
				if (this.val) {
					//#ifdef H5
					let clipboard = new Clipboard(".tag-read");
					clipboard.on("success", e => {
						// 释放内存
						clipboard.destroy();
						common.util.showToast("复制成功");
					});
					clipboard.on("error", e => {
						// 不支持复制
						common.util.showToast("该浏览器不支持自动复制");
						// 释放内存
						clipboard.destroy();
					});

					//#endif
					
					//#ifdef APP-PLUS
					uni.setClipboardData({
						data: this.val,
						success: () => {
							common.util.showToast('复制成功')
						},
						fail: () => {
							common.util.showToast('复制失败')
						}
					});
					//#endif
					
				} else {
					common.util.showToast('复制内容不能为空')
				}
			}
		},
		onShow() {
			this.createQrcode();
		},
		components: {
			tkiQrcode
		}
	}
</script>

<style lang="less" scoped>
	.qrcode{
		margin-top:200upx;
	}
</style>