<template>
    <div class="pt" :class="{'bg-white': errorType}">
        <v-home :isRedPointShow="isRedPointShow">{{errorType == 2 ? '未知' : city}}</v-home>
        <template v-if="!errorType">
            <v-district v-show="isShowCircle" @extParam="getSearchExtParam"></v-district>
            <div class="content" @scroll="scrollScreen" @touchmove.self.stop.prevent>
                <v-banner :banner="banners"></v-banner>
                <div class="middle-menu">
                    <ul class="clearfix">
                        <li v-for="(item, index) in shopClassify" @click="reqShopSort(item)" :key="index">
                            <img :src="item.icon" />
                            <p class="fs-12">{{item.name}}</p>
                        </li>
                    </ul>
                </div>
                <div class="activity flex">
                    <router-link tag="div" to="homexsqg"><img src="../assets/home/img_activity_seckill.png" /></router-link>
                    <router-link tag="div" to="homehbshop"><img src="../assets/home/img_activity_redpacket.png" /></router-link>
                </div>
                <v-shop-list from="home" id="shopList"></v-shop-list>
            </div>

            <div class="mask" v-if="isShowPRedPacket"></div>
            <div class="p-redpacket" :class="{showFlag: isShowPRedPacket}">
                <div class="relative">
                    <img src="http://qms.oss-cn-beijing.aliyuncs.com/PlatformRed/img_redpacket.png" />
                    <button class="ok" @click="download">下载APP 立领红包</button>
                    <div class="close" @click="closeRedpacket">
                        <img src="../assets/payment/icon_close.png" />
                    </div>
                </div>
            </div>
        </template>
        <div v-else-if="errorType == 1" class="city-without-shop">
            <img src="../assets/blank/img_city.png" />
            <div class="notes1">当前城市还没有商家入驻</div>
            <p class="notes2">商家入驻服务热线</p><br />
            <span class="phone">400 645 5888</span>
        </div>
        <div v-else-if="errorType == 2" class="no-location">
            <img src="../assets/blank/img_location.png" />
            <div class="notes1">定位失败</div>
            <button class="reload" @click="reload">重新加载</button>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    import { serialize } from '../utils';
    import shopIcon1 from '../assets/home/icon_shop_type1.png';
    import shopIcon2 from '../assets/home/icon_shop_type2.png';
    import shopIcon3 from '../assets/home/icon_shop_type3.png';
    import shopIcon4 from '../assets/home/icon_shop_type4.png';
    import shopIcon5 from '../assets/home/icon_shop_type5.png';
    import shopIcon6 from '../assets/home/icon_shop_type6.png';
    import shopIcon7 from '../assets/home/icon_shop_type7.png';
    import shopIcon8 from '../assets/home/icon_shop_type8.png';
    import shopIcon9 from '../assets/home/icon_shop_type9.png';
    import shopIcon10 from '../assets/home/icon_shop_type10.png';

    export default {
        data() {
            return {
                banners: [], //banner
                shopClassify: [], //店铺分类
                shareInfo: {}, //分享
                icons: [shopIcon1, shopIcon2, shopIcon3, shopIcon4, shopIcon5, shopIcon6, shopIcon7, shopIcon8, shopIcon9, shopIcon10],
                classifyItem: {}, //店铺分类参数
                isShowCircle: false, //是否显示商圈分类
                extParam: {},
                isShowPRedPacket: false, //是否显示平台红包
                isRedPointShow: false, //是否显示红包红点
                errorType: 0, //0正常 1无开拓城市 2定位失败
                offsetTop: window.screen.width / 360 * 455 //店铺列表距离页面顶部高度(默认ios6下默认455px)
            };
        },
        created() {
            let tempLbsInfo = this.lbsInfo || window.htp.lbs;

            this._lbsInfo(tempLbsInfo);

            this.getBanner();
            this.shopSort();
            this.homeRedUnread();
            this.custom.pRedpacket && this.getPRedPacket();

            if(this.lbsInfo.dummy) {
                let myCity = new window.qq.maps.Geolocation('PWNBZ-455KF-27PJL-JJFJ3-IWO23-MBFPN', 'qms');

                myCity.getLocation(pos => {
                    if(!pos.city) {
                        return;
                    }
                    let mstr = pos.adcode.toString().split('');

                    mstr[4] = '0';
                    mstr[5] = '0';
                    this.lbsInfo.adcode = mstr.join('');
                    this.lbsInfo.city = pos.city;
                    this.lbsInfo.lat = pos.lat;
                    this.lbsInfo.lng = pos.lng;
                    this.lbsInfo.dummy = false;
                    this._lbsInfo(this.lbsInfo);
                    this._ajax({
                        name: 'cityList'
                    }).then(res => {
                        if(!res.findCityAll.filter(item => item.cityId == this.lbsInfo.adcode).length) {
                            this.errorType = 1;
                        }
                    });
                }, () => {
                    this.errorType = 2;
                }, { timeout: 10000 });
            } else {
                this._ajax({
                    name: 'cityList'
                }).then(res => {
                    if(!res.findCityAll.filter(item => item.cityId == this.lbsInfo.adcode).length) {
                        this.errorType = 1;
                    }
                });
            }

            this._order({});
        },
        computed: {
            ...mapGetters(['lbsInfo', 'custom']),
            city() {
                let y = this.lbsInfo.city || '';

                y = y.length > 3 ? y.substr(0, 3) + '...' : y;
                return y;
            }
        },
        methods: {
            ...mapActions(['_lbsInfo', '_custom', '_install', '_ajax', '_order']),
            //红包红点
            homeRedUnread() {
                this._ajax({
                    name: 'homeRedUnread'
                }).then(res => {
                    //status 1.无红点 2.有红点
                    if(res.redInfo && res.redInfo.redNum && res.redInfo.redNum > 0) {
                        this.isRedPointShow = true;
                    }
                });
            },
            //平台红包
            getPRedPacket() {
                this._ajax({
                    name: 'pRedPacket'
                }).then(res => {
                    //0.掉落平台红包 1.不掉落平台红包
                    if(res.isActivity == 0) {
                        setTimeout(() => {
                            this.isShowPRedPacket = true;
                        }, 500);
                    }
                });
            },
            //首页banner
            getBanner() {
                this._ajax({
                    name: 'banner'
                }).then(res => {
                    this.banners = res.info;
                    this.shareInfo = res.shareInfo;
                    this.browser().isWeixin && this.wxshare();
                });
            },
            //店铺分类
            shopSort() {
                this._ajax({
                    name: 'shopSele'
                }).then(res => {
                    this.shopClassify = res.info;
                    this.shopClassify.forEach((item, index) => {
                        item.icon = this.icons[index];
                        if(item.code == 'item_001') {
                            item.sort = 'likeSize';
                        } else if(item.code == 'item_002') {
                            item.sort = 'verifyDate';
                        } else {
                            item.category = item.code;
                        }
                    });
                });
            },
            //进入店铺分类
            reqShopSort(item) {
                item = serialize(item);
                delete item.code;
                delete item.icon;
                delete item.name;
                delete item.verifyDate;
                this.$router.push('shortcut?classifyItem=' + JSON.stringify(item));
            },
            //微信分享
            wxshare() {
                window.wx.showOptionMenu();
                // 分享给朋友
                window.wx.onMenuShareAppMessage({
                    'imgUrl': this.shareInfo.imagePath,
                    'link': this.shareInfo.url,
                    'title': this.shareInfo.title,
                    'desc': this.shareInfo.text
                });
                // 分享到朋友圈
                window.wx.onMenuShareTimeline({
                    'imgUrl': this.shareInfo.imagePath,
                    'link': this.shareInfo.url,
                    'title': this.shareInfo.title + ',' + this.shareInfo.text
                });
            },
            //下载app
            download() {
                this.custom.download = false;
                this._custom(this.custom);
                //下载安装
                this._install();
            },
            //滚动屏幕计算是否显示商圈分类
            scrollScreen(e) {
                if(e.target.scrollTop > this.offsetTop) {
                    this.isShowCircle = true;
                } else {
                    this.isShowCircle = false;
                }
            },
            getSearchExtParam(item) {
                this.extParam = item;
            },
            //关闭平台红包
            closeRedpacket() {
                this.isShowPRedPacket = false;
                this.custom.pRedpacket = false;
                this._custom(this.custom);
            },
            reload() {
                window.location.reload();
            }
        }
    };
