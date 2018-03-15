import Vue from 'vue';
import Vuex from 'vuex';
import * as keys from './keys';
import { setSen, getSen, getLoc, setLoc, serialize, browser } from '../utils';
import { xhr, api } from '../api';

Vue.use(Vuex);

let scan = (getSen('SCAN') && getSen('SCAN').params) || '';

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production', //在非生产环境下，使用严格模式
    state: {
        data: {},
        userInfo: getLoc(keys.USER_INFO) || {},
        shop: getSen(keys.SHOP) || {},
        scan: getSen(keys.SCAN) || {},
        lbsInfo: getSen(keys.LBS_INFO),
        orderId: getSen(keys.ORDER_ID),
        order: getSen(keys.ORDER),
        activityId: getSen(keys.ACTIVITY_ID),
        paysucId: getSen(keys.PAYSUC_ID),
        remark: getSen(keys.REMARK),
        loginInfo: getSen(keys.LOGIN_INFO),
        custom: getSen(keys.CUSTOM) || {
            download: true, //下载全美食
            pRedpacket: true, //平台红包
            qmsDiscount: 0, //全美食优惠金额
            keywords: '', //菜品搜索,
            dishId: '', //菜品编号
            isCommitOrder: false //已经提交下单
        },
        searchHistory: getLoc(keys.SEARCH_HISTORY)
    },
    getters: {
        data: state => serialize(state.data),
        userId: state => state.userInfo.userId || '',
        session: state => state.userInfo.session || '',
        openId: state => state.userInfo.openId || '',
        userInfo: state => serialize(state.userInfo) || {},
        shopId: state => {
            return state.shop.shopId || '';
        },
        shopName: state => state.shop.shopName || '',
        scan: state => serialize(state.scan) || {},
        lbsInfo: state => serialize(state.lbsInfo),
        orderId: state => state.orderId || '',
        order: state => serialize(state.order) || {},
        activityId: state => state.activityId || '',
        paysucId: state => state.paysucId || '',
        remark: state => state.remark,
        loginInfo: state => serialize(state.loginInfo),
        custom: state => serialize(state.custom) || {},
        appto: state => ({
            clientId: getLoc('clientId') || '',
            id: scan.recommendId || '',
            type: scan.type || '',
            userId: state.userInfo.userId || ''
        }),
        searchHistory: state => serialize(state.searchHistory) || []
    },
    mutations: {
        [keys.DATA](state, res) {
            state.data = { ...state.data, ...res };
        },
        [keys.USER_INFO](state, userInfo) {
            setLoc(keys.USER_INFO, userInfo);
            if (!userInfo.userName) {
                userInfo.userName = '新用户';
            }
            state.userInfo = userInfo;
        },
        [keys.SHOP](state, shop) {
            if (shop.shopId && state.shop.shopId !== shop.shopId) {
                state.data = {
                    ...state.data,
                    ...{ findShopItemAll: null }
                };
            }
            state.shop = { ...state.shop, ...shop };
            setSen(keys.SHOP, state.shop);
        },
        [keys.SCAN](state, scan1) {
            setSen(keys.SCAN, scan1);
            state.scan = scan1;
        },
        [keys.LBS_INFO](state, lbsInfo) {
            setSen(keys.LBS_INFO, lbsInfo);
            state.lbsInfo = lbsInfo;
        },
        [keys.ORDER_ID](state, orderId) {
            setSen(keys.ORDER_ID, orderId);
            state.orderId = orderId;
        },
        [keys.ORDER](state, order) {
            setSen(keys.ORDER, order);
            state.order = order;
        },
        [keys.ACTIVITY_ID](state, activityId) {
            setSen(keys.ACTIVITY_ID, activityId);
            state.activityId = activityId;
        },
        [keys.PAYSUC_ID](state, paysucId) {
            setSen(keys.PAYSUC_ID, paysucId);
            state.paysucId = paysucId;
        },
        [keys.REMARK](state, remark) {
            setSen(keys.REMARK, remark);
            state.remark = remark;
        },
        [keys.LOGIN_INFO](state, loginInfo) {
            state.loginInfo = loginInfo;
        },
        [keys.CUSTOM](state, custom) {
            setSen(keys.CUSTOM, custom);
            state.custom = custom;
        },
        [keys.SEARCH_HISTORY](state, searchHistory) {
            setLoc(keys.SEARCH_HISTORY, searchHistory);
            state.searchHistory = searchHistory;
        }
    },
    actions: {
        _ajax(state, { name, ...options }) {
            return new Promise(function(resolve) {
                let data = state.state.data;

                if (api[name].cache && data[name]) {
                    return resolve(serialize(data[name]));
                }

                xhr({ name, ...options }).then(res => {
                    state.commit(keys.DATA, {
                        [name]: serialize(res)
                    });
                    resolve(res);
                });
            });
        },
        _userInfo(state, userInfo) {
            state.commit(keys.USER_INFO, serialize(userInfo));
        },
        _shopId(state, shopId) {
            state.commit(keys.SHOP, { shopId });
        },
        _shopName(state, shopName) {
            state.commit(keys.SHOP, { shopName });
        },
        _scan(state, scan1) {
            state.commit(keys.SCAN, serialize(scan1));
        },
        _lbsInfo(state, lbsInfo) {
            state.commit(keys.LBS_INFO, serialize(lbsInfo));
        },
        _orderId(state, orderId) {
            state.commit(keys.ORDER_ID, orderId);
        },
        _order(state, order) {
            state.commit(keys.ORDER, serialize(order));
        },
        _activityId(state, activityId) {
            state.commit(keys.ACTIVITY_ID, activityId);
        },
        _paysucId(state, paysucId) {
            state.commit(keys.PAYSUC_ID, paysucId);
        },
        _remark(state, remark) {
            state.commit(keys.REMARK, remark);
        },
        _loginInfo(state, loginInfo) {
            state.commit(keys.LOGIN_INFO, loginInfo);
        },
        _custom(state, custom) {
            state.commit(keys.CUSTOM, custom);
        },
        _install(state) {
            //解决华为手机在浏览器下点击下载提示是出现安全警告，针对华为手机特殊处理
            let reg = /(HONOR|HUAWEI|HDH60)/;

            function openHW(t) {
                var e = document.createElement('iframe');

                document.body.appendChild(e),
                    (e.style.display = 'none'),
                    (e.src = 'hiapp://com.huawei.appmarket?activityName=activityUri|appdetail.activity&params={"params":[{"name":"uri","type":"String","value":"app|' + t + '"}]}&channelId=123412'),
                    setTimeout(function() {
                        document.body.removeChild(e);
                    }, 5000);
            }

            if (!browser().isWeixin && reg.test(window.navigator.userAgent)) {
                openHW('C100046425');
            } else {
                let minstall = new window.OpenInstall(
                    {
                        appKey: window.location.host == 'app.qms888.com' ? 'xy94e9' : 'l8u0at'
                    },
                    state.getters.appto
                );

                minstall.wakeupOrInstall();
            }
        },
        _searchHistory(state, searchHistory) {
            state.commit(keys.SEARCH_HISTORY, serialize(searchHistory));
        }
    }
});
