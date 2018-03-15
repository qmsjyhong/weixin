<template>
    <div class="pt">
        <v-head-com>申请售后</v-head-com>
        <div class="content fs-15">
            <div class="tab clearfix">
                <span :class="{active: index == tIndex}" v-for="(item, index) in tabs" @click="tIndex = index" :disabled="item.isActive">
                    <i>{{item}}</i>
                </span>
            </div>
            <div v-if="tIndex == 1">
                <v-dish-list :res="res.itemList" :edit="true" title="已点菜品" :refund="true"></v-dish-list>
            </div>
            <div class="money" v-if="!tIndex">退款金额<span class="txt-orange">¥{{res.returnMoney | currency}}</span></div>
            <div class="reason">
                <p>退款理由</p>
                <textarea placeholder="请输入详细的退款描述，以便商家为您提供更好的服务" v-model="reason"></textarea>
            </div>
        </div>
        <div class="footer">
            <button class="btn-bottom" :class="{disabled: !isSubmit}" @click="isSubmit && preSubmit()">提交</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { MessageBox } from 'mint-ui';
    import { formatPrice } from '../utils';

    export default {
        data() {
            return {
                res: {
                    itemList: []
                },
                reason: '', //退款理由
                tIndex: 0, //默认全额退款
                tabs: ['全额退款', '部分退款']
            };
        },
        created() {
            this.reqRefundDetail();
        },
        computed: {
            ...mapGetters(['orderId']),
            //退菜列表
            refundDishes() {
                return this.res.itemList.filter(item => item.refundQuantity).map(item => {
                    return {
                        itemId: item.itemId,
                        quantity: item.refundQuantity
                    };
                });
            },
            //退菜总数量
            refundCount() {
                let count = 0;

                this.refundDishes.forEach(item => {
                    count += item.quantity;
                });
                return count;
            },
            //是否可以提交
            isSubmit() {
                return !this.tIndex || this.refundCount;
            }
        },
        methods: {
            ...mapActions(['_ajax']),
            //查询菜品
            reqRefundDetail() {
                this._ajax({
                    name: 'reqRefund',
                    options: {
                        id: this.orderId,
                        refundType: 3 //1c申请退菜，2c申请退款，3c部分售后，4c整单售后，5b申请退菜，6b申请退单
                    }
                }).then(res => {
                    this.res = res;

                    res.itemList.forEach(item => {
                        this.$set(item, 'refundQuantity', 0);
                    });
                });
            },
            //退款查询退款金额
            preSubmit() {
                if(this.tIndex) {
                    this._ajax({
                        name: 'calcRefund',
                        options: {
                            id: this.orderId,
                            refundType: 3,
                            refundItems: this.refundDishes
                        }
                    }).then(res => {
                        MessageBox.confirm('退款金额为¥' + formatPrice(res.returnMoney), {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消'
                        }).then(() => {
                            this.submit(3, this.refundDishes, res.returnMoney);
                        }, () => { });
                    });
                } else {
                    this.submit(4, [], this.res.returnMoney);
                }
            },
            //提交退款
            submit(type, dish, money) {
                this._ajax({
                    name: 'applyRefund',
                    options: {
                        id: this.orderId,
                        refundType: type,
                        refundReason: this.reason,
                        refundItems: dish,
                        returnMoney: money
                    }
                }).then(() => {
                    MessageBox.alert('商家会在24小时内给予您反馈<br />请耐心等待', '', {
                        confirmButtonText: '查看订单'
                    }).then(() => {
                        this.$router.push('orderdetail');
                    });
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .tab {
        font-size: 0.3rem;
        width: 100%;
        border-bottom: 1px solid #eee;
        background: #fff;
        top: 0.9rem;
        span {
            color: #999;
            display: block;
            text-align: center;
            width: 50%;
            position: relative;
            box-sizing: border-box;
            white-space: nowrap;
            float: left;
        }
        > * {
            padding: 0.3rem;
        }
        .active {
            color: #fd5615;
            &:after {
                content: '';
                position: absolute;
                width: 100%;
                height: 2px;
                bottom: -1px;
                background: #fd5615;
                left: 0;
            }
        }
    }

    .money {
        background-color: #fff;
        height: 1.2rem;
        line-height: 1.2rem;
        padding: 0 0.28rem;
        border-bottom: 1px solid #eee;
        span {
            padding-left: 0.3rem;
        }
    }

    .reason {
        background-color: #fff;
        padding: 0 0.28rem;
        p {
            padding: 0.2rem 0;
        }
        textarea {
            height: 2.8rem;
            font-size: 0.24rem;
        }
    }

    .disabled {
        background: #ccc;
    }
</style>