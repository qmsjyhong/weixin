<template>
    <div class="pt pb">
        <v-head-com>支付订单</v-head-com>
        <section class="content">

            <div class="item-list">
                <div class="item">
                    <div class="item-left">
                        <img src="../assets/common/icon_wechat.png">
                        <span>微信支付</span>
                    </div>
                    <div class="item-right">
                        <i class="paySl"></i>
                    </div>
                </div>
            </div>
        </section>
        <div class="footer" v-on:click="payBtn" v-if="!paying">
            确认支付(¥
            <span>{{price | currency}}</span>)
        </div>
        <div class="footer disabled" v-else>支付中...</div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { weChatPay } from '../utils/wechat';

    export default {
        data() {
            return {
                price: '', //用户抢购的金额
                userTel: '', //用户输入的电话号码
                userActivityId: '', //抢购的活动的id
                paying: false, //正在支付中...
                allActivityIdSucc: [] //所有的活动id
            };
        },
        created() {
            this.price = this.$route.query.money;
            this.userTel = this.$route.query.userTel;
            this.userActivityId = this.$route.query.userActivityId;

            //如果localStorage已经存在活动id，取出值以便继续存储
            if(localStorage.getItem('userActivityIdSucc')) {
                this.allActivityIdSucc = JSON.parse(localStorage.getItem('userActivityIdSucc'));
            }

        },
        computed: {
            ...mapGetters(['orderId', 'openId', 'paysucId'])
        },
        methods: {
            ...mapActions(['_ajax']),
            payBtn() {
                //localStorage.userTel = this.userTel; //保存电话号码
                //this.allActivityIdSucc.push({activityId:this.userActivityId,succId:this.paysucId})
                //localStorage.userActivityIdSucc = JSON.stringify(this.allActivityIdSucc); //保存活动id
                this.paying = true;
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
                            localStorage.userTel = this.userTel; //保存电话号码
                            this.allActivityIdSucc.push({
                                activityId: this.userActivityId,
                                succId: this.paysucId
                            });
                            localStorage.userActivityIdSucc = JSON.stringify(this.allActivityIdSucc); //保存活动id

                            this.$router.push('sharebuyingsuc');
                        }, () => {
                            this.paying = false;
                        });
                    }
                });
            }
        }

    };
</script>

<style scoped>
    .item-list {
        width: 100%;
        height: auto;
    }

    .item-list .item {
        width: 100%;
        height: 1.3rem;
        line-height: 1.3rem;
        overflow: hidden;
        clear: both;
        padding: 0 0.3rem;
        background-color: white;
        border-bottom: 1px solid #eee;
    }

    .item-list .item .item-left {
        display: inline-block;
        width: auto;
        float: left;
    }

    .item-list .item .item-left img {
        width: 0.8rem;
        height: 0.8rem;
        display: inline-block;
    }

    .item-list .item .item-left span {
        padding-left: 0.2rem;
    }

    .item-list .item .item-right {
        display: inline-block;
        width: auto;
        float: right;
        text-align: center;
        line-height: 1.36rem;
    }

    i.paySl {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url(../assets/common/icon_payment.png);
        background-size: cover;
        margin-top: 0.45rem;
    }

    .footer {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        position: fixed;
        bottom: 0rem;
        background-color: #fd5615;
        color: white;
        font-size: 0.36rem;
    }

    .disabled {
        background: #999;
    }
</style>