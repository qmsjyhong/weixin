<template>
    <div class="pt">
        <v-head-sam>
            {{shopDetail.shopName}}
            <img v-if="collectionSrc" src="../assets/shophome/icon_collection_orange.png" slot="extend" @click="collection" />
            <img v-else src="../assets/shophome/icon_collection.png" slot="extend" @click="collection" />
        </v-head-sam>
        <div class="content">
            <v-banner id="banner" :banner="banners" :large="true">
                <ul ref="barrage" class="barrage-list" :style="{transform: 'translateY(' + barrage.top+ 'px)'}">
                    <li v-if="item.comment" v-for="(item, index) in res.commentShopBarrageList" class="barrage">
                        <div class="b-wrap" :style="{opacity: item.opacity}">
                            <img v-if="item.pic_url" class="b-img" :src="item.pic_url" />
                            <img v-else class="b-img" src="../assets/mine/icon_head.png" />
                            <div class="b-txt">{{item.comment}}</div>
                        </div>
                    </li>
                </ul>
            </v-banner>
            <div class="shopMsg">
                <div class="title">
                    {{shopDetail.shopName}}
                    <span class="p-active" v-if="shopDetail.platformRedNum" @click="isShowPActive = true">活动店铺</span>
                </div>
                <div class="evaluationPrices">
                    <span>{{shopDetail.cateringTypeName}}</span>
                    <span class="txt-lightgray">人均<span>{{shopDetail.avg_money | currency}}元</span>
                    </span>

                    <div class="isLikeMany active" :class="{active2:userLikeShopFlag}" @click="likeMany">
                        <img v-if="!userLikeShopFlag" src="../assets/common/icon_praise_orange.png" alt="点赞" />
                        <img v-else src="../assets/common/icon_fabulous.png" />
                        <span class="praise_count">{{shopDetail.likeSize}}人</span>
                    </div>
                </div>
                <div class="businessHours">
                    <span>营业时间</span>
                    <span>{{shopDetail.businessStart}}—{{isTomorrow ? '次日' : ''}}{{shopDetail.businessEnd}}
                    </span>
                </div>
            </div>
            <div class="shopAddress">
                <div class="addressDetail">
                    <img class="address" src="../assets/shophome/icon_position.png" />
                    <p class="ellipsis" @click="showMap">
                        <span class="fs-12">{{shopDetail.address}}</span>
                    </p>
                </div>
                <div class="shopTel">
                    <a class="sysPhone" :href="'tel:' + shopDetail.tel">
                        <img src="../assets/shophome/icon_phone.png">
                        <span class="txt-black">电话</span>
                    </a>
                </div>
            </div>
            <div class="active-container" v-if="isShowActive" @click="activity">
                <div class="active">
                    <span class="icon">活动</span>
                </div>
                <div class="active-wrapper" :style="{top}">
                    <div v-for="(item, index) in shopActivity" :key="index">
                        <div class="item">{{item.title}}</div>
                    </div>
                </div>
            </div>
            <div class="shopComment">
                <router-link tag="div" to="shopcomment" class="commentWarp">
                    <span class="evaluate-count">用户评价（{{shopDetail.comment_sum || 0}}人）</span>
                    <v-stars class="shop-star" :number="shopDetail.comment_rating"></v-stars>
                    <span class="comments">
                        <img src="../assets/common/icon_right_arrow.png" />
                    </span>
                </router-link>
            </div>
            <div class="item-padding evaluate-item">
                <div v-for="item in res.commentShopSsummaryList" class="item">{{item.comment_tag_name}}</div>
            </div>
            <div class="recommendDishes">
                <div class="panelHeader">
                    <img src="../assets/shophome/icon_recommend.png" />
                    <span class="title">推荐菜品</span>
                </div>
                <div class="swiper-container dishes-wrapper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item, index) in shopRecommendList" :key="index" @click="openDishView(index)">
                            <span class="hot">HOT</span>
                            <img :src="item.icon + (item.icon.indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize,m_fixed,h_100,w_100'" />
                            <div class="name ellipsis">{{item.title}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="businessDetail">
                <div class="panelHeader">
                    <span class="title">商家简介</span>
                </div>
                <div class="merchantDescription">
                    <p v-html="shopDetail.shopBriefDescription"></p>
                </div>
            </div>
            <div class="businessInformation">
                <div class="panelHeader">
                    <span class="title">店铺详情</span>
                </div>
                <div class="content">
                    <div class="informationItem" v-html="shopDetail.shopDetailDescription"></div>
                </div>
            </div>
            <div class="ordering" @click="onKeyMeal">
                <img src="../assets/shophome/icon_order.png" />
            </div>
        </div>
        <div class="footer" v-if="isShowOperation">
            <div class="flex operation">
                <div class="item" @click="onLineMeal">
                    <img src="../assets/shophome/icon_online.png" />
                    <div>在线点餐</div>
                </div>
                <div class="item" @click="scanMeal">
                    <img src="../assets/shophome/icon_scan.png" />
                    <div>扫码点餐</div>
                </div>
                <div class="item" @click="scanMealTest">
                    <img src="../assets/shophome/icon_scan.png" />
                    <div>扫码点餐测试</div>
                </div>
            </div>
        </div>
        <div class="mask" v-if="isShowPActive"></div>

        <div class="alert-wrapper" v-if="isShowPActive">
            <div class="alert-header">该店铺支持全美食平台活动</div>
            <div class="alert-content">
                <p>1. 本店支持平台当前红包活动；</p>
                <p>2. 消费结算时，将自动计算最优惠红包使用；</p>
                <p>3. 每个红包只能使用一次；</p>
                <p>4. 最终解释权归全美食所有。</p>
            </div>
            <div class="alert-footer" @click="isShowPActive = false">关闭</div>
        </div>

        <v-large-view ref="largeView"></v-large-view>
        <v-dish-view ref="dishView"></v-dish-view>
        <div class="mask" v-if="isShowOperation" @click="isShowOperation = false"></div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { dirPath, getParams } from '../utils';
    import Swiper from 'swiper';

    export default {
        data() {
            return {
                res: {
                    //接口数据
                    commentShopBarrageList: [], //弹幕list
                    commentShopSsummaryList: [] //评价标签数量统计
                },
                banners: [], //banner
                shopDetail: {}, //店铺详情
                shopActivity: [], //店铺活动
                shopRecommendList: [], //推荐菜品
                packageTypeNum: 0, //大于0有套餐，否则直接跳转传统点餐
                shareInfo: {}, //分享
                activeIndex: 0, //店铺活动第n个活动
                isShowPActive: false, //是否显示平台活动描述
                isShowOperation: false, //是否显示点餐面板
                isTomorrow: false,//时间跨天
                barrage: {
                    top: 0,
                    el: null,
                    height: 0,
                    bannerH: 0
                }
            };
        },
        created() {
            if(this.$route.query.shopId) {
                this._shopId(this.$route.query.shopId);
            }
            if(!this.shopId) {
                this.$router.push('index');
                return;
            }

            this.getBanner();
            this.getShopInfo();
        },
        computed: {
            ...mapGetters(['session', 'shopId', 'custom', 'order']),
            //是否已经点赞
            userLikeShopFlag() {
                return this.shopDetail.userLikeShopFlag == 1;
            },
            //是否显示活动
            isShowActive() {
                return Boolean(this.shopActivity && this.shopActivity.length);
            },
            //收藏图片路径
            collectionSrc() {
                return this.shopDetail.userCollectShopFlag != 4;
            },
            top() {
                return -this.activeIndex * 0.92 + 'rem';
            }
        },
        methods: {
            ...mapActions(['_order', '_shopId', '_shopName', '_custom', '_ajax']),
            //获取banner
            getBanner() {
                this._ajax({
                    name: 'shopBanner',
                    options: {
                        shopId: this.shopId
                    }
                }).then(res => {
                    this.banners = res.info;
                });
            },
            //获取shop信息
            getShopInfo() {
                this._ajax({
                    name: 'shopInfo',
                    options: {
                        shopId: this.shopId
                    }
                }).then(res => {
                    this.res = res.getShopInfoAndItemType;
                    res.getShopInfoAndItemType.commentShopBarrageList.forEach(item => {
                        item.opacity = 1;
                    });
                    this.shopDetail = res.getShopInfoAndItemType.shopInfo;
                    this.shopActivity = res.getShopInfoAndItemType.shopRedPackageList;
                    this.packageTypeNum = res.getShopInfoAndItemType.packageTypeNum;
                    this.shopRecommendList = res.getShopInfoAndItemType.shopRecommendList;
                    this.shareInfo = res.getShopInfoAndItemType.shareInfo;

                    let start = parseInt(this.shopDetail.businessStart.split(':')[0]) * 60 + parseInt(this.shopDetail.businessStart.split(':')[1]);
                    let end = parseInt(this.shopDetail.businessEnd.split(':')[0]) * 60 + parseInt(this.shopDetail.businessEnd.split(':')[1]);

                    this.isTomorrow = start >= end;

                    this.browser().isWeixin && this.wxshare();
                    this._shopName(this.shopDetail.shopName);

                    if(this.shopActivity.length) {
                        setInterval(() => {
                            if(this.activeIndex < this.shopActivity.length - 1) {
                                this.activeIndex += 1;
                            } else {
                                this.activeIndex = 0;
                            }
                        }, 3000);
                    }

                    this.$nextTick(() => {
                        this.barrage.el = this.$refs.barrage;
                        this.barrage.barrageH = this.$refs.barrage.offsetHeight;
                        this.barrage.bannerH = document.getElementById('banner').offsetHeight;
                        this.barrage.top = document.getElementById('banner').offsetHeight;
                        requestAnimationFrame(this.aniFrame);
                    });

                    this.$nextTick(() => {
                        setTimeout(() => {
                            new Swiper('.dishes-wrapper', {
                                slidesPerView: 4,
                                paginationClickable: true,
                                spaceBetween: 4
                            });
                        }, 100);
                    });
                });
            },
            //点赞
            likeMany() {
                if(!this.session) {
                    this.$router.push('login');
                    return false;
                }
                if(this.shopDetail.userLikeShopFlag == 1) {
                    this._ajax({
                        name: 'likeDel',
                        options: {
                            shopId: this.shopId
                        }
                    }).then(res => {
                        this.shopDetail.likeSize = res.deleteUserLikeShop.likeSize;
                        this.shopDetail.userLikeShopFlag = 0;
                    });
                } else {
                    this._ajax({
                        name: 'likeAdd',
                        options: {
                            shopId: this.shopId
                        }
                    }).then(res => {
                        this.shopDetail.likeSize = res.addUserLikeShop.likeSize;
                        this.shopDetail.userLikeShopFlag = 1;
                    });
                }
            },
            //点餐
            onKeyMeal() {
                let flag = 0;//只有在线点餐

                this.storeCustom();
                if(flag) {
                    this.onLineMeal();
                } else {
                    this.isShowOperation = true;
                }
            },
            storeCustom() {
                this.custom.qmsDiscount = 0;
                this._custom(this.custom);
            },
            //扫码点餐
            scanMeal() {
                window.wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                    success: res => {
                        if(dirPath() + '/scan/index.html' != res.resultStr.split('?')[0]) {
                            this.msg('请扫描全美食二维码!');
                        } else {
                            let params = getParams(res.resultStr);

                            this._ajax({
                                name: 'collectShopByScanQR',
                                options: {
                                    shopId: this.shopId,
                                    scanId: params.qrCodeId,
                                    scanType: params.type
                                }
                            }).then(res2 => {
                                let order = {
                                    scan: {
                                        isScan: 1,
                                        recommendType: params.type,
                                        recommendId: res2.tableId
                                    },
                                    dishes: this.order.dishes
                                };

                                this._order(order);
                                this.$router.push('alldishes');
                            });
                        }
                    }
                });
            },
            scanMealTest() {
                let res = { resultStr: 'https://app-dev.qms888.com/wechat/scan/index.html?type=3&qrCodeId=eV@-PlgGEaBnkbl5BBBxrR1wv0QJXW4L' };
                let params = getParams(res.resultStr);

                this._ajax({
                    name: 'collectShopByScanQR',
                    options: {
                        shopId: this.shopId,
                        scanId: params.qrCodeId,
                        scanType: params.type
                    }
                }).then(res2 => {
                    let order = {
                        scan: {
                            isScan: 1,
                            recommendType: params.type,
                            recommendId: res2.tableId
                        },
                        dishes: this.order.dishes
                    };

                    this._order(order);
                    this.$router.push('alldishes');
                });
            },
            //在线点餐
            onLineMeal() {
                let order = { scan: { isScan: 0 }, dishes: this.order.dishes };

                this._order(order);
                this.$router.push('alldishes');
            },
            //地图
            showMap() {
                window.location.href = 'http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:' + this.shopDetail.lat + ',' + this.shopDetail.lng + ';title:' + this.shopDetail.shopName + ';addr:' + this.shopDetail.address + '&key=PWNBZ-455KF-27PJL-JJFJ3-IWO23-MBFPN&referer=qms';
            },
            //收藏
            collection() {
                if(!this.session) {
                    this.$router.push('login');
                    return false;
                }

                if(
                    this.shopDetail.userCollectShopFlag == 2 ||
                    this.shopDetail.userCollectShopFlag == 3
                ) {
                    this.msg('绑定用户不能取消收藏');
                    return;
                }

                this._ajax({
                    name: 'favoriteAction',
                    options: {
                        shopId: this.shopId,
                        userCollectShopFlag: this.shopDetail.userCollectShopFlag
                    }
                }).then(res => {
                    this.shopDetail.userCollectShopFlag = res.saveShopTable.type;
                    this.msg(res.saveShopTable.info);
                });
            },
            //微信分享
            wxshare() {
                window.wx.showOptionMenu();
                // 分享给朋友
                window.wx.onMenuShareAppMessage({
                    imgUrl: this.shareInfo.imagePath,
                    link: this.shareInfo.url,
                    title: this.shareInfo.title,
                    desc: this.shareInfo.text
                });
                // 分享到朋友圈
                window.wx.onMenuShareTimeline({
                    imgUrl: this.shareInfo.imagePath,
                    link: this.shareInfo.url,
                    title: this.shareInfo.title + ',' + this.shareInfo.text
                });
            },
            //查看推荐菜品大图
            openDishView(index) {
                let viewList = this.shopRecommendList.map(item => {
                    return {
                        src: item.icon,
                        name: item.title,
                        price: item.original_price
                    };
                });

                this.$refs.dishView.open(viewList, index);
            },
            //预览大图
            openLargeView(index) {
                let viewList = this.banners.map(item => {
                    return {
                        src: item.picUrl,
                        name: ''
                    };
                });

                this.$refs.largeView.open(viewList, index);
            },
            //活动列表
            activity() {
                if(!this.session) {
                    this.$router.push("login");
                } else {
                    this.$router.push("activity");
                }
            },
            //滚动弹幕
            aniFrame() {
                for(let i = 0; i < this.barrage.el.children.length; i++) {
                    if(this.barrage.el.children[i].getBoundingClientRect().top < 50) {
                        this.res.commentShopBarrageList[i].opacity -= 0.02;
                    }
                }
                this.barrage.top -= 1;
                if(this.barrage.top < -this.barrage.barrageH) {
                    this.barrage.top = this.barrage.bannerH;
                    this.res.commentShopBarrageList.forEach(item => {
                        item.opacity = 1;
                    });
                }
                requestAnimationFrame(this.aniFrame);
            }
        }
    };
