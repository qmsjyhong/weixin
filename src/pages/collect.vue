<template>
    <div class="pt">
        <v-head-com>我的收藏</v-head-com>
        <div class="content">
            <div v-if="collect.length" id="collect" v-infinite-scroll="loadmore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <ul class="collect">
                    <router-link to="shophome" class="box-h" tag="li" v-for="(item, index) in collect" @click.native="_shopId(item.shopId)">
                        <div class="collect-icon">
                            <img :src="item.logo" />
                        </div>
                        <div class="collect-middle flex1">
                            <span class="shop-name ellipsis">{{item.shopName}}</span>
                            <span class="address ellipsis">{{item.address}}</span>
                        </div>
                        <button v-if="!(item.type == 2 || item.type == 3)" class="collect-cancel" v-on:click.stop.prevent.self="cancelCollect(item, index)">取消收藏</button>
                    </router-link>
                </ul>
            </div>
            <div v-else class="empty-list">
                <img src="../assets/blank/img_collect.png" /><br />
                <span>暂无收藏</span>
            </div>
            <p class="loading" v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                加载中...
            </p>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                collect: [],
                loading: false, //无限滚动开关 ,
                pageInfo: {}
            };
        },
        created() {
            this.reqMsg();
        },
        methods: {
            ...mapActions(['_shopId', '_ajax']),
            loadmore() {
                this.loading = true;
                setTimeout(() => {
                    this.reqMsg();
                }, 500);
            },
            reqMsg() {
                this._ajax({
                    name: 'favorite',
                    options: {
                        currentPage: (this.pageInfo.currentPage || 0) + 1
                    }
                }).then(res => {
                    //1：手动收藏 2：扫码收藏 3：扫码支付收藏（2，3不能取消收藏）
                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.collect = [];
                    }
                    this.collect = this.collect.concat(res.findUserCollectShopPage);

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }
                });
            },
            cancelCollect(item, index) {
                this._ajax({
                    name: 'favoriteAction',
                    options: {
                        'userCollectShopFlag': '1',
                        'shopId': item.shopId
                    }
                }).then(res => {
                    if(res.saveShopTable.type == 4) {
                        this.collect.splice(index, 1);
                        this.msg(res.saveShopTable.info);
                    } else {
                        this.msg('网络不佳,请重试!');
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .collect {
        font-size: 0.24rem;
        li {
            background: #fff;
            padding: 0.28rem;
            border-bottom: 1px solid #eeeddd;
            .collect-icon {
                padding-right: 0.28rem;
                img {
                    width: 1.2rem;
                    height: 1.2rem;
                    border-radius: 0.08rem;
                }
            }
            .collect-middle {
                .shop-name {
                    font-size: 0.32rem;
                    padding-bottom: 0.2rem;
                }
                .address {
                    color: #666;
                    font-size: 0.24rem;
                }
            }
            .collect-cancel {
                padding: 0.1rem 0.2rem;
                border-radius: 1rem;
                color: #fb5616;
                border: 1px solid #fb5616;
                background: #fff;
            }
        }
    }
</style>