//扫码跳转逻辑
(function() {
    var wos = window.wos;
    var $ = window.$;
    //根据参数跳转不同的页面

    function router() {
        var scan = wos.getSi('SCAN');
        var ob = scan.params || {};
        var userInfo = wos.getSi('USER_INFO') || {};
        var uk = '/scan/qrCode.do';
        var usId = '/scan/scanQRCodesByShopInfo';

        ob.shopId && wos.saveSi('SHOP', { shopId: ob.shopId });
        ob.session = userInfo.session || '';
        ob.userId = userInfo.userId;
        ob.scanId = ob.qrCodeId;
        ob.scanType = ob.type;
        //type: 1.服务员码;2.店铺码;3.桌台码;4.订单码;5.用户码;
        ob.type != '1' ?
            wos.ajaxTo(
                  uk,
                  ob,
                  function(dataStr) {
                      switch (ob.type) {
                          case '2':
                              window.location.href = wos.getHost() + '/?from=wechat#/shophome';
                              break;
                          case '3':
                              //scan.isScanTable = true; //1.7版本取消扫桌台码免登陆情况
                              ob.recommendId = dataStr.tableId;
                              dataStr.shopId && wos.saveSi('SHOP', { shopId: dataStr.shopId });
                              dataStr.shopId && (ob.shopId = dataStr.shopId);
                              wos.saveSi('SCAN', scan);
                              window.location.href = wos.getHost() + '/?from=wechat#/alldishes';
                              return false;

                              //2.0版本已经取消包含订单的桌台码
                              //   if (dataStr.info.orderInfo.pay_status == '1') {
                              //       $('.load').hide();
                              //       $('.ava')
                              //           .show()
                              //           .find('.title')
                              //           .text(dataStr.info.orderInfo.shop_name);
                              //       srco();
                              //   } else {
                              //       ob.employeeId = dataStr.info.orderInfo['employee_id'] || '';
                              //       ob.tableName = dataStr.info.orderInfo['table_name'] || '';
                              //       wos.saveSi('SCAN', scan);

                              //       wos.saveSi('ORDER_NO', dataStr.info.orderInfo.order_no || '');
                              //       window.location.href = wos.getHost() + '/?from=wechat#/order';
                              //   }
                              break;
                          case '4':
                              //				    wos.ajaxTo(queryOrder, ob, function(dataStr){})  liyq@2017-10-16
                              window.location.href = wos.getHost() + '/?from=wechat#/order';
                              break;
                          default:
                              window.location.href = wos.getHost() + '/?from=wechat#/index';
                              break;
                      }
                  },
                  function() {
                      $('.er')
                          .show()
                          .siblings('div')
                          .hide();
                      //通过服务员找到对应的店铺ID
                  }
              ) :
            wos.ajaxTo(
                  usId,
                  ob,
                  function(dataStr) {
                      //数据拼装
                      ob.shopId = dataStr.shopId['shop_id'];
                      wos.saveSi('SHOP', { shopId: ob.shopId });
                      var scan2 = wos.getSi('SCAN');
                      var uob = scan2.params || {};

                      uob.shopId = dataStr.shopId['shop_id'];
                      uob.employeeName = dataStr.shopId['employee_name'];
                      wos.saveSi('SCAN', scan2);
                      wos.ajaxTo(uk, ob, function() {
                          window.location.href = wos.getHost() + '/?from=wechat#/shophome';
                      });
                  },
                  function() {
                      window.location.href = wos.getHost() + '/?from=wechat#/index';
                  }
              );
    }

    wos.skip(router);
})();
