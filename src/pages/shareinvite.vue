<template>
    <div>
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
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { getParams } from '../utils';

    export default {
        data() {
            return {
                info: {},
                share: false, //点击分享按钮
                shareInfo: {}, //分享信息
                session: getParams().s //原始的分享的人的session
            };
        },
        created() {
            this.reqInfo();
        },
        methods: {
            ...mapActions(['_ajax']),
            reqInfo() {
                this._ajax({
                    name: 'invite',
                    options: {
                        session: this.session
                    }
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
    .content {
        background: url('../assets/invite/bg_shareinvite.png') no-repeat;
        background-size: 100%;
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
                font-size: 0.3rem;
                margin-top: 1rem;
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
</style>