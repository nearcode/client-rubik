<template>
	<!-- c2c管理-->
	<view class="C2CManage bg-white">
		<view class="manageMsg text-sm text-white bg-orange">代理商规则：帮用户充值手续费为0，帮用户提现可收取1%的手续费.</view>
		<view class="manageWrap">
			<view class="handleRange">
				<view class="handleRangeUp clearfix">
					<view class="handleRange-left">
						<text class="text">处理范围</text>
					</view>
					<view class="handleRange-mid">
						<input type="number" placeholder="最小值" v-model="minNum"/>
						<input type="number" placeholder="最大值" v-model="maxNum"/>
					</view>
					<view class="handleRange-right">
						<view class="management-switch">
							<text class="depOrWith" :class="{rechargeText:isDeposit}">充值</text>
							<view class="switchChecked" @click="deposit" :class="{switchCheckedColor:isDeposit}">
								<text class="switchYuan" :class="{switchYuanColor:isDeposit}"></text>
							</view>
							
						</view>
						<view class="management-switch">
							<text class="depOrWith" :class="{rechargeText:isWithdraw}">提现</text>
							<view class="switchChecked" @click="withdraw" :class="{switchCheckedColor:isWithdraw}">
								<text class="switchYuan" :class="{switchYuanColor:isWithdraw}"></text>
							</view>
							
						</view>
					</view>
				</view>
				<view class="handleRangeDown clearfix">
					<button type="primary" size="mini" @click="save">保存</button>
				</view>
			</view>
		</view>
		
		<view class="searchWrap">
			<input type="text" placeholder="输入单号" v-model="searchValue" class="inputSearch" />
			<view class="sousuo">
				<span class="iconfont icon-unie036" @tap="search"></span>
			</view>
		</view>
		
		<view class="navigator">
			<text class="tabNavigator" @click='select("C")' :class='{tabNavigatorColor:isCheckedC}'>代充值列表</text>
			<text class="tabNavigator"  @click='select("T")' :class='{tabNavigatorColor:isCheckedT}'>提现列表</text>
		</view>
		<view>
			<view class="listWrap" v-if="depositOrwith.length > 0 ">
				<view class="list" v-for="(item,index) in depositOrwith" :key="index" >
					<view class="listHead clearfix">
						<text class="orderText text-df text-gray">订单号:</text>
						<text class="orderNo text-df text-black">{{item.id}}</text>
					</view>
					<view class="listMid clearfix">
						<view class="user">
							<text class="userText text-gray text-df">用户:</text>
							<text class="userName text-df text-black">{{item.bankcard.truename}}</text>
						</view>
						<view class="number">
							<text class="numberText text-gray text-df">数量:</text>
							<text class="numberNo  text-df text-black">{{item.amount}}</text>
						</view>
					</view>
					<view class="listMid clearfix" v-if="isCheckedT" style="height:50upx;">
						<view class="user">
							<text class="userText text-gray text-df" style="line-height:40upx;">手续费:</text>
							<text class="userName text-df text-black" style="line-height:40upx;">{{item.fee}}</text>
						</view>
					</view>
					<view class="listFoot">
						<view class="clearfix">
							<text class="timeText">{{item.create | formatTime('yyyy-MM-dd')}}</text>
							<text class="see" @tap="go(item)" v-if="item.result != 1">查看</text>
							<text class="see seeColor" v-if="item.result == 1">成功</text>
						</view>
					</view>
				</view>
				
			</view>
			<view v-if="depositOrwith.length <= 0" class="noList text-xxl text-gray">
				没有相关数据
			</view>
		</view>
		
	</view>
</template>

