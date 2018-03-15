<template>
    <div class="large-view" v-if="isShowLargeView">
        <div class="swiper-container swiper-large-view" @click="close">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in viewList" :class="{'single-pic': isSingle}">
                    <div>
                        <img :src="item.src" />
                    </div>
                </div>
            </div>
            <div class="desc">
                <span class="dish-name">{{viewList[viewIndex].name}}</span><br />
                <span v-if="!single">{{viewIndex + 1}}/{{viewList.length}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Swiper from 'swiper';

    export default {
        data() {
            return {
                viewIndex: 0, //当前显示第n个图
                viewList: [], //查看大图数据
                isShowLargeView: false, //是否显示大图
                iSingle: false, //是否展示单长图
                mySwiper: null
            };
        },
        props: ['single'], //是否展示单长图
        created() {
            this.isSingle = this.single; //注：直接使用props控制台报错
        },
        methods: {
            close() {
                this.isShowLargeView = false;
                this.mySwiper.destroy(false);
            },
            open(viewList, viewIndex) {
                let _this = this;

                if(viewList.length == 1) {
                    this.isSingle = true;
                }

                if(this.isSingle) {
                    this.viewList = viewList.slice(viewIndex, viewIndex + 1);
                    this.viewIndex = 0;
                } else {
                    this.viewList = viewList;
                    this.viewIndex = viewIndex;
                }
                this.isShowLargeView = true;
                if(!this.isSingle) {
                    this.$nextTick(() => {
                        this.mySwiper = new Swiper('.swiper-large-view', {
                            initialSlide: _this.viewIndex || 0,
                            slidesPerView: 1,
                            paginationClickable: true,
                            loop: true,
                            onSlideChangeStart(swiper) {
                                let i = swiper.activeIndex;

                                if(!i) {
                                    i = _this.viewList.length;
                                }
                                if(i > _this.viewList.length) {
                                    i = swiper.activeIndex % _this.viewList.length;
                                }
                                _this.viewIndex = i - 1;
                            }
                        });
                    });
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .large-view {
        .swiper-container {
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 101;
            background: rgba(0, 0, 0, 0.7);
            .swiper-slide {
                font-size: 18px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .desc {
            position: absolute;
            bottom: 1rem;
            text-align: center;
            color: #fff;
            width: 100%;
            z-index: 102;
            .dish-name {
                font-size: 0.32rem;
                line-height: 0.8rem;
            }
        }
        .single-pic {
            width: 100%;
        }
    }
</style>