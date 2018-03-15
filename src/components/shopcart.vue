<template>
    <div>
        <div>
            <div class="detail-bottom clearfix">
                <div class="cart-position" :class="{'empty': !goodsQuantity}" @click="toggleCart">
                    <a class="acount-position" v-if="goodsQuantity" href="javascript:;">{{goodsQuantity}}</a>
                </div>
                <div class="cart" v-if="isShowCart">
                    <div class="clearfix title">
                        <button class="right clear-cart" @click="clearCart"><img src="../assets/dish/icon_empty.png" /> <span> 清空</span></button>
                    </div>
                    <ul class="cart-list">
                        <li class="flex fs-15" v-if="good.quantity" v-for="good in cartList">
                            <div class="dish-title flex-auto">
                                <span class="bold ellipsis">{{good.title}}</span>
                                <span class="sub-title txt-lightgray">{{good.skuLabels}}</span>
                            </div>
                            <span class="txt-orange money"><span class="fs-12">¥&nbsp;</span>{{good.originalPrice * good.quantity | currency}}</span>
                            <v-dish-add-reduce :dish="good" :type="type" class="add-reduce"></v-dish-add-reduce>
                        </li>
                    </ul>
                </div>
                <div class="bottom-btns clearfix">
                    <template v-if="goodsQuantity">
                        <span id="totalPrice" class="total-price left" @click="toggleCart">需支付：
                            <i>¥{{totalPrice | currency}}</i>
                        </span>
                        <span class="choose-btn left" :class="{disabled: !goodsQuantity}" @click="$emit('save')"><slot></slot></span>
                    </template>
                    <template v-else>
                        <span id="totalPrice" class="total-price left" :class="{disabled: !goodsQuantity}">购物车空空如也</span>
                        <span class="choose-btn left" :class="{disabled: !goodsQuantity}">请选择商品</span>
                    </template>
                </div>
            </div>
        </div>

        <div class="mask" v-if="isShowCart" @click="isShowCart = false"></div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                isShowCart: false
            };
        },
        props: ['type'],
        computed: {
            ...mapGetters(['order']),
            cartList() {
                return this.order.dishes || [];
            },
            //购物车商品总数
            goodsQuantity() {
                let quantity = 0;

                this.cartList.forEach(good => {
                    quantity += good.quantity;
                });
                if(!quantity) {
                    this.isShowCart = false;
                }
                return quantity;
            },
            //商品总价格
            totalPrice() {
                let price = 0;

                this.cartList.forEach(good => {
                    price += good.originalPrice * good.quantity;
                });

                return price;
            }
        },
        methods: {
            ...mapActions(['_order']),
            //展开关闭购物车
            toggleCart() {
                if(!this.goodsQuantity) {
                    return;
                }
                this.isShowCart = !this.isShowCart;
            },
            //清空购物车
            clearCart() {
                this.order.dishes = [];
                this._order(this.order);
                if(this.type == 5) {
                    console.log('cart change,render dishlist quantity...');
                    this.$root.eventHub.$emit('renderDishListQuantity');
                } else if(this.type == 6) {
                    console.log('cart change,render dishdetail quantity...');
                    this.$root.eventHub.$emit('renderDishDetailQuantity');
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .detail-bottom {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        z-index: 101;
        .cart {
            background: #fff;
            .title {
                border-bottom: 1px solid #ebebeb;
                height: 0.5rem;
                line-height: 0.5rem;
                .clear-cart {
                    text-align: center;
                    padding: 0 0.28rem;
                    height: 0.5rem;
                    float: right;
                    color: #999;
                    font-size: 0.22rem;
                    background: transparent;
                    line-height: 1;
                    img {
                        width: 0.28rem;
                        height: 0.28rem;
                    }
                    span {
                        vertical-align: middle;
                    }
                }
            }
            .cart-list {
                max-height: 6rem;
                overflow: auto;
                padding-bottom: 0.35rem;
                -webkit-overflow-scrolling: touch;
                li {
                    padding: 0.28rem;
                    border-top: 1px solid #ebebeb;
                    &:first-child {
                        border-top: none;
                    }
                    .dish-title {
                        padding-right: 0.2rem;
                        width: 1rem;
                        .sub-title {
                            font-size: 0.22rem;
                        }
                    }
                    .money {
                        padding-right: 0.24rem;
                        min-width: 0.8rem;
                    }
                    .add-reduce {
                        position: static;
                        display: -webkit-box;
                        width: 2rem;
                        flex-shrink: 0;
                    }
                }
            }
        }
        .cart-position {
            width: 1rem;
            height: 1rem;
            position: absolute;
            background: url('../assets/dish/icon_shopping.png') no-repeat center #181818;
            background-size: 100% 100%;
            border-radius: 0.5rem;
            left: 0.35rem;
            bottom: 0.35rem;
            &.empty {
                background: url('../assets/dish/icon_shopping_empty.png') no-repeat center #181818;
                background-size: 100% 100%;
            }
            .acount-position {
                position: absolute;
                min-width: 0.34rem;
                height: 0.34rem;
                line-height: 0.34rem;
                background: #fd5615;
                color: #fff !important;
                right: -0.1rem;
                top: 0;
                border-radius: 0.8rem;
                text-align: center;
                font-size: 0.24rem;
                padding: 1px;
            }
        }
        .bottom-btns {
            font-size: 0.32rem;
            span {
                color: #fff;
                text-align: center;
                height: 1rem;
                line-height: 1rem;
            }
            .total-price {
                width: 70%;
                background: #333;
                &.disabled {
                    color: #808080;
                }
            }
            .choose-btn {
                width: 30%;
                background: #fd5615;
                &.disabled {
                    background: gray;
                    color: #ccc;
                }
            }
        }
    }
</style>

