<template>
    <div class="pt">
        <v-head-com :hidemine="true">用户登录</v-head-com>
        <div class="content">
            <mt-navbar class="login-tab" v-model="selected">
                <mt-tab-item id="identify">手机验证登录</mt-tab-item>
                <mt-tab-item id="account">账号密码登录</mt-tab-item>
            </mt-navbar>
            <v-warn :verify="warn" :warning="warn"></v-warn>
            <mt-tab-container class="login-box" v-model="selected" swipeable>
                <mt-tab-container-item id="identify">
                    <div class="login-item">
                        <div class="login-item-label">
                            <div class="login-icon imgPhone"></div>
                        </div>
                        <div class="login-item-value">
                            <input id="ts-0001" type="tel" placeholder="请输入手机号码" v-model="identify.phone" />
                            <div id="ts-0002" class="addBtn" :class="{disabled: identify.isActive}" @click="!identify.isActive && sendCode()">{{identify.codeBtn}}</div>
                        </div>
                    </div>
                    <div class="login-item">
                        <div class="login-item-label">
                            <div class="login-icon imgLock"></div>
                        </div>
                        <div class="login-item-value">
                            <input id="ts-0003" type="text" placeholder="请输入您接收到的验证码" v-model="identify.code" />
                        </div>
                    </div>
                    <input id="ts-0004" class="inputBtn" type="button" @click="identifyLogin" value="登录" />
                </mt-tab-container-item>
                <mt-tab-container-item id="account">
                    <div class="login-item">
                        <div class="login-item-label">
                            <div class="login-icon imgPhone"></div>
                        </div>
                        <div class="login-item-value">
                            <input id="ts-0005" type="tel" placeholder="请输入手机号码" v-model="account.phone" />
                        </div>
                    </div>
                    <div class="login-item">
                        <div class="login-item-label">
                            <div class="login-icon imgPaw"></div>
                        </div>
                        <div class="login-item-value">
                            <input id="ts-0006" type="password" maxlength="16" placeholder="请输入密码" v-model="account.password" />
                        </div>
                    </div>
                    <input id="ts-0007" class="inputBtn" type="button" @click="accontLogin" value="登录" />
                </mt-tab-container-item>
            </mt-tab-container>

            <div class="login-fun">
                <router-link id="ts-0008" to="register" class="txt-orange" tag="span" replace>立即注册</router-link>
                <router-link id="ts-0009" to="forget" class="right" tag="span" replace>找回密码</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { checkPhone, trim } from '../utils';

    export default {
        data() {
            return {
                selected: 'identify',
                warn: false, //验证提示文本
                account: {
                    phone: '', //账号登录-手机号
                    password: '' //账号登录-密码
                },
                identify: {
                    phone: '', //验证码登录-手机号
                    code: '', //验证码登录-验证码
                    codeBtn: '获取验证码', //获取验证码按钮文本
                    isActive: false //是否正在获取中
                }
            };
        },
        computed: {
            ...mapGetters(['userInfo', 'custom', 'orderId', 'session'])
        },
        methods: {
            ...mapActions(['_userInfo', '_custom', '_ajax']),
            sendCode: function() {
                if(!this.identify.phone) {
                    this.warn = '请输入手机号';
                    return false;
                }
                if(!checkPhone(trim(this.identify.phone))) {
                    this.warn = '手机号码不正确';
                    return false;
                }
                this.warn = false;
                this._ajax({
                    name: 'sendAuthCode',
                    options: {
                        'phoneNum': trim(this.identify.phone),
                        'type': 'register'
                    }
                }).then(() => {
                    if(!this.identify.isActive) {
                        this.identify.isActive = true;
                        this.warn = false;
                        this.identify.codeBtn = 59;
                        let i = 0;
                        let t = setInterval(() => {
                            i++;
                            this.identify.codeBtn = 59 - i;
                            if(i == 59) {
                                this.identify.codeBtn = '重新获取';
                                this.identify.isActive = false;
                                clearInterval(t);
                            }
                        }, 1000);
                    }
                });
            },
            identifyLogin() {
                if(!this.identify.phone) {
                    this.warn = '请输入手机号';
                    return false;
                }
                if(!checkPhone(trim(this.identify.phone))) {
                    this.warn = '手机号码不正确';
                    return false;
                }
                if(!this.identify.code) {
                    this.warn = '请输入验证码';
                    return false;
                }
                this.warn = false;
                this._ajax({
                    name: this.browser().isWeixin ? 'phoneLogWX' : 'phoneLog',
                    options: {
                        loginId: trim(this.identify.phone),
                        authCode: this.identify.code,
                        type: 'register',
                        orderId: this.orderId || ''
                    }
                }).then(res => {
                    this.browser().isWeixin ? this.reqUserInfo(res.userNameLogin) : this.reqUserInfo(res);
                });
            },

            accontLogin() {
                if(!this.account.phone) {
                    this.warn = '请输入手机号';
                    return false;
                }
                if(!checkPhone(trim(this.account.phone))) {
                    this.warn = '手机号码不正确';
                    return false;
                }
                if(!this.account.password) {
                    this.warn = '请输入密码';
                    return false;
                }
                this.warn = false;
                this._ajax({
                    name: this.browser().isWeixin ? 'accountLogWX' : 'accountLog',
                    options: {
                        loginId: trim(this.account.phone),
                        loginPwd: this.account.password,
                        orderId: this.orderId || ''
                    }
                }).then(res => {
                    this.reqUserInfo(res.userNameLogin);
                });
            },
            reqUserInfo(msg) {
                msg.phoneNumber && (this.userInfo.phone = msg.phoneNumber);
                msg.session && (this.userInfo.session = msg.session);
                msg.id && (this.userInfo.userId = msg.id);
                msg.userName && (this.userInfo.userName = msg.userName);
                msg.picUrl && (this.userInfo.userPic = msg.picUrl);
                this.userInfo.registerId = msg.registerId || '';
                this._userInfo(this.userInfo);
                setTimeout(() => {
                    this.$router.go(-1);
                }, 300);
            }
        }
    };
</script>

<style lang="less" scoped>
    .inputBtn {
        margin-top: 0.6rem;
    }

    .login-fun {
        padding: 0 0.28rem;
    }
</style>