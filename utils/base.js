import {
	http
} from '@/utils/request.js'
//根据页数获取数据
export const dataByPage = function(page, isReload) {
	/* this.apiLoadingStatus = true */
	http.post('/phone', {
		page: page
	}).then(res => {
		var listData = res.data.data
		console.log(listData)
		this.connection = 1
		console.log(this.connection)
		if (page >= 2) {
			this.phoneList = this.phoneList.concat(listData)
			// 加载完成后停止加载动画
			this.$refs.page.stoploadmore()
			//所有数据加载完毕
			if (listData.length < 1) {
				this.$refs.page.nomore()
				this.$refs.message.open('已加载全部数据')
			}
		} else {
			this.phoneList = listData

			// 刷新
			if (isReload) {
				this.$refs.page.endReload()
			}
		}
		page++
		this.apiLoadingStatus = false
		this.connection = true
		this.pageLoading = false
	}).catch(err => {
		//获取失败
		//TODO
		this.$refs.page.stoploadmore();
		this.pageLoading = false
		this.connection = false
		this.$refs.message.open('连接服务器失败，请稍候切换页面再试', 'error', 5000);
	})
}
