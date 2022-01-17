<template>
  <div class="main mt46">
    <van-nav-bar
        fixed="fixed"
        title="供应商管理"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="fixed">
      <van-cell is-link @click="showPopup">擅长项目筛选</van-cell>
      <van-popup v-model:show="show"></van-popup>
      <van-cell>
        <div class="flex-center">
          <van-dropdown-menu>
            <van-dropdown-item v-model="listParams.Status" :options="statusList" />
          </van-dropdown-menu>
          <van-search
              v-model="listParams.keyword"
              show-action
              placeholder="请输入搜索关键词"
          >
            <template #action>
              <div @click="getData">搜索</div>
            </template>
          </van-search>
        </div>
      </van-cell>
      <van-action-sheet v-model:show="show" title="擅长项目">
        <div class="content">
          <div class="nav" v-for="(item, index) in tags" :key="index">
            <div class="top-bar">
              <div>{{item.cat}}</div>
              <div @click="selectAll(item.list)">全选</div>
            </div>
            <ul>
              <li v-for="(tag, i) in item.list" :key="i"
                  @click="toggle(tag)"
                  :class="{ selected: selectedTags.indexOf(tag.val)>=0}"
              >{{tag.txt}}
              </li>
            </ul>
          </div>
          <div class="commit-btn">
            <div class="reset" @click="reset">重置</div>
            <div class="confirm" @click="complete">完成</div>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <section>
      <div class="box" v-for="(item, index) in list" :key="index">
        <div class="h20"></div>
        <div class="flex">
          <div class="icon"><img src="../assets/image/supplier-user.png" alt=""></div>
          <div class="l">联系人:</div>
          <div>{{item.Realname}}</div>
        </div>
        <div class="flex">
          <div class="icon"><img src="../assets/image/supplier-tel.png" alt=""></div>
          <div class="l">联系电话:</div>
          <div>{{item.Tel}}</div>
        </div>
        <div class="flex">
          <div class="icon"><img src="../assets/image/supplier-company.png" alt=""></div>
          <div class="l">企业名称:</div>
          <div>{{item.CompanyName}}</div>
        </div>
        <div class="flex">
          <div class="icon"><img src="../assets/image/supplier-company.png" alt=""></div>
          <div class="l">擅长项目:</div>
          <div>
            <span v-if="item.Fields">
							<span v-for="(item, index) in item.Fields" :key="index" v-html="item"></span>
						</span>
          </div>
        </div>
        <div class="flex">
          <div class="icon"><img src="../assets/image/supplier-company.png" alt=""></div>
          <div class="l">所在地:</div>
          <div>{{item.AddressStr}}</div>
        </div>
        <div class="flex">
          <div class="icon"><img src="../assets/image/supplier-company.png" alt=""></div>
          <div class="l">上次登录:</div>
          <div>{{item.LastLoginTime}}</div>
        </div>
        <div class="flex">
          <div class="icon"><img src="../assets/image/supplier-company.png" alt=""></div>
          <div class="l">备注:</div>
          <div>{{item.Comment}}</div>
        </div>
        <div class="flex">
          <div class="icon"><img src="../assets/image/supplier-company.png" alt=""></div>
          <div class="l">认证状态:</div>
          <div>{{item.StatusStr}}</div>
        </div>
        <div class="h20"></div>
        <div class="h20"></div>
        <div class="flex-flex-end">
            <van-button size="small" type="primary" @click="jumpToDetail(item.ID)" style="margin-right: 10px">查看详情</van-button>
            <van-button v-if="item.Status == 1 || item.Status == 0" plain size="small" @click="tips(item)" type="primary" style="margin-right:20px">提醒</van-button>
        </div>
        <div class="h20"></div>
      </div>
      <div v-if="isLoad" class="loading">加载中...</div>
      <div class="h20"></div>
    </section>
  </div>
</template>

