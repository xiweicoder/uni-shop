<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>

		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<!-- 只有navigator才能跳转 -->
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 楼层区域 -->

		<!-- 楼层区域 -->
		<!-- 楼层的容器 -->
		<view class="floor-list">
			<!-- 每一个楼层的 item 项 -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层的标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层的图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
							mode="widthFix"></image>
					</navigator>
					<!-- 右侧 4 个小图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"
							:url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>




	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图的数据列表
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
				// 楼层数据的数据列表
				floorList: []
			};
		},
		onLoad() {
			// 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods: {
			// 3. 获取轮播图数据的方法
			async getSwiperList() {
				// 发起请求
				const {
					data: res
				} = await uni.$http.get( '/api/public/v1/home/swiperdata' )
				// 请求失败
				if ( res.meta.status !== 200 ) return uni.$showMsg()

				//  请求成功，为 data 中的数据赋值
				this.swiperList = res.message
			},

			// 获取分类导航数据的方法
			async getNavList() {
				//发起请求
				const {
					data: res
				} = await uni.$http.get( '/api/public/v1/home/catitems' )
				// 请求失败
				if ( res.meta.status !== 200 ) return uni.$showMsg()

				// 请求成功，为 data 中的数据赋值
				this.navList = res.message
			},

			// 判断分类列表
			navClickHandler( item ) {
				if ( item.name === '分类' ) {
					uni.switchTab( {
						url: '/pages/cate/cate'
					} )
				}
			},
			// 获取首页楼层数据的方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get( '/api/public/v1/home/floordata' )
				// 对数据进行处理
				res.message.forEach( floor => {
					floor.product_list.forEach( prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split( '?' )[ 1 ]
					} )
				} )
				this.floorList = res.message
				if ( res.meta.status !== 200 ) return uni.$showMsg()
			},

			// 跳转到search页面
			gotoSearch() {
				uni.navigateTo( {
					url: '/subpkg/search/search'
				} )
			}

		}
	}
</script>

<style lang="scss">
	// 轮播图
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	// 分类列表
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
	}

	.nav-img {
		width: 128rpx;
		height: 140rpx;
	}

	// 楼层区域
	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	// 楼层图片区域
	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}

	.search-box {
		// 设置定位效果为“吸顶”
		position: sticky;
		// 吸顶的“位置”
		top: 0;
		// 提高层级，防止被轮播图覆盖
		z-index: 999;
	}
</style>