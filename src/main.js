//入口文件
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAjax from 'vue-resource';
import router from './router/';
import store from './store/';
import MintUI from 'mint-ui';
import components from './components/'; // 加载公共组件
import App from './App'; // 主入口
import { browser, randomWord } from './utils';
import filters from './filters'; //eslint-disable-line

//全局引入第三方插件
Vue.use(MintUI);
Vue.use(VueRouter);
Vue.use(VueAjax);

Vue.prototype.msg = MintUI.Toast;
Vue.prototype.loading = MintUI.Indicator;
Vue.prototype.browser = browser;

let client, cli;

if (browser().isWeixin) {
    client = 'wechat_';
} else if (browser().isAlipay) {
    client = 'alipay_';
} else {
    client = 'browser_';
}

if (localStorage.getItem('clientId')) {
    cli = localStorage.getItem('clientId');
} else {
    cli = client + randomWord(false, 32);
    localStorage.setItem('clientId', cli);
}

// Resource Header Set
Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;

Vue.http.interceptors.push((request, next) => {
    //部分接口不能传session
    //request.headers.set('session', store.state.userInfo.session);
    request.headers.set('clientV', 'c_1.5');
    request.headers.set('clientID', cli);
    request.headers.set('registerID', store.state.userInfo.registerId);
    next(response => {
        if (response.status == 400) {
            MintUI.Toast('请求出错, 再试试');
        } else if (response.status == 404) {
            MintUI.Toast('访问了不存在的API或页面');
        } else if (response.status == 500) {
            MintUI.Toast('服务器坏了, 等会再试');
        } else if (response.data == null) {
            MintUI.Toast('网络异常');
        }
        return response;
    });
});

Object.keys(components).forEach(key => {
    var name = key.replace(/(\w)/, v => v.toUpperCase()); //首字母大写

    Vue.component(`v${name}`, components[key]);
});

function start() {
    window.v = new Vue({
        data: {
            eventHub: new Vue()
        },
        store,
        router,
        render: h => h(App)
    }).$mount('#app');
}

//兼容旧的链接
if (location.href.indexOf('from=wechat') == -1) {
    if (location.href.split('#')[0].indexOf('?') == -1) {
        window.location.href = location.href.split('#')[0] + '?from=wechat#' + location.href.split('#')[1];
    } else {
        window.location.href = location.href.split('#')[0] + '&from=wechat#' + location.href.split('#')[1];
    }
} else {
    //必须在微信浏览器内
    /* eslint-disable no-lonely-if */
    if (browser().isWeixin) {
        //2.没有userId，有code时进行授权登录
        if (!store.getters.userId && window.location.href.match(/code=[\w]{32}/, 'g')) {
            store._actions._ajax[0]({
                name: 'login',
                options: {
                    code: window.location.href.match(/code=([\w]{32})/, 'g')[1],
                    loginType: 1
                }
            }).then(res => {
                store._actions._userInfo[0](res.wechatLoginWY);
                window.localStorage.setItem('accpet', 'quanmeishi');
                //3.去掉code参数,防止直接复制链接出去带上旧的code
                window.location.href = window.location.href.replace(/[&?]code=[\w]{32}/, '');
                start();
            });
        } else if (!store.getters.userId) {
            let sco = window.localStorage.getItem('accpet') ? 'snsapi_base' : 'snsapi_userinfo';

            //1.没有userId 没有code时进行授权
            if (window.htp.iswxproxy) {
                window.location.href = window.htp.wxproxy + '?appid=' + window.htp.appid + '&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=' + sco + '&state=STATE#wechat_redirect';
            } else {
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + window.htp.appid + '&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=' + sco + '&state=STATE#wechat_redirect';
            }
        } else {
            start();
        }
    } else {
        start();
    }
}
