import md5 from 'js-md5'
import {t} from '@/utils/config.js'

//判断是否是邮箱
export const isEmail = (s) => {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

//判断是否是手机号码
export const isMobile = (s) => {
    return /^1[0-9]{10}$/.test(s)
}

//判断电话号码
export const isPhone = (s) => {
    return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

//判断是否是Url地址
export const isURL = (s) => {
    return /^http[s]?:\/\/.*/.test(s)
}

//判断是否是字符串
export const isString = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'String'
}

//判断是否是数字
export const isNumber = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
}

//判断是否是Boolean
export const isBoolean = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
}

//判断是否是微信浏览器
export const isWeiXin = () => {
    return ua.match(/microMessenger/i) == 'micromessenger'
}

//判断是否是Ios
export const isIos = () => {
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {  //安卓手机
        return false
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        return true
    } else if (u.indexOf('iPad') > -1) {//iPad
        return false
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
        return false
    } else {
        return false
    }
}

//字符串转换
export const changeCase = (str, type) => {
    type = type || 4
    switch (type) {
        case 1:
            return str.replace(/\b\w+\b/g, function (word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();

            });
        case 2:
            return str.replace(/\b\w+\b/g, function (word) {
                return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
            });
        case 3:
            return str.split('').map(function (word) {
                if (/[a-z]/.test(word)) {
                    return word.toUpperCase();
                } else {
                    return word.toLowerCase()
                }
            }).join('')
        case 4:
            return str.toUpperCase();
        case 5:
            return str.toLowerCase();
        default:
            return str;
    }
}

//添加头文件
export function Authorization(access_token) {
	const salt_key = uni.requireNativePlugin('DbGoogleAdmob-native-module')
	let salt = salt_key.getMsaid()
	let random_str = md5(new Date().getTime().toString()).substring(0, 9)
	let random_str_fake = "a" + random_str
	if (access_token) {
		return md5(access_token + random_str + salt) + random_str_fake
	} else {
		return md5(uni.getStorageSync(t) + random_str + salt) + random_str_fake
	}
}

//获取url参数
export const getQueryString = (name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const search = window.location.search.split('?')[1] || '';
    const r = search.match(reg) || [];
    return r[2];
}

//去除空格
export const trim = (str, type) => {
    type = type || 1
    switch (type) {
        case 1:
            return str.replace(/\s+/g, "");
        case 2:
            return str.replace(/(^\s*)|(\s*$)/g, "");
        case 3:
            return str.replace(/(^\s*)/g, "");
        case 4:
            return str.replace(/(\s*$)/g, "");
        default:
            return str;
    }
}