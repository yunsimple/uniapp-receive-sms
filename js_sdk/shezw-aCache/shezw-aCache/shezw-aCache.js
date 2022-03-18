/*================================================\
|             _____           _                   |\\
|            / ____|         | |                  |\\\
|       __ _| |     __ _  ___| |__   ___          |\\\
|      / _` | |    / _` |/ __| '_ \ / _ \         |\\\
|     | (_| | |___| (_| | (__| | | |  __/         |\\\
|      \__,_|\_____\__,_|\___|_| |_|\___|         |\\\
|                                                 |\\\
|=================================================|\\\
|                                                 |\\\
|     An easy cache for Uni-app  Ver 1.1.3        |\\\
|     Copyright: shezw.com 2018.05 - 2021.06      |\\\
|     Author   : shezw                            |\\\
|     Email    : hello@shezw.com                  |\\\
|                                                 |\\\
 \================================================\\\\
  \================================================\\\
   \================================================\\
*/
      
const aCache = { // ! 数据缓存 主要自动处理数据请求的缓存以及相关过期  # data cache with auto expire 
	
	storage:{ // ! 浏览器本地存储 扩展数据类型  # localstorage Adv Api 
		/* 存储数据 */
		set: function(key, value) {
			var type = typeof value;
			var v = JSON.stringify({
				v: value,
				t: type
			});
			uni.setStorageSync(this.uniqueKey(key), v);
			return 1;
		},
		/* 读取数据 */
		get: function(key) {
			var data = uni.getStorageSync(this.uniqueKey(key)) || 0,
				res = data ? JSON.parse(data).v : undefined;
			return res;
		},
		/* 单次读取 */
		once: function(key) {
			var data = this.get(this.uniqueKey(key));
			this.remove(this.uniqueKey(key));
			return res;
		},
		/* 删除数据 */
		remove: function(key) {
			uni.removeStorageSync(this.uniqueKey(key));
			return 1;
		},
		/* 检测数据 */
		has: function(key) {
			return uni.getStorageSync(this.uniqueKey(key)) ? 1 : 0;
		},
		/* 清空数据 */
		removeAll: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var k = this.uniqueKey(arr[i]);
				uni.removeStorageSync(k);
			}
		},
		uniqueKey:function(key){
			return this.appid ? this.appid+'_'+key : key;
		}
		
	},
	
	install: function(Vue, appid, Max){
		if(appid){
			this.appid = appid;
		}
		this.init(Max||500);
		Vue.prototype.aCache = this;
	},

	init: function( Max ) {
		this.max = Max;
		this.list = this.storage.get('aCacheList') || {};
		this.collect = this.storage.get('aCollect') || [];
		this.count = this.list.length;
		this.time = Math.round(new Date().getTime() / 1000);
		return this;
	},
	
/**
 * 添加数据到缓存
 * @param string | object cacheid	* 缓存id
 * @param any data					* 数据
 * @param int = 3600 expire			有效时长 秒
 * @param bool forced				强制刷新
 * @param string collect			添加到集合
 * 
 * @return aCache
 */
	add: function(cacheid, data, expire, forced, collect) {
		cacheid = this.hashID(cacheid);
		if (!forced) {
			this.list[cacheid] = (expire || 3600) + Math.round(new Date().getTime() / 1000);
		}
		if (collect) {
			this._addToCollect(cacheid,collect);
		}
		this.storage.set('aCacheList', this.list);
		this.storage.set('aCache_' + cacheid, data);
		this._checkMax();
		this._refresh();
		return this;
	},
	
/**
 * 检测是否存在
 * @param string | object cacheid	* 缓存id
 * 
 * @return bool
 */
	has: function(cacheid) {
		cacheid = this.hashID(cacheid);
		this._refresh();
		return typeof this.list[cacheid] != 'undefined' ? (parseInt(this.list[cacheid]) > this.time || this.remove(cacheid)) : this.remove(cacheid);
	},
	
/**
 * 查询缓存数据
 * @param string | object cacheid	* 缓存id
 * 
 * return any|0
 */
	get: function(cacheid) {
		cacheid = this.hashID(cacheid);
		var data = this.storage.get('aCache_' + cacheid);
		if (!data){ return 0; };
		return data;
	},

/**
 * 查询缓存数据 自检模式
 * @param string | object cacheid	* 缓存id
 */
	getIf: function( cacheid ){
		return this.has(cacheid) ? this.get(cacheid) : 0;
	},

/**
 * 查询缓存数据 一次性模式
 * @param string | object cacheid	* 缓存id
 */
	getOnce: function( cacheid ){
		var data = this.get(cacheid);
		this.remove(cacheid);
		return data;
	},

/**
 * 更新缓存
 * @param string | object cacheid	* 缓存id
 * @param any data					* 数据
 * @param int = 3600 expire  		有效时长
 */
	update: function(cacheid, data, expire) {
		cacheid = this.hashID(cacheid);
		this.add(cacheid, data, expire, 1);
		return this;
	},
	
