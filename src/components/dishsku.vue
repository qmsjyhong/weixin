<template>
    <div v-if="isShow">
        <div class="mask" @click="isShow = false"></div>
        <div class="sku-wrapper">
            <div class="sku-header">
                <button class="close" @click="isShow = false">
                    <img src="../assets/common/btn_close.png" />
                </button>
            </div>
            <ul class="sku-content">
                <li v-for="group in list">
                    <span class="title">{{group.title}} <span class="txt-orange">( {{group.desc}} )</span></span>
                    <div class="labels">
                        <button v-for="(label, index) in group.labels" class="label" :class="{'active': label.active}" @click="switchLabel(group, label, index)">{{label.name}}</button>
                    </div>
                </li>
            </ul>
            <div class="sku-footer flex">
                <span class="price">￥36</span><span class="fs-12 txt-gray flex-auto">&nbsp;( 份 )</span>
                <button v-if="dishIndex == -1" class="add-btn" @click="addToCart"><img src="../assets/dish/icon_shopping_cart.png" /> 加入购物车</button>
                <v-dish-add-reduce v-show="dishIndex > -1" class="add-reduce" :dish="dish" :type="type" ref="dishAddReduce"></v-dish-add-reduce>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                dish: {},
                isShow: false,
                dishType: 1,//1套餐2普通菜品
                list: [
                    {
                        title: '做法',
                        desc: '5选3',
                        option: 3,
                        labels: [
                            { id: 1, name: '蒜泥x2份' },
                            { id: 2, name: '清真x2份' },
                            { id: 3, name: '红烧' },
                            { id: 4, name: '油焖x2盘' },
                            { id: 5, name: '蒜泥' }
                        ]
                    },
                    {
                        title: '辣度',
                        desc: '3选1',
                        option: 1,
                        labels: [
                            { id: 1, name: '特辣' },
                            { id: 2, name: '麻辣' },
                            { id: 3, name: '微辣' }
                        ]
                    },
                    {
                        title: '规格',
                        desc: '必选',
                        option: 2,
                        labels: [
                            { id: 1, name: '一份' },
                            { id: 2, name: '半分' }
                        ]
                    }]
            };
        },
        props: ['type'],
        computed: {
            ...mapGetters(['order']),
            //购物车菜品
            cartList() {
                return this.order.dishes || [];
            },
            //separator
            separator() {
                return this.dishType == 1 ? '+' : '、';
            },
            //选中的标签id
            skuId() {
                return this.dish.itemId + '_' + this.list.map(group => {
                    return group.labels.filter(label => {
                        return label.active;
                    }).map(label => label.id).join('+');
                }).join('_');
            },
            //选中的标签名
            skuLabels() {
                return this.list.map(group => {
                    return group.labels.filter(label => {
                        return label.active;
                    }).map(label => label.name).join(this.separator);
                }).join(this.separator);
            },
            //当前选中的规格的菜品在购物车的位置,-1表示不存在
            dishIndex() {
                return this.cartList.findIndex(item => item.skuId == this.skuId);
            }
        },
        methods: {
            ...mapActions(['_order']),
            //打开面板
            open(dish) {
                this.handleList();
                this.dish = dish;
                this.checkExist();
                this.isShow = true;
            },
            //默认选中每组第一个标签
            handleList() {
                this.list.forEach(group => {
                    group.labels.forEach((label, index) => {
                        if(group.option > index) {
                            this.$set(label, 'active', true);
                        } else {
                            this.$set(label, 'active', false);
                        }
                    });
                });
            },
            //检测选中的菜品规格是否存在于购物车,存在即初始化数量和skuId
            checkExist() {
                console.log(this.skuId, this.dishIndex, this.list);
                if(this.dishIndex != -1) {
                    this.dish.quantity = this.cartList[this.dishIndex].quantity;
                    this.dish.skuId = this.cartList[this.dishIndex].skuId;
                }
            },
            //切换label
            switchLabel(group, label) {
                if(group.option != group.labels.length) {
                    if(group.option == 1) {
                        group.labels.forEach(item => {
                            item.active = false;
                        });
                        label.active = true;
                    } else if(label.active) {
                        label.active = false;
                    } else if(group.labels.filter(item => item.active).length >= group.option) {
                        this.msg('清先取消一个选项');
                        return false;
                    } else {
                        label.active = true;
                    }
                } else {
                    this.msg('此菜品不可取消');
                }

                this.checkExist();
            },
            //点击加入购物车，调用dishAddReduce组件内增加菜品方法
            addToCart() {
                let isSelected = true;

                for(let i = 0; i < this.list.length; i++) {
                    let group = this.list[i];

                    if(group.labels.filter(label => label.active).length != group.option) {
                        isSelected = false;
                        break;
                    }
                }

                if(isSelected) {
                    this.dish.quantity = 0;
                    this.dish.skuId = this.skuId;
                    this.dish.skuLabels = this.skuLabels;
                    this.$refs.dishAddReduce.add();
                } else {
                    this.msg('请选择规格');
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .mask {
        z-index: 101;
    }
    .sku-wrapper {
        position: absolute;
        bottom: 0;
        z-index: 102;
        width: 100%;
        background-color: #fff;
        .sku-header {
            height: 0.4rem;
            border-bottom: 1px solid #f4f4f4;
            .close {
                position: absolute;
                right: 0;
                top: 0;
                width: 0.8rem;
                height: 0.6rem;
                background-color: transparent;
                img {
                    position: absolute;
                    width: 0.24rem;
                    height: 0.24rem;
                    top: 0.08rem;
                    right: 0.28rem;
                }
            }
        }
        .sku-content {
            max-height: 5.04rem;
            overflow-y: auto;
            li {
                padding: 0.3rem 0.28rem;
                font-size: 0.24rem;
                border-bottom: 1px solid #f4f4f4;
                .labels {
                    margin-right: -0.28rem;
                    .label {
                        min-width: 1.1rem;
                        height: 0.4rem;
                        color: #666;
                        border: 1px solid #ddd;
                        border-radius: 0.5rem;
                        margin-right: 0.25rem;
                        margin-top: 0.2rem;
                        background-color: #fff;
                        padding: 0 0.2rem;
                        &.active {
                            color: #fd5615;
                            border: 1px solid #fd5615;
                        }
                    }
                }
            }
        }
        .sku-footer {
            height: 1.14rem;
            padding: 0 0.28rem;
            .price {
                font-size: 0.36rem;
                color: #fd5615;
            }
            .add-btn {
                border-radius: 0.5rem;
                background-color: #fd5615;
                color: #fff;
                height: 0.56rem;
                width: 2rem;
                font-size: 0.24rem;
                img {
                    width: 0.34rem;
                    height: 0.32rem;
                }
            }
        }
    }
</style>