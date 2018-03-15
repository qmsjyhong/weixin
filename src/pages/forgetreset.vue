<template>
    <div class="pt pb">
        <v-head-com :hidemine="true" replace="forget">忘记密码</v-head-com>
        <div class="content">
            <v-pw ref="childPW"></v-pw>
        </div>
        <div class="footer">
            <button class="btn-bottom" @click="reset">重置登录密码</button>
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
                    this.msg(res.register.ok);
                    setTimeout(() => {
                        this.$router.replace('login');
                    }, 500);
                });
            }
        }
    };
</script>