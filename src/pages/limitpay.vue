<template>
    <div class="pt pb">
        <v-head-com>支付订单</v-head-com>
        <section class="content">
            <div class="item-list">
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
        </section>
        <div class="footer">
            <div class="btn-bottom" @click="payBtn" v-if="!paying">确认支付(¥
                <span>{{price | currency}}</span>)</div>
            <div class="btn-bottom disabled" v-else>支付中...</div>
        </div>
        <div v-html="aliPayForm">

        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { weChatPay } from '../utils/wechat';
    import { dirPath } from 'utils';
    import { MessageBox } from 'mint-ui';

    export default {
        data() {
            return {
                price: '', //用户抢购的金额
                userTel: '', //用户输入的电话号码
                userActivityId: '', //抢购的活动的id
                paying: false, //正在支付中...
                payMethod: '', //支付方式：wx:微信; ali:支付宝
                aliPayForm: ''
            };
        },
        created() {
            this.price = this.$route.query.money;

            //根据环境，初始化支付方式，默认选择微信
            if(this.browser().isAlipay) {
                this.payMethod = 'ali';
            } else {
                this.payMethod = 'wx';
            }
        },
        computed: {
            ...mapGetters(['orderId', 'openId'])
        },
        methods: {
            ...mapActions(['_ajax']),
            payBtn() {
                this.paying = true;

                if(this.payMethod == 'wx' && this.browser().isWeixin) { //微信公众号支付
                    this._ajax({
                        name: 'pay',
                        options: {
                            orderId: this.orderId,
                            spbillCreateIp: '127.0.0.1',
                            jsonp: 'jsonp',
                            jsonpCallback: '',
                            code: '',
                            openid: this.openId,
                            type: '5'
                        }
                    }).then(res => {
                        if(res.result_code == 'SUCCESS') {
                            weChatPay(res, () => {
                                this.$router.replace('buyingsuc');
                            }, () => {
                                this.paying = false;
                            });
                        }
                    });
                } else if(this.payMethod == 'wx' && !this.browser().isWeixin) { //第三方浏览器调用微信支付
                    this._ajax({
                        name: 'wxPayWap',
                        options: {
                            orderId: this.orderId,
                            type: '5'
                        }
                    }).then(res => {
                        if(res.data.result_code == 'SUCCESS') {
                            //打开微信支付
                            window.location.href = res.data.mweb_url;

                            MessageBox.confirm('是否已完成支付？', {
                                'confirmButtonText': '是',
                                'cancelButtonText': '否',
                                'closeOnClickModal': false
                            }).then(() => {
                                this._ajax({
                                    name: 'queryPay',
                                    options: {
                                        orderId: this.orderId
                                    }
                                }).then(res1 => {
                                    //1=已支付
                                    if(res1.code == 1) {
                                        this.$router.replace('buyingsuc');
                                    } else {
                                        this.msg('订单未支付成功');
                                        this.paying = false;
                                    }
                                });
                            }, () => {
                                this.paying = false;
                            });
                        }
                    });
                } else if(this.payMethod == 'ali') { //第三方浏览器调用支付宝支付
                    this._ajax({
                        name: 'aliPay',
                        options: {
                            orderId: this.orderId,
                            type: '5',
                            returnUrl: dirPath() + '/?from=wechat#/buyingsuc'
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
            }
        }

    };
</script>

<style scoped>
    .item-list {
        width: 100%;
        height: auto;
    }

    .item {
        height: 1.5rem;
        padding: 0 0.28rem;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }

    .item-left img {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.2rem;
    }

    .item-right {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url(../assets/common/btn_box.png);
        background-size: 95%;
        background-repeat: no-repeat;
    }

    .item.active .item-right {
        background-image: url(../assets/common/icon_payment.png);
    }

    .disabled {
        background: #999;
    }
</style>