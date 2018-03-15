<template>
    <div class="content">
        <v-head-com>选择城市</v-head-com>
        <header class="city-fun">
            <div class="v-search">
                <input @input="visible = Boolean(currentValue)" type="search" v-model.trim="currentValue" placeholder="输入城市名或者拼音查询" class="v-search-input" />
                <a class="v-search-fun fa fa-times-circle" @click="visible = false, currentValue = ''" v-show="visible"></a>
            </div>
            <section class="city-fun-loc" :class="{disable: su}" @click="loc">
                当前定位: {{lbs.city}}
            </section>
        </header>
        <section class="city-list">
            <mt-index-list>
                <v-index-section v-for="item in cityList" :index="item.letter">
                    <mt-cell v-for="c in item.list" :title="c.city" @click.native="locc(c)"></mt-cell>
                </v-index-section>
            </mt-index-list>
        </section>
    </div>
</template>

<script>
    import pinyin from '../utils/pinyin';
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                lbs: {
                    'adcode': '',
                    'city': '',
                    'lat': '',
                    'lng': ''
                },
                visible: false,
                currentValue: '',
                result: [],
                cityList: [],
                su: true
            };
        },
        created() {
            let _this = this;

            this._ajax({
                name: 'cityList',
                options: {}
            }).then(function(datas) {
                /* eslint-disable semi-spacing */
                for(let i = 0, len = datas.findCityAll.length; i < len; i++) {
                    datas.findCityAll[i].full = pinyin.getFullChars(datas.findCityAll[i].city);
                    datas.findCityAll[i].camel = pinyin.getCamelChars(datas.findCityAll[i].city);
                }
                _this.result = datas.findCityAll;
                _this.cityList = _this.format(datas.findCityAll);
            });
            this.lbs.lat = this.lbsInfo.lat;
            this.lbs.lng = this.lbsInfo.lng;
            let myCity = new window.qq.maps.Geolocation('PWNBZ-455KF-27PJL-JJFJ3-IWO23-MBFPN', 'qms');

            myCity.getLocation(function(pos) {
                let mstr = pos.adcode.toString().split('');

                mstr[4] = '0';
                mstr[5] = '0';
                _this.lbs.adcode = mstr.join('');
                _this.lbs.city = pos.city;
                _this.lbs.lat = pos.lat;
                _this.lbs.lng = pos.lng;
                _this.su = false;
            }, function() {
                _this.lbs.city = '定位失败,请选择';
                _this.su = true;
                _this.msg('网络异常,定位失败');
            }, { timeout: 10000 });
        },
        methods: {
            ...mapActions(['_lbsInfo', '_ajax']),
            format(arr) {
                let md = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                let uu = [];

                /* eslint-disable semi-spacing */
                for(let i = 0, len = md.length; i < len; i++) {
                    let ob = {};

                    ob.list = [];
                    /* eslint-disable semi-spacing */
                    for(let j = 0, l = arr.length; j < l; j++) {
                        if(arr[j].letter.toUpperCase() == md[i]) {
                            ob.letter = md[i];
                            ob.list.push(arr[j]);
                        }
                    }
                    ob.letter && uu.push(ob);
                }
                return uu;
            },
            loc() {
                if(!this.su) {
                    this._lbsInfo(this.lbs);
                    this.$router.go(-1);
                }
            },
            locc(c) {
                this.lbs.city = c.city;
                this.lbs.adcode = c.cityId;
                this._lbsInfo(this.lbs);
                this.$router.go(-1);
            }
        },
        watch: {
            currentValue: function(val) {
                let uu = this.result.filter(k => new RegExp(val, 'i').test(k.city) || new RegExp(val, 'i').test(k.full) || new RegExp(val, 'i').test(k.camel));

                this.cityList = this.format(uu);
            }
        },
        computed: {
            ...mapState(['lbsInfo'])
        }
    };
</script>

<style lang="less" scoped>
    .city-fun {
        position: absolute;
        top: 0.9rem;
        z-index: 88;
        border-bottom: 1px solid #eee;
        background-color: #fff;
        width: 100%;
        height: 2.1rem;
        padding: 0.15rem 0.3rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &-loc {
            width: 100%;
            height: 0.8rem;
            font-size: 0.32rem;
            text-align: center;
            line-height: 0.8rem;
            border: 1px solid #eee;
            border-radius: 0.1rem;
        }
    }

    .city-list {
        position: relative;
        box-sizing: border-box;
        padding-top: 3rem;
        width: 100%;
        height: 100%;
        -webkit-overflow-scrolling: touch;
    }
</style>