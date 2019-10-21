<template>
	<!-- <view class="phone-main" :style="{height: winHeight + 'px'}"> -->
	<view class="phone-main">
		<view class="phone-main-search flex justify-between align-center font-grey">
			<view hover-class="none" class="basis-xl flex justify-start align-center">
				<text class="lg icon-search"></text>
				<input v-model="keyword" class="phone-main-input font-color" type="text" placeholder="搜索币种" />
			</view>
			<text class="text-lg" @tap="back">取消
			</text>
		</view>
		<view class="search-main" v-if="keyword">
			<view class="search-main-errtitle" v-if="searchList.length==0">无搜索结果</view>
			<view class="search-main-title" hover-class="hover" @click="handleClick" :hover-start-time="20" :hover-stay-time="70"
			 v-for="item of searchList" :key="item.id" :data-name="item" :data-type="item.code" :data-id="item.id"
			 :data-phoneNumber="item.phoneNumber">
				{{item}}
			</view>
		</view>
		<view v-else class="phoneDirectory">
			<phone-list :phones="banks" :letter="letter" :scrollAnimationOFF="scrollAnimationOFF" @change="handlePhoneListIndex"
			 @reset="handleReset" @handleClick="handleClick">
			</phone-list>
			<phone-alphabet :phones="banks" :phoneListIndex="phoneListIndex" @change="handleDatasetKey" @scrollAnimationOFF="handleScrollAnimationOFF"
			 @reset="handleReset">
			</phone-alphabet>
		</view>
	</view>
</template>

<script>
	import phoneList from './list.vue';
	import phoneAlphabet from './alphabet.vue'; //字母表
	//import banks from './coins.json' ;
	import {
		mapState
	} from 'vuex';

	export default {
		name: "phone-directory",
		components: {
			phoneList,
			phoneAlphabet
		},
		props: {
			searchContent: {
				type: String,
			},
			phones: {
				type: Object,
			},
			jumpUrl: {
				type: String,
			}
		},
		data() {
			return {
				winHeight: 0,
				letter: 'A',
				scrollAnimationOFF: true,
				phoneListIndex: 'A',
				reset: true,
				keyword: '',
				searchList: [],
				banks: {},
			}
		},
		computed: {
			...mapState(['coins']),
			phonesEscape() {
				return escape(JSON.stringify(this.phones))
			}
		},
		watch: {
			keyword() {
				if (this.keyword) {
					this.searchList = []
					for (let key in this.banks) {
						for (let item of this.banks[key]) {
							if (item.indexOf(this.keyword.toUpperCase()) != -1) {
								this.searchList.push(item)
							}
						}
					}
				}
			},
			searchContent: {
				immediate: true,
				handler: function(val, old) {
					console.log(val)
					this.keyword = val;
					// this.$tools.util.showToast('dd'+val)
				}
			}
		},
		onShow() {
			console.log(this.jumpUrl)

		},
		mounted() {
			this.initBanks();
			let windowHeight = uni.getSystemInfoSync().windowHeight

			// #ifndef APP-PLUS
			this.winHeight = windowHeight
			//#endif

			//#ifdef APP-PLUS
			this.winHeight = windowHeight - 56
			//#endif
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				})
			},
			//按字母分组
			initBanks() {
				//过滤
				// let coins = this.coins
				// for (let var1 in var2) {
				// 	
				// }
				this.banks = this.coins
				let banks = this.banks
				let arr = {}
				for (let bank in banks) {
					if (this.jumpUrl == 'addCoin') { //充币 deposit
						if (banks[bank]['deposit'] && bank) {
							let group = bank.slice(0, 1);
							banks[bank].group = group
							if (!arr[group]) arr[group] = []
							arr[group].push(bank)
						}
					} else if (this.jumpUrl == 'withdraw') { //提币
						if (banks[bank]['withdraw'] && bank) {
							let group = bank.slice(0, 1);
							banks[bank].group = group
							if (!arr[group]) arr[group] = []
							arr[group].push(bank)
						}
					} else if (this.jumpUrl == 'transfer') {
						if (banks[bank]['transfer'] && bank) {
							let group = bank.slice(0, 1);
							banks[bank].group = group
							if (!arr[group]) arr[group] = []
							arr[group].push(bank)
						}
					} else {
						if (bank) {
							let group = bank.slice(0, 1);
							banks[bank].group = group
							if (!arr[group]) arr[group] = []
							arr[group].push(bank)
						}
					}
				}
				this.banks = arr;
			},
			handleClick(e) {
				if (this.keyword) { //如果是来自搜索
					e = e.target.dataset
				}
				this.$emit('paramClick', e)
			},
			handleDatasetKey(val) {
				this.letter = val
			},
			handleScrollAnimationOFF(val) {
				this.scrollAnimationOFF = val
			},
			handlePhoneListIndex(val) {
				if (this.reset) {
					this.phoneListIndex = val
				}
			},
			handleReset(val) {
				if (val) {
					this.letter = ''
				}
				this.reset = val
			}

		}
	}
</script>

<style scoped>
	.uni-input-placeholder {
		color: #C6CFD6 !important;
	}

	uni-input {
		height: auto !important;
	}

	.phone-main {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		width: 100%;
	}

	.phoneDirectory {
		display: flex;
		flex-direction: row;
		width: 100%;
		position: relative;
	}

	.phone-main-search {
		border-top: 0.69upx solid #e5e5e5;
		background-color: #fff;
		padding: 20upx 20upx;
		border-bottom: 0.69upx solid #e5e5e5;
	}

	.phone-main-input {
		font-size: 28upx;
		/* border: 0.69upx solid #e5e5e5;
	border-radius: 2.08upx; */
		padding: 10upx 20upx 10upx 20upx;
	}

	.hover {
		background-color: #eee;
	}

	.search {
		background-color: #fff;
		padding: 10upx 20upx;
		border-bottom: 0.69upx solid #e5e5e5;
	}

	.search-input {
		font-size: 28upx;
		border: 0.69upx solid #e5e5e5;
		border-radius: 2.08upx;
		padding: 10upx 20upx 10upx 20upx;
	}

	.search-main {
		height: 100%;
		padding-bottom: 20upx;
		background-color: #fff;
		overflow: hidden;
	}

	.search-main-errtitle,
	.search-main-title {
		width: 100%;
		height: 92upx;
		line-height: 92upx;
		font-size: 32upx;
		padding: 0 20upx;
		border-bottom: 0.69upx solid #e5e5e5;
	}
</style>
