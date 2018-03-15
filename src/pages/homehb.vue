<template>
    <div class="pt">
        <v-head-com :hidehome="true" :hidemine="true">红包专区</v-head-com>
        <div class="content" :class="{empty: !list.length}">
            <ul v-if="list.length" class="list">
                <router-link v-for="item in list" class="item flex" to="benefit" tag="li" @click.native="_activityId(item.id)">
                    <div class="item-pic" :class="'icon-' + item.type"></div>
                    <div class="flex-auto ellipsis">{{item.title}}</div>
                    <div class="item-saleout" v-if="item.remainAmount <= 0">
                        <img src="../assets/redpacket/icon_sale_out.png" />
                    </div>
                </router-link>
            </ul>
            <div v-else class="empty-list">
                <img src="../assets/blank/img_common.png" />
                <p>这里空空如也，请稍后再来</p>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                list: [] //店铺下的红包列表
            };
        },
        created() {
            this.reqList();
        },
        computed: {
            ...mapGetters(['shopId'])
        },
        methods: {
            ...mapActions(['_activityId', '_ajax']),
            //限时抢购列表
            reqList() {
                this._ajax({
                    name: 'shopRedPackageList',
                    options: {
                        shopId: this.shopId,
                        flag: 1 //为了区分老接口，此接口会返回是否已经抢光
                    }
                }).then(res => {
                    this.list = res.shopRedPackageList;
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .empty {
        background: #fff;
    }

    .list {
        background: #fff;
        .item {
            border-bottom: 1px solid #eee;
            position: relative;
            padding: 0.35rem 0.28rem;
            justify-content: space-between;
            &-pic {
                width: 0.9rem;
                height: 0.9rem;
                border-radius: 50%;
                border: 1px solid #eee;
                margin-right: 0.26rem;
                flex: 0 0 auto;
                &.icon-1 {
                    background: url('../assets/redpacket/icon_red1.png') no-repeat;
                    background-size: 100%;
                }
                &.icon-2 {
                    background: url('../assets/redpacket/icon_red2.png') no-repeat;
                    background-size: 100%;
                }
                &.icon-3 {
                    background: url('../assets/redpacket/icon_red3.png') no-repeat;
                    background-size: 100%;
                }
            }
            &-saleout {
                position: relative;
                img {
                    width: 0.9rem;
                    height: 0.9rem;
                }
            }
        }
    }
</style>