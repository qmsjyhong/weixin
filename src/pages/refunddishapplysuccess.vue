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
                backgroundClass: 'refunddish-applysuccess-bg',
                content: ['稍后服务员会和您联系进行退菜'],
                btnArr: [
                    {
                        text: '我知道了',
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