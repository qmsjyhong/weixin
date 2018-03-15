<template>
    <v-success-page :title="title" :bg="backgroundClass" :content="content" :btns="btnArr" back="orderlist"></v-success-page>
</template>

<script>
    export default {
        beforeRouteLeave(to, from, next) {
            to.meta.type = 2;
            next();
        },
        data() {
            return {
                title: '提交成功',
                backgroundClass: 'cooking-success-bg',
                content: ['欢迎您使用全美食就餐，请在订单页面点击', '通知上菜，美食就开始为您制作啦！'],
                btnArr: [
                    {
                        text: '查看我的订单',
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