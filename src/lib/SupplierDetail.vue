<template>
  <div class="bg mt46">
    <van-nav-bar
        fixed="fixed"
        title="查看详情"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    />
    <van-tabs v-model:active="active" sticky="sticky" offset-top="46px;">
      <van-tab title="基本信息">
        <div class="tab tab1">
          <div class="h20"></div>
          <div class="flex">
            <div class="l">用户ID:</div>
            <div class="r">{{ Detail.ID }}</div>
          </div>
          <div class="flex">
            <div class="l">联系人:</div>
            <div class="r">{{ Detail.Realname }}</div>
          </div>
          <div class="flex">
            <div class="l">手机号:</div>
            <div class="r">{{ Detail.Tel }}</div>
          </div>
          <div class="flex">
            <div class="l">邮箱:</div>
            <div class="r">{{ Detail.Email }}</div>
          </div>
          <div class="flex">
            <div class="l">QQ:</div>
            <div class="r"> {{ Detail.QQ }}</div>
          </div>
          <div class="flex">
            <div class="l">微信:</div>
            <div class="r">{{ Detail.WX }}</div>
          </div>
          <div class="flex">
            <div class="l">认证状态:</div>
            <div class="r">
                <span v-if="Detail.Status == 0">资料未完善</span>
                <span v-if="Detail.Status == 1">未认证</span>
                <span v-if="Detail.Status == 2">待审核</span>
                <span v-if="Detail.Status == 3">审核通过</span>
            </div>
          </div>
          <div class="flex">
            <div class="l">供应商评级 :</div>
            <div class="r">{{ Detail.SupplierRate }}</div>
          </div>
          <div class="flex">
            <div class="l">完成项目数:</div>
            <div class="r">{{ Detail.FinishProjectNum.length }}</div>
          </div>
          <div class="flex">
            <div class="l">擅长项目:</div>
            <div class="r">
              <span v-if="Detail.Fields">
								<span v-for="(ite, index) in Detail.Fields" :key="index">{{ ite }} ,</span>
							</span>
            </div>
          </div>
          <div class="flex">
            <div class="l">累计完成金额:</div>
            <div class="r">{{ Detail.Amount_Total }}</div>
          </div>
          <div class="flex">
            <div class="l">技能标签:</div>
            <div class="r">{{ Detail.Skill }}</div>
          </div>
          <div class="flex">
            <div class="l">工作地:</div>
            <div class="r">{{ Detail.place }}</div>
          </div>
          <div class="flex">
            <div class="l">支付宝:</div>
            <div class="r">{{ Detail.Alipay }}</div>
          </div>
          <div class="flex">
            <div class="l">银行卡号:</div>
            <div class="r" v-if="Detail.Bank">{{ Detail.Bank.Account }}</div>
          </div>
          <div class="flex">
            <div class="l">户名:</div>
            <div class="r" v-if="Detail.Bank">{{ Detail.Bank.Name }}</div>
          </div>
          <div class="flex">
            <div class="l">开户行:</div>
            <div class="r" v-if="Detail.Bank">{{ Detail.Bank.Username }}</div>
          </div>
          <div class="flex">
            <div class="l">备注:</div>
            <div class="r">{{ Detail.Comment }}</div>
          </div>
          <div class="h20"></div>
          <div class="h20"></div>
          <div class="h20"></div>
        </div>
      </van-tab>
      <van-tab title="用户认证">
        <div class="tab tab2">
          <div class="h20"></div>
          <div class="flex">
            <div class="l">供应商类型:</div>
            <div class="r">
              <span v-if="Detail.VerifyType == 1">个人</span><span v-if="Detail.VerifyType == 2">工作室 / 公司</span>
            </div>
          </div>
          <div class="flex">
            <div class="l">规模:</div>
            <div class="r">{{ Detail.Scale }}</div>
          </div>
          <div class="flex">
            <div class="l">有效证件:</div>
            <div class="r">
              <div class="credentials" v-if="Detail.Certificate">
                <div class="imgPreview" @click="preview()">
                  <img style="width: 154px;height: 94px; cursor: pointer;" @click="checkImg(item, index)" v-for="(item, index) in Detail.Certificate" :key="index" :src="imgUrl + item" alt="" />
                </div>
							</div>
            </div>
          </div>
          <div class="flex">
            <div class="l">企业名称:</div>
            <div class="r">{{ Detail.CompanyName }}</div>
          </div>
          <div class="flex">
            <div class="l">企业地址:</div>
            <div class="r">{{ Detail.CompanyAddress }}</div>
          </div>
          <div class="flex">
            <div class="l">企业法人:</div>
            <div class="r">{{ Detail.CompanyLeader }}</div>
          </div>
          <div class="flex">
            <div class="l">社会统一信用代码:</div>
            <div class="r">{{ Detail.CompanyCode }}</div>
          </div>
          <div class="flex">
            <div class="l">企业成立时间:</div>
            <div class="r">{{ Detail.CompanyDate }}</div>
          </div>
          <div class="flex">
            <div class="l">通讯地址:</div>
            <div class="r">{{ Detail.TelAddress }} {{ Detail.DetailedAddress }}</div>
          </div>
          <div class="flex">
            <div class="l">联系人:</div>
            <div class="r">{{ Detail.ContactName }}</div>
          </div>
          <div class="flex">
            <div class="l">联系方式:</div>
            <div class="r">{{ Detail.ContactWay }}</div>
          </div>
          <div class="flex">
            <div class="l">项目经历:</div>
            <div class="r"> {{ Detail.ItemProcess }}
            </div>
          </div>
          <div class="flex">
            <div class="l">作品展示:</div>
            <div class="r">
              <div v-if="Detail.FilePath" class="workDisplay" style="cursor: pointer; text-align: left;">
                <a target="_blank" :href="imgUrl + item.Path" v-for="(item, index) in FilePath" :key="index">
                  {{ item.Name }}
                </a>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="l">供应商评级:</div>
            <div class="r">
              <van-rate v-model="Detail.SupplierRate" void-icon="star" color="#ffd21e" void-color="#eee" :size="25"/>
            </div>
          </div>
          <div class="flex">
            <div class="l">信息备注:</div>
            <div class="r">
              <input type="text" v-model="Detail.Comment">
            </div>
          </div>
          <div class="h20"></div>
          <div class="h20"></div>
          <div class="h20"></div>
          <div class="flex-space-evenly">
            <van-config-provider :theme-vars="themeVars">
          <van-button type="success" v-if="Detail.Status != 1 && Detail.Status != 0" @click="confirmVerify(3)" round>认证通过</van-button>
          <van-button type="danger" v-if="Detail.Status != 1 && Detail.Status != 0" @click="cancelVerify" round>取消认证</van-button>
            </van-config-provider>
          </div>
          <div class="h20"></div>
          <div class="h20"></div>
          <div class="h20"></div>
        </div>
      </van-tab>
      <van-tab class="tab tab-empty" title="已完结">暂无数据</van-tab>
      <van-tab class="tab tab-empty" title="竞标中">暂无数据</van-tab>
    </van-tabs>

  </div>
  <div class="imgPreviewPop" v-show="pic" @click="preview()">
    <img :src="Detail.Certificate"
         alt="">
  </div>
