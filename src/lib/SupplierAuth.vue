<template>
  <div class="main mt46">
    <van-nav-bar
        fixed="fixed"
        title="供应商认证"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="h10"></div>
    <p class="tipComment" :class="{'tipsActive': formValidate.Status == 3}" v-if="(formValidate.Status == 1 || formValidate.Status == 3) && formValidate.AuditTime">{{formValidate.AuditTime}} 
      <span v-if="formValidate.Status == 1 && formValidate.AuditComment">审核退回 ： {{formValidate.AuditComment}}</span>
      <span v-if="formValidate.Status == 3">审核通过</span>
    </p>
    <van-button v-if="formValidate.Status == 3" type="success" style="margin-top: 100px;margin-left: 35%;" @click="handlemodifyInfo">修改供应商信息</van-button >
    <van-form v-if="formValidate.Status == 1 || formValidate.Status == 4">
    <van-field name="radio" required label="供应商类型">
      <template #input>
        <van-radio-group v-model="formValidate.VerifyType" direction="horizontal">
          <van-radio style="margin-bottom: 10px;" name="1">个人</van-radio>
          <van-radio name="2">工作室 / 公司</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-field
      v-if="formValidate.VerifyType == 2"
      v-model="formValidate.Scale"
      required
      name="Scale"
      label="规模"
      placeholder="点击选择规模"
      @click="showPicker = true"
      :rules="[{ required: true, message: '请选择规模' }]"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="scaleArr"
        @confirm="chooseScale"
        @cancel="showPicker = false"
      />
    </van-popup>
    <van-field name="radio" required label="有效证件">
      <template #input>
        <van-uploader :after-read="onRead" :accept="'image/*'" multiple :preview-image="false" v-show="formValidate.Certificate.length < 3"/>
        <div class="posting-uploader-item" v-for="(item, index) in formValidate.Certificate" :key="index">
          <img :src="picBaseUrl + item" alt="图片" class="imgPreview">
          <van-icon name="close" @click="delImg(index)" class="delete"/>
        </div>
      </template>
    </van-field>
    <van-field v-if="formValidate.VerifyType == 2" v-model="formValidate.CompanyName" required :rules="[{ required: true, message: '请填写企业名称' }]" label="企业名称" placeholder="请输入企业名称"/>
    <van-field v-if="formValidate.VerifyType == 2" v-model="formValidate.CompanyAddress" required :rules="[{ required: true, message: '请填写企业住所' }]" label="企业住所" placeholder="请输入企业住所"/>
    <van-field v-if="formValidate.VerifyType == 2" v-model="formValidate.CompanyLeader" required :rules="[{ required: true, message: '请填写企业法人' }]" label="企业法人" placeholder="请输入企业法人"/>
    <van-field v-if="formValidate.VerifyType == 2" v-model="formValidate.CompanyCode" label="社会统一信用代码" placeholder="请输入社会统一信用代码"/>
    <van-cell v-if="formValidate.VerifyType == 2" title="企业成立日期" :value="formValidate.CompanyDate" @click="showCalendar = true" />
    <van-calendar v-model:show="showCalendar" :min-date="new Date(2000,1,1)" title="企业成立日期" @confirm="onConfirmCalendar" />
    <van-field
      class="experience"
      label="项目经历"
      v-model="formValidate.ItemProcess"
      required
      :rules="[{ required: true, message: '请填写项目经历' }]"
      rows="4"
      type="textarea"
      clearable:true
      placeholder="请输入项目制作经历"
    />
    <van-field
        v-model="result"
        is-link
        readonly
        required
        name="area"
        label="通讯地址"
        placeholder="点击选择省市区"
        @click="showArea = true"
        :rules="[{ required: true, message: '请选择省市区' }]"
    />
    <van-popup v-model:show="showArea" position="bottom">
      <van-area
          :area-list="areaList"
          :value="formValidate.TelAddress.Area"
          @confirm="onConfirm"
          @cancel="showArea = false"
      />
    </van-popup>
    <van-field v-model="formValidate.DetailedAddress" :rules="[{ required: true, message: '请输入详细地址' }]" label="&nbsp" placeholder="请输入详细地址"/>
    <van-field v-model="formValidate.ContactName" required :rules="[{ required: true, message: '请输入联系人' }]" label="联系人" placeholder="请输入联系人"/>
    <van-field v-model="formValidate.ContactWay" required :rules="[{ required: true, message: '请输入联系方式' }, { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机格式'}]" label="联系方式" placeholder="请输入联系方式"/>
    <van-field name="radio" required label="作品展示">
      <template #input>
        <van-uploader :after-read="onReadFile" multiple :preview-image="false" accept="audio/mp3, video/mp4, .pdf">
          <van-button icon="plus" type="primary">上传文件</van-button>
        </van-uploader>
      </template>
    </van-field>
    <ul class="file-list">
      <li v-for="(item,index) in formValidate.FilePath">
        <span @click="downLoad(item)">{{item}}</span>
        <van-icon name="close" @click="delFile(index)" class="delete"/>
      </li>
    </ul>
    <div class="h10"></div>
    <div class="h10"></div>
    <div class="h10"></div>
    <div class="h10"></div>
    <div class="flex-center">
      <van-button v-if="formValidate.Status == 1" type="success" class="save" native-type="submit" @click="handleSubmit" >提交认证</van-button>
      <van-button v-if="formValidate.Status == 4" type="success" class="save" native-type="submit" @click="handleSubmitModify" >确认修改信息</van-button>
    </div>
    </van-form>
    <div class="tips" v-if="formValidate.Status == 2">
        <van-icon class="icon" name="checked" color="green" size="20"/>
        <span v-if="Number($getLS('showMOdifyTips')) === 1">更新供应商信息已提交。</span>
        <span v-if="Number($getLS('showMOdifyTips')) === 0 || !Number($getLS('showMOdifyTips'))">供应商认证已提交，请耐心等待工作人员审核</span>
    </div>
      <div class="tips" v-if="formValidate.Status == 0">
        <van-icon class="icon" name="clear" color="red" size="20"/><span >请先<span class="improveinfo" @click="handleImproveInfo">完善用户</span>资料，再重新提交认证！</span>
    </div>
  </div>
