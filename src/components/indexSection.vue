<template>
    <li class="v-index-sec">
        <p class="v-index-sec-title">{{ index }}</p>
        <ul>
            <slot></slot>
        </ul>
    </li>
</template>

<style scoped lang="less">
    .v-index-sec {
        &-title {
            font-size: 0.32rem;
            height: 0.7rem;
            line-height: 0.7rem;
            box-sizing: border-box;
            padding: 0 0 0 0.3rem;
            background-color: transparent;
            font-weight: bold;
        }
    }
</style>

<script>
    export default {
        name: 'index-section',

        props: {
            index: {
                type: '',
                required: true
            }
        },

        mounted() {
            this.$parent.sections.push(this);
        },

        beforeDestroy() {
            let index = this.$parent.sections.indexOf(this);

            if(index > -1) {
                this.$parent.sections.splice(index, 1);
            }
        }
    };
</script>