import store from '../store';
import { browser } from '../utils';

//下单
export function addOrder(cb) {
    let state = store.getters;
    let order = state.order;

    let orderParams = {
        shopId: state.shopId, //店铺ID
        dinersNum: order.dinersNum, //用餐人数
        remark: order.remark, //菜品要求
        itemList: order.dishes.map(({ itemId, quantity }) => {
            return { itemId, quantity };
        }), //菜品信息
        needPayMoney: order.needPayMoney, //支付金额（后台校验）
        preferentialMoney: order.preferentialMoney, //菜品优惠价格(是否使用全美食优惠)
        ...order.scan, //扫码信息
        src: browser().isWeixin ? 'weixin' : 'wap' //为了区分微信公众号支付还是App微信支付
    };

    store._actions._ajax[0]({
        name: 'addOrder',
        options: orderParams
    }).then(res => {
        order.orderId = res.orderId;
        store._actions._orderId[0](res.orderId);
        store._actions._order[0](order);
        cb && cb();
    });
}

//修改加菜
export function addOrderItem(cb, option) {
    let state = store.getters;
    let order = state.order;

    let orderParams = {
        id: order.orderId,
        dinersNum: order.dinersNum,
        remark: order.remark,
        itemList: order.dishes.map(({ itemId, quantity }) => {
            return { itemId, quantity };
        }), //菜品信息
        needPayMoney: order.needPayMoney,
        ...option
    };

    store._actions._ajax[0]({
        name: 'addOrderItem',
        options: orderParams
    }).then(() => {
        cb && cb();
    });
}

//修改订单
export function updateOrder(cb, option = {}) {
    let state = store.getters;
    let order = state.order;

    let orderParams = {
        id: order.orderId,
        dinersNum: order.dinersNum,
        remark: order.remark,
        needPayMoney: order.needPayMoney,
        ...option
    };

    if (order.dishes && order.dishes.length) {
        orderParams.itemList = order.dishes.map(({ itemId, quantity }) => {
            return { itemId, quantity };
        });
    }

    store._actions._ajax[0]({
        name: 'updateOrder',
        options: orderParams
    }).then(() => {
        cb && cb();
    });
}

//下单（判断是下单/改订/加菜）
export function reqOrder(cb, option) {
    function clearOrder() {
        let order = store.getters.order;

        //下完单清掉购物车,保留扫码状态
        store._actions._order[0]({ scan: order.scan });
        cb();
    }

    if (store.getters.order.orderId) {
        if (store.getters.order.addDish) {
            addOrderItem(clearOrder, option);
        } else {
            updateOrder(clearOrder, option);
        }
    } else {
        addOrder(clearOrder);
    }
}
