<template>
    <div class="pt pb">
        <v-head-com>资料设置</v-head-com>
        <div class="content">
            <v-pin ref="childPin"></v-pin>
        </div>
        <div class="footer">
            <button class="btn-bottom" @click="next">下一步</button>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            next() {
                this.$refs.childPin.next(() => {
                    this.$router.push('updatepawreset');
                });
            }
        }
    };
</script>