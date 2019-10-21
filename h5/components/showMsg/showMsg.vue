<template>
	<view>
		<uni-popup :h5Top="h5Top" :showmask="showmask" :show="errortype === 'top'" position="top">
			<text v-if="errormsg" class="errormsg width100 flex justify-center align-center">{{errormsg}}</text>
			<text v-if="succmsg" class="succmsg width100 flex justify-center align-center">{{succmsg}}</text>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';

	export default {
		props: {
			h5Top: {
				type: Boolean,
				default: true,
			},
			showmask: { //是否显示遮罩
				type: Boolean,
				default: false,
			},
			errortype: {
				type: String,
				default: '',
			},
			errormsg: {
				type: String,
				default: '',
			},
			succmsg: {
				type: String,
				default: '',
			}
		},
		data() {
			return {
				sleepsTimer: null,
			}
		},
		methods: {
			sleeps(time) {
				if (this.sleepsTimer) clearTimeout(this.sleepsTimer);
				this.sleepsTimer = setTimeout(() => {
					this.$emit('hideMsg', '');
				}, time)
			},
		},
		watch: {
			errortype: {
				immediate: true,
				handler: function(val, old) {
					if (val) {
						this.sleeps(3000);
					}
				}
			}
		},
		components: {
			uniPopup
		},
	}
</script>

<style lang="less">
</style>
