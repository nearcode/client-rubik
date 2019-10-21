<template>
	<view class="nav">
		<view class="ex-bar flex justify-between align-center text-xl">
			<view class="status_bar">
				<view class="top_view" :style="{background:barColor}"></view> 
			</view>
		</view>
	    <view v-if="show=='true'" class="heights">
	    	<view class="ex-text flex justify-between align-center">
	    		<text class="icon iconfont icon-fanhui1 font-gray" @tap="back"></text>
	    		<text v-if="showbackonly != 'true' " class="icon iconfont icon-chongzhijilu font-color" @tap="history"></text>
	    	</view>
	    </view>
		
	</view>
	
</template>

<script>
	export default {
		props:{
			barColor:{
				type:String,
				default:'#FFFFFF'
			},
			show:{
				type:String,
				default:'false'
			},
			showbackonly:{
				type:String,
				default:'false'
			}
		},
		data() {
			return {
          
			}
		},
		methods: {
			history(){
			   this.$emit('history')	
			},
			back() {
				this.$emit('back')
			},
		}
	}
</script>

<style lang="less" scoped>
	
	.nav{
		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}
		
		.top_view {
			height: var(--status-bar-height);
			width: 100%;
			position: fixed;
			background-color: #FFFFFF;
			top: 0;
			z-index: 996;
		}
		
		.ex-text {
			background-color:#FFFFFF;
			// width: 94%;
			width:100%;
			position: fixed;
			top: var(--status-bar-height);
			z-index:997;
			font-size: 40upx;
			height: 100upx;
		}
		.icon{
			display: block;
			width:100upx;
			height:100upx;
			// background-color:red;
			line-height:100upx;
			margin-left:30upx;
		}
		.heights {
			height: 102upx;
		}
	}
	
</style>
