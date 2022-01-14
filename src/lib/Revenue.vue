<template>
  <van-nav-bar
      title="收支明细"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
  />
  <van-cell title="选择日期区间" :value="date" @click="show = true" />
  <van-calendar v-model:show="show" type="range" @confirm="onConfirm" />
</template>

<script>
  import { ref } from 'vue';
  import {router} from "../router"

  export default {
    setup() {
      const date = ref('');
      const show = ref(false);
      const onClickLeft = () => router.back()

      const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
      const onConfirm = (values) => {
        const [start, end] = values;
        show.value = false;
        date.value = `${formatDate(start)} - ${formatDate(end)}`;
      };

      return {
        onClickLeft,
        date,
        show,
        onConfirm,
      };
    },
  }
</script>

<style scoped>

</style>