/**
 * 删除缓存
 * @param string | object cacheid	* 缓存id
 */
	remove: function(cacheid) {
		cacheid = this.hashID(cacheid);
		delete this.list[cacheid];
		this.storage.set('aCacheList', this.list);
		this.storage.remove('aCache_' + cacheid);
		this._refresh();
		return 0;
	},
	
/**
 * 批量删除
 * @param [string] arr
 */
	removeAll: function(arr) {
		for (var i = 0; i < arr.length; i++) {
			this.remove(arr[i]);
		}
		this.storage.set('aCacheList', this.list);
		this._refresh();
		return this;
	},
	
/**
 * 清空缓存
 */
	clear: function() {
		for (var key in this.list) {
			this.storage.remove('aCache_' + this.list[key]);
		}
		this.storage.remove('aCacheList');
		this.list = {};
		this._refresh();
		return this;
	},
	
/**
 * 清空集合
 * @param string collect
 */
	clearCollect:function(collect){
		for( var k in this.collect[collect]){
			this.remove(k);
		}
		delete this.collect[collect];
		this.storage.set('aCollect',this.collect);
	},
	_addToCollect:function(cacheid,collect){
		cacheid = this.hashID(cacheid);
		if (this.collect[collect]) {
			this.collect[collect][cacheid]=1;
		}else{
			this.collect[collect]={};
			this.collect[collect][cacheid]=1;
		}
		this.storage.set('aCollect',this.collect);
	},
	_clearExpired: function() {
		this._refresh();
		var now = Math.round(new Date().getTime() / 1000);
		var expireList = this.storagehash.valueSort(this.list, now);
		this.removeAll(expireList);
	},
	_refresh: function() {
		this.time = Math.round(new Date().getTime() / 1000);
		this.count = Object.keys(this.list).length;
		this.list = this.storage.get('aCacheList') || {};
		// this.collect = this.storage.get('aCollect') || {};
		return this;
	},
	_checkMax: function() {
		this._refresh();
		if (this.count >= (this.max - (this.max) / 5)) {
			var olderList = this.storagehash.valueSort(this.list, 0);
			olderList = olderList.slice(0, parseInt((this.count) / 5) - 1);
			this.removeAll(olderList);
		}
	},
	
	/**
	 * @param {String} Unit 'Byte','KB','MB'
	 */
	getSize:function( Unit ){
		
		var unit = Unit || 'KB';
		var size = uni.getStorageInfoSync().currentSize;
		
		if( unit === 'KB' ){
			
			size = Math.floor(size * 100 / 1024) / 100 ;
			
		}else if( unit === 'MB' ){
			
			size = Math.floor(size * 100 / 1024 / 1024) / 100 ;
		}
		
		return size;
	},
	
	
	hashID:function(params){
		return typeof params =='string' ? params : this.storagehash.hash(JSON.stringify(params));
	},
	storagehash: {
		I64BIT_TABLE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split(''),
		hash: function(origin) {
			var hash = 5381;
			var i = origin.length - 1;
			if (typeof origin == 'string') {
				for (; i > -1; i--) {
					hash += (hash << 5) + origin.charCodeAt(i)
				}
			} else {
				for (; i > -1; i--) {
					hash += (hash << 5) + origin[i]
				}
			}
			var value = hash & 0x7FFFFFFF;
			var retValue = '';
			do {
				retValue += aCache.storagehash.I64BIT_TABLE[value & 0x3F]
			} while (value >>= 4);
			return retValue;
		},
		valueSort: function(obj, value) {
			var list = Object.keys(obj).sort(function(a, b) {
				return value ? (obj[a] > value && obj[a] - obj[b]) : obj[a] - obj[b]
			});
			return list;
		}
	},
	
	/**
	 * 发送自动缓存的网络请求
	 * @param string apiURL
	 * @param object params
	 * @param int    expire			使用-1进行强制刷新请求
	 * @param object headers
	 * 
	 * @return Promise
	 */
	request:function( apiURL, params, expire = 0, headers = null, method = 'POST' ){
		
		let self   = this;
		let hashID = this.hashID({url:apiURL,params:params});
		
		return new Promise(function(suc,fal){
		
			if( expire != -1 && self.has(hashID) ){
				suc( self.get(hashID) );
				return;
			}
			
			uni.request({
				url:apiURL,
				method:method,
				data:params||null,
				headers:headers||null,
				success(result) {
					self.add( hashID, result.data, expire );
					suc(result.data);
				},
				fail(err) {
					fal(err);
				}
			});			
		});		
	},
	
	/**
	 * @param {string} apiURL
	 * @param {Object} params
	 * @param {int} expire
	 * @param {Object} headers
	 * 
	 * @return Promise
	 */
	POST:function( apiURL, params, expire, headers ){
		
		return this.request( apiURL, params, expire, headers, 'POST' );
	},
	
	/**
	 * @param {string} apiURL
	 * @param {int} expire
	 * @param {Object} headers
	 * 
	 * @return Promise
	 */
	GET:function( apiURL, expire, headers ){
		
		return this.request( apiURL, null, expire, headers, 'GET' );
	}
};


export default aCache;