</script>

<style scoped lang="less">
    .content {
        background: #f4f4f4;
    }

    .shopMsg {
        padding: 0.3rem 0.28rem;
        border-bottom: 1px solid #eee;
        background: #fff;
        position: relative;
        .title {
            color: #333;
            font-size: 0.32rem;
            width: 100%;
            .p-active {
                background: #ffeeef;
                color: #ff5c60;
                border: 1px solid #ffadaf;
                border-radius: 0.08rem;
                display: inline-block;
                padding: 0 0.06rem;
                height: 0.32rem;
                line-height: 0.32rem;
                font-size: 0.24rem;
            }
        }
        .evaluationPrices {
            padding: 0.16rem 0 0.23rem;
            height: 0.32rem;
            font-size: 0.24rem;
            color: #999;
            position: relative;
            span {
                padding-right: 0.05rem;
                vertical-align: middle;
            }
            .isLikeMany {
                position: absolute;
                right: 0;
                top: 0;
                height: 0.32rem;
                line-height: 0.32rem;
                text-align: right;
                color: #fd5615;
                img {
                    width: 0.32rem;
                    height: 0.32rem;
                }
            }
        }
        .businessHours {
            padding-top: 0.23rem;
            font-size: 0.24rem;
            color: #fd5615;
            font-weight: 500;
            span {
                padding-right: 0.1rem;
            }
        }
    }

    .shopAddress {
        padding: 0.2rem 0.28rem;
        position: relative;
        color: #333;
        background: #fff;
        .addressDetail {
            position: relative;
            height: 0.6rem;
            width: 5.6rem;
            left: 0;
            top: 0;
            .address {
                position: absolute;
                width: 0.24rem;
                height: 0.3rem;
                left: 0;
                top: 0.16rem;
            }
            p {
                padding-left: 0.42rem;
                line-height: 0.6rem;
            }
        }
        .shopTel {
            width: 0.7rem;
            height: 0.6rem;
            position: absolute;
            border-left: 1px solid #eee;
            right: 0.28rem;
            top: 0.2rem;
            .sysPhone {
                width: 0.6rem;
                height: 0.6rem;
                position: absolute;
                right: 0;
                top: -0.1rem;
                img {
                    width: 0.3rem;
                    height: 0.32rem;
                    position: absolute;
                    left: 0.2rem;
                    top: 0.1rem;
                }
                span {
                    position: absolute;
                    width: 0.4rem;
                    bottom: -0.1rem;
                    display: block;
                    right: 0;
                    font-size: 0.18rem;
                }
            }
        }
    }

    .shopComment {
        margin-top: 0.15rem;
        background: #fff;
        position: relative;
        .commentWarp {
            padding: 0 0.28rem;
            height: 0.8rem;
            .evaluate-count {
                position: absolute;
                top: 0.25rem;
                height: 0.3rem;
                line-height: 0.3rem;
                color: #333;
                font-size: 0.26rem;
            }
            .shop-star {
                height: 0.3rem;
                line-height: 0.3rem;
                width: 1.8rem;
                position: absolute;
                right: 0.5rem;
                top: 0.25rem;
            }
            .comments {
                position: absolute;
                top: 0.22rem;
                right: 0.28rem;
                img {
                    width: 0.16rem;
                    height: 0.32rem;
                }
            }
        }
    }

    .active-container {
        padding-left: 1.2rem;
        height: 0.92rem;
        overflow: hidden;
        position: relative;
        background: #fff5f3;
        border-top: 1px dashed #ddd;
        border-bottom: 1px solid #ddd;
        margin-top: -1px;
        .item {
            height: 0.92rem;
            line-height: 0.92rem;
        }
        .active {
            position: absolute;
            left: 0;
            text-align: center;
            width: 1.2rem;
            .icon {
                line-height: 0.92rem;
                border-radius: 109px;
                background: #ff7575;
                color: #fff;
                padding: 0.08rem 0.1rem;
                font-size: 0.24rem;
            }
        }
        .active-wrapper {
            position: relative;
            transition: top 0.5s ease-out;
        }
    }

    .evaluate-item {
        border-top: 1px solid #eee;
        padding: 0.18rem 0.08rem 0.18rem 0.28rem;
        background: #fff;
        .item {
            margin: 0.1rem 0;
            margin-right: 0.2rem;
            padding: 0 0.16rem;
            height: 0.4rem;
            line-height: 0.4rem;
            display: inline-block;
            border: 1px solid #ddd;
            border-radius: 0.2rem;
            color: #999;
            font-size: 0.22rem;
            text-align: center;
            background: #fff;
        }
    }

    .recommendDishes {
        padding: 0.3rem 0.28rem;
        margin-bottom: 0.15rem;
        overflow: hidden;
        background: #fff;
        .panelHeader {
            margin-bottom: 0.18rem;
            img {
                width: 0.3rem;
                height: 0.26rem;
            }
            .title {
                font-size: 0.26rem;
                vertical-align: middle;
            }
        }
        .dishes-wrapper {
            height: 1.6rem;
            .hot {
                display: block;
                width: 0.7rem;
                height: 0.3rem;
                line-height: 0.3rem;
                position: absolute;
                text-align: center;
                left: 0;
                top: 0;
                font-size: 0.2rem;
                color: #fff;
                background-color: #fd5615;
                border-bottom-right-radius: 0.05rem;
                z-index: 2;
            }
            img {
                width: 1.6rem;
                height: 1.6rem;
                position: relative;
            }
            .name {
                width: 100%;
                position: absolute;
                bottom: 0;
                height: 0.36rem;
                text-align: center;
                font-size: 0.24rem;
                line-height: 0.36rem;
                background-color: #000000;
                opacity: 0.6;
                color: #fefefe;
            }
        }
    }

    .businessDetail,
    .businessInformation {
        padding: 0.3rem 0.28rem;
        background: #fff;
        .panelHeader {
            margin-bottom: 0.18rem;
            .title {
                font-size: 0.26rem;
            }
        }
    }

    .businessDetail {
        border-bottom: 1px solid #eee;
        .merchantDescription {
            p {
                font-size: 0.24rem;
                line-height: 0.4rem;
            }
        }
    }

    .businessInformation {
        .informationItem {
            padding: 0.05rem 0;
            background-color: #fff;
        }
    }

    .ordering {
        position: fixed;
        width: 1.5rem;
        height: 1.5rem;
        bottom: 1rem;
        right: 0;
        z-index: 3;
        img {
            width: 1.5rem;
            height: 1.5rem;
        }
    }

    .footer {
        height: 3rem;
        background-color: #fff;
        z-index: 101;
        .operation {
            justify-content: space-between;
            padding: 0.6rem 1.5rem 0.78rem;
            height: 100%;
            .item {
                -webkit-box-flex: 1;
                text-align: center;
                color: #333;
                font-size: 0.26rem;
                font-weight: bolder;
                img {
                    width: 1.3rem;
                    height: 1.3rem;
                    padding-bottom: 0.2rem;
                }
            }
        }
    }
    .alert-wrapper {
        position: fixed;
        top: 50%;
        left: 50%;
        background: #fff;
        z-index: 101;
        transform: translate(-50%, -50%);
        width: 265px;
        border-radius: 15px;
        .alert-header,
        .alert-footer {
            text-align: center;
            font-size: 15px;
        }
        .alert-header {
            height: 53px;
            line-height: 53px;
            border-bottom: 1px solid #ddd;
        }
        .alert-footer {
            height: 45px;
            line-height: 45px;
            color: #999;
            border-top: 1px solid #ddd;
        }
        .alert-content {
            font-size: 14px;
            padding: 14px 30px;
            color: #666;
            line-height: 155%;
            p {
                padding-left: 15px;
                text-indent: -15px;
            }
        }
    }

    .barrage-list {
        position: absolute;
        width: 60%;
        top: 0;
        right: 0;
    }

    .barrage {
        text-align: right;
        padding-right: 0.28rem;
        .b-wrap {
            background-color: rgba(0, 0, 0, 0.8);
            display: inline-block;
            border-radius: 0.3rem;
            padding: 0.1rem;
            margin: 0.1rem 0;
            position: relative;
            .b-img {
                width: 0.5rem;
                height: 0.5rem;
                border-radius: 50%;
                margin-right: 0.1rem;
                position: absolute;
                left: 0.1rem;
                min-height: 0.5rem !important;
            }
            .b-txt {
                padding: 0.06rem 0.06rem 0.06rem 0.6rem;
                line-height: 160%;
                text-align: left;
                max-width: 3.75rem;
                font-size: 0.24rem;
                color: #fff;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                word-break: break-word;
            }
        }
    }
</style>