<template>
    <div class="pt">
        <v-head-com :hidemine="true" replace="login">账号注册</v-head-com>
        <section class="content">
            <v-warn :verify="warn" :warning="warn"></v-warn>
            <div class="login-box">
                <div class="login-item">
                    <div class="login-item-label">
                        <div class="login-icon imgPhone"></div>
                    </div>
                    <div class="login-item-value">
                        <input type="tel" placeholder="请输入手机号码" id="ts-0010" v-model="register.phone" />
                        <div class="addBtn" id="ts-0011" :class="{disabled: register.isActive}" @click="!register.isActive && sendCode()">{{register.codeBtn}}</div>
                    </div>
                </div>
                <div class="login-item">
                    <div class="login-item-label">
                        <div class="login-icon imgLock"></div>
                    </div>
                    <div class="login-item-value">
                        <input type="text" id="ts-0012" placeholder="请输入您接收到的验证码" v-model="register.code" />
                    </div>
                </div>
                <div class="login-item">
                    <div class="login-item-label">
                        <div class="login-icon imgPaw"></div>
                    </div>
                    <div class="login-item-value">
                        <input type="password" id="ts-0013" maxlength="16" placeholder="请设置账户密码(6-16个字符)" autocomplete="new-password" v-model='register.newPaw'>
                    </div>
                </div>
                <div class="login-item">
                    <div class="login-item-label">
                        <div class="login-icon imgPaw"></div>
                    </div>
                    <div class="login-item-value">
                        <input type="password" id="ts-0014" maxlength="16" placeholder="请输入确认密码" autocomplete="new-password" v-model="register.confirmPaw">
                    </div>
                </div>
            </div>
            <div class="agreement">
                <i :class="{active: active}" @click="active = !active"></i> 我已经阅读并同意
                <a :href="origin + '/w/agreement/agreement.html'">《全美食用户协议》</a>
            </div>
            <input class="inputBtn" type="button" id="ts-0015" value="完成" v-on:click="complete" />
        </section>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { checkPhone, checkPassword, trim } from '../utils';

    export default {
        data() {
            return {
                warn: false, //验证提示文本
                active: true, //选择协议
                register: {
                    phone: '', //验证码登录-手机号
                    code: '', //验证码登录-验证码
                    codeBtn: '获取验证码', //获取验证码按钮文本
                    isActive: false, //是否正在获取中
                    newPaw: '', //密码
                    confirmPaw: '' //确认密码
                },
                origin: window.location.origin
            };
        },
        methods: {
            ...mapActions(['_ajax']),
            complete() {
                if(!this.register.phone) {
                    this.warn = '请输入手机号';
                    return false;
                }
                if(!checkPhone(trim(this.register.phone))) {
                    this.warn = '手机号码不正确';
                    return false;
                }
                if(!this.register.code) {
                    this.warn = '请输入验证码';
                    return false;
                }
                if(!checkPassword(this.register.newPaw)) {
                    this.warn = '密码长度必须在6-16位之间';
                    return false;
                }
                if(this.register.newPaw !== this.register.confirmPaw) {
                    this.warn = '两次密码输入不一致';
                    this.test = true;
                    return false;
                }
                if(!this.active) {
                    this.warn = '请选择协议!';
                    return false;
                }
                this.warn = false;
                this._ajax({
                    name: this.browser().isWeixin ? 'registerWX' : 'register',
                    options: {
                        'loginId': trim(this.register.phone),
                        'authCode': this.register.code,
                        'loginPwd': this.register.newPaw,
                        'type': 'register',
                        'scanQR': 0
                    }
                }).then(res => {
                    if(res.register.session) {
                        this.msg('注册成功');
                        this.$router.replace('login');
                    }
                });
            },
            sendCode() {
                if(!this.register.phone) {
                    this.warn = '请输入手机号';
                    return false;
                }
                if(!checkPhone(trim(this.register.phone))) {
                    this.warn = '手机号码不正确';
                    return false;
                }
                this._ajax({
                    name: 'sendAuthCode',
                    options: {
                        'phoneNum': trim(this.register.phone),
                        'type': 'register'
                    }
                }).then(() => {
                    if(!this.register.isActive) {
                        this.register.isActive = true;
                        this.warn = false;
                        this.register.codeBtn = 59;
                        let i = 0;
                        let t = setInterval(() => {
                            i++;
                            this.register.codeBtn = 59 - i;
                            if(i == 59) {
                                this.register.codeBtn = '重新获取';
                                this.register.isActive = false;
                                clearInterval(t);
                            }
                        }, 1000);
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .agreement {
        box-sizing: border-box;
        padding-left: 30px;
        margin-bottom: 34px;
        i {
            display: inline-block;
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 10px;
            background: url('../assets/common/icon_check.png') no-repeat center center;
            background-size: cover;
            &.active {
                background: url('../assets/common/icon_checked.png') no-repeat center center;
                background-size: cover;
            }
        }
        a {
            color: #fe5615;
        }
    }
</style>