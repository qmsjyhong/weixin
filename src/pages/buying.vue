<template>
    <div class="pt pb">
        <v-head-com>
            <span class="shop-title ellipsis">{{info.shop_name}}</span>
        </v-head-com>
        <div class="content">
            <div class="cover">
                <img class="cover-pic" src="../assets/buying/img_head.png">
            </div>
            <div class="banners">
                <img v-bind:src="info.pic_url + (info.pic_url.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_fill,h_187,w_347'">
                <p class="limit-time">截至日期：{{info.dead_line}}</p>
            </div>

            <div class="commodity-info">
                <h4 class="title fs-16">{{info.title}}</h4>
                <div class="price relative fs-24">
                    <em>¥{{info.price | currency}} </em>
                    <em>限时抢购</em>
                    <div class="item-timer txt-gray" v-if="info.time">
                        <div class="txt-lightgray" v-if="info.time[0]">{{info.time[0]}}天</div>
                        <div><img src="../assets/home/icon_time.png" />
                            <span>{{info.time[1]}}</span>
                        </div>
                    </div>
                </div>
                <p class="cur-price">原价：
                    <em>¥{{info.old_price | currency}}</em>
                </p>
            </div>
            <div class="buying-tips">
                {{info.directions}}
            </div>
            <div class="about-shop">
                <h4 class="title fs-14 ellipsis">{{info.shop_name}}</h4>
                <p>地址：{{info.address}}</p>
                <p>电话：{{info.tel}}</p>
                <p class="detail">店铺详情</p>
                <div class="share-activity" v-if="browser().isWeixin" v-on:click="share">分享给朋友</div>
            </div>
        </div>
        <div class="footer fs-18" v-on:click="getBuying">立即抢购</div>
        <div v-if="!isShare" class="maskLayer" v-on:click="closeShare"></div>
        <img v-if="!isShare" class="noticePic" v-on:click="closeShare" src="../assets/buying/img_share.png" />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { formatDate, countDown } from '../utils';

    export default {
        data() {
            return {
                info: {},
                isShare: true,
                shareInfo: {} //分享
            };
        },
        created() {
            /* 获取活动信息  */
            this.redOrBuyInfo();
        },
        computed: {
            ...mapGetters(['session', 'shopId', 'activityId'])
        },
        methods: {
            ...mapActions(['_paysucId', '_orderId', '_ajax']),
            redOrBuyInfo() {
                this._ajax({
                    name: 'redOrBuyInfo',
                    options: {
                        shopId: this.shopId,
                        type: 1, //1表示限时抢购，2.表示红包
                        id: this.activityId
                    }
                }).then(res => {
                    res.shopRedPackageList['dead_line'] = formatDate(res.shopRedPackageList['dead_line']).split(" ")[0];
                    this.info = res.shopRedPackageList;
                    this.shareInfo = res.shareInfo;
                    this.browser().isWeixin && this.wxshare();
                    this.handleTime();
                });
            },
            getBuying() {
                if(!this.session) {
                    this.$router.push('login');
                } else {
                    this._ajax({
                        name: 'getLimit',
                        options: {
                            buyId: this.info.id, //限时抢购的id
                            money: this.info.price, //红包id
                            src: this.browser().isWeixin ? 'weixin' : 'wap' //为了区分微信公众号支付还是App微信支付
                        }
                    }).then(res => {
                        //1."您已参加过此活动，期待下次您的参与！",
                        //2."请输入手机或登录！",
                        //3."抢购结束，谢谢参与！",
                        //4."被抢完了，期待下次您的参与！",
                        //5."抢购成功，谢谢你的参与"
                        if(res.limitedBuyId.type == 5) {
                            this._paysucId(res.limitedBuyId.id);
                            this._orderId(res.limitedBuyId.orderId);
                            this.$router.push('limitpay?money=' + this.info.price); //去支付
                        } else {
                            this.msg(res.limitedBuyId.info);
                        }
                    });
                }
            },
            share() {
                this.isShare = false;
            },
            closeShare() {
                this.isShare = true;
            },
            //微信分享
            wxshare() {
                window.wx.showOptionMenu();
                // 分享给朋友
                window.wx.onMenuShareAppMessage({
                    'imgUrl': this.shareInfo.imagePath,
                    'link': this.shareInfo.url,
                    'title': this.shareInfo.title,
                    'desc': this.shareInfo.text
                });
                // 分享到朋友圈
                window.wx.onMenuShareTimeline({
                    'imgUrl': this.shareInfo.imagePath,
                    'link': this.shareInfo.url,
                    'title': this.shareInfo.title + ',' + this.shareInfo.text
                });
            },
            //格式化时间
            handleTime() {
                this.$set(this.info, 'time', countDown(this.info.remainSecond--));
                if(this.info.time[2]) {
                    setTimeout(() => {
                        this.handleTime();
                    }, 1000);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .pb {
        padding-bottom: 1.28rem;
        background: #f9f7e5;
    }

    .shop-title {
        width: 50%;
        margin: 0 auto;
    }

    .content {
        width: 100%;
        margin-bottom: 0.9rem;
        background: #f9f7e5;
    }

    .content .banners {
        position: relative;
        padding: 0 0.28rem;
        background: #fffef2;
        overflow: hidden;
        height: 3.74rem;
    }

    .content .banners img {
        width: 100%;
        height: 100%;
        border-radius: 0.1rem;
    }

    .content .banners .limit-time {
        position: absolute;
        left: 0.28rem;
        right: 0.28rem;
        bottom: 0;
        padding: 0.12rem 0.24rem;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 0 0 0.1rem 0.1rem;
    }

    .content .commodity-info {
        padding: 0.28rem 0.28rem 0.2rem;
        background: #fffef2;
    }

    .content .commodity-info .title {
        width: auto;
        font-weight: 700;
        color: #fe4413;
        margin-bottom: 0.12rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        word-wrap: break-word;
    }

    .content .commodity-info .price {
        margin-bottom: 0.08rem;
        color: #fe4413;
        vertical-align: middle;
    }

    .content .commodity-info .price em {
        margin-left: -0.08rem;
        font-style: normal;
        vertical-align: middle;
    }

    .content .commodity-info .price em:last-child {
        color: #fff;
        font-size: 0.24rem;
        line-height: 0.34rem;
        padding: 0 0.02rem;
        background: #fe4413;
        margin-left: 0.12rem;
    }

    .content .commodity-info .cur-price {
        color: #ffc586;
    }

    .content .commodity-info .cur-price em {
        font-style: normal;
        text-decoration: line-through;
    }

    .content .buying-tips {
        margin-bottom: 0.28rem;
        padding: 0.2rem 0.28rem 0.36rem;
        background: #fffef2;
        border-top: 1px solid #eee;
        line-height: 0.36rem;
        font-size: 0.26rem;
        white-space: normal;
        word-break: break-all;
    }

    .content .about-shop {
        padding: 0.36rem 0.28rem;
        color: #6d6d6d;
        background: #fffef2;
    }

    .content .about-shop .title {
        font-weight: 700;
        color: #444;
    }

    .content .about-shop .detail {
        display: none;
        color: #fe3501;
        padding: 0.06rem 0.22rem;
        margin-top: 0.26rem;
        border: 1px solid #fe9371;
        border-radius: 0.06rem 0.06rem;
    }

    .content .about-shop .share-activity {
        display: inline-block;
        height: 0.52rem;
        line-height: 0.52rem;
        padding: 0px 0.2rem;
        border-radius: 0.3rem;
        color: #fff;
        text-align: center;
        background: #fe3501;
        margin-top: 0.24rem;
    }

    .content .about-shop p {
        line-height: 0.44rem;
    }

    .content .about-shop h4 {
        height: 0.44rem;
        line-height: 0.44rem;
    }

    .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fe3501;
        padding: 4% 0;
        text-align: center;
        color: #fff;
    }

    .maskLayer {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        left: 0rem;
        bottom: 0rem;
        z-index: 102;
    }

    .noticePic {
        position: fixed;
        width: 100%;
        top: 0.6rem;
        left: 0rem;
        z-index: 103;
    }

    .item-timer {
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
</style>