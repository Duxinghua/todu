<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2 self-box2-mobile">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div class="self-container-title">个人资料</div>
      </div>
      <div class="self-box2">
        <el-row style="width: 100%">
          <!--左边表单-->
          <el-col :span="12" class="self-box2-col">
            <el-form
              ref="editForm"
              :model="userForm"
              label-position="right"
              style="text-align: left"
              :disabled="formDisabled"
            >
              <el-form-item label="工号" :label-width="labelwidth" prop="workNumber">
                <el-input v-model="userForm.workNumber" disabled autocomplete="off" size="normal" style="width: 500px" />
              </el-form-item>
              <el-form-item label="用户姓名" :label-width="labelwidth">
                <el-input v-model="userForm.userName" autocomplete="off" size="normal" style="width: 500px" />
              </el-form-item>
              <!--              <el-form-item label="联系电话" :label-width="labelwidth">-->
              <!--                <el-input v-model="userForm.contactInfo" autocomplete="off" size="normal" style="width: 500px" />-->
              <!--              </el-form-item>-->

              <el-form-item label="性别" label-width="80px">
                <el-select ref="deptSelect" v-model="userForm.userSex" size="normal" placeholder="请选择" style="width: 500px" value="男">
                  <el-option label="男" disabled value="男" />
                  <el-option label="女" disabled value="女" />
                </el-select>
              </el-form-item>
              <el-form-item label="所属室所" label-width="80px">
                <el-select ref="deptSelect" v-model="userForm.deptId" size="normal" placeholder="请选择" style="width: 500px" value="-1" @change="selectDept">
                  <el-option label="请选择" value="-1" disabled />
                  <el-option v-for="(item,key) in deptList" :key="key" :label="item.deptName" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="专业" label-width="80px">
                <el-select
                  ref="positionSelect"
                  v-model="userForm.userMajorId"
                  placeholder="请选择"
                  style="width: 500px"
                  value="-1"
                  size="normal"
                >
                  <el-option label="请选择" value="-1" disabled />
                  <el-option v-for="(item,key) in majorList" :key="key" :label="item.deptName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <div ref="buttonDiv" class="buttondiv">
              <el-button @click="handleCancelEdit()">取 消</el-button>
              <el-button type="primary" @click="commitUser()">提交</el-button>
            </div>
          </el-col>
          <!--右边表单-->
          <el-col :span="10" class="el-col-avatar-info">
            <el-row>
              <el-col class="el-avatar-col">
                <el-avatar :size="150" icon="el-icon-user self-font-color" style="font-size: 50px;background: aliceblue;" />
              </el-col>
            </el-row>
            <el-row>
              <el-col style="margin-top:20px;text-align: center;"><span style="font-size:20px;">{{ userForm.userName }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="margin-top:20px;text-align: center"><span style="font-size:10px;"><span style="padding: 0 5px">{{ userForm.deptName }}</span>|<span style="padding: 0 5px" v-text="userForm.userMajor" /></span>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="margin-top:20px;text-align: center">
                <el-button type="primary" plain round icon="el-icon-edit-outline" @click="handleEdit()">编辑资料</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="margin-top:20px;text-align: center">
                <el-button type="primary" plain round icon="el-icon-lock" @click="handleEditPwd()">修改密码</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--修改密码抽屉-->
    <el-drawer
      ref="drawer"
      :visible.sync="editPasswordFormVisible"
      direction="rtl"
      :before-close="handleClose"
      :show-close="false"
      :destroy-on-close="true"
      :wrapper-closable="false"
      class="self-drawer mobile-self-drawer"
    >
      <div slot="title" class="self-drawer-title">修改密码</div>
      <el-form ref="passwordForm" :model="passwordForm" :rules="updatePwdRules">
        <el-form-item label="原密码" label-width="80px" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" size="normal" autocomplete="off" placeholder="请输入原密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" label-width="80px" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" size="normal" autocomplete="off" placeholder="新密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" label-width="80px" prop="verifyPwd">
          <el-input v-model="passwordForm.verifyPwd" size="normal" autocomplete="off" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <div style="text-align: left;margin-left: 25px;margin-top: 50px;">
        <el-button size="normal" @click="cancelForm">取 消</el-button>
        <el-button size="normal" type="primary" :loading="loading" @click="updatePassword">{{ loading ? '提交中 ...' : '修 改' }}</el-button>
      </div>
    </el-drawer>
  </div>

</template>

<script>
import { getInfo, updatePwd, userUpdate } from '@/api/user'
import { deptList } from '@/api/dept'
import { posList, majorList } from '@/api/dict'
export default {
  name: 'PersonData',
  data() {
    return {
      userName: '王大锤',
      userDept: '技术部',
      userPosition: 'UI设计师',
      labelwidth: '80px',
      formDisabled: true,
      editPasswordFormVisible: false,
      timer: null,
      loading: false,
      deptList: [],
      majorList: [],
      posList: [],
      userForm: {
        workNumber: '',
        userName: '',
        loginName: '',
        userSex: '男',
        userPositionId: 1,
        userMajorId: 1,
        contactInfo: '',
        deptId: '-1'
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        verifyPwd: ''
      },
      updatePwdRules: {
        oldPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },

          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'change' }
        ],
        verifyPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // 加载个人信息
    getInfo().then(res => {
      if (res.status === 200) {
        console.log(res.data)
        this.userForm.id = res.data.id
        this.userForm.workNumber = res.data.workNumber
        this.userForm.userName = res.data.userName
        this.userForm.loginName = res.data.loginName
        this.userForm.userSex = res.data.userSex
        this.userForm.contactInfo = res.data.contactInfo
        this.userForm.deptName = res.data.deptName
        this.userForm.deptId = res.data.deptId
        this.userForm.userMajorId = res.data.userMajorId
        this.userForm.userMajor = res.data.userMajor
        // this.userForm.userPositionId = res.data.userPositionId
        // this.userForm.userPosition = res.data.userPosition
        this.getMajorList({ deptId: this.userForm.deptId })
      }
    })

    // this.getPosList()
    this.getDeptList()
  },
  methods: {
    selectDept(val) {
      // 清空数据
      this.$set(this.userForm, 'userMajorId', '')
      // 重新加载下拉数据
      this.getMajorList({ deptId: val })
    },
    async updatePassword() {
      const self = this
      this.$refs.passwordForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.passwordForm.newPassword !== this.passwordForm.verifyPwd) {
            this.$message.warning('两次输入的新密码不一致')
            return false
          }
          this.loading = true
          updatePwd(this.passwordForm).then(res => {
            this.loading = false
            if (res.status === 200) {
              this.$message.success('修改成功')
              this.editPasswordFormVisible = false
            } else {
              this.$message.error(res.msg)
            }
          }).then(function(value) {
            console.log(value)
            // eslint-disable-next-line handle-callback-err
          }, function(error) {
            // failure
            self.loading = false
          })
          // 关闭弹框
          this.$refs.drawer.closeDrawer()
        }
      })
    },
    async getMajorList(params) {
      majorList(params).then(res => {
        const {
          data, status
        } = res
        if (status === 200) {
          this.$set(this, 'majorList', data)
        }
      })
    },
    // 加载岗位列表
    async getPosList() {
      posList().then(res => {
        const {
          data, status
        } = res
        if (status === 200) {
          this.posList = data
        }
      })
    },
    async getDeptList() {
      deptList().then(res => {
        const {
          data, status
        } = res
        if (status === 200) {
          this.deptList = data
        }
      })
    },
    handleEdit() {
      this.formDisabled = false
      this.$refs.buttonDiv.style.display = 'block'
    },
    handleCancelEdit() {
      this.formDisabled = true
      this.$refs.buttonDiv.style.display = 'none'
    },
    handleEditPwd() {
      this.editPasswordFormVisible = true
      this.passwordForm = {}
    },

    commitUser() {
      const deptId = this.userForm.deptId
      const majorId = this.userForm.userMajorId
      if (deptId) {
        const deptObj = this.deptList.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.id === deptId// 筛选出匹配数据
        })
        this.userForm.deptName = deptObj.deptName
        this.userForm = Object.assign({}, this.userForm)
        // this.$set(this.userForm, 'deptName', deptObj.deptName)
      }
      if (majorId) {
        const majorObj = this.majorList.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.id === majorId// 筛选出匹配数据
        })
        this.userForm.userMajor = majorObj.deptName
        this.userForm = Object.assign({}, this.userForm)
        // this.$set(this.userForm, 'userMajor', majorObj.deptName)
      }
      userUpdate(this.userForm).then(res => {
        const { status, msg } = res
        if (status === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.warning(msg)
        }
      })
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch(_ => {
        })
    },
    cancelForm() {
      this.loading = false
      this.editPasswordFormVisible = false
      clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped>
.buttondiv{
text-align: center;margin-top: 80px;display: none
}
  .self-container{
    padding: 10px 10px 10px 0;
    display: flex;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
  }
  .self-box{

    display: flex;
    flex-direction: column;
    flex: 1;
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
  }
  .self-circle{
    position: absolute;
    background: rgb(32, 160, 255);
    width: 10px;
    height: 10px;
    border-radius: 10px;
    left: 0;
  }
  .self-icon{
    font-weight: bold;font-size: 16px
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
  .self-container-title{
      font-size: 30px;
      padding-left: 30px;
      font-weight: bold
  }
  .el-avatar-col{
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .self-drawer-title{
    font-size:20px;
  }
  @media only screen and (max-width: 768px){
    .self-box{
      width:100%;
    }
    .self-container-title{
      font-size: 16px;
      padding-left: 30px;
      font-weight: bold
    }
    .self-box2-mobile{
      margin-bottom: 0px!important;
    }
    .self-box{
      padding:0 15px!important;
    }
    .self-box3 .el-table__body,
    .self-box3 .el-table__header{
      width:100%!important;
    }
    .self-box .el-input{
      width:fit-content!important;
    }
    .el-pagination__sizes{
      width:130px;
    }
    .el-select{
      width:200px!important;
    }
    .self-box2-col{
      margin:0px!important;
      width:100%;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
      margin-bottom:14px;

    }
    .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
      line-height:40px;
    }
    .el-form-item__content .el-input{
      width:calc(100% - 40px)!important;
    }
    .el-input__inner{
      line-height:40px;
      height:40px;
    }
    .el-avatar-col span{
      width:80px!important;
      height:80px!important;
      line-height:80px!important;
    }
    .el-col-avatar-info{
      display:flex;
      flex-direction:row;
      width:100%;
      justify-content: center;
    }
    .el-col-avatar-info .el-row:nth-child(3),
    .el-col-avatar-info .el-row:nth-child(2),
    .el-col-avatar-info .el-row:nth-child(1){
      display:none;
    }
     .el-col-avatar-info .el-row:nth-child(4){
       margin-right:0.5rem;
     }
    .buttondiv{
        text-align: center;
        margin-top: 0.80rem!important;
        display: none;
        margin:0 auto;
    }
    .mobile-self-drawer .el-drawer{
      width:75%!important;
    }
    .self-drawer-title{
        font-size:0.3rem;
    }
    .mobile-self-drawer .el-drawer__header{
      margin-bottom:0px !important;
    }
    .self-drawer .el-form-item{
      padding:0px!important;
    }

  }

</style>
