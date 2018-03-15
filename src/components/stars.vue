<template>
    <div class="stars" :class="mini ? 'mini' : ''">
        <img v-for="item in new Array(number || 0)" src="../assets/home/icon_stars_active.png" />
        <img v-for="item in new Array(5-(number || 0))" src="../assets/home/icon_stars.png" />
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: ['number', 'mini']
    };
</script>

<style lang="less" scoped>
    .stars {
        font-size: 0;
        img {
            width: 0.28rem;
            margin-right: 0.05rem;
        }
        &.mini {
            img {
                width: 0.25rem;
                vertical-align: top;
            }
        }
    }
</style>