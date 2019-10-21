<template>
	<view class="group white100 margin-top-xl flex justify-between align-center">
		<view class="flex justify-between align-center flex-sub">
			<input style="" type='text' data-id="captcha" placeholder="图片验证码" v-model="captcha" placeholder-class="inputplaceholder"
			 @input="clearInput" />
			<view class="flex justify-end align-center">
				<view data-id="captcha" class="icon-roundclosefill" v-if="showClearIcon.captcha" @click="clearIcon"></view>
			</view>
		</view>
		<image v-if="!isLoad" class="captchaUrl" :src="captchaUrl" mode="" :style="{width:width+'px',height:height+'px'}"
		 @tap="getAuType"></image>
		<view class="cu-load" :class="isLoad?'loading':''"></view>
	</view>
</template>

<script>
	import base from '@/api/base.js';
	export default {
		props: ['creatCaptcha'],
		data() {
			return {
				captchaId: '',
				captcha: '',
				isLoad: false,
				showClearIcon: {
					'captcha': false,
				},
				captchaError: '',
				captchaUrl: '',
				width: 150,
				height: 45,
				isVerify: false,
				picTimer: null,
			}
		},
		onLoad() {
			
		},
		onShow() {
		},
		methods: {
			async auTypeVerify() {
				var isVerify = false;
				try {
					let res = await base.auTypeVerify(
						'captcha',
						this.captchaId,
						this.captcha
					);
					isVerify = res.data;
					return isVerify
				} catch (e) {
					return isVerify
					console.log(e.error)
				}
			},
			async checkPicCode() { //验证图像验证码是否正确
				//console.log(this.captcha)
				if (!this.captcha) return;
				this.isVerify = await this.auTypeVerify()
				if (!this.isVerify) {
					this.captchaError = '验证码不正确'
				} else {
					this.captchaError = ''
				}
				this.$emit('captchaEvent',{'captchaError':this.captchaError,'captcha':this.captcha,'captchaId':this.captchaId})
			},
			clearInput: function(event) {
				let id = event.target.dataset.id;
				if (event.target.value.length > 0) {
					this.showClearIcon[`${id}`] = true;
				} else {
					this.showClearIcon[`${id}`] = false;
				}
			},
			clearIcon: function(event) {
				let id = event.target.dataset.id;
				this[`${id}`] = '';
				this.showClearIcon[`${id}`] = false;
			},
			async getAuType() {
				this.isLoad = true;
				try {
					let res = await base.getAuType(
						'captcha',
						'digit',
						this.height,
						this.width
					);
					this.captchaId = res.captchaId;
					this.captchaUrl = res.data;
					console.log(this.captchaUrl)
					this.isLoad = false;
				} catch (e) {
					this.isLoad = false;
					console.log(e.error)
				}
			},
		},
		watch: {
			captcha: function(val) {
				if (val) {
					if (this.picTimer) {
						clearTimeout(this.picTimer)
					}
					this.picTimer = setTimeout(() => {
						this.checkPicCode()
					}, 1000)
				}
			},
			creatCaptcha: { //判断是否走图像验证接口
				immediate: true,
				handler: function(val, old) {
					this.$eventBus.$off('getCaptchaAgains');//先解绑，防止重复发多次
					this.$eventBus.$on('getCaptchaAgains',()=>{
						console.log('重新获取验证码')
						this.captcha = '';//清空验证码
						this.captchaId = '';
						this.$emit('captchaEvent',{'captchaType':false,'captchaError':'请重新获取验证码','captcha':'','captchaId':''})
						this.getAuType();//走验证码接口
					})
					
					if (val) {
						this.getAuType();
					} else {
						this.captcha = '';
					}
				}
			},
		},
		onHide() {
			
		}
	}
</script>

<style>
</style>
