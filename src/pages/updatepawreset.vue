<template>
    <div class="pt pb">
        <v-head-com>资料设置</v-head-com>
        <div class="content">
            <v-pw ref="childPW"></v-pw>
        </div>
        <div class="footer">
            <button class="btn-bottom" @click="reset">重置登录密码</button>
        </div>
    </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            ...mapActions(['_userInfo']),
            reset() {
                this.$refs.childPW.reset(res => {
                    this.userInfo.session = res.register.session;
                    this._userInfo(this.userInfo);
                    this.msg(res.register.ok);
                    setTimeout(() => {
                        this.$router.go(-2);
                    }, 500);
                });
            }
        }
    };
</script>