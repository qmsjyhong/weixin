<template>
    <div class="pb">
        <section class="content">
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
            <div v-if="userTel" class="modifyNum">{{userTel}}
                <a href="javascript:;" v-on:click="popBoxMsg">修改</a>
            </div>
            <div class="about-shop">
                <h4 class="title fs-14 ellipsis">{{info.shop_name}}</h4>
                <p>地址：{{info.address}}</p>
                <p>电话：{{info.tel}}</p>
                <p class="detail">店铺详情</p>
                <div class="share-activity" v-if="browser().isWeixin" v-on:click="share">分享给朋友</div>
            </div>
        </section>
        <div class="footer fs-18" v-on:click="receiveBtn(info.shop_id)">立即抢购</div>
        <div class="validate-actionsheet actionsheet-toggle" v-if="!isTel">
            <div class="list-cell phone">
                <span class="list-bd">电话</span>
                <div class="list-hd">
                    <input type="text" name="phone" v-model.trim="phoneNum" placeholder="请输入正确的手机号码" autocomplete="off">
                </div>
            </div>
            <div class="list-cell code">
                <span class="list-bd">验证码</span>
                <div class="list-hd">
                    <input readonly="readonly" type="text" name="code" v-bind:value="this.codeShow" placeholder="请获取验证码">
                </div>
                <div class="code-btn" v-on:click="getCode">获取验证码</div>
            </div>
            <div class="ensure" v-on:click="modifyNum">确定</div>
        </div>
        <div v-if="!isLayer" class="maskLayer" v-on:click="closeShare"></div>
        <img v-if="!isShare" class="noticePic" v-on:click="closeShare" src="../assets/buying/img_share.png">
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { formatDate, countDown } from '../utils';

    export default {
        data() {
            return {
                info: {},
                isLayer: true,
                isShare: true,
                isTel: true,
                shopId: '',
                activityId: '',
                phoneNum: '',
                codeShow: '',
                isCode: false, //没有验证码
                shareInfo: {}, //分享
                activityArr: [],
                isSuccId: '',
                isActivityId: '',
                userTel: ''
            };
        },
        created() {
            /* 获取活动信息  */
            this.shopId = this.$route.query.shopId; //shopId
            this.activityId = this.$route.query.activityId; //活动id

            //如果localStorage已存在电话号码，取出显示
            if(localStorage.getItem('userTel')) {
                this.userTel = localStorage.getItem('userTel');
                this.phoneNum = localStorage.getItem('userTel');
            }

            if(localStorage.getItem('userActivityIdSucc')) {
                this.activityArr = JSON.parse(localStorage.getItem('userActivityIdSucc'));
                /* eslint-disable semi-spacing */
                for(var i = 0; i < this.activityArr.length; i++) {
                    if(this.activityArr[i].activityId == this.activityId) {
                        this.isActivityId = this.activityArr[i].activityId;
                        this.isSuccId = this.activityArr[i].succId;
                    }
                }
            }

            //满足if条件，说明已经抢购过此活动
            if(localStorage.getItem('userTel') && this.isActivityId && this.isSuccId) {
                this._paysucId(this.isSuccId);
                this.$router.push('sharebuyingsuc');
            } else {
                this.redOrBuyInfo();
            }

        },
        methods: {
            ...mapActions(['_paysucId', '_orderId', '_shopId', '_ajax']),
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
            receiveBtn(shopId) {
                if(this.userTel) {
                    this.getBuying(shopId);
                } else {
                    this.popBoxMsg();
                }
            },
            popBoxMsg() {
                this.isLayer = false;
                this.isTel = false;
            },
            modifyNum() {
                let tel = this.phoneNum.replace(/(^\s*)|(\s*$)/g, "");

                if(!tel) {
                    this.msg('请输入手机号!');
                    return false;
                }
                if(!/^1[3578]\d{9}$/.test(tel)) {
                    this.msg('手机号码不正确!');
                    return false;
                }

                if(!this.isCode) {
                    this.msg('请获取验证码!');
                    return false;
                }

                this.userTel = this.phoneNum;
                this.closeShare();
                localStorage.userTel = this.userTel;
            },
            getBuying(shopId) {
                this._shopId(shopId);
                this._ajax({
                    name: 'getLimit',
                    options: {
                        buyId: this.info.id, //限时抢购的id
                        money: this.info.price,
                        tel: this.userTel,
                        src: this.browser().isWeixin ? 'weixin' : 'wap' //为了区分微信公众号支付还是App微信支付
                    }
                }).then(res => {
                    //1."您已参加过此活动，期待下次您的参与！",
                    //2."请输入手机或登录！",
                    //3."抢购结束，谢谢参与！",
                    //4."被抢完了，期待下次您的参与！",
                    //5."抢购成功，谢谢你的参与"
                    if(res.limitedBuyId.type == 5) {
                        this._paysucId(res.limitedBuyId.id); //保存成功后展示信息需要的id
                        this._orderId(res.limitedBuyId.orderId);
                        this.$router.push('sharelimitpay?money=' + this.info.price + '&userTel=' + this.phoneNum + '&userActivityId=' + this.activityId); //去支付
                    } else if(res.limitedBuyId.type == 1) {
                        localStorage.userTel = this.userTel;
                        this.msg(res.limitedBuyId.info);
                        this.closeShare();
                    } else if(res.limitedBuyId.type == 2) {
                        this.msg(res.limitedBuyId.info);
                    } else {
                        this.msg(res.limitedBuyId.info);
                        this.closeShare();
                    }
                    this.codeShow = '';
                });
            },
            share() {
                this.isShare = false;
                this.isLayer = false;
            },
            closeShare() {
                this.isShare = true;
                this.isLayer = true;
                this.isTel = true;
            },
            getCode() {
                let tel = this.phoneNum.replace(/(^\s*)|(\s*$)/g, "");

                if(!tel) {
                    this.msg('请输入手机号!');
                    return false;
                }
                if(!/^1[3578]\d{9}$/.test(tel)) {
                    this.msg('手机号码不正确!');
                    return false;
                }
                this.codeShow = this.getRandom();
                this.isCode = true;
            },
            getRandom() {
                var charactors = "0123456789";
                var value = '',
                    i, j;

                /* eslint-disable semi-spacing */
                for(j = 1; j <= 4; j++) {
                    i = parseInt(10 * Math.random());
                    value = value + charactors.charAt(i);
                }
                return value;
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
                this.$set(this.info, 'time', countDown(--this.info.remainSecond));
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
    input {
        font-family: '微软雅黑';
    }

    .pb {
        padding-bottom: 1.28rem;
        background: #f9f7e5;
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
        z-index: 10;
    }

    .maskLayer {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
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

    .validate-actionsheet {
        position: fixed;
        left: 0rem;
        bottom: 0rem;
        transform: translate(0, 100%);
        backface-visibility: hidden;
        z-index: 5000;
        width: 100%;
        background-color: #fff;
        transition: transform 0.3s;
    }

    .validate-actionsheet .list-cell {
        padding: 0.2rem 0;
        font-size: 0.32rem;
        border-bottom: 1px solid #eee;
        position: relative;
        overflow: hidden;
    }

    .validate-actionsheet .list-cell .list-bd {
        padding-left: 0.84rem;
        color: #323232;
        width: 1.16rem;
        height: 0.48rem;
        line-height: 0.48rem;
        float: left;
    }

    .validate-actionsheet .list-cell .list-hd {
        width: 5rem;
        float: left;
    }

    .validate-actionsheet .list-cell .list-hd input {
        border: 0;
        outline: 0;
        -webkit-appearance: none;
        background-color: transparent;
        background: none;
        font-size: 0.3rem;
        color: #999;
        opacity: 1;
        width: 100%;
        height: 0.48rem;
        line-height: 0.48rem;
    }

    input[disabled] {
        color: #999 !important;
        opacity: 1 !important;
    }

    .validate-actionsheet .list-cell .code-btn {
        width: 2rem;
        height: 0.6rem;
        line-height: 0.6rem;
        color: #fff;
        font-size: 0.28rem;
        background: #ffc000;
        border-radius: 0.08rem;
        position: absolute;
        right: 0.2rem;
        top: 0.14rem;
        text-align: center;
    }

    .validate-actionsheet .list-cell .disabled {
        width: 1.88rem;
        background: #ccc;
    }

    .validate-actionsheet .phone .list-bd {
        background: url('../assets/buying/icon_phone.png') no-repeat 0.28rem 0.08rem;
        background-size: 0.32rem 0.32rem;
    }

    .validate-actionsheet .code .list-bd {
        background: url(../assets/buying/icon_code.png) no-repeat 0.28rem 0.08rem;
        background-size: 0.32rem 0.32rem;
    }

    .validate-actionsheet .ensure {
        width: 100%;
        padding: 4% 0;
        color: #fff;
        font-size: 0.36rem;
        text-align: center;
        background: #fe5615;
    }

    .validate-actionsheet.actionsheet-toggle {
        transform: translate(0, 0);
    }

    .modifyNum {
        background: #fffef2;
        margin-bottom: 0.28rem;
        padding: 0 0.28rem;
        line-height: 0.8rem;
    }

    .modifyNum a {
        color: #fe4413;
        margin-left: 0.1rem;
        text-decoration: underline;
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