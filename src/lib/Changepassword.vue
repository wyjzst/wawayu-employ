<template>
  <div class="main">
    <van-nav-bar
        title="修改密码"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    />
    <van-form >
    <van-cell-group inset>
      <van-field
          v-model="oldPwd"
          type="password"
          required
          label="原密码"
          placeholder="请输入原密码"
          :rules="[{ required: true, message: '请输入原密码' }]"
      />
      <van-field
          v-model="newPwd"
          type="password"
          required
          label="新密码"
          placeholder="请输入新密码"
          :rules="[{ required: true, message: '请输入新密码' },{ pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/, message: '密码格式不正确'}]"
      />
      <van-field
          v-model="newPwdComfirm"
          type="password"
          required
          label="确认新密码"
          placeholder="请输入确认新密码"
          :rules="[{ required: true, message: '请输入确认新密码' },{ pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/, message: '密码格式不正确'}]"
      >
      </van-field>
    </van-cell-group>
    <div class="tip">密码必须是8-16位的英文字母、数字组合(不能是纯数字)</div>
     <div class="comfirm-row">
       <van-button class="confirm" type="primary" size="normal" native-type="submit" @click="loginSubmit">修改密码</van-button>
     </div>
    </van-form>
  </div>
</template>


<script>
  import {ref, getCurrentInstance} from 'vue'
  import {router} from "../router"
  import {ElMessage } from 'element-plus'

  export default {
    components: {},
    setup() {
      const { proxy } = getCurrentInstance();
      const that = proxy;
      
      let formValidateObjStr = that.$getLS('AdminInfo');
      let formValidateObj = JSON.parse(formValidateObjStr);
      const Tel = formValidateObj.Tel;
      const onClickLeft = () => router.back()
      const oldPwd = ref('')
      const newPwd = ref('')
      const newPwdComfirm = ref('')

      return {onClickLeft, oldPwd, newPwd, newPwdComfirm, Tel}
    },
    methods: {
      loginSubmit(){//登录
          if (this.oldPwd && this.newPwd && this.newPwdComfirm) {
            if (this.newPwd != this.newPwdComfirm) {
              ElMessage.error('两次输入新密码不同');
              return;
            }
            let params={
              NewPassword: this.newPwd,
              OldPassword: this.oldPwd,
              Tel: this.Tel,
            }
            this.$post('api/manage.PersonCenter/editPassword', params).then(res=>{
              if(res.code == 1){
                ElMessage.success(res.msg);
                this.$router.push({path: "/user"});
              }else{
                ElMessage.error(res.msg);
              }
            })
          } else {
              ElMessage.error('请输入完整')
          }
        },
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    display: flex;
    flex-direction: column;
  }

  .tip {
    margin-top: 5px;
    margin-left: 10px;
    font-size: .2rem;
    color: #000;
  }

  .comfirm-row {
    text-align: center;
    .confirm {
      margin:30px auto 0;
      width: 5rem;
      border-radius: 6px;
    }
  }
</style>