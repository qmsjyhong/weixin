<template>
    <div>
        <div class="popup-mask" @click="cancleBtn"></div>
        <div class="popup-wrapper">
            <img src="../assets/redpool/img_redpacket_delete.png" />
            <div>
                <span class="main-text">确定清空所有消息？</span>
                <div class="btns multi">
                    <a class="btn" v-on:click="cancleBtn">取消</a>
                    <a class="btn" v-on:click="clearBtn">确定</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'popupClear',
        data() {
            return {

            };
        },
        methods: {
            clearBtn() {
                this.$emit('on-clear');
            },
            cancleBtn() {
                this.$emit('on-cancle');
            }
        }
    };
</script>

<style scoped>
    .popup-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 101;
        top: 0;
    }

    .popup-wrapper {
        background: #fff;
        width: 300px;
        max-width: 80%;
        left: 50%;
        position: fixed;
        top: 50%;
        border-radius: 0.3rem;
        box-sizing: border-box;
        z-index: 102;
        transform: translate(-50%, -50%);
    }

    img {
        width: 100%;
        vertical-align: middle;
        box-sizing: border-box;
    }

    .popup-wrapper .main-text {
        font-size: 16px;
        display: block;
        text-align: center;
        line-height: 26px;
        padding: 24px 0px;
    }

    .popup-wrapper .btns {
        width: 100%;
        display: table;
        box-sizing: border-box;
        font-size: 18px;
    }

    .popup-wrapper .btns .btn:last-child {
        color: #fd5615;
        border-left: 1px solid #eee;
    }

    .popup-wrapper .btns .btn {
        display: table-cell;
        width: 50%;
        text-align: center;
        border-top: 1px #ddd solid;
        background: none;
        padding: 20px 0px;
    }
</style>