<template>
    <div class="pt pb">
        <v-head-com v-if="isedit">提交订单</v-head-com>
        <div class="content">
            <v-dish-list v-if="dishes && dishes.length" :res="dishes"></v-dish-list>
            <ul class="tableware" v-if="selectedIndex >= 0">
                <li v-for="item in tableware" class="clearfix">
                    <span class="name">{{item.name}}</span>
                    <span class="txt-lightgray">x{{selectedIndex + 1}}份</span>
                    <span class="right">￥{{item.price | currency}}</span>
                </li>
            </ul>
            <div class="person-count" @click="isShowMask = true">
                <span class="title">就餐人数</span>
                <span class="count" v-if="selectedIndex == -1">请选择就餐人数</span>
                <span class="count" v-else>{{selectedIndex + 1}}人<span v-if="selectedIndex == 9">及以上</span></span>
                <img src="../assets/common/icon_right_arrow.png" />
            </div>
            <div class="dish-demand">
                <div class="title">菜品要求</div>
                <textarea :readonly="!isedit" v-model="remark" type="text" maxlength="15" rows="1" placeholder="请输入您的要求"></textarea>
            </div>
            <div class="message" v-if="order.notifyItemFlag">
                <img v-if="isChecked" @click="isChecked = !isChecked" src="../assets/common/icon_checked.png" />
                <img v-if="!isChecked" @click="isChecked = !isChecked" src="../assets/common/icon_check.png" />
                <span class="text">提交后直接通知服务员上菜</span>
            </div>
        </div>
        <div class="footer">
            <div class="btn-bottom" @click="payOrder()">
                提交订单￥<span>{{dishesMoney - (custom.qmsDiscount || 0) | currency}}</span>
            </div>
        </div>

        <div class="person-list" v-if="isShowMask">
            <div class="person-header">
                选择就餐人数
                <img src="../assets/common/btn_close.png" @click="isShowMask = false" />
            </div>
            <div class="person-items">
                <div class="person-item" v-for="(number, index) in new Array(10)" @click="selectCount(index)">
                    <span :class="{'selected':selectedIndex == index}">{{index + 1}}人<span v-if="index == 9">及以上</span></span>
                </div>
            </div>
        </div>

        <div class="mask" v-if="isShowMask" @click="isShowMask = false"></div>
        <v-qms-packet ref="qmsPacket" :discount="dishesDiscount"></v-qms-packet>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { calculatePrice } from '../utils';
    import { reqOrder } from '../utils/order';
    import { MessageBox } from 'mint-ui';
    import $ from 'jquery';

    export default {
        data() {
            return {
                orderDetail: {
                    bookInfo: {},
                    itemList: [],
                    orderInfo: {},
                    tableList: []
                },
                isShowMask: false,
                remark: '', //菜品要求
                selectedIndex: -1,
                dishesMoney: 0, //菜品总金额,
                isChecked: true,
                isedit: true,
                isDelete: false,
                shareInfo: {},
                tableware: [{
                    name: '餐具',
                    price: 2
                }, {
                    name: '毛巾',
                    price: 2
                }]
            };
        },
        created() {
            this.$nextTick(() => {
                if(this.order.isUsedQmsPacket === 1) {
                    this.$refs.qmsPacket.useQmsPacket();
                }

                if(this.order.isUsedQmsPacket === -1) {
                    this.$refs.qmsPacket.unuseQmsPacket();
                }
            });

            this.remark = this.order.remark || '';
            if(this.order.dinersNum) {
                this.selectedIndex = this.order.dinersNum - 1;
            }
            this.calculatePrice();

            setTimeout(() => {
                $('.date-time-popup').insertAfter('.footer');
            }, 1000);
        },
        computed: {
            ...mapGetters(['order', 'orderId', 'custom', 'session']),
            dishesDiscount() {
                let price = 0;

                this.dishes.forEach(item => {
                    price += item.price * item.quantity;
                });
                return calculatePrice(this.dishesMoney - price);
            },
            dishes() {
                return this.order.dishes || [];
            }
        },
        methods: {
            ...mapActions(['_order', '_custom', '_ajax']),
            calculatePrice() {
                this.dishes.forEach(item => {
                    this.dishesMoney += item.originalPrice * item.quantity;
                });
            },
            //存储order
            storeOrder() {
                this.order.remark = this.remark;
                this.order.dinersNum = this.selectedIndex + 1;
                this.order.preferentialMoney = this.custom.qmsDiscount;
                this.order.needPayMoney = calculatePrice(this.dishesMoney - this.custom.qmsDiscount || 0);
                this._order(this.order);
            },
            //选择人数
            selectCount(index) {
                this.selectedIndex = index;
                this.isShowMask = false;
            },
            //支付订单
            payOrder() {
                if(!this.session) {
                    this.$router.push('login');
                    return false;
                }

                if(this.selectedIndex < 0) {
                    MessageBox.alert('请选择就餐人数').then(() => {
                        this.isShowMask = true;
                    });
                } else {
                    this.loading.open();
                    this.storeOrder();
                    reqOrder(() => {
                        setTimeout(() => {
                            this.loading.close();
                        }, 500);
                        //存入支付成功的状态
                        this.custom.isCommitOrder = true;
                        this._custom(this.custom);

                        if(this.order.scan.isScan) {
                            this.$router.push('cookingsuccess');
                        } else {
                            this.$router.push('payment');
                        }
                    }, { autoNotify: Number(this.order.notifyItemFlag && this.isChecked) });
                }
            },
            wxshare() {
                window.wx.showOptionMenu();
                // 分享给朋友
                window.wx.onMenuShareAppMessage({
                    imgUrl: this.shareInfo.imagePath,
                    link: this.shareInfo.url,
                    title: this.shareInfo.title,
                    desc: this.shareInfo.text
                });
                // 分享到朋友圈
                window.wx.onMenuShareTimeline({
                    imgUrl: this.shareInfo.imagePath,
                    link: this.shareInfo.url,
                    title: this.shareInfo.title + ',' + this.shareInfo.text
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .content {
        background-color: #f4f4f4;
    }

    .tableware {
        background: #fff;
        border-bottom: 1px solid #eee;
        font-size: 0.26rem;
        li {
            padding: 0.28rem;
            .name {
                width: 1.1rem;
                padding-right: 0.2rem;
                display: inline-block;
            }
        }
    }

    .person-count {
        position: relative;
        background-color: #fff;
        font-size: 0.28rem;
        height: 1.05rem;
        > span {
            display: block;
            position: absolute;
        }
        .title {
            left: 0.28rem;
            top: 0.4rem;
        }
        .count {
            right: 0.75rem;
            top: 0.4rem;
        }
        img {
            position: absolute;
            right: 0.28rem;
            top: 0.38rem;
            width: 0.16rem;
            height: 0.32rem;
        }
    }

    .dish-demand {
        padding: 0 0.28rem;
        margin: 0.15rem 0;
        background-color: #fff;
        .title {
            padding-top: 0.3rem;
            font-size: 0.28rem;
            color: #333;
        }
        textarea {
            width: 100%;
            margin: 0.28rem 0;
            line-height: 2;
            font-size: 0.24rem;
        }
    }

    .message {
        height: 0.28rem;
        width: 100%;
        text-align: center;
        margin: 1rem 0 0.43rem 0;
        img {
            width: 0.28rem;
            height: 0.28rem;
            padding-right: 0.14rem;
        }
        .text {
            height: 0.28rem;
            font-size: 0.22rem;
            margin: 0.03rem 0;
            color: #999;
        }
    }

    .person-list {
        background-color: #fff;
        z-index: 101;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        .person-header {
            padding: 0.28rem 0;
            position: relative;
            text-align: center;
            font-size: 0.24rem;
            color: #999;
            border-bottom: 1px solid #eee;
            img {
                width: 0.25rem;
                height: 0.25rem;
                position: absolute;
                right: 0;
                top: 0;
                padding: 0.28rem;
            }
        }
        .person-items {
            overflow-y: auto;
            max-height: 5.8rem;
            .person-item {
                font-size: 0.2rem;
                padding: 0.3rem 0;
                text-align: center;
                color: #333;
                border-bottom: 1px solid #f4f4f4;
            }
        }
    }
    .selected {
        color: #fd5615;
    }
</style>