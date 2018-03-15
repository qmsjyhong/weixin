<template>
    <div class="v-head-com">
        <div class="h-back" @click="goBack" v-if="!hideback"><img src="../assets/common/icon_back.png" alt="返回" /></div>
        <div class="h-title">
            <slot>用户登录</slot>
        </div>
        <div class="h-fun">
            <router-link to='index' v-if="!hidehome"><img src="../assets/common/btn_menu_home.png" /></router-link>
            <router-link to='mine' v-if="!hidemine"><img src="../assets/common/btn_menu_mine.png" /></router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'headCom',
        props: ['to', 'hidemine', 'hideback', 'replace', 'hidehome'],
        methods: {
            goBack: function() {
                if(this.replace) {
                    this.$router.replace(this.replace);
                } else if(this.to) {
                    this.$router.push(this.to);
                } else {
                    this.$router.go(-1);
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .v-head-com {
        width: 100%;
        height: 0.9rem;
        clear: both;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        .h-back {
            position: absolute;
            top: 0;
            left: 0;
            width: 0.9rem;
            height: 0.9rem;
            img {
                width: 0.45rem;
                margin: 0.25rem;
            }
        }
        .h-title {
            width: 100%;
            height: 0.9rem;
            font-size: 0.36rem;
            color: #000;
            line-height: 0.9rem;
            text-align: center;
        }
        .h-fun {
            position: absolute;
            top: 0;
            right: 0;
            height: 0.9rem;
            a {
                display: inline-block;
            }
            img {
                display: inline-block;
                height: 0.55rem;
                width: 0.55rem;
                margin: 0.15rem 0.2rem 0.15rem 0.1rem;
            }
        }
    }
</style>