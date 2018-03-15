<template>
    <div>
        <div class="title" v-html="title"></div>
        <ul>
            <li class="clearfix" v-for="(item, index) in list" @click="change(index)">
                <div :class="{'selected': selectedIndex == index}">
                    <span>{{item}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedIndex: 0
            };
        },
        props: ['list', 'title'],
        methods: {
            change(index) {
                this.selectedIndex = index;
                this.$emit('update:index', index);
            }
        }
    };
</script>

<style scoped lang="less">
    .title {
        padding: 0.22rem 0.28rem;
        color: #999;
        font-size: 0.24rem;
        background-color: #fafafa;
    }
    li {
        padding: 0.28rem;
        background-color: #fff;
        font-size: 0.24rem;
        padding: 0.34rem 0.28rem;
        border-bottom: 1px solid #eee;
        div {
            height: 0.38rem;
            line-height: 0.38rem;
            background: #fff url('../assets/common/icon_radio_unselected.png') no-repeat right;
            background-size: 0.38rem 0.38rem;
            &.selected {
                background: #fff url('../assets/common/icon_radio_selected.png') no-repeat right;
                background-size: 0.38rem 0.38rem;
            }
        }
    }
</style>