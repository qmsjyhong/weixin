//接口api
let api = {
    //微信相关
    login: { url: 'api-customer/user/thirdParty/loginWY', session: false }, //微信登录授权
    getWxSign: { url: 'api-customer/getWxSign', session: false }, //微信签名
    pay: { url: 'api-customer/weixin/preItemOrderPub' }, //微信公众号支付
    wxPayWap: { url: 'api-customer/weixin/preItemOrderWap' }, //其他浏览器调用微信支付

    //支付宝相关
    aliPay: { url: 'api-customer/alipay/wapAlipay' }, //支付宝支付

    //登录注册
    phoneLog: { url: 'api-customer/user/login', session: false }, //手机验证码登录
    accountLog: { url: 'api-customer/user/firstKind/login', session: false }, //账号登录
    register: { url: 'api-customer/user/register/login', session: false }, //注册
    phoneLogWX: { url: 'api-customer/user/weChart/login', session: false }, //微信-手机验证码登录
    accountLogWX: { url: 'api-customer/user/weChat/firstKind/login', session: false }, //微信-账号登录
    registerWX: { url: 'api-customer/user/wechat/register/login', session: false }, //微信-注册
    sendAuthCode: { url: 'api-customer/user/sendAuthCode', session: false }, //请求验证码
    updatePwd: { url: 'api-customer/user/resetPwd/updatePassWord', session: false }, //忘记、修改密码

    //首页
    cityList: { url: 'api-customer/findCityAll', cache: true }, //首页-城市列表
    banner: { url: 'api-customer/banner/getBannerList', cache: true }, //首页-banner
    shopList: { url: 'api-customer/shop/search' }, //首页-店铺列表
    shopSele: { url: 'api-customer/shopClassify/getShopCateringList' }, //首页-店铺筛选
    shopCircle: { url: 'api-customer/shopSearch/getShopSearchTypes', cache: true }, //首页-商圈
    pRedPacket: { url: 'api-customer/redPackage/indexIsActivity' }, //首页-平台红包

    //红包池
    homeRedUnread: { url: 'api-customer/redPackage/indexOne' }, //红包池-首页红包消息未读
    homeRed: { url: 'api-customer/redPackage/indexActivity' }, //红包池-首页红包
    homeRedDel: { url: 'api-customer/deleteIndexRedList' }, //红包池-删除首页红包
    homeRedList: { url: 'api-customer/redPackage/indexShopRed' }, //红包池-红包列表
    homeRedListDel: { url: 'api-customer/redPackage/deleteIndexActivity' }, //红包池-红包列表删除

    //店铺
    shopBanner: { url: 'api-customer/banner/getShopBannerList' }, //店铺-banner
    shopInfo: { url: 'api-customer/getShopInfoAndItemType' }, //店铺-详情
    favoriteAction: { url: 'api-customer/addUserCollectShop' }, //店铺-取消收藏
    likeAdd: { url: 'api-customer/addUserLikeShop' }, //店铺-点赞
    likeDel: { url: 'api-customer/deleteUserLikeShop' }, //店铺-取消点赞
    dishInfo: { url: 'api-customer/getDishInfo' }, //菜品详情
    collectShopByScanQR: { url: 'api-customer/scan/qrCode' }, //通过扫码自动收藏店铺

    //点餐
    queryPackageType: { url: 'api-customer/package/queryPackageType' }, //点餐-一键点餐-套餐类型
    getAvailablePerson: { url: 'api-customer/package/getAvailablePerson' }, //点餐-一键点餐-获取人数
    queryDishesByPerson: { url: 'api-customer/package/queryShopPackages' }, //点餐-一键点餐-根据人数查询菜品
    findShopItemAll: { url: 'api-customer/findShopItemAll', cache: true }, //点餐-全部菜品
    shopTable: { url: 'api-customer/findShopTableAndShopInfo' }, //点餐-预订桌子和店铺信息

    //我的
    feedback: { url: 'api-customer/advice/insertUserOpinion' }, //我的-意见反馈
    message: { url: 'api-customer/findUserInformationPage' }, //我的-请求消息列表
    getRedPacketList: { url: 'api-customer/red/getRedPacketList' }, //我的-请求红包列表
    favorite: { url: 'api-customer/findUserCollectShopPage' }, //我的-请求收藏列表
    cusMsg: { url: 'api-customer/findQuestionAnswerPage' }, //我的-获取在线客服信息
    userInfo: { url: 'api-customer/findUserMyHome' }, //我的-获取用户信息
    changeName: { url: 'api-customer/user/images/imagesUpload' }, //我的-修改用户名

    //拓客
    activityList: { url: 'api-customer/redPackage/activity' }, //店铺活动列表
    redOrBuyInfo: { url: 'api-customer/activity/redOrBuyInfo' }, //查寻红包、限时抢购信息
    getRed: { url: 'api-customer/grabRedEnvelope' }, //红包-领取
    getLimit: { url: 'api-customer/addShopLimitedBuy' }, //限时抢购-领取
    limitedBuyShow: { url: 'api-customer/updateShopLimitedBuy' }, //限时抢购成功信息
    limitBuyList: { url: 'api-customer/limitBuy/list' }, //首页第二版限时抢购列表
    redShopList: { url: 'api-customer/red/shopList' }, //首页第二版红包店铺列表

    //订单
    shopRedPackageList: { url: 'api-customer/red/shopRedPackageList' }, //订单-店铺红包列表
    findPerfectCoupon: { url: 'api-customer/order/findPerfectCoupon' }, //订单-获取可用红包
    oneKeyGetAll: { url: 'api-customer/red/oneKeyGetAll' }, //订单-一键领取红包
    queryPay: { url: 'api-customer/payment/queryPay' }, //订单-查询支付状态

    refund: { url: 'api-customer/order/findOrderRefundDetail' }, //订单-退款详情
    getRedPoint: { url: 'qmsorder/c/orderStatistics', version: 2 }, //订单-订单列表未读红点
    addOrder: { url: 'qmsorder/c/addOrder', version: 2 }, //订单-添加
    updateOrder: { url: 'qmsorder/c/updateOrder', version: 2 }, //订单-修改-支付
    addOrderItem: { url: 'qmsorder/c/addOrderItem', version: 2 }, //订单-修改-加菜
    orderDetail: { url: 'qmsorder/c/orderDetailAll', version: 2 }, //订单-详情
    orderList: { url: 'qmsorder/c/orderList', version: 2 }, //订单-订单列表
    cancelOrder: { url: 'qmsorder/c/cancelOrder', version: 2 }, //订单-取消
    deleteOrder: { url: 'qmsorder/c/deleteOrder', version: 2 }, //订单-删除
    notifyByBtn: { url: 'qmsorder/c/notifyByBtn', version: 2 }, //订单-按钮通知上菜
    notifyByScan: { url: 'qmsorder/c/notifyByScan', version: 2 }, //订单-扫码通知上菜
    reqRefund: { url: 'qmsorder/c/preRefund', version: 2 }, //订单-退款查询
    applyRefund: { url: 'qmsorder/c/applyRefund', version: 2 }, //订单-退款(退菜)
    calcRefund: { url: 'qmsorder/c/beforeRefundCalc', version: 2 }, //订单-售后退款金额计算
    removeUnnotifyDish: { url: 'qmsorder/c/cancelPartItem', version: 2 }, //订单-取消订单上未通知的菜

    //评价
    commentLabels: { url: 'api-customer/comment/commentTaglist' }, //评价-提交评价标签
    commentDetail: { url: 'api-customer/getShopComment' }, //评价-店铺评价详情
    commentAdd: { url: 'api-customer/comment/addComment' }, //评价-添加评价
    commentList: { url: 'api-customer/comment/commentlistByUserId' }, //评价-用户个人评价
    commentDel: { url: 'api-customer/comment/deleteCommentByUser' }, //评价-删除评论

    //邀请
    invite: { url: 'api-customer/user/inviteFriend' }, //邀请好友
    inviteList: { url: 'api-customer/user/inviteRecordPage' } //邀请记录
};

for (var k in api) {
    //本地,开发老接口需要加neworder(之后会去掉)
    if ((window.htp.islocaltest || window.location.host == 'app-dev.qms888.com') && api[k].version != 2) {
        api[k].url = 'neworder/' + api[k].url;
    }

    api[k].url = (window.htp.islocaltest ? '/proxy/' : window.htp.apihost) + api[k].url;
}
export default api;
