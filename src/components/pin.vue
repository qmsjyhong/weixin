<template>
    <div class="pin">
        <v-warn :verify="warn" :warning="warn"></v-warn>
        <div class="login-box">
            <div class="login-item">
                <div class="login-item-label">
                    <div class="login-icon imgPhone"></div>
                </div>
                <div class="login-item-value">
                    <input type="tel" placeholder="请输入手机号码" v-model="pin.phone" />
                    <div class="addBtn" :class="{disabled: pin.isActive}" @click="!pin.isActive && sendCode()">{{pin.codeBtn}}</div>
                </div>
            </div>
            <div class="login-item">
                <div class="login-item-label">
                    <div class="login-icon imgLock"></div>
                </div>
                <div class="login-item-value">
                    <input type="text" placeholder="请输入您接收到的验证码" v-model="pin.code" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { checkPhone, trim } from '../utils';
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                warn: false,
                pin: {
                    phone: '', //验证码登录-手机号
                    code: '', //验证码登录-验证码
                    codeBtn: '获取验证码', //获取验证码按钮文本
                    isActive: false //是否正在获取中
                }
            };
        },
        methods: {
            ...mapActions(['_loginInfo', '_ajax']),
            check(isCheckAll) {
                if(!this.pin.phone) {
                    this.warn = '请输入手机号';
                    return false;
                }

                if(!checkPhone(trim(this.pin.phone))) {
                    this.warn = '手机号码不正确';
                    return false;
                }

                if(isCheckAll) {
                    if(!this.pin.code) {
                        this.warn = '请输入验证码';
                        return false;
                    }
                }

                return this.pin;
            },
            sendCode: function() {
                if(this.check()) {
                    this._ajax({
                        name: 'sendAuthCode',
                        options: {
                            'phoneNum': trim(this.pin.phone),
                            'type': 'register'
                        }
                    }).then(() => {
                        if(!this.pin.isActive) {
                            this.pin.isActive = true;
                            this.warn = false;
                            this.pin.codeBtn = 59;
                            let i = 0;
                            let t = setInterval(() => {
                                i++;
                                this.pin.codeBtn = 59 - i;
                                if(i == 59) {
                                    this.pin.codeBtn = '重新获取';
                                    this.pin.isActive = false;
                                    clearInterval(t);
                                }
                            }, 1000);
                        }
                    });
                }
            },
            next(cb) {
                if(this.check(true)) {
                    this._loginInfo({
                        phone: this.pin.phone,
                        authCode: this.pin.code
                    });
                    cb();
                }
            }
        }
    };
</script>