<template>
    <div class="pt pb">
        <v-head-com>意见反馈</v-head-com>
        <section class="content">
            <div class="input-wrapper">
                <textarea v-model="todo" placeholder="感谢你的意见反馈" maxlength="400"></textarea>
            </div>
        </section>
        <div class="footer">
            <div class="btn-bottom" v-on:click="feedbackBtn">确定</div>
        </div>
    </div>
</template>
<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                'todo': ''
            };
        },
        methods: {
            ...mapActions(['_ajax']),
            feedbackBtn() {
                var _this = this;
                var value = this.todo && this.todo.trim() && this.todo.length >= 5;

                if(!value) {
                    this.msg('请输入至少5个字符！');
                    return;
                }

                this._ajax({
                    name: 'feedback',
                    options: {
                        'opinion': this.todo
                    }
                }).then(res => {
                    this.msg(res.success);
                    setTimeout(function() {
                        _this.$router.push('mine');
                    }, 2000);
                });
            }
        }

    };
</script>
<style scoped>
    .input-wrapper {
        padding: 0.28rem;
        background: #fff;
    }

    .input-wrapper textarea {
        background: #eee;
        border-radius: 0.1rem;
        border: 1px solid #eee;
        height: 4rem;
        font-size: 0.32rem;
    }

    textarea {
        width: 100%;
        border: 0;
        resize: none;
        padding: 0.2rem;
    }
</style>