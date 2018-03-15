<template>
    <div class="pt pb">
        <v-head-com :hidemine="true">支付订单</v-head-com>
        <div class="content">
            <div class="flex flex-warp mt-25">
                <div class="item">餐厅名称</div>
                <div class="item">{{orderDetail.shopName}}</div>
            </div>
            <div class="flex flex-warp border-b">
                <div class="item">订单编号</div>
                <div class="item">
                    {{orderDetail.orderNo}}
                </div>
            </div>

            <div class="flex flex-warp">
                <div class="item">原价</div>
                <div class="item">
                    <span class="txt-through">¥ {{orderDetail.preferentialMoneyBefore | currency}}</span>
                </div>
            </div>
            <div class="flex flex-warp">
                <div class="item">应付</div>
                <div class="item">
                    <span class="price">¥ {{needPayMoney | currency}}</span>
                </div>
            </div>
            <div class="flex flex-warp">
                <div class="item">平台优惠</div>
                <div class="item">
                    <span v-if="orderDetail.preferentialMoney" class="rebate price">-¥ {{orderDetail.preferentialMoney | currency}}</span>
                    <span v-else class="txt-orange">未选择平台优惠</span>
                </div>
            </div>
            <div class="flex flex-warp" v-if="shopPacketData.redPackageDiscountMoney" @click="isUseRedPacket = !isUseRedPacket">
                <div class="item">红包优惠</div>
                <div class="item">
                    <span class="price" v-if="isUseRedPacket">-¥ {{shopPacketData.redPackageDiscountMoney | currency}}&nbsp;&nbsp;&nbsp;</span>
                    <img v-if="isUseRedPacket" src="../assets/common/icon_checked.png" />
                    <img v-if="!isUseRedPacket" src="../assets/common/icon_check.png" />
                </div>
            </div>
            <div class="item-pay">
                <!--微信公众号：微信支付；  支付宝：支付宝支付；   第三方：选择支付方式-->
                <div class="item box-h" v-if="!browser().isAlipay" v-bind:class="{active : (payMethod == 'wx')}" v-on:click="payMethod = 'wx'">
                    <div class="item-left flex1">
                        <img src="../assets/common/icon_wechat.png" />
                        <span>微信支付</span>
                    </div>
                    <div class="item-right"></div>
                </div>
                <div class="item box-h item-bottom" v-if="!browser().isWeixin" v-bind:class="{active : (payMethod == 'ali')}" v-on:click="payMethod = 'ali'">
                    <div class="item-left flex1">
                        <img src="../assets/common/icon_aipay.png" />
                        <span>支付宝支付</span>
                    </div>
                    <div class="item-right"></div>
                </div>
            </div>
            <div class="get-packet" @click="isShowRedPacketList = true" v-if="redPacket.length"></div>
        </div>
        <div class="footer">
            <div class="btn-bottom" @click="payment" v-if="!paying">
                立即支付&nbsp;&nbsp;¥ {{needPayMoney | currency}}
            </div>
            <div class="btn-bottom disabled" v-else>支付中...</div>
        </div>

        <div class="mask" v-if="isShowRedPacketList && redPacket.length" @click="isShowRedPacketList = false"></div>
        <div v-if="isShowRedPacketList && redPacket.length" class="packet-list" :class="{down: isShowRedPacketList}">
            <div class="packet-header" @click="isShowRedPacketList = false">
                <img src="../assets/payment/img_title.png" />
            </div>
            <div class="packet-info">
                <ul class="discount-info">
                    <li v-for="(item,index) in redPacket" class="box-h">
                        <div class="discount-cash">¥
                            <span class="fs-24">{{item.cash | currency}}</span>
                        </div>
                        <div class="discount-detail flex1">{{item.title}}</div>
                    </li>
                </ul>
                <button class="get" @click="receiveAllRedPacket">一键领取</button>
            </div>
        </div>
        <div v-html="aliPayForm"></div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { calculatePrice, dirPath } from 'utils';
    import { reqOrder } from '../utils/order';
    import { weChatPay } from '../utils/wechat';

    export default {
        data() {
            return {
                orderDetail: {}, //订单详情
                shopPacketData: {}, //店铺（平台）红包信息
                isShowRedPacketList: false, //是否显示红包列表
                isUseRedPacket: true, //是否使用红包优惠
                paying: false, //正在支付中...
                redPacket: [], //可领红包列表
                payMethod: '', //支付方式：wx:微信; ali:支付宝
                aliPayForm: '' //回调支付html
            };
        },
        created() {
            //从登陆页返回是不需要掉红包
            this.reqOrderDetail();
        },
        computed: {
            ...mapGetters(['orderId', 'openId']),
            needPayMoney() {
                let preferential = 0;

                if(this.isUseRedPacket) {
                    preferential = this.shopPacketData.redPackageDiscountMoney || 0;
                }
                return calculatePrice((this.orderDetail.preferentialMoneyAfter || 0) - preferential);
            }
        },
        methods: {
            ...mapActions(['_order', '_ajax']),
            //查询订单
            reqOrderDetail() {
                this._ajax({
                    name: 'orderDetail',
                    options: {
                        id: this.orderId
                    }
                }).then(res => {
                    this.reqOrderDetailHandler(res);
                });
            },
            reqOrderDetailHandler(res) {
                this.orderDetail = res;

                this.getPacketList();
                this.getRedPacket(this.orderDetail.preferentialMoneyAfter, response => {
                    this.shopPacketData = response;
                });
                //根据环境，初始化支付方式，默认选择微信
                if(this.browser().isAlipay) {
                    this.payMethod = 'ali';
                } else {
                    this.payMethod = 'wx';
                }
            },
            //获取红包优惠列表
            getPacketList() {
                this._ajax({
                    name: 'shopRedPackageList',
                    options: {
                        shopId: this.orderDetail.shopId
                    },
                    method: 'get'
                }).then(res => {
                    this.redPacket = res.shopRedPackageList;
                });
            },
            //获取红包优惠
            getRedPacket(money, cb) {
                this._ajax({
                    name: 'findPerfectCoupon',
                    options: {
                        'money': money,
                        'shopId': this.orderDetail.shopId
                    },
                    method: 'get'
                }).then(res => {
                    cb && cb(res.findPerfectCoupon);
                });
            },
            //一键领取所有红包
            receiveAllRedPacket() {
                let ids = [];

                this.redPacket.forEach(item => {
                    ids.push(item.id);
                });

                this._ajax({
                    name: 'oneKeyGetAll',
                    options: {
                        'wxRpIdsStr': JSON.stringify(ids),
                        'shopId': this.orderDetail.shopId
                    }
                }).then(res => {
                    this.redPacket = [];
                    if(res.code == 1) {
                        this.getRedPacket(this.orderDetail.preferentialMoneyAfter, res1 => {
                            this.shopPacketData = res1;
                        });
                        this.msg('领取成功');
                    } else {
                        this.msg(res.msg);
                    }
                });
            },
            //支付下单
            payment() {
                let order = {
                    orderId: this.orderId,
                    remark: this.orderDetail.remark,
                    dinersNum: this.orderDetail.dinersNum,
                    scan: { isScan: +this.orderDetail.isScan },
                    addDish: false,
                    preferentialMoney: this.orderDetail.preferentialMoney
                };
                let payOption = {
                    payment: 3, //---支付方式（可为空）3-：微信支付；4：支付宝支付；5：银联支付
                    preferentialMoney: this.orderDetail.preferentialMoney,//全美食优惠价
                    needPayMoney: this.needPayMoney,
                    redPackageDiscountMoney: 0, //--红包优惠金额 pay
                    userRedPackageId: 0 //--用户红包ID pay
                };

                if(this.isUseRedPacket && this.shopPacketData.redPackageDiscountMoney) {
                    payOption.userRedPackageId = this.shopPacketData.userRedPackageId;
                    payOption.redPackageDiscountMoney = this.shopPacketData.redPackageDiscountMoney;
                }
                this._order(order);
                this.paying = true;
                this.loading.open();

                reqOrder(() => {
                    if(this.payMethod == 'wx' && this.browser().isWeixin) { //微信公众号支付
                        this._ajax({
                            name: 'pay',
                            options: {
                                orderId: this.orderId,
                                spbillCreateIp: '127.0.0.1',
                                jsonp: 'jsonp',
                                jsonpCallback: '',
                                code: '',
                                openid: this.openId
                            }
                        }).then(res => {
                            if(res.result_code == 'SUCCESS') {
                                weChatPay(res, () => {
                                    setTimeout(() => {
                                        this.$router.replace('paysuccess');
                                    }, 500);
                                }, () => {
                                    this.paying = false;
                                    this.loading.close();
                                });
                            }
                        });
                    } else if(this.payMethod == 'wx' && !this.browser().isWeixin) { //第三方浏览器调用微信支付
                        this._ajax({
                            name: 'wxPayWap',
                            options: {
                                orderId: this.orderId
                            }
                        }).then(res => {
                            if(res.data.result_code == 'SUCCESS') {
                                this.$router.replace('wxpayredirect');
                                //打开微信支付
                                window.location.replace(res.data.mweb_url + '&redirect_url=' + encodeURIComponent(location.href.replace('payment', 'wxpayredirect')));
                            }
                        });
                    } else if(this.payMethod == 'ali') { //第三方浏览器调用支付宝支付
                        this._ajax({
                            name: 'aliPay',
                            options: {
                                orderId: this.orderId,
                                returnUrl: dirPath() + '/?from=wechat#/paysuccess'
                            }
                        }).then(res => {
                            if(res.data) {
                                this.aliPayForm = res.data;
                                this.$nextTick(() => {
                                    document.forms[0].submit();
                                });
                            }
                        });
                    }
                }, payOption);
            }
        }
    };