<script>
  import {ref, reactive, getCurrentInstance, onMounted} from 'vue'
  import {areaList} from '@vant/area-data/src'
  import {router} from "../router"
  import {ElMessage} from 'element-plus'

  export default {
    components: {},
    setup() {
      const {proxy} = getCurrentInstance();
      const that = proxy;
      const onClickLeft = () => router.back()
      const show = ref(false)
      const showPopup = () => {
        show.value = true
      }
      const showPopover = ref(false)

      // 通过 actions 属性来定义菜单选项
      const statusList = [
        {text: '全部', value: ''},
        {text: '资料未完善', value: 0},
        {text: '未认证', value: 1},
        {text: '待审核', value: 2},
        {text: '审核通过', value: 3},
      ]

      const tags = ref([
        {cat: '2D', list: [
          {txt: '设计稿', val: '2D-设计稿'},
          {txt: '一原', val: '2D-一原'},
          {txt: '二原', val: '2D-二原'},
          {txt: '动上', val: '2D-动上'},
          {txt: '摄影', val: '2D-摄影'},
          {txt: '背景', val: '2D-背景'},
        ]},
        {cat: '3D', list: [
          {txt: '人物模型', val: '3D-人物模型'},
          {txt: '人物材质', val: '3D-人物材质'},
          {txt: '场景模型', val: '3D-场景模型'},
          {txt: '场景材质', val: '3D-场景材质'},
          {txt: '绑定', val: '3D-绑定'},
          {txt: '动画', val: '3D-动画'},
          {txt: '特效', val: '3D-特效'},
          {txt: '灯光', val: '3D-灯光'},
          {txt: '渲染', val: '3D-渲染'},
        ]},
        {cat: '平面', list: [
          {txt: '海报', val: '平面-海报'},
          {txt: '插画', val: '平面-插画'},
          {txt: '立绘', val: '平面-立绘'},
        ]},
        {cat: '大后期', list: [
          {txt: '配音', val: '大后期-配音'},
          {txt: '音乐', val: '大后期-音乐'},
          {txt: '音效/混音', val: '大后期-音效/混音'},
        ]},
        {cat: '前期', list: [
          {txt: '分镜', val: '前期-分镜'},
          {txt: '剧本', val: '前期-剧本'},
          {txt: '人设', val: '前期-人设'},
          {txt: '场设', val: '前期-场设'},
          {txt: '道具', val: '前期-道具'},
        ]},
        {cat: '其他', list: [
          {txt: '其他', val: '其他'},
          {txt: '3渲2', val: '3渲2'},
        ]},
      ]);

      const selectedTags = ref([]);

      const toggle = tag => {
        const index = selectedTags.value.indexOf(tag.val)
        if (index >= 0) {
          selectedTags.value.splice(index, 1)
        } else {
          selectedTags.value.push(tag.val)
        }
      }

      const selectAll = list => {
        let foundTag = false;
        let countTag = 0;
        for (let tag of selectedTags.value) {
          for (let item of list) {
            if (tag == item.val) {
              foundTag = true;
              countTag++;
              break;
            }
          }
        }
        if (foundTag) {
          for (let item of list) {
            if (selectedTags.value.indexOf(item.val) > -1) {
              selectedTags.value.splice(selectedTags.value.indexOf(item.val), 1);
            }
          }
          if (countTag != list.length) {
            for (let item of list) {
              selectedTags.value.push(item.val);
            }
          }
        } else {
          for (let item of list) {
            selectedTags.value.push(item.val);
          }
        }
      }

      const reset = () => {
        selectedTags.value = [];
      }

      const listParams = reactive({
        Status: '',
        keyword: '',
        page: 1,
        pageSize: 10,
      })

      const isLoad = ref(false);

      onMounted(() => {
        that.getData();
        window.onscroll = function () {
          if ( window.screen.height + document.documentElement.scrollTop > document.body.scrollHeight && !isLoad.value) {
            isLoad.value = true;
            listParams.page++;
            that.getData(true);
          }
        }
      })

      return {
        onClickLeft,
        show,
        showPopup,
        statusList,
        showPopover,
        tags,
        selectedTags,
        toggle,
        reset,
        selectAll,
        listParams,
        isLoad
      }
    },
    data() {
      return {
        list: [],
        isLoad: false,
      }
    },
    methods: {
      complete() {
        this.show = false;
        this.getData();
      },
      getData(isMore = false) {
        if (this.selectedTags.length > 0) {
          this.listParams.Fields = this.selectedTags;
        } else {
          if (this.listParams.Fields) {
            this.listParams.Fields = [];
          }
        }
        this.$post('api/manage.SupplierManage/supplierList', this.listParams).then(res => {
          if(res.code == 1){
            let list = res.data.data;
            for(let index in list) {
              let item = list[index];
              for (let i in item.Fields) {
                for (let tag of this.selectedTags) {
                  if (tag == item.Fields[i]) {
                    list[index].Fields[i] = '<font color="red">'+list[index].Fields[i]+'</font>';
                  }
                }
                list[index].Fields[i] += '，';
              }
              switch(item.Status) {
                case 0: list[index].StatusStr = '资料未完善';break;
                case 1: list[index].StatusStr = '未认证';break;
                case 2: list[index].StatusStr = '待审核';break;
                case 3: list[index].StatusStr = '审核通过';break;
                case 4: list[index].StatusStr = '修改供应商信息';break;
              }
              let resultStr = '';
              for (let i in areaList.province_list) {
                if (item.Address && item.Address.Province && i == item.Address.Province) {
                  resultStr += areaList.province_list[i];
                }
              }

              for (let i in areaList.city_list) {
                if (item.Address && item.Address.City && i == item.Address.City) {
                  resultStr += areaList.city_list[i];
                }
              }

              for (let i in areaList.county_list) {
                if (item.Address && item.Address.Area && i == item.Address.Area) {
                  resultStr += areaList.county_list[i];
                }
              }
              list[index].AddressStr = resultStr;
            }
            if (isMore) {
              list.forEach(item=>{
                this.list.push(item);
              });
              this.isLoad = false;
            } else {
              this.list = list;
            }
          } else {
            ElMessage.error(res.msg)
          }
        })
      },
      jumpToDetail(ID) {
        router.push({
          path: 'SupplierDetail',
          query: {ID:ID}
        })
      },
      tips(row) {
        this.$confirm('是否发送短信？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
            center: true
        }).then(() => {
            var params = {
              Tel: row.Tel,
              type: 5
            }
            this.$post('api/Login/sendCode', params).then(res => {
              if (res.code == 1) {
                this.getData();
                ElMessage.success('发送成功')
              } else {
                ElMessage.error(res.msg)
              }
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消发送'
            });
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .van-overlay {
    background: rgba(0, 0, 0, .5);
  }

  .h20 {
    height: 20px;
  }

  .main {
    height: 100%;
    overflow: hidden;
  }

  .flex > .van-cell__value {
    display: flex;
  }

  section {
    margin-top: 128px;
  }

  .tittle {
    position: fixed;
    font-size: 0.4rem;
    line-height: 40px;
    background: #fff;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 0 16px 60px;;

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

          &.selected {
            background: #f60;
            color: white;
          }
        }
      }

      img {
        width: 20px;
      }
    }

    .commit-btn {
      width: 100%;
      line-height: 40px;
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      padding: 10px 26px;
      color: white;
      background: #fff;

      .reset {
        width: 50%;
        text-align: center;
        border-top-left-radius: 35px;
        border-bottom-left-radius: 35px;
        background:-webkit-linear-gradient(left, rgb(254, 196, 0), rgb(254, 156, 0)) no-repeat;
        box-shadow: 0 2px 4px #f7c7b1;
      }

      .confirm {
        width: 50%;
        text-align: center;
        border-top-right-radius: 35px;
        border-bottom-right-radius: 35px;
        background: -webkit-linear-gradient(left, rgb(255, 112, 0), rgb(255, 137, 5)) no-repeat;
        box-shadow: 0 2px 4px #f7c7b1;
      }
    }
  }

  .box {
    background: #fff;
    border-radius: 4px;
    padding: 5px 10px;
    margin: 20px 20px;

    .icon {
      width: 25px;
      height: 25px;
      flex-shrink: 0;
    }

    .icon img {
      width: 100%;
    }

    .l {
      width: 80px;
      flex-shrink: 0;
    }

  }

  .van-dropdown-menu::v-deep .van-dropdown-menu__title {
    padding-left: 10px;
    padding-right: 20px;
  }

  .van-dropdown-menu::v-deep .van-dropdown-menu__title::after {
    right: 8px;
  }

  .loading {
    margin-top: 10px;
    text-align: center;
  }

  .van-dropdown-menu__bar {

  }
</style>