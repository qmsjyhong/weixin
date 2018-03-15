<template>
    <div class="pb">
        <section class="content">
            <div class="success-msg">
                <div class="success">
                    <p class="fs-18">抢购成功!</p>
                    <p class="fs-16">请尽快进店体验</p>
                </div>
                <p class="validate-code hidden">请到前台凭此号码验证：
                    <span></span>
                </p>
            </div>

            <div class="commodity-info">
                <h4 class="title fs-16">{{info.title}}</h4>
                <p class="price fs-24">
                    <em>¥{{info.price | currency}}</em>
                    <em>限时抢购</em>
                </p>
                <p class="cur-price">原价：
                    <em>¥{{info.old_price | currency}}</em>
                </p>
            </div>
            <div class="buying-tips">
                {{info.directions}}
            </div>
            <div class="about-shop">
                <h4 class="title fs-14 ellipsis">{{info.shop_name}}</h4>
                <p>地址：{{info.address}}</p>
                <p>电话：{{info.tel}}</p>
                <router-link class="shopShow" to="shophome" v-on:click="_shopId(this.info.shop_id)">
                    <span>浏览店铺</span>
                </router-link>
            </div>
        </section>
        <div class="footer fs-18">
            <router-link to="orderdetail" v-on:click.native="_install">下载App</router-link>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    export default {
        data() {
            return {
                info: {}
            };
        },
        created() {
            /* 获取支付成功信息  */
            this.showInfo();
        },
        computed: {
            ...mapGetters(['paysucId'])
        },
        methods: {
            ...mapActions(['_shopId', '_install', '_ajax']),
            showInfo() {
                this._ajax({
                    name: 'limitedBuyShow',
                    options: {
                        id: this.paysucId
                    }
                }).then(res => {
                    this.info = res.limitedBuyUser;
                });
            }
        }
    };
</script>

<style scoped>
    .success-msg {
        padding: 0.84rem 0 1.2rem;
        text-align: center;
        background: #fff;
        margin-bottom: 0.28rem;
    }

    .success-msg .success {
        display: inline-block;
        padding: 0.12rem 0 0.12rem 1.4rem;
        background-image: url(../assets/buying/icon_success.png);
        background-repeat: no-repeat;
        background-size: 1rem 1rem;
    }

    .success-msg .success > :first-child {
        color: #fe3501;
        text-align: left;
    }

    .success-msg .success p {
        line-height: 0.4rem;
    }

    .success-msg .validate-code {
        margin-top: 0.68rem;
        color: #464646;
        font-size: 0.3rem;
        text-align: center;
    }

    .success-msg .validate-code span {
        font-weight: normal;
        color: #fe3501;
    }

    .commodity-info {
        padding: 0.28rem 0.28rem 0.2rem;
        background: #fff;
    }

    .commodity-info .title {
        width: auto;
        font-weight: 700;
        color: #303030;
        margin-bottom: 0.12rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        word-wrap: break-word;
    }

    .commodity-info .price {
        margin-bottom: 0.08rem;
        color: #fe4413;
        vertical-align: middle;
    }

    .commodity-info .price em {
        margin-left: -0.08rem;
        font-style: normal;
        vertical-align: middle;
    }

    .commodity-info .price em:last-child {
        color: #fff;
        font-size: 0.24rem;
        line-height: 0.34rem;
        padding: 0 0.04rem;
        background: #fe4413;
        margin-left: 0.08rem;
    }

    .buying-tips {
        border-top: 1px solid #e8e8e8;
        margin-bottom: 0.28rem;
        padding: 0.2rem 0.28rem 0.36rem;
        background: #fff;
        border-top: 1px solid #eee;
        line-height: 0.36rem;
        font-size: 0.26rem;
    }

    .about-shop {
        padding: 0.36rem 0.28rem;
        color: #6d6d6d;
        background: #fff;
    }

    .about-shop .title {
        font-weight: 700;
        color: #444;
        line-height: 0.4rem;
    }

    .about-shop p {
        line-height: 0.4rem;
    }

    .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fe3501;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
    }

    .footer a {
        display: block;
        width: 100%;
        color: #fff;
    }

    .shopShow {
        display: block;
        width: 1.2rem;
        text-align: center;
        color: #fe3501;
        padding: 0.1rem 0.22rem;
        margin-top: 0.26rem;
        border: 1px solid #fe9371;
        border-radius: 0.06rem 0.06rem;
        background: #fff;
        font-size: 0.26rem;
    }
</style>