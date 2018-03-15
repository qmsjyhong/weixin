(function(win) {
    //本地地址
    win.htp = {
        apihost: 'https://app-dev.qms888.com/', //接口地址
        imghost: 'http://img.ts.meia8.com/', //图片地址
        wxproxy: 'https://app.qms888.com/wechat/wx.proxy.html', //代理地址
        appid: 'wxd9611f15871de9e4',
        appsecret: '46f5343c24d9966f3cdd992728f90a7e',
        download: 'https://dl.qms888.com/qrCode.html?qr=1',
        islocaltest: true, //是否本地测试
        iswxproxy: true, //是否需要代理
        wxconfig: ['hideOptionMenu', 'showOptionMenu', 'checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'openLocation', 'getLocation', 'chooseWXPay', 'addCard', 'chooseCard', 'openCard', 'scanQRCode'],
        lbs: {
            city: '西安市',
            lng: '108.9474599731',
            lat: '34.2606986937',
            adcode: '610100',
            dummy: true
        }
    };

    //开发地址
    if (win.location.host == 'app-dev.qms888.com') {
        win.htp.islocaltest = false;
    }

    //测试地址
    if (win.location.host == 'app-ts.qms888.com') {
        win.htp.apihost = 'https://app-ts.qms888.com/';
        win.htp.islocaltest = false;
    }

    //预生产地址
    if (win.location.host == 'app-pre.qms888.com') {
        win.htp.apihost = 'https://app-pre.qms888.com/';
        win.htp.imghost = 'https://img.qms888.com/';
        win.htp.islocaltest = false;
    }

    //生产地址
    if (win.location.host == 'app.qms888.com') {
        win.htp.apihost = 'https://app.qms888.com/';
        win.htp.imghost = 'https://img.qms888.com/';
        win.htp.islocaltest = false;
        win.htp.iswxproxy = false;
    }
})(window);
