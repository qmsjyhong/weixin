<template>
    <div>
        <div class="dishes-title">{{title || '已点菜品'}}</div>
        <ul class="dishes">
            <li class="flex" v-for="(dish, index) in res">
                <img class="col1" :src="dish.icon + (dish.icon.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_fixed,h_60,w_60'" />
                <div class="col2 flex-auto">
                    <span class="ellipsis">{{dish.title}}</span>
                    <span v-if="edit" class="fs-13 txt-lightgray">¥ {{dish.originalPrice | currency}}</span>
                    <span v-else class="txt-lightgray">
                        <span class="fs-12">×{{dish.quantity}}{{dish.unit}}</span><br /><span class="fs-11">{{dish.skuLabels}}</span>
                    </span>
                </div>
                <div v-if="edit" class="col3 edit">
                    <div class="add-reduce flex">
                        <a class="reduce" href="javascript:;" v-if="dish.refundQuantity" @click="dish.refundQuantity--"><img src="../assets/dish/icon_dish_reduce.png" /></a>
                        <span @click="dishInput(dish)" v-if="dish.refundQuantity">{{dish.refundQuantity}}</span>
                        <a class="add" :class="{'empty': !dish.refundQuantity}" href="javascript:;" @click="dish.refundQuantity < dish.quantity && dish.refundQuantity++"><img src="../assets/dish/icon_dish_add.png" /></a>
                    </div>
                </div>
                <span v-else class="col3 fs-13 txt-gray">¥ {{dish.originalPrice | currency}}</span>
            </li>
        </ul>
        <v-dish-input ref="dishInput" :refund="refund"></v-dish-input>
    </div>
</template>

<script>
    export default {
        /**
         * @res菜品
         * @title 菜品列表title
         * @edit是否可以编辑数量
         * @refund是否是退款（用于组件v-dish-input）
         */
        props: ['res', 'title', 'edit', 'refund'],
        methods: {
            //输入菜品数量
            dishInput(dish) {
                this.$refs.dishInput.open(dish, refundQuantity => {
                    dish.refundQuantity = refundQuantity;
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .dishes-title {
        padding: 0.22rem 0.28rem;
        color: #999;
        font-size: 0.24rem;
        background-color: #fafafa;
    }

    .dishes {
        font-size: 0.3rem;
        padding: 0.25rem 0.28rem 0.3rem;
        background-color: #fff;
        border-bottom: 1px solid #eee;
        li {
            position: relative;
            padding-bottom: 0.2rem;
            &:last-child {
                padding-bottom: 0;
            }
            .col1 {
                width: 1.1rem;
                height: 1.1rem;
                margin-right: 0.2rem;
                border-radius: 0.1rem;
                align-self: flex-start;
            }
            .col2 {
                width: 1rem;
                padding-right: 0.2rem;
            }
            .col3 {
                text-align: right;
                &.edit {
                    width: 2rem;
                    flex-shrink: 0;
                }
            }
        }
    }

    .add-reduce {
        justify-content: flex-end;
        span {
            min-width: 0.73rem;
            text-align: center;
            height: 0.54rem;
            line-height: 0.54rem;
            background-color: #f7f7f7;
            outline: 1px solid #ebebeb;
            outline-offset: -1px;
        }
        a {
            width: 0.54rem;
            height: 0.54rem;
            &.add {
                margin-left: -1px;
                &.empty {
                    img {
                        border-radius: 0.11rem;
                    }
                }
            }
            &.reduce {
                margin-right: -1px;
            }
        }
    }
</style>