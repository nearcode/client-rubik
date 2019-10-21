<template>
	<!-- 侧边栏 -->
	<view class="sidebar">
		<!-- #ifdef APP-PLUS -->
		<nav-bar show="false"></nav-bar>
		<!-- #endif -->
		<view class="sidebarWrap">
			<view class="sidbarHead">
				<view class="headImgWarp flex justify-start align-center">
				<!-- 	<image class="cu-avatar xl round sidbarMargin" src="../../static/head.jpg"></image> -->
					<text class="logoimg icon iconfont icon-userlogo" style="color:#215481"></text>
				</view>
				<text class="userName font-color text-bold">HI:{{mobile || email}}</text>
				<text class="userCode font-color">UID:{{uid}}</text>
				<!-- <navigator url="/pages/user/shareApp/shareApp">22</navigator> -->
			</view>

			<view class="iconWrap">
				<view class="iconOne font-color" @tap="addCoin">
					<text class="iconSame icon iconfont icon-3"></text>
					<text class="textSame">充值</text>
				</view>
				<view class="iconOne font-color" @tap="withdraw">
					<text class="iconSame icon iconfont icon-tixian"></text>
					<text class="textSame">提现</text>
				</view>
				<view class="iconOne font-color" @tap="transfer">
					<text class="iconSame icon iconfont icon-querenzhangdan"></text>
					<text class="textSame">转帐</text>
				</view>
			</view>

			<view class="sideListOne font-color">
				<view class="listOne clearfix" v-for="(item,index) in tabIsShow" :key="index" v-show="item.isShow">
					<text style="color:rgba(24,131,213,1)" class="listIcon icon" :class="item.icon"></text>
					<text class="listName text-df" @click="go(item.code)">{{item.name}}</text>
				</view>
			</view>
			<view class="sideListOne font-color">
				<view class="listOne clearfix" v-for="(item,index) in menuList1" :key="index">
					<text class="listIcon listIconStyle icon" :class="item.icon"></text>
					<text class="listName text-df" @click="go(item.code)">{{item.name}}</text>
				</view>
			</view>
			
			<view class="flex margin-top margin-left" style="width:90%">
				<button style="background-color:rgb(33, 84, 129)" class="cu-btn lg flex-sub text-white" @tap="loginOut">退出</button>
			</view>
		</view>

		<!-- <uni-popup :show="type === 'bottom-share'" position="bottom" @hidePopup="togglePopup('')" class="share-uni-popup">
			<view class="bottom-title" style="font-size:40upx">分享到</view>
			<view class="bottom-content">
				<button v-for="(value,index) in providerList" :key="index" class="height140 flexc bottom-content-box" @tap="share(value)">
					<view :class="value.name" class="bottom-content-image">
						<i style="font-size:35upx" class="margin-r30 icon iconfont" :class="value.icon"></i>
					</view>
					<view class="bottom-content-text" style="font-size:35upx">{{ value.name }}</view>
				</button>
			</view>
			<view class="bottom-btn" @click="togglePopup('')" style="font-size:30upx">取消分享</view>
		</uni-popup> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	// import uniPopup from '@/components/uni-popup/uni-popup.vue';

	export default {
		data() {
			return {
				menuList: [{
						icon: 'iconfont icon-dingdanguanli',
						name: '订单管理',
						code: "orderManage",
						isShow: false
					},
					// {
					// 	icon: 'iconfont icon-exchange',
					// 	name: 'C2C交易',
					// 	code: "C2C",
					// 	isShow: false
					// },
					// {
					// 	icon: 'iconfont icon-guanli',
					// 	name: 'C2C管理',
					// 	code: "C2CManage",
					// 	isShow: false
					// },
					{
						icon: 'iconfont icon-icon',
						name: '身份认证',
						code: "userCA",
						isShow: false
					},
					{
						icon: 'iconfont icon-qiabao',
						name: '银行卡',
						code: "bankCard",
						isShow: false
					},
					{
						icon: 'iconfont icon-shuo',
						name: '锁仓管理',
						code: "lock",
						isShow: false
					},
					{
						icon: 'iconfont icon-liwu',
						name: '邀请返佣',
						code: "invitation",
						isShow: false
					}
				],
				menuList1: [{
						icon: 'iconfont icon-anquan',
						name: '安全中心',
						code: "safetyCenter"
					},
					{
						icon: 'iconfont icon-emiguanyuwomen',
						name: '关于我们',
						code: "aboutUs"
					},
					{
						icon: 'iconfont icon-icon--',
						name: '设置',
						code: "setUp"
					},
					{
						icon: 'icon-share',
						name: '分享app',
						code: "shareApp"
					}
				],

				providerList: [], //分享通道
				type: '',
			}
		},
		components: {
			// uniPopup
		},
		computed: {
			...mapState(['mobile', 'uid','email','serviceProvider']),
			tabIsShow() {
				let that = this,
					flag;
					
				if(Object.keys(this.serviceProvider).length != 0){
					flag = this.serviceProvider.merchant
				}
				
				if (flag) {
					for (let i = 0; i < that.menuList.length; i++) {
						that.menuList[i].isShow = true;
					}
					return that.menuList;
				} else {
					for (let i = 0; i < that.menuList.length; i++) {
						if (that.menuList[i].code == "C2C" || that.menuList[i].code == "C2CManage") {
						// if (that.menuList[i].code == "C2CManage") {
							that.menuList[i].isShow = false;
						} else {
							that.menuList[i].isShow = true;
						}
					}
					return that.menuList;
				}
			}
		},
		onLoad() {

			//获取分享通道
			// uni.getProvider({
			// 	service: 'share',
			// 	success: (e) => {
			// 		console.log('success', e);
			// 		let data = []
			// 		for (let i = 0; i < e.provider.length; i++) {
			// 			switch (e.provider[i]) {
			// 				case 'weixin':
			// 					data.push({
			// 						name: '微信好友',
			// 						id: 'weixin',
			// 						type: 'WXSceneSession',
			// 						icon: 'icon-1',
			// 						sort: 0
			// 					})
			// 					data.push({
			// 						name: '微信朋友圈',
			// 						id: 'weixin',
			// 						type: 'WXSenceTimeline',
			// 						icon: 'icon-icon-',
			// 						sort: 1
			// 					})
			// 					data.push({
			// 						name: '微信收藏',
			// 						id: 'weixin',
			// 						type: 'WXSceneFavorite',
			// 						icon: 'icon-uniE901',
			// 						sort: 2
			// 					})
			// 					break;
			// 				case 'sinaweibo':
			// 					// data.push({
			// 					// 	name: '分享到新浪微博',
			// 					// 	id: 'sinaweibo',
			// 					// 	sort:2
			// 					// })
			// 					break;
			// 				case 'qq':
			// 					// data.push({
			// 					// 	name: '分享到QQ',
			// 					// 	id: 'qq',
			// 					// 	sort:3
			// 					// })
			// 					break;
			// 				default:
			// 					break;
			// 			}
			// 		}
			// 		this.providerList = data.sort((x, y) => {
			// 			return x.sort - y.sort
			// 		});
			// 	},
			// 	fail: (e) => {
			// 		console.log('获取分享通道失败', e);
			// 	}
			// });
		},
		methods: {
			// togglePopup(type) {
			// 	this.type = type
			// },
			addCoin() {
				uni.navigateTo({
					url: '/pages/wallet/selectCoin?jumpUrl=addCoin'
				})
			},
			withdraw() {
				uni.navigateTo({
					url: '/pages/wallet/selectCoin?jumpUrl=withdraw'
				})
			},
			transfer() {
				uni.navigateTo({
					url: '/pages/wallet/selectCoin?jumpUrl=transfer'
				})
			},
			go: function(e) {
				// console.log(e)
				let goUrl = e
				if (goUrl == "C2C") {
					uni.switchTab({
						url: '/pages/' + goUrl + '/' + goUrl
					})
				} else if (goUrl == "C2CManage") {
					uni.navigateTo({
						url: '/pages/' + goUrl + '/' + goUrl
					})
				} else if (goUrl == "bankCard") {
					uni.navigateTo({
						url: '/pages/user/' + goUrl + '/index'
					})
				} else if (goUrl == "shareApp") {
					//去分享
					uni.navigateTo({
						url:'/pages/user/shareApp/sinUpQrcode'
					})
					// this.togglePopup('bottom-share');
				} else if(goUrl == 'orderManage'){
					uni.navigateTo({
						url: '/pages/user/' + goUrl + '/' + 'index'
					})
				}else if(goUrl == 'userCA'){
					uni.navigateTo({
						url: '/pages/user/' + goUrl 
					})
				} else if(goUrl == 'lock'){
					uni.navigateTo({
						url: '/pages/user/' + goUrl + '/index'
					})
				} else {
					uni.navigateTo({
						url: '/pages/user/' + goUrl + '/' + goUrl
					})
				}

			},
			loginOut() {
				this.$store.commit('loginOut');
			},
			share() {
				
				// var that = this
				// console.log('分享路径' + config.shareAppUrl)
				// uni.login({
				// 	provider: e.id,
				// 	success: function(loginRes) {
				// 		uni.share({
				// 			provider: e.id,
				// 			title: 'EXAPP',
				// 			scene: e.type, //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏     
				// 			//imageUrl: this.src,//需转为path路径https://xinfubao.oss-cn-hangzhou.aliyuncs.com/20190323/1553305252843917361.png
				// 			imageUrl: config.webUrl + '/static/logo_little.png',
				// 			href: config.shareAppUrl,
				// 			summary: '打造全球支付，游戏，应用等一体化区块链交易所',
				// 			success: function(res) {
				// 				console.log("success:" + JSON.stringify(res));
				// 			},
				// 			fail: function(err) {
				// 				console.log("fail1:" + JSON.stringify(err));
				// 				if (process.env.NODE_ENV == 'development') {
				// 					common.util.showToast('分享失败' + JSON.stringify(err));
				// 				} else {
				// 					common.util.showToast('分享失败')
				// 				}
				// 			}
				// 		});
				// 	},
				// 	fail: function(e) {
				// 		console.log(JSON.stringify(e))
				// 		if (process.env.NODE_ENV == 'development') {
				// 			common.util.showToast('错误提示' + JSON.stringify(e))
				// 		} else {
				// 			common.util.showToast('分享失败')
				// 		}
				// 	}
				// });
			}
		},


	}
