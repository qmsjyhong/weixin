<template>
    <section class="user">
        <div class="pt">
            <v-head-com>资料设置</v-head-com>
            <section class="content">
                <ul class="baseInfo" v-if="contentFlag">
                    <li class="box-h relative">
                        <div class="item1">头像</div>
                        <img class="item2" v-if="userInfo.userPic" :src="userInfo.userPic" />
                        <img class="item2" v-else src="../assets/mine/icon_head.png" />
                    </li>
                    <li class="box-h rightArrow relative" data-ref="updUsername" v-on:click.stop="updateUserName">
                        <div class="item1">用户名</div>
                        <div class="item2 ellipsis" id="uName">{{userInfo.userName}}</div>
                    </li>
                    <li class="box-h relative">
                        <div class="item1">手机号</div>
                        <div class="item2" id="uTel">{{userInfo.phone}}</div>
                    </li>
                    <li class="box-h rightArrow relative" v-on:click="updatePaw">
                        <div class="item1">修改密码</div>
                    </li>
                </ul>
            </section>
        </div>

    </section>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                updateFlag: false,
                contentFlag: true,
                pawFlag: false
            };
        },
        methods: {
            updateUserName() {
                this.$router.push('updatename');
            },

            updatePaw() {
                this.$router.push('updatepaw');
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        }
    };
</script>

<style lang="less" scoped>
    .baseInfo {
        background: #fff;
        li {
            height: 1.4rem;
            display: -webkit-box;
            -webkit-box-orient: horizontal;
            -webkit-box-align: center;
            border-bottom: 1px solid #eee;
        }
        .item1 {
            width: 50%;
            padding-left: 0.2rem;
        }
        .item2 {
            width: 0.8rem;
            height: 0.8rem;
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            right: 0.5rem;
            padding: 0;
            border-radius: 50%;
            line-height: 0.8rem;
        }
        #uTel {
            right: 1.2rem;
        }
        #uName {
            width: 1.5rem;
            text-align: right;
            padding-right: 0.1rem;
        }
    }
</style>