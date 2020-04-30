<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">配施日志</div>
      </div>
      <div class="self-box2">
        <div class="search-row">
          <div class="search-text">时间</div>
          <el-date-picker
            v-model="form.searchDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          />
        </div>
        <div class="search-row">
          <div class="search-text">项目</div>
          <el-select v-model="form.searchProjectId" placeholder="请选择项目">
            <el-option
              v-for="project in projectList"
              :key="project.id"
              :label="project.label"
              :value="project.id"
            />
          </el-select>
        </div>
        <div class="search-row">
          <el-button type="primary" @click="searchForm">查询</el-button>
        </div>
        <div class="search-row">
          <el-button type="primary" icon="el-icon-plus" @click="addReport">新建配施日志</el-button>
        </div>
      </div>
      <div class="self-box2" style="flex: 1;flex-wrap: wrap;">
        <div v-for="(task,index) in taskList" :key="index" class="self-card-container" @click="showReportDetail(task.isCreate,task)">
          <el-card class="self-box-card" :body-style="{ width: '100%' }">
            <div slot="default" class="self-card-body">
              <div style="display: flex;flex: 1">
                <div
                  style="width: 40px;height: 40px;background: aliceblue;
                border-radius: 50%;display: flex;justify-content: center;align-items: center;margin-right: 10px"
                >
                  <el-icon class="el-icon-s-promotion self-font-color" style="font-size: 18px" />
                </div>
                <div style="display: flex;flex: 1;justify-content: space-between">
                  <div>
                    <div style="margin-bottom: 10px;font-size: 16px">{{ task.proName }}</div>
                    <div style="font-size: 12px">{{ task.proCode }}</div>
                  </div>
                  <div>
                    <el-button type="primary" plain>查看配施日志</el-button>
                    <div style="font-size: 12px;padding-top: 5px;text-align: center">{{ dateFormat(task.logTime) }}</div>
                  </div>
                </div>

              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <!-- 侧边栏 -->
    <el-drawer
      ref="addDrawer2"
      :visible.sync="addDrawer2"
      :direction="direction"
      size="45%"
      :show-close="false"
      :wrapper-closable="false"
      custom-class="self-drawer"
    >
      <div slot="title">
        <div style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 5px 0 0 2px;flex-direction: column">
          <div style="font-size: 18px;color: #000000">新建配施日志</div>
          <div style="font-size: 12px;padding:5px  2px  0 2px">22:00后将不能修改</div>
        </div>
      </div>
      <div slot="default" style="padding: 0 30px">
        <div style="position: absolute;left: 5px;top: 50%;width: 50px;height: 50px;cursor: pointer" @click="$refs.addDrawer2.closeDrawer()">
          <el-icon class="el-icon-arrow-left" style="font-weight: bold" />
        </div>
        <div>
          <div>
            <el-row :gutter="20" style="display: flex;margin-bottom: 20px">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">项目名称</div>
                <el-input v-model="reportForm.proName" :readonly="true" class="self-input" />
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">项目角色</div>
                <el-input v-model="reportForm.proRole" :readonly="true" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row :gutter="20" style="display: flex">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">时间（天）</div>
                <el-input v-model="reportForm.logTimeStr" :readonly="true" class="self-input" />
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">工作地点</div>
                <el-input v-model="reportForm.workPlace" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>工作情况</h3>
              <div style="width: 100%;">
                <tinymce v-model="reportForm.content" :height="150" :menubar="menubar" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>下步计划</h3>
              <div style="width: 100%;">
                <tinymce v-model="reportForm.plan" :height="150" :menubar="menubar" />
              </div>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-button size="normal" type="primary" plain @click="$refs.addDrawer2.closeDrawer()">取消</el-button>
              <el-button type="primary" size="normal" @click="submitReport2">确定</el-button>
            </el-row>
          </div>
        </div>
      </div>

    </el-drawer>

    <!-- 侧边栏 -->
    <el-drawer
      ref="addDrawer"
      :visible.sync="addDrawer"
      :direction="direction"
      size="45%"
      :show-close="false"
      :wrapper-closable="false"
      custom-class="self-drawer"
    >
      <div slot="title">
        <div style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 5px 0 0 2px;flex-direction: column">
          <div style="font-size: 18px;color: #000000">新建配施日志</div>
          <div style="font-size: 12px;padding:5px  2px  0 2px">22:00后将不能修改</div>
        </div>
      </div>

      <div slot="default" style="padding: 0 30px">
        <div style="position: absolute;left: 5px;top: 50%;width: 50px;height: 50px;cursor: pointer" @click="$refs.addDrawer.closeDrawer()">
          <el-icon class="el-icon-arrow-left" style="font-weight: bold" />
        </div>
        <div>
          <div>
            <el-row :gutter="20" style="display: flex;margin-bottom: 20px">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">项目名称</div>
                <el-select v-model="reportForm.projectId" placeholder="请选择项目" size="small" class="self-input" popper-class="self-input" @change="changeProject">
                  <el-option
                    v-for="project in projectList"
                    :key="project.id"
                    :label="project.label"
                    :value="project.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">项目角色</div>
                <el-select v-model="reportForm.projectRoleId" placeholder="请选择项目" size="small" class="self-input" popper-class="self-input">
                  <el-option
                    v-for="role in roleList"
                    :key="role.proRole"
                    :label="role.proRoleName"
                    :value="role.proRole"
                  />
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="display: flex">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">时间（天）</div>
                <el-input v-model="reportForm.logTimeStr" :readonly="true" class="self-input" />
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">工作地点</div>
                <el-input v-model="reportForm.workPlace" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>工作情况</h3>
              <div style="width: 100%;">
                <tinymce v-model="reportForm.content" :height="150" :menubar="menubar" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>下步计划</h3>
              <div style="width: 100%;">
                <tinymce v-model="reportForm.plan" :height="150" :menubar="menubar" />
              </div>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-button size="normal" type="primary" plain @click="closeDrawer">取消</el-button>
              <el-button type="primary" size="normal" @click="submitReport">确定</el-button>
            </el-row>
          </div>
        </div>
      </div>

    </el-drawer>

    <!-- 侧边栏 -->
    <el-drawer
      ref="lookDrawer"
      :visible.sync="lookDrawer"
      :direction="direction"
      size="45%"
      :show-close="false"
      :wrapper-closable="false"
      custom-class="self-drawer"
    >
      <div v-if="operateType === 2" slot="title">
        <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;padding: 0 20px">
          <div style="font-size: 18px;color: #000000"> 配施日志详情 </div>
          <div>
            <el-button icon="el-icon-edit-outline" type="primary" :disabled="buttonDisabled">修改</el-button>
          </div>
        </div>
        <div style="width: 100%;text-align: right;font-size: 12px;padding:0 20px">22:00后将不能修改</div>
      </div>
      <div v-else slot="title">
        <div style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 5px 0 0 2px;flex-direction: column">
          <div style="font-size: 18px;color: #000000">配施日志详情 </div>
          <div style="font-size: 12px;padding:5px  2px  0 2px">22:00后将不能修改</div>
        </div>
      </div>
      <div slot="default" style="padding: 0 30px">
        <div style="position: absolute;left: 5px;top: 50%;width: 50px;height: 50px;cursor: pointer" @click="$refs.lookDrawer.closeDrawer()">
          <el-icon class="el-icon-arrow-left" style="font-weight: bold" />
        </div>
        <div>
          <div>
            <el-row :gutter="20" style="display: flex;margin-bottom: 20px">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">项目名称</div>
                <el-select v-model="reportForm.projectId" :disabled="true" placeholder="请选择项目" size="small" class="self-input" popper-class="self-input">
                  <el-option
                    v-for="project in projectList"
                    :key="project.id"
                    :label="project.label"
                    :value="project.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">项目角色</div>
                <el-select v-model="reportForm.projectRoleId" :disabled="true" size="small" class="self-input">
                  <el-option
                    v-for="role in roleList"
                    :key="role.id"
                    :label="role.label"
                    :value="role.id"
                  />
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="display: flex">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">时间（天）</div>
                <el-input v-model="reportForm.logTime" :disabled="true" class="self-input" />
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">工作地点</div>
                <el-input v-model="reportForm.workPlace" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>工作情况</h3>
              <div style="width: 100%;">
                <tinymce v-model="reportForm.content" :height="150" :menubar="menubar" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>下步计划</h3>
              <div style="width: 100%;">
                <tinymce v-model="reportForm.plan" :height="150" :menubar="menubar" />
              </div>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-button size="normal" type="primary" plain @click="$refs.lookDrawer.closeDrawer()">取消</el-button>
              <el-button type="primary" size="normal" @click="submitReport3">确定</el-button>
            </el-row>
          </div>
        </div>
      </div>

    </el-drawer>
  </div>
