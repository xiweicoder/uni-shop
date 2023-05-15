import App from './App'

// 导入网络请求的包
import {
	$http
} from '@escook/request-miniprogram'

// 请求的根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'

uni.$http = $http

// 请求开始之前做一些事情
$http.beforeRequest = function( options ) {
	uni.showLoading( {
		title: '数据加载中...',
	} )
}

// 请求完成之后做一些事情
$http.afterRequest = function() {
	// 手动隐藏数据加载中...
	uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function( title = '数据请求失败', duration = 1500 ) {
	uni.showToast( {
		title,
		duration,
		icon: 'none'
	} )
}






// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue( {
	...App
} )
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp( App )
	return {
		app
	}
}
// #endif