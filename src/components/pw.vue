<template>
    <div class="pw">
        <v-warn :verify="warn" :warning="warn"></v-warn>
        <div class="login-box">
            <div class="login-item">
                <div class="login-item-label">
                    <div class="login-icon imgPaw"></div>
                </div>
                <div class="login-item-value">
                    <input type="password" maxlength="16" placeholder="请设置账户密码(6-16个字符)" autocomplete="new-password" v-model='pw.newPaw'>
                </div>
            </div>
            <div class="login-item">
                <div class="login-item-label">
                    <div class="login-icon imgPaw"></div>
                </div>
                <div class="login-item-value">
                    <input type="password" maxlength="16" placeholder="请输入确认密码" autocomplete="new-password" v-model="pw.confirmPaw">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { trim } from '../utils';
    import { mapGetters, mapActions } from 'vuex';


    export default {
        data() {
            return {
                warn: false,
                pw: {
                    phone: '', //验证码登录-手机号
                    code: '', //验证码登录-验证码
                    codeBtn: '获取验证码', //获取验证码按钮文本
                    isActive: false //是否正在获取中
                }
            };
        },
        computed: {
            ...mapGetters(['loginInfo'])
        },
        methods: {
            ...mapActions(['_ajax']),
            reset(cb) {
                if(!this.pw.newPaw) {
                    this.warn = '请输入新密码';
                    return false;
                }

                if(this.pw.newPaw.length > 18 || this.pw.newPaw.length < 6) {
                    this.warn = '密码长度必须在6-18位之间!';
                    return false;
                }

                if(!this.pw.confirmPaw) {
                    this.warn = '请再次输入密码!';
                    return false;
                }

                if(this.pw.confirmPaw !== this.pw.newPaw) {
                    this.warn = '两次密码不一致!';
                    return false;
                }

                this.warn = false;

                this._ajax({
                    name: 'updatePwd',
                    options: {
                        'loginId': trim(this.loginInfo.phone),
                        'authCode': this.loginInfo.authCode,
                        'loginPwd': this.pw.newPaw,
                        'type': 'register'
                    }
                }).then(res => {
                    if(res.register.ok) {
                        cb(res);
                    } else {
                        this.msg('修改失败,请重新输入');
                    }
                });
            }
        }
    };
</script>