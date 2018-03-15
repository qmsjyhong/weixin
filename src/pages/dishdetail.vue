<template>
    <div class="pt pb">
        <v-head-com>菜品详情</v-head-com>
        <div class="content">
            <v-banner id="banner" :banner="banners" class="dish-banner"></v-banner>
            <div class="dish-info">
                <div class="line1">
                    <span>{{dishDetail.title}}</span>
                    <span class="like-size active" @click="likeMany">
                        <img v-if="!dishDetail.userLikeDishFlag" src="../assets/common/icon_praise_orange.png" alt="点赞" />
                        <img v-else src="../assets/common/icon_fabulous.png" />
                        <span class="praise-count txt-orange">{{dishDetail.likeSize}}人</span>
                    </span>
                </div>
                <div class="line2 flex">
                    <span class="price">￥{{dishDetail.originalPrice | currency}}</span>
                    <button v-if="dishDetail.sku" class="sku-btn" @click="selectSKU">选规格<span v-if="dishDetail.quantity" class="quantity">{{dishDetail.quantity}}</span></button>
                    <template v-else>
                        <v-dish-add-reduce v-show="dishDetail.quantity" :dish="dishDetail" :type="2" ref="dishAddReduce"></v-dish-add-reduce>
                        <button v-show="!dishDetail.quantity" class="add-btn" @click="addToCart"><img src="../assets/dish/icon_shopping_cart.png" /> 加入购物车</button>
                    </template>
                </div>
            </div>
            <div class="dish-detail">
                <div v-if="true" class="package">
                    <div class="title">套餐详情</div>
                    <div class="package-detail">
                        <div class="flex" v-for="group in dishDetail.groups">
                            <div class="group-name">{{group.groupName}}<br />{{group.infoDesc}}</div>
                            <ul class="group-items">
                                <li v-for="dish in group.items">
                                    {{dish.title}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div v-else class="title">菜品详情</div>
                <div>
                    <div class="images" v-for="item in dishDetail.imgs">
                        <img :src="item.picUrl" />
                    </div>
                </div>
            </div>
        </div>

        <v-shopcart @save="$router.go(-1)" :type="6">确定</v-shopcart>
        <v-dishsku ref="dishsku" :type="4"></v-dishsku>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { serialize } from '../utils';

    export default {
        data() {
            return {
                banners: [
                    {
                        picUrl: 'https://img.qms888.com/photo_3204943252826336545_crop.jpg?t=0.4370705860713384'
                    },
                    {
                        picUrl: 'https://img.qms888.com/photo_3204943252826336545_crop.jpg?t=0.4370705860713384'
                    },
                    {
                        picUrl: 'https://img.qms888.com/photo_3204943252826336545_crop.jpg?t=0.4370705860713384'
                    }
                ],
                dishDetail: {}
            };
        },
        created() {
            this.$root.eventHub.$on('renderDishDetailQuantity', this.renderDishQuantity);
            this.getDishDetail();
        },
        computed: {
            ...mapGetters(['session', 'shopId', 'order', 'custom']),
            //购物车菜品
            cartList() {
                return this.order.dishes || [];
            }
        },
        methods: {
            ...mapActions(['_order', '_shopId', '_ajax']),
            //请求菜品详情
            getDishDetail() {
                // this._ajax({
                //     name: 'dishInfo',
                //     options: {
                //         id: this.custom.dishId
                //     }
                // }).then(res => {
                //     this.dishDetail = res;

                this.dishDetail = {
                    "categoryId": 4247,
                    "categoryTitle": "1111",
                    "itemId": 190,
                    "icon": "http://img.ts.meia8.com/photo_8036712452950237127.jpeg",
                    "title": "蜂情烤鸡堡",
                    "originalPrice": 12,
                    "price": 10.8,
                    "pepperLevel": 0,
                    "itemType": 1,
                    "stock": 99999,
                    "stockWarn": 0,
                    "likeSize": 100,
                    "userLikeDishFlag": false,
                    "sku": true,
                    "imgs": [
                        {
                            picUrl: 'https://img.qms888.com/photo_3204943252826336545_crop.jpg?t=0.4370705860713384'
                        },
                        {
                            picUrl: 'https://img.qms888.com/photo_3204943252826336545_crop.jpg?t=0.4370705860713384'
                        },
                        {
                            picUrl: 'https://img.qms888.com/photo_3204943252826336545_crop.jpg?t=0.4370705860713384'
                        }
                    ],
                    "groups": [{
                        "groupId": 1,
                        "groupName": "全家福套餐",
                        "infoDesc": "",
                        "items": [{
                            "itemId": 1,
                            "itemNum": 2,
                            "title": "香辣鸡腿堡 ×2份"
                        }, {
                            "itemId": 2,
                            "itemNum": 1,
                            "title": "香辣鸡翅 ×1份"
                        }, {
                            "itemId": 3,
                            "itemNum": 1,
                            "title": "老北京鸡肉卷 ×1份"
                        }],
                        "optionalNum": 1,
                        "optionalType": 0
                    }, {
                        "groupId": 2,
                        "groupName": "",
                        "infoDesc": "3选1",
                        "items": [{
                            "itemId": 1,
                            "itemNum": 2,
                            "title": "可乐 ×2份"
                        }, {
                            "itemId": 2,
                            "itemNum": 2,
                            "title": "雪碧 ×2份"
                        }, {
                            "itemId": 3,
                            "itemNum": 2,
                            "title": "咖啡 ×2份"
                        }],
                        "optionalNum": 1,
                        "optionalType": 1
                    }]
                };

                this.$set(this.dishDetail, 'quantity', 0);
                this.renderDishQuantity();
                // });
            },
            //菜品点赞
            likeMany() {
                if(!this.session) {
                    this.$router.push('login');
                    return false;
                }
                this.dishDetail.userLikeDishFlag = !this.dishDetail.userLikeDishFlag;
            },
            //从购物车数量修改该菜品数量
            renderDishQuantity() {
                let quantity = 0;

                this.cartList.forEach(item => {
                    if(item.itemId == this.custom.dishId) {
                        quantity += item.quantity;
                    }
                });

                this.dishDetail.quantity = quantity;
            },
            //加入购物车
            addToCart() {
                this.$nextTick(() => {
                    this.$refs.dishAddReduce.add();
                });
            },
            //选规格
            selectSKU() {
                this.$nextTick(() => {
                    this.$refs.dishsku.open(serialize(this.dishDetail));
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .content {
        background: #f4f4f4;
    }

    .pb {
        padding-bottom: 1rem;
    }

    .footer {
        height: 1rem;
    }

    .dish-banner {
        height: 7.2rem;
    }

    .dish-info {
        padding: 0.28rem;
        background: #fff;
        .like-size {
            padding-left: 0.3rem;
            img {
                width: 0.32rem;
                height: 0.32rem;
            }
            .praise-count {
                font-size: 0.24rem;
                vertical-align: middle;
            }
        }

        .line2 {
            height: 0.6rem;
            align-items: flex-end;
            justify-content: space-between;
            .price {
                font-size: 0.36rem;
                color: #fd5615;
            }
            .sku-btn {
                position: relative;
                color: #fff;
                background-color: #fd5615;
                border-radius: 1rem;
                width: 1.2rem;
                height: 0.5rem;
                font-size: 0.26rem;
                line-height: 0.5rem;
                .quantity {
                    position: absolute;
                    top: -0.2rem;
                    right: 0;
                    background: #ddd;
                    min-width: 0.26rem;
                    height: 0.26rem;
                    line-height: 0.26rem;
                    color: #fff;
                    background-color: #fd5615;
                    font-size: 0.2rem;
                    padding: 0.02rem;
                    border: 2px solid #fff;
                    border-radius: 0.8rem;
                }
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

    .dish-detail {
        margin-top: 0.15rem;
        padding: 0.4rem 0.28rem 0.3rem 0.28rem;
        background-color: #fff;
        .title {
            font-size: 0.26rem;
            color: #999;
        }
        .package {
            &-detail {
                background-color: #fafafa;
                border: 1px solid #eee;
                margin-top: 0.2rem;
                .flex {
                    border-bottom: 1px solid #eee;
                    &:last-child {
                        border-bottom: 0;
                    }
                }
                .group-name {
                    width: 2.4rem;
                    text-align: center;
                    font-size: 0.26rem;
                }
                .group-items {
                    background-color: #fff;
                    flex: 1;
                    li {
                        height: 0.6rem;
                        line-height: 0.6rem;
                        padding: 0 0.2rem;
                        border-left: 1px solid #eee;
                        border-bottom: 1px solid #eee;
                        font-size: 0.24rem;
                        &:last-child {
                            border-bottom: 0;
                        }
                    }
                }
            }
        }
        .images {
            padding-top: 0.3rem;
        }
    }
</style>


