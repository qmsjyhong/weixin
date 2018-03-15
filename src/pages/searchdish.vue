<template>
    <div class="pt pb">
        <v-head-com>搜索菜品</v-head-com>
        <div class="search">
            <div class="search-input">
                <img class="search-icon" src="../assets/common/icon_search.png" />
                <input class="search-keywords" type="text" maxlength="10" v-model="keywords" placeholder="请输入菜品名称" />
                <img v-if="keywords" @click="keywords = ''" class="clear-icon" src="../assets/common/icon_clear.png" />
            </div>
            <button @click="search()" class="search-btn">搜索</button>
        </div>
        <div class="content">
            <div class="title">
                <img src="../assets/dish/icon_history.png" /><span>历史搜索</span>
            </div>
            <ul class="list" v-if="searchHistory.length">
                <li v-for="item in searchHistory" @click="search(item)">{{item}}</li>
            </ul>
        </div>
        <div class="footer">
            <button class="clear-his" @click="clearHistory">清除历史记录</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                keywords: ''
            };
        },
        computed: {
            ...mapGetters(['custom', 'searchHistory'])
        },
        methods: {
            ...mapActions(['_custom', '_searchHistory']),
            search(keywords) {
                if(keywords == null) {
                    if(!this.keywords.replace(/(^\s*)|(\s*$)/g, '').length) {
                        return false;
                    }
                    this.keywords = this.keywords.replace(/(^\s*)|(\s*$)/g, '');

                    let index = this.searchHistory.indexOf(this.keywords);

                    if(index != -1) {
                        this.searchHistory.splice(index, 1);
                    }
                    this.searchHistory.unshift(this.keywords);

                    if(this.searchHistory.length > 10) {
                        this.searchHistory.pop();
                    }

                    this.custom.keywords = this.keywords;
                } else {
                    this.custom.keywords = keywords;
                }

                this._custom(this.custom);
                this._searchHistory(this.searchHistory);
                this.$router.go(-1);
            },
            clearHistory() {
                this._searchHistory('');
            }
        }
    };
</script>

<style scoped lang="less">
    .pt {
        padding-top: 1.8rem;
    }

    .pb {
        padding-bottom: 1.5rem;
    }

    .content {
        background-color: #fff;
    }

    .footer {
        height: 1.5rem;
        background-color: #fff;
    }

    .search {
        position: absolute;
        width: 100%;
        top: 0.9rem;
        height: 0.9rem;
        padding: 0.12rem 1.42rem 0.12rem 0.2rem;
        border-bottom: 1px solid #e6e6e6;
        background-color: #f6f6f6;
        &-input {
            border-radius: 0.3rem;
            background: #fff;
            height: 100%;
            line-height: 0.62rem;
            border: 1px solid #eee;
            position: relative;
            .search-icon {
                width: 0.28rem;
                padding: 0.17rem;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
            }
            .search-keywords {
                background: transparent;
                width: 100%;
                padding: 0 0.62rem;
            }
            .clear-icon {
                width: 0.28rem;
                padding: 0.17rem;
                display: block;
                position: absolute;
                right: 0;
                top: 0;
            }
        }
        &-btn {
            position: absolute;
            right: 0;
            top: 0;
            color: #fd5615;
            font-size: 0.3rem;
            background: transparent;
            width: 1.42rem;
            height: 0.9rem;
        }
    }

    .title {
        color: #999;
        font-size: 0.26rem;
        padding: 0.6rem 0.38rem 0.26rem 0.38rem;
        border-bottom: 1px solid #e6e6e6;
        img {
            width: 0.28rem;
            height: 0.28rem;
        }
    }

    .list li {
        padding: 0.28rem 0.38rem;
        border-bottom: 1px solid #e6e6e6;
        color: #4d4d4d;
        font-size: 0.3rem;
    }

    .clear-his {
        width: 3.6rem;
        height: 0.7rem;
        background-color: #eee;
        margin: 0 auto;
        display: block;
        margin-top: 0.2rem;
        font-size: 0.26rem;
        color: #999;
    }
</style>