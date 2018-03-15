<template>
    <div>
        <div class="box-h type">
            <div class="current txt-lightgray" @click="togglePop(1)" :class="{active: currentCircle == 1}">
                <span>{{typeNames[0] | maxlength}}</span>
            </div>
            <div class="txt-lightgray" @click="togglePop(2)" :class="{active: currentCircle == 2}">
                <span>{{typeNames[1] | maxlength}}</span>
            </div>
            <div class="txt-lightgray" @click="togglePop(3)" :class="{active: currentCircle == 3}">
                <span>{{typeNames[2] | maxlength}}</span>
            </div>
        </div>

        <transition name="slide">
            <div class="pop-list" v-if="isPopOpen">
                <transition name="slide">
                    <div v-show="currentCircle == 1" class="pop1 pop">
                        <ul class="popScroll" @touchmove.self.stop.prevent>
                            <li v-for="(item, index) in circleList.shopType" @click="filterCircle1(item, index)" :class="{active: shopTypeActive == index}">
                                <span class="name">{{item.name}}</span>
                            </li>
                        </ul>
                        <div class="fold" @click="isPopOpen = false">收起</div>
                    </div>
                </transition>
                <transition name="slide">
                    <div v-show="currentCircle == 2" class="pop2 pop">
                        <div class="popScroll">
                            <ul class="list" @touchmove.self.stop.prevent>
                                <li v-for="(item, index) in circleList.tradingArea" @click="selectCircle2(item, index)" :class="{active: tradingAreaActive == index}">
                                    <span class="name">{{item.name}}</span>
                                </li>
                            </ul>
                            <ul class="detail" @touchmove.self.stop.prevent>
                                <li v-for="(item, index) in tempCircle2" class="ellipsis" @click="filterCircle2(item, index)" :class="{active: tempCircle2Active == index}">
                                    <span class="name">{{item.businessCirclName}}</span>
                                    <span class="right">{{item.shopNum}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="fold" @click="isPopOpen = false">收起</div>
                    </div>
                </transition>
                <transition name="slide">
                    <div v-show="currentCircle == 3" class="pop3 pop">
                        <ul class="popScroll" @touchmove.self.stop.prevent>
                            <li v-for="(item, index) in circleList.inteSort" @click="filterCircle3(item, index)" :class="{active: inteSortActive == index}">
                                <span class="name">{{item.name}}</span>
                            </li>
                        </ul>
                        <div class="fold" @click="isPopOpen = false">收起</div>
                    </div>
                </transition>
            </div>
        </transition>
        <div class="mask" v-if="isPopOpen" @click.self="isPopOpen = false" @touchmove.self.stop.prevent></div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                circleList: {}, //商圈
                currentCircle: 0, //打开商家|商圈|智能排序
                isPopOpen: false, //是否打开筛选
                isTransOpen: false, //是否打开筛选(动画样式)
                extParam: { //店铺筛选条件
                    category: '',
                    businessCirclId: '',
                    districtId: '',
                    count: 0 //触发extParam的watch
                },
                tempCircle2: [], //子商圈过滤
                typeNames: ['全部商家', '全部商圈', '智能排序'],
                sortParam: ['distance', 'verifyDate', 'likeSize', 'price_asc', 'price_desc'],
                shopTypeActive: 0, //选中的商家
                tradingAreaActive: 0, //选中的商圈
                tempCircle2Active: 0, //选中的子商圈
                inteSortActive: 0 //选中的排序
            };
        },
        props: ['selecter'],
        created() {
            if(this.selecter && Object.keys(this.selecter).length) {
                Object.assign(this.extParam, this.selecter);
                this.extParam.count++;
            } else {
                setTimeout(() => {
                    this.$root.eventHub.$emit('sendExtParam', this.extParam); //Hub触发事件
                }, 0);
            }
            this.reqCircleList(this.selecter);
        },
        filters: {
            maxlength(item) {
                if(item.length > 4) {
                    item = item.substr(0, 4) + '...';
                }
                return item + ' ';
            }
        },
        computed: {
            ...mapGetters(['lbsInfo'])
        },
        watch: {
            lbsInfo() {
                this.extParam.count++;
            },
            isPopOpen() {
                if(!this.isPopOpen) {
                    this.currentCircle = 0;
                }
            },
            extParam: {
                'handler': function() {
                    this.isPopOpen = false;
                    this.$root.eventHub.$emit('sendExtParam', this.extParam); //Hub触发事件
                    this.reqCircleList();
                },
                deep: true
            }
        },
        methods: {
            ...mapActions(['_ajax']),
            //商圈分类 selecter上一个页面的查询参数
            reqCircleList(selecter) {
                this._ajax({
                    name: 'shopCircle',
                    options: {
                        cityId: this.lbsInfo.adcode
                    }
                }).then(res => {
                    this.circleList = res.info;
                    this.circleList.inteSort.forEach((item, index) => {
                        item.sort = this.sortParam[index];
                    });

                    if(selecter) {
                        if(selecter.category) {
                            this.circleList.shopType.filter((item, index) => {
                                if(item.code == selecter.category) {
                                    this.shopTypeActive = index;
                                    this.$set(this.typeNames, 0, item.name);
                                }
                            });
                        } else {
                            this.circleList.inteSort.filter((item, index) => {
                                if(item.sort == selecter.sort) {
                                    this.inteSortActive = index;
                                    this.$set(this.typeNames, 2, item.name);
                                }
                            });
                        }
                    }
                });
            },
            //打开关闭弹出层
            togglePop(index) {
                if(this.isPopOpen) {
                    if(this.currentCircle == index) {
                        this.isPopOpen = false;
                    } else {
                        this.currentCircle = index;
                    }
                } else {
                    this.isPopOpen = true;
                    this.currentCircle = index;
                }
            },
            //全部商家过滤
            filterCircle1(item, index) {
                this.shopTypeActive = index;

                if(index) {
                    this.extParam.category = item.code;
                } else {
                    this.extParam.category = '';
                }
                this.$set(this.typeNames, 0, item.name);
                this.extParam.count++;
            },
            //全部商圈筛选
            selectCircle2(item, index) {
                if(this.tradingAreaActive != index) {
                    this.tempCircle2Active = -1;
                    this.tradingAreaActive = index;
                }

                if(index) {
                    this.tempCircle2 = item.businessCircls;
                } else {
                    this.tempCircle2 = [];
                    this.extParam.districtId = '';
                    this.extParam.businessCirclId = '';
                    this.$set(this.typeNames, 1, item.name);
                    this.extParam.count++;
                }
            },
            //子商圈过滤
            filterCircle2(item, index) {
                this.tempCircle2Active = index;

                if(index) {
                    this.extParam.businessCirclId = item.id;
                    this.extParam.districtId = '';
                } else {
                    this.extParam.businessCirclId = '';
                    this.extParam.districtId = item.id;
                }
                this.$set(this.typeNames, 1, item.businessCirclName);
                this.extParam.count++;
            },
            //智能排序
            filterCircle3(item, index) {
                this.inteSortActive = index;

                this.extParam.sort = item.sort;
                this.$set(this.typeNames, 2, item.name);
                this.extParam.count++;
            }
        }
    };
