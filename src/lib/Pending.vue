<template>
  <van-nav-bar
      title="待处理项目动态"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
  />
  <section class="flex-center flex-column">
    <div class="img flex-center flex-column">
      <img src="../assets/image/nothing.png" alt="">
      <div style="font-size: 24px;margin-top: 20px;">暂无内容</div>
    </div>
  </section>
</template>


<script>
  import {router} from "../router"

  export default {
    components: {},
    setup() {
      const onClickLeft = () => router.back()
      return {onClickLeft}
    },
  }
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
    height: 100vh;
  }
  .img{
    width: 5rem;
  }
  img {
    width: 100%;
  }
</style>