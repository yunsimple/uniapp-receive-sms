// z-paging全局配置文件，注意避免更新时此文件被覆盖，若被覆盖，可在此文件中右键->点击本地历史记录，找回覆盖前的配置

module.exports = {
	//配置分页默认pageSize为15
	'default-page-size': '10',
	//配置空数据图默认描述文字为：
	'empty-view-text': '没有找到数据...',
	//空数据显示图片
	//'empty-view-img':'../static/images/empty.png'
	//z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，默认为px，若需要减少高度，请传负数
	'auto-height-addition': '-20px',
}