</script>

<style lang="less" scoped>
    .middle-menu {
        background: #fff;
        padding: 0.27rem 0.2rem;
        li {
            width: 20%;
            margin: 0.18rem 0;
            float: left;
            text-align: center;
            p {
                text-align: center;
                margin-top: 0.12rem;
            }
            img {
                width: 0.68rem;
                height: 0.68rem;
            }
        }
    }

    .mask {
        z-index: 102;
    }

    .p-redpacket {
        position: absolute;
        top: 0%;
        z-index: 102;
        width: 80%;
        left: 10%;
        font-size: 0.3rem;
        transform: translateY(-100%);
        transition: all 0.5s ease;
        top: 0;
        margin-top: 0;
        &.showFlag {
            transform: translateY(0);
            top: 50%;
            margin-top: -50%;
        }
        .ok {
            position: absolute;
            bottom: 0.1rem;
            left: 50%;
            transform: translate(-50%);
            background: #fff974;
            border-radius: 0.8rem;
            color: #f03738;
            font-size: 0.34rem;
            font-weight: bold;
            width: 3.73rem;
            height: 0.8rem;
            line-height: 0.8rem;
        }
        .close {
            width: 0.68rem;
            height: 0.68rem;
            display: block;
            position: absolute;
            right: 0.2rem;
            top: -0.5rem;
            z-index: 102;
        }
    }

    .bg-white {
        background: #fff;
        height: 100%;
        overflow: auto;
        padding-bottom: 1rem;
    }

    .city-without-shop {
        padding-top: 3.26rem;
        text-align: center;
        img {
            width: 3.84rem;
            height: 3.4rem;
        }
        .notes1 {
            font-size: 0.3rem;
            margin-top: 0.51rem;
            color: #999;
        }
        .notes2 {
            font-size: 0.24rem;
            padding-top: 0.9rem;
            color: #999;
        }
        .phone {
            font-size: 0.36rem;
            padding-top: 0.25rem;
            color: #fd5817;
        }
    }

    .no-location {
        padding-top: 3.26rem;
        text-align: center;
        img {
            width: 3.84rem;
            height: 3.4rem;
        }
        .notes1 {
            font-size: 0.3rem;
            margin-top: 0.51rem;
            color: #999;
        }
        .reload {
            background: #fd5615;
            width: 2.6rem;
            height: 0.7rem;
            line-height: 0.7rem;
            color: #fff;
            font-size: 0.3rem;
            border-radius: 5rem;
            margin-top: 0.91rem;
        }
    }

    .activity {
        padding: 0 0.16rem;
        div {
            padding: 0.16rem 0.08rem;
        }
    }
</style>