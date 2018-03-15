<template>
    <div class="pt pb">
        <v-head-com>全部菜品</v-head-com>
        <div class="search">
            <router-link to="searchdish" tag="div" class="search-input">
                <img class="search-icon" src="../assets/common/icon_search.png" />
                <input placeholder="请输入菜品要求" disabled class="search-keywords" type="text" v-model="keywords" />
                <img v-if="keywords" @click.stop="clearKeywords" class="clear-icon" src="../assets/common/icon_clear.png" />
            </router-link>
        </div>
        <div class="content">
            <ul class="cat-list">
                <li class="title" :class="{active:type.active}" v-if="type.visible" v-for="(type, index) in shopItemAll" :ref="'list_' + index" @click="changeType(type)">{{type.categoryTitle}}</li>
            </ul>
            <ul class="sub-cat-list" @scroll="scrollDishes">
                <template v-for="(type, tIndex) in shopItemAll">
                    <li class="title" v-if="type.visible">{{type.categoryTitle}}</li>
                    <li class="clearfix" v-if="dish.visible" v-for="(dish, dIndex) in type.items" :class="{'sell-out': !dish.stock}">
                        <div class="commodityPic" @click="viewDish(dish)"><img :src="dish.icon + (dish.icon.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_fixed,h_70,w_70'" /></div>
                        <div class="commodityContentShow">
                            <div class="line1 ellipsis" :class="{'txt-lightgray': !dish.stock}">{{dish.title}}</div>
                            <div class="line2" v-if="dish.unit" :class="{'txt-lightgray': !dish.stock}">{{dish.unit}}</div>
                            <div class="line3">
                                <span class="green">新品</span><span class="orange">推荐</span>
                            </div>
                            <div class="line4" v-if="dish.pepperLevelArr.length">
                                <template v-if="dish.stock">
                                    <img v-for="chilli in dish.pepperLevelArr" src="../assets/dish/icon_chilli_orange.png" />
                                </template>
                                <template v-else>
                                    <img v-for="chilli in dish.pepperLevelArr" src="../assets/dish/icon_chilli.png" />
                                </template>
                            </div>
                            <div class="line5">
                                <span v-if="dish.stock > 20 && dish.stock < 9999">限量{{dish.stock}}份</span>
                                <span v-else-if="dish.stock > 0 && dish.stock <= 20">仅剩{{dish.stock}}份</span>
                            </div>
                            <div class="line6">
                                <span :class="dish.stock ? 'txt-orange' : 'txt-lightgray'">
                                    <span class="fs-12">¥</span><span class="fs-17">{{dish.originalPrice | currency}}</span>
                                </span>
                            </div>
                            <template v-if="dish.stock">
                                <button v-if="dish.sku || !dIndex" class="sku-btn" @click="selectSKU(dish)">选规格<span v-if="dish.quantity" class="quantity">{{dish.quantity}}</span></button>
                                <v-dish-add-reduce class="add-reduce" v-else :dish="dish" :type="1"></v-dish-add-reduce>
                            </template>
                            <div v-else class="sell-out-icon">
                                <img src="../assets/dish/icon_sell_out.png" />
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
        </div>

        <v-shopcart @save="$router.push('order')" :type="5">选好了</v-shopcart>
        <v-dishsku ref="dishsku" :type="3"></v-dishsku>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import $ from 'jquery';
    import pinyin from '../utils/pinyin';
    import { serialize } from '../utils';

    export default {
        data() {
            return {
                shopItemAll: [], //接口所有数据
                dishesTitlePosition: [], //菜品title的位置
                moving: false, //是否正在滑动
                lastIndex: 0, //滑动菜品时确定上一个菜品类别
                isShowCart: false, //购物车是否打开
                keywords: '',//搜索菜品,
                allDishes: [],//所有菜品
                thisDish: {}//选规格的菜品
            };
        },
        created() {
            this.$root.eventHub.$on('renderDishListQuantity', this.renderDishQuantity);

            //新增订单时，如果是扫码直接进入点餐页面，则存储扫码信息
            if(!this.order.orderId && !this.order.scan && this.scan.isScan) {
                this.order.scan = {
                    isScan: 1,
                    recommendType: this.scan.params.type,
                    recommendId: this.scan.params.recommendId
                };
                this._order(this.order);
            }

            this.keywords = this.custom.keywords;
            this.custom.keywords = ''; //清除菜品搜索关键字状态
            this.custom.isCommitOrder = false; //清除下单成功状态
            this.custom.qmsDiscount = 0;//每次到点菜页面重置全美食优惠优惠金额
            this._custom(this.custom);
            this.findShopItemAll();
        },
        computed: {
            ...mapGetters(['shopId', 'order', 'scan', 'custom']),
            cartList() {
                return this.order.dishes || [];
            }
        },
        methods: {
            ...mapActions(['_order', '_custom', '_ajax']),
            //请求数据
            findShopItemAll() {
                this._ajax({
                    name: 'findShopItemAll',
                    options: {
                        shopId: this.shopId
                    }
                }).then(res => {
                    this.shopItemAll = res.findShopItemAll;
                    this.handleShopItemAll();
                });
            },
            //处理数据
            handleShopItemAll() {
                let _this = this;

                this.shopItemAll.forEach(type => {
                    let childrenDish = 0;

                    this.$set(type, 'active', false);

                    type.items.forEach(dish => {
                        let visible = false;

                        this.$set(dish, 'quantity', 0);

                        //设置菜品是否显示
                        if(this.keywords.length) {
                            if(this.isMatching(dish.title)) {
                                visible = true;
                                childrenDish++;
                            }
                        } else {
                            visible = true;
                        }
                        this.$set(dish, 'visible', visible);

                        //设置菜品辣度
                        dish.pepperLevelArr = new Array(parseInt(dish.pepperLevel || 0));
                        this.allDishes.push(dish);
                    });

                    //设置类别是否显示
                    if(this.keywords.length) {
                        this.$set(type, 'visible', !!childrenDish);
                    } else {
                        this.$set(type, 'visible', true);
                    }
                });

                this.renderDishQuantity();

                //设置第一条类别高亮
                this.shopItemAll
                    .filter(item => {
                        return item.visible;
                    })
                    .forEach((item, index) => {
                        if(!index) {
                            item.active = true;
                        }
                    });

                //计算title的位置
                this.$nextTick(() => {
                    _this.dishesTitlePosition = [];
                    $('.sub-cat-list li.title').each(function() {
                        /* eslint-disable no-invalid-this */
                        _this.dishesTitlePosition.push(parseInt($(this).position().top));
                    });
                });
            },
            //从购物车数量修改点菜里列表数量
            renderDishQuantity() {
                this.allDishes.forEach(item => {
                    item.quantity = 0;
                });

                this.cartList.forEach(item => {
                    let index = this.allDishes.findIndex(item1 => item1.itemId == item.itemId);

                    if(index != -1) {
                        this.allDishes[index].quantity += item.quantity;
                    }
                });
            },
            //keywords检索
            isMatching(title) {
                let wording = this.keywords.toUpperCase().replace(/\s/g, '');

                return (
                    title.toUpperCase().indexOf(wording) != -1 ||
                    pinyin
                        .getFullChars(title)
                        .toUpperCase()
                        .indexOf(wording) != -1 ||
                    pinyin
                        .getCamelChars(title)
                        .toUpperCase()
                        .indexOf(wording) != -1
                );
            },
            //切换菜品类别
            changeType(type) {
                if(!this.moving) {
                    this.moving = true;

                    this.shopItemAll.forEach(item => {
                        item.active = false;
                    });
                    type.active = true;

                    let index = this.shopItemAll
                        .filter(item => {
                            return item.visible;
                        })
                        .findIndex(item => {
                            return item.categoryId == type.categoryId;
                        });

                    $('.sub-cat-list').stop(true, true).animate({
                        scrollTop: this.dishesTitlePosition[index] + 'px'
                    }, 200, () => {
                        this.moving = false;
                    });
                }
            },
            //滑动菜品
            scrollDishes() {
                if(!this.moving) {
                    let y = $('.sub-cat-list').scrollTop();
                    let index = this.getActiveIndex(y);

                    if(this.lastIndex != index) {
                        this.lastIndex = index;
                        this.shopItemAll.forEach(item => {
                            item.active = false;
                        });

                        this.shopItemAll.filter(item => {
                            return item.visible;
                        })[index].active = true;
                    }
                }
            },
            //滑动菜品时确定菜品分类
            getActiveIndex(y) {
                let index = 0;

                this.dishesTitlePosition.forEach((item, i) => {
                    if(y >= item) {
                        return !!(index = i);
                    }
                });
                return index;
            },
            //进入菜品详情
            viewDish(dish) {
                this.custom.dishId = dish.itemId;
                this._custom(this.custom);
                this.$router.push('dishdetail');
            },
            //清空菜品搜索关键字
            clearKeywords() {
                this.keywords = '';
                $('.sub-cat-list').stop(true, true).scrollTop(0);
                this.handleShopItemAll();
            },
            //选规格
            selectSKU(dish) {
                this.$refs.dishsku.open(serialize(dish));
            }
        }
    };
