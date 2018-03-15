<template>
    <div class="v-head-com">
        <div class="h-back" @click="goBack"><img src="../assets/common/icon_back.png" alt="返回" /></div>
        <div class="h-title">
            <slot name="default">账号注册</slot>
        </div>
        <div class="h-extend">
            <slot name="extend"></slot>
            <img src="../assets/common/btn_menu_add.png" @click.stop="fun" />
        </div>
        <div class="h-extend-fun" v-show="show">
            <router-link to="index"><img src="../assets/common/icon_menu_home.png" />首页</router-link>
            <router-link to="mine"><img src="../assets/common/icon_menu_mine.png" />我的</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'headCom',
        data() {
            return {
                show: false
            };
        },
        created() {
            let _this = this;

            document.body.onclick = function() {
                _this.show = false;
            };
        },
        methods: {
            goBack: function() {
                this.$router.go(-1);
            },
            fun: function() {
                this.show = !this.show;
            }
        }
    };
</script>

<style scoped lang="less">
    .v-head-com {
        width: 100%;
        height: 0.9rem;
        clear: both;
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
        .h-extend {
            position: absolute;
            top: 0;
            right: 0;
            height: 0.9rem;
            img {
                display: inline-block;
                height: 0.55rem;
                width: 0.55rem;
                margin: 0.15rem 0.2rem 0.15rem 0.1rem;
            }
        }
        .h-extend-fun {
            position: absolute;
            top: 1rem;
            right: 0.38rem;
            background-color: #333;
            padding: 0 0.4rem;
            z-index: 104;
            a {
                display: block;
                padding: 0.3rem 0;
                border-bottom: 1px solid #999;
                color: #eee;
                font-size: 0.32rem;
                &:last-child {
                    border-bottom: none;
                }
            }
            img {
                display: inline;
                width: 0.36rem;
                padding-right: 0.2rem;
                vertical-align: -0.04rem;
            }
        }
    }
</style>