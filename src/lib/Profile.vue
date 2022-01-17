<template>
  <div class="main mt46">
    <van-nav-bar
        fixed="fixed"
        z-index="99"
        title="个人资料"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="h10"></div>
    <van-form>
    <van-cell-group inset class="mt10 mb10">
      <van-field
          v-model="formValidate.Realname"
          required
          label="联系人"
          placeholder="请输入联系人"
          :rules="[{ required: true, message: '联系人不能为空' }]"
      />
      <van-field
          v-model="formValidate.Tel"
          required
          label="手机号"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '手机号格式错误' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机格式'}
          ]"
      >
        <template #button>
          <van-button size="small" @click="showModifyMobile = !showModifyMobile" type="primary">修改手机号</van-button>
        </template>
      </van-field>
      <van-field
          v-show="showModifyMobile"
          v-model="formValidate.mobileCode"
          center
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button size="small" type="primary" @click="sendTel">发送验证码</van-button>
        </template>
      </van-field>
      <van-field
          v-model="formValidate.Email"
          required
          label="绑定邮箱"
          placeholder="请输入邮箱"
          :rules="[
            { required: true, message: '请填写您的邮箱' },
            { pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, message: '邮箱格式不正确'}
          ]"
       />
      <van-field v-model="formValidate.QQ" type="number" label="联系QQ"/>
      <van-field v-model="formValidate.WX" type="text" label="联系微信"/>
      <van-cell class="choose" required value="擅长项目"/>

      <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          :default-expanded-keys="openIdArr"
          :default-checked-keys="checkIdArr"
          :props="defaultProps"
          @check="checkFav"
      >
      </el-tree>
      <el-tag
          :key="tag"
          v-for="tag in formValidate.Skill"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          style="margin:0 0 5px 10px;"
      >
        {{ tag }}
      </el-tag>
      <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加技术标签</el-button>
      <van-field
        v-model="result"
        is-link
        readonly
        required
        name="area"
        label="工作地"
        placeholder="点击选择省市区"
        @click="showArea = true"
      />
      <van-popup v-model:show="showArea" position="bottom">
        <van-area
          :area-list="areaList"
          :value="formValidate.Address.Area"
          @confirm="onConfirm"
          @cancel="showArea = false"
        />
      </van-popup>
      <van-field v-model="formValidate.Alipay" label="支付宝账号"/>
      <van-field v-model="formValidate.AlipayRealname" label="支付宝实名"/>
      <van-field v-model="formValidate.Bank.Account" label="银行卡号"/>
      <van-field v-model="formValidate.Bank.Name" label="户名"/>
      <van-field v-model="formValidate.Bank.Username" label="开户行"/>
    </van-cell-group>
    <div class="h10"></div>
    <div class="h10"></div>
    <div class="flex-center">
      <van-button type="success" class="save" @click="handleSubmit" >保存</van-button>
    </div>
    </van-form>
    <div class="h10"></div>
    <div class="h10"></div>
    <div class="h10"></div>
    <div class="h10"></div>
  </div>
</template>

