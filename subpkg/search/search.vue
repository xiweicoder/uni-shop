<template>
	<div>
		<!-- 搜索框 -->
		<view class="search-box">
			<uni-search-bar :radius="100" @input="input" cancelButton="none" :focus="true"></uni-search-bar>
		</view>

		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>

		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 延时器的 timerId
				timer: null,
				// 搜索关键词
				kw: '',
				// 搜索的结果列表
				searchResults: [],
				// 搜索关键词的历史记录
				historyList: [ 'a', 'app', 'apple' ]
			};
		},
		onLoad() {
			this.historyList = JSON.parse( uni.getStorageSync( 'kw' ) || '[]' )
		},
		methods: {
			// 输入防抖
			input( e ) {
				// 清除 timer 对应的延时器
				clearTimeout( this.timer )
				// 重新启动一个延时器，并把 timerId 赋值给 this.timer
				this.timer = setTimeout( () => {
					// 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
					this.kw = e
					this.getSearchList()
				}, 500 )
			},
			async getSearchList() {
				if ( this.kw === '' ) {
					this.searchResults = []
					return
				}
				// 发起请求，获取搜索建议列表
				const {
					data: res
				} = await uni.$http.get( '/api/public/v1/goods/qsearch', {
					query: this.kw
				} )
				if ( res.meta.status !== 200 ) return uni.$showMsg()
				this.searchResults = res.message

				this.saveSearchHistory()
			},
			// 
			gotoDetail( goods_id ) {
				uni.navigateTo( {
					// 指定详情页面的 URL 地址，并传递 goods_id 参数
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				} )
			},

			// 保存搜索关键词为历史记录
			saveSearchHistory() {
				// this.historyList.push(this.kw)

				// 1. 将 Array 数组转化为 Set 对象
				const set = new Set( this.historyList )
				// 2. 调用 Set 对象的 delete 方法，移除对应的元素
				set.delete( this.kw )
				// 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
				set.add( this.kw )
				// 4. 将 Set 对象转化为 Array 数组，因为Set是无序的
				this.historyList = Array.from( set )

				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地,将数组转为字符串
				uni.setStorageSync( 'kw', JSON.stringify( this.historyList ) )
			},
			clean() {
				this.historyList = []
				uni.setStorageSync( 'kw', '[]' )
			},
			// 点击跳转到商品列表页面
			gotoGoodsList( kw ) {
				uni.navigateTo( {
					url: '/subpkg/goods_list/goods_list?query=' + kw
				} )
			}



		},

		computed: {
			histories() {
				return [ ...this.historyList ].reverse()
			}
		},
	}
</script>

<style lang="scss">
	.search-box {
		background-color: #c00000;
	}

	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				color: #000000;
				background-color: #f3f3f3;
				display: block;
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>