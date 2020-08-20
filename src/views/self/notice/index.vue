<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2 self-box2-mobile">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div class="self-container-title">公司公告</div>
      </div>
      <div v-if="role === 'admin'" class="self-box3" style="display: flex;justify-content: flex-end">
        <el-button style="float:right;" type="primary" size="mini" icon="el-icon-plus" @click="handleAdd()">添加公告</el-button>
      </div>
      <div class="self-box3">
        <el-collapse v-model="activeNames" style="width: 100%" @change="handleChange">
          <el-collapse-item v-for="(item,key) in noticeList" :key="key" :name="key">
            <div slot="title" class="notile-wrap-fix">
              <div style="display: flex;">
                <div style="padding-right: 10px;"><el-icon class="el-icon-arrow-right self-font-color self-icon" /></div>
                <div>{{ item.title }}</div>
              </div>
              <div>
                {{ dateFormat(item.publishTime) }}
              </div>
            </div>
            {{ item.content }}
          </el-collapse-item>

        </el-collapse>
      </div>
    </div>
    <!-- 编辑项目对话框 -->
    <el-drawer
      ref="editDrawer"
      :visible.sync="formVisible"
      direction="rtl"
      :show-close="false"
      :wrapper-closable="false"
      size="30%"
      class="self-drawer"
    >
      <div slot="title" style="font-size: 20px">新增公告</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="title">
          <el-input v-model="form.title" :minlength="1" prop="title" :maxlength="30" placeholder="请输入标题" style="width:300px;" />

        </el-form-item>
        <el-form-item prop="content">
          <el-input v-model="form.content" :minlength="1" prop="content" :maxlength="300" placeholder="请输入内容" style="width:300px;" />
        </el-form-item>

      </el-form>
      <div style="text-align: left;margin-left: 25px;margin-top: 50px;">
        <el-button size="normal" @click="cancelForm">取 消</el-button>
        <el-button size="normal" type="primary" :loading="loading" @click="submitData">{{ loading ? '提交中 ...' :
          '确 定' }}
        </el-button>
      </div>
    </el-drawer>
  </div>

</template>

<script>
import { noticeList, noticeAdd } from '@/api/notice'

export default {
  name: 'NoticeIndex',
  data() {
    return {
      noticeList: [],
      formVisible: false,
      loading: false,
      role: '',
      activeNames: ['0'],
      form: {
        title: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },

          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.loadNoticeList()
  },
  mounted() {
    const role = localStorage.getItem('role')
    this.role = role
  },
  methods: {
    loadNoticeList() {
      noticeList().then(res => {
        if (res.status === 200) {
          this.noticeList = res.data
        }
      })
    },
    handleChange(val) {
      console.log(val)
    },
    handleAdd() {
      this.formVisible = true
    },
    submitData() {
      this.loading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          noticeAdd(this.form).then(res => {
            this.formVisible = false
            this.loadNoticeList()
            this.loading = false
          })
        }
      })
    },
    cancelForm() {
      this.formVisible = false
    },
    dateFormat: function(time) {
      const date = new Date(time)
      /* 在日期格式中，月份是从0开始的，因此要加0
           * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
           * */
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month > 9 ? date.getDate() : '0' + month
      const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      // 拼接
      return year + '-' + month + '-' + day
    }
  }
}
</script>

<style scoped>
  .self-container{
    padding: 10px 10px 10px 0;
    display: flex;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
  }
  .self-box{
    display: inline-block;
    flex-direction: column;
    flex: 1;
    width:100%\9;
    background: white;
    position: relative;
    padding: 0 30px;
    box-sizing: border-box;
  }
  .self-box2{
    position: relative;
    padding: 20px 0 ;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .self-box3{
    position: relative;
    padding: 0 ;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    flex: 1;
    display: inline-block\9;
    align-items: flex-start;
    width: 100%
  }
  .self-circle{
    position: absolute;
    background: rgb(32, 160, 255);
    width: 10px;
    height: 10px;
    border-radius: 10px;
    left: 0;
  }
  .self-container-title{
    padding-left: 30px;
    font-weight: bold
  }
  .self-icon{
    font-weight: bold;font-size: 16px
  }
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .self-box{display: inline-block\9}
  }
  @media only screen and (max-width: 768px){
    .self-container-title{
      font-size: 16px;
    }
    .self-box2-mobile{
      margin-bottom: 0px!important;
    }
  }
</style>
<style>
  .self-drawer .el-form-item{
    padding: 10px 20px;
    border: 1px solid #3333;
    display: flex;
    align-items: center;
    border-radius: 8px;
  }
  /*.el-drawer .el-form-item__label{*/
  /*  width: 80px;*/
  /*}*/
  .self-drawer .el-form-item__content{
    margin-left: 0!important;
    flex: 1;
  }
  .self-drawer .el-input__inner{
    border: none;
  }
  .self-drawer .el-form{

    padding: 20px ;box-sizing: border-box
  }
  .notile-wrap-fix{
    display: flex;
    display:inline-block\9;
    width: 100%;
    justify-content: space-between;
  }
  .notile-wrap-fix div:first-child{
    float:left\9;
  }
  .notile-wrap-fix div:last-child{
    float:right\9;
  }
  .notile-wrap-fix + i{
    display: none\9;
  }
</style>
