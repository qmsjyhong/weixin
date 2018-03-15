import VueRouter from 'vue-router';
import routes from './router';
import store from '../store';
import * as keys from '../store/keys';
import { browser } from '../utils';

const router = new VueRouter({
    mode: 'hash',
    linkActiveClass: 'is-active',
    routes
});

router.beforeEach((option, from, next) => {
    let meta = option.meta;

    function skip(metas) {
        if (metas && metas.params && metas.params.length) {
            metas.params.forEach(item => {
                if (item == keys.SESSION && !store.getters.session) {
                    return next('login');
                } else if (item == keys.SHOP && !store.getters.shopId) {
                    return next('index');
                } else if (item == keys.ACTIVITY_ID && !store.getters.activityId) {
                    return next('activity');
                } else if (item == keys.PAYSUC_ID && !store.getters.paysucId) {
                    return next('limitpay');
                } else if (item == keys.ORDER_ID && !store.getters.orderId) {
                    return next('orderlist');
                } else if (browser().isWeixin && item == keys.OPEN_ID && !store.getters.openId) {
                    return next('shophome');
                } else if (item == keys.USER_ID && !store.getters.userId) {
                    return next('shophome');
                } else if (item == 'isCommitOrder' && store.getters.custom.isCommitOrder) {
                    return router.go(-1);
                } else if (!browser().isWeixin) {
                    return next();
                }
            });
            next();
        } else {
            return next();
        }
    }

    //解决messagebox在切换路由时不取消的bug
    if (document.querySelector('.mint-msgbox-cancel')) {
        document.querySelector('.mint-msgbox-cancel').click();
    }

    browser().isWeixin ?
        store._actions._ajax[0]({
              name: 'getWxSign',
              options: {
                  url: encodeURIComponent(window.location.href.split('#')[0])
              }
          }).then(res => {
              window.wx.config({
                  debug: false,
                  appId: window.htp.appid,
                  timestamp: res.wxsign.timestamp,
                  nonceStr: res.wxsign.nonceStr,
                  signature: res.wxsign.signature,
                  jsApiList: window.htp.wxconfig
              });

              window.wx.ready(function() {
                  window.wx && window.wx.hideOptionMenu && window.wx.hideOptionMenu();
                  skip(meta);
              });
          }) :
        skip(meta);
});

router.afterEach(() => {});
export default router;
