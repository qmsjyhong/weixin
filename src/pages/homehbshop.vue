<template>
    <div class="pt">
        <v-head-com :hidehome="true" :hidemine="true">红包专区</v-head-com>
        <div class="content">
            <ul v-if="list.length" class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <router-link v-for="item in list" class="item flex" to="homehb" tag="li" @click.native="_shopId(item.id)">
                    <div class="item-pic">
                        <img class="commodityPic" :src="item.logo + (item.logo.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_fixed,h_170,w_170'" />
                    </div>
                    <div class="item-detail flex-auto">
                        <div class="line1 ellipsis">{{item.shopName}}</div>
                        <div class="line2">
                            <v-stars class="stars" :number="item.commentRating"></v-stars>
                        </div>
                        <div class="item-circle">{{item.address}}</div>
                    </div>
                </router-link>
            </ul>
            <div v-else class="empty-list">
                <img src="../assets/blank/img_common.png" />
                <p>这里空空如也，请稍后再来</p>
            </div>
            <p v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading" class="loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                <span>加载中...</span>
            </p>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                pageInfo: {}, //分页
                loading: false, //加载中...
                list: [] //包含红包的店铺列表
            };
        },
        created() {
            this.reqList();
        },
        computed: {
            ...mapGetters(['lbsInfo'])
        },
        methods: {
            ...mapActions(['_shopId', '_activityId', '_ajax']),
            //限时抢购列表
            reqList() {
                this._ajax({
                    name: 'redShopList',
                    options: {
                        currentPage: (this.pageInfo.currentPage || 0) + 1,
                        pageSize: 10,
                        cityId: this.lbsInfo.adcode
                    }
                }).then(res => {
                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.list = [];
                    }
                    this.list = this.list.concat(res.shopList);

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }

                    this.list.forEach(item => {
                        let index = item.logo.indexOf('?');

                        if(index != -1) {
                            item.logo = item.logo.substr(0, index);
                        }
                    });
                });
            },
            //分页
            loadMore() {
                this.loading = true;
                setTimeout(() => {
                    this.reqList();
                }, 500);
            }
        }
    };
</script>

<style lang="less" scoped>
    .content {
        background: #fff;
    }

    .list {
        padding-left: 0.28rem;
        .item {
            border-bottom: 1px solid #eee;
            position: relative;
            padding: 0.36rem 0.28rem 0.36rem 0;
            align-items: stretch;
            &-pic {
                width: 1.7rem;
                height: 1.7rem;
                border-radius: 0.08rem;
                border: 1px solid #eee;
                margin-right: 0.26rem;
                flex: 0 0 auto;
                img {
                    height: 100%;
                    border-radius: 0.08rem;
                }
            }
            &-detail {
                position: relative;
                margin: 0.2rem 0;
                overflow: hidden;
                .line1 {
                    font-size: 0.3rem;
                    font-weight: bold;
                }
                .line2 {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                }
                .item-circle {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    color: #999;
                    font-size: 0.22rem;
                }
            }
        }
    }
</style>