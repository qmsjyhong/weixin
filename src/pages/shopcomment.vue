<template>
    <div class="pt">
        <v-head-com>用户点评</v-head-com>
        <div class="content" :class="{active: shopCommentList.length}">
            <div class="item-padding evaluate-item">
                <span v-for="(item, index) in commentShopSsummaryList" @click="switchItem(item, index)" class="item" :class="{small: item.comment_tag_name.length < 4, active: current == index}">{{item.comment_tag_name}} {{item.comment_tag_sum}}</span>
            </div>
            <ul class="evaluate-list" v-if="shopCommentList.length" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <li v-for="(item, index) in shopCommentList">
                    <div class="box-h">
                        <img v-if="item.pic_url" :src="item.pic_url" class="head-portrait" />
                        <img v-else src="../assets/mine/icon_head.png" class="head-portrait" />
                        <div class="flex1">
                            <span class="fs-12">{{item.nickname || userInfo.userName}}</span>
                            <v-stars :number="item.user_rating" mini="true" class="stars"></v-stars>
                        </div>
                        <span class="txt-lightgray fs-12">{{item.comment_time}}</span>
                    </div>
                    <div class="reviews-wrapper">
                        <p class="fs-12" :class="item.status == 1 ? 'close' : ''">{{item.comment}}</p>
                        <label v-if="item.status != 1 && item.userTag" class="txt-lightgray fs-10"><img src="../assets/shopcomment/icon_label.png" />{{item.userTag.split(',').join('&nbsp;&nbsp;')}}</label>
                        <a href="javascript:void(0)" v-if="item.status == 1" @click="item.status = 2" class="fs-10 txt-lightgray">全文</a>
                        <a href="javascript:void(0)" v-if="item.status == 2" @click="item.status = 1" class="fs-10 txt-lightgray">收起</a>
                    </div>
                </li>
            </ul>
            <div v-else class="empty-list">
                <img src="../assets/blank/img_comment.png" /><br />
                <span>暂无评论</span>
            </div>
            <p v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading" class="loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                加载中...
            </p>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                pageInfo: {}, //分页
                loading: false, //无限滚动开关 ,
                commentShopSsummaryList: [], //评价标签
                current: 0, //当前选中的标签
                shopCommentList: [] //评价列表
            };
        },
        created() {
            this.reqComment();
        },
        computed: {
            ...mapGetters(['shopId', 'userInfo'])
        },
        methods: {
            ...mapActions(['_shopId', '_ajax']),
            //切换标签
            switchItem(item, index) {
                this.current = index;
                this.pageInfo = {};
                if(Number(item.comment_tag_sum)) {
                    this.reqComment();
                } else {
                    this.shopCommentList = [];
                }
            },
            //查询评价详情和标签
            reqComment() {
                this._ajax({
                    name: 'commentDetail',
                    options: {
                        commentTagId: this.commentShopSsummaryList.length && this.commentShopSsummaryList[this.current].comment_tag_id || '',
                        currentPage: (this.pageInfo.currentPage || 0) + 1,
                        pageSize: 10,
                        shopId: this.shopId
                    }
                }).then(res => {
                    if(!this.commentShopSsummaryList.length) {
                        this.commentShopSsummaryList = res.shopComment.commentShopSsummaryList;
                    }

                    let tempList = res.shopComment.ShopCommentList;

                    tempList.forEach(item => {
                        if(item.comment.length > 100) {
                            this.$set(item, 'status', 1);
                        } else {
                            this.$set(item, 'status', 0);
                        }
                    });

                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.shopCommentList = [];
                    }
                    this.shopCommentList = this.shopCommentList.concat(tempList);

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
                    this.reqComment();
                }, 500);
            }
        }
    };
</script>

<style scoped lang="less">
    .content {
        &.active {
            background: #fff;
        }
        .evaluate-item {
            padding: 0.1rem 0.28rem;
            background: #fff;
            .item {
                margin: 0.1rem 0.2rem 0.1rem 0;
                height: 0.4rem;
                width: 1.5rem;
                line-height: 0.4rem;
                display: inline-block;
                border: 1px solid #fdb814;
                border-radius: 0.8rem;
                color: #fdb814;
                font-size: 0.22rem;
                text-align: center;
                background: #fff;
                &.small {
                    width: 1.3rem;
                }
                &.active {
                    background: #fdb814;
                    color: #fff;
                }
            }
        }
        .evaluate-list {
            padding: 0 0.28rem;
            li {
                padding: 0.3rem 0;
                border-bottom: 1px solid #eee;
                .head-portrait {
                    width: 0.94rem;
                    height: 0.94rem;
                    border-radius: 50%;
                    margin-right: 0.2rem;
                }
                .stars {
                    padding-top: 0.1rem;
                }
                .reviews-wrapper {
                    padding-left: 1.14rem;
                    p {
                        line-height: 155%;
                        word-break: break-all;
                        &.close {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 4;
                            overflow: hidden;
                        }
                    }
                    label {
                        margin-top: 0.2rem;
                        display: block;
                    }
                    img {
                        width: 0.25rem;
                        height: 0.25rem;
                        padding-right: 0.2rem;
                    }
                    a {
                        margin-top: 0.2rem;
                        display: block;
                    }
                }
            }
        }
    }
</style>