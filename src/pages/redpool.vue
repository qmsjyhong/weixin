<template>
    <div class="pt">
        <v-head-sam>我的红包<img slot="extend" v-on:click="allDelete" src="../assets/redpool/icon_clear.png" /></v-head-sam>
        <section class="content">
            <div v-if="!list.length" class="noneDate">
                <img src="../assets/redpool/bg_redpacket_empty.png" />
                <p>无红包记录</p>
            </div>
            <ul class="list">
                <li class="box-h" v-for="item in list" v-on:click="goToRedList(item.shop_id)">
                    <img v-bind:src="item.logo" />
                    <div class="flex1">
                        <div class="line1">
                            <span class="fs-16 bold shopName ellipsis">{{item.shop_name}}</span>
                            <span class="right time">{{item.create_date}}</span>
                        </div>
                        <div class="line2">
                            <span>{{item.title}}</span>
                            <span v-if="item.status==1?false:true" class="count right"></span>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
        <v-popup-clear v-if="this.isDelete" v-on:on-clear="clearBtn" v-on:on-cancle="cancleBtn"></v-popup-clear>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                list: [],
                isDelete: false
            };
        },
        created() {
            /* 首页红包列表 */
            this.getRedPool();
        },
        methods: {
            ...mapActions(['_shopId', '_ajax']),
            getRedPool() {
                this._ajax({
                    name: 'homeRed'
                }).then(res => {
                    if(res.shopRedPackageList) {
                        this.list = res.shopRedPackageList.info;
                    }
                });
            },
            allDelete() {
                if(this.list.length > 0) {
                    this.isDelete = true;
                }
            },
            clearBtn() {
                this._ajax({
                    name: 'homeRedDel'
                }).then(res => {
                    if(res.shopRedPackageList.type == 2) {
                        this.list = [];
                        this.isDelete = false;
                        this.msg(res.shopRedPackageList.info);
                    } else {
                        this.isDelete = false;
                        this.msg(res.shopRedPackageList.info);
                    }
                });
            },
            cancleBtn() {
                this.isDelete = false;
            },
            goToRedList(shopId) {
                this._shopId(shopId);
                this.$router.push('redpoollist');
            }
        }
    };
</script>

<style scoped>
    .list {
        background: #fff;
    }

    .list li {
        padding: 0.2rem 0.28rem;
        border-bottom: 1px solid #eee;
    }

    .list img {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 0.06rem;
        margin-right: 0.28rem;
    }

    .flex1 {
        -webkit-box-flex: 1;
    }

    .list .line1 {
        padding-bottom: 0.28rem;
        position: relative;
    }

    .list .line1 .shopName {
        padding-right: 1.54rem;
    }

    .list .line1 .time {
        position: absolute;
        right: 0;
        top: 0;
    }

    .list .count {
        min-width: 0.28rem;
        height: 0.28rem;
        background: #fd5615;
        color: #fff !important;
        right: -0.1rem;
        top: 0rem;
        border-radius: 50%;
        text-align: center;
        line-height: 0.4rem;
        font-size: 0.26rem;
        /*padding: 0.02rem;*/
    }

    .noneDate {
        height: 100%;
        text-align: center;
    }

    .noneDate img {
        width: 1.8rem;
        margin-top: 30%;
    }

    .noneDate p {
        text-align: center;
        color: #999;
        font-size: 0.4rem;
        height: 1rem;
        line-height: 1rem;
        margin-bottom: 10%;
    }
</style>