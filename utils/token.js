import { http } from '@/utils/request.js'
import md5 from 'js-md5'

//第一次请求数据/不存在access_token情况下请求
let lock = false
export function firstRequest() {
	//重新登陆前，先清除username
	uni.removeStorage({
		key: 'username'
	})
	return new Promise((resolve, reject) => {
		if (!lock) {
			lock = true
			let deviceId = uni.getSystemInfoSync()['deviceId']
			//兼容处理，3.0.7不支持getSystemInfoSync
			if(!deviceId){
				deviceId = md5(new Date().getTime().toString())
			}
			const salt_key = uni.requireNativePlugin('DbGoogleAdmob-native-module')
			let salt = salt_key.getMsaid()
			let uid = md5(deviceId + salt)
			uni.setStorageSync('deviceId', deviceId) //保存deviceId备用
			http.post('/login', {'uid': uid},{
				header:{'device': deviceId}
			}).then(res => {
				uni.setStorageSync('access_token', res.data.data.access_token)
				uni.setStorageSync('refresh_token', res.data.data.refresh_token)
				resolve(res.data)
				lock = false
			}).catch(err => {
				reject(err)
				lock = false
			})
		}
	})
}
let locakToken = false
export function getAccessToken() {
	return new Promise((resolve, reject) => {
		if (!locakToken) {
			locakToken = true
			var refresh_token = uni.getStorageSync('refresh_token')
			console.log("refresh_token:" + refresh_token)
			http.post('/access', {'refreshToken': refresh_token}).then(res => {
				console.log('access_token替换')
				uni.setStorageSync('access_token', res.data.data)
				resolve(res.data)
				locakToken = false
			}).catch(err => {
				reject(err)
				locakToken = false
			})
		}
	})
}