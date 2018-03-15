<template>
    <div class="pt pb">
        <v-head-com :hidemine="true" :hidehome="true">
            <span>邀请好友</span>
            <router-link to="inviterecord" class="list-btn">邀请记录</router-link>
        </v-head-com>
        <div class="content">
            <div class="detail">
                <div class="qrcode">
                    <div class="qrcode-wrap">
                        <img :src="info.qrCodeUrl" />
                    </div>
                    <span class="qrcode-label">扫描二维码下载全美食App</span>
                </div>
                <div class="account flex">
                    <div>
                        <img v-if="info.picUrl" :src="info.picUrl" />
                        <img v-else src="../assets/mine/icon_head.png" />
                    </div>
                    <div>
                        <div class="account-name">我是 {{info.nickName}}</div>
                        <div>邀请您体验全美食</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="title">分享到</div>
            <div class="flex">
                <button @click="share = true">
                    <img src="../assets/invite/icon_share_wechat.png" />
                    <div class="label">微信</div>
                </button>
                <button @click="share = true">
                    <img src="../assets/invite/icon_share_friends.png" />
                    <div class="label">朋友圈</div>
                </button>
            </div>
        </div>

        <div class="mask" v-if="share" @click="share = false"></div>
        <div class="guide" v-if="share" @click="share = false">
            <img src="../assets/buying/img_share.png" />
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                info: {},
                share: false, //点击分享按钮
                shareInfo: {} //分享信息
            };
        },
        created() {
            this.reqInfo();
        },
        methods: {
            ...mapActions(['_ajax']),
            reqInfo() {
                this._ajax({
                    name: 'invite'
                }).then(res => {
                    this.info = res.inviteInfo;
                    this.shareInfo = res.inviteInfo.shareInfo;
                    this.browser().isWeixin && this.wxshare();
                });
            },
            //微信分享
            wxshare() {
                window.wx.showOptionMenu();
                // 分享给朋友
                window.wx.onMenuShareAppMessage({
                    'imgUrl': this.shareInfo.imagePath,
                    'link': this.shareInfo.url,
                    'title': this.shareInfo.title,
                    'desc': this.shareInfo.text
                });
                // 分享到朋友圈
                window.wx.onMenuShareTimeline({
                    'imgUrl': this.shareInfo.imagePath,
                    'link': this.shareInfo.url,
                    'title': this.shareInfo.title + ',' + this.shareInfo.text
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .pb {
        padding-bottom: 2.15rem;
    }

    .list-btn {
        position: absolute;
        right: 0.28rem;
        font-size: 0.26rem;
        color: #666;
    }

    .content {
        background: url('../assets/invite/bg_invite.png') no-repeat;
        background-size: 100% 100%;
        .detail {
            position: absolute;
            width: 100%;
            top: 40%;
            .qrcode {
                text-align: center;
                &-wrap {
                    width: 2.02rem;
                    height: 2.02rem;
                    border-radius: 0.1rem;
                    padding: 0.2rem;
                    background-color: #fff;
                    margin: 0 auto;
                    margin-bottom: 0.2rem;
                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
                &-label {
                    color: #fff;
                    font-size: 0.24rem;
                }
            }
            .account {
                justify-content: center;
                color: #fff;
                margin-top: 1rem;
                font-size: 0.3rem;
                img {
                    width: 0.92rem;
                    height: 0.92rem;
                    border-radius: 50%;
                    margin-right: 0.42rem;
                }
                &-name {
                    margin-bottom: 0.2rem;
                }
            }
        }
    }

    .footer {
        height: 2.15rem;
        background-color: #fff;
        padding: 0.25rem 0;
        .title {
            font-size: 0.24rem;
            color: #aaa;
            text-align: center;
        }
        .flex {
            justify-content: center;
            button {
                width: 1.39rem;
                height: 1.39rem;
                background-color: #fff;
                position: relative;
                margin: 0 0.2rem;
                .label {
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    bottom: 0;
                    font-size: 0.22rem;
                    color: #aaa;
                }
            }
        }
    }

    .guide {
        position: fixed;
        top: 0;
        z-index: 101;
        top: 0.6rem;
        left: 0;
        width: 100%;
    }
</style>