<script>
  import {ref, reactive, getCurrentInstance} from 'vue'
  import {router} from "../router"
  import {areaList} from "@vant/area-data/src"
  import {ElMessage} from 'element-plus';

  export default {
    components: {},
    setup() {
      const { proxy } = getCurrentInstance();
      const that = proxy;
      const onClickLeft = () => router.back();
      let formValidateObj =  {};
      let formValidateStr = that.$getLS('AdminInfo');
      if (formValidateObj) {
        formValidateObj = JSON.parse(formValidateStr);
        if (typeof formValidateObj.Fields != 'object') {
          formValidateObj.Fields = JSON.parse(formValidateObj.Fields);
        }
        if (!formValidateObj) {
          that.$router.push('/');
        } else {
          if (!formValidateObj.Skill) {
            formValidateObj.Skill = [];
          } else {
            formValidateObj.Skill = formValidateObj.Skill.split(',');
          }
          if (!formValidateObj.Bank) {
            formValidateObj.Bank = {Username: '', Account: '',Name: ''};
          }
        }
      } else {
        that.$router.push('/');
      }

      if (!formValidateObj.Address) {
        formValidateObj.Address = {
          Province: '',
          City: '',
          Area : '',
        }
      }

      const formValidate = reactive(formValidateObj);

      // console.log(formValidate);
      // console.log(areaList);

      //地区选择功能
      let resultStr = '';

      for (let i in areaList.province_list) {
        if ( i == formValidateObj?.Address?.Province ) {
          resultStr += areaList.province_list[i];
        }
      }

      for (let i in areaList.city_list) {
        if ( i == formValidateObj?.Address?.City ) {
          resultStr += '/'+areaList.city_list[i];
        }
      }

      for (let i in areaList.county_list) {
        if ( i == formValidateObj?.Address?.Area ) {
          resultStr += '/'+areaList.county_list[i];
        }
      }

      const result = ref(resultStr);
      const showArea = ref(false);
      const onConfirm = (values) => {
        showArea.value = false;
        // console.log('values:'+JSON.stringify(values));
        formValidate.Address = {};
        formValidate.Address.Province = values[0].code;
        formValidate.Address.City = values[1].code;
        formValidate.Address.Area = values[2].code;
        // console.log('address:'+JSON.stringify(formValidate.Address));
        result.value = values
          .filter((item) => !!item)
          .map((item) => item.name)
          .join('/')
        // console.log('result:'+JSON.stringify(result));
      }

      const dataList = [
        {
          id: 1,
          label: '2D',
          children: [
            {
              id: 8,
              label: '设计稿',
            },
            {
              id: 9,
              label: '一原',
            },
            {
              id: 10,
              label: '二原',
            },
            {
              id: 11,
              label: '动上',
            },
            {
              id: 12,
              label: '摄影',
            },
            {
              id: 13,
              label: '背景',
            },
          ],
        },
        {
          id: 2,
          label: '3D',
          children: [
            {
              id: 14,
              label: '人物模型',
            },
            {
              id: 15,
              label: '人物材质',
            },
            {
              id: 16,
              label: '场景模型',
            },
            {
              id: 17,
              label: '场景材质',
            },
            {
              id: 18,
              label: '绑定',
            },
            {
              id: 19,
              label: '动画',
            },
            {
              id: 20,
              label: '特效',
            },
            {
              id: 21,
              label: '灯光',
            },
            {
              id: 22,
              label: '渲染',
            },
          ],
        },
        {
          id: 3,
          label: '平面',
          children: [
            {
              id: 23,
              label: '海报',
            },
            {
              id: 24,
              label: '插画',
            },
            {
              id: 25,
              label: '立绘',
            },
          ],
        },
        {
          id: 4,
          label: '大后期',
          children: [
            {
              id: 26,
              label: '配音',
            },
            {
              id: 27,
              label: '音乐',
            },
            {
              id: 28,
              label: '音效/混音',
            },
          ],
        },
        {
          id: 5,
          label: '前期',
          children: [
            {
              id: 29,
              label: '分镜',
            },
            {
              id: 30,
              label: '剧本',
            },
            {
              id: 31,
              label: '人设',
            },
            {
              id: 32,
              label: '场设',
            },
            {
              id: 33,
              label: '道具',
            },
          ],
        },
        {
          id: 6,
          label: '3渲2',
        },
        {
          id: 7,
          label: '其他',
        },
      ];


      let fields = formValidateObj.Fields;

      let openIdArr = [];
      let checkIdArr = [];

      if (fields) {
        for (let f of fields) {
          let fArr = f.split('-');
          for (let d of dataList) {
            if (fArr[0] == d.label) {
              if (d.children) {
                openIdArr.push(d.id);
                for(let c of d.children) {
                  if (fArr[1] == c.label) {
                    checkIdArr.push(c.id);
                    break;
                  }
                }
              } else {
                checkIdArr.push(d.id);
              }
              break;
            }
          }
        }
      }

      const data = ref(dataList);
      const showModifyMobile = ref(false);
      const inputVisible = ref(false);

      return {
        formValidate,
        result,
        areaList,
        showArea,
        data,
        openIdArr,
        checkIdArr,
        showModifyMobile,
        inputVisible,
        onClickLeft,
        onConfirm,
      }
    },
    data() {
      return {
        props: {
          label: 'name',
          children: 'zones',
        },
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        inputValue: '',
      }
    },
    methods: {
      sendTel() {
        var params = {
          type: 4,
          Tel: this.formValidate.Tel,
          TelCode: '86'
        }
        if (this.formValidate.Tel) {
          this.$post('api/Login/sendCode', params).then(res=>{
            if (res.code == 1) {
              ElMessage.success(res.msg);
            } else {
              ElMessage.error(res.msg);
            }
          })
        } else {
          ElMessage.error('请输入区号和手机号码');
        }
      },
      checkFav(data) {
        let dataCheckArr = [];
        for (let d of this.data) {
          if (d.label == data.label) {
            if (d.children) {
              for (let c of d.children) {
                dataCheckArr.push(d.label+'-'+c.label);
              }
            } else {
              dataCheckArr = [d.label];
            }
            break;
          } else {
            if (d.children) {
              let isMatchChild = false;
              for (let c of d.children) {
                if (c.label == data.label) {
                  dataCheckArr = [d.label+'-'+c.label];
                  isMatchChild = true;
                  break;
                }
              }
              if (isMatchChild) {
                break;
              }
            }
          }
        }

        let dataCheckArrStore = JSON.parse(JSON.stringify(dataCheckArr));

        if (this.formValidate.Fields) {
          let isFound = false;
          let i = 0;
          while (i < this.formValidate.Fields.length) {
            let isSplice = false;
            for (let j in dataCheckArr) {
              if (this.formValidate.Fields[i] == dataCheckArr[j]) {
                this.formValidate.Fields.splice(i, 1);
                dataCheckArr.splice(j, 1);
                isSplice = true;
                isFound = true;
                break;
              }
            }
            if (!isSplice) {
              i++;
            }
            if (dataCheckArr.length == 0) {
              break;
            }
          }
          if (!isFound || dataCheckArr.length > 0) {
            this.formValidate.Fields = this.formValidate.Fields.concat(dataCheckArrStore);
          }
        } else {
          this.formValidate.Fields = dataCheckArr;
        }
        // console.log('fileds:'+JSON.stringify(this.formValidate.Fields));
      },
      handleClose(tag) {
        this.formValidate.Skill.splice(this.formValidate.Skill.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
      },

      handleInputConfirm() {
        if (this.inputValue) {
          this.formValidate.Skill.push(this.inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
        return;
      },

      handleSubmit() {

        if (!this.formValidate.Realname) {
          ElMessage.error('联系人不能为空');
          return;
        }

        if (!this.formValidate.Email) {
          ElMessage.error('邮箱不能为空');
          return;
        }

        if (!this.formValidate.Fields ||　this.formValidate.Fields.length == 0) {
          ElMessage.error('请选择擅长项目');
          return;
        }

        if (!this.formValidate.Address) {
          ElMessage.error('请选择工作地');
          return;
        }

        if(this.showModifyMobile && !this.formValidate.mobileCode){
            ElMessage.error('手机验证码不能为空');
            return false;
        }

        if(this.isEmail && !this.formValidate.mailCode){
            ElMessage.error('邮箱验证码不能为空');
            return false;
        }
        // console.log(this.formValidate);return;
        var params = {
            Realname: this.formValidate.Realname,
            Tel:  this.formValidate.Tel,
            mobileCode: this.formValidate.mobileCode,
            Email:  this.formValidate.Email,
            EmailCode:  this.formValidate.mailCode,
            QQ: this.formValidate.QQ,
            WX: this.formValidate.WX,
            Fields: this.formValidate.Fields,
            Skill:  this.formValidate.Skill.length > 0 ? this.formValidate.Skill.join(',') : '',
            Address: this.formValidate.Address,
            Alipay: this.formValidate.Alipay,
            AlipayRealname: this.formValidate.AlipayRealname,
            Bank: this.formValidate.Bank,
            TelCode: '86',
            Status: 1,
        }
        this.$post('api/manage.PersonCenter/editMember',params).then(res => {
          if(res.code == 1) {
            this.formValidate.mailCode = '';
            this.formValidate.Status = 1;
            if (this.formValidate.Skill) {
              this.formValidate.Skill = this.formValidate.Skill.join(',');
            } else {
              this.formValidate.Skill = '';
            }
            this.$setLS('AdminInfo',JSON.stringify(this.formValidate));
            this.formValidate.Skill = this.formValidate.Skill.split(',');
            ElMessage.success(res.msg);
          } else {
            ElMessage.error(res.msg);
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .choose::after {
    border-bottom: none;
  }

  .save {
    border-radius: 5px;
    width: 1.5rem;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>