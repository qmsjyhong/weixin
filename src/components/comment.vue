<template>
    <div class="comment-wrapper">
        <div class="c-header">
            <p class="c-title">{{shopName}}</p>
            <ul class="c-levels clearfix">
                <li v-for="(item, index) in commentLevels" @click="currentLevel = index">
                    <span v-if="currentLevel == index">{{item}}</span><br />
                    <div class="c-level" :class="{active: currentLevel == index}"></div>
                </li>
            </ul>
        </div>
        <div class="c-content">
            <p class="c-title">
                您还可以选择{{maxLabel - selectedLabels.length}}个标签
                <span class="switch-label-btn" @click="switchLableGroup">换一组</span>
            </p>
            <ul class="c-labels">
                <li v-for="(item, index) in commentTaglistPage.slice(currentGroup * 8, (currentGroup + 1) * 8)" class="c-label" :class="{active: item.active}" @click="switchLabel(item)">{{item.commentTagName}}</li>
            </ul>
            <div class="input-wrap">
                <textarea :maxlength="maxInput" v-model="commentTxt" placeholder="菜品口味和服务还满意吗？"></textarea>
                <span v-if="!commentTxt.length" class="input-notes">最少输入{{minInput}}个字</span>
                <span v-else-if="commentTxt.length < minInput" class="input-notes">还需输入{{minInput - commentTxt.length}}个字</span>
                <span v-else class="input-notes">{{commentTxt.length}}/{{maxInput}}</span>
            </div>
            <div class="txt-center">
                <button class="submit" :class="{active: !commentTxt.length || commentTxt.length >= minInput}" @click="commentAdd">提交</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                commentLevels: ['不满意', '一般', '比较满意', '满意', '非常满意'],
                currentLevel: 4,
                commentTxt: '', //评价文本
                maxLabel: 4, //最多选4个标签
                minInput: 6, //最少输入6个字符
                maxInput: 500, //最多输入500个字符
                commentTaglistPage: [], //标签,
                maxGroup: 0, //最大标签组
                currentGroup: 0 //当前标签组
            };
        },
        props: ['orderId', 'shopName'],
        created() {
            this.reqCommentLabels();
        },
        computed: {
            //已选中的标签数
            selectedLabels() {
                return this.commentTaglistPage.filter(item => item.active);
            }
        },
        methods: {
            ...mapActions(['_ajax']),
            //评价标签查询
            reqCommentLabels() {
                this._ajax({
                    name: 'commentLabels',
                    options: {
                        pageSize: 100 //设置最大，标示不分页一次性取所有数据
                    }
                }).then(res => {
                    let temp = res.commentTaglist.commentTaglistPage;

                    temp.forEach(item => {
                        item.active = false;
                    });
                    this.commentTaglistPage = temp;
                    this.maxGroup = Math.ceil(temp.length / 8);
                });
            },
            //换一组
            switchLableGroup() {
                this.currentGroup++;
                if(this.currentGroup == this.maxGroup) {
                    this.currentGroup = 0;
                }
            },
            //选择标签
            switchLabel(item) {
                if(!item.active && this.selectedLabels.length == this.maxLabel) {
                    return;
                }
                item.active = !item.active;
            },
            //添加评价
            commentAdd() {
                if(!this.commentTxt.length || this.commentTxt.length >= this.minInput) {
                    this._ajax({
                        name: 'commentAdd',
                        options: {
                            comment: this.commentTxt,
                            commentTagIds: this.selectedLabels.map(item => item.commentTagId).join(','),
                            commentVol: '',
                            commentVolUrl: '',
                            orderId: this.orderId,
                            userRating: this.currentLevel + 1
                        }
                    }).then(res => {
                        if(res.info) {
                            this.msg(res.info);
                            setTimeout(() => this.$emit('cb'), 500);
                        }
                    });
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .comment-wrapper {
        background: #fff;
        border-radius: 0.5rem 0.5rem 0 0;
        position: absolute;
        bottom: 0;
        width: 100%;
        z-index: 101;
        .c-header {
            padding: 0.48rem 0 0.4rem 0;
            text-align: center;
            border-bottom: 0.2rem solid #f4f4f4;
            .c-title {
                font-size: 0.36rem;
            }
            .c-levels {
                display: inline-block;
                padding-top: 0.4rem;
                li {
                    float: left;
                    font-size: 0.2rem;
                    width: 1.2rem;
                    &:nth-child(1) {
                        color: #999;
                        .c-level {
                            background: ~"url('../assets/orderlist/icon_price_level1.png') no-repeat 0 bottom / 100%";
                            &.active {
                                background: ~"url('../assets/orderlist/icon_price_level1_active.png') no-repeat 0 0 / 100% 100%";
                            }
                        }
                    }
                    &:nth-child(2) {
                        color: #fddf19;
                        .c-level {
                            background: ~"url('../assets/orderlist/icon_price_level2.png') no-repeat 0 bottom / 100%";
                            &.active {
                                background: ~"url('../assets/orderlist/icon_price_level2_active.png') no-repeat 0 0 / 100% 100%";
                            }
                        }
                    }
                    &:nth-child(3) {
                        color: #fdba1a;
                        .c-level {
                            background: ~"url('../assets/orderlist/icon_price_level3.png') no-repeat 0 bottom / 100%";
                            &.active {
                                background: ~"url('../assets/orderlist/icon_price_level3_active.png') no-repeat 0 0 / 100% 100%";
                            }
                        }
                    }
                    &:nth-child(4) {
                        color: #fd7c14;
                        .c-level {
                            background: ~"url('../assets/orderlist/icon_price_level4.png') no-repeat 0 bottom / 100%";
                            &.active {
                                background: ~"url('../assets/orderlist/icon_price_level4_active.png') no-repeat 0 0 / 100% 100%";
                            }
                        }
                    }
                    &:nth-child(5) {
                        color: #fd5514;
                        .c-level {
                            background: ~"url('../assets/orderlist/icon_price_level5.png') no-repeat 0 bottom / 100%";
                            &.active {
                                background: ~"url('../assets/orderlist/icon_price_level5_active.png') no-repeat 0 0 / 100% 100%";
                            }
                        }
                    }
                    .c-level {
                        width: 0.46rem;
                        height: 0.78rem;
                        margin: 0 auto;
                        position: relative;
                        margin-top: 0.1rem;
                        img {
                            width: 0.46rem;
                            height: 0.46rem;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                        }
                    }
                }
            }
        }
        .c-content {
            padding: 0.4rem 0.28rem 0 0.28rem;
            font-size: 0.26rem;
            .c-title {
                .switch-label-btn {
                    float: right;
                    color: #fff;
                    width: 0.98rem;
                    height: 0.28rem;
                    line-height: 0.28rem;
                    background: #fd5615;
                    border-radius: 0.2rem;
                    text-align: center;
                    font-size: 0.2rem;
                }
            }
            .c-labels {
                padding-top: 0.3rem;
                height: 1.82rem;
                width: 6.7rem;
                margin: 0 auto;
                .c-label {
                    display: inline-block;
                    width: 1.3rem;
                    height: 0.4rem;
                    line-height: 0.4rem;
                    text-align: center;
                    border-radius: 0.2rem;
                    border: 1px solid #999;
                    color: #999;
                    margin-right: 0.5rem;
                    margin-bottom: 0.35rem;
                    font-size: 0.22rem;
                    &:nth-child(4n) {
                        margin-right: 0;
                    }
                    &.active {
                        background: #fdb814;
                        color: #fff;
                        border: 1px solid #fdb814;
                    }
                }
            }
            .input-wrap {
                height: 2.6rem;
                border-radius: 0.16rem;
                border: 1px solid #ccc;
                padding: 0.1rem;
                padding-bottom: 0.6rem;
                textarea {
                    height: 100%;
                }
                .input-notes {
                    float: right;
                    font-size: 0.24rem;
                    color: #ccc;
                    padding-right: 0.1rem;
                }
            }
            .submit {
                width: 4.2rem;
                height: 0.8rem;
                line-height: 0.8rem;
                font-size: 0.3rem;
                color: #fff;
                text-align: center;
                border-radius: 0.2rem;
                margin-top: 0.3rem;
                margin-bottom: 0.3rem;
                background: #ccc;
                &.active {
                    background: #fd5615;
                    color: #fff;
                }
            }
        }
    }
</style>