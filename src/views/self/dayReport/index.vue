<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">配施日志</div>
      </div>
      <div class="self-box2 self-box2-fixed">
        <div class="search-row">
          <div class="search-text" style="width:40px">时间</div>
          <el-date-picker v-model="form.searchDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="listChange" />
        </div>
        <!-- <div class="search-row">
          <div class="search-text">项目</div>
          <el-select v-model="form.searchProject" placeholder="请选择项目" @change="toProjectPage">
            <el-option
              v-for="project in projectList"
              :key="project.id"
              :label="project.label"
              :value="project.id"
            />
          </el-select>
        </div> -->
        <div class="search-row" style="display:none">
          <div class="search-text" style="width: 70px">项目编号</div>
          <el-input v-model="form.proCodeKeyWord" placeholder="请输入关键词" />
        </div>
        <div class="search-row" style="display:none">
          <div class="search-text" style="width: 70px">项目名称</div>
          <el-input v-model="form.proNameKeyWord" placeholder="请输入关键词" />
        </div>
        <div class="search-row">
          <el-button type="primary" @click="searchForm">查询</el-button>
        </div>

        <div class="search-row search-row-btn-right">
          <el-button type="primary" icon="el-icon-plus" @click="showReport">新建配施日志</el-button>
        </div>
      </div>

      <div class="self-box2 self-box2-fix-b">
        <!-- <div v-for="(task,index) in taskList" :key="index" class="self-card-container" @click="showReportDetail(task,1)">
          <el-card class="self-box-card" :body-style="{ width: '100%' }">
            <div slot="default" class="self-card-body">
              <div class="self-cr-text">
                <span>{{ task.logTime }}</span>
              </div>
            </div>
          </el-card>
        </div>
        <div v-if="taskList.length == 0" class="tasknodata">暂无数据</div> -->

        <el-table
          :data="taskList"
          border
          style="width: 100%"
          :height="tableHeight"
          :fit="true"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
        >
          <el-table-column
            prop="deptName"
            label="部门"
          />
          <el-table-column
            prop="workNumber"
            label="工号"
          />
          <el-table-column
            prop="userName"
            label="姓名"
          />
          <el-table-column
            prop="proCode"
            label="项目代码"
          />
          <el-table-column
            prop="proName"
            label="项目"
          />
          <el-table-column
            prop="content"
            label="日志内容"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.content" />
            </template>
          </el-table-column>
          <el-table-column
            prop="logTime"
            label="日期"
          />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                style="font-size: 14px"
                @click="handleEdit(scope.row)"
              >编辑
              </el-link>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 表格分页组件 -->
      <div style="padding: 20px 0 ">
        <el-pagination
          style="margin-top: 20px;"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 80, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="proSizeChange"
          @current-change="proCurrentChange"
        />
      </div>
    </div>
    <!-- 侧边栏 -->
    <el-dialog
      ref="addDrawer"
      :visible.sync="addDrawer"
      :direction="direction"
      width="45%"
      size="45%"
      :show-close="false"
      custom-class="self-drawer self-drawer-fix"
    >
      <!--  :wrapper-closable="false"  -->
      <div slot="title">
        <div style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 0 20px;flex-direction: column">
          <div style="font-size: 18px;color: #000000">{{ newText }} </div>
          <!-- <div style="font-size: 12px;padding:5px 0 0 2px">22:00后将不能修改</div> -->
        </div>

      </div>
      <div slot="default" style="padding: 0 30px">
        <!-- <div style="position: absolute;left: 5px;top: 50%;width: 50px;height: 50px;cursor: pointer" @click="$refs.addDrawer.closeDrawer()">
          <el-icon class="el-icon-arrow-left" style="font-weight: bold" />
        </div> -->
        <div>
          <div>
            <el-row class="daytitle dayproName">
              <el-col :span="12" class="prowrap" style="margin-right: 10px">
                <h3>项目</h3>
                <el-input v-model="reportForm.proName" :readonly="readonly" size="small" />
                <el-button type="primary" class="self-button" @click.stop="searchProjectList">查询</el-button>
              </el-col>
              <el-col :span="12" class="prowrap prowrapfix">
                <h3>项目编码</h3>
                <el-input v-model="reportForm.proCode" :readonly="readonly" size="small" @input="proCodeFocus" @focus="proCodeFocus" />
              </el-col>
            </el-row>
            <el-row class="daytitle">
              <h3>时间（天）</h3>
              <!-- :picker-options="pickerOptions" -->
              <el-date-picker v-model="reportForm.logTimeStr" :picker-options="pickerOptions" type="date" format="yyyy-MM-dd" class="ep-timer" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="timeChange" @focus="timeFocus" />
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>当日工作内容</h3>
              <div class="reportwrap" style="width: 100%;">
                <editor-bar v-model="reportForm.content" :isClear="isClear" @change="change" />
              </div>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-button size="normal" type="primary" plain @click="closeDrawer">取消</el-button>
              <el-button type="primary" size="normal" @click="submitReport">确定</el-button>
            </el-row>
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
        <!-- <el-table-column
          label="序号"
          type="index"
          width="50"
        /> -->
        <el-table-column property="id" label="序号" />
        <el-table-column property="proCode" label="项目编码" width="100" />
        <el-table-column property="proName" label="项目名称" width="300" />
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
        <el-table-column property="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createTime | fmtdate }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="projectpageNum"
        :page-sizes="[20, 50, 80, 200]"
        :page-size="projectpageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="propageTotal"
        style="padding: 30px 0"
        @size-change="proSizeChange"
        @current-change="proCurrentChange"
      />
      <div style="text-align: right;">
        <el-button type="primary" @click="confirmPersonTable">确定</el-button>
        <el-button @click="closePersonTable">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EditorBar from '@/components/Edit.vue'
