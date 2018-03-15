(function(doc, win) {
    document.addEventListener(
        'DOMContentLoaded',
        function() {
            if (window.FastClick) {window.FastClick.attach(document.body);}
        },
        false
    );

    var _root = doc.documentElement,
        resizeEvent = 'orientationchange' in win ? 'orientationchange' : 'resize',
        resizeCallback = function() {
            var clientWidth = _root.clientWidth;

            _root.style.fontSize = parseInt(clientWidth / 7.2) + 'px';
            document.body && (document.body.style.fontSize = 0.28 + 'rem');
        };

    if (!doc.addEventListener) {return;}
    win.addEventListener(resizeEvent, resizeCallback, false);
    doc.addEventListener('DOMContentLoaded', resizeCallback, false);

    if (typeof WeixinJSBridge == 'object' && typeof WeixinJSBridge.invoke == 'function') {
        handleFontSize();
    } else if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', handleFontSize, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', handleFontSize);
            document.attachEvent('onWeixinJSBridgeReady', handleFontSize);
        }

    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', {
            fontSize: 0
        });
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function() {
            WeixinJSBridge.invoke('setFontSizeCallback', {
                fontSize: 0
            });
        });
    }

    setTimeout(function() {
        var _hmt = _hmt || [];

        (function() {
            var hm = document.createElement('script');

            hm.src = 'https://hm.baidu.com/hm.js?bc9b71bc093b8d27e9f3a85012ba474c';
            var s = document.getElementsByTagName('script')[0];

            s.parentNode.insertBefore(hm, s);
        })();
    }, 3000);

    win.overscroll = function(el) {
        el.addEventListener('touchstart', function() {
            var top = el.scrollTop,
                totalScroll = el.scrollHeight,
                currentScroll = top + el.offsetHeight;

            if (top === 0) {
                el.scrollTop = 1;
            } else if (currentScroll === totalScroll) {
                el.scrollTop = top - 1;
            }
        });

        el.addEventListener('touchmove', function(evt) {
            if (el.offsetHeight < el.scrollHeight) {evt._isScroller = true;}
        });
    };

    var ua = win.navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(ua)) {
        win.localStorage.setItem('downls', 'https://itunes.apple.com/us/app/id1239680909');
    } else if (/android/.test(ua)) {
        linkedme.init(
            'b0c963029d9fa2c03ad5ba1d370fc3ca',
            {
                type: 'live'
            },
            null
        );
        linkedme.link(
            {
                type: 'live'
            },
            function(err, response) {
                if (err) {
                    win.localStorage.setItem('downls', htp.download);
                } else {
                    win.localStorage.setItem('downls', response.url);
                }
            }
        );
    }
})(document, window);
window.PointerEvent = undefined;
