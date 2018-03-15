<template>
    <div>
        <div class="mask" v-if="isShowQmsPacket"></div>
        <div class="payment" :class="{showFlag: isShowQmsPacket}">
            <img src="../assets/payment/img_redpacket.png" />
            <span class="money">
                <span>{{discount | currency}}</span>元</span>
            <span class="msg">恭喜您获得优惠{{discount | currency}}元</span>
            <a href="javascript:void(0)" class="ok" @click="useQmsPacket">立即抵用</a>
            <span class="close" @click="unuseQmsPacket">
                <img src="../assets/payment/icon_close.png" />
            </span>
        </div>
    </div>
</template>

<script>
    import { calculatePrice, formatPrice } from '../utils';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                isShowQmsPacket: false //是否显示全美食优惠
            };
        },
        props: ['discount'],
        created() {
            if(!this.order.isUsedQmsPacket && calculatePrice(this.discount)) {
                setTimeout(() => {
                    this.isShowQmsPacket = true;
                }, 500);
            }
        },
        computed: {
            ...mapGetters(['custom', 'order'])
        },
        methods: {
            ...mapActions(['_custom']),
            //不使用全美食优惠
            unuseQmsPacket() {
                this.isShowQmsPacket = false;
                this.custom.qmsDiscount = 0;
                this._custom(this.custom);
            },
            //使用全美食优惠
            useQmsPacket() {
                this.isShowQmsPacket = false;
                this.custom.qmsDiscount = calculatePrice(this.discount);
                this._custom(this.custom);
                if(this.custom.qmsDiscount) {
                    this.msg('已使用红包，共帮您节省¥' + formatPrice(this.custom.qmsDiscount));
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .down {
        transition: all 1s ease;
        opacity: 1;
    }

    .payment {
        position: absolute;
        top: 0%;
        z-index: 101;
        font-size: 0.3rem;
        transform: translateY(-100%);
        transition: all 0.5s ease;
        .money {
            position: absolute;
            top: 5.5rem;
            font-size: 1rem;
            color: #f03738;
            font-weight: bold;
            left: 50%;
            transform: translate(-50%, -120%) rotate(-4deg);
        }
        .msg {
            position: absolute;
            top: 7.1rem;
            left: 50%;
            transform: translate(-50%);
            color: #fff;
            text-align: center;
            line-height: 1.5;
        }
        .ok {
            position: absolute;
            top: 7.8rem;
            left: 50%;
            transform: translate(-50%);
            color: #f03738;
            font-size: 0.42rem;
            background: ~"url('../assets/payment/img_btn.png') no-repeat 100% 100%/100% 100%";
            width: 4rem;
            height: 1.4rem;
            line-height: 1.15rem;
            text-align: center;
            font-weight: bold;
        }
        .close {
            width: 0.7rem;
            height: 0.7rem;
            display: block;
            position: absolute;
            right: 1rem;
            top: 1.9rem;
        }
    }

    .showFlag {
        transform: translateY(0);
    }
</style>