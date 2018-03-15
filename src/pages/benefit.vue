<template>
    <div class="pt">
        <v-head-com>店铺红包</v-head-com>
        <section class="content">
            <header>
                <img class="special-img" src="../assets/benefit/bg_top.png" />
            </header>
            <div class="red-text">
                <div class="red-text-con">
                    <div class="con-l">
                        <h2 class="ellipsis" v-bind:class="{'middle-top': isShow != 2}">{{info.shop_name}}</h2>
                        <p>单次支付满{{info.use_cash}}元可用</p>
                        <p v-if="isShow == 2">红包领取成功</p>
                        <p v-if="isShow==2" class="small">请下载全美食App立即使用</p>
                    </div>
                    <div class="con-r">{{info.cash}}</div>
                </div>
                <img class="rewardImg" src="../assets/benefit/bg_middle.png" />
            </div>
            <div class="red-fun">
                <div class="red-fun-item">
                    <input v-if="!isTel" type="text" name="phone" class="input" value="" placeholder="请输入手机号码" />
                    <a v-if="isShow==1" href="javascript:;" v-on:click="getBenefit" class="btn">领取红包</a>
                    <a v-else-if="isShow==2" href="javascript:;" class="btn" v-on:click="_install">下载APP</a>
                    <p v-else class="empty">红包已经被抢光了，<br />期待下次快点来哦！</p>
                </div>
            </div>
            <div class="transition">
                <img src="../assets/benefit/bg_bottom.png" />
            </div>
            <footer>
                <p>地址: {{info.address}}</p>
                <p>电话: {{info.tel}}</p>
                <ul class="shareBtn clearfix" v-if="browser().isWeixin">
                    <li class="left" v-on:click="goShop">浏览店铺</li>
                    <li class="left" v-on:click="share">分享给朋友</li>
                </ul>
                <a v-else href="javascript:;" v-on:click="goShop">
                    <span>浏览店铺</span>
                </a>
            </footer>
        </section>
        <div v-if="!isShare" class="maskLayer" v-on:click="closeShare"></div>
        <img v-if="!isShare" class="noticePic" v-on:click="closeShare" src="../assets/buying/img_share.png" />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                info: {},
                isShow: 1, //==1 显示领取红包，==2显示下载App， ==3显示领完
                isTel: true,
                shareInfo: {}, //分享
                isShare: true
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
            ...mapActions(['_shopId', '_install', '_ajax']),
            redOrBuyInfo() {
                this._ajax({
                    name: 'redOrBuyInfo',
                    options: {
                        shopId: this.shopId,
                        type: 2, //1表示限时抢购，2.表示红包
                        id: this.activityId
                    }
                }).then(res => {
                    this.info = res.shopRedPackageList;
                    this.shareInfo = res.shareInfo;
                    this.browser().isWeixin && this.wxshare();
                    //已经领取了 提示下载app
                    if(this.info.got == 1) {
                        this.isShow = 2;
                    }
                });
            },
            getBenefit() {
                if(!this.session) {
                    this.$router.push('login');
                } else {
                    this._ajax({
                        name: 'getRed',
                        options: {
                            shopId: this.info.shop_id,
                            type: 1, //红包领取用户类型(1-全美食用户；2-收藏本店铺用户；3-绑定本店铺用户)
                            wxRpId: this.info.id, //红包id
                            tel: '' //手机号码：当用户分享的时候，必传，并且type为1
                        }
                    }).then(res => {
                        //5.红包已经被抢光 2.本次红包属于会员客户 6你已经领取过红包了，期待下次再来哦 4.你成功的领取了红包
                        if(res.activityInfo.type == '4') {
                            this.msg(res.activityInfo.info);
                            this.isShow = 2;
                        } else if(res.activityInfo.type == '5') {
                            this.msg(res.activityInfo.info);
                            this.isShow = 3;
                        } else {
                            this.msg(res.activityInfo.info);
                        }
                    });
                }
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
            //浏览店铺
            goShop() {
                this._shopId(this.info.shop_id);
                this.$router.push('shophome');
            },
            share() {
                this.isShare = false;
            },
            closeShare() {
                this.isShare = true;
            }
        }
    };
</script>

