<template>
    <v-success-page :title="title" :bg="backgroundClass" :content="content" :btns="btnArr" back="orderlist"></v-success-page>
</template>

<script>
    export default {
        beforeRouteLeave(to, from, next) {
            to.meta.type = 8;
            next();
        },
        data() {
            return {
                title: '提交成功',
                backgroundClass: 'refund-apply-success-bg',
                content: ['系统审核通过之后将退回您的金额'],
                btnArr: [
                    {
                        text: '查看退款订单',
                        isactive: true,
                        callback: () => {
                            this.$router.push('orderlist');
                        }
                    }
                ]
            };
        }
    };
</script>

<style scoped lang="less">

</style>