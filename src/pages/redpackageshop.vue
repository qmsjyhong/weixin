<template>
    <div class="pt">
        <v-head-com>我的红包</v-head-com>
        <section class="content">
            <ul v-if="list.length" class="list" v-infinite-scroll="loadmore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <li class="box-h relative" v-for="item in list" :key="item.shopId">
                    <div class="value">
                        <span class="large">{{item.cash}}</span>元</div>
                    <div class="detail" v-bind:class="item.readFlag==0 && item.shopId!=0?'redpoint':''">
                        <span class="fs-18 bold">{{item.shopName}}</span>
                        <div class="txt-gray">满{{item.useCash}}元可用</div>
                        <span v-if="item.shopId!=0" class="txt-btn" v-on:click="goToShop(item)">下单使用</span>
                        <span v-if="item.shopId==0" class="txt-gray">该红包只能在活动店铺使用</span>
                    </div>
                    <div class="pMark" v-if="item.shopId == 0">平台活动</div>
                    <div class="shareBtn" v-if="item.shopId == 0 && browser().isWeixin " v-on:click="share">分享红包</div>
                </li>
            </ul>
            <div v-else class="empty-list">
                <img src="../assets/blank/img_red.png" />
                <p>暂无红包</p>
            </div>
            <p class="loading" v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                加载中...
            </p>
        </section>
        <div v-if="!isShare" class="maskLayer" v-on:click="closeShare"></div>
        <img v-if="!isShare" class="noticePic" v-on:click="closeShare" src="../assets/buying/img_share.png">
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                list: [],
                isShare: true,
                shareInfo: {}, //分享
                pageInfo: {}, //分页信息
                loading: false //加载中
            };
        },
        created() {

            this.getRedList();
        },
        methods: {
            ...mapActions(['_shopId', '_ajax']),
            //获取红包列表
            getRedList() {
                this._ajax({
                    name: 'getRedPacketList',
                    method: 'get',
                    options: {
                        currentPage: (this.pageInfo.currentPage || 0) + 1
                    }
                }).then(res => {
                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.list = [];
                        if(res.info.length && res.info[0].shopId == 0) {
                            this.shareInfo = res.info[0].shareInfo;
                            this.browser().isWeixin && this.wxshare();
                        }
                    }
                    this.list = this.list.concat(res.info);

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }
                });
            },
            goToShop(item) {
                this.$router.push('shophome');
                this._shopId(item.shopId);
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
            //加载更多
            loadmore() {
                this.loading = true;
                setTimeout(() => {
                    this.getRedList();
                }, 500);
            }
        }

    };
</script>

<style scoped>
    .list li {
        margin: 0.4rem;
        border-radius: 0.2rem;
        border: 1px solid #eee;
        background: #fff url(../assets/mine/bg_redpacket_left.png) no-repeat -0.04rem -0.01rem;
        background-size: 0.3rem 110%;
    }

    .list li .value {
        font-size: 0.28rem;
        /*height: 100%;*/
        color: #ee3504;
        width: 30%;
        text-align: center;
    }

    .list li .detail {
        padding-left: 3%;
        -webkit-box-flex: 1;
        padding: 7%;
        width: 70%;
        min-height: 2rem;
        border-left: 1px dashed #ddd;
    }

    .list li .value .large {
        font-size: 0.6rem;
    }

    .list li .detail .txt-btn {
        border-color: #666;
        color: #666;
    }

    .list li .detail div {
        padding: 0.14rem 0;
    }

    .txt-btn {
        border: 1px solid #fd5615;
        color: #fd5615;
        padding: 0.06rem 0.3rem;
        border-radius: 0.4rem;
        font-size: 0.24rem;
    }

    .detail span:nth-child(1) {
        color: #333;
    }

    .noneDate {
        height: 100%;
        text-align: center;
    }

    .noneDate img {
        width: 3.6rem;
        height: 3.6rem;
        margin-top: 30%;
    }

    .noneDate p {
        text-align: center;
        color: #999;
        font-size: 0.4rem;
        height: 1rem;
        line-height: 1rem;
        margin-bottom: 10%;
    }

    .redpoint {
        position: relative;
    }

    .redpoint:after {
        content: '';
        width: 0.24rem;
        height: 0.24rem;
        background: red;
        display: block;
        position: absolute;
        right: 0.24rem;
        border-radius: 50%;
        top: 50%;
        margin-top: -0.12rem;
    }

    .pMark {
        position: absolute;
        top: -1px;
        left: 0.45rem;
        width: 1.25rem;
        height: 0.5rem;
        z-index: 2;
        background: url(../assets/mine/img_label.png) no-repeat;
        background-size: 100% 100%;
        color: #fff;
        text-align: center;
        line-height: 0.42rem;
        font-size: 0.24rem;
    }

    .shareBtn {
        position: absolute;
        width: 1.22rem;
        height: 0.4rem;
        line-height: 0.4rem;
        border: 1px solid #ff5c60;
        text-align: center;
        top: 52%;
        right: 0.26rem;
        margin-top: -0.2rem;
        font-size: 0.24rem;
        color: #ff5c60;
        border-radius: 3px;
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
</style>