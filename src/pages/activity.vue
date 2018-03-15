<template>
    <div class="pt">
        <v-head-com>店铺活动</v-head-com>
        <section class="content home">
            <ul>
                <li v-for="item in list" v-on:click="goToNextPage(item.id,item.type)" v-bind:class="item.status==1 ? '' : 'isShowRed'">
                    <a href="javascript:void(0);" class="addCss box-h">
                        <img v-if="item.type==2" src="../assets/common/icon_redpacket.png" />
                        <img v-else src="../assets/common/icon_sale.png" />
                        <div>
                            <span>{{item.title}}</span><br />
                        </div>
                    </a>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                list: []
            };
        },
        created() {
            this.getList();
            /* 获取活动列表  */
        },
        computed: {
            ...mapGetters(['shopId'])
        },
        methods: {
            ...mapActions(['_shopId', '_activityId', '_ajax']),
            getList() {
                this._ajax({
                    name: 'activityList',
                    options: {
                        shopId: this.shopId
                    }
                }).then(res => {
                    this.list = res.shopRedPackageList;
                });
            },
            goToNextPage(activityId, type) {
                this._activityId(activityId);
                if(type == 2) {
                    this.$router.push('benefit');
                } else {
                    this.$router.push('buying');
                }

            }
        }
    };
</script>

<style scoped>
    .home ul {
        background: #fff;
    }

    .home ul li {
        position: relative;
        padding: 0.4rem 0.28rem;
        border-bottom: 1px solid #ccc;
    }

    .home ul img {
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 50%;
    }

    .home li div {
        -webkit-box-flex: 1;
        padding-left: 0.4rem;
    }

    .addCss {
        color: #333;
    }

    .isShowRed:before {
        content: '';
        width: 0.24rem;
        height: 0.24rem;
        background: red;
        display: block;
        position: absolute;
        left: 1.1rem;
        top: 0.36rem;
        border-radius: 0.4rem;
        border: 2px solid #fff;
    }
</style>