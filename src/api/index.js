import Vue from 'vue';
import api from './api';
import store from '../store';
import MintUI from 'mint-ui';
import router from '../router';

let xhr = ({ method = 'post', name, options = {}, userId = true, cusError = false }) => {
    let promise;
    let str = '';
    let time = new Date();
    let loading = true;
    let headerOptions = {
        emulateJSON: api[name].version != 2,
        headers: {
            session: api[name].session === false ? '' : store.getters.session
        }
    };

    if (userId) {
        options.userId = store.getters.userId || '';
    }
    if (api[name].session !== false) {
        //options.session = options.session || store.getters.session || '';
    }

    for (var i in options) {
        str += i + '=' + options[i] + '&';
    }
    str = str.slice(0, -1);
    if (api[name].version == 2) {
        options = JSON.stringify(options);
    }

    //加载动画
    setTimeout(() => {
        if (loading) {
            MintUI.Indicator.open({
                text: '加载中',
                spinnerType: 'triple-bounce'
            });
        }
    }, 2000);

    function loginError() {
        MintUI.Toast('登录失效，请重新登录');
        loading = false;
        MintUI.Indicator.close();
        store._actions._userInfo[0]({
            openId: store.getters.openId,
            userId: store.getters.userId
        });
        setTimeout(() => {
            router.push('login');
        }, 1000);
        return false;
    }

    function errHandler(error) {
        MintUI.Indicator.close();
        if (error) {
            if (typeof error === 'string') {
                MintUI.Toast(error);
            } else if (typeof error === 'object') {
                if (error.status == 401) {
                    loginError();
                }
            }
        } else {
            MintUI.Toast('请求数据异常');
        }

        setTimeout(() => {
            MintUI.Indicator.close();
        }, 3000);
    }

    function successV1({ response, success, error }) {
        if (response.data.header && response.data.header.statusCode && ~~response.data.header.statusCode) {
            success(response.data.body);
            /* eslint-disable no-console */
            console.log(api[name].url.replace('/proxy', '') + '?' + str, JSON.parse(JSON.stringify(response.data.body)), new Date() - time);
        } else if (cusError) {
            error(response.data.header);
        } else {
            errHandler(response.data.header.errorMsg.errorDesc);
        }
        loading = false;
        MintUI.Indicator.close();
    }

    function successV2({ response, success, error }) {
        if (response.data.code && response.data.code == 200) {
            success(response.data.body);
            /* eslint-disable no-console */
            console.log(api[name].url.replace('/proxy', '') + '?' + str, JSON.parse(JSON.stringify(response.data.body)), new Date() - time);
        } else if (cusError) {
            error(response.data.body);
        } else {
            errHandler(response.data.msg);
        }
        loading = false;
        MintUI.Indicator.close();
    }

    function successHandler(response, success, error) {
        let params = { response, success, error };

        if (api[name].version == 2) {
            successV2(params);
        } else {
            successV1(params);
        }
    }

    switch (method) {
        case 'get':
            promise = new Promise(function(resolve, reject) {
                Vue.http.get(api[name].url, { params: options }, headerOptions).then(
                    function(response) {
                        successHandler(
                            response,
                            res => {
                                resolve(res);
                            },
                            res => {
                                reject(res);
                            }
                        );
                    },
                    function(response) {
                        errHandler(response);
                    }
                );
            });
            return promise;
        case 'post':
            promise = new Promise(function(resolve, reject) {
                Vue.http.post(api[name].url, options, headerOptions).then(
                    function(response) {
                        successHandler(
                            response,
                            res => {
                                resolve(res);
                            },
                            res => {
                                reject(res);
                            }
                        );
                    },
                    function(response) {
                        errHandler(response);
                    }
                );
            });
            return promise;
        default:
    }
};

export { xhr, api };
