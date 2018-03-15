<template>
    <div id="orderdetail" class="pt" :class="{'pb': hasFooter}">
        <v-head-com to='orderlist' :hidemine="true" :hidehome="true">订单详情
            <span v-if="orderDetail.operateMap.CANCEL" @click="cancelOrder" class="menu">取消订单</span>
            <span v-if="orderDetail.operateMap.RETREAT" @click="refundDishApply" class="menu">申请退菜</span>
            <span v-if="orderDetail.operateMap.REFUND" @click="refundApply" class="menu">申请退款</span>
            <span v-if="orderDetail.operateMap.CUSTOMERSERVICE" @click="refundService" class="menu">申请售后</span>
        </v-head-com>
        <div class="content">
            <div v-if="orderDetail.takeMealNumber" class="order-header">
                <span>取餐号</span><br />
                <span class="code">{{orderDetail.takeMealNumber}}</span><br />
                <img class="qrcode" :src="orderDetail.verifCodeUrl" />
            </div>
            <ul class="order-info">
                <li>
                    <span>餐厅名称</span>
                    <span class="right txt-lightgray">{{orderDetail.shopName}}</span>
                </li>
                <li>
                    <span>订单编号</span>
                    <span class="right txt-lightgray">{{orderDetail.orderNo}}</span>
                </li>
                <li>
                    <span>点餐方式</span>
                    <span class="right txt-lightgray">{{orderDetail.typeName}}</span>
                </li>
                <li :class="{'rightArrow': orderDetail.refundFlag == 1}" @click="orderDetail.refundFlag == 1 && $router.push('refunddetail')">
                    <span>订单状态</span>
                    <span class="right txt-orange">{{orderDetail.statusString}}</span>
                </li>
                <li>
                    <span>订单时间</span>
                    <span class="right txt-lightgray">{{orderDetail.createDate}}</span>
                </li>
                <li>
                    <span>就餐人数</span>
                    <span class="right txt-lightgray">{{orderDetail.dinersNum}}人</span>
                </li>
                <li>
                    <span>菜品要求</span>
                    <span class="right txt-lightgray">{{orderDetail.remark}}</span>
                </li>
                <li>
                    <span>红包优惠</span>
                    <span class="right txt-orange">¥{{orderDetail.redpackageDiscountMoney + orderDetail.preferentialMoney | currency}}</span>
                </li>
            </ul>
            <v-dish-list v-if="orderDetail.orderItemDetailVOList.length" :res="orderDetail.orderItemDetailVOList" title="已点菜品"></v-dish-list>
            <template v-for="item in orderDetail.orderAddItemLists">
                <v-dish-list v-if="item.orderAddItemList.length" :res="item.orderAddItemList" title="加菜"></v-dish-list>
            </template>
            <template v-for="item in orderDetail.orderReturnDetailItemsVOList">
                <v-dish-list v-if="item.orderReturnDetailItemVOList.length" :res="item.orderReturnDetailItemVOList" title="退菜"></v-dish-list>
            </template>
            <div class="total-money">总计：¥{{orderDetail.needPayMoney | currency}}</div>
        </div>
        <div class="footer" v-if="hasFooter">
            <div class="operate flex">
                <span v-if="orderDetail.operateMap.ADD" class="add-dish" @click="addDish">加菜</span>
                <span v-if="orderDetail.operateMap.PAYMENT" class="flex-auto" @click="pay">支付订单</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { MessageBox } from 'mint-ui';

    export default {
        beforeRouteLeave(from, to, next) {
            this.toastInstance && this.toastInstance.close();
            next();
        },
        data() {
            return {
                orderDetail: {
                    operateMap: {},
                    orderItemDetailVOList: [],//点菜列表
                    orderAddItemList: [],//加菜列表
                    orderReturnDetailItemVOList: [],//退菜列表
                    toastInstance: null
                }
            };
        },
        created() {
            this.reqOrderDetail();
            this.checkRefundDishing().then(() => { }, () => {
                this.toastInstance = this.msg({ message: '正在进行退菜中，请稍后操作', duration: -1 });
            });
        },
        computed: {
            ...mapGetters(['orderId', 'custom']),
            hasFooter() {
                return this.orderDetail.operateMap.ADD || this.orderDetail.operateMap.PAYMENT;
            }
        },
        methods: {
            ...mapActions(['_ajax', '_order', '_shopId', '_custom']),
            //请求数据
            reqOrderDetail() {
                this._ajax({
                    name: 'orderDetail',
                    options: {
                        id: this.orderId
                    }
                }).then(res => {
                    this.orderDetail = res;
                });
            },
            //取消订单
            cancelOrder() {
                MessageBox.confirm('确认取消订单?', '取消订单').then(() => {
                    this._ajax({
                        name: 'cancelOrder',
                        options: {
                            id: this.orderId
                        }
                    }).then(() => {
                        this.$router.go(-1);
                    });
                }, () => { });
            },
            //申请退菜
            refundDishApply() {
                this.checkRefundDishing().then(() => {
                    MessageBox.confirm('您是否需要申请退菜?', '申请退菜').then(() => {
                        this.$router.push('refunddishapply');
                    }, () => { });
                }, () => { });
            },
            //申请退款
            refundApply() {
                this.$router.push('refundapply');
            },
            //申请售后
            refundService() {
                MessageBox.confirm('您是否需要申请售后处理该订单?', '申请售后').then(() => {
                    this.$router.push('refundserviceapply');
                }, () => { });
            },
            //加菜
            addDish() {
                this.checkRefundDishing().then(() => {
                    let order = {
                        orderId: this.orderDetail.id,
                        remark: this.orderDetail.remark,
                        dinersNum: this.orderDetail.dinersNum,
                        scan: { isScan: +this.orderDetail.isScan },
                        addDish: true,//加菜标志
                        notifyItemFlag: this.orderDetail.notifyItemFlag,//是否已经通知上菜
                        isUsedQmsPacket: this.orderDetail.preferentialMoney ? 1 : -1//上次点菜是否使用了全美食优惠-1:未使用，0：未操作,1:使用
                    };

                    this.custom.qmsDiscount = this.orderDetail.preferentialMoney;

                    this._order(order);
                    this._shopId(this.orderDetail.shopId);
                    this._custom(this.custom);
                    this.$router.push('alldishes');
                }, () => { });
            },
            //支付
            pay() {
                this.checkRefundDishing().then(() => {
                    if(this.orderDetail.operateMap.NOTIFYBTN || this.orderDetail.operateMap.NOTIFYSCAN) {
                        MessageBox.confirm('您当前有未通知上菜的菜品，是否放弃上菜进行订单支付?', {
                            'confirmButtonText': '支付',
                            'cancelButtonText': '取消'
                        }).then(() => {
                            this._ajax({
                                name: 'removeUnnotifyDish',
                                options: {
                                    id: this.orderId
                                }
                            }).then(() => {
                                this.$router.push('payment');
                            });
                        }, () => { });
                    } else {
                        this.$router.push('payment');
                    }
                }, () => { });
            },
            //是否退菜处理中
            checkRefundDishing() {
                let promise = new Promise((resolve, reject) => {
                    if(this.orderDetail.operateMap.refunding) {
                        reject();
                    } else {
                        resolve();
                    }
                });

                return promise;
            }
        }
    };
