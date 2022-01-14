import {createWebHashHistory, createRouter} from 'vue-router';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Agreement from './views/Agreement.vue';
import User from './views/User.vue';
import Profile from './lib/Profile.vue';
import SupplierAuth from './lib/SupplierAuth.vue';
import SupplierManagement from './lib/SupplierManagement.vue';
import SupplierDetail from './lib/SupplierDetail.vue';
import Order from './lib/Order.vue';
import ChangePassword from './lib/Changepassword.vue';
import Revenue from './lib/Revenue.vue';
import Pending from './lib/Pending.vue';
import Recommend from './lib/Recommend.vue';

const history = createWebHashHistory();
export const router = createRouter({
  history: history,
  routes: [
    {
      path: '/',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/agreement',
      component: Agreement
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '/revenue',
      component: Revenue
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/supplierAuth',
      component: SupplierAuth
    },
    {
      path: '/supplierManagement',
      component: SupplierManagement
    },
    {
      path:'/supplierDetail',
      component: SupplierDetail
    },
    {
      path: '/order',
      component: Order
    },
    {
      path: '/pending',
      component: Pending
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/changePassword',
      component: ChangePassword
    },

  ],
});
// router.afterEach(() => {
//   console.log('路由切换了');
// });