import { dayReportList, projectRoleList, reportAdd, dailyAddStatus, dailyUpdate } from '@/api/dayReportList'
import { projectSelectListNormalps } from '@/api/project'
// import Tinymce from '@/components/Tinymce'
export default {
  name: 'DayReport',
  components: { EditorBar },
  data() {
    return {
      menubar: '',
      projectList: [],
      roleList: [],
      taskList: [],
      addDrawer: false,
      direction: 'rtl',
      form: {
        searchDate: '',
        projectDate: ''
      },
      reportForm: {
        logTimeStr: '',
        content: '',
        proName: '',
        proCode: ''
      },
      content: '',
      isClear: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      flag: false,
      tableHeight: 500,
      // pickerOptions: {
      //   disabledDate(time) {
      //     if (this.flag) {
      //       return time.getTime() < Date.now() - 604800000 || time.getTime() > Date.now()
      //     } else {
      //       return time.getTime() < Date.now() - 604800000 || time.getTime() > Date.now() - 86400000
      //     }
      //   }
      // }
      logTimeStr: '',
      newText: '新建配施日志',
      type: false,
      id: '',
      projectDialogVisible: false,
      projectDataList: [],
      pageTotal: 0,
      projectpageNum: 1,
      projectpageSize: 10,
      propageTotal: 0,
      projectForm: {
        searchProjectNo: '',
        searchProjectName: ''
      },
      selectedProject: null,
      radio: -1,
      readonly: false,
      proTypeObj: { 1: '自揽', 2: '院控' },
      proStatusObj: { 0: '停止', 1: '进行中' },
      proIndex: 1,
      proSize: 10
    }
  },
  computed: {
    pickerOptions() {
      var _this = this
      return {
        disabledDate(time) {
          if (_this.flag) {
            return time.getTime() < Date.now() - 604800000 || time.getTime() > Date.now()
          } else {
            return time.getTime() < Date.now() - 604800000 || time.getTime() > Date.now() - 86400000
          }
        }
      }
    }
  },
  created() {
  },
  mounted() {
    this.form.searchDate = this.dateFormat(new Date())
    this.getList()
  },
  methods: {
    handleEdit(e) {
      this.showReportDetail(e)
    },
    proCodeFocus(e) {
      var newTimer = this.dateFormat(new Date())
      var that = this
      dailyAddStatus({ logTimeStr: newTimer, proCode: this.reportForm.proCode }).then((res) => {
        if (res.code === 200) {
          if (!res.data) {
            that.reportForm.logTimeStr = ''
            that.flag = res.data
          } else {
            that.reportForm.logTimeStr = newTimer
            that.flag = res.data
          }
        } else {
          this.reportForm.logTimeStr = ''
        }
      })
    },
    projectNoChange(e) {
      this.flag = false
    },
    cellClick() {

    },
    // 确定
    confirmPersonTable() {
      if (this.selectedProject === null) {
        this.$message.warning('请选择项目')
        return false
      }
      var newTimer = this.dateFormat(new Date())
      var that = this
      dailyAddStatus({ logTimeStr: newTimer, proCode: this.selectedProject.proCode }).then((res) => {
        if (res.code === 200) {
          if (!res.data) {
            that.reportForm.logTimeStr = ''
            that.flag = res.data
          } else {
            that.reportForm.logTimeStr = newTimer
            that.flag = res.data
          }
        } else {
          this.reportForm.logTimeStr = ''
        }
      })
      this.reportForm.proName = this.selectedProject.proName
      this.reportForm.proCode = this.selectedProject.proCode
      this.projectDialogVisible = false
    },
    // 取消
    closePersonTable() {
      this.selectedProject = null
      this.projectDialogVisible = false
      this.radio = -1
    },
    handleTableChange(row) {
      console.log(row)
      this.proTypeFlag = row.proType
      console.log(this.proTypeFlag)
      this.selectedProject = row
    },
    // 新增查询
    searchProjectList() {
      this.selectedProject = null
      this.radio = -1
      this.projectDialogVisible = true
      this.getProjectList()
    },
    getProjectList() {
      // 搜索条件
      projectSelectListNormalps({
        pageNum: this.projectpageNum,
        pageSize: this.projectpageSize,
        proCodeKeyWord: this.projectForm.searchProjectNo,
        proNameKeyWord: this.projectForm.searchProjectName
      }).then(res => {
        if (res.status === 200) {
          this.projectDataList = res.data
          this.propageTotal = res.count
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getList()

      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getList()
    },
    proSizeChange(val) {
      this.projectpageSize = val
      this.projectpageNum = 1
      this.getProjectList()

      console.log(`每页 ${val} 条`)
    },
    proCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.projectpageNum = val
      this.getProjectList()
    },
    listChange(e) {
      console.log(e)
      this.form.searchDate = e
    },
    timeFocus(e) {

    },
    timeChange(e) {
      if (!this.reportForm.proCode && !this.reportForm.proName) {
        this.$alert('您选择项目或者填写项目', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.reportForm.logTimeStr = ''
          }
        })
        return
      }
      dailyAddStatus({ logTimeStr: this.reportForm.logTimeStr, proCode: this.reportForm.proCode }).then((res) => {
        if (res.code === 200) {
          if (!res.data) {
            this.$alert('您选择的日期已写过配施日志，请重新选择', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.reportForm.logTimeStr = ''
              }
            })
          } else {
            this.reportForm.logTimeStr = e
          }
        } else {
          this.reportForm.logTimeStr = ''
        }
      })
    },
    change(val) {
      this.reportForm.content = val
    },
    // reportForm.plan
    changes(val) {
      this.reportForm.plan = val
    },
    searchForm() {
      this.getList()
    },
    showReport() {
      this.newText = '新建配施日志'
      this.reportForm.proName = ''
      this.reportForm.proCode = ''
      this.reportForm.content = ''
      this.reportForm.logTimeStr = ''
      this.type = false
      this.addDrawer = true
      // dailyAddStatus({ logTimeStr: this.reportForm.logTimeStr }).then((res) => {
      //   if (res.code === 200) {
      //     that.flag = res.data
      //     if (that.flag === false) {
      //       that.reportForm.logTimeStr = ''
      //     }
      //     this.addDrawer = true
      //   }
      // })
    },
    showReportDetail(data) {
      // this.$router.push({ path: '/dayReport/projectList', query: { date: date }})
      this.type = true
      this.newText = '修改配施日志'
      this.id = data.id
      this.reportForm.logTimeStr = this.dateFormat(data.logTime)
      this.reportForm.content = data.content
      this.reportForm.proName = data.proName
      this.reportForm.proCode = data.proCode
      this.addDrawer = true
    },
    closeDrawer() {
      this.addDrawer = false
    },
    toProjectPage(val) {
      console.log(val)
      this.$router.push({ path: '/dayReport/projectList2', query: { projectId: val }})
    },
    getList() {
      dayReportList({ logTimeStr: this.form.searchDate, pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
        const { status, data, count } = res
        if (status === 200) {
          var list = []
          data.map((item) => {
            item.logTime = this.dateFormat(item.logTime)
            list.push(item)
          })
          this.taskList = list
          this.total = count
        }
      })
    },
    changeProject(val) {
      // 清空角色列表\
      // this.reportForm.projectRoleId = ''
      this.projectRoleList(val)
    },
    // getProjectList() {
    //   projectList({ proCodeKeyWord: this.form.proCodeKeyWord, proNameKeyWord: this.form.proNameKeyWord, pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
    //     if (res.status === 200) {
    //       this.projectList = res.data
    //     }
    //   })
    // },
    projectRoleList(val) {
      projectRoleList({ projectId: this.reportForm.projectId }).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.roleList = data
        }
      })
    },
    submitReport() {
      if (!this.reportForm.logTimeStr) {
        this.$message.warning('请选择日期')
        return false
      }
      if (!this.reportForm.content) {
        this.$message.warning('请输入工作工作情况')
        return false
      }
      if (!this.type) {
        reportAdd(this.reportForm).then(res => {
          const { status } = res
          if (status === 200) {
            this.$message.success('保存成功')
            this.addDrawer = false
            // 刷新列表
            this.getList()
          } else {
            this.$message.success('保存失败')
          }
        })
      } else {
        dailyUpdate({ id: this.id, content: this.reportForm.content }).then((res) => {
          const { status } = res
          if (status === 200) {
            this.$message.success('修改成功')
            this.addDrawer = false
            // 刷新列表
            this.getList()
          } else {
            this.$message.success('修改失败')
          }
        })
      }
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
  .prowrapfix{
    justify-content: center;
    text-align: center;
  }
  .prowrap{
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    position: relative;
  }
  .prowrap .self-button{
    position: absolute;
    top:50%;
    right:10px;
    transform: translateY(-50%)
  }
  .daytitle{
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    /* border:1px solid #DCDFE6; */
  }
  .daytitle h3{
    width:100px;
    float:left\9;
  }
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
    display: inline-block\9;
    margin-right: 20px;
    align-items: center;
    width:20%;
  }
  .search-text{
    font-size: 12px;
    text-align: right;
    margin-right: 10px;
    float:left\9;
    height:28px\9;
    line-height: 28px\9;
  }

  .self-card-container{
    padding: 0 10px;
    margin-bottom: 20px;
    width: 25%;
    min-width: 25%;
    max-width: 25%;
    flex: 1;
    cursor: pointer;
    float: left;

  }
  .self-box-card{
    border-top: 3px solid #20a0ff;
    height: 70px;
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
    border: 1px solid #DCDFE6;
    /* margin-right: 10px; */
    display: inline-block\9;
    float: left\9;
  }
  .self-input-box:last-child{
    float:right\9;
    margin-right:0px;
  }
  .self-title{
    width: 90px;
    text-align: center;
    font-size: 14px;
    height: 32px\9;
    line-height: 32px\9;
    float:left\9;
  }
  .self-input{
    flex: 1;
    width:calc(100% - 90px)\9;
  }
  .reportwrap /deep/ .v-note-edit{
    width:100%;
    height:250px;
  }
  .elrow-fix{
    display: flex;
    display: inline-block\9;
    margin-bottom: 20px
  }
  .self-box2-fixed{
    margin-bottom: 0px;
  }
