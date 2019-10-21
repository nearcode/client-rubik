<template>
	<view class="lock page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl flex justify-between align-center">
				<text>添加锁仓</text>
				<button class="cu-btn bg-blue" @tap="showSinglePicker">选择添加</button>
			</view>

			<view class="lockList flex flex-direction justify-start align-center" v-if="dataList && Object.keys(dataList).length">
				<view class="title text-left margin-bottom font-color">
					<text>锁仓规则</text>
				</view>
				<view class="item flex flex-direction justify-start align-start margin-bottom-sm solid padding radius shadow" v-for="(item,index) of dataList.modes"
				 :key="index" @tap="select(index)" :class="[index === selectIndex ? 'hoverclass':'']">
					<text>锁仓数量为 {{item.lockModes.amount}} 的{{dataList.coin}}币</text>
					<text>日收益：{{item.lockModes.rate}}</text>
					<!-- <text>收益两倍自动退出</text>
					<view class="flex flex-direction justify-start align-start" v-for="(it,ind) of item.inviteModes" :key="ind">
						<text>推荐{{it.level}}级可得{{it.rate}}奖励 ({{it.player}}个锁仓用户)</text>
					</view> -->
					<view v-html="dataList.memo">dataList.memo</view>
					<view v-if="index === selectIndex" class="btns flex justify-end align-center">
						<!-- <button class="submit cu-btn line-grey text-white" @tap="cancelLock(selectIndex=='')">取消</button> -->
						<button class="submit cu-btn bg-orange margin-left-xs" @tap="createLock(item.lockModes.amount,dataList._id)" :disabled="disabled">确定</button>
					</view>
				</view>
			</view>

		</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerSingleArray"></mpvue-picker>

		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype"
		 @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue"
		 :errortype="errortype" @hideMsg="hideMsg"></show-msg>

	</view>
</template>

<script>
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import lock from '@/api/lock'
	export default {
		data() {
			return {
				list: [],
				//单列开始
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [],
				themeColor: '#007AFF',
				//单列结束
				apiError: '', //接口错误
				errortype: '',
				succmsg: '',
				p: 1,
				id: '',
				dataList: [],
				selectIndex:'',
				disabled:false,
			}
		},
		components: {
			mpvuePicker
		},
		computed: {
			pickerSingleArray() { //去重提取baseCoin
				let list = [];
				let data = this.list;
				for (let item of data) {
					if (item.name) {
						let obj = {
							label: item.name
						}
						list.push(obj);
					}
				}
				return list;
			},
			errormsg: function() { //收集弹出
				if (this.apiErrorValue) {
					return this.apiErrorValue
				} else {
					return '';
				}
			},
			apiErrorValue: function() { //即时弹出
				if (this.apiError) {
					this.errortype = 'top';
					return this.apiError;
				} else {
					return '';
				}
			},
			succmsgValue: function() { //即时弹出
				if (this.succmsg) {
					this.errortype = 'top';
					return this.succmsg;
				} else {
					return '';
				}
			}
		},
		async onShow() {
			this.list = await this.getLockRuleList();
		},
		methods: {
			async createLock(amount,ruleId){
				this.disabled = true;
				if(!amount && !ruleId){
					this.disabled = false;
					return false;
				}
				this.succmsg = '';
				this.apiError = '';
				try{
					await lock.createLock(amount,ruleId);
					this.succmsg = '操作成功';
					this.disabled = false;
				}catch(e){
					if (!e) {
						this.apiError = this._consts.networkFail;
						this.disabled = false;
						return false;
					}
					if (e.error) {
						this.apiError = this.$t(e.error);
					}
					this.disabled = false;
				}
			},
			select(index){
				this.selectIndex = index;
			},
			hideMsg(type) {
				this.errortype = type;
			},
			async getLockRuleList() {
				uni.showLoading({
					title:'加载中...',
				})
				let data = [];
				try {
					let res = await lock.lockRuleList(this.p);
					data = res.data || [];
					uni.hideLoading();
					return data;
				} catch (e) {
					uni.hideLoading();
					return data;
				}
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			// 单列开始
			onCancel(e) {
				console.log(e)
			},
			onConfirm(e) {
				console.log(e.label)
				//找出id
				for (let item of this.list) {
					if (item.name == e.label) {
						this.dataList = item || []
						console.log('dataList',this.dataList)
						console.log(this.dataList.memo)
						break;
					}
				}
			},
			showSinglePicker() {
				this.selectIndex = '';
				// this.apiError = '';
				// this.succmsg = '';
				// console.log('lenght',this.list.length)
				// if (!this.list.length) {
				// 	this.apiError = '暂无选择';
				// 	return false;
				// }
				this.mode = 'selector';
				this.deepLength = 1;
				this.pickerValueDefault = [0];
				this.$refs.mpvuePicker.show();
			},
			// 单列结束
		}
	}
</script>

<style lang="less" scoped>
	.item,.title,.btns{
		width: 100%;
	}
	.hoverclass{
		background-color:#007AFF;
		color:#FFFFFF;
	}
	.submit{
		margin-top:20upx;
	}
</style>
