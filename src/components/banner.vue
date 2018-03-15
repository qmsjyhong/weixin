<template>
    <div class="v-banner">
        <mt-swipe :auto="4000">
            <mt-swipe-item v-for="(item, index) in banner">
                <img :src="item.picUrl" @click="activity(item, index)" />
            </mt-swipe-item>
        </mt-swipe>
        <slot></slot>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        props: {
            banner: [Array],
            large: [Boolean]
        },
        methods: {
            ...mapActions(['_shopId']),
            activity(item, index) {
                if(item.targetType == 2) {
                    this._shopId(item.target);
                    this.$router.push('shophome');
                } else if(item.targetType == 1) {
                    window.location.href = item.target;
                } else {
                    this.large && this.$parent.openLargeView(index);
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .v-banner {
        height: 4.02rem;
        position: relative;
        overflow: hidden;
        img {
            width: 100%;
            min-height: 100%;
            display: block;
        }
    }
</style>