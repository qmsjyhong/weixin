<template>
    <div class="pt pb">
        <v-head-com>申请退菜</v-head-com>
        <div class="content">
            <v-dish-list :res="res.itemList" :edit="true" title="已点菜品" :refund="true"></v-dish-list>
            <v-refund-reason :list="res.refundReason" :index.sync="reasonIndex" :title="reasonTitle"></v-refund-reason>
            <div class="reason" v-if="reasonIndex == res.refundReason.length - 1">
                <input class="flex-auto" placeholder="请输入退菜原因" v-model="reason"></textarea>
            </div>
        </div>
        <div class="footer">
            <button class="btn-bottom" :class="{disabled: !isSubmit}" @click="isSubmit && submit()">提交</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                res: {
                    refundReason: [],
                    itemList: []
                },
                reason: '', //退款理由
                reasonIndex: 0,
                reasonTitle: '退菜原因 <span class="txt-orange">(必选)</span>'
            };
        },
        created() {
            this.getReasonList();
        },
        computed: {
            ...mapGetters(['orderId']),
            refundDishes() {
                return this.res.itemList.filter(item => {
                    return item.refundQuantity;
                });
            },
            isSubmit() {
                return this.refundDishes.length;
            }
        },
        methods: {
            ...mapActions(['_ajax']),
            getReasonList() {
                this._ajax({
                    name: 'reqRefund',
                    options: {
                        id: this.orderId,
                        refundType: 1 //1c申请退菜，2c申请退款，3c部分售后，4c整单售后，5b申请退菜，6b申请退单
                    }
                }).then(res => {
                    this.res = res;

                    res.itemList.forEach(item => {
                        this.$set(item, 'refundQuantity', 0);
                    });
                });
            },
            //提交退款
            submit() {
                let refundItems = []; //退菜列表

                this.res.itemList.forEach(item => {
                    if(item.refundQuantity) {
                        refundItems.push({
                            itemId: item.itemId,
                            quantity: item.refundQuantity
                        });
                    }
                });

                this._ajax({
                    name: 'applyRefund',
                    options: {
                        id: this.orderId,
                        refundType: 1,
                        refundReason: (this.reasonIndex === this.res.refundReason.length - 1) ? this.reason : this.res.refundReason[this.reasonIndex],
                        refundItems: refundItems
                    }
                }).then(() => {
                    this.$router.push('refunddishapplysuccess');
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .reason {
        background-color: #fff;
        padding: 0.34rem 0.28rem;
        font-size: 0.24rem;
        input {
            font-size: 0.24rem;
        }
    }

    .disabled {
        background: #ccc;
    }
</style>