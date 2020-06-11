<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">周报</div>
      </div>
      <div class="self-box2">
        <div class="search-row">
          <div class="search-text search-text-fw">时间</div>
          <el-date-picker v-model="searchWeekStr" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="listChange" />
          <!-- <el-button-group>
            <el-button type="primary" @click="prevWeek">上一周</el-button>
            <el-button type="primary" @click="currentWeek">本周</el-button>
            <el-button type="primary" :disabled="!nextWeekBtnEdit" @click="nextWeek">下一周</el-button>
          </el-button-group> -->

        </div>
        <!--        <div class="search-row">-->
        <!--          <div class="search-text">月</div>-->
        <!--          <el-date-picker-->
        <!--            v-model="form.monthStr"-->
        <!--            type="month"-->
        <!--            format="MM"-->
        <!--            value-format="MM"-->
        <!--            placeholder="请选择日期"-->
        <!--          />-->
        <!--        </div>-->
        <div class="search-row">
          <div class="search-text">项目编号</div>
          <el-input v-model="form.searchProjectPro" placeholer="请输入项目编号" :clearable="true" class="search-el-input" />
        </div>
        <div class="search-row">
          <div class="search-text">项目名称</div>
          <el-input v-model="form.searchProject" placeholer="请输入项目名称" :clearable="true" class="search-el-input" />
        </div>
        <div class="search-row" style="width:10%">
          <el-button type="primary" @click="searchForm">查询</el-button>
        </div>
        <div class="search-row search-row-fix">
          <el-button type="primary" icon="el-icon-plus" :disabled="buttonDisabled" @click="addReport">新建周报</el-button>
        </div>
      </div>
      <div class="self-box2" style="flex: 1;flex-wrap: wrap;align-items: flex-start">
        <div class="self-content-wrap">
          <div v-for="(task,index) in taskList" :key="index" class="self-card-container" style="cursor: pointer">
            <!--            <el-card class="self-box-card" :body-style="{ width: '100%' }">-->
            <!--              <div slot="default" class="self-card-body">-->
            <!--                <div style="display: flex;flex-direction: column">-->
            <!--                  <div class="self-cr-text">-->
            <!--                    <span v-if="task.thisWeek">本周</span>-->
            <!--                    <span v-else>往期</span>-->
            <!--                  </div>-->
            <!--                  <div style="font-size: 12px">-->
            <!--                    {{ dateFormat(task.startDate) }}~{{ dateFormat(task.endDate) }}-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--                <div class="self-cr-desc"><span v-if="task.lackWeekly">有待写的周报</span></div>-->
            <!--              </div>-->
            <!--            </el-card>-->
            <el-card class="self-box-card" :body-style="{ width: '100%' }">
              <div slot="default" class="self-card-body">
                <div class="self-card-item-fix">
                  <div class="self-card-icon">
                    <el-icon class="el-icon-s-promotion self-font-color self-font-color-fix" />
                  </div>
                  <div class="self-card-item-ss">
                    <div class="self-card-item-ss1">
                      <div style="margin-bottom: 10px;font-size: 16px">{{ task.proName }}</div>
                      <div style="font-size: 12px">
                        {{ dateFormat(task.startDate) }}~{{ dateFormat(task.endDate) }}
                      </div>
                    </div>
                    <div class="self-card-item-ss2">
                      <el-button v-if="task.isCreate" type="primary" plain @click.stop="addReport">创建周报</el-button>
                      <el-button v-else type="primary" plain @click="lookWeek(task)">查看周报</el-button>
                    </div>
                  </div>

                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <!-- 侧边栏 -->
    <el-dialog
      ref="addDrawer"
      :visible.sync="addDrawer"
      :direction="direction"
      size="45%"
      :show-close="false"
      :destroy-on-close="true"
      :wrapper-closable="false"
      custom-class="self-drawer"
    >
      <div slot="title" style="display: flex;justify-content: space-between" class="btns-fix">
        <div style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 0 20px;flex-direction: column">
          <div style="font-size: 18px;color: #000000">新建周报</div>
          <div style="font-size: 12px;padding:5px 0 0 2px">周二、周三可以新增和修改周报</div>
        </div>
        <el-row style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 0 20px;margin-left:10px">
          <el-button size="normal" type="primary" plain @click="closeDrawer">取消</el-button>
          <el-button type="primary" size="normal" @click="submitReport">确定</el-button>
        </el-row>
      </div>
      <div slot="default" style="padding: 0 30px">
        <!-- <div style="position: absolute;left: 5px;top: 50%;width: 50px;height: 50px;cursor: pointer" @click="$refs.addDrawer.closeDrawer()">
          <el-icon class="el-icon-arrow-left" style="font-weight: bold" />
        </div> -->
        <div>
          <div>
            <el-row :gutter="20" class="mon-el-row">
              <el-col :span="12" class="self-input-box" style="margin-right:10px">
                <div class="self-title">项目名称</div>
                <el-input v-model="weekForm.projectName" :readonly="true" placeholder="请输入内容" size="small" class="self-input self-input-fix" @click.stop="searchProjectList" />
                <el-button type="primary" class="self-button" @click.stop="searchProjectList">查询</el-button>
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left:10px">
                <div class="self-title">项目代码</div>
                <el-input v-model="weekForm.projectNo" :readonly="true" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mon-el-row">
              <el-col :span="12" class="self-input-box" style="margin-right:10px">
                <div class="self-title">时间</div>
                <el-input v-model="weekForm.dateLine" :readonly="true" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
              <!--              <el-col :span="12" class="self-input-box" style="margin-left: 10px">-->
              <!--                <div class="self-title">项目角色</div>-->
              <!--                <el-select v-model="weekForm.projectRoleId" placeholder="请选择项目" size="small" class="self-input" popper-class="self-input">-->
              <!--                  <el-option-->
              <!--                    v-for="role in roleList"-->
              <!--                    :key="role.proRole"-->
              <!--                    :label="role.proRoleName"-->
              <!--                    :value="role.proRole"-->
              <!--                  />-->
              <!--                </el-select>-->
              <!--              </el-col>-->
              <el-col :span="12" class="self-input-box" style="margin-left:10px">
                <div class="self-title">项目角色</div>
                <el-input v-model="weekForm.proRoleName" :readonly="true" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>工作情况</h3>
              <div style="width: 100%;">
                <!-- <tinymce v-model="weekForm.content" :height="editorHeight" :menubar="menubar" /> -->
                <editor-bar v-model="weekForm.content" :isClear="isClear" @change="change1" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>存在的问题</h3>
              <div style="width: 100%;">
                <!-- <tinymce v-model="weekForm.problem" :height="editorHeight" :menubar="menubar" /> -->
                <editor-bar v-model="weekForm.problem" :isClear="isClear" @change="change2" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>下步计划  /  工作重点提示</h3>
              <div style="width: 100%;">
                <!-- <tinymce v-model="weekForm.keyPoint" :height="editorHeight" :menubar="menubar" /> -->
                <editor-bar v-model="weekForm.keyPoint" :isClear="isClear" @change="change3" />
              </div>
            </el-row>
            <el-row v-if="proTypeFlag == 1" style="margin-top: 10px">
              <h3>需要室所领导、处领导、总工解决的问题</h3>
              <div style="width: 100%;">
                <!-- <tinymce v-model="weekForm.keyPoint" :height="editorHeight" :menubar="menubar" /> -->
                <editor-bar v-model="weekForm.toBeSolve" :isClear="isClear" @change="change4" />
              </div>
            </el-row>
            <!--            <el-row style="margin-top: 20px">-->
            <!--              <el-button size="normal" type="primary" plain @click="$refs.addDrawer.closeDrawer()">取消</el-button>-->
            <!--              <el-button type="primary" size="normal" @click="submitReport">确定</el-button>-->
            <!--            </el-row>-->
          </div>
        </div>
      </div>

    </el-dialog>

    <!-- 预览 -->
    <el-dialog
      ref="lookDrawer"
      :visible.sync="lookDrawer"
      :direction="direction"
      size="45%"
      :show-close="false"
      :destroy-on-close="true"
      :wrapper-closable="false"
      custom-class="self-drawer"
    >
      <div slot="title" style="display: flex;justify-content: space-between" class="btns-fix">
        <div style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 0 20px;flex-direction: column">
          <div style="font-size: 18px;color: #000000">新建周报</div>
          <div style="font-size: 12px;padding:5px 0 0 2px">周二、周三可以新增和修改周报</div>
        </div>
        <el-row style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 0 20px;">
          <el-button size="normal" type="primary" plain @click="closeDrawer()">取消</el-button>
          <el-button type="primary" size="normal" :disabled="buttonDisabled" @click="reportUpdate">确定</el-button>
        </el-row>
      </div>
      <div slot="default" style="padding: 0 30px">
        <!-- <div style="position: absolute;left: 5px;top: 50%;width: 50px;height: 50px;cursor: pointer" @click="$refs.lookDrawer.closeDrawer()">
          <el-icon class="el-icon-arrow-left" style="font-weight: bold" />
        </div> -->
        <div>
          <div>
            <el-row :gutter="20" style="display: flex;margin-bottom: 20px" class="mon-el-row">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">项目名称</div>
                <el-input v-model="weekForm.projectName" :readonly="true" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">项目代码</div>
                <el-input v-model="weekForm.projectNo" :readonly="true" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row :gutter="20" style="display: flex" class="mon-el-row">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">时间</div>
                <el-input v-model="weekForm.dateLine" :readonly="true" placeholder="请输入内容" size="small" class="self-input" />
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">项目角色</div>
                <el-input v-model="weekForm.proRoleName" :readonly="true" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>工作情况</h3>
              <div style="width: 100%;">
                <editor-bar v-model="weekForm.content" :isClear="isClear" @change="change1" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>存在的问题</h3>
              <div style="width: 100%;">
                <!-- <tinymce v-model="weekForm.problem" :disabled-edit="buttonDisabled" :height="editorHeight" :menubar="menubar" /> -->
                <editor-bar v-model="weekForm.problem" :isClear="isClear" @change="change2" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>工作重点提示</h3>
              <div style="width: 100%;">
                <!-- <tinymce v-model="weekForm.keyPoint" :disabled-edit="buttonDisabled" :height="editorHeight" :menubar="menubar" /> -->
                <editor-bar v-model="weekForm.keyPoint" :isClear="isClear" @change="change3" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>需要室所领导、处领导、总工解决的问题</h3>
              <div style="width: 100%;">
                <!-- <tinymce v-model="weekForm.keyPoint" :disabled-edit="buttonDisabled" :height="editorHeight" :menubar="menubar" /> -->
                <editor-bar v-model="weekForm.toBeSolve" :isClear="isClear" @change="change4" />
              </div>
            </el-row>
            <!--            <el-row style="margin-top: 20px">-->
            <!--              <el-button size="normal" type="primary" plain @click="$refs.lookDrawer.closeDrawer()">取消</el-button>-->
            <!--              <el-button type="primary" size="normal" @click="reportUpdate" :disabled="buttonDisabled">确定</el-button>-->
            <!--            </el-row>-->
          </div>
        </div>
      </div>

    </el-dialog>

    <!-- 选择项目 -->
    <el-dialog
      title="项目列表"
      :show-close="false"
      :visible.sync="projectDialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="self-box2" style="margin: 0">
        <div class="search-row">
          <div class="search-text" style="width: 80px">项目名称</div>
          <el-input v-model="projectForm.searchProjectName" placeholder="请输入项目名称" :clearable="true" />
        </div>
        <div class="search-row">
          <div class="search-text" style="width: 80px">项目编码</div>
          <el-input v-model="projectForm.searchProjectNo" placeholder="请输入项目编码" :clearable="true" />
        </div>
        <div class="search-row">
          <el-button type="primary" @click="getProjectList">查询</el-button>
        </div>
      </div>
      <el-table
        :data="projectDataList"
        highlight-current-row
        @current-change="handleTableChange"
        @cell-click="cellClick"
      >
        <el-table-column
          width="50"
        >
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column property="proCode" label="项目编码" width="150" />
        <el-table-column property="proName" label="项目名称" width="200" />
        <el-table-column property="proType" label="项目类型">
          <template slot-scope="scope">
            {{ proTypeObj[scope.row.proType] }}
          </template>
        </el-table-column>
        <el-table-column property="proStatus" label="项目状态">
          <template slot-scope="scope">
            {{ proStatusObj[scope.row.proStatus] }}
          </template>
        </el-table-column>
        <el-table-column property="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | fmtdate }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[20, 50, 80, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="padding: 30px 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div style="text-align: right;">
        <el-button type="primary" @click="confirmPersonTable">确定</el-button>
        <el-button @click="closePersonTable">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { personWeekList, weekDate, weekAdd, reportView, weekUpdate } from '@/api/monthReport'
