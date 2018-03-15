<template>
    <div class="pt">
        <v-head-com>我的消息</v-head-com>
        <div class="content">
            <div v-if="userInformation.length" v-infinite-scroll="loadmore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <ul class="message">
                    <li class="box-h" v-for="(item,index) in userInformation">
                        <!--<div class="mess-icon" :class="{'redpoint': item.readFlag}">-->
                        <div class="mess-icon">
                            <img src="../assets/mine/icon_message.png" />
                        </div>
                        <div class="flex1">
                            <p class="ellipsis">{{item.title}}</p>
                            <span class="txt-lightgray">{{item.msgDate}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else class="empty-list">
                <img src="../assets/blank/img_news.png" /><br />
                <span>暂无消息</span>
            </div>
            <p class="loading" v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                加载中...
            </p>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                userInformation: [],
                pageInfo: {},
                loading: false
            };
        },
        created() {
            /* 获取用户信息 */
            this.reqMsg();
        },
        methods: {
            ...mapActions(['_ajax']),
            loadmore() {
                this.loading = true;
                setTimeout(() => {
                    this.reqMsg();
                }, 500);
            },
            reqMsg() {
                this._ajax({
                    name: 'message',
                    options: {
                        currentPage: (this.pageInfo.currentPage || 0) + 1
                    }
                }).then(res => {
                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.userInformation = [];
                    }
                    this.userInformation = this.userInformation.concat(res.findUserInformationPage);

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .message {
        background: #fff;
        li {
            padding: 0.28rem 0.24rem;
            border-bottom: 1px solid #eee;
            .mess-icon {
                height: 1.2rem;
                width: 1.2rem;
                margin-right: 0.2rem;
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
                &.redpoint:after {
                    content: '';
                    width: 0.2rem;
                    height: 0.2rem;
                    background: red;
                    display: block;
                    position: absolute;
                    right: 0.05rem;
                    top: 0.05rem;
                    border-radius: 50%;
                    border: 2px solid #fff;
                }
            }
            p {
                padding-bottom: 0.2rem;
            }
        }
    }
</style>