</template>


<script>
  import {ref, reactive, getCurrentInstance, onMounted} from 'vue'
  import {areaList} from '@vant/area-data/src'
  import {router} from "../router"
  import { ElMessage } from 'element-plus'

  export default {
    components: {},
    setup() {
      const { proxy } = getCurrentInstance();
      const that = proxy;

      const onClickLeft = () => router.back();

      let formValidateObjStr = that.$getLS('AdminInfo');
      let formValidateObj = JSON.parse(formValidateObjStr);
      if (!formValidateObj.TelAddress) {
        formValidateObj.TelAddress = {
          Province: '',
          City: '',
          Area : '',
        }
      } else {
        if (typeof formValidateObj.TelAddress == 'string') {
          formValidateObj.TelAddress = JSON.parse(formValidateObj.TelAddress);
        }
      }
      if (!formValidateObj.FilePath) {
        formValidateObj.FilePath = [];
      }
      if (!formValidateObj.Certificate) {
        formValidateObj.Certificate = [];
      }
      if (!formValidateObj.VerifyType) {
        formValidateObj.VerifyType = 1;
      }
      formValidateObj.VerifyType = formValidateObj.VerifyType + '';

      const formValidate = reactive(formValidateObj);

      //上传图片文件
      const afterRead = (file) => {
        // 此时可以自行将文件上传至服务器
        // console.log(file)
      }

      //图片上传预览功能
      const fileList = ref([
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      ])

      //单选功能
      const checked = ref('1');

      const showCalendar = ref(false);
      const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const onConfirmCalendar = (value) => {
        showCalendar.value = false;
        formValidateObj.CompanyDate = formatDate(value);
      };

      //地区选择功能
      let resultStr = '';

      for (let i in areaList.province_list) {
        if (i == formValidateObj?.TelAddress?.Province) {
          resultStr += areaList.province_list[i];
        }
      }

      for (let i in areaList.city_list) {
        if (i == formValidateObj?.TelAddress?.City) {
          resultStr += '/'+areaList.city_list[i];
        }
      }

      for (let i in areaList.county_list) {
        if (i == formValidateObj?.TelAddress?.Area) {
          resultStr += '/'+areaList.county_list[i];
        }
      }

      const result = ref(resultStr);
      const showArea = ref(false);
      const onConfirm = (values) => {
        showArea.value = false;
        formValidate.TelAddress = {};
        formValidate.TelAddress.Province = values[0].code;
        formValidate.TelAddress.City = values[1].code;
        formValidate.TelAddress.Area = values[2].code;

        result.value = values
          .filter((item) => !!item)
          .map((item) => item.name)
          .join('/');

        // console.log(values);
        // console.log('result:'+JSON.stringify(result));
      }

      const showPicker = false;
      const picBaseUrl = 'http://wwy-t.oss-cn-hangzhou.aliyuncs.com/';
      const scaleArr = ['10-50人', '51-200人', '201-300人'];

      onMounted(() => {
        that.getInfo();
      })

      return {
        formValidate,
        checked,
        fileList,
        result,
        areaList,
        showArea,
        showCalendar,
        showPicker,
        picBaseUrl,
        scaleArr,
        onClickLeft,
        onConfirm,
        onConfirmCalendar,
        afterRead,
      }
    },
    methods: {
      downLoad(item){//下载文件
        const link = document.createElement('a')
        link.download = item;
        link.href = this.picBaseUrl + item;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      delImg(i) {
        this.formValidate.Certificate.splice(i, 1);
      },
      delFile(i) {
        this.formValidate.FilePath.splice(i, 1);
      },
      onRead(file) {
        this.$post('api/Pub/upload', file.file).then(res=>{
          if (res.code == 1) {
            this.formValidate.Certificate.push(res.Path);
          }
        })
      },
      onReadFile(file) {
        this.$post('api/Pub/upload', file.file).then(res=>{
          if (res.code == 1) {
            this.formValidate.FilePath.push(res.Path);
          }
        })
      },
      chooseScale(data) {
        this.formValidate.Scale = data;
        this.showPicker = false;
      },
      getInfo() {
        this.$post('api/manage.PersonCenter/getMemberInfo').then(res=>{
          if(res.code == 1){
            this.UserID = res.data.ID;
          }
        })
      },
      handleImproveInfo(){
        this.$router.push({path: "/profile"});
      },
      // 修改供应商信息
      handlemodifyInfo(){
        this.showMOdifyTips = true;
        this.formValidate.Status = 4;
      },
      handleSubmit() {
        this.$setLS('showMOdifyTips', 0);
        this.submit();
      },
      handleSubmitModify(){
        this.$setLS('showMOdifyTips', 1);
        this.submit();
      },
      submit(){// 提交认证
        if (this.formValidate.VerifyType == 1){// 个人
          this.formValidate.Scale = '';
        }

        if ((this.formValidate.VerifyType == 2 && (!this.formValidate.Scale || !this.formValidate.CompanyName || !this.formValidate.CompanyAddress 
        || !this.formValidate.CompanyLeader)) || !this.formValidate.ItemProcess || !this.formValidate.TelAddress.Area 
        || !this.formValidate.DetailedAddress || !this.formValidate.ContactName || !this.formValidate.ContactWay) {
          ElMessage.error('请将信息填写完整');
          return;
        }

        if (!this.formValidate.Certificate || this.formValidate.Certificate.length == 0) {
          ElMessage.error('请添加有效证件');
          return;
        }

        if (!this.formValidate.FilePath || this.formValidate.FilePath.length == 0) {
          ElMessage.error('请添加作品');
          return;
        }

        var params = {
            ID: this.UserID,
            VerifyType: this.formValidate.VerifyType,
            Scale: this.formValidate.Scale,
            Certificate: this.formValidate.Certificate,
            ItemProcess: this.formValidate.ItemProcess,
            FilePath: this.formValidate.FilePath,
            DetailedAddress: this.formValidate.DetailedAddress,
            TelAddress: this.formValidate.TelAddress,
            CompanyName: this.formValidate.CompanyName,
            CompanyAddress: this.formValidate.CompanyAddress,
            CompanyLeader: this.formValidate.CompanyLeader,
            CompanyCode: this.formValidate.CompanyCode,
            CompanyDate: this.formValidate.CompanyDate,
            ContactName: this.formValidate.ContactName,
            ContactWay: this.formValidate.ContactWay,
        }

        this.$post('api/manage.PersonCenter/addMemberVerify', params).then(res=>{
            if (res.code == 1) {
                this.formValidate.Status = 2;
                this.$setLS('AdminInfo',JSON.stringify(this.formValidate));
                ElMessage.success(res.msg);
            } else {
                ElMessage.error(res.msg);
            }
        })
      },
    },
  }
</script>

<style>
  .tips {
    width:400px; 
    margin:100px auto;
    font-weight:bold;
    text-align: center;
  }
  .tips > .icon {
    margin-top: 13px;
    margin-right: 5px;
  }
  .tips span {
    margin-top: 12px;
  }
  .tips .improveinfo {
    color:#0098CC;
  }
  .tipComment {
      color: #B45C5A;
      padding:10px;
      border-radius: 5px;
      border:1px solid #EBCCD1;
      margin:20px;
      background-color:#F2DEDE;
  }
  .tipsActive {
      color: #3B763D;
      border:1px solid #D6E9C6;
      background-color:#DFF0D8;
  }

  .tipComment {
    color: #B45C5A;
    padding:10px;
    border-radius: 5px;
    border:1px solid #EBCCD1;
    margin:20px;
    background-color:#F2DEDE;
  }

  .el-checkbox__inner {
    width: 18px !important;
    height: 18px !important;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: rotate(45deg) scaleY(1.1) !important;
    width: 5px;
    height: 11px;
  }

  .experience .van-cell {
    padding: 0 !important;
  }

  .van-cell-group--inset {
    width: 100%;
    margin: 0 !important;
  }

  .posting-uploader-item {
    position: relative;
    margin-right: 8px;
  }

  .posting-uploader-item .delete {
    position: absolute;
    top: -8px;
    right: -8px;
  }

  .posting-uploader-item .imgPreview {
    width: 80px;
    height: 80px;
  }

  .file-list {
    background-color: #fff;
  }

  .file-list li {
    position: relative;
  }

  .file-list span {
    margin: 5px 2%;
    width: 90%;
    display: inline-block;
    overflow: hidden;
  }

  .file-list i {
    position: absolute;
    top: 5px;
  }
</style>