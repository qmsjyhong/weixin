<template>
    <div>
        <section class="content">
            <header>
                <img v-if="platform" class="special-img" src="../assets/benefit/bg_top_p.png" />
                <img v-if="!platform" class="special-img" src="../assets/benefit/bg_top.png" />
            </header>
            <div class="red-text">
                <div class="red-text-con">
                    <div class="con-l">
                        <h2 v-if="!platform" class="ellipsis" v-bind:class="isShow!=2?'middle-top':''">{{info.shop_name}}</h2>
                        <h2 v-if="platform" class="ellipsis" v-bind:class="isShow!=2?'middle-top':''">全美食乐享红包</h2>
                        <p>单次支付满{{info.use_cash}}元可用</p>
                        <p v-if="isShow==2">红包领取成功</p>
                        <p v-if="isShow==2" class="small">请下载全美食App立即使用</p>
                    </div>
                    <div class="con-r">{{info.cash}}</div>
                </div>
                <img class="rewardImg" src="../assets/benefit/bg_middle.png" />
            </div>
            <div class="red-fun">
                <div v-if="platform" class="red-fun-item">
                    <a href="javascript:;" class="btn" v-on:click="download">下载APP 立领红包</a>
                </div>
                <div v-if="!platform" class="red-fun-item">
                    <a v-if="isShow==1" href="javascript:;" v-on:click="receiveBtn" class="btn">领取红包</a>
                    <a v-if="isShow==2" href="javascript:;" class="btn" v-on:click="_install">下载APP</a>
                    <p v-if="isShow==3" class="empty">红包已经被抢光了，<br />期待下次快点来哦！</p>
                </div>
            </div>
            <div class="transition">
                <img src="../assets/benefit/bg_bottom.png" />
                <div v-if="!platform && userTel && isShow==1" class="modifyNum">{{userTel}}
                    <a href="javascript:;" v-on:click="popBoxMsg">修改</a>
                </div>
            </div>
            <footer v-if="!platform">
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
            <dl v-if="platform" class="rule">
                <dt>规则说明：</dt>
                <dd>1. 本红包仅限于活动店铺中使用；</dd>
                <dd>2. 消费结算时，将自动计算最优惠红包使用；</dd>
                <dd>3. 每个红包只能使用一次；</dd>
                <dd>4. 最终解释权归全美食所有。</dd>
                <dd>活动周期：2017年8月18日～2017年9月7日</dd>
            </dl>
        </section>
        <div v-if="!isLayer" class="maskLayer" v-on:click="closeShare"></div>
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
            <div class="list-cell note">
                <span>※根据工信部要求，线上支付服务须绑定手机号码。</span>
            </div>
            <div class="ensure" v-on:click="modifyNum">确定</div>
        </div>
        <div v-if="!isShare" class="maskLayer" v-on:click="closeShareWX"></div>
        <img v-if="!isShare" class="noticePic" v-on:click="closeShareWX" src="../assets/buying/img_share.png" />
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                info: {},
                isShow: 1, //==1 显示领取红包，==2显示下载App， ==3显示领完
                isTel: true,
                isLayer: true,
                isCode: false,
                phoneNum: '',
                codeShow: '',
                shareInfo: {}, //分享
                platform: true, //判断是否是平台分享的红包
                userTel: '', //用户领取红包的手机号码
                userActivityId: '', //用户领取的活动id
                allActivityId: [], //所有的活动id
                isShare: true
            };
        },
        created() {
            /* 获取活动信息  */
            this.shopId = this.$route.query.shopId; //shopId
            this.activityId = this.$route.query.activityId; //活动id

            //如果localStorage已经存在活动id，取出值以便继续存储
            if(localStorage.getItem('userActivityId')) {
                this.allActivityId = localStorage.getItem('userActivityId').split(",");
            }
            //如果localStorage已存在电话号码，取出显示
            if(localStorage.getItem('userTel')) {
                this.userTel = localStorage.getItem('userTel');
                this.phoneNum = localStorage.getItem('userTel');
            }

            //shopid==0是平台创建红包并分享，非0则反之
            if(this.shopId && this.shopId == 0) {
                this.platform = true;
            } else {
                this.platform = false;
                //满足if条件，说明已经抢购过此活动
                if(localStorage.getItem('userTel') && localStorage.getItem('userActivityId') && this.allActivityId.indexOf(this.activityId) != -1) {
                    this.isShow = 2;
                }
            }

            this.redOrBuyInfo();
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
                });
            },
            receiveBtn() {
                if(this.userTel) {
                    this.getBenefit();
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
                this.saveLocal();
            },
            getBenefit() {
                this._ajax({
                    name: 'getRed',
                    options: {
                        shopId: this.info.shop_id,
                        type: 1, //红包领取用户类型(1-全美食用户；2-收藏本店铺用户；3-绑定本店铺用户)
                        wxRpId: this.info.id, //红包id
                        tel: this.userTel //手机号码：当用户分享的时候，必传，并且type为1
                    }
                }).then(res => {
                    //5.红包已经被抢光 2.本次红包属于会员客户 6你已经领取过红包了，期待下次再来哦 4.你成功的领取了红包
                    if(res.activityInfo.type == '4' || res.activityInfo.type == '6') {
                        this.msg(res.activityInfo.info);
                        if(res.activityInfo.type == '4') {
                            this.isShow = 2;
                        }
                        this.saveLocal();
                    } else if(res.activityInfo.type == '5') {
                        this.msg(res.activityInfo.info);
                        this.isShow = 3;
                    } else {
                        this.msg(res.activityInfo.info);
                    }
                    this.closeShare();
                });
            },
            //保存数据到localstorage
            saveLocal() {
                localStorage.setItem('userTel', this.userTel); //保存电话号码
                this.allActivityId.push(this.activityId).toString();
                localStorage.setItem('userActivityId', this.allActivityId); //保存活动id
            },
            closeShare() {
                this.isLayer = true;
                this.isTel = true;
            },
            getCode() {
                var _this = this;

                let tel = this.phoneNum.replace(/(^\s*)|(\s*$)/g, "");

                if(!tel) {
                    this.msg('请输入手机号!');
                    return false;
                }
                if(!/^1[3578]\d{9}$/.test(tel)) {
                    this.msg('手机号码不正确!');
                    return false;
                }
                setTimeout(function() {
                    _this.codeShow = _this.getRandom();
                    _this.isCode = true;
                }, 100);
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
            //浏览店铺
            goShop() {
                this._shopId(this.info.shop_id);
                this.$router.push('shophome');
            },
            share() {
                this.isShare = false;
            },
            closeShareWX() {
                this.isShare = true;
            }
        }
    };
