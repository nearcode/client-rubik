<template>
		<scroll-view class="scroll-list"
		:scroll-top="1"
		scroll-y="true"
		:scroll-with-animation="scrollAnimationOFF" 
		:scroll-into-view="scrollViewId" 
		:style="{height:winHeight + 'px'}" 
		@scroll="handleScroll">
			<view class="phone-list">
				<view class="list-item" 
				v-for="(item, key) of phones" 
				:key="key" 
				:id="key">
					<view class="list-item-title solid-bottom">{{key}}</view>
					<view class="list-item-phone solid-bottom font-color" 
					@click="handleClick"
					hover-class="commonly-hover" 
					:hover-start-time="20" 
					:hover-stay-time="70" 
					v-for="(innerItem,$index) in item"
					:key="$index"
					:data-name="innerItem"
					:data-type="innerItem.code"
					>
					{{innerItem}}
					</view>
				</view>
			</view>
		</scroll-view>

</template>

<script>
	export default {
		name:"phone-list",
		props:{
			phones:Object,
			letter:String,
			scrollAnimationOFF:Boolean
		},
		data () {
			return {
				winHeight:0,
				scrollTop:0,
				letterDetails:[],
				timer:null
			}
		},
		computed:{
			scrollViewId () {
				return this.letter
			}
		},
		mounted(){
			// #ifndef APP-PLUS
			this.winHeight = uni.getSystemInfoSync().windowHeight - 49.50
			//#endif
			
			//#ifdef APP-PLUS
			this.winHeight = uni.getSystemInfoSync().windowHeight - 100
			//#endif

		},
		methods:{
			handleClick (e) {
				this.$emit('handleClick',e.target.dataset)
			},
			handleScroll (e){
				if(this.letterDetails.length === 0){
					let view = uni.createSelectorQuery().selectAll('.list-item')
					view.boundingClientRect(data=>{
						let top = data[0].top
						data.forEach((item,index)=>{
							item.top = item.top - top
							item.bottom  = item.bottom - top
							this.letterDetails.push({
								id:item.id,
								top:item.top,
								bottom:item.bottom
							})
						})
					}).exec()	
				}
				
				const scrollTop = e.detail.scrollTop
				this.letterDetails.some((item,index)=>{
					if(scrollTop>=item.top && scrollTop <= item.bottom - 5){
						this.$emit('change',item.id)
						this.$emit('reset',true)
						return true
					}
				})
			}
		}
			
	}
</script>

<style>
	
	.commonly-hover{
		background-color: #eee;
	}
	
	.scroll-list{
		flex: 1;
		height: 100vh;
		overflow-y: hidden;
		width:100%;
		width:100vw;
		/* border:1px solid red; */
	}

	.phone-list{
		display: flex;
		background-color: #fff;
		flex-direction:column;
		position:relative;
		width: 100%;
	}
	
	.list-item {
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap:wrap;
		height: 92upx;
		background-color: #fff;
		height: 100%;
		
	}
	
	.list-item >.list-item-phone{
		font-weight: normal;
	}
	
	.list-item-title{
		background-color: #f7f6fb;
		color:#1883D5;
	}
	
	.list-item-title,.list-item-phone{
		width: 100%;
		height: 92upx;
		line-height: 92upx;
		font-size: 32upx;
		font-weight: bold;
		padding: 0 20upx;
		/* border-bottom: 1px solid #e5e5e5; */
	}
	
	

</style>
