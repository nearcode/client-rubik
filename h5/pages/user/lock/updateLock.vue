<template>
	<view class="lock page bg-white">
		<nav-bar show="true" showbackonly="true" @back="back"></nav-bar><!-- 自定义导航 -->
		<view class="layouts">
			<view class="head-title text-black text-bold text-xxl">
				<text>升级锁仓</text>
			</view>

			<view class="lockList flex flex-direction justify-start align-center" v-if="dataList">
				<view class="title text-left margin-bottom font-color">
					<text>锁仓规则</text>
				</view>
				<view class="item flex flex-direction justify-start align-start margin-bottom-sm solid padding radius shadow" v-for="(item,index) of dataList.modes"
				 :key="index" @tap="select(index)" :class="[!enabled(dataList.coin,item.lockModes.amount) ? 'enabledclass':(index === selectIndex ? 'hoverclass':'')]">
					<text>锁仓数量为 {{item.lockModes.amount}} 的{{dataList.coin}}币</text>
					<text>日收益：{{item.lockModes.rate}}</text>
					<view v-html="dataList.memo">dataList.memo</view>
					<!-- <text>收益两倍自动退出</text>
					<view class="flex flex-direction justify-start align-start" v-for="(it,ind) of item.inviteModes" :key="ind">
						<text>推荐{{it.level}}级可得{{it.rate}}奖励 ({{it.player}}个锁仓用户)</text>
					</view> -->
					<view v-if="enabled(dataList.coin,item.lockModes.amount) && index === selectIndex" class="btns flex justify-end align-center">
						<!-- <button class="submit cu-btn line-grey text-white" @tap="cancelLock(selectIndex=='')">取消</button> -->
					  <button v-if="dataList.price" class="submit cu-btn line-white">升级需要{{item.lockModes.amount / dataList.price}}个币</button>
				      <button class="submit cu-btn bg-orange margin-left-xs" @tap="updateLock(item.lockModes.amount,dataList._id)" :disabled="disabled">升级</button>
					</view>
				</view>
			</view>

		</view>
		<show-msg v-if="succmsgValue" id="msgUniPopupSucc" :errormsg="errormsg" :succmsg="succmsgValue" :errortype="errortype"
		 @hideMsg="hideMsg"></show-msg>
		<show-msg v-else-if="!succmsgValue && errormsg" id="msgUniPopup" :errormsg="errormsg" :succmsg="succmsgValue"
		 :errortype="errortype" @hideMsg="hideMsg"></show-msg>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import lock from '@/api/lock'
	export default {
		data() {
			return {
				list: [],
				apiError: '', //接口错误
				errortype: '',
				succmsg: '',
				p: 1,
				ruleId: '',
				dataList: [],
				selectIndex:'',
				disabled:false,
			}
		},
		onLoad(options) {
			this.ruleId= options.ruleId || '';
			this.balanceUpdata = parseFloat(options.balance || 0); 
		},
		computed: {
			...mapState(['balances']),
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
			this.dataList = await this.getLockUser(this.ruleId);
			this.$store.commit('getBalances');
		},
		methods: {
			enabled(coin,amount){
				// let balance = this.balances[coin]['available'] || 0;
				let balance = this.balanceUpdata;
				amount = parseFloat(amount)
				if(balance < amount){
					return true;//不可以升级
				}else{
					return false;//可以升级
				}
			},
			async updateLock(amount,ruleId){
				// if(this.dataList.enabled){
				// 	return false;
				// }
				this.disabled = true;
				if(!amount && !ruleId){
					this.disabled = false;
					return false;
				}
				this.succmsg = '';
				this.apiError = '';
				try{
					await lock.updateLock(amount,ruleId);
					this.succmsg = '操作成功';
					this.$store.commit('getBalances');
					setTimeout(()=>{
						uni.navigateTo({
							url:'/pages/user/lock/lockUser'
						})
					},1500)
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
			async getLockUser(ruleId){
				let data = [];
				try{
					let res = await lock.lockUserById(ruleId);
					data = res.data || [];
					return data;
				}catch(e){
					return data;
				}
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
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
	.enabledclass{
		background-color:#C6CFD6;
		color:#FFFFFF;
	}
</style>