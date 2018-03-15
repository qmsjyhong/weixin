<template>
    <div class="warn" v-if="verify">
        <i class="fa fa-exclamation-circle"></i>
        <span>{{warning}}</span>
    </div>
</template>

<script>
    export default {
        props: ['verify', 'warning']
    };
</script>

<style lang="less" scoped>
    .warn {
        height: 40px;
        background: #fef2f2;
        border-bottom: 1px solid rgba(254, 86, 21, 0.5);
        line-height: 40px;
        text-align: center;
        i {
            color: #fb6c34;
            font-size: 0.36rem;
        }
    }
</style>