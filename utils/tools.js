export const toDate = function(timeStamp) {
	timeStamp = parseInt(timeStamp);
	var date = new Date();
	if (timeStamp < 90000000000) {
		date.setTime(timeStamp * 1000);
	} else {
		date.setTime(timeStamp);
	}
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

export const lastTime = function(timespan) {
	if(isNaN(timespan)){
		return timespan;
	}
	var dateTime = new Date(timespan * 1000);
	var year = dateTime.getFullYear();
	var month = dateTime.getMonth() + 1;
	var day = dateTime.getDate();
	var hour = dateTime.getHours();
	var minute = dateTime.getMinutes();
	//当前时间
	var now = Date.parse(new Date()); //typescript转换写法
	var milliseconds = 0;
	var timeSpanStr;
	//计算时间差
	milliseconds = (now / 1000) - timespan;

	//一分钟以内
	if (milliseconds <= 60) {
		timeSpanStr = '刚刚';
	}
	//大于一分钟小于一小时
	else if (60 < milliseconds && milliseconds <= 60 * 60) {
		timeSpanStr = Math.ceil((milliseconds / (60))) + '分钟前';
	}
	//大于一小时小于等于一天
	else if (60 * 60 < milliseconds && milliseconds <= 60 * 60 * 24) {
		timeSpanStr = Math.ceil(milliseconds / (60 * 60)) + '小时前';
	}
	//大于一天小于等于15天
	else if (60 * 60 * 24 < milliseconds && milliseconds <= 60 * 60 * 24 * 30) {
		timeSpanStr = Math.ceil(milliseconds / (60 * 60 * 24)) + '天前';
	}else{
		timeSpanStr = toDate(timespan)
	}
/* 	//大于一个月小于一年
	else if (60 * 60 * 24 * 30 < milliseconds && milliseconds <= 60 * 60 * 24 * 30 * 12) {
		timeSpanStr = Math.ceil(milliseconds / (60 * 60 * 24 * 30)) + '个月前';
	}
	//超过一年显示
	else {
		timeSpanStr = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
	} */
	
	return timeSpanStr;
}
