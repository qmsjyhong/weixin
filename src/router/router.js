import * as keys from '../store/keys';

const router = [
    {
        path: '/',
        component: () => import('../components/view'),
        children: [
            {
                name: 'index',
                path: 'index',
                meta: {
                    params: []
                },
                component: () => import('../pages/home')
            },
            {
                name: 'city',
                alias: 'city',
                path: 'index/city',
                meta: {
                    params: []
                },
                component: () => import('../pages/city')
            },
            {
                name: 'shortcut',
                alias: 'shortcut',
                path: 'index/shortcut',
                meta: {
                    params: []
                },
                component: () => import('../pages/shortcut')
            },
            {
                name: 'shopsearch',
                path: 'index/shopsearch',
                alias: 'shopsearch',
                meta: {
                    params: []
                },
                component: () => import('../pages/shopsearch')
            },
            {
                name: 'homexsqg',
                path: 'index/homexsqg',
                alias: 'homexsqg',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/homexsqg')
            },
            {
                name: 'homehbshop',
                path: 'index/homehbshop',
                alias: 'homehbshop',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/homehbshop')
            },
            {
                name: 'homehb',
                path: 'index/homehbshop/homehb',
                alias: 'homehb',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/homehb')
            },
            {
                name: 'login',
                alias: 'login',
                path: 'index/login',
                meta: {
                    params: []
                },
                component: () => import('../pages/login')
            },
            {
                name: 'register',
                alias: 'register',
                path: 'index/login/register',
                meta: {
                    params: []
                },
                component: () => import('../pages/register')
            },
            {
                name: 'forget',
                alias: 'forget',
                path: 'index/login/forget',
                meta: {
                    params: []
                },
                component: () => import('../pages/forget')
            },
            {
                name: 'forgetreset',
                alias: 'forgetreset',
                path: 'index/login/forget/forgetreset',
                meta: {
                    params: []
                },
                component: () => import('../pages/forgetreset')
            },
            {
                name: 'mine',
                alias: 'mine',
                path: 'index/mine',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/mine')
            },
            {
                name: 'feedback',
                alias: 'feedback',
                path: 'index/mine/feedback',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/feedback')
            },
            {
                name: 'usercomment',
                alias: 'usercomment',
                path: 'index/mine/usercomment',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/usercomment')
            },
            {
                name: 'redpackageshop',
                alias: 'redpackageshop',
                path: 'index/mine/redpackageshop',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/redpackageshop')
            },
            {
                name: 'message',
                alias: 'message',
                path: 'index/mine/message',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/message')
            },
            {
                name: 'collect',
                alias: 'collect',
                path: 'index/mine/collect',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/collect')
            },
            {
                name: 'about',
                alias: 'about',
                path: 'index/mine/about',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/aboutus')
            },
            {
                name: 'cusservice',
                alias: 'cusservice',
                path: 'index/mine/cusservice',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/cusservice')
            },
            {
                name: 'invite',
                alias: 'invite',
                path: 'index/mine/invite',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/invite')
            },
            {
                name: 'shareinvite',
                alias: 'shareinvite',
                path: 'index/shareinvite',
                meta: {
                    params: []
                },
                component: () => import('../pages/shareinvite')
            },
            {
                name: 'inviterecord',
                alias: 'inviterecord',
                path: 'index/mine/invite/inviterecord',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/inviterecord')
            },
            {
                name: 'userinfo',
                alias: 'userinfo',
                path: 'index/mine/userinfo',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/userinfo')
            },
            {
                name: 'updatename',
                alias: 'updatename',
                path: 'index/mine/userinfo/updatename',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/updatename')
            },
            {
                name: 'updatepaw',
                alias: 'updatepaw',
                path: 'index/mine/userinfo/updatepaw',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/updatepaw')
            },
            {
                name: 'updatepawreset',
                alias: 'updatepawreset',
                path: 'index/mine/userinfo/updatepaw/updatepawreset',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/updatepawreset')
            },
            {
                name: 'orderlist',
                alias: 'orderlist',
                path: 'index/mine/orderlist',
                meta: {
                    params: [keys.SESSION],
                    type: 2
                },
                component: () => import('../pages/orderlist')
            },
            {
                name: 'orderdetail',
                alias: 'orderdetail',
                path: 'index/mine/orderList/orderdetail',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID]
                },
                component: () => import('../pages/orderdetail')
            },
            {
                name: 'refunddetail',
                alias: 'refunddetail',
                path: 'index/mine/orderList/orderdetail/refunddetail',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID]
                },
                component: () => import('../pages/refunddetail')
            },
            {
                name: 'refundapply',
                alias: 'refundapply',
                path: 'index/mine/orderList/orderdetail/refundapply',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID]
                },
                component: () => import('../pages/refundapply')
            },
            {
                name: 'refundapplysuccess',
                alias: 'refundapplysuccess',
                path: 'index/mine/orderList/orderdetail/refundapply/refundapplysuccess',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID]
                },
                component: () => import('../pages/refundapplysuccess')
            },
            {
                name: 'refunddishapply',
                alias: 'refunddishapply',
                path: 'index/mine/orderList/orderdetail/refunddishapply',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID]
                },
                component: () => import('../pages/refunddishapply')
            },
            {
                name: 'refunddishapplysuccess',
                alias: 'refunddishapplysuccess',
                path: 'index/mine/orderList/orderdetail/refunddishapplysuccess',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID]
                },
                component: () => import('../pages/refunddishapplysuccess')
            },
            {
                name: 'refundserviceapply',
                alias: 'refundserviceapply',
                path: 'index/mine/orderList/orderdetail/refundserviceapply',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID]
                },
                component: () => import('../pages/refundserviceapply')
            },
            {
                name: 'cookingsuccess',
                alias: 'cookingsuccess',
                path: 'index/mine/orderList/orderdetail/cookingsuccess',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID]
                },
                component: () => import('../pages/cookingsuccess')
            },
            {
                name: 'redpool',
                alias: 'redpool',
                path: 'index/redpool',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/redpool')
            },
            {
                name: 'redpoollist',
                alias: 'redpoollist',
                path: 'index/redpool/redpoollist',
                meta: {
                    params: [keys.SESSION, keys.SHOP]
                },
                component: () => import('../pages/redpoollist')
            },
            {
                name: 'shophome',
                path: 'index/shophome',
                alias: 'shophome',
                meta: {
                    params: []
                },
                component: () => import('../pages/shophome')
            },
            {
                name: 'shopcomment',
                path: 'index/shophome/shopcomment',
                alias: 'shopcomment',
                meta: {
                    params: []
                },
                component: () => import('../pages/shopcomment')
            },
            {
                name: 'activity',
                alias: 'activity',
                path: 'index/shophome/activity',
                meta: {
                    params: [keys.SESSION, keys.SHOP]
                },
                component: () => import('../pages/activity')
            },
            {
                name: 'benefit',
                alias: 'benefit',
                path: 'index/shophome/activity/benefit',
                meta: {
                    params: [keys.SHOP, keys.ACTIVITY_ID]
                },
                component: () => import('../pages/benefit')
            },
            {
                name: 'buying',
                alias: 'buying',
                path: 'index/shophome/activity/buying',
                meta: {
                    params: [keys.SHOP, keys.ACTIVITY_ID]
                },
                component: () => import('../pages/buying')
            },
            {
                name: 'limitpay',
                alias: 'limitpay',
                path: 'index/shophome/activity/buying/limitpay',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID, keys.OPEN_ID]
                },
                component: () => import('../pages/limitpay')
            },
            {
                name: 'buyingsuc',
                alias: 'buyingsuc',
                path: 'index/shophome/activity/buying/limitpay/buyingsuccess',
                meta: {
                    params: [keys.SESSION]
                },
                component: () => import('../pages/buyingsuccess')
            },
            {
                name: 'alldishes',
                alias: 'alldishes',
                path: 'index/shophome/alldishes',
                meta: {
                    params: [keys.SHOP]
                },
                component: () => import('../pages/alldishes')
            },
            {
                name: 'searchdish',
                alias: 'searchdish',
                path: 'index/shophome/alldishes/searchdish',
                meta: {
                    params: [keys.SHOP, keys.ORDER]
                },
                component: () => import('../pages/searchdish')
            },
            {
                name: 'dishdetail',
                alias: 'dishdetail',
                path: 'index/shophome/alldishes/dishdetail',
                meta: {
                    params: [keys.SHOP, keys.ORDER]
                },
                component: () => import('../pages/dishdetail')
            },
            {
                name: 'order',
                alias: 'order',
                path: 'index/shophome/alldishes/dishdetail/order',
                meta: {
                    params: [keys.ORDER, 'isCommitOrder'],
                    next: 'payment'
                },
                component: () => import('../pages/order')
            },
            {
                name: 'payment',
                alias: 'payment',
                path: 'index/shophome/alldishes/order/payment',
                meta: {
                    params: [keys.SESSION, keys.ORDER_ID, keys.OPEN_ID]
                },
                component: () => import('../pages/payment')
            },
            {
                name: 'wxpayredirect',
                alias: 'wxpayredirect',
                path: 'index/shophome/alldishes/order/payment/wxpayredirect',
                meta: {
                    params: [keys.SESSION, keys.ORDER, keys.SHOP, keys.ORDER_ID, keys.OPEN_ID]
                },
                component: () => import('../pages/wxpayredirect')
            },
            {
                name: 'paysuccess',
                alias: 'paysuccess',
                path: 'index/shophome/alldishes/order/payment/paysuccess',
                meta: {
                    params: [keys.SESSION, keys.ORDER]
                },
                component: () => import('../pages/paysuccess')
            },
            {
                name: 'sharebuying',
                alias: 'sharebuying',
                path: 'index/sharebuying',
                meta: {
                    params: []
                },
                component: () => import('../pages/sharebuying')
            },
            {
                name: 'sharebenefit',
                alias: 'sharebenefit',
                path: 'index/sharebenefit',
                meta: {
                    params: []
                },
                component: () => import('../pages/sharebenefit')
            },
            {
                name: 'sharelimitpay',
                alias: 'sharelimitpay',
                path: 'index/sharebuying/sharelimitpay',
                meta: {
                    params: [keys.OPEN_ID, keys.ORDER_ID]
                },
                component: () => import('../pages/sharelimitpay')
            },
            {
                name: 'sharebuyingsuc',
                alias: 'sharebuyingsuc',
                path: 'index/sharebuying/sharelimitpay/sharebuyingsuccess',
                meta: {
                    params: []
                },
                component: () => import('../pages/sharebuyingsuccess')
            },
            {
                name: 'other',
                path: '*', //其他页面，强制跳转到登录页面
                redirect: '/index'
            },
            {
                path: '/', //其他页面，强制跳转到登录页面
                redirect: '/index'
            }
        ]
    }
];

export default router;
