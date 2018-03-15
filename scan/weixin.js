/**
 * @author by Liyq
 * @date by 2017-03-18
 * @content for only weixin
 */
(function(win) {
    function MyModule($, settings) {
        var os = {};
        //定义私有常量
        var appId = settings.appid,
            appsecret = settings.appsecret,
            toUrl = settings.apihost + 'api-customer/',
            ks = {
                login: '/user/thirdParty/loginWY.do',
                scan: '/scan/scanQRCodesByTable.do'
            };
        //输出的常量对象

        os.COMMON = {
            appid: appId,
            timestamp: '',
            noncestr: '',
            down: settings.download
        };
        //获得项目域名
        os.getHost = function() {
            // var uu = win.location;
            // var mu = uu.pathname.split('/');

            // uu = uu.origin + '/' + mu[1];
            // return uu;

            return win.location.origin + '/wechat';
        };
        //获得访问地址参数
        os.getParam = function() {
            var params = location.search.replace('?', '');
            var uu = {};

            if (params) {
                var arr = [];

                if (params.indexOf('&') == -1) {
                    arr = [params];
                } else {
                    arr = params.split('&');
                }
                for (var i = 0; i < arr.length; i++) {
                    var s = arr[i].split('=');

                    uu[s[0]] = decodeURIComponent(s[1]);
                }
            }
            return uu;
        };
        //session存储
        os.saveSi = function(k, val) {
            if (typeof val == 'string') {
                sessionStorage.setItem(k, val);
                return val;
            }
            sessionStorage.setItem(k, JSON.stringify(val));
            return val;
        };
        //session取出
        os.getSi = function(key) {
            var uu = sessionStorage.getItem(key);

            try {
                uu = JSON.parse(uu);
            } catch (e) {}
            return uu;
        };
        //清除session
        os.removeSi = function(key) {
            if (key) {
                sessionStorage.removeItem(key);
            } else {
                sessionStorage.clear();
            }
        };
        //ajax请求
        os.ajaxTo = function(uk, datas, su, er) {
            var that = this;

            $.ajax({
                type: 'post',
                url: toUrl + uk,
                data: datas,
                async: true,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                timeout: 5000,
                success: function(dataStr) {
                    if (dataStr.header.statusCode == '1') {
                        su(dataStr.body);
                    } else {
                        er && er();
                    }
                },
                error: function(e) {
                    that.warn('数据异常,请重试');
                }
            });
        };
        //提示框
        os.warn = function(text, cb) {
            if (!$('.warn-wrapper').length) {
                var html = '<div class="warn-wrapper"><div class="warn">' + text + '</div></div>';

                $('body').append(html);
            } else {
                $('.warn-wrapper .warn').text(text);
                clearTimeout(a);
                $('.warn-wrapper').stop(true, true);
            }

            $('.warn-wrapper')
                .removeClass('hidden')
                .show();
            a = setTimeout(function() {
                $('.warn-wrapper').fadeOut(500, function() {
                    $(this).addClass('hidden');
                    cb && typeof cb == 'function' && cb();
                });
            }, 1500);
        };
        //去除左右两边空格
        os.trim = function(str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        };
        //手机号码的正则判断
        os.isPhone = function(ph) {
            return /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0-9])|(18[0,5-9]))\d{8}$/.test(ph);
        };
        //毫秒时间格式转换
        os.formatTime = function(time, format) {
            data = new Date(time);
            format = format || 'yyyy-MM-dd';
            var o = {
                'M+': data.getMonth() + 1, //月份
                'd+': data.getDate(), //日
                'h+': data.getHours(), //小时
                'm+': data.getMinutes(), //分
                's+': data.getSeconds() //秒
            };

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                }
            }
            return format;
        };
        //微信获取code
        os.accrWX = function(urls) {
            if (settings.iswxproxy) {
                window.location.href = settings.wxproxy + '?appid=' + appId + '&redirect_uri=' + encodeURIComponent(urls) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
            } else {
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(urls) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
            }
        };
        os.qWX = function(urls) {
            if (settings.iswxproxy) {
                window.location.href = settings.wxproxy + '?appid=' + appId + '&redirect_uri=' + encodeURIComponent(urls) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
            } else {
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(urls) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
            }
        };
        //隐藏右上角菜单
        os.hideMenuWX = function() {
            wx.hideOptionMenu();
        };
        //显示右上角菜单
        os.showMenuWX = function() {
            wx.showOptionMenu();
        };
        //关闭微信窗口
        os.closeWX = function() {
            wx.closeWindow();
        };
        //微信扫描二维码并返回结果
        os.scanCodeWX = function(cb) {
            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function(res) {
                    cb(res);
                }
            });
        };
        //从后台获取用户参数
        os.skip = function(cb) {
            var md = this.getSi('SCAN') || {};

            md.isScan = true;
            this.saveSi('SCAN', md);
            var that = this;
            var cli = '',
                client = '';

            if (this.browser().isWeixin) {
                client = 'wechat_';
            } else if (this.browser().isAlipay) {
                client = 'alipay_';
            } else {
                client = 'browser_';
            }

            if (localStorage.getItem('clientId')) {
                cli = localStorage.getItem('clientId');
            } else {
                cli = client + this.randomWord(false, 32);
                localStorage.setItem('clientId', cli);
            }

            //          if( /micromessenger/.test(navigator.userAgent.toLowerCase()) && this.getParam().code && !this.getSi('USER_INFO')) {
            //              this.ajaxTo(ks.login, {
            //                  'loginType': 1,
            //                  'code': this.getParam().code
            //              }, function(dataStr) {
            //                  that.saveSi('USER_INFO', dataStr.wechatLoginWY);
            //                  cb && cb();
            //              });
            //          } else if(!this.getSi('USER_INFO')) {

            var hold = this.getParam();

            //type: 1.服务员码;2.店铺码;3.桌台码;4.订单码;5.用户码;
            switch (hold.type) {
                case '1':
                    hold.recommendId = hold.waiterId;
                    break;
                case '2':
                    hold.recommendId = hold.shopId;
                    break;
                case '4':
                    //2.0版本已经取消包含订单的桌台码
                    //that.saveSi('ORDER_NO', hold.orderNo || '');
                    break;
                case '5':
                    if (window.location.host == 'app.qms888.com') {
                        window.location.href = 'https://dl.qms888.com/customer.html?type=' + hold.type + '&id=' + hold.id + '&clientId=' + cli;
                    } else {
                        window.location.href = window.location.origin + '/w/download/index.html?type=' + hold.type + '&id=' + hold.id + '&clientId=' + cli;
                    }
                    return;
                    break;
                default:
                    break;
            }
            hold.waiterId && (hold.employeeId = hold.waiterId);
            var scan = this.getSi('SCAN');

            scan.params = hold;
            this.saveSi('SCAN', scan);
            ///micromessenger/.test(navigator.userAgent.toLowerCase()) ? this.accrWX(this.getHost() + '/scan/index.html') : (cb && cb());
            cb && cb();
            //          } else {
            //              window.location.href = this.getHost() + '/?from=wechat#/index';
            //          };
        };
        //微信支付
        os.weChatPay = function(payData, successCallback, failCallback, el) {
            var _this = this;

            _this.saveSi('OPENID', payData.openid || '');
            if (typeof WeixinJSBridge == 'undefined') {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', _this._onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', _this._onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', _this._onBridgeReady);
                }
            } else {
                _this._onBridgeReady(payData, successCallback, failCallback, el);
            }
        };
        os._onBridgeReady = function(payData, successCallback, failCallback, el) {
            if (el) {
                el.removeClass('disabled');
            }
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    appId: payData.appid,
                    timeStamp: payData.timestamp,
                    nonceStr: payData.nonce_str,
                    package: 'prepay_id=' + payData.prepay_id,
                    signType: 'MD5',
                    paySign: payData.pay_sign
                },
                function(respData) {
                    if (respData.err_msg === 'get_brand_wcpay_request:ok') {
                        successCallback();
                    } else if (respData.err_msg === 'get_brand_wcpay_request:cancel') {
                        failCallback();
                    } else {
                        //alert(JOSN.stringify(respData));
                        //alert(res.err_msg);
                    }
                }
            );
        };
        //微信分享
        os.weChatShare = function(options, success, cancel) {
            var _this = this;

            wx.showOptionMenu();

            var obj = {
                title: options.title, // 分享标题
                desc: options.desc, // 分享描述
                link: options.link, // 分享的链接
                imgUrl: options.imgUrl, // 分享图标
                success: function() {
                    success && success();
                    // 用户分享成功后执行的回调函数
                },
                cancel: function() {
                    cancel && cancel();
                    // 用户取消分享后执行的回调函数
                }
            };
            // 分享到朋友圈

            wx.onMenuShareTimeline(obj);
            // 分享给朋友
            wx.onMenuShareAppMessage(obj);
        };
        //获取当前时间戳
        os.timeStr = function() {
            return new Date().getTime();
        };
        //自定义随机字符串
        os.nonceStr = 'QingsUsU123Hh';
        //获取jsapi_ticket
        os.getTick = function(cb) {
            $.get(
                'https://api.weixin.qq.com/cgi-bin/token',
                {
                    grant_type: 'client_credential',
                    appid: appId,
                    secret: appsecret
                },
                function(res) {
                    if (res.access_token) {
                        document.cookie = 'token=' + res.access_token + ';expires=' + res.expires_in + ';path=/';
                        $.get(
                            'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
                            {
                                access_token: res.access_token,
                                type: 'jsapi'
                            },
                            function(rs) {
                                if (rs.ticket) {
                                    document.cookie = 'ticket=' + rs.ticket + ';expires=' + rs.expires_in + ';path=/';
                                    cb && cb();
                                    return rs.ticket;
                                }
                            }
                        );
                    }
                }
            );
        };
        //获取cookie对象
        os.getCook = function(name) {
            var arr,
                reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

            if ((arr = document.cookie.match(reg))) {
                return unescape(arr[2]);
            }
            return null;
        };
        //获得signature
        os.getSign = function() {
            var addurl = win.location.href.split('#')[0];
            var jsapi_ticket;

            if (this.getCook('ticket')) {
                jsapi_ticket = this.getCook('ticket');
            }
            this.COMMON.noncestr = this.nonceStr;
            this.COMMON.timestamp = this.timeStr();
            var str = decodeURIComponent('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + this.COMMON.noncestr + '&timestamp=' + this.COMMON.timestamp + '&url=' + addurl);
            var s = new jsSHA(str, 'TEXT');

            return s.getHash('SHA-1', 'HEX');
        };

        //生成随机字符串 @randomFlag是否生成确定长度的字符串
        os.randomWord = function(randomFlag, min, max) {
            var str = '',
                pos,
                range = min,
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            // 随机产生
            if (randomFlag) {
                range = Math.round(Math.random() * (max - min)) + min;
            }
            for (var i = 0; i < range; i++) {
                pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        };

        os.browser = function() {
            var os = {};
            var ua = window.navigator.userAgent.toLowerCase();

            os.isAndroid = /android/.test(ua); //browser,wechat,android
            os.isIOS = /iphone|ipad|ipod/.test(ua); //browser,wechat,ios
            os.isBrowser = /macintel|win32/.test(navigator.platform.toLowerCase()); //browser
            os.isWeixin = ua.indexOf('micromessenger') != -1; //wechat
            os.isAlipay = ua.indexOf('alipayclient') != -1; //ali
            os.isApp = function() {
                return (this.isAndroid || this.isIOS) && !this.isWeixin && !this.isBrowser && !this.isAlipay;
            };

            return os;
        };

        win.wos = os;
        return os;
    }
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'config'], function($, settings) {
            return MyModule($, settings);
        });
    } else {
        var a, b;

        try {
            a = $;
        } catch (e) {
            a = '';
        }
        try {
            b = htp;
        } catch (e) {
            b = '';
        }
        win.Wos = MyModule(a, b);
    }
})(this);

/**
 * 微信接口能力获取代码
 *
function cn(){
    if(wos.getCook('ticket')){
        var sign = wos.getSign();
         wx.config({
          debug: true,
          appId: wos.COMMON.appid,
          timestamp: wos.COMMON.timestamp,
          nonceStr: wos.COMMON.noncestr,
          signature: sign,
          jsApiList: [
            'checkJsApi',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',

          ]
      });
    }else{
        wos.getTick(cn);
    }
};
cn();
*/
