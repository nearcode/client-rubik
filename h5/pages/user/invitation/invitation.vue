<template>
	<view class="invitation page">
		<good-nav-bar show="true">
			<block slot="backIcon">
				<text class="icon iconfont icon-fanhui1 font-gray" @tap="back"></text>
			</block>
			<block slot="content">邀请好友返佣金</block>
		</good-nav-bar><!-- 自定义导航 -->
		
		<view class="warp bg-white">
			<image class="invitationImg" src="../../../static/image/invitation/shareImg.png"></image>
			<view class="share shadow">
				<view class="shareText titleColor text-bold text-xl">分享幸运,就这一次</view>
				<view class="shareTo flex justify-center align-center">
					<view class="pic margin-top-xl">
						<tki-qrcode ref="qrcode" :val="val" :size="size" :lv="lv" :onval="onval"
						 :loadMake="loadMake" @result="qrR" />
					</view>
					<!-- <view class="shareToList"  @tap="shares('weixin','WXSceneSession')">
						<image src="../../../static/image/invitation/weixin.png" mode="scaleToFill" class="shareImg"></image>
						<text class="shareToText">微信好友</text>
					</view>
					<view class="shareToList"  @tap="shares('weixin','WXSenceTimeline')">
						<image src="../../../static/image/invitation/weixinFriends.png" mode="scaleToFill" class="shareImg"></image>
						<text class="shareToText">微信朋友圈</text>
					</view> -->
					<!-- <view class="shareToList">
						<image src="../../../static/image/invitation/createImg.png" mode="scaleToFill" class="shareImg"></image>
						<text class="shareToText">生成美图</text>
					</view> -->
				</view>
			</view>
			<view class="reward text-lg text-bold text-black"><text class="tiao margin-right-sm">一</text>&nbsp; <text class="titleColor">已获奖励</text> &nbsp;<text class="tiao margin-left-sm">一</text></view>
			<view class="reward text-df text-gray">已成功邀请到<text class="text-blue">{{count+'名'}}</text>小伙伴
			<!-- 共获得<text class="text-blue">10%</text>的佣金奖励 -->
			</view>
			<!-- <swiper class="sharePeople" autoplay="true" vertical="true" circular="true" v-if="count">
				<swiper-item v-for="(item,index) in dataList" :key="index">
					<view class="swiper-item flex justify-between align-center clearfix">
						<text class="flex-sub text-df text-gray">{{item.uid}}</text>
						<text class="text-df text-gray">{{item.create | formatTime('yyyy-MM-dd hh:mm')}}</text>
					</view>
				</swiper-item>
			</swiper> -->
			<!-- <view class="sharePeople text-df" v-else style="text-align: center;">
				还没邀请到小伙伴加入
			</view> -->
			
			<view class="cu-list menu padding-lr-xl">
				<view class="cu-item" v-for="(item,index) in dataList" :key="index">
					<view class="content">
						<text class="cu-tag margin-right">{{index+1}}</text>
						<text>{{item.uid}}</text>	
					</view>
					<view class="action">
						{{item.create | formatTime('yyyy-MM-dd hh:mm')}}
					</view>
				</view>
			</view>
			
			
			<view class="message">
				<view class="reward text-lg text-bold text-black"><text class="tiao margin-right-sm">一</text>&nbsp; <text class="titleColor">活动细则</text> &nbsp;<text class="tiao margin-left-sm">一</text></view>
				<view class="messageList text-df text-gray">1.对于每一个您推荐来的用户，我们的奖励您，具体奖励见公告。</view>
				<view class="messageList text-df text-gray">2.我们奖为您单独生成一个链接，您可将此链接分享给您的朋友用以注册，系统将标识使用此链接注册的用户是您推荐的。</view>
				<view class="messageList text-df text-gray">3.不允许传播任何误导消息或作出任何有损{{title}}品牌的行为。</view>
				<view class="messageList text-df text-gray">4.对于滥用此推荐奖励机制的帐户，我们将做冻结处理，且不会提前发出通知。</view>
			</view>
			
		</view>
	</view>
</template>
 