<script>
	import C2C from '@/api/c2c.js';
	export default {
		data() {
			return {
				isDeposit:true, //充值
				isWithdraw:true,//提现
				minNum:0,
				maxNum:0,
				isCheckedC:true, //充值列表
				isCheckedT:false,//提现列表
				ishow:true,
				searchValue:"",		//搜索内容
				depositList:[],		//充值
				withdrawList:[],	//提现
				depositOrwith:[]
			}
		},
		onShow() {
			this.depositOrWithdraw();
			this.getMerchant();
			// this.depositOrwith = this.depositList;
		},
		methods: {
			// 充值
			deposit: function (e) {
				this.isDeposit = !this.isDeposit;
			},
			// 提现
			withdraw: function (e) {
				// console.log(e.target.value)
				this.isWithdraw = !this.isWithdraw;
			},
			// 切换列表
			select:function(data){
				if("C" == data){
					this.ishow = true;
					this.isCheckedC = true;
					this.isCheckedT = false;
					this.depositOrwith = this.depositList;
				}else{
					this.ishow = false;
					this.isCheckedC = false;
					this.isCheckedT = true;
					this.depositOrwith = this.withdrawList;
				}
			},
			go(detail){
				uni.setStorageSync("detail",detail)
				uni.navigateTo({
					url:'./seeDetail/seeDetail'
				})
			},
			//修改处理范围
			save:function(){
				let res = C2C.setMerchant(this.isDeposit,this.isWithdraw,this.maxNum,this.minNum);
				// console.log(res)
			},
			//获取处理范围
			async getMerchant() {
				try {
					let setMerchant = await C2C.getMerchant();
					// console.log(setMerchant)
					this.isDeposit = setMerchant.isOpenDeposit;
					this.isWithdraw = setMerchant.isOpenWithdraw;
					this.maxNum = setMerchant.max;
					this.minNum = setMerchant.min;
				} catch (e) {}
			},
			//获取充值的提现列表
			async depositOrWithdraw() {
				this.depositList = [];
				this.withdrawList = [];
				try {
					let List = await C2C.depositOrWithdraw();
					// console.log(List)
					for (var i = 0; i < List.length; i++ ) {
						if(List[i].type == -1){
							this.withdrawList.push(List[i]);
						}else if(List[i].type == 1){
							// List[i].result = 0;
							this.depositList.push(List[i]);
						}
					}
					// console.log(this.depositList)
					this.depositOrwith = this.isCheckedC?this.depositList:this.withdrawList;
				} catch (e) {}
			},
			//搜索订单
			search(){
				console.log(this.searchValue)
			}
		},
		computed: {
			searchList() {
				let listObj = this.isCheckedC?this.depositList:this.withdrawList;
				let list = [],that = this;
				for(let item in listObj){
					if((listObj[item].id+'').indexOf((that.searchValue)+'') >=0){
						list.push(listObj[item]);
					}
				}
				return list;
			}
		},
	}
</script>

