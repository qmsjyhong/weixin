<template>
    <div class="pt">
        <v-head-com>退款成功</v-head-com>
        <div class="content">
            <div class="refund-success"></div>
            <div class="rufund-item pt-40">
                <span class="title">退款金额：</span><span class="price">￥ {{'88.00' | currency}}</span>
            </div>
            <div class="rufund-item">
                <span class="title">退款状态：</span><span>退款成功</span>
            </div>
            <div class="rufund-item">
                <span class="title">退款方式：</span><span>原路退回（已退回微信账户）</span>
            </div>
            <div class="rufund-item pb-40">
                <span class="title">到账时间：</span><span>2017-12-06-18:02:00</span>
            </div>
        </div>
    </div>
</template>
<!-- <script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                refund: {}
            };
        },
        created() {
            this.reqRefundDetail();
        },
        computed: {
            ...mapGetters(['orderId'])
        },
        methods: {
            ...mapActions(['_ajax']),
            //请求数据
            reqRefundDetail() {
                this._ajax({
                    name: 'refund',
                    options: {
                        orderId: this.orderId
                    }
                }).then(res => {
                    if(res.refundDetail) {
                        this.refund = res.refundDetail;
                    }
                });
            }
        }
    };
</script> -->
<style lang="less" scoped>
    .content {
        text-align: center;
    }

    .refund-success {
        height: 1.5rem;
        width: 100%;
        background: url('../assets/refund/img_bj.png') no-repeat;
        background-size: 100% 100%;
        padding-bottom: 0.2rem;
    }
    .rufund-item.pb-40 {
        padding-bottom: 0.4rem;
    }
    .rufund-item.pt-40 {
        padding-top: 0.4rem;
    }
    .rufund-item {
        background: #fff;
        padding: 0.2rem 0.28rem;
        text-align: left;
        font-size: 0.26rem;
        color: #333;
        .price {
            color: #fd5615;
        }
        .title {
            color: #999;
            padding-right: 0.3rem;
        }
    }
</style>
