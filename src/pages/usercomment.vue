<template>
    <div class="pt">
        <v-head-com>我的评价</v-head-com>
        <div class="content">
            <div class="header-wrapper">
                <div class="headerPic">
                    <img v-if="userInfo.userPic" :src="userInfo.userPic" />
                    <img v-else src="../assets/mine/icon_head.png" />
                    <br />
                    <span id="nickName">{{userInfo.userName}}</span>
                </div>
            </div>
            <div v-if="list.length" class="total">共{{pageInfo.totalCount || 0}}条评价</div>
            <ul v-if="list.length" class="list" v-infinite-scroll="loadmore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="true">
                <li v-for="(item, index) in list">
                    <router-link tag="div" to="shophome" @click.native="_shopId(item.id)" class="shop rightArrow"><img src="../assets/mine/icon_shop.png" />{{item.shop_name}}</router-link>
                    <div class="reviews-wrapper">
                        <v-stars :number="item.user_rating" mini="true" class="stars"></v-stars>
                        <label class="txt-lightgray fs-10" v-if="item.userTag"><img src="../assets/shopcomment/icon_label.png" />{{item.userTag.split(',').join('&nbsp;&nbsp;')}}</label>
                        <p class="fs-12">{{item.comment}}</p>
                    </div>
                    <div class="del">
                        <span>{{item.comment_time}}</span>
                        <a href="javascript:void(0)" @click="commentDel(item.comment_id, index)" class="del-btn"><img src="../assets/mine/icon_delete.png" />删除</a>
                    </div>
                </li>
            </ul>
            <div v-else class="empty-list">
                <img src="../assets/blank/img_comment.png" /><br />
                <span>暂无评论</span>
            </div>
            <p class="loading" v-if="pageInfo.currentPage < pageInfo.totalPage" v-show="loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                加载中...
            </p>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { MessageBox } from 'mint-ui';

    export default {
        data() {
            return {
                list: [],
                loading: false, //无限滚动开关 ,
                pageInfo: {}
            };
        },
        created() {
            this.reqCommentList();
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            ...mapActions(['_shopId', '_ajax']),
            loadmore() {
                this.loading = true;
                setTimeout(() => {
                    this.reqCommentList();
                }, 500);
            },
            //评论列表
            reqCommentList() {
                this._ajax({
                    name: 'commentList',
                    options: {
                        currentPage: (this.pageInfo.currentPage || 0) + 1
                    }
                }).then(res => {
                    this.pageInfo = res.pageInfo;
                    if(this.pageInfo.currentPage == 1) {
                        this.list = [];
                    }
                    this.list = this.list.concat(res.commentlist.commentlistByUserPage);

                    if(this.pageInfo.currentPage < this.pageInfo.totalPage) {
                        this.loading = false;
                    } else if(this.pageInfo.currentPage != 1) {
                        this.msg('没有更多数据了');
                    }
                });
            },
            //删除评论
            commentDel(commentId, index) {
                MessageBox.confirm('确定删除吗？', {
                    'confirmButtonText': '删除',
                    'cancelButtonText': '关闭'
                }).then(() => {
                    this._ajax({
                        name: 'commentDel',
                        options: {
                            commentId: commentId
                        }
                    }).then(res => {
                        if(res.info) {
                            this.msg('删除成功');
                            this.list.splice(index, 1);
                            this.pageInfo.totalCount--;
                        }
                    });
                }, () => { });
            }
        }
    };
</script>

<style scoped lang="less">
    .header-wrapper {
        height: 4.02rem;
        background: url('../assets/mine/bg_comment.png');
        background-size: 100% 100%;
        position: relative;
        text-align: center;
        .headerPic {
            position: absolute;
            top: 1.2rem;
            color: #fff;
            left: 50%;
            transform: translateX(-50%);
            img {
                width: 0.92rem;
                height: 0.92rem;
                margin-bottom: 0.3rem;
                border-radius: 50%;
            }
        }
    }

    .total {
        background: #eee;
        font-size: 0.24rem;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0 0.28rem;
        color: #999;
    }

    .list {
        li {
            padding-left: 0.28rem;
            background: #fff;
            margin-bottom: 0.2rem;
            &:last-child {
                margin-bottom: 0;
            }
            .shop {
                height: 0.8rem;
                line-height: 0.8rem;
                border-bottom: 1px solid #eee;
                img {
                    width: 0.26rem;
                    height: 0.26rem;
                    padding-right: 0.2rem;
                    padding-bottom: 0.08rem;
                }
            }
            .reviews-wrapper {
                padding: 0.3rem 0.3rem 0.3rem 0;
                border-bottom: 1px solid #eee;
                label {
                    padding-top: 0.25rem;
                    display: block;
                }
                p {
                    padding-top: 0.25rem;
                    line-height: 155%;
                }
                img {
                    width: 0.25rem;
                    height: 0.25rem;
                    padding-right: 0.2rem;
                }
            }
            .del {
                height: 0.65rem;
                line-height: 0.65rem;
                padding-right: 0.28rem;
                font-size: 0.24rem;
                color: #999;
                .del-btn {
                    float: right;
                    color: #999;
                    img {
                        width: 0.26rem;
                        height: 0.26rem;
                        padding-right: 0.15rem;
                        padding-bottom: 0.08rem;
                    }
                }
            }
        }
    }
</style>