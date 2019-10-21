<script>
	import update from '@/js/update';
	export default {
		onLaunch: function() {
			console.log('onLaunch')
			this.$store.commit("getInfo");
			this.$store.commit("getMarkets");
			this.$store.commit("getTickers");

			// setInterval(() => {
			// 	this.$store.commit("getTickers");
			// }, 1000 * 30);
			this.task();
			//#ifdef APP-PLUS
			//检测更新
			update.autoUpdate().then().catch((e) => {
				console.log(e)
				console.log('自动更新失败')
			});
			//#endif

			//处理app唤醒跳转事件

			this.$eventBus.$off('jsonArgs');
			this.$eventBus.$on('jsonArgs', jsonArgs => {
				if (jsonArgs.type == 'invitation') {
					uni.navigateTo({
						url: '/pages/login/register/register?referrerId=' + jsonArgs.referrerId,
						// success:function(){
						// 	plus.runtime.arguments = null
						// }
					})
				}

			})
		},
		methods: {
			async task() {
				this.$store.commit("getTickers", async (tickerList) => {
					await this.sleep(30);
					await this.task();
				});
			},
			sleep(second) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve()
					}, second * 1000)
				})
			},
		},
		onShow: function() {
			//#ifdef APP-PLUS
			var args = plus.runtime.arguments;
			//console.log(args)
			if (args) {
				let jsonArgs = this.$common.getArgVars(args); //  maibi://type=invitation&referrerId=43296
				this.$eventBus.$emit('jsonArgs', jsonArgs);
			}
			//#endif
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	@import "colorui/main.css";
	/* colorui css */
	@import "colorui/icon.css";
	/* colorui css */

	/* 你的图标 */
	@import "style/app.less";
	/* 你的项目css */
	@import "static/font/iconfont.css";

	.group {
		// .uni-input-input {
		// 	box-sizing: border-box;
		// 	&:focus {
		// 		border-bottom: 1px solid #25435b;
		// 	}
		// }

		/* #ifdef APP-PLUS*/
		// input {
		// 	box-sizing: border-box;
		// 	.wx-input-input{
		// 		box-sizing: border-box;
		// 		&:focus {
		// 			border-bottom: 1px solid #25435b;
		// 			background: red;
		// 		}
		// 	}
		// }
		/* #endif */
	}
</style>