</script>

<style scoped lang="less">
    .pt {
        padding-top: 1.8rem;
    }

    .pb {
        padding-bottom: 1rem;
    }

    .footer {
        height: 1rem;
    }

    .search {
        position: absolute;
        width: 100%;
        top: 0.9rem;
        height: 0.9rem;
        padding: 0.12rem 0.14rem;
        border-bottom: 1px solid #e6e6e6;
        background-color: #f6f6f6;
        &-input {
            border-radius: 0.3rem;
            background: #fff;
            height: 100%;
            line-height: 0.62rem;
            border: 1px solid #eee;
            position: relative;
            .search-icon {
                width: 0.28rem;
                padding: 0.17rem;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
            }
            .search-keywords {
                padding: 0 0.62rem;
                background-color: transparent;
                width: 100%;
            }
            .clear-icon {
                width: 0.28rem;
                padding: 0.17rem;
                display: block;
                position: absolute;
                right: 0;
                top: 0;
            }
        }
    }

    .cat-list {
        background: #f6f6f6;
        float: left;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        width: 24%;
        height: 100%;
        text-align: left;
        padding-bottom: 0.5rem;
        li {
            background: #f6f6f6;
            border-bottom: 1px solid #eee;
            border-left: 0.04rem solid #f6f6f6;
            color: #666;
            font-size: 0.26rem;
            padding-left: 0.4rem;
            padding: 0.3rem 0.2rem;
            line-height: 155%;
            word-break: break-all;
            img {
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.12rem;
            }
            &.active {
                background-color: #fff;
                color: #fd5615;
                border-left: 0.04rem solid #fd5615;
            }
        }
    }

    .sub-cat-list {
        background: #fff;
        float: right;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        width: 76%;
        text-align: left;
        height: 100%;
        li {
            margin-left: 0.3rem;
            padding: 0.3rem 0;
            border-bottom: 1px solid #eee;
            position: relative;
            &.title {
                padding-top: 0;
                padding: 0 0.14rem;
                color: #999;
                background: #f6f6f6;
                margin-left: 0.08rem;
                margin-top: -1px;
                border-bottom: none;
                border-top: 1px solid #eee;
                height: 0.4rem;
                line-height: 0.4rem;
                font-size: 0.24rem;
            }
            &.sell-out:before {
                content: '';
                display: block;
                height: 100%;
                position: absolute;
                top: 0;
                left: -0.3rem;
                right: 0;
                z-index: 1;
            }
            .commodityPic {
                float: left;
                width: 1.4rem;
                height: 1.4rem;
                border-radius: 0.08rem;
                overflow: hidden;
                img {
                    height: 100%;
                }
            }
            .commodityContentShow {
                margin-left: 1.56rem;
                position: relative;
                .line1 {
                    font-size: 0.3rem;
                    font-weight: bold;
                }
                .line2 {
                    padding-top: 0.1rem;
                    font-size: 0.22rem;
                    color: #999;
                }
                .line3 {
                    padding-top: 0.15rem;
                    font-size: 0.2rem;
                    span {
                        margin-right: 0.1rem;
                        &.green {
                            border: 1px solid #43d57d;
                            border-radius: 0.04rem;
                            color: #43d57d;
                            padding: 0 0.04rem;
                        }
                        &.orange {
                            border: 1px solid #fd5615;
                            border-radius: 0.04rem;
                            color: #fd5615;
                            padding: 0 0.04rem;
                        }
                    }
                }
                .line4 {
                    padding-top: 0.1rem;
                    img {
                        width: 0.24rem;
                    }
                }
                .line5 {
                    padding-top: 0.1rem;
                    font-size: 0.24rem;
                    color: #999;
                }
                .line6 {
                    padding-top: 0.1rem;
                }
                .sell-out-icon {
                    width: 0.86rem;
                    height: 0.86rem;
                    position: absolute;
                    top: 0.29rem;
                    right: 0.28rem;
                    overflow: hidden;
                }
                .add-reduce {
                    position: absolute;
                    right: 0.28rem;
                    top: 0.82rem;
                }
                .sku-btn {
                    color: #fff;
                    background-color: #fd5615;
                    border-radius: 1rem;
                    position: absolute;
                    right: 0.28rem;
                    top: 0.9rem;
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
            }
        }
    }

    .add-animate {
        position: fixed;
        width: 0.34rem;
        height: 0.34rem;
        border-radius: 0.6rem;
        z-index: 1000;
        background: #fd5615;
    }

    .txt-animate {
        position: fixed;
        color: #fd5615;
        z-index: 1000;
        left: 1.6rem;
        bottom: -0.4rem;
    }
</style>