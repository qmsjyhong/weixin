<template>
    <div class="pt">
        <v-head-com :hidemine="true" replace="login">忘记密码</v-head-com>
        <div class="content">
            <v-pin ref="childPin"></v-pin>
            <input class="inputBtn" type="button" @click="next" value="下一步" />
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            next() {
                this.$refs.childPin.next(() => {
                    this.$router.replace('forgetreset');
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .login-box {
        margin-top: 0;
        border-top: 0;
    }
</style>