</template>


<script>
  import {ref, reactive, getCurrentInstance, onMounted} from 'vue'
  import {areaList} from '@vant/area-data/src'
  import {router} from "../router"
  import {useRoute} from "vue-router";

  export default {
    components: {},
    setup() {
      const { proxy } = getCurrentInstance();
      const that = proxy;
      
      let imgUrlStr = '';

      if(window.location.host=='mk.wawayu.tv'){
        imgUrlStr = 'http://wawayu-mk.oss-cn-hangzhou.aliyuncs.com/';
      }else{
        imgUrlStr = 'http://wwy-t.oss-cn-hangzhou.aliyuncs.com/'
      }

      const imgUrl = ref(imgUrlStr);

      const onClickLeft = () => router.back()
      const show = ref(false)
      const showPopup = () => {
        show.value = true
      }
      const showPopover = ref(false)

      // 通过 actions 属性来定义菜单选项
      const actions = [
        {text: '全部'},
        {text: '资料未完善'},
        {text: '未认证'},
        {text: '待审核'},
        {text: '审核通过'},
      ]
      const onSelect = (action) => Toast(action.text)

      const themeVars = {
        borderRadius: '4px',
      };

      const route = useRoute();
      onMounted(() => {
        that.getDetail(route.query.ID);
      })

      return {
        onClickLeft,
        show,
        showPopup,
        actions,
        onSelect,
        showPopover,
        themeVars,
        imgUrl,
      }
    },

    methods: {
      preview() {
        this.pic = !this.pic
      },
      getDetail(ID) {
        var params = {
          ID: ID
        }
        this.$post('api/manage.SupplierManage/supplierDetails', params).then(res => {
          if (res.code == 1) {
            this.Detail = res.data;
            if (this.Detail.TelAddress) {
              let resultStr = '';
              for (let i in areaList.province_list) {
                if (i == this.Detail.TelAddress.Province) {
                  resultStr += areaList.province_list[i];
                }
              }

              for (let i in areaList.city_list) {
                if (i == this.Detail.TelAddress.City) {
                  resultStr += areaList.city_list[i];
                }
              }

              for (let i in areaList.county_list) {
                if (i == this.Detail.TelAddress.Area) {
                  resultStr += areaList.county_list[i];
                }
              }
              this.Detail.TelAddress = resultStr;
            }
            if (this.Detail.SupplierRate == '一星') {
              this.Detail.SupplierRate = 1
            } else if (this.Detail.SupplierRate == '二星') {
              this.Detail.SupplierRate = 2
            } else if (this.Detail.SupplierRate == '三星') {
              this.Detail.SupplierRate = 3
            } else if (this.Detail.SupplierRate == '四星') {
              this.Detail.SupplierRate = 4
            } else if (this.Detail.SupplierRate == '五星') {
              this.Detail.SupplierRate = 5
            } else {
              this.Detail.SupplierRate = 0
            }
            this.FilePath = [];
            if (res.data.FilePath) {
              res.data.FilePath.forEach(item => {
                if (item.split('.')[1] == 'mp4' || item.split('.')[1] == 'MP4') {
                  this.FilePath.push({ Name: '视频', Path: item })
                } else if (item.split('.')[1] == 'pdf') {
                  this.FilePath.push({ Name: 'pdf', Path: item })
                }
              })
            }

            if (this.Detail.Address) {
              let resultStr = '';
              for (let i in areaList.province_list) {
                if (i == this.Detail.Address.Province) {
                  resultStr += areaList.province_list[i];
                }
              }

              for (let i in areaList.city_list) {
                if (i == this.Detail.Address.City) {
                  resultStr += areaList.city_list[i];
                }
              }

              for (let i in areaList.county_list) {
                if (i == this.Detail.Address.Area) {
                  resultStr += areaList.county_list[i];
                }
              }
              this.Detail.Address = resultStr;
            } else {
              this.Detail.place = '';
            }
          }
        })
      },
      confirmVerify(Status) {//确认认证
        let Star = ''
        if (this.Detail.SupplierRate == 1) {
          Star = '一星'
        } else if (this.Detail.SupplierRate == 2) {
          Star = '二星'
        } else if (this.Detail.SupplierRate == 3) {
          Star = '三星'
        } else if (this.Detail.SupplierRate == 4) {
          Star = '四星'
        } else if (this.Detail.SupplierRate == 5) {
          Star = '五星'
        }
        var params = {
          ID: this.Detail.ID,
          // AuditComment: this.Remark,
          SupplierRate: Star,
          Comment: this.Detail.Comment,
          Status: Status
        }
        if (Status == 3) {
          if (Star == 0) {
            this.ElMessage.error('请给供应商评级');
            return false;
          }
        }
        this.$post('api/manage.SupplierManage/supplierAudit', params).then(res => {
          if (res.code == 1) {
            if (Status == 1) {
              this.Detail.Status = 1;
            }
            this.showRemark = false;
            this.ElMessage.success(res.msg);
          } else {
            this.ElMessage.error(res.msg);
          }
        })
      },
      cancelVerify() {

      },
    },

    data() {
      return {
        pic: false,
        Detail: { FinishProjectNum: [], SupplierRate: 0 },
        FilePath: [],
      }
    }


  }
