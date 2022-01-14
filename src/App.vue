<template>
  <router-view />
</template>

<script lang="ts">
import { ref, provide, onMounted, getCurrentInstance } from "vue";
import { router } from "./router";

export default {
  name: "App",
  setup() {
    const { proxy } = getCurrentInstance();
    const that = proxy;
    const width = document.documentElement.clientWidth;
    const menuVisible = ref(width <= 500 ? false : true);

    onMounted(() => {
      let token = that.$getLS('token');
      let AdminInfo = that.$getLS('AdminInfo');
      if (token && AdminInfo) {
        that.$router.push('/user');
      } else {
        that.$router.push('/');
      }
    })

    provide("menuVisible", menuVisible); // set
    router.afterEach(() => {
      if (width <= 500) {
        menuVisible.value = false;
      }
    });
  },
};
</script>
