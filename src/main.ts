import { createApp } from "vue";
import App from "./App.vue";
import "./index.scss";
import { router } from './router';
import Vant from 'vant';
import 'vant/lib/index.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {post} from './common/http.js';
import {setLS,getLS,delLS} from './common/base';

const app = createApp(App);
app.config.globalProperties.$post=post;
app.config.globalProperties.$setLS=setLS;
app.config.globalProperties.$getLS=getLS;
app.config.globalProperties.$delLS=delLS;
app.use(router);
app.config.globalProperties.$router = router;
app.mount("#app");
app.use(Vant);
app.use(ElementPlus);