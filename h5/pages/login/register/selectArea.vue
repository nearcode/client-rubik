<template>
	<view :style="{height: winHeight + 'px'}">
		<view class="cu-bar bg-white search fixed">
			<view class="search-form">
				<text class="icon-search text-grey" ></text>
				<input class="text-df" type="text" v-model="selectarea" placeholder="请选择国家或地区" @input="searchArea" placeholder-class="inpl-grey"></input>
			</view>
			<view class="action text-grey text-sm" @tap="cancel">
				<text>取消</text>
			</view>
		</view>
		<view class="zhanwei">
			
		</view>
		<scroll-view scroll-y class="indexes" :scroll-with-animation="true" :enable-back-to-top="true">
			<block v-for="(item,index) in list" :key="index" class="">
				<view class="" :data-item="JSON.stringify(item)" @tap="selectThis">
					<view class="cu-list menu-avatar">
						<view class="cu-item flex justify-start align-start">
							<view class="width100 flex justify-start align-start">
								<view class="width100 flex justify-between align-center padding-left-xs padding-right-xs">
									<text class="text-bold font-col">{{item.zn}}</text>
									<text class="text-grey text-abc">{{'+'+item.code}}</text></view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<!--选择显示-->
	</view>
</template>

<script>
	import area from '@/js/area/area.js';
	export default {
		data() {
			return {
				hidden: true,
				list: [],
				selectarea: '',
				allList: [],
			};
		},
		onLoad() {
			var arr = area.area
			var item
			var newarr = []
			for (let i = 0; i < arr.length; i++) {
				//console.log(arr[i])
				newarr.push({
					"en": arr[i].split('-')[0],
					"zn": arr[i].split('-')[1],
					"code": arr[i].split('-')[2],
				})
			}
			this.list = newarr
			this.allList = newarr
		},
		onShow() {

		},
		onReady() {
			let that = this;
		},
		methods: {
			searchArea() {
				setTimeout(() => {
					if (this.selectarea) {
						console.log(this.selectarea)
						let newList = [];
						this.list.forEach((item) => {
							if (item['zn'].indexOf(this.selectarea) != -1) newList.push(item);
						})
						this.list = newList
					} else {
						this.list = this.allList;
					}
				}, 100)

			},
			selectThis(e) {
				uni.setStorageSync('selectArea', e.currentTarget.dataset.item);
				uni.navigateBack({
					delta: 1
				});
			},
			cancel() {
				uni.navigateBack({
					delta: 1,
				})
			},
		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			if (index === 0) {
				uni.navigateBack({
					delta: 1,
				})
			}
		},
		components: {

		}
	}
</script>

<style lang="less" scoped>
	page {
		// padding-top: 80upx;
	}
	
	.zhanwei{
		min-height: 100upx;
		width:100%;
	}

	.indexes {
		position: relative;
	}

	.cu-item {
		border-bottom: 1px solid #f9f8fb;

		.content {
			color: #28455c;
			left: 30upx !important;
		}
	}


	.search-form {
		background-color: #FFFFFF !important;
	}

	.cu-bar {
		min-height: 80upx !important;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 10upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: 100%;
		// background: #fff;
		display: flex;
		flex-direction: column;
		// box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		// border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