</template>

<script>
import { projectReportList, projectList, reportView, reportAdd, projectRoleList, reportUpdate } from '@/api/dayReportList'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'DayProjectList2',
  components: { Tinymce },
  data() {
    return {
      menubar: '',
      userId: '',
      operateType: 1, // 1 新增   2修改
      projectList: [],
      roleList: [],
      taskList: [],
      drawer: false,
      addDrawer: false,
      addDrawer2: false,
      lookDrawer: false,
      direction: 'rtl',
      buttonDisabled: true,
      form: {
        searchProjectId: '',
        searchDate: ''

      },
      reportForm: {

      }
    }
  },
  created() {
    this.userId = this.$store.state.user.userId

    // 加载项目下拉
    this.projectDrownList()

    // 获取参数
    const query = this.$route.query
    this.form.searchProjectId = parseInt(query.projectId)

    // 加载周报列表
    this.getList()
  },
  mounted() {

  },
  methods: {
    searchForm() {
      this.getList()
    },
    showReport() {
      this.operateType = 1
      this.drawer = true
      this.buttonDisabled = false
      this.form.projectDate = new Date()
    },
    showReportDetail(isCreate, task) {
      this.reportForm = {}
      if (isCreate) {
        // 创建配施日志
        this.reportForm.projectId = task.projectId
        this.reportForm.proName = task.proName
        this.reportForm.logTimeStr = this.form.searchDate
        this.reportForm.projectRoleId = task.projectRoleId
        this.reportForm.proRole = task.proRole
        this.addDrawer2 = true
      } else {
        // 预览配施日志
        // 查询配施日志
        // 判断时间 是否可以修改
        const currentTime = new Date().getTime()
        const taskTime = new Date(task.logTimeStr + ' 22:00:00').getTime()
        if (currentTime > taskTime) {
          this.operateType = 2
        } else {
          this.operateType = 1
          this.disabledEdit = true
        }
        this.lookDrawer = true

        reportView({ id: task.id }).then(res => {
          this.reportForm = res.data
          this.reportForm.logTime = this.dateFormat(this.reportForm.logTime)
        })
      }
    },
    addReport() {
      this.reportForm = {}
      this.reportForm.logTimeStr = this.dateFormat(new Date())
      this.addDrawer = true
    },
    closeDrawer() {
      this.addDrawer = false
    },
    submitReport() {
      if (!this.reportForm.workPlace) {
        this.$message.warning('请输入工作地点')
        return false
      }
      if (!this.reportForm.content) {
        this.$message.warning('请输入工作工作情况')
        return false
      }
      if (!this.reportForm.plan) {
        this.$message.warning('请输入下步计划')
        return false
      }

      this.logTimeStr = new Date(this.logTimeStr)
      this.reportForm.useId = this.userId
      reportAdd(this.reportForm).then(res => {
        const { status } = res
        if (status === 200) {
          this.$message.success('保存成功')
          this.getList()
          this.addDrawer = false
          // 刷新列表
          this.getList()
        } else {
          this.$message.success('保存失败')
        }
      })
    },
    submitReport2() {
      if (!this.reportForm.workPlace) {
        this.$message.warning('请输入工作地点')
        return false
      }
      if (!this.reportForm.content) {
        this.$message.warning('请输入工作工作情况')
        return false
      }
      if (!this.reportForm.plan) {
        this.$message.warning('请输入下步计划')
        return false
      }

      this.logTimeStr = new Date(this.logTimeStr)
      this.reportForm.useId = this.userId
      reportAdd(this.reportForm).then(res => {
        const { status } = res
        if (status === 200) {
          this.$message.success('保存成功')
          this.getList()
          this.addDrawer2 = false
          // 刷新列表
          this.getList()
        } else {
          this.$message.success('保存失败')
        }
      })
    },
    submitReport3() {
      if (!this.reportForm.workPlace) {
        this.$message.warning('请输入工作地点')
        return false
      }
      if (!this.reportForm.content) {
        this.$message.warning('请输入工作工作情况')
        return false
      }
      if (!this.reportForm.plan) {
        this.$message.warning('请输入下步计划')
        return false
      }

      this.reportForm.logTimeStr = new Date(this.reportForm.logTime)
      this.reportForm.useId = this.userId
      reportUpdate(this.reportForm).then(res => {
        const { status } = res
        if (status === 200) {
          this.$message.success('更新成功')
          this.lookDrawer = false
          // 刷新列表
          this.getList()
        } else {
          this.$message.success('更新失败')
        }
      })
    },
    getList() {
      const params = { logTimeStr: this.form.searchDate, projectId: this.form.searchProjectId }
      projectReportList(params).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.taskList = data
        }
      })
    },
    projectRoleList(val) {
      projectRoleList({ projectId: this.weeklyForm.projectId }).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.roleList = data
        }
      })
    },
    projectDrownList() {
      projectList({}).then(res => {
        const tempProList = []
        const { status, data } = res
        if (status === 200) {
          this.projectList = data
          console.log(tempProList)
        }
      })
    },
    changeProject(val) {
      // 清空角色列表\
      this.reportForm.projectRoleId = ''
      this.projectRoleList(val)
    },
    dateFormat: function(time) {
      const date = new Date(time)
      /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month > 10 ? date.getDate() : '0' + month
      const day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
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
  .self-circle{
    position: absolute;
    background: rgb(32, 160, 255);
    width: 10px;
    height: 10px;
    border-radius: 10px;
    left: 0;
  }

  .search-row{
    display: flex;
    margin-right: 20px;
    align-items: center;
  }
  .search-text{
    font-size: 12px;
    text-align: right;
    margin-right: 10px;
  }

  .self-card-container{
    padding: 0 10px;
    margin-bottom: 20px;
    width: 25%;
    min-width: 25%;
    max-width: 25%;
    flex: 1;
    cursor: pointer;

  }
  .self-box-card{
    border-top: 3px solid #20a0ff;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .self-card-body{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .self-cr-text{
    font-size: 20px;
    color: #20a0ff;
    font-weight: bold;
  }
  .self-cr-desc{
    font-size: 14px;
    color: #000000;
  }

  .self-input-box{
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #3333;
  }
  .self-title{
    width: 90px;
    text-align: center;
    font-size: 14px;
  }
  .self-input{
    flex: 1;
  }

</style>
<style>
  .self-input .el-input__inner{
    flex: 1;
    border: none;
    border-left: 1px solid #3333;
    border-radius: 0;
  }
  .self-drawer .el-drawer__header{
    margin-bottom: 0px;
  }
</style>