</script>

<style scoped>
    .maskLayer {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        left: 0rem;
        bottom: 0rem;
        z-index: 102;
    }

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
        color: #333333;
        text-indent: 0.4rem;
        line-height: 0.5rem;
        /*font-weight: bold;*/
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
        -webkit-border-radius: 0.12rem;
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
        -webkit-border-radius: 0.12rem;
        background-color: #fff;
        box-sizing: border-box;
        text-indent: 0;
    }

    input[disabled] {
        color: #999 !important;
        opacity: 1 !important;
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
        color: ;
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
        -webkit-border-radius: 0.5rem;
    }

    #mask {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        top: 0;
        display: none;
    }

    #mask .maskBlock {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    #mask .maskContent {
        background: #fff;
        width: 250px;
        height: 135px;
        border-radius: 6px;
        border: 1px solid #eee;
        box-sizing: border-box;
        z-index: 999;
        overflow: hidden;
    }

    #mask .maskContent .rewardTitle {
        padding-top: 30px;
        padding-bottom: 20px;
    }

    #mask .rewardTitle h3 {
        font-size: 16px;
        color: #000;
        text-align: center;
    }

    #mask .rewardControl {
        display: flex;
        width: 100%;
        border-top: 1px solid #eee;
        height: 40px;
    }

    #mask .rewardControl div {
        flex-grow: 1;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }

    #mask .rewardControl div.maskNo {
        border-right: 1px solid #eee;
        color: #fe5615;
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
        padding: 0.3rem 0;
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
        top: 0.24rem;
        text-align: center;
    }

    .validate-actionsheet .list-cell .disabled {
        width: 1.88rem;
        background: #ccc;
    }

    .list-cell.note {
        color: #999;
        font-size: 0.24rem;
        text-align: center;
        padding: 0.6rem 0;
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

    .rule {
        color: #fffad9;
        padding: 0 8.5% 0.4rem;
    }

    .rule dt {
        font-size: 0.3rem;
        margin: 0.2rem 0;
    }

    .rule dd {
        font-size: 0.24rem;
        line-height: 0.4rem;
    }

    .transition {
        position: relative;
    }

    .transition img {
        vertical-align: top;
    }

    .modifyNum {
        position: absolute;
        width: 100%;
        left: 0;
        top: 40%;
        text-align: center;
        color: #fff;
        font-size: 0.28rem;
    }

    .modifyNum a {
        color: #ffde00;
        margin-left: 0.1rem;
        text-decoration: underline;
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