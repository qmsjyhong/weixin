<template>
    <div class="pt">
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { MessageBox } from 'mint-ui';

    export default {
        created() {
            this.isPaySuccess();
        },
        computed: {
            ...mapGetters(['orderId'])
        },
        methods: {
            ...mapActions(['_ajax']),
            isPaySuccess() {
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
                    }).then(res => {
                        //1=已支付
                        if(res.code == 1) {
                            this.$router.replace('paysuccess');
                        } else {
                            this.msg('订单未支付成功');
                            setTimeout(() => {
                                this.$router.replace('payment');
                            }, 500);
                        }
                    });
                }, () => {
                    this.$router.replace('payment');
                });
            }
        }
    };
</script>

<style scoped>

</style>