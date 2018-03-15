<template>
    <div class="ptcustom">
        <v-head-com>在线客服</v-head-com>
        <div class="box-h menu">
            <a v-bind:href="'tel:' + tel">
                <img src="../assets/mine/icon_contact.png"> 客服热线
                <span class="txt-orange">{{tel}}</span>
            </a>
        </div>
        <span class="title">热门问题</span>
        <section class="content">
            <div>
                <ul>
                    <li v-for="(item,index) in list" v-bind:key="index">
                        <div class="question" v-on:click="showAnswer(item)">{{item.question}}</div>
                        <div class="answer" v-if="item.isShow">{{item.answer}}</div>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>
<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                list: [],
                tel: '',
                isShow: false
            };
        },
        created() {
            /* 问题列表 */
            this.getCusMsg();
        },
        methods: {
            ...mapActions(['_ajax']),
            getCusMsg() {
                this._ajax({
                    name: 'cusMsg'
                }).then(res => {

                    res.findQuestionAnswerPage.list.forEach(item => {
                        item.isShow = false;
                    });
                    this.list = res.findQuestionAnswerPage.list;

                    this.tel = res.findQuestionAnswerPage.qms_tel;
                });
            },
            showAnswer(item) {
                if(item.isShow == false) {
                    item.isShow = true;
                } else {
                    item.isShow = false;
                }

            }
        }

    };
</script>
<style scoped>
    .ptcustom {
        padding-top: 3.65rem;
    }

    .menu {
        position: absolute;
        left: 0rem;
        top: 0.9rem;
        width: 100%;
        padding: 0.6rem 0;
        font-size: 0.32rem;
        border-bottom: 1px solid #eee;
        background: #fff;
    }

    .menu > a:first-child {
        border-right: 1px solid #eee;
    }

    .menu > a {
        -webkit-box-flex: 1;
        text-align: center;
    }

    .menu img {
        width: 0.6rem;
        margin-right: 0.4rem;
    }

    .title {
        position: absolute;
        width: 100%;
        left: 0;
        top: 2.8rem;
        background: #f3f3f3;
        padding: 0.25rem;
        border-bottom: 1px solid #eee;
    }

    .content ul {
        position: relative;
        overflow: auto;
        background: #fff;
    }

    ul li {
        border-bottom: 1px solid #eee;
    }

    ul li .question {
        position: relative;
        padding: 0.25rem;
    }

    ul li .question:after {
        content: '';
        position: absolute;
        top: 0.25rem;
        right: 0.2rem;
        width: 0.36rem;
        height: 0.36rem;
        background-image: url(../assets/common/icon_downward.png);
        background-size: cover;
    }

    ul li .answer {
        border-top: 1px solid #eee;
        text-indent: 0.48rem;
        line-height: 0.4rem;
        font-size: 0.24rem;
        padding: 0.2rem 0.3rem;
    }
</style>