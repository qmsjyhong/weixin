<template>
    <div class="pt orderList">
        <v-head-com to='mine'>订单</v-head-com>
        <div class="tab">
            <span :class="{active: item.type == type}" v-for="(item, index) in orderTab" @click="changeTab(index)" :disabled="item.type == type">
                <i>{{item.title}}</i>
                <i class="fa-circle fa mark" v-if="item.isRead"></i>
            </span>
        </div>
        <div class="content">
            <div class="list" v-if="orderList.length" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <ul>
                    <li class="orderContent" v-for="(item, index) in orderList">
                        <div class="shop-name ellipsis">{{item.shopName}}</div>
                        <div class="flex title rightArrow relative" @click.prevent.stop="enterOrder(item)">
                            <img class="logo" :src="item.orderIcon" />
                            <ul class="detail flex-auto">
                                <li class="fs-13">优惠价：¥{{item.needPayMoney | currency}}</li>
                                <li class="old-price fs-13 txt-lightgray txt-through">原价：¥{{item.orderTotalMoney | currency}}</li>
                                <li class="datetime txt-lightgray">{{item.createDate}}</li>
                            </ul>
                        </div>
                        <div v-for="sub in item.subOrderList" class="notes add-order">
                            <img src="../assets/orderlist/icon_add_dish.png" />
                            <span class="fs-13">优惠价：¥{{sub.needPayMoney | currency}}</span>
                            <span class="old-price fs-13 txt-lightgray txt-through">原价：¥{{sub.orderTotalMoney | currency}}</span>
                        </div>
                        <div class="order-number">
                            <span>订单编号：{{item.orderNo}}</span>
                            <span class="total-money">
                                <span>合计：¥</span><span class="fs-15">{{item.needPayMoney | currency}}</span>
                            </span>
                        </div>
                        <div v-if="item.operateMap.NOTIFYSCAN" class="notes">
                            <img src="../assets/orderlist/icon_inform_notes.png" />
                            <span class="txt-orange">进入详情查看取餐号或扫描桌台二维码验证</span>
                        </div>
                        <div v-if="item.operateMap.PAYMENT || item.operateMap.NOTIFYBTN || item.operateMap.NOTIFYSCAN || item.operateMap.REPAYMENT || item.operateMap.COMMENT || item.operateMap.REFUNDITEMPROCESS" class="operator clearfix">
                            <button v-if="item.operateMap.PAYMENT" class="btn orange" @click="payOrder(item)">支付订单</button>
                            <button v-if="item.operateMap.REPAYMENT" class="btn orange" @click="payOrder(item)">重新支付</button>
                            <button v-if="item.operateMap.NOTIFYBTN" class="btn" @click="notifyDish(item)">通知上菜</button>
                            <button v-if="item.operateMap.NOTIFYSCAN" class="btn orange" @click="notifyDishByScan(item)">扫桌台码通知上菜</button>
                            <button v-if="item.operateMap.COMMENT" class="btn orange" @click="openCommentPanel(item, index)">评价</button>
                            <template v-if="item.operateMap.REFUNDITEMPROCESS">
                                <img src="../assets/orderlist/icon_time.png" />
                                <span class="txt-orange">当前订单申请退菜中,等待处理</span>
                                <button class="btn disabled">重新支付</button>
                            </template>
                        </div>
                        <div v-if="item.operateMap.SYSPROCESS" class="notes refund clearfix">
                            <img src="../assets/orderlist/icon_remind.png" />
                            <span v-if="item.status == 2" class="txt-orange">系统正在进行审核</span>
                            <span v-if="item.status == 1" class="txt-orange">系统已完成退款</span>
                            <button v-if="item.operateMap.DELETE" class="btn" @click="delOrder(item, index)">删除订单</button>
                        </div>
                    </li>
                </ul>
                <p class="loading" v-if="pageInfo.current < pageInfo.pages" v-show="loading">
                    <mt-spinner type="fading-circle"></mt-spinner>加载中...
                </p>
            </div>
            <div v-else class="empty-list">
                <img src="../assets/blank/img_order.png" /><br />
                <span>暂无订单</span>
            </div>
        </div>
        <div v-if="isCommentPanel" class="mask" @click="isCommentPanel = false"></div>
        <v-comment v-if="isCommentPanel" :orderId="orderId" :shopName="shopName" @cb="commentDone"></v-comment>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { MessageBox } from 'mint-ui';
    import { getParams, dirPath } from '../utils';

    export default {
        data() {
            return {
                orderTab: [{
                    title: '待支付',
                    isRead: false,
                    type: 2
                }, {
                    title: '待消费',
                    isRead: false,
                    type: 4
                }, {
                    title: '已消费',
                    isRead: false,
                    type: 6
                }, {
                    title: '售后/退款',
                    isRead: false,
                    type: 8
                }],
                type: 2,
                orderList: [], //订单列表
                pageInfo: {}, //分页
                loading: false, //下拉 ,
                isCommentPanel: false, //是否显示评价面板
                orderId: '', //供评价用的订单id
                shopName: '', //供评价用的店铺名称
                orderIndex: 0, //供评论回调用的序号
                itemOutletList: [] //通知上菜类型
            };
        },
        created() {
            if(this.$route.meta.type != null) {
                this.type = this.$route.meta.type;
            }
            this.reqOrderList();
            this.getRedPoint();
        },
        computed: {
            ...mapGetters(['custom'])
        },
        methods: {
            ...mapActions(['_orderId', '_custom', '_ajax']),
            //请求订单数据
            reqOrderList() {
                this._ajax({
                    name: 'orderList',
                    options: {
                        'current': (this.pageInfo.current || 0) + 1,
                        'type': this.type
                    }
                }).then(res => {
                    this.pageInfo = res.page;
                    if(this.pageInfo.current == 1) {
                        this.orderList = [];
                    }
                    this.orderList = this.orderList.concat(res.rows);

                    if(this.pageInfo.current < this.pageInfo.pages) {
                        this.loading = false;
                    } else if(this.pageInfo.current != 1) {
                        this.msg('没有更多数据了');
                    }
                });
            },
            //下拉请求数据
            loadMore() {
                this.loading = true;
                setTimeout(() => {
                    this.reqOrderList();
                }, 500);
            },
            //未读红点
            getRedPoint() {
                this._ajax({
                    name: 'getRedPoint'
                }).then(res => {
                    this.orderTab[0].isRead = res.unpaidCount;
                    this.orderTab[1].isRead = res.unconsumedCount;
                    this.orderTab[2].isRead = res.consumedCount;
                    this.orderTab[3].isRead = res.refundCount;
                });
            },
            // 进入订单详情
            enterOrder(item) {
                this._orderId(item.id);
                this.$router.push('orderdetail');
            },
            //切换tab
            changeTab(index) {
                if(this.type != (index + 1) * 2) {
                    this.$route.meta.type = (index + 1) * 2;
                    this.type = (index + 1) * 2;
                    this.orderList = [];
                    this.pageInfo = {};
                    this.reqOrderList();
                }
            },
            //打开评价面板
            openCommentPanel(item, index) {
                this.orderId = item.id;
                this.shopName = item.shopName;
                this.orderIndex = index;
                this.isCommentPanel = true;
            },
            //已评论
            commentDone() {
                this.isCommentPanel = false;
                this.orderList[this.orderIndex].operateMap.COMMENT = 0;
            },
            //通知上菜
            notifyDish(item) {
                MessageBox.confirm('通知服务员上菜?', '通知上菜', {
                    confirmButtonText: '上菜',
                    cancelButtonText: '暂不'
                }).then(() => {
                    this._ajax({
                        name: 'notifyByBtn',
                        options: {
                            id: item.id
                        }
                    }).then(() => {
                        this.msg('已通知服务员');
                        item.operateMap.NOTIFYBTN = 0;
                    });
                }, () => { });
            },
            //扫码通知上菜
            notifyDishByScan(item) {
                MessageBox.confirm('通知服务员上菜?', '通知上菜', {
                    confirmButtonText: '上菜',
                    cancelButtonText: '暂不'
                }).then(() => {
                    window.wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                        success: res => {
                            let params = getParams(res.resultStr);

                            if(dirPath() + '/scan/index.html' != res.resultStr.split('?')[0]) {
                                this.msg('请扫描全美食二维码!');
                            } else {
                                this._ajax({
                                    name: 'notifyByScan',
                                    options: {
                                        id: item.id,
                                        scanId: params.qrCodeId,
                                        scanType: params.type
                                    }
                                }).then(res2 => {
                                    this.msg(res2.msg);
                                    this.changeTab(2);
                                    item.operateMap.NOTIFYSCAN = 0;
                                });
                            }
                        }
                    });
                }, () => { });
            },
            //支付订单
            payOrder(item) {
                if(item.operateMap.NOTIFYBTN || item.operateMap.NOTIFYSCAN) {
                    MessageBox.confirm('您当前有未通知上菜的菜品，是否放弃上菜进行订单支付?', {
                        'confirmButtonText': '支付',
                        'cancelButtonText': '取消'
                    }).then(() => {
                        this._ajax({
                            name: 'removeUnnotifyDish',
                            options: {
                                id: item.id
                            }
                        }).then(() => {
                            this._orderId(item.id);
                            this.$router.push('payment');
                        });
                    }, () => { });
                } else {
                    this._orderId(item.id);
                    this.$router.push('payment');
                }
            },
            //删除订单
            delOrder(item, index) {
                MessageBox.confirm('您是否删除该订单', {
                    'confirmButtonText': '取消',
                    'cancelButtonText': '确定'
                }).then(() => {
                    this._ajax({
                        name: 'deleteOrder',
                        options: {
                            orderId: item.id
                        }
                    }).then(res => {
                        if(res.info) {
                            this.msg('删除成功');
                            this.orderList.splice(index, 1);
                            this.getRedPoint();
                        }
                    });
                }, () => { });
            }
        }
    };
