<template>
  <div class="topnav">
    <div class="back" @click="$router.back()"><img src="../assets/image/back.png" alt=""></div>
    <div class="more"><img src="../assets/image/more.png" alt=""></div>
  </div>
</template>
<script lang="ts">
  import { inject, Ref } from "vue";

export default {};
</script>
<style lang="scss" scoped>
.topnav {
  width: 100%;
  height: 40px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;;
  align-items: center;
  border-bottom: 1px solid #F1F4F8;
  background: #FFF;

  > .back {
    margin-left: .48rem;
    width: 1em;

    img {
      width: 100%;
    }
  }
  > .more {
    display: flex;
    margin-right: .48rem;
    width: .5rem;

    img {
      width: 100%;
    }
  }
}
</style>