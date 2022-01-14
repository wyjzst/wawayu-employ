<template>
  <div class="layout flex-column">
    <div class="top-nav">
      <div class="head-sculpture">
        <img src="../assets/image/head-sculpture.png" alt="">
      </div>
      <div class="userInfo">
        <div class="username">{{data.Mobile}}</div>
        <div v-if="data.Status != 3" class="status">未认证</div>
        <div v-if="data.Status == 3" class="status" style="background-color:green">已认证</div>
      </div>
      <div class="logout" @click="onClick">退出登录</div>
    </div>

    <div class="money-card" style="display: none">
      <div class="flex-space-between">
        <h2>我的收益</h2>
        <div class="revenue"><router-link to="/revenue">收支明细</router-link></div>
      </div>
      <div class="flex-space-around">
        <div class="flex-column">
          <span>¥9.98</span>
          <span>账户总额</span>
        </div>
        <div class="flex-column">
          <span>¥9.98</span>
          <span>可提现金额</span>
        </div>
        <div class="flex-column">
          <span>¥9.98</span>
          <span>未结款项</span>
        </div>
      </div>
    </div>

    <div class="listContent">
      <router-link to="/profile">
        <div class="list">
          <div class="user-icon"><img src="../assets/image/user-info.png" alt=""></div>
          <div class="list-item flex-space-between">
            <span>个人资料</span>
            <img class="right-arrow" src="../assets/image/user-right-arrow.png" alt="">
          </div>
        </div>
      </router-link>
      <router-link v-if="data.Type == 1" to="/supplierAuth">
        <div class="list">
          <div class="user-icon">
            <img src="../assets/image/user-supplierAuth.png" alt="">
          </div>
          <div class="list-item flex-space-between">
            <span>供应商认证</span>
            <img class="right-arrow" src="../assets/image/user-right-arrow.png" alt="">
          </div>
        </div>
      </router-link>
      <router-link v-if="data.Type == 3" to="/supplierManagement">
        <div class="list">
          <div class="user-icon">
            <img src="../assets/image/user-management.png" alt="">
          </div>
          <div class="list-item flex-space-between">
            <span>供应商管理</span>
            <img class="right-arrow" src="../assets/image/user-right-arrow.png" alt="">
          </div>
        </div>
      </router-link>
      <router-link to="/pending">
        <div class="list">
          <div class="user-icon">
            <img src="../assets/image/user-pending.png" alt="">
          </div>
          <div class="list-item flex-space-between">
            <span>待处理的项目动态(0)</span>
            <img class="right-arrow" src="../assets/image/user-right-arrow.png" alt="">
          </div>
        </div>
      </router-link>
      <router-link to="/recommend">
        <div class="list">
          <div class="user-icon">
            <img src="../assets/image/user-recommend.png" alt="">
          </div>
          <div class="list-item flex-space-between">
            <span>更多项目推荐</span>
            <img class="right-arrow" src="../assets/image/user-right-arrow.png" alt="">
          </div>
        </div>
      </router-link>
      <router-link to="/changePassword">
        <div class="list">
          <div class="user-icon">
            <img src="../assets/image/user-password.png" alt="">
          </div>
          <div class="list-item flex-space-between">
            <span>修改密码</span>
            <img class="right-arrow" src="../assets/image/user-right-arrow.png" alt="">
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
  import {onMounted, getCurrentInstance, reactive} from 'vue'
  export default {
    components: {},
    setup() {
        const data = reactive({
            Mobile : '',
        });
        const { proxy } = getCurrentInstance();
        const that = proxy;
        onMounted(() => {
          let AdminInfoStr = that.$getLS('AdminInfo');
          let AdminInfo = JSON.parse(AdminInfoStr);
          data.Mobile = AdminInfo.Tel;
          data.Type = AdminInfo.Type;
          data.Status = AdminInfo.Status;
        })
        return {data}
    },
    methods: {
      onClick() {
        this.$delLS('token');
        this.$delLS('AdminInfo');
        this.$delLS('showMOdifyTips');
        location.reload();
      },
    }
  };
</script>
<style lang="scss" scoped>
  .layout {

    .top-nav {
      height: 3rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: linear-gradient(to right, rgb(21 117 246), rgb(0 165 255));
      position: relative;

      > .head-sculpture {
        margin-left: .48rem;
        width: 1.5rem;

        > img {
          width: 100%;
        }
      }

      > .userInfo {
        margin-left: .4rem;
        display: flex;
        flex-direction: column;
        line-height: .5rem;

        > .username {
          margin-bottom: .1rem;
        }

        > .status {
          width: 1.5rem;
          color: rgb(255, 255, 255);
          background-color: rgb(237, 64, 20);
          border-radius: 5px;
          text-align: center;
        }
      }

    }

    .money-card {
      background: #fff;
      margin: 10px;
      padding: 10px;
      border-radius: 6px;

      .revenue {
        color: #f60;
      }

      .flex-column{
        span:first-child {
          //color: #f60;
        }
      }
    }

    .listContent {
      margin: 10px;
      border-radius: 4px;

      .list {
        height: 1rem;
        display: flex;
        align-items: center;
        background: #fff;

        .list-item {
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          border-bottom: 1px solid #E4E6E8;
          align-items: center;
          padding-right: 10px;

          .right-arrow {
            width: .32rem;
            height: .32rem;
          }
        }
        
        .user-icon {
          width: .8rem;
          margin: 10px 14px;

          img {
            width: 100%;
          }
        }
      }

    }
    
    .listContent>a:last-child>.list>.list-item {
      border-bottom: none;
    }

    .logout {
      position: absolute;
      font-size: 15px;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
  }
</style>