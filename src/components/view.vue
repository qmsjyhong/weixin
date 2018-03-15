<template>
    <div style="width: 100%;height: 100%" :class="{'container-wrapper': custom.download && !isHiddenPage}">
        <div class="box-h downloadApp" v-if="custom.download && !isHiddenPage">
            <div class="close-btn" @click="close"></div>
            <div class="logo">
                <img src="../assets/common/icon_logo.png" />
            </div>
            <div class="flex1">
                <span class="fs-13">全美食</span><br />
                <span class="fs-10">吃饭就用全美食</span>
            </div>
            <a href="javascript:void(0)" class="download-btn" @click="download">打开</a>
        </div>
        <transition :name="transitionName">
            <router-view class="container"></router-view>
        </transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'view',
        data() {
            return {
                transitionName: 'slide-left',
                pagesWithoutDL: ['invite', 'shareinvite', 'shoptypeselect', 'alldishes'], //此列表里的页面不加download
                isHiddenPage: false
            };
        },
        created() {
            this.isHiddenPage = this.pagesWithoutDL.indexOf(this.$route.name) != -1;
        },
        watch: {
            '$route'(to, from) {
                const toDepth = to.matched[1].path.split('/').length;
                const fromDepth = from.matched.length && from.matched[1].path.split('/').length || 0;

                this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
                this.isHiddenPage = this.pagesWithoutDL.indexOf(to.name) != -1;
            }
        },
        computed: {
            ...mapGetters(['custom', 'appto'])
        },
        methods: {
            ...mapActions(['_custom', '_install']),
            //下载app
            download() {
                this.close();
                //下载安装
                this._install();
            },
            close() {
                this.custom.download = false;
                this._custom(this.custom);
            }
        }
    };
</script>

<style lang="less" scoped>
    .slide-left-enter,
    .slide-right-leave-active {
        -webkit-transform: translate(100%, 0);
    }

    .slide-left-leave-active,
    .slide-right-enter {
        -webkit-transform: translate(-100%, 0);
    }

    .downloadApp {
        height: 10%;
        width: 100%;
        background: #26252a;
        color: #fff;
        .logo {
            width: 1rem;
            height: 1rem;
            margin: 0 0.3rem;
        }
        .download-btn {
            color: #fff;
            background: #ee8506;
            padding: 0.14rem 0.24rem;
            border-radius: 0.1rem;
            margin-right: 0.3rem;
        }
        .close-btn {
            width: 0.42rem;
            height: 0.42rem;
            border-radius: 0.1rem;
            background: url(../assets/common/icon_close.png) no-repeat center center;
            background-size: 64%;
            padding: 0.2rem 0.3rem 0.3rem 0.3rem;
            margin-left: 0.28rem;
            box-sizing: initial;
            padding: 0.2rem;
        }
    }

    .container-wrapper {
        .container {
            height: 90%;
        }
    }
</style>