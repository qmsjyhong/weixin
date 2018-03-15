<template>
    <div class="pt">
        <v-head-com :hidehome="true" :hidemine="true">限时抢购</v-head-com>
        <div class="content">
            <ul v-if="list.length" class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <li v-for="item in list" class="item flex">
                    <div class="item-pic">
                        <img class="commodityPic" :src="item.picUrl + (item.picUrl.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_fixed,h_170,w_170'" />
                    </div>
                    <div class="flex-auto relative">
                        <div class="line1 ellipsis">{{item.title}}</div>
                        <div class="line2">
                            <span class="price txt-orange">¥ {{item.price | currency}}</span>
                            <span class="txt-lightgray fs-12">原价:
                                <span class="txt-through">¥ {{item.oldPrice | currency}}</span>
                            </span>
                        </div>
                        <div class="line3 txt-lightgray fs-12">剩余：{{item.amount - item.saleAmount}}份</div>
                        <div class="item-timer txt-gray" v-if="item.time">
                            <div class="txt-lightgray" v-if="item.time[0]">{{item.time[0]}}天</div>
                            <div><img src="../assets/home/icon_time.png" />
                                <span>{{item.time[1]}}</span>
                            </div>
                        </div>
                        <button v-if="item.time[2]" class="item-btn" @click="goToXSQG(item)">立即抢购</button>
                        <button v-else class="item-btn disabled">已结束</button>
                    </div>
                </li>
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
    import { countDown } from '../utils';

    export default {
        data() {
            return {
                pageInfo: {}, //分页
                loading: false, //加载中...
                list: [], //限时抢购列表
                timeout: 0
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
                    name: 'limitBuyList',
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
                    this.list = this.list.concat(res.limitBuyList);
                    this.handleTime();

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }

                    this.list.forEach(item => {
                        let index = item.picUrl.indexOf('?');

                        if(index != -1) {
                            item.picUrl = item.picUrl.substr(0, index);
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
            },
            //跳转到限时抢购详情
            goToXSQG(item) {
                this._shopId(item.shopId);
                this._activityId(item.id);
                this.$router.push('buying');
            },
            //格式化时间
            handleTime() {
                clearTimeout(this.timeout);
                if(this.list.length) {
                    this.list.forEach(item => {
                        this.$set(item, 'time', countDown(item.remainSecond--));
                    });
                    this.timeout = setTimeout(() => {
                        this.handleTime();
                    }, 1000);
                }
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
            .flex-auto {
                overflow: hidden;
            }
            .line1 {
                font-size: 0.3rem;
                font-weight: bold;
                padding-right: 1.8rem;
            }
            .line2 {
                padding: 0.2rem 0;
                .price {
                    font-size: 0.46rem;
                }
            }
            &-timer {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 0.24rem;
                text-align: right;
                img {
                    width: 0.29rem;
                    height: 0.29rem;
                    margin-right: 0.04rem;
                }
                span {
                    vertical-align: middle;
                    line-height: 155%;
                }
            }
            &-btn {
                position: absolute;
                right: 0;
                width: 1.6rem;
                height: 0.6rem;
                line-height: 0.6rem;
                bottom: 0;
                text-align: center;
                font-size: 0.28rem;
                background-color: #fd5615;
                border-radius: 0.06rem;
                color: #fff;
                &.disabled {
                    background-color: #ccc;
                }
            }
        }
    }
</style>