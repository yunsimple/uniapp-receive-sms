<script>
	import aCache from '@/js_sdk/shezw-aCache/shezw-aCache/shezw-aCache.js'
	Vue.use(aCache,'rsapp', 500 )
	export default {
		globalData: {
			aCache: aCache,
		},
		onLaunch: function() {
			//console.log('App Launch')
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>

<style lang="scss">
@import "uview-ui/index.scss";
@import "@/static/common.css";
</style>