<style lang="less" scoped>
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
	.C2CManage{
		width: 100%;
		height: 100%;
		min-height: 100vh;
		
		.manageMsg{
			width: 100%;
			height: 40upx;
			line-height: 40upx;
			text-align: center;
		}
		.manageWrap{
			width: 96%;
			height: auto;
			margin: 0 auto;
			
			.handleRange{
				width: 705upx;
				height: 240upx;
				background: #fff;
				border: 1px solid #ebeef5;
				border-radius:10upx;
				margin: 10upx auto;
				
				.handleRangeUp{
					width: 100%;
					height: 160upx;
					
					.handleRange-left{
						width: 170upx;
						height: 100%;
						float: left;
						text-align:center;
						line-height:60upx;
						word-wrap: break-word;
					}
					.handleRange-mid{
						width: 280upx;
						height: 100%;
						float: left;
					}
					.handleRange-mid > input{
						width: 99%;
						height: 52upx;
						border: 1px solid #dcdfe6;
						border-radius:8upx;
						margin-top: 8upx;
						text-indent: 6upx;
					}
					.handleRange-right{
						width: 250upx;
						height: 100%;
						float: right;
						font-size:26upx;
						line-height: 44upx;
						overflow: hidden;
						
						.management-switch{
							width: 100%;
							height: 52upx;
							margin-top: 8upx;
							text-align: center;
							
							.depOrWith{
								width:160upx;
								float: right;
								height: 60upx;
								line-height: 60upx;
							}
							
							.switchChecked{
								width: 88upx;
								height: 50upx;
								background: #fff;
								border: 1px solid #dcdfe6;
								float: right;
								border-radius: 50upx;
								position: relative;
							}
							.switchCheckedColor{
								background: #409EFF;
							}
							.switchYuan{
								width: 47upx;
								height: 47upx;
								background: #FFF;
								border: 1px solid #dcdfe6;
								border-radius: 47px;
								position: absolute;
								left: 0px;
								top: -1px;
							}
							.switchYuanColor{
								left:46upx;
							}
							.rechargeText{
								color: #409EFF;
							}
						}
						
					}
				}
				.handleRangeDown{
					width: 100%;
					height:80upx;
					text-align: center;
				}
				.handleRangeDown > button{
					width:280upx;
					border-radius:8upx;
				}
			}	
		}
		.searchWrap{
			width:94%;
			height: 72upx;
			margin:10upx auto;
			
			.inputSearch{
				width:86%;
				height: 72upx;
				border:1px solid #ebeef5;
				border-radius:10upx 0 0 10upx;
				text-indent: 8upx;
				background: #fff;
				float: left;
			}
			.sousuo{
				width: 14%;
				height: 72upx;
				float: left;
				border:1px solid #ebeef5;
				border-left: none;
				border-radius:0 10upx 10upx 0;
				text-align: center;
				line-height: 72upx;
			}
		}
		
		.navigator{
			width: 94%;
			height: 80upx;
			margin:0 auto;
			background: #fff;
			border-bottom:2px solid #dcdfe6;
			
			.tabNavigator{
				width: 50%;
				height: 77upx;
				float: left;
				text-align: center;
				line-height: 77upx;
			}
			.tabNavigatorColor{
				color:#409EFF;
				border-bottom: 2px solid #409EFF;
			}
		}
		
		.listWrap{
			width: 96%;
			height: auto;
			margin: 10upx auto 0;
			background: #fff;
			border-radius: 8upx;
			
			.list{
				width: 100%;
				height: auto;
				border: 1px solid #dcdfe6;
				border-radius: 8upx;
				margin-top: 10upx;
				
				.listHead,.listFoot{
					width: 100%;
					height: 70upx;
					line-height: 70upx;
					border-bottom: 1px solid #dcdfe6;
					overflow: hidden;
					
					.orderText{
						width: auto;
						max-width: 220upx;
						height: 100%;
						display: block;
						text-align: center;
						float: left;
						padding: 0 10upx;
					}
					.orderNo{
						width:400upx;
						height: 100%;
						display: block;
						float: left;
						overflow: hidden;
					}
				}
				.listMid{
					width: 100%;
					height: 90upx;
				}
				.user,.number{
					width: 55%;
					height: 100%;
					float: left;
					line-height:90upx;
				}
				.number{
					width: 45%;
				}
				.userText,.numberText{
					width:auto;
					max-width: 45%;
					height: 100%;
					display: block;
					float: left;
					text-align: center;
					padding: 0 10upx;
				}
				.userName,.numberNo{
					width: 55%;
					height: 100%;
					display: block;
					float: left;
					overflow: hidden;
				}
				
				.listFoot{
					border: none;
				}
				.timeText{
					width: 270upx;
					text-indent: 10upx;
					display: block;
					font-size: 26upx;
					float: left;
					overflow: hidden;
					
				}
				.see{
					width:120upx;
					height:50upx;
					display: block;
					float: right;
					background:#409EFF;
					color: #fff;
					font-size: 24upx;
					line-height: 50upx;
					text-align: center;
					margin:10upx 15upx 0 0;
					border-radius: 8upx;
				}
				.seeColor{
					background-color: rgba(103,194,58,0.3);
					border-color:rgba(103,194,58,.6);
					color:#67c23a;
				}
				.seeColor1{
					border: 1px solid #ccc;
					background: #FFF;
					color:#333;
				}
				
			}
			
		}
		
		.noList{
			height: 180upx;
			line-height: 180upx;
			text-align: center;
		}
		
		
		
		
		
	}
</style>