</script>

<style scoped lang="less">
    .content {
        background-color: #f4f4f4;
    }
    .flex-warp.mt-25 {
        padding-top: 0.25rem;
    }
    .border-b {
        border-bottom: 1px solid #ddd;
    }
    .flex-warp {
        justify-content: space-between;
        padding: 0.15rem 0.28rem;
        background: #fff;
        .item {
            -webkit-box-flex: 1;
            text-align: center;
            color: #999;
            font-size: 0.26rem;
            span {
                vertical-align: middle;
            }
            .price {
                color: #fd5615;
            }
            img {
                width: 0.28rem;
                height: 0.28rem;
                vertical-align: middle;
            }
        }
    }

    .packet-list {
        position: fixed;
        background: #fff;
        z-index: 101;
        margin: 0 0.8rem;
        transform: translateY(-50%);
        top: 45%;
        .get {
            width: 3.7rem;
            display: block;
            margin: 0 auto;
            height: 0.9rem;
            background: #fff500;
            color: #fc5715;
            border-radius: 0.8rem;
            margin-top: 0.6rem;
        }
        .packet-info {
            background-color: #fe5615;
            margin-top: -0.4rem;
            border-radius: 0.2rem;
            padding: 0.6rem 0.28rem;
        }
        .discount-info {
            background-color: #ee4200;
            max-height: 5.5rem;
            overflow-y: auto;
            padding: 0 0.2rem;
            -webkit-overflow-scrolling: touch;
            li {
                padding-top: 0.2rem;
                -webkit-box-align: stretch;
                line-height: 1.6rem;
                text-align: center;
                &:last-child {
                    padding-bottom: 0.2rem;
                }
                .discount-cash {
                    background: #fffb9a;
                    color: #fe5615;
                    width: 40%;
                    border-right: 1px dashed lightgray;
                    border-radius: 0.1rem 0 0 0.1rem;
                    position: relative;
                    &:before {
                        content: '';
                        right: -0.2rem;
                        background: #ee4200;
                        width: 0.4rem;
                        height: 0.4rem;
                        display: block;
                        border-radius: 50%;
                        position: absolute;
                        z-index: 102;
                        top: -0.2rem;
                    }
                    &:after {
                        content: '';
                        right: -0.2rem;
                        background: #ee4200;
                        width: 0.4rem;
                        height: 0.4rem;
                        display: block;
                        border-radius: 50%;
                        position: absolute;
                        z-index: 102;
                        bottom: -0.2rem;
                    }
                }
                .discount-detail {
                    background: #fff;
                    border-radius: 0 0.1rem 0.1rem 0;
                }
            }
        }
    }

    .item-pay {
        margin-top: 0.2rem;
        background: #fff;
        .item:first-child {
            border-top: 1px solid #eee;
        }
        .item {
            height: 1.5rem;
            padding: 0 0.28rem;
            border-bottom: 1px solid #eee;
            .item-left {
                img {
                    width: 0.8rem;
                    height: 0.8rem;
                    margin-right: 0.2rem;
                }
            }
            .item-right {
                width: 0.4rem;
                height: 0.4rem;
                background-image: url(../assets/common/btn_box.png);
                background-size: 95%;
                background-repeat: no-repeat;
            }
            &.active {
                .item-right {
                    background-image: url(../assets/common/icon_payment.png);
                }
            }
        }
    }

    .get-packet {
        width: 1rem;
        height: 1.24rem;
        background: url('../assets/payment/icon_getpacket.png') no-repeat;
        background-size: 100% 100%;
        float: right;
        margin-top: 0.53rem;
    }

    .btn-bottom.disabled {
        background: #999;
    }
</style>