<script>
	import base from '@/api/base.js';
	import {mapState} from 'vuex';
	import config from '@/config';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	export default {
		data() {
			return {
				dataList:[],
				val: '', // 要生成的二维码值
				size: 260, // 二维码大小
				icon: '', // 二维码图标
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				count:0,
			}
		},
		components: {
			tkiQrcode
		},
		computed:{
			...mapState(['uid','title']),
		},
		onLoad() {
			this.$store.commit('getInfo');
			
		},
		async onShow() {
			this.createQrcode();
			this.dataList = uni.getStorageSync("referrer") || [];
			this.dataList = await this.getReferrer();
			uni.setStorageSync("referrer",this.dataList)
		},
		methods: {
			qrR(res) {
				this.src = res
			},
			createQrcode() { //显示二维码
				this.val = this.$tools.base64.utf16to8(
					config.webUrl + "/#/pages/login/register/register?referrerId=" + this.uid 
				)
				console.log(this.val)
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			shares(id,type){
				console.log(id,type)
				//#ifdef APP-PLUS
				this.share({
					id:id,
					type:type,
				})
				//#endif
			},
			share(e){
				plus.nativeUI.showWaiting("加载中...");
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log('loginRes')
						console.log(loginRes)
						uni.share({
							provider: e.id,
							title: "邀好友返佣金",
							scene: e.type, //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏     
							//imageUrl: this.src,//需转为path路径https://xinfubao.oss-cn-hangzhou.aliyuncs.com/20190323/1553305252843917361.png
							imageUrl: config.webUrl + '/static/logo_little.png',
							summary: "邀请好友，高额奖金转不停",
							href: config.webUrl + '/#/pages/login/register/register?referrerId='+that.uid,
							success: function(res) {
								console.log("success:" + JSON.stringify(res));
							},
							fail: function(err) {
								console.log("fail:" + JSON.stringify(err));
								if (process.env.NODE_ENV == 'development') {
									common.util.showToast('分享失败' + JSON.stringify(err));
								} else {
									common.util.showToast('分享失败')
								}
							}
						});
						
					},
					fail: function(e) {
						console.log(e)
						common.util.showToast('微信登录失败');
					},
					complete() {
						console.log('111')
						plus.nativeUI.closeWaiting();
					}
				});
			},
			async getReferrer(){
				let dataList = [];
				try{
					let res = await base.getReferrer();
					this.count = res.count || 0;
					if(res.data)
					dataList = res.data;
					return dataList;
				}catch(e){
					return dataList;
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.tiao{
		color:#9FA6AC;
	}
	.titleColor{
		color:#1F3F58;
	}
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
	.invitation{
		width: 100%;
		// min-height: 100vh;
		// height: 100%;
		background-color: #F4F4F4;
		.warp{
			width: 94%;
			height: 100%;
			margin:0 auto;
			.invitationImg{
				width: 100%;
				height: 600upx;
				overflow: hidden;
			}
			.share{
				width: 88%;
				// height: 370upx;
				height: 450upx;
				margin: 0 auto;
				border: 1px solid #eee;
				border-top: none;
				.shareText{
					width: 100%;
					height: 140upx;
					line-height: 170upx;
					text-align: center;
					
				}
				.shareTo{
					width: 100%;
					height: 230upx;
					// border: 1px solid red;
					display: flex;
					.shareToList{
						width: 33.3%;
						height: 100%;
						// border: 1px solid red;
						margin: 0 auto;
						.shareImg{
							width: 100upx;
							height: 100upx;
							display: block;
							margin: 25upx auto;
						}
						.shareToText{
							width: 100%;
							height: 60upx;
							display: block;
							// line-height: 60upx;
							text-align: center;
						}
					}
				}
			}
			
			.reward{
				width: 100%;
				height: 70upx;
				// border: 1px solid red;
				margin: 20upx auto;
				text-align: center;
				line-height: 70upx;
				overflow: hidden;
			}
			.sharePeople{
				width: 100%;
				height: 90upx;
				// border: 1px solid red;
				line-height: 90upx;
				.headImg{
					width: 72upx;
					height: 72upx;
					border-radius: 72upx;
					float: left;
					margin: 9upx 11upx;
				}
				.userName{
					width: 330upx;
					height: 100%;
					display: block;
					float: left;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.time{
					width: 260upx;
					height: 100%;
					display: block;
					float: left;
					text-align: right;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.message{
				width: 95%;
				height: auto;
				border-top: 1px solid #ccc;
				margin: 50upx auto;
				.messageList{
					line-height: 50upx;
					margin-top: 10upx;
				}
			}
		}
	}
</style>
