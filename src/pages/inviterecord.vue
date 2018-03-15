<template>
    <div class="pt">
        <v-head-com :hidehome="true" :hidemine="true">邀请记录</v-head-com>
        <div class="content">
            <div class="head">
                <div class="banner">
                    <div class="person">
                        <span>{{pageInfo.totalCount}}</span>
                        <span>人</span>
                    </div>
                    <span class="fs-12">我邀请的好友</span>
                </div>
                <div class="title">邀请明细</div>
            </div>
            <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <li v-for="item in list" class="item flex">
                    <div class="item-pic">
                        <img v-if="item.picUrl" :src="item.picUrl + (item.picUrl.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_fixed,h_92,w_92'" />
                        <img v-else src="../assets/mine/icon_head.png" />
                    </div>
                    <div class="item-detail flex-auto">
                        <div class="line1 relative">
                            <span class="txt-gray">{{item.nickname}}</span>
                            <span class="right">{{item.installTime.split(' ')[0]}}</span>
                        </div>
                        <div class="line2 relative">
                            <span>{{item.loginId.substr(0, 11)}}</span>
                            <span class="right">{{item.installTime.split(' ')[1]}}</span>
                        </div>
                    </div>
                </li>
            </ul>
            <p v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading" class="loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                <span>加载中...</span>
            </p>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { formatDate } from '../utils';

    export default {
        data() {
            return {
                pageInfo: {}, //分页
                loading: false, //加载中...
                list: [] //邀请列表
            };
        },
        created() {
            this.reqList();
        },
        methods: {
            ...mapActions(['_ajax']),
            //限时抢购列表
            reqList() {
                this._ajax({
                    name: 'inviteList',
                    options: {
                        currentPage: (this.pageInfo.currentPage || 0) + 1,
                        pageSize: 10
                    }
                }).then(res => {
                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.list = [];
                    }
                    this.list = this.list.concat(res.inviteRecord);
                    this.list.forEach(item => {
                        item.installTime = formatDate(item.installTime, 'yyyy/MM/dd hh:mm:ss').replace(/\//g, '-');
                    });

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }
                });
            },
            //分页
            loadMore() {
                this.loading = true;
                setTimeout(() => {
                    this.reqList();
                }, 500);
            }
        }
    };
</script>

<style lang="less" scoped>
    .content {
        background: #fff;
        overflow: hidden;
    }

    .head {
        text-align: center;
        position: absolute;
        width: 100%;
        z-index: 1;
        background: #fff;
        height: 5.31rem;
        .banner {
            background: url('../assets/invite/bg_record.png') no-repeat;
            background-size: 100% 100%;
            height: 3.57rem;
            color: #fff;
            .person {
                padding-top: 1rem;
                padding-bottom: 0.63rem;
                span {
                    font-size: 0.72rem;
                    &:last-child {
                        font-size: 0.34rem;
                    }
                }
            }
        }
        .title {
            color: #ccc;
            font-size: 0.3rem;
            padding-top: 0.7rem;
            padding-bottom: 0.7rem;
            position: relative;
            display: inline-block;
            &:before {
                content: '';
                width: 1.56rem;
                height: 1px;
                background: #f5f5f5;
                display: block;
                position: absolute;
                right: 100%;
                margin-right: 0.2rem;
                top: 50%;
            }
            &:after {
                content: '';
                width: 1.56rem;
                height: 1px;
                background: #f5f5f5;
                display: block;
                position: absolute;
                top: 50%;
                left: 100%;
                margin-left: 0.2rem;
            }
        }
    }

    .list {
        padding: 0 0.55rem;
        padding-top: 5.31rem;
        color: #aaa;
        font-size: 0.24rem;
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .item {
            position: relative;
            padding: 0.28rem 0;
            &-pic {
                width: 0.92rem;
                height: 0.92rem;
                border-radius: 50%;
                margin-right: 0.49rem;
                img {
                    height: 100%;
                    border-radius: 50%;
                }
            }
            &-detail {
                position: relative;
                .line1 {
                    margin-bottom: 0.2rem;
                }
            }
        }
    }
</style>