<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">日报</div>
      </div>
      <div class="self-box2">
        <div class="search-row">
          <div class="search-text">时间</div>
          <el-date-picker v-model="form.searchDate" type="date" :picker-options="pickerOptions" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="listChange" />
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
          <el-button type="primary" icon="el-icon-plus" @click="showReport">新建日报</el-button>
        </div>
      </div>

      <div class="self-box2 self-box2-fix-b">
        <div v-for="(task,index) in taskList" :key="index" class="self-card-container" @click="showReportDetail(task.logDate)">
          <el-card class="self-box-card" :body-style="{ width: '100%' }">
            <div slot="default" class="self-card-body">
              <div class="self-cr-text">
                <span v-if="task.today">今天</span>
                <span v-else>{{ task.logDate }}</span>
              </div>
              <div class="self-cr-desc"><span v-if="task.lackDaily">有待写的日报</span></div>
            </div>
          </el-card>
        </div>
        <div v-if="taskList.length == 0" class="tasknodata">暂无数据</div>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 侧边栏 -->
    <el-dialog
      ref="addDrawer"
      :visible.sync="addDrawer"
      :direction="direction"
      width="30%"
      size="30%"
      :show-close="false"
      :wrapper-closable="false"
      custom-class="self-drawer self-drawer-fix"
    >
      <div slot="title">
        <div style="display: flex;align-items: flex-start;justify-content: flex-start;margin-bottom: 10px;padding: 0 20px;flex-direction: column">
          <div style="font-size: 18px;color: #000000">新建日报 </div>
          <!-- <div style="font-size: 12px;padding:5px 0 0 2px">22:00后将不能修改</div> -->
        </div>

      </div>
      <div slot="default" style="padding: 0 30px">
        <!-- <div style="position: absolute;left: 5px;top: 50%;width: 50px;height: 50px;cursor: pointer" @click="$refs.addDrawer.closeDrawer()">
          <el-icon class="el-icon-arrow-left" style="font-weight: bold" />
        </div> -->
        <div>
          <div>
            <el-row class="daytitle">
              <h3>时间（天）</h3>
              <el-date-picker v-model="reportForm.logTimeStr" type="date" :picker-options="pickerOptions" format="yyyy-MM-dd" class="ep-timer" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="listChange" />
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
  </div>
</template>

<script>
import EditorBar from '@/components/Edit.vue'
import { dayReportList, projectList, projectRoleList, reportAdd } from '@/api/dayReportList'
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
        content: ''
      },
      content: '',
      isClear: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 604800000 || time.getTime() > Date.now()
        }
      }
    }
  },
  created() {
  },
  mounted() {
    this.form.searchDate = this.dateFormat(new Date())
    this.getList()
    // this.getProjectList()
  },
  methods: {
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
    listChange(e) {
      this.form.searchDate = e
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
      this.reportForm = {}
      this.reportForm.logTimeStr = this.dateFormat(new Date())
      this.addDrawer = true
    },
    showReportDetail(date) {
      this.$router.push({ path: '/dayReport/projectList', query: { date: date }})
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
        const { status, data } = res
        if (status === 200) {
          this.taskList = data
        }
      })
    },
    changeProject(val) {
      // 清空角色列表\
      // this.reportForm.projectRoleId = ''
      this.projectRoleList(val)
    },
    getProjectList() {
      // if (!this.form.proCodeKeyWord) {
      //   this.$message.warning('请输入项目编号')
      //   return false
      // }
      projectList({ proCodeKeyWord: this.form.proCodeKeyWord, proNameKeyWord: this.form.proNameKeyWord, pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
        }
      })
    },
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
  .daytitle{
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    /* border:1px solid #DCDFE6; */
  }
  .daytitle h3{
    width:100px;
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

</style>
<style>
  .self-input .el-input__inner{
    flex: 1;
    border: none;
    border-left: 1px solid #3333;
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
  .daytitle .ep-timer{
    width:calc(100% - 100px)
  }
  .self-drawer-fix .el-dialog__header{
    padding:30px 20px 20px 30px
  }
  .self-drawer-fix .el-dialog__body{
    padding:10px 20px 30px 20px;
  }
  .self-box2-fix-b{
   flex: 1;
   flex-wrap: wrap;
   width:100%;
   min-height:500px;
  }
  .search-row-btn-right{
    flex:1;
    display: flex;
    justify-content: flex-end;
  }
  .tasknodata{
    display: flex;
    justify-content: center;
    align-items:center;
    flex:1;
    width:100%;
    font-size:14px;
    color:#999;
  }
</style>
