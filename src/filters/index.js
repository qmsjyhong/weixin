import Vue from 'vue';
import { formatPrice } from '../utils';

//金额
Vue.filter('currency', money => formatPrice(money));
