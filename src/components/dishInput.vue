<template>
    <div v-if="isShow">
        <div class="mask" @click="isShow = false"></div>
        <div class="dish-wrapper">
            <div class="dish-quantity-box" :class="{error: !validate}">
                <input class="dish-quantity" type="number" @input="validate = true" v-model="dish.quantity" placeholder="请输入数量" onkeyup="this.value=this.value.replace(/[\D]/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" pattern="[0-9]*" />
                <div class="dish-unit">{{dish.unit}}</div>
            </div>
            <div class="dotted"></div>
            <div class="dish-btns" v-if="validate">
                <button @click="cancel">清零</button>
                <button @click="isActive && confirm()" class="confirm" :class="{active: isActive}">确认</button>
            </div>
            <div v-else class="dish-btns dish-error">该菜品还有{{dish.stock}}{{dish.unit}}，请重新输入</div>
        </div>
    </div>
</template>

<script>
    import { serialize } from '../utils';

    export default {
        data() {
            return {
                dish: {}, //菜品详情
                isShow: false, //是否显示输入面板
                cb: null, //点击确认回调
                validate: true //点击确认按钮是否验证通过
            };
        },
        props: ['refund'],
        computed: {
            //确认按钮是否有效
            isActive() {
                if(/^[1-9][0-9]{0,2}$/.test(this.dish.quantity)) {
                    if(this.refund) {
                        return this.refund && this.dish.quantity <= this.dish.totalQuantity;
                    }
                    return true;
                }
            }
        },
        methods: {
            //确认
            confirm() {
                if(!this.refund && this.dish.quantity > this.dish.stock) {
                    this.validate = false;
                    this.dish.quantity = '';
                    return;
                }

                this.isShow = false;
                this.cb(parseInt(this.dish.quantity));
            },
            //取消
            cancel() {
                this.isShow = false;
                this.cb(0);
            },
            //打开面板
            open(dish, cb) {
                this.cb = cb;
                this.validate = true;
                this.isShow = true;
                this.dish = serialize(dish);
                if(this.refund) {
                    this.dish.totalQuantity = dish.quantity;
                    this.dish.quantity = dish.refundQuantity;
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .mask {
        z-index: 101;
    }
    .dish-wrapper {
        width: 5.15rem;
        height: 2.83rem;
        background: #fff;
        border-radius: 0.1rem;
        position: fixed;
        z-index: 102;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        .dish-quantity-box {
            width: 4.23rem;
            height: 0.7rem;
            border-radius: 0.06rem;
            margin: 0 auto;
            margin-top: 0.34rem;
            position: relative;
            border: 1px solid #dbdbdb;
            &.error {
                border: 2px solid #fd5615;
            }
            .dish-quantity {
                width: 100%;
                height: 100%;
                background: #f7f7f7;
                padding: 0 1.09rem 0 0.28rem;
                border-radius: 0.06rem;
                color: #fd5615;
                text-align: right;
            }
            .dish-unit {
                position: absolute;
                right: 0;
                top: 0.1rem;
                bottom: 0.1rem;
                width: 0.89rem;
                border-left: 1px solid #eee;
                line-height: 0.5rem;
                color: #b2b2b2;
            }
        }
        .dotted {
            border-bottom: 0.08rem dotted #eee;
            padding-top: 0.35rem;
            position: absolute;
            width: 100%;
        }
        .dish-btns {
            padding-top: 0.73rem;
            &.dish-error {
                color: #fd5615;
            }
            button {
                width: 2.06rem;
                height: 0.7rem;
                background: #fff;
                border-radius: 0.06rem;
                border: 1px solid #e5e5e5;
                outline: none;
                box-shadow: none;
                color: #fd5615;
                &.confirm {
                    background: #ccc;
                    color: #fff;
                    &.active {
                        background: #fd5615;
                    }
                }
            }
        }
    }
</style>