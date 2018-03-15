<template>
    <div class="pt">
        <v-head-com :to="back">{{title}}</v-head-com>
        <div class="content">
            <div class="submit-success" :class="bg">
                <div class="success">
                    {{title}}！
                </div>
                <div class="text">
                    <p v-for="text in content">{{text}}</p>
                </div>
            </div>
            <div class="operator-btns">
                <div v-for="btn in buttonArr" :class="btn.isactive ? 'btn active' : 'btn'" @click="clickBtn(btn)">{{btn.text}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            back: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            bg: {
                type: String,
                default: ''
            },
            content: {
                type: Array,
                default: []
            },
            btns: {
                type: Array,
                default: []
            }
        },
        computed: {
            buttonArr() {
                return this.btns ? this.btns : [];
            }
        },
        methods: {
            clickBtn: function(btn) {
                if(btn.callback) {
                    btn.callback();
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .content {
        .submit-success {
            height: 6.8rem;
            width: 100%;
            background-size: 100% 100%;
            position: relative;
            color: #fff7e5;
            .success {
                position: absolute;
                text-align: center;
                font-size: 0.6rem;
                top: 2rem;
                width: 100%;
                font-weight: bold;
            }
            .text {
                width: 100%;
                position: absolute;
                top: 3rem;
                p {
                    font-size: 0.24rem;
                    text-align: center;
                    line-height: 2;
                }
            }
        }
        .operator-btns {
            margin-top: 1.15rem;
            .btn {
                width: 4rem;
                height: 0.9rem;
                margin: 0.5rem auto;
                text-align: center;
                border-radius: 0.45rem;
                color: #fd5615;
                font-size: 0.3rem;
                line-height: 0.9rem;
                border: 1px solid #fd5615;
            }
            .active {
                background-color: #fd5615;
                color: #fff;
            }
        }
    }
</style>