<style scoped>
    .special-img {
        vertical-align: bottom;
    }

    .middle-top {
        margin-top: 0.4rem;
    }

    .content {
        position: relative;
        height: 100%;
        overflow: auto;
        background: #ff7c49;
    }

    .red-text {
        position: relative;
    }

    .red-text-con {
        position: absolute;
        top: -0.3rem;
        right: 0;
        left: 0;
        width: 82%;
        height: 1.8rem;
        margin: auto;
        clear: both;
    }

    .red-text-con .con-l {
        float: left;
        margin: auto;
        padding-top: 0.1rem;
        width: 63%;
        height: 1.8rem;
    }

    .con-md {
        padding-top: 0.4rem !important;
    }

    .red-text-con .con-l h2 {
        font-size: 0.28rem;
        color: #111;
        text-indent: 0.4rem;
        line-height: 0.5rem;
        font-weight: bold;
    }

    .red-text-con .con-l p {
        font-size: 0.28rem;
        color: #fe5615;
        text-indent: 0.4rem;
        line-height: 0.4rem;
    }

    .red-text-con .con-l .small {
        font-size: 0.24rem;
        color: #febb93;
        text-indent: 0.4rem;
        line-height: 0.3rem;
    }

    .red-text-con .con-r:after {
        content: '元';
        font-size: 0.32rem;
        letter-spacing: -0.05rem;
        color: #111;
        font-weight: bolder;
        margin-left: 0.1rem;
    }

    .red-text-con .con-r {
        float: left;
        width: 37%;
        height: 1.8rem;
        line-height: 1.8rem;
        text-align: center;
        font-size: 0.72rem;
        letter-spacing: -0.05rem;
        color: #fe5615;
        font-weight: bold;
    }

    .rewardImg {
        display: block;
    }

    .red-fun {
        background-color: #fd5615;
        border: none;
    }

    .red-fun-item {
        position: relative;
        background-color: #ffde00;
        /*height: 100%;*/
        margin: 0 6.9%;
        padding-top: 0.4rem;
        box-sizing: border-box;
    }

    .red-fun-item .btn {
        display: block;
        margin: 0 auto;
        text-align: center;
        font-size: 0.36rem;
        height: 0.9rem;
        line-height: 0.9rem;
        color: #fff;
        width: 80%;
        border-radius: 0.12rem;
        overflow: hidden;
        letter-spacing: 0.04rem;
        font-weight: bold;
        background-image: url(../assets/benefit/img_button.png);
        background-repeat: repeat-x;
        background-size: auto 100%;
    }

    .red-fun-item .input {
        display: block;
        margin: 0 auto 0.2rem;
        text-align: center;
        font-size: 0.32rem;
        width: 80%;
        height: 0.9rem;
        line-height: 0.9rem;
        border-radius: 0.12rem;
        background-color: #fff;
        box-sizing: border-box;
        text-indent: 0;
    }

    .red-fun-item .cc {
        line-height: 2rem;
        text-align: center;
        color: #fe5615;
        font-size: 0.36rem;
        letter-spacing: 2px;
    }

    .content footer {
        min-height: 1.5rem;
        padding: 0 8.5% 0.4rem;
        text-align: center;
    }

    .content footer p {
        color: #fffad9;
        font-size: 0.28rem;
        line-height: 0.45rem;
        margin-bottom: 0.18rem;
        text-align: left;
    }

    .content footer p:last-of-type {
        margin-bottom: 0.3rem;
    }

    .content footer a {
        color: #ff8e3e;
        padding: 0.1rem 0.5rem;
        background-color: #ffde00;
        font-size: 0.28rem;
        border-radius: 0.5rem;
    }

    .empty {
        text-align: center;
        color: #fe5615;
        font-size: 0.36rem;
        letter-spacing: 2px;
    }

    input,
    textarea {
        outline: none;
    }

    .shareBtn {
        width: 80%;
        margin: 0px auto;
        border-radius: 0.5rem;
        background: #ffde00;
        padding: 0.13rem 0rem;
    }

    .shareBtn li {
        width: 50%;
        text-align: center;
        color: #ff8e3e;
        font-size: 0.28rem;
    }

    .shareBtn li:nth-child(1) {
        border-right: 1px solid #fd9f7a;
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