</script>

<style lang="less" scoped>

	.sidebar {
		width: 100%;
		// height: 100vh;
		padding-bottom:50upx;
		.sidebarWrap {
			width: 100%;
			height: 100%;
			.sidbarHead {
				width: 100%;
				height: 280upx;
				background-color:rgba(247,246,251,1);

				.headImgWarp {
					width: 100%;
					height: 160upx;
					text-indent: 30upx;
                    .logoimg{
						font-size:145upx;
					}
					.sidbarMargin {
						display: block;
						float: left;
						margin: 18upx 0 10upx 40upx;
					}
				}

				.userName {
					width: 96%;
					height: 50upx;
					display: block;
					font-size: 30upx;
					text-indent: 40upx;
					line-height: 50upx;
					overflow: hidden;
				}

				.userCode {
					width: 96%;
					height: 40upx;
					display: block;
					font-size: 26upx;
					text-indent: 40upx;
					line-height: 40upx;
					overflow: hidden;
				}
			}

			.iconWrap {
				width: 100%;
				height: 160upx;
				display: flex;

				.iconOne {
					width: 25%;
					height: 100%;
					margin: 0 auto;

					.iconSame {
						width: 75upx;
						height: 75upx;
						display: block;
						font-size: 75upx;
						margin: 20upx 20upx 0 30upx;
					}

					.textSame {
						width: 100%;
						height: 50upx;
						line-height: 50upx;
						font-size: 26upx;
						display: block;
						text-align: center;
					}
				}
			}

			.sideListOne {
				width: 100%;
				height: auto;
				border-top: 1px solid #F7F6FB;
				line-height: 80upx;

				.listOne {
					width: 100%;
					height: 80upx;
				}

				.listIcon {
					width: 80upx;
					display: block;
					text-align: center;
					float: left;
					height:80upx;
					line-height:80upx;
				}

				.listName {
					width: 300upx;
					display: block;
					float: left;
				}

			}
		}
	}
</style>
