<template>
    <div>
        <ul :class="{'bottom-empty': shopList.length < 6 && from == 'home'}" v-if="shopList.length" class="shopList" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
            <li v-for="item in shopList" class="box-h item" @click="goShopHome(item.shopId)">
                <img class="commodityPic" :src="item.logo + (item.logo.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_fixed,h_170,w_170'" />
                <div class="commodityContent flex1">
                    <div class="line1 ellipsis">{{item.shopName}}</div>
                    <div class="line2 txt-gray">¥{{item.avgMoney | currency}}
                        <span :class="{'txt-orange': item.type == 2}">/</span>人
                        <v-stars :mini="true" class="right" :number="item.commentRating"></v-stars>
                    </div>
                    <div class="line3 ellipsis txt-lightgray">{{item.dataName}}<img v-if="item.isRedActivity == 1" src="../assets/home/icon_red.png" /></div>
                    <div class="right distance txt-lightgray">{{item.businessCirclName | address}}
                        <span v-if="item.distance">{{item.distance | distance}}</span>
                    </div>
                    <div class="isLikeMany" @click.stop="toggleLikeMany(item)">
                        <i><img src="../assets/common/icon_praise_orange.png" /></i>
                        <i class="praise_count txt-orange">{{item.likeSize}}人</i>
                    </div>
                </div>
            </li>
        </ul>
        <div v-else class="empty-list" :class="{'bottom-empty': from == 'home'}">
            <img src="../assets/blank/img_business.png" /><br />
            <span>暂无商家</span>
        </div>
        <p v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading" class="loading">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
        </p>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { formatDistance } from '../utils';

    export default {
        data() {
            return {
                pageInfo: {}, //分页
                shopList: [], //店铺列表
                loading: false, //加载中...
                extParam: {}
            };
        },
        created() {
            this.$root.eventHub.$on('sendExtParam', item => {
                this.extParam = item;
            });
        },
        props: ['from'],
        filters: {
            distance(val) {
                return formatDistance(val);
            },
            address(item) {
                if(item.length > 4) {
                    item = item.substr(0, 4) + '...';
                }
                return item + ' ';
            }
        },
        computed: {
            ...mapGetters(['lbsInfo', 'session'])
        },
        watch: {
            lbsInfo() {
                this.extParam.count++;
            },
            extParam: {
                'handler': function() {
                    this.pageInfo = {};
                    this.reqShopList();
                },
                deep: true
            }
        },
        methods: {
            ...mapActions(['_shopId', '_ajax']),
            //店铺列表
            reqShopList() {
                let params = {
                    'cityID': this.lbsInfo.adcode,
                    'lng': this.lbsInfo.lng,
                    'lat': this.lbsInfo.lat,
                    'page.currentPage': (this.pageInfo.currentPage || 0) + 1,
                    'page.pageSize': 10,
                    'sort': 'distance'
                };

                this._ajax({
                    name: 'shopList',
                    options: Object.assign(params, this.extParam)
                }).then(res => {
                    res.shops.forEach(item => {
                        /* eslint-disable no-warning-comments */
                        item.active = false; //TODO 可以无限点赞
                    });
                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.shopList = [];
                    }
                    this.shopList = this.shopList.concat(res.shops);

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }
                });
            },
            //跳转到店铺首页
            goShopHome(shopId) {
                this._shopId(shopId);
                this.$router.push('shophome');
            },
            //点赞
            toggleLikeMany(item) {
                if(!this.session) {
                    this.$router.push('login');
                    return false;
                }
                if(item.active) {
                    this._ajax({
                        name: 'likeDel',
                        options: {
                            shopId: item.shopId
                        }
                    }).then(res => {
                        item.likeSize = res.deleteUserLikeShop.likeSize;
                        item.active = !item.active;
                    });
                } else {
                    this._ajax({
                        name: 'likeAdd',
                        options: {
                            shopId: item.shopId
                        }
                    }).then(res => {
                        item.likeSize = res.addUserLikeShop.likeSize;
                        item.active = !item.active;
                    });
                }
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
    .bottom-empty {
        padding-bottom: 9rem;
    }

    .shopList {
        background: #fff;
        .item {
            overflow: hidden;
            border-bottom: 1px solid #eee;
            position: relative;
            margin-left: 0.28rem;
            padding: 0.36rem 0.28rem 0.36rem 0;
            .commodityPic {
                width: 1.7rem;
                height: 1.7rem;
                border-radius: 0.08rem;
                border: 1px solid #eee;
            }
            .commodityContent {
                padding-left: 0.26rem;
                position: relative;
                .line1 {
                    height: 0.6rem;
                    font-size: 0.3rem;
                    font-weight: bold;
                    padding-right: 2.2rem;
                }
                .line2 {
                    height: 0.5rem;
                }
                .line3 {
                    height: 0.4rem;
                    position: relative;
                    padding-right: 1.6rem;
                    img {
                        width: 0.35rem;
                        height: 0.35rem;
                        padding-left: 0.2rem;
                    }
                }
                .distance {
                    position: absolute;
                    right: 0;
                    top: 0;
                    font-size: 0.24rem;
                    text-align: right;
                }
                .isLikeMany {
                    position: absolute;
                    z-index: 2;
                    right: 0;
                    height: 0.52rem;
                    line-height: 0.52rem;
                    bottom: 0;
                    width: 1.6rem;
                    text-align: right;
                    font-size: 0.24rem;
                    img {
                        width: 0.44rem;
                        height: 0.44rem;
                        margin-top: -0.16rem;
                    }
                }
            }
        }
    }
</style>