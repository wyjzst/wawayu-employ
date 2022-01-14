<template>
  <div style="background: white;height: 100vh;">
    <div class="banner" v-show="box">
      <h1>欢迎登录</h1>
      <van-form class="content">
        <van-cell-group inset v-show="tab">
          <van-field
              v-model="username"
              label="手机号"
              placeholder="手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
          />
          <van-field
              v-model="password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <van-cell-group inset v-show="!tab" >
          <van-field
              v-model="username"
              label="手机号"
              placeholder="手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
          />
          <van-field
              v-model="code"
              label="验证码"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '验证码错误' }]"
          >
          <template #button>
            <van-button size="small" @click="getCode(3)" type="primary">发送验证码</van-button>
          </template>
          </van-field>
        </van-cell-group>
        <div class="flex-space-between p20">
        <div class="tabs" @click="exchange()" v-show="tab" >手机验证码登录</div>
        <div class="tabs" @click="exchange()"  v-show="!tab">密码登录</div>
          <div class="forget" @click="reset()">忘记密码?</div>
        </div>
          <div class="m16">
            <van-button round block type="primary" native-type="submit" @click="loginSubmit">
              登录
            </van-button>
          </div>
        <router-link to="/register">
          <div style="margin: 16px;">
            <van-button round block plain type="primary" native-type="submit">
              注册
            </van-button>
          </div>
        </router-link>
      </van-form>
      <div class="tip">登录即代表你同意
        <router-link to="/Agreement" class="blue">娃娃鱼项目外包服务平台服务条款</router-link>
      </div>
      </div>
    <div class="banner" v-show="!box">
        <h1>重置密码</h1>
        <van-form class="content">
          <van-cell-group inset>
            <van-field
                v-model="username"
                label="手机号"
                placeholder="手机号"
                :rules="[{ required: true, message: '请填写手机号' }]"
            />
            <van-field
                v-model="password"
                type="password"
                label="重置密码"
                placeholder="请输入新密码"
                :rules="[{ required: true, message: '请填写新密码' }]"
            />
            <van-field
              v-model="code"
              label="验证码"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '验证码错误' }]"
          >
            <template #button>
              <van-button size="small" @click="getCode(2)" type="primary">发送验证码</van-button>
            </template>
          </van-field>
          </van-cell-group>

          <router-link to="">
            <div class="m16">
              <van-button round block type="primary" @click="resetSubmit" native-type="submit">
                重置密码
              </van-button>
            </div>
          </router-link>
          <div>
            <div style="margin: 16px;">
              <van-button round block plain type="primary"  @click="reset()">
                返回
              </van-button>
            </div>
          </div>
        </van-form>
      </div>
    </div>
</template>
<script lang="ts">

  import {ref} from 'vue';
  import { ElMessage } from 'element-plus'

  export default {
    components: {},
    setup() {
      const username = ref('');
      const password = ref('');
      const code = ref('');
      return {username, password, code};
    },
    methods: {
      exchange() {
        this.tab = !this.tab
      },
      reset() {
        this.box = !this.box
      },
      loginSubmit(){//登录
        let params = {};
        if (this.tab) {
          params = {
              Tel: this.username,
              Password: this.password,
              TelCode: 86,//区号
          }
        } else {
          params = {
              Tel: this.username,
              code: this.code,
              TelCode: 86,//区号
          }
        }
        if(this.username && (this.code || this.password)){
          this.$post('api/Login/login', params).then(res => {
              if(res.code == 1){
                  this.$setLS('AdminInfo',JSON.stringify(res.AdminInfo))
                  this.$setLS('token',res.token)
                  ElMessage.success('登录成功');
                  this.$router.push({ path: "/user"});
              }else{  
                  if(res.msg == '密码输入错误！' || res.msg == '验证码已经失效，请重新发送！' || res.msg == '验证码输入有误，请重新输入！'){
                      this.isPassword = 2;
                  }
                  ElMessage.error(res.msg)
              }
          })
        }else{
            ElMessage.error('请输入完整')
        }
      },
      resetSubmit(){//登录
        let params = {
          Tel: this.username,
          Password: this.password,
          TelCode: '86',//区号
          code: this.code,
        }

        if (this.username && this.code && this.password) {
          this.$post('api/Login/forgetPassword', params).then(res => {
              if(res.code == 1){
                ElMessage.success('重置密码成功');
                this.box = false;
              }else{  
                ElMessage.error(res.msg)
              }
          })
        } else {
            ElMessage.error('请输入完整')
        }
      },
      getCode(type){
        let params = {
          type: type,
          Tel: this.username,
          TelCode: '86',//区号
        }
        if(this.username){
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
    },
    data() {
      return {
        tab: true,
        box: true,
      }
    }
  };
</script>
<style lang="scss" scoped>
  .p20 {
    padding: 0 20px;
  }

  .m16 {
    margin: 16px;
  }

  .tabs {
    color: #f60;
  }

  .forget {
    color:#0AE;
  }

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