import EditorBar from '@/components/Edit.vue'
import { projectList, projectRoleList } from '@/api/dayReportList'
// import Tinymce from '@/components/Tinymce'
export default {
  name: 'MonthReport',
  components: { EditorBar },
  data() {
    return {
      radio: -1,
      proTypeObj: { 1: '自揽', 2: '院控' },
      proStatusObj: { 0: '停止', 1: '进行中' },
      pageSize: 10,
      pageNum: 1,
      total: 0,
      prevWeekStr: '',
      currentWeekStr: '',
      nextWeekStr: '',
      searchWeekStr: '',
      nextWeekBtnEdit: true,
      userId: '',
      menubar: '',
      projectList: [],
      roleList: [],
      taskList: [],
      editorHeight: '50px',
      addDrawer: false,
      lookDrawer: false,
      direction: 'rtl',
      buttonDisabled: true,
      currentStartDate: '',
      currentEndDate: '',
      projectDialogVisible: false,
      projectDataList: [],
      selectedProject: null,
      form: {
        searchProject: '',
        searchProjectPro: '',
        yearStr: '',
        monthStr: ''
      },
      projectForm: {
        searchProjectName: '',
        searchProjectNo: ''
      },
      weekForm: {
        projectRoleId: ''
      },
      isClear: false,
      proTypeFlag: ''
    }
  },
  mounted() {
    this.userId = this.$store.state.user.userId
    // this.getWeekList()
    // this.getProjectList()
    this.getWeekDate()
    this.searchWeekStr = this.currentWeek()
    this.nextWeekBtnEdit = false

    // 判断是否超过修改时间
    const week = new Date().getDay()
    console.log(week)
    if (week !== 2 && week !== 3) {
      // 暂时放开
      this.buttonDisabled = false
      // this.buttonDisabled = true
    } else {
      this.buttonDisabled = false
    }
  },
  methods: {
    change1(val) {
      this.weekForm.content = val
    },
    change2(val) {
      this.weekForm.problem = val
    },
    change3(val) {
      this.weekForm.keyPoint = val
    },
    change4(val) {
      this.weekForm.toBeSolve = val
    },
    listChange(e) {
      this.searchWeekStr = e
    },
    searchForm() {
      // if (this.form.searchProject) {
      //   this.toChoiceProjectPage(this.form.searchProject)
      // } else {
      //   this.getWeekList()
      // }
      this.getWeekList()
    },
    cardReport(task) {
      if (task.lackWeekly) {
        // 创建周报
        this.weekForm = {}

        this.addDrawer = true
      } else {
        // 查询周报
        reportView()
      }
    },

    addReport() {
      this.$set(this, 'weekForm', {})
      this.addDrawer = true
      // 封装默认数据
      this.weekForm.startDateStr = this.currentStartDate
      this.weekForm.endDateStr = this.currentEndDate
      this.weekForm.dateLine = this.weekForm.startDateStr + '~' + this.weekForm.endDateStr
    },
    showReportDetail(startDate, endDate) {
      console.log(startDate)
      // 跳转项目列表
      this.$router.push({ path: '/monthReport/projectList', query: { startDate: startDate, endDate: endDate }})
    },
    async lookWeek(row) {
      console.log(1)
      await reportView({ id: row.id }).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.weekForm = data
          this.weekForm.dateLine = this.dateFormat2(data.startDate) + '~' + this.dateFormat2(data.endDate)
          this.weekForm.projectId = row.projectId
          this.weekForm.projectName = row.proName
          this.weekForm.projectNo = row.proCode
          this.weekForm.proRoleName = row.proRole
          this.weekForm.startDateStr = this.dateFormat2(data.startDate)
          this.weekForm.endDateStr = this.dateFormat2(data.endDate)

          // let overTime = this.dateFormat2(data.startDate).split('-')
          // overTime = new Date(Number(overTime['0']), (Number(overTime['1']) - 1), Number(overTime['2']))
          // overTime.setDate(overTime.getDate() + 3)
          // const nowDate = new Date().getTime()
          // if (nowDate > overTime) {
          //   this.buttonDisabled = true
          // } else {
          //   this.buttonDisabled = false
          // }
        }
      })

      this.lookDrawer = true
    },
    closeDrawer() {
      this.addDrawer = false
      this.lookDrawer = false
    },
    reportUpdate() {
      this.weekForm.startDateStr = this.dateFormat2(this.weekForm.startDate)
      this.weekForm.endDateStr = this.dateFormat2(this.weekForm.endDate)
      this.weekForm.logTimeStr = this.dateFormat3(new Date())
      weekUpdate(this.weekForm).then(res => {
        const { status, msg } = res
        if (status === 200) {
          this.$message.success('修改成功')
          this.lookDrawer = false
        } else {
          this.$message.warning(msg)
        }
      })
    },
    submitReport() {
      // if (!this.weekForm.workPlace) {
      //   this.$message.warning('请输入工作地点')
      //   return false
      // }
      if (!this.weekForm.content) {
        this.$message.warning('请输入工作工作情况')
        return false
      }
      if (!this.weekForm.problem) {
        this.$message.warning('请输入存在的问题')
        return false
      }
      if (!this.weekForm.keyPoint) {
        this.$message.warning('请输入下步计划 / 工作重点提示')
        return false
      }
      this.weekForm.useId = this.userId
      this.weekForm.logTimeStr = this.dateFormat3(new Date())
      weekAdd(this.weekForm).then(res => {
        const { status } = res
        if (status === 200) {
          this.$message.success('保存成功')
          this.addDrawer = false
          // 刷新列表
          this.getWeekList()
        } else {
          this.$message.success('保存失败')
        }
      })
    },
    searchProjectList() {
      this.projectDialogVisible = true
      this.getProjectList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getProjectList()

      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getProjectList()
    },
    handleTableChange(row) {
      console.log(row)
      this.proTypeFlag = row.proType
      console.log(this.proTypeFlag)
      this.selectedProject = row
    },
    cellClick() {

    },
    // 确定
    async confirmPersonTable() {
      if (this.selectedProject === null) {
        this.$message.warning('请选择项目')
        return false
      }
      this.weekForm.projectId = this.selectedProject.id
      this.weekForm.projectName = this.selectedProject.proName
      this.weekForm.projectNo = this.selectedProject.proCode
      this.selectedProject = null
      // 调用获取角色的接口
      await this.projectRoleList(this.weekForm.projectId)

      this.projectDialogVisible = false
      this.radio = -1
    },
    // 取消
    closePersonTable() {
      this.selectedProject = null
      this.projectDialogVisible = false
      this.radio = -1
    },
    toProjectPage(task) {
      this.$router.push({ path: '/monthReport/projectList2', query: { startDate: task.startDate, endDate: task.endDate }})
    },
    toChoiceProjectPage(val) {
      this.$router.push({ path: '/monthReport/projectList', query: { projectId: val }})
    },
    changeProject(val) {
      // 清空角色列表
      // this.weekForm.projectRoleId = ''
      this.projectRoleList(val)
    },
    async projectRoleList(val) {
      let result = {}
      await projectRoleList({ projectId: val }).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.roleList = data
          result = data[0]
          this.weekForm.projectRoleId = data[0].proRole
          this.weekForm.proRoleName = data[0].proRoleName
        }
      })
      return result
    },
    getWeekList() {
      const params = { dateStr: this.searchWeekStr, proNameKeyWord: this.form.searchProject, proCodeKeyWord: this.form.searchProjectPro }
      personWeekList(params).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.taskList = data
          if (data.length > 0) {
            this.weekForm.projectRoleId = data.id
          }
        }
      })
    },
    getWeekDate() {
      const currentTime = new Date().getTime() + ''
      console.log(currentTime)
      weekDate({ dateTimeStamp: currentTime }).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.currentStartDate = data.start
          this.currentEndDate = data.end
        }
      })
    },
    getProjectList() {
      // 搜索条件
      projectList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        proType: 1,
        proCodeKeyWord: this.projectForm.searchProjectNo,
        proNameKeyWord: this.projectForm.searchProjectName
      }).then(res => {
        if (res.status === 200) {
          this.projectDataList = res.data
          this.total = res.count
        }
      })
    },
    // 上一周
    prevWeek() {
      const prevWeekTemp = this.addDate(this.searchWeekStr, -7)
      this.nextWeekBtnStatus(prevWeekTemp)
      this.searchWeekStr = prevWeekTemp
      this.getWeekList()
    },
    // 当前周
    currentWeek() {
      const weekTemp = this.dateFormat2(new Date())
      this.nextWeekBtnStatus(weekTemp)
      this.searchWeekStr = weekTemp
      this.getWeekList()
      return this.searchWeekStr
    },
    // 下一周
    nextWeek() {
      const weekTemp = this.addDate(this.searchWeekStr, 7)
      this.nextWeekBtnStatus(weekTemp)
      this.searchWeekStr = weekTemp
      this.getWeekList()
    },
    // 设置 按钮状态
    nextWeekBtnStatus(weekTemp) {
      const nowTime = (new Date()).getTime()
      const searchWeekTime = (new Date(this.addDate(weekTemp, 7))).getTime()
      if (searchWeekTime > nowTime) {
        this.nextWeekBtnEdit = false
        return false
      } else {
        this.nextWeekBtnEdit = true
        return true
      }
    },
    // 添加天数 返回时间
    addDate(date, days) {
      if (days === undefined || days === '') {
        days = 1
      }
      const newDate = new Date(date)
      newDate.setDate(newDate.getDate() + days)
      let month = newDate.getMonth() + 1
      let day = newDate.getDate()

      // 单位数前面加0
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }

      const time = newDate.getFullYear() + '-' + month + '-' + day
      return time
    },
    dateFormat: function(time) {
      const date = new Date(time)
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      const month = date.getMonth() + 1
      const day = date.getDate()
      // 拼接
      return month + '月' + '-' + day + '日'
    },
    dateFormat2: function(time) {
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
    },
    dateFormat3: function(time) {
      const date = new Date(time)
      /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month > 9 ? date.getDate() : '0' + month
      const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      const min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      const sec = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day + ' ' + date.getHours() + ':' + min + ':' + sec
    }
  }
}
</script>

