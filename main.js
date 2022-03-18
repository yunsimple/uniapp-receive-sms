import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})

import uView from 'uview-ui';
Vue.use(uView);

//导入z-paging全局配置
import zConfig from '@/uni_modules/z-paging/components/z-paging/js/z-paging-config'

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif