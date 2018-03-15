<template>
    <div class="pt pb">
        <v-head-com>申请退款</v-head-com>
        <div class="content">
            <ul>
                <li class="title">退款金额</li>
                <li class="txt-orange">¥{{res.returnMoney | currency}}</li>
                <li class="title">退款方式</li>
                <li>{{res.refundWay}}</li>
            </ul>
            <v-refund-reason :list="res.refundReason" :index.sync="reasonIndex" :title="reasonTitle"></v-refund-reason>
        </div>
        <div class="footer">
            <button class="btn-bottom" @click="submit">提交申请</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                res: {
                    refundReason: []
                },
                reasonIndex: 0,
                reasonTitle: '退菜原因<span class="txt-orange">(必选)</span>'
            };
        },
        created() {
            this.getReasonList();
        },
        computed: {
            ...mapGetters(['orderId'])
        },
        methods: {
            ...mapActions(['_ajax']),
            getReasonList() {
                this._ajax({
                    name: 'reqRefund',
                    options: {
                        id: this.orderId,
                        refundType: 2 //1c申请退菜，2c申请退款，3c部分售后，4c整单售后，5b申请退菜，6b申请退单
                    }
                }).then(res => {
                    this.res = res;
                });
            },
            submit() {
                this._ajax({
                    name: 'applyRefund',
                    options: {
                        id: this.orderId,
                        refundReason: this.res.refundReason[this.reasonIndex],
                        refundType: 2,
                        returnMoney: this.res.returnMoney
                    }
                }).then(() => {
                    this.$router.push('refundapplysuccess');
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    li {
        padding: 0.28rem;
        background-color: #fff;
        font-size: 0.24rem;
        &.title {
            background-color: #fafafa;
            padding: 0.22rem 0.28rem;
            color: #999;
        }
    }
</style>