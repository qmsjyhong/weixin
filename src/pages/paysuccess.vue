<template>
    <v-success-page :title="title" :bg="backgroundClass" :content="content" :btns="btnArr" back="orderlist"></v-success-page>
</template>

<script>
    export default {
        beforeRouteLeave(to, from, next) {
            if(to.name == 'orderlist') {
                to.meta.type = 4;
            }
            next();
        },
        data() {
            return {
                title: '支付成功',
                backgroundClass: 'paysuccess-bg',
                content: ['欢迎您使用全美食就餐，您的满意是我们', '最大的成就！祝您用餐愉快。'],
                btnArr: []
            };
        },
        created() {
            this.btnArr = [
                {
                    text: '查看我的订单',
                    isactive: true,
                    callback: () => {
                        this.viewOrder();
                    }
                },
                {
                    text: '继续选择喜欢的菜品',
                    isactive: false,
                    callback: () => {
                        this.selectDishes();
                    }
                }
            ];
        },
        methods: {
            viewOrder() {
                this.$router.push('orderlist');
            },
            selectDishes() {
                this.$router.push('shophome');
            }
        }
    };
</script>

<style scoped lang="less">

</style>