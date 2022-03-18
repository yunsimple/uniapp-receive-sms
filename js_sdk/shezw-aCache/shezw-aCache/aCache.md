### aCache
#### 易于使用的数据缓存
##### 简介 

aCache是一个简洁又实用的组件，通过接口的定义你就能感受它的风格。

```javascript
aCache.add( id, data, expire );
aCache.has( id );
aCache.get( id );
aCache.update( id, data, expire );
aCache.remove( id );
aCache.clear();
aCache.clearCollect();

/* 新增异步请求方法  该方法可自动处理缓存功能  */

aCache.POST( apiURL, params, expire, headers );
aCache.GET( apiURL, expire, headers );

/* 新增已用空间查询 */
aCache.getSize( 'KB' );
```



### 如何使用:

#### 1. 在main.js中注册插件

```javascript
import Vue from 'vue'
import App from './App'
import aCache from 'js_sdk/shezw-aCache/shezw-aCache.js';
Vue.use(aCache,'yourAppID', MaxCount ); 
// appID 可选 应用id
// MaxCount 可选 最大缓存数量 默认500，如果你的单条数据比较小，可以调整到1000或更大
"由于缓存组件会对缓存索引实时排序，所以不建议调整到超过1000以上"
// 此时你已经可以在各个页面中通过 this.aCache 来访问
```

#### 2. 在需要的页面检查并添加你的数据

aCache通过请求的参数区分不同的网络请求，他将被转换为一个特定的HASH值，或是你可以任意指定一个字符串作为ID。

你可以在每一次请求网络的时候，将你的请求参数直接当成id传入add函数，下一次同样的请求时就会自动使用缓存的数据了。

```javascript
// articleList.vue

/**
 * 在 V1.1.1版本中已经新增了 post,get 方法。 这些方法将会自动处理缓存功能。
 * 两个方法均返回Promise对象。所以上述过程可以简化为以下内容：
 */
onload(){
	let params = { type:'article',size:10 };
	this.getCategoryList( params )
		.then(this.setCategoryList)
		.catch(this.networkTips);	
},

method:{
	getCategoryList( params ){
        
		return this.post( 'hostname.com/api/categoryList', params, 3600 );
    },
	// 执行后续步骤...
	setCategoryList( data ){},
	netWorkTips(){}
}

/**
 * 如果你需要更细致自由掌控的缓存管理，可以使用基础的缓存检测、查询、添加方法，如下示例：
 */

onload(){
	let params = { type:'article',size:10 };
	this.getCategoryList( params ).then(this.setCategoryList);	
},

method:{
	getCategoryList( params ){
        let self = this; // 让回调函数可以使用this
		let hash = {method:'getCategoryList',params:params}; // 建议添加方法名到HASH参数中，这样尽可能减少冲突可能性。
		
        return new Promise(function(suc,fal){
			
			 // 检测是否有缓存，有则直接返回并执行回调
			if( self.aCache.has(hash) ){ suc( self.aCache.get(hash) ); return;}
		   
		    // 没有则请求网络
			uni.request({
               ...
               success(result){
				   
               		// 请注意，在收到数据时，请验证数据的有效性再存入缓存，否则可能会陷入重试陷阱。
               		if(result.data.success){
						
						// 添加缓存
               			self.aCache.add( hash, result );
						
						// 执行回调
               			suc( result );
           			}
           	   }
           })
        });
    },
	// 执行后续步骤...
	setCategoryList( data ){}        
}

```


### 主要方法 aCache.add( id, data, expire, refresh, collect )

##### add方法可用于更新缓存,在不使用强制更新时，缓存时间不会增加，但数据会被覆盖

```javascript
/**
 * 添加数据到缓存
 * @param string | object cacheid	* 缓存id
 * @param any data					* 数据
 * @param int = 3600 expire			有效时长 秒
 * @param bool forced				强制更新
 * @param string collect			添加到集合
 * 
 * @return aCache
 */
```

add方法支持较多的参数：除了id和data必填以外，其他的可以根据需要使用。

expire 是有效时长，当你添加了一条缓存时，他会在这个有效期内存在。默认是3600秒 即 1小时，如果你需要1天有效期，那么使用 `aCache.add( id, data, 24*3600 )` 即可。

强制刷新一般用于下拉刷新一类的需求，使用 true,1等即可更新，他会更新数据，但保持有效期。

集合在较少的情况下需要被使用，例如某一个/一类数据同时会出现在多个场景下，我们希望在某个时刻他们的缓存是同步的，当然这里的方式是删除他们的缓存，这样就同时更新到最新状态。 那么这时候就需要将多个数据关联到一个collect下。

例如:

```javascript
aCache.add( 'userProfile', profileData, 7*24*3600, 0, 'user' );
aCache.add( 'userAccount', accountData, 7*24*3600, 0, 'user' );

aCache.clearCollect( 'user' ); // userProfile, userAccount 缓存都将被删除
```



### 其他接口说明

```javascript
aCache.has( id );
/**
 * 检测是否存在
 * @param string | object cacheid	* 缓存id
 * 
 * @return bool
 */

aCache.get( id );
/**
 * 查询缓存数据 不存在时返回0
 * @param string | object cacheid	* 缓存id
 * 
 * return any|0
 */

aCache.update( id, data, expire );
/**
 * 更新缓存
 * @param string | object cacheid	* 缓存id
 * @param any data					* 数据
 * @param int = 3600 expire  		有效时长
 */

aCache.remove( id );
/**
 * 删除缓存
 * @param string | object cacheid	* 缓存id
 */

aCache.post( apiURL, params, expire, headers );
/**
 * @param {string} apiURL			* API URL 接口地址
 * @param {Object} params			* 参数
 * @param {int} expire				有效时长 -1 强制刷新
 * @param {Object} headers			headers 头信息
 * 
 * @return Promise
 */

aCache.get( apiURL, expire, headers );
/**
 * @param {string} apiURL			* API URL 接口地址
 * @param {int} expire				有效时长 -1 强制刷新
 * @param {Object} headers			headers 头信息
 * 
 * @return Promise
 */

aCache.clear();
/**
 * 清空缓存
 */

aCache.clearCollect();
/**
 * 清空集合
 * @param string collect
 */
```



### 新增接口说明

```javascript
aCache.getIf( id );
/**
 * 查询缓存数据 自检模式
 * 返回数据 或 当数据过期时 返回0
 * @param string | object cacheid	* 缓存id
 */

aCache.getOnce( id );
/**
 * 查询缓存数据 一次性模式
 * 返回数据，返回后删除数据
 * @param string | object cacheid	* 缓存id
 */

aCache.getSize( Unit );
/**
 * 获取当前缓存已用数据量 默认KB
 * @param {String} Unit 'Byte','KB','MB'
 */
```

### 交流和建议

你可以通过邮箱或我的网站与我联系，欢迎建议和讨论。

Email: hello@shezw.com

Webisite: https://shezw.com

