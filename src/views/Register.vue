<template>
  <div  style="background: white;height: 100vh;">
    <div class="banner">
      <h1>注册</h1>
      <van-form @submit="onSubmit" class="content">
        <van-cell-group inset>
          <van-field
              v-model="tel"
              center
              clearable
              label="手机号"
              placeholder="手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
          >
            <template #button>
              <van-button size="small" @click="getCode" type="primary">发送验证码</van-button>
            </template>
          </van-field>
          <van-field
              v-model="password"
              type="password"
              label="登录密码"
              placeholder="设置登录密码"
              :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
              v-model="sms"
              type="text"
              label="验证码"
              placeholder="请输入短信验证码"
              :rules="[{ required: true, message: '验证码错误' }]"
          />
        </van-cell-group>
        <router-link to="">
          <div style="margin: 16px;">
            <van-button round block type="primary" @click="regSubmit" native-type="submit">
              注册
            </van-button>
          </div>
        </router-link>
        <router-link to="/">
          <div style="margin: 16px;">
            <van-button round block plain type="primary" native-type="submit">
              登录
            </van-button>
          </div>
        </router-link>
      </van-form>
    </div>
  </div>
</template>
<script lang="ts">
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';

  export default {
    components: {},
    setup() {
      const tel = ref('');
      const password = ref('');
      const sms = ref('');
      return {tel,sms, password};
    },
    methods: {
      getCode() {
        let params = {
          type: 1,
          Tel: this.tel,
          TelCode: '86',//区号
        }
        if(this.tel){
          this.$post('api/Login/sendCode',params).then(res=>{
            if(res.code == 1){
              ElMessage.success(res.msg);
            }else{
              ElMessage.error(res.msg);
            }
          })
        } else {
          ElMessage.error('请填写正确的手机号码')
        }
      },
      regSubmit() {// 注册
        // /^1[3456789]\d{9}$/.test(Tel)
        let params = {
          Tel: this.tel,
          Password: this.password,
          code: this.sms,
          TelCode: '86',//区号
        }
        if(this.tel){
          this.$post('api/Login/register',params).then(res=>{
            if (res.code == 1){
              ElMessage.success('注册成功,请登录');
              this.$router.push({ path: "/"});
            } else {
              ElMessage.error(res.msg);
            }
          })
        } else {
          ElMessage.error('请填写正确的手机号码')
        }
      },
    }
  };
</script>
<style lang="scss" scoped>
  .blue {
    color: #00a1d6;
  }

  .banner {
    padding: 100px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .content {
      width: 100%;
    }
  }

  .tip {
    width: 83%;
    margin: auto;
    font-size: .2rem;
    color: #000;
  }
</style>