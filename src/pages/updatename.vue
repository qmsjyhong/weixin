<template>
    <div class="pt pb">
        <v-head-com>资料设置</v-head-com>
        <div class="content">
            <div class="user-name">
                <input type="text" maxlength="16" v-model="userName" placeholder="请输入用户名,仅包含字母或汉字" id="username" autocomplete="new-password">
            </div>
        </div>
        <div class="footer">
            <button class="btn-bottom" @click="save(userName)">保存</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                userName: ''
            };
        },
        created() {
            this.userName = this.userInfo.userName;
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            ...mapActions(['_userInfo', '_ajax']),
            save(name) {
                if(!name) {
                    this.msg('用户名不能为空!');
                } else if(!/^([A-Za-z]|[\u4E00-\u9FA5])+$/.test(name)) {
                    this.msg('用户名只能汉字及字母!');
                } else if(name.length >= 16) {
                    this.msg('用户名长度超出限制!');
                } else {
                    this._ajax({
                        name: 'changeName',
                        options: {
                            loginId: this.userInfo.phone,
                            nickName: name
                        }
                    }).then(res => {
                        if(res.nickName.msg) {
                            this.userInfo.userName = name;
                            this._userInfo(this.userInfo);
                            this.msg('修改成功');
                            setTimeout(() => {
                                this.$router.go(-2);
                            }, 500);
                        } else {
                            this.msg(res.nickName.msg);
                        }
                    });
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .user-name {
        border-bottom: 1px solid #ccc;
        background: #fff;
        height: 1rem;
        line-height: 1rem;
        input {
            display: block;
            text-indent: 0.28rem;
            width: 100%;
            font-size: 0.28rem;
            background: none;
            background-image: none;
            border: none;
            height: 100%;
        }
    }
</style>