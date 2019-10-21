<template>
	<view class="phone-main">
		<!-- <view class="phone-main-search">
			<view hover-class="none">
				<input v-model="keyword" class="phone-main-input" type="text" placeholder="请输入要搜索银行" placeholder-class="inpl-gray"/>
			</view>
		</view> -->
		
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
			 v-for="item of searchList" :key="item.id" :data-name="item.name" :data-type="item.code" :data-id="item.id"
			 :data-phoneNumber="item.phoneNumber">
				{{item.name}}
			</view>
		</view>
		<view v-else class="phoneDirectory flex align-start justify-between">
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
	import phoneList from './list.vue'
	import phoneAlphabet from './alphabet.vue'
	import banks from './banks.json' //引入常用银行名称

	export default {
		name: "phone-directory",
		components: {
			phoneList,
			phoneAlphabet
		},
		props: {
			phones: Object,
			default: false
		},
		data() {
			return {
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
			phonesEscape() {
				return escape(JSON.stringify(this.phones))
			}
		},
		watch: {
			keyword() {
				//console.log('',this.banks)
				if (this.keyword) {
					this.searchList = []
					for (let key in this.banks) {
						for (let item of this.banks[key]) {
							if (item.name.indexOf(this.keyword) != -1) {
								this.searchList.push(item)
							}
						}
					}


					// 					for (let key in this.phones){
					// 						for (let item of this.phones[key]){
					// 							if (item.spell.indexOf(this.keyword)!=-1 || item.name.indexOf(this.keyword)!=-1){
					// 								this.searchList.push(item)
					// 							}
					// 						}
					// 					}
				}
			}
		},
		mounted() {
			this.initBanks();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				})
			},
			initBanks() {
				this.banks = {};
				for (let bank in banks) {
					let group = banks[bank].group;
					if (!this.banks[group]) this.banks[group] = [];
					this.banks[group].push(banks[bank]);
				}
				// console.log('ddd',this.banks);
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

<style>
	uni-input {
		height: auto !important;
	}

	.phone-main {
		width:100vw;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.phoneDirectory {
		display: flex;
		flex-direction: row;
		width: 100%;
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
