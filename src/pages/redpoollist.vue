<template>
    <div class="pt">
        <v-head-sam>我的红包<img slot="extend" v-on:click="allDelete" src="../assets/redpool/icon_clear.png" /></v-head-sam>
        <div class="content">
            <ul class="list" v-if="list.length">
                <router-link to="benefit" tag="li" class="box-h" v-for="(item,index) in list" v-bind:key="index" v-on:click.native="_activityId(item.red_id)">
                    <div class="redpacket-icon" :class="{'redpoint': item.status == 1 ? false : true}">
                        <img src="../assets/common/icon_redpacket.png" />
                    </div>
                    <span class="flex1">{{item.title}}</span>
                    <span>{{item.create_date}}</span>
                </router-link>
            </ul>
            <div v-else class="noneDate">
                <img src="../assets/redpool/bg_redpacket_empty.png" />
                <p>无红包记录</p>
            </div>
        </div>
        <v-popup-clear v-if="this.isDelete" v-on:on-clear="clearBtn" v-on:on-cancle="cancleBtn"></v-popup-clear>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                list: [],
                isDelete: false
            };
        },
        created() {
            /* 店铺红包列表 */
            this.getRedPoolList();
        },
        computed: {
            ...mapGetters(['shopId'])
        },
        methods: {
            ...mapActions(['_shopId', '_activityId', '_ajax']),
            getRedPoolList() {
                this._ajax({
                    name: 'homeRedList',
                    options: {
                        'shopId': this.shopId
                    }
                }).then(res => {
                    this.list = res.shopRedPackageList.info;
                });
            },
            allDelete() {
                if(this.list.length > 0) {
                    this.isDelete = true;
                }
            },
            clearBtn() {
                this._ajax({
                    name: 'homeRedListDel',
                    options: {
                        'shopId': this.shopId
                    }
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
            }
        }

    };
</script>

<style scoped lang="less">
    .list {
        background: #fff;
        li {
            padding: 0.36rem 0.28rem;
            border-bottom: 1px solid #eee;
            .redpacket-icon {
                position: relative;
                margin-right: 0.28rem;
                &.redpoint:after {
                    content: '';
                    width: 0.2rem;
                    height: 0.2rem;
                    background: red;
                    display: block;
                    position: absolute;
                    right: 0.05rem;
                    top: 0.05rem;
                    border-radius: 50%;
                    border: 2px solid #fff;
                }
                img {
                    border-radius: 1rem;
                    width: 1.2rem;
                    height: 1.2rem;
                }
            }
        }
    }

    .noneDate {
        height: 100%;
        text-align: center;
        img {
            width: 1.8rem;
            margin-top: 30%;
        }
        p {
            text-align: center;
            color: #999;
            font-size: 0.4rem;
            height: 1rem;
            line-height: 1rem;
            margin-bottom: 10%;
        }
    }
</style>