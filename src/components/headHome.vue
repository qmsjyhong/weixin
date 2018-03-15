<template>
    <div class="v-head-home">
        <div class="h-city" @click="goCity">
            <slot>未知</slot>
        </div>
        <div class="h-soc">
            <router-link to='shopsearch'><img src="../assets/common/icon_search.png" />餐厅名称、地点、菜名</router-link>
        </div>
        <div class="h-fun">
            <router-link to='mine'><img src="../assets/common/btn_menu_mine.png" /></router-link>
        </div>
        <div class="h-fun" :class="isRedPointShow ? 'redpoint' : ''">
            <router-link to='redpool'><img src="../assets/common/btn_menu_redpackage.png" /></router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'headHome',
        props: ['isRedPointShow'],
        methods: {
            goCity: function() {
                this.$router.push('city');
            }
        }
    };
</script>

<style scoped lang="less">
    .v-head-home {
        width: 100%;
        height: 0.9rem;
        z-index: 102;
        clear: both;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 0;
        .h-city {
            width: 1.7rem;
            height: 0.9rem;
            line-height: 0.9rem;
            font-size: 0.28rem;
            text-align: center;
            padding-right: 0.2rem;
            float: left;
            position: relative;
            &:after {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                margin: auto;
                right: 0.12rem;
                width: 0.28rem;
                height: 0.28rem;
                background-image: url(../assets/common/icon_downward.png);
                background-size: cover;
                vertical-align: middle;
                margin-left: 0.1rem;
            }
        }
        .h-soc {
            width: 3.6rem;
            border-radius: 0.5rem;
            background-color: #f2f2f2;
            font-size: 0.24rem;
            margin: 0.2rem;
            padding: 0 0.2rem;
            color: #a7a7a7;
            line-height: 0.5rem;
            float: left;
            img {
                display: inline-block;
                width: 0.24rem;
                margin-right: 0.1rem;
            }
            a {
                color: #888;
            }
        }
        .h-fun {
            width: 0.7rem;
            height: 0.9rem;
            padding: 0.17rem 0.05rem;
            float: right;
            a {
                display: block;
            }
            img {
                display: block;
                height: 0.54rem;
                width: auto;
            }
        }
    }

    .redpoint:after {
        content: '';
        width: 0.24rem;
        height: 0.24rem;
        background: red;
        display: block;
        position: absolute;
        right: 0.14rem;
        border-radius: 50%;
        top: 0.08rem;
    }
</style>