</script>

<style lang="less" scoped>
    .type {
        width: 100%;
        font-size: 0.24rem;
        border-bottom: 1px solid #eee;
        position: absolute;
        z-index: 102;
        top: 0.9rem;
        > div {
            width: 33%;
            -webkit-box-flex: 1;
            text-align: center;
            height: 0.82rem;
            line-height: 0.82rem;
            background: #fff;
            span:after {
                content: '';
                background: url('../assets/common/icon_downward.png') no-repeat;
                background-size: 100%;
                width: 0.2rem;
                height: 0.2rem;
                display: inline-block;
                margin-left: 0.2rem;
            }
            &.active span {
                color: #fd5615;
                &:after {
                    background: url('../assets/common/icon_downward_orange.png') no-repeat;
                    background-size: 100%;
                    width: 0.2rem;
                    height: 0.2rem;
                    transform: rotate(180deg);
                }
            }
        }
    }

    .pop-list {
        position: absolute;
        z-index: 101;
        width: 100%;
        top: 1.72rem;
        .pop {
            width: 100%;
            background: #fff;
            overflow: auto !important;
            .popScroll {
                max-height: 6rem;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
                li {
                    border-bottom: 1px solid #eee;
                    position: relative;
                    height: 0.8rem;
                    line-height: 0.8rem;
                    padding-left: 0.64rem;
                    &.active {
                        color: #fd5615;
                    }
                }
            }
            .fold {
                text-align: center;
                background: #ccc;
                height: 0.6rem;
                line-height: 0.6rem;
            }
        }
        .pop2 > div {
            height: 6rem;
            background: #f5f5f5;
            -webkit-box-align: stretch;
            ul {
                float: left;
                -webkit-overflow-scrolling: touch;
                height: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                float: left;
                -webkit-overflow-scrolling: touch;
                height: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                &.list {
                    width: 34%;
                    background: #fff;
                    li {
                        padding-left: 20%;
                        border-right: 1px solid #eee;
                        &.active {
                            background: #f5f5f5;
                            color: #fd5615;
                            border-right: none;
                        }
                    }
                }
                &.detail {
                    width: 66%;
                    li {
                        padding: 0 0.2rem;
                        border-bottom: 1px solid #eee;
                        padding-left: 13%;
                    }
                }
            }
        }
    }

    .slide-enter-active,
    .slide-leave {
        transition: all 0.5s;
        transform: translateY(0);
    }

    .slide-enter,
    .slide-leave-active {
        transform: translateY(-100%);
    }
</style>