<style scoped>
   .self-card-item-fix{
    display:flex;
    flex:1;
    width:100%\9;
    display: inline-block\9;
   }
   .self-font-color-fix{
     line-height:40px\9;
     display:block\9;
     font-size:18px;
     text-align:center\9;
     margin:0 auto\9;
   }
  .mon-el-row {
    display: flex;
    margin-bottom: 20px;
    display: inline-block\9;
    width:100%\9;
  }
  .self-container{
    padding: 10px 10px 10px 0;
    display: flex;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
  }
  .self-box{
    flex: 1;
    width:100%\9;
    display: inline-block\9;
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
    display: inline-block\9;
    width:100%;
    align-items: center;
    margin-bottom: 20px;
  }
  .self-content-wrap{
    display:flex;
    display: inline-block\9;
    flex-wrap:wrap;
    width:100%
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
    display: inline-block\9;
    margin-right: 20px;
    align-items: center;
    width:20%;
    float:left;

  }
  .search-row-fix{
    float:right;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
  .search-text{
    font-size: 12px;
    text-align: right;
    margin-right: 10px;
    float:left;
    line-height: 28px;
    height:28px;
    width:80px;
  }
  .search-text-fw{
    width:40px;
  }

  .self-card-container{
    padding: 0 10px;
    margin-bottom: 20px;
    width: 25%;
    min-width: 25%;
    max-width: 25%;
    flex: 1;
    cursor: pointer;
    float:left\9;

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
    width:50%\9;
    /* margin-right:20px\9; */
    float: left\9;
    border: 1px solid #dcdfe6;
  }
  .self-input-box:last-child{
    float:right\9;
    margin-right:-20px\9;
  }
  .self-title{
    width: 90px;
    text-align: center;
    font-size: 14px;
    display: inline-block\9;
    float:left\9;
    height:32px \9;
    line-height: 32px\9;
  }
  .self-input{
    flex: 1;
    width:calc(100% - 90px) \9;
    float:right\9
  }
  .self-input-fix{
    width:calc(100% - 180px);
    float:left\9;
  }
  .self-button{
    width:90px;
    float:right\9;
  }
  .search-el-input{
    width:calc(100% - 90px)\9;
    float:right\9;
  }
  .self-card-item-ss{
    display:flex;
    display: inline-block\9;
    flex:1;
    width:calc(100% - 60px);
    justify-content:space-between;
  }
  .self-card-item-ss1{
    width:70%;
    float:left;
  }
  .self-card-item-ss1 > div:first-child{
     text-overflow: -o-ellipsis-lastline;
     overflow: hidden;
     text-overflow: ellipsis;
     display: -webkit-box;
     -webkit-line-clamp: 2;
     -webkit-box-orient: vertical;
     float: left;
     word-break: break-all;
    height: 40px;
    line-height: 20px;
    overflow: hidden;
  }
  .self-card-item-ss1 > div:last-child{
    width:100%;
    float:left
  }
  .self-card-item-ss2{
    width:30%;
    float:right;
  }
  .self-card-icon{
    width: 40px;
    height: 40px;
    background: aliceblue;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    float:left\9;
  }
  h3{
    margin: 10px 0;
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
  .self-input .el-button{
    background: white;
    border: none;
    box-shadow: none;
  }
  .self-input .el-input-group__append{
    border: none;
    box-shadow: none;
    background: white;
  }
  .self-drawer .el-row{
    margin-right:-10px!important;
    margin-left:-10px!important;
  }
  .btns-fix{
    display: flex;
    flex-direction:column;
  }
  .btns-fix .el-row{
    margin-left:0px!important;
  }
  .self-card-item-ss2 .el-button{
    width:100%;
    font-size: 11px!important;
    padding:6px 0px!important;
  }
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) { /* 3. */
    .self-font-color-fix{
      margin:0px!important;
    }
  }
</style>