</script>

<style lang="scss" scoped>
  .van-overlay {
    background: rgba(0, 0, 0, .5);
  }

  .h20 {
    height: 20px;
  }

  .bg {
    height: 100%;
    overflow: hidden;
  }

  .flex > .van-cell__value {
    display: flex;
  }

  .content {
    display: flex;
    flex-direction: column;

    .tittle {
      //position: fixed;
      margin: 10px auto;
      font-size: 0.4rem;
    }

    .nav {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-top: 1px solid #c2c2c2;
      line-height: 40px;

      .top-bar {
        display: flex;
        justify-content: space-between;
      }

      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          background: rgb(242, 242, 242);
          margin: 5px;
          line-height: 30px;
          padding: 0px 20px;
          border-radius: 30px;
        }
      }

      img {
        width: 20px;
      }
    }
  }

  .tab1 {
    background: #fff;
    border-radius: 4px;
    margin-top: 20px;

    .flex {
      padding: 0 10px;
    }

    .flex .l {
      width: 20%;
      flex-shrink: 0;
      padding: 10px;
      border-top: 1px solid #caf2ff;
      border-left: 1px solid #caf2ff;
      background: #f0fcff;
      box-sizing: content-box;
    }

    .flex:nth-last-child(4) > .l {
      border-bottom: 1px solid #caf2ff;
    }

    .flex .r {
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: 10px;
      border-top: 1px solid #caf2ff;
      border-right: 1px solid #caf2ff;
      border-left: 1px solid #caf2ff;
      background: #fff;
    }

    .flex:nth-last-child(4) > .r {
      border-bottom: 1px solid #caf2ff;
    }

    .l {
      width: 80px;
      flex-shrink: 0;
    }

  }


  .tab2 {
    background: #fff;
    border-radius: 4px;
    margin-top: 20px;

    .flex {
      padding: 0 10px;
    }

    .flex .l {
      width: 20%;
      flex-shrink: 0;
      padding: 10px;
      border-top: 1px solid #caf2ff;
      border-left: 1px solid #caf2ff;
      background: #f0fcff;
      box-sizing: content-box;
    }

    .flex:nth-last-child(4) > .l {
      border-bottom: 1px solid #caf2ff;
    }

    .flex .r {
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: 10px;
      border-top: 1px solid #caf2ff;
      border-right: 1px solid #caf2ff;
      border-left: 1px solid #caf2ff;
      background: #fff;
    }

    .flex:nth-last-child(4) > .r {
      border-bottom: 1px solid #caf2ff;
    }

    .imgPreview {
      width: 48%;
    }

    .credentials {
      img {
        width: 100%;
      }
    }

  }

  .imgPreviewPop {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
    overflow-y: hidden;

    img {
      position: absolute;
      top: 50%;
      width: 80%;
      left: 10%;
      transform: translateY(-50%);
    }
  }

  .tab {
    font-size: 14px;
  }

  .tab-empty {
    margin-top: 20px;
    text-align: center;
  }
</style>