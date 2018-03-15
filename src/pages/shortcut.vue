<template>
    <div class="pt">
        <v-head-sam class="header">
            <div class="h-soc">
                <router-link to='shopsearch'><img src="../assets/common/icon_search.png" />餐厅名称、地点、菜名</router-link>
            </div>
        </v-head-sam>
        <v-district :selecter="classifyItem"></v-district>
        <div class="content">
            <v-shop-list></v-shop-list>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                classifyItem: {}
            };
        },
        created() {
            this.classifyItem = JSON.parse(this.$route.query.classifyItem);
        }
    };
</script>

<style scoped lang="less">
    .pt {
        padding-top: 1.72rem;
    }

    .header {
        z-index: 103;
    }

    .content {
        background: #fff;
    }

    .h-soc {
        width: 5.4rem;
        height: 0.5rem;
        background: #f2f2f2;
        padding: 0;
        background-size: 13px 13px;
        border-radius: 20px;
        text-align: left;
        line-height: 0.5rem;
        font-size: 0.28rem;
        text-indent: 0.4rem;
        color: #a7a7a7;
        position: absolute;
        left: 13%;
        top: 0.2rem;
        img {
            display: inline-block;
            width: 0.24rem;
            margin-right: 0.1rem;
        }
        a {
            color: #888;
        }
    }
</style>