</script>

<style lang="less" scoped>
    .orderList {
        height: 100%;
        overflow: hidden;
        padding-top: 1.8rem;
        background: #f4f4f4;
    }

    .tab {
        position: absolute;
        z-index: 1;
        font-size: 0.26rem;
        width: 100%;
        border-bottom: 1px solid #eee;
        background: #fff;
        top: 0.9rem;
        span {
            color: #999;
            display: block;
            text-align: center;
            width: 25%;
            position: relative;
            box-sizing: border-box;
            white-space: nowrap;
            float: left;
        }
        .mark {
            font-size: 0.2rem;
            position: absolute;
            right: 0.2rem;
            top: 0.2rem;
            color: #fd5615;
        }
        > * {
            padding: 0.3rem;
        }
        .active {
            color: #fd5615;
            &:after {
                content: '';
                position: absolute;
                width: 60%;
                height: 2px;
                bottom: -1px;
                background: #fd5615;
                left: 20%;
            }
        }
    }

    .orderContent {
        margin-top: 0.2rem;
        background: #fff;
        font-size: 0.24rem;
        &:first-child {
            margin-top: 0;
        }
        .shop-name {
            padding: 0.22rem 0.28rem;
        }
        .title {
            padding: 0.2rem 0.28rem;
            overflow: hidden;
            background-color: #fafafa;
            align-items: stretch;
            &.redpoint:before {
                content: '';
                width: 0.24rem;
                height: 0.24rem;
                background: red;
                display: block;
                position: absolute;
                right: 0.7rem;
                border-radius: 50%;
                top: 50%;
                transform: translateY(-50%);
            }
            .logo {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 0.08rem;
            }
            .detail {
                margin-left: 0.28rem;
                position: relative;
                .old-price {
                    padding-top: 0.23rem;
                }
                .datetime {
                    position: absolute;
                    bottom: 0;
                }
            }
        }
        .order-number {
            padding: 0.29rem 0.28rem;
            color: #999;
            .total-money {
                color: #fd5615;
                float: right;
            }
        }
        .notes {
            padding: 0.2rem 0.28rem;
            background-color: #fafafa;
            &.add-order {
                margin-top: 0.1rem;
                span:last-child {
                    padding-left: 0.4rem;
                }
            }
            &.refund {
                background-color: #fff;
                padding: 0.32rem 0.28rem;
                line-height: 0.5rem;
                border-top: 1px solid #f4f4f4;
                .btn {
                    padding: 0 0.32rem;
                    border-radius: 0.3rem;
                    float: right;
                    margin-left: 0.35rem;
                    background-color: #fff;
                    color: #666;
                    border: 1px solid #ccc;
                    min-width: 1.6rem;
                    height: 0.5rem;
                    &.orange {
                        background-color: #fd5615;
                        color: #fff;
                        border: 1px solid #fd5615;
                    }
                }
            }
            img {
                width: 0.42rem;
                height: 0.42rem;
                padding-right: 0.19rem;
            }
            span {
                vertical-align: middle;
            }
        }

        .operator {
            padding: 0.3rem 0.28rem;
            border-top: 1px solid #f4f4f4;
            line-height: 0.5rem;
            img {
                width: 0.42rem;
                height: 0.42rem;
                padding-right: 0.19rem;
            }
            .btn {
                padding: 0 0.32rem;
                border-radius: 0.3rem;
                float: right;
                margin-left: 0.35rem;
                background-color: #fff;
                color: #666;
                border: 1px solid #ccc;
                min-width: 1.6rem;
                height: 0.5rem;
                &.orange {
                    background-color: #fd5615;
                    color: #fff;
                    border: 1px solid #fd5615;
                }
                &.disabled {
                    background-color: #ccc;
                    color: #fff;
                    border: 1px solid #ccc;
                }
            }
        }
    }
</style>