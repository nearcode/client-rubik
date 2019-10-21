<template>
	<view class="searchCoin page bg-white">
		<!-- 顶部栏 -->
		<nav-bar show="false"></nav-bar>
		<view class="searchWrap flex justify-start align-center">
			<input class="searchInp text-df font-gray" type="text" placeholder="搜索币种" selection-start="10" v-model="searchTxt" placeholder-class="inpl-grey"/>
			<text class="searchIcon icon iconfont icon-unie036 font-gray"></text>
			<text class="btnClose font-gray text-bold" @click="cancel">取消</text>
		</view>
		<view class="searchContent">
			<view class="latelySee text-df text-grey">最近查看</view>
			<view class="seeContent">
				<view v-for="(item,index) in seeList" :key="index" class="flex justify-between align-center">
					<text class="coinOne text-lg text-bold text-grey" @click="searchCoinType(item.market)">{{item.market}}</text>
					<text :class="item.favorites == 1?'icon iconfont icon-shoucang':'icon iconfont icon-shoucang1'" class="add text-gray text-center" @tap="add(item.market)"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/nav/nav.vue';
	import { mapState } from 'vuex';
	export default{
		data(){
			return{
				isFocus:true,
				searchTxt:'',
				fromUrl:'',
			}
		},
		components:{
			navBar,
		},
		computed:{
			...mapState(['markets','favorites']),
			seeList(){
				return this.getSeeList(this.searchTxt);
			}
		},
		onLoad(options) {
			this.fromUrl = options.fromUrl
		},
		onShow() {
			this.$store.commit("getMarkets");
		},
		methods:{
			getSeeList(val){
				let seelist = [];
				if(val==''){
					seelist =  uni.getStorageSync('myCoin') || []; //myCoin需要过滤掉markets里面没有得币？
				}else{
					val = (this.$common.trim(val)).toUpperCase();
					//找出base币名
					let coins = [];
					let markets = this.markets || uni.getStorageSync('markets');
					for (let item of markets) {
						if(item.coin && item.base){
							if(item.coin.indexOf(val) != -1){
								let coinstr =  item.coin  + '/' +  item.base
								coins.push(coinstr);
							}
						}
					}
					seelist = coins;
				}
				//给已自选的交易对高亮
				let newseelist = []
				for(let i in seelist){
					if(seelist[i]){
						let pair = seelist[i].split('/').join('_');
						if(this.favorites.indexOf(pair) != -1){
							newseelist.push({'market':seelist[i],'favorites':1})
						}else{
							newseelist.push({'market':seelist[i],'favorites':0})
						} 
					}
				}
				//console.log(newseelist)
				return newseelist;
			},
			cancel:function(){
				uni.navigateBack({
					delta:1,
					animationDuration:200
				})
			},
			searchCoinType:function(item){
				if(!item) return false;
				let mycoin = uni.getStorageSync('myCoin') || [];
				
				if(mycoin.indexOf(item) == -1){
					//console.log(item)
					mycoin.push(item)
					uni.setStorageSync('myCoin',mycoin)
				}
				let coin = '';
				coin = item.split('/')[1];
				//console.log(coin)
				if(!coin) return false;
				uni.setStorageSync('search_flag',coin) 
				let currentMarket = item.split('/').join('_');
				uni.setStorageSync('currentMarket',currentMarket);
				if(this.fromUrl == 'exchange'){
					uni.switchTab({
						url:'/pages/exchange/exchange'
					})
				}else{
					uni.switchTab({
						url:'/pages/market/market'
					})
				}
			},
			add(item){//添加自选
			    if(item) item = item.split('/').join('_');
				this.$store.commit('setFavorites',item);
			},
		},
	}
</script>

<style lang="less" scoped>
	.icon-shoucang1{
		font-size:36upx;
	}
	.add{
		width:10%;
		line-height: 80upx;
	}
	.searchCoin{
		width: 100%;
		// height: 100vh;
		.searchWrap{
			width: 100%;
			height: 80upx;
			border-bottom: 1px solid #F8F8F9;
			position: relative;
			
			.searchInp{
				width: 620upx;
				height: 80upx;
				line-height: 80upx;
				text-indent: 40upx;
				margin-left: 30upx;
				float: left;
			}
			.searchIcon{
				width: 30upx;
				height: 30upx;
				font-size: 30upx;
				position: absolute;
				left: 30upx;
				top:25upx;
			}
			.btnClose{
				width: 118upx;
				height: 80upx;
				float: left;
				font-size: 26upx;
				line-height: 80upx;
				text-align: center;
				border-left: 1px solid #F8F8F9;
			}
		}
	
		.searchContent{
			width: 100%;
			height: auto;
			.latelySee{
				width: 96%;
				height: 80upx;
				line-height: 80upx;
				display: block;
				margin: 0 auto;
			}
			.seeContent{
				width: 96%;
				margin: 0 auto;
				
				.coinOne{
					width: 100%;
					height: 80upx;
					line-height: 80upx;
					display: block;
				}
			}
		}
	}
</style>
