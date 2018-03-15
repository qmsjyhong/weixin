<template>
    <div class="dish-view" v-if="isShowLargeView" @click="close">
        <div class="dish-view-container">
            <div class="swiper-container swiper-large-view">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="item in viewList">
                        <img :src="item.src + (item.src.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_mfit,w_260,h_260'" />
                        <div class="detail">
                            <div class="title">{{viewList[viewIndex].name}}</div>
                            <div class="price">￥{{viewList[viewIndex].price | currency}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="close-btn">
            <img @click="close" src="../assets/common/icon_close1.png" />
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

                this.viewList = viewList;
                this.viewIndex = viewIndex;
                this.isShowLargeView = true;
                this.$nextTick(() => {
                    this.mySwiper = new Swiper('.swiper-large-view', {
                        initialSlide: _this.viewIndex || 0,
                        slidesPerView: 1,
                        paginationClickable: true,
                        loop: true,
                        autoplayDisableOnInteraction: false,
                        autoplay: 3000,
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
    };
</script>

<style scoped lang="less">
    .dish-view {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 101;
        background: rgba(0, 0, 0, 0.7);
        box-sizing: bordrer-box;
        &-container {
            width: 5.6rem;
            height: 6.4rem;
            position: absolute;
            bottom: 3rem;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 0.06rem;
            overflow: hidden;
            background: #eee;
            padding: 0.2rem;
            .swiper-container {
                border-radius: 0.06rem;
                overflow: hidden;
                .swiper-slide {
                    position: relative;
                    img {
                        width: 5.2rem;
                        height: 5.2rem;
                        border-radius: 0.06rem;
                        background-color: #fff;
                    }
                    .detail {
                        height: 0.75rem;
                        font-size: 0.26rem;
                        .title {
                            position: absolute;
                            left: 0.3rem;
                            bottom: 0.22rem;
                            font-size: 0.26rem;
                        }
                        .price {
                            position: absolute;
                            right: 0.3rem;
                            bottom: 0.23rem;
                            font-size: 0.24rem;
                        }
                    }
                }
            }
        }
        .close-btn {
            width: 100%;
            height: 1rem;
            position: absolute;
            left: 0;
            bottom: 1.5rem;
            box-sizing: content-box;
            text-align: center;
            img {
                width: 0.75rem;
                height: 0.75rem;
            }
        }
    }
</style>