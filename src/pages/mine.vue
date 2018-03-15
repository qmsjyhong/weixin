<template>
    <div class="pt">
        <v-head-com :hidemine="true" :hideback="true">我的</v-head-com>
        <section class="content">
            <div class="header-wrapper">
                <router-link class="headerPic" to="userinfo">
                    <img v-if="userInfo.userPic" :src="userInfo.userPic" />
                    <img v-else src="../assets/mine/icon_head.png" />
                    <br />
                    <span id="nickName">{{userInfo.userName}}</span>
                </router-link>
                <router-link class="news" to="message" :class="{redpoint: res.informationCount}">
                    <img src="../assets/mine/icon_news.png" />
                    <span class="dot" v-if="res.informationCount"></span>
                </router-link>
            </div>
            <ul class="menulist">
                <router-link class="rightArrow" tag="li" to="orderlist">
                    <div>
                        <img src="../assets/mine/icon_order.png" /> 我的订单
                    </div>
                </router-link>
                <router-link class="rightArrow" :class="{redpoint: res.myRedPacketReadStatus}" tag="li" to="redpackageshop">
                    <div>
                        <img src="../assets/mine/icon_redpacket.png" /> 我的红包
                    </div>
                </router-link>
                <router-link class="rightArrow" tag="li" to="collect">
                    <div>
                        <img src="../assets/mine/icon_collection.png" /> 我的收藏
                    </div>
                </router-link>
                <router-link class="rightArrow" tag="li" to="usercomment">
                    <div>
                        <img src="../assets/mine/icon_comment.png" /> 我的评价
                    </div>
                </router-link>
                <router-link class="rightArrow" tag="li" to="cusservice">
                    <div>
                        <img src="../assets/mine/icon_service.png" /> 联系客服
                    </div>
                </router-link>
                <router-link class="rightArrow" tag="li" to="feedback">
                    <div>
                        <img src="../assets/mine/icon_feedback.png" /> 意见反馈
                    </div>
                </router-link>
                <router-link class="rightArrow" tag="li" to="about">
                    <div>
                        <img src="../assets/mine/icon_aboutus.png" /> 关于全美食
                    </div>
                </router-link>
                <router-link class="invite rightArrow" tag="li" to="invite">
                    <div>
                        <img src="../assets/mine/icon_invite.png" /> 邀请好友
                    </div>
                </router-link>
            </ul>
        </section>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                res: {}
            };
        },
        created() {
            this.getRedDot();
        },
        methods: {
            ...mapActions(['_ajax']),
            getRedDot() {
                this._ajax({
                    name: 'userInfo'
                }).then(res => {
                    this.res = res.findUserMyHome;
                });
            },
            userInfomation() {
                this.$router.push('userinfo');
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        }
    };
</script>

<style scoped lang="less">
    .header-wrapper {
        margin-bottom: 0.2rem;
        height: 4.02rem;
        background: url('../assets/mine/bg_mine.png');
        background-size: 100% 100%;
        position: relative;
        text-align: center;
        .headerPic {
            position: absolute;
            top: 1.2rem;
            color: #fff;
            left: 50%;
            transform: translateX(-50%);
            img {
                width: 0.92rem;
                height: 0.92rem;
                margin-bottom: 0.3rem;
                border-radius: 50%;
            }
        }
        .news {
            position: absolute;
            top: 0.8rem;
            padding: 0.2rem;
            left: 50%;
            margin-left: 0.27rem;
            img {
                width: 0.37rem;
                height: 0.38rem;
            }
            &.redpoint:before {
                content: '';
                width: 0.14rem;
                height: 0.14rem;
                background: red;
                display: block;
                position: absolute;
                right: 0.16rem;
                top: 0.16rem;
                border-radius: 50%;
                border: 1px solid #fff;
            }
        }
    }

    .menulist {
        background: #fff;
        border-top: 1px solid #eee;
        li {
            position: relative;
            border-bottom: 1px solid #eee;
            > div {
                padding: 0.4rem;
                font-size: 0.3rem;
                line-height: 0.48rem;
                img {
                    vertical-align: top;
                    margin-right: 0.12rem;
                    width: 0.48rem;
                }
            }
            &.redpoint:before {
                content: '';
                width: 0.24rem;
                height: 0.24rem;
                background: red;
                display: block;
                position: absolute;
                right: 0.8rem;
                border-radius: 50%;
                top: 50%;
                margin-top: -0.12rem;
            }
            &.invite {
                border-top: 0.2rem solid #f3f3f3;
            }
        }
    }
</style>