</style>
<style>
  .self-input .el-input__inner{
    flex: 1;
    border: none;
    border-left: 1px solid #333;
    border-radius: 0;
    height:32px;
    line-height:32px;
  }
  .self-drawer .el-drawer__header{
    margin-bottom: 0px;
  }
  .daytitle .el-input--mini,.daytitle .el-input__inner{
    height:48px;
    line-height:48px;
  }
  .daytitle .el-input__inner {
    border:1px solid #DCDFE6!important;
  }
  .daytitle .ep-timer{
    width:calc(100% - 100px);
    float:left;
    /* border:1px solid #DCDFE6; */
  }
  .dayproName .el-input{
    width:calc(100% - 100px);
    float:left;
  }
  .self-drawer-fix .el-dialog__header{
    padding:30px 20px 20px 30px
  }
  .self-drawer-fix .el-dialog__body{
    padding:10px 20px 30px 20px;
  }
  .self-box2-fix-b{
   flex: 1;
   display: inline-block\9;
   flex-wrap: wrap;
   align-items:flex-start!important;
   padding-top:0px!important;
   width:100%;
   min-height:500px;
  }
  .search-row-btn-right{
    flex:1;
    display: flex;
    display: inline-block\9;
    justify-content: flex-end;
    margin-left:calc(40% - 100px);
  }
  .search-row-btn-right button{
    margin-left:calc(100%- 80px);
  }
  .tasknodata{
    display: flex;
    justify-content: center;
    align-items:center;
    flex:1;
    width:100%;
    margin-top:100px;
    font-size:14px;
    color:#999;
  }
</style>
