import Request from '@/js_sdk/luch-request/luch-request/index.js'
import {
	baseUrl
} from '@/utils/config.js'
import {
	firstRequest,
	getAccessToken
} from "@/utils/token.js"
import {
	encode
} from 'js-base64'
import md5 from 'js-md5'
const http = new Request()
//设置全局配置
http.setConfig((config) => {
	config.baseURL = baseUrl
	config.timeout = 10000
	return config
})

function Authorization(access_token) {
	return encode(getApp().globalData.Authorization(access_token))
}


//请求拦截器之前
http.interceptors.request.use(async (config) => {
	console.log('拦截前')
	console.log(config)
	uni.showLoading({
	    title: '加载中'
	});

	if (config.custom.auth) {
		config.header = {
			'Access-Token': uni.getStorageSync('access_token'),
			'Authorization': Authorization()
		}

		//需要用户登陆使用的权限
		if (config.custom.user) {
			console.log('用户登陆接口')
			config.header = {
				'Access-Token': uni.getStorageSync('access_token'),
				'Authorization': Authorization(),
				'User-Name': uni.getStorageSync('username')
			}
		}

		//access_token过期情况
		let expires = parseInt(uni.getStorageSync('access_expires'))
		let timestamp = parseInt(Date.parse(new Date()) / 1000)
		console.log('过期时间为：' + (expires - timestamp))
		if (expires && timestamp > expires) {
			console.log('access_token过期，需要更换')
			try {
				let get_access_token = await getAccessToken()
				console.log(get_access_token)
				if (get_access_token.error_code === 0 && get_access_token.data) {
					//关键一步，把获取到的access_token传入header
					config.header['Access-Token'] = get_access_token.data
					config.header['Authorization'] = Authorization(get_access_token.data)
				} else if (get_access_token.error_code === 4003) {
					// 通过access鉴权失败情况
					// 1.有可能系统redis异常导致access和refresh丢失
					// 2.有可能系统清理了数据，导致本地的access或refresh丢失
					console.log('4003')
				}
			} catch (e) {
				//console.log(e)
				//TODO handle the exception
				return Promise.reject(config)
			}
		} else {
			console.log('access_token生效中')
		}

		//第一次请求数据，需要提交deviceID
		let access_token = uni.getStorageSync('access_token')
		if (!access_token) {
			try {
				let first = await firstRequest()
				//console.log(first)
				if (first.error_code === 0) {
					//关键一步，把获取到的access_token传入header
					config.header['Access-Token'] = first.data.access_token
					config.header['Authorization'] = Authorization(first.data.access_token)
				}
			} catch (e) {
				console.log(e);
				//todo 可能由于网络原因通过refreshToken 获取accessToken失败了;可以根据自身逻辑处理，我这里直接放弃本次请求，会进入interceptors.response的错误拦截函数
				return Promise.reject(config)
			}
		}
	}
	return config
})

//请求拦截器之后
http.interceptors.response.use(async (response) => {
	console.log('拦截后')
	console.log(response)
	uni.hideLoading()
	//只有在Login和更换token时记录access_expires/refresh_token值
	if (response.config.url === '/login' || response.config.url === '/access') {
		let expires = parseInt(response.header.Expires)
		//console.log(expires)
		if (expires > 0) {
			let timestamp = parseInt(Date.parse(new Date()) / 1000)
			uni.setStorage({
				key: 'access_expires',
				data: expires + timestamp
			})
			//uni.setStorageSync('access_expires', expires + timestamp)
		}
		console.log("过期时间为" + expires + '结束时间cuo' + uni.getStorageSync('access_expires'))
	}

	return response
}, (response) => {
	uni.hideLoading()
	console.log('拦截之后')
	console.log(response)
	if (response.data.error_code === 4003 || response.data.error_code === 4004) {
		console.log('拦截后重新firstRequest')
		firstRequest()
	}
	return Promise.reject(response)
})
export {
	http
}
