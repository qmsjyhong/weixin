<template>
    <div>
        <!-- <div class="flex">
            <a href="javascript:;" v-if="dish.refundQuantity" @click="dish.refundQuantity--"><img src="../assets/dish/icon_dish_reduce.png" /></a>
            <span @click="dishInput(dish)" v-if="dish.refundQuantity">{{dish.refundQuantity}}</span>
            <a class="add" href="javascript:;" @click="dish.refundQuantity < dish.quantity && dish.refundQuantity++"><img src="../assets/common/icon_dish_add.png" /></a>
        </div> -->
        <template v-if="type == 1">
            <div class="add-reduce flex">
                <a class="reduce" href="javascript:;" v-if="dish.quantity" @click="reduce"><img src="../assets/dish/icon_dish_reduce.png" /></a>
                <span @click="input" v-if="dish.quantity">{{dish.quantity}}</span>
                <a class="add" :class="{'empty': !dish.quantity}" href="javascript:;" @click="add"><img src="../assets/dish/icon_dish_add.png" /></a>
            </div>
        </template>
        <template v-else-if="type == 3 || type == 4">
            <div class="add-reduce flex">
                <a class="reduce" href="javascript:;" @click="reduce"><img src="../assets/dish/icon_dish_reduce.png" /></a>
                <span @click="input">{{dish.quantity}}</span>
                <a class="add" href="javascript:;" @click="add"><img src="../assets/dish/icon_dish_add.png" /></a>
            </div>
        </template>
        <template v-else>
            <div class="add-reduce flex">
                <a class="reduce" href="javascript:;" @click="reduce"><img src="../assets/dish/icon_dish_reduce.png" /></a>
                <span @click="input">{{dish.quantity}}</span>
                <a class="add" href="javascript:;" @click="add"><img src="../assets/dish/icon_dish_add.png" /></a>
            </div>
        </template>

        <v-dish-input ref="dishInput"></v-dish-input>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        //type:1.dishes,2.dish,3.dishessku,4.dishsku,5.dishescart,6.dishcart
        props: ['dish', 'type'],
        computed: {
            ...mapGetters(['order']),
            //购物车菜品
            cartList() {
                return this.order.dishes || [];
            },
            //当前菜品在购物车的位置,-1表示不存在
            dishIndex() {
                return this.cartList.findIndex(item => item.skuId == (this.dish.skuId || this.dish.itemId));
            }
        },
        methods: {
            ...mapActions(['_order']),
            //增加菜品数量
            add() {
                if(this.dish.quantity < this.dish.stock && this.dish.quantity < 999) {
                    console.log('add dish...', this.dish.quantity);
                    this.dish.quantity++;

                    //操作非购物车的加菜
                    if(this.type <= 4) {
                        if(this.dishIndex == -1) {
                            this.dish.skuId = this.dish.skuId || this.dish.itemId;
                            this.cartList.push(this.dish);
                        } else {
                            this.cartList[this.dishIndex].quantity = this.dish.quantity;
                        }
                    }
                    this.storeOrder();
                }
            },
            //减少菜品数量
            reduce() {
                console.log('reduce dish...', this.dish.quantity);
                this.dish.quantity--;

                //操作非购物车的减菜
                if(this.type <= 4) {
                    this.cartList[this.dishIndex].quantity--;
                }
                this.storeOrder();
            },
            //输入菜品数量
            input() {
                this.$refs.dishInput.open(this.dish, quantity => {
                    console.log('input dish...');
                    this.dish.quantity = quantity;

                    //操作非购物车的输入
                    if(this.type <= 4) {
                        this.cartList[this.dishIndex].quantity = quantity;
                    }
                    this.storeOrder();
                });
            },
            //将菜品加入购物车
            storeOrder() {
                console.log('store cart...');
                this.order.dishes = this.cartList.filter(item => item.quantity);
                this._order(this.order);
                this.reRender();
            },
            //重新渲染菜品数量
            reRender() {
                console.log('render dish quantity...', 'type:' + this.type);
                if(this.type == 3 || this.type == 5) {
                    console.log('cart change,render dishlist quantity...');
                    this.$root.eventHub.$emit('renderDishListQuantity');
                } else if(this.type == 4 || this.type == 6) {
                    console.log('cart change,render dishdetail quantity...');
                    this.$root.eventHub.$emit('renderDishDetailQuantity');
                }
            }
        }
    };
</script>

<style scoped lang="less">
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