</script>

<style lang="less">
    #orderdetail {
        &.pb {
            padding-bottom: 1rem;
        }
        .footer {
            height: 1rem;
        }

        .menu {
            font-size: 0.26rem;
            position: absolute;
            right: 0.28rem;
        }

        .order-header {
            background: #fff url('../assets/orderdetail/bg_header.png') no-repeat;
            background-size: 100%;
            text-align: center;
            padding-top: 0.45rem;
            padding-bottom: 0.64rem;
            border-bottom: 1px solid #eee;
            background: #fff;
            .code {
                color: #fd5615;
                font-size: 0.4rem;
                font-weight: bold;
                line-height: 2;
            }
            .qrcode {
                width: 3.4rem;
                height: 3.4rem;
                padding: 0.3rem;
                box-shadow: #eee 0px 0px 20px;
                border-radius: 0.06rem;
                margin-top: 0.4rem;
            }
        }
        .order-info {
            background-color: #fff;
            li {
                padding: 0.36rem 0.24rem;
                border-bottom: 1px solid #eee;
                &.rightArrow > span:last-child {
                    padding-right: 0.3rem;
                }
            }
        }
        .dishesList {
            dd {
                border-bottom: none;
            }
        }
        .total-money {
            text-align: right;
            font-size: 0.36rem;
            color: #fd5615;
            padding: 0.32rem 0.28rem;
            background-color: #fff;
        }

        .operate {
            height: 1rem;
            color: #fff;
            font-size: 0.32rem;
            background-color: #fd5615;
            span {
                text-align: center;
                height: 1rem;
                line-height: 1rem;
                &.add-dish {
                    width: 2.46rem;
                    background-color: #fdb814;
                }
            }
        }
    }
</style>