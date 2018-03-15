<template>
    <div class="pt">
        <v-head-sam>搜索餐厅</v-head-sam>
        <div class="content">
            <form class="search-form" onsubmit="return false;">
                <div class="search-input-wrapper">
                    <input id="keywords" placeholder="餐厅名称、地点、菜名" class="search-bar" v-model="keyword">
                </div>
                <button id="searchBtn" class="search-btn" @click="search">搜索</button>
            </form>
            <ul v-if="this.shops.length" class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <router-link to="shophome" class="rightArrow relative" v-for="(item, index) in shops" tag="li" @click.native="_shopId(item.shopId)">
                    <span class="name ellipsis">{{item.shopName}}</span>
                    <span class="right range">{{item.distance | formatDistance}}</span>
                </router-link>
            </ul>
            <div v-else-if="!isInit" class="noSearch">暂无搜索结果</div>
            <p v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading" class="loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                加载中...
            </p>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { formatDistance, trim } from '../utils';
    import $ from 'jquery';

    export default {
        data() {
            return {
                keyword: '', //关键字
                isInit: true, //初始化时不显示搜索为空的信息
                pageInfo: {}, //分页
                loading: false, //加载中...
                shops: [] //店铺列表
            };
        },
        created() {
            this.$nextTick(() => {
                setTimeout(() => {
                    $('#keywords').trigger('click').focus();
                }, 1000);
            });
        },
        filters: {
            formatDistance(val) {
                return formatDistance(val);
            }
        },
        computed: {
            ...mapGetters(['lbsInfo'])
        },
        methods: {
            ...mapActions(['_shopId', '_ajax']),
            //关键字搜索餐厅
            search() {
                if(!trim(this.keyword)) {
                    this.msg('请输入关键字');
                    return;
                }

                this.pageInfo.currentPage = 0;
                this.reqShopList();
            },
            //请求数据
            reqShopList() {
                this._ajax({
                    name: 'shopList',
                    options: {
                        'keyword': this.keyword,
                        'cityID': this.lbsInfo.adcode,
                        'lng': this.lbsInfo.lng,
                        'lat': this.lbsInfo.lat,
                        'sort': 'keyword',
                        'page.pageSize': 20,
                        'page.currentPage': (this.pageInfo.currentPage || 0) + 1
                    }
                }).then(res => {
                    this.isInit = false;

                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.shops = [];
                    }
                    this.shops = this.shops.concat(res.shops);

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }
                });
            },
            //分页
            loadMore() {
                this.loading = true;
                setTimeout(() => {
                    this.reqShopList();
                }, 500);
            }
        }
    };
</script>

<style lang="less" scoped>
    .content {
        background: #fff;
    }

    .search-form {
        position: relative;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        padding: 0.3rem;
        position: absolute;
        width: 100%;
        background: #fff;
        z-index: 1;
        .search-input-wrapper {
            width: 5rem;
            height: 0.8rem;
            .search-bar {
                height: 100%;
                border-radius: 5px;
                padding: 0 0.2rem;
                background-color: #f3f3f3;
                width: 100%;
                border: none;
            }
        }
        .search-btn {
            border: none;
            height: 0.8rem;
            line-height: 0.8rem;
            width: 1.4rem;
            background: #fe5615;
            color: #fff;
            border-radius: 5px;
        }
    }

    .list {
        height: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        font-size: 0.28rem;
        padding-top: 1.4rem;
        li {
            padding: 0.24rem;
            border-bottom: 1px solid #eee;
            color: #333;
            position: relative;
            .range {
                position: absolute;
                top: 0.24rem;
                right: 0;
                padding-right: 0.6rem;
                color: #666;
            }
            .name {
                margin-right: 1.6rem;
            }
        }
    }

    .noSearch {
        text-align: center;
        padding: 0.4rem;
        font-size: 0.28rem;
        margin-top: 1.4rem;
    }
</style>