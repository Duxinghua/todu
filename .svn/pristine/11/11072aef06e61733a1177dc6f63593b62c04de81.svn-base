<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">周报</div>
      </div>
      <div class="self-box3">
        <div class="search-row">
          <div class="search-text">时间</div>
          <el-date-picker
            v-model="form.searchDate"
            placeholder="请选择日期"
          />
        </div>
        <div class="search-row">
          <div class="search-text">项目</div>
          <el-select v-model="form.searchProject" placeholder="请选择项目">
            <el-option
              v-for="project in projectList"
              :key="project.value"
              :label="project.label"
              :value="project.value"
            />
          </el-select>
        </div>
        <div class="search-row">
          <el-button type="primary" @click="searchForm">查询</el-button>
        </div>
      </div>
      <div class="self-box2" style="flex: 1;flex-wrap: wrap;align-items: flex-start">
        <div style="display: flex;flex-wrap: wrap;width: 100%">
          <div v-for="(task,index) in taskList" :key="index" class="self-card-container" @click="showReportDetail(task.date)">
            <el-card class="self-box-card" :body-style="{ width: '100%' }">
              <div slot="default" class="self-card-body">
                <div style="display: flex;flex-direction: column">
                  <div class="self-cr-text">
                    <span v-if="task.thisWeek">本周</span>
                    <span v-else>往期</span>
                  </div>
                  <div style="font-size: 12px">
                    {{ task.weeklyDateStr }}
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div class="self-box2">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="pageTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { weeklyReportList } from '@/api/sMonthReport'
export default {
  name: 'MonthReport',
  data() {
    return {
      menubar: '',
      projectList: [],
      taskList: [],
      editorHeight: 100,
      drawer: false,
      direction: 'rtl',
      buttonDisabled: false,
      currentWeek: '52',
      currentPage: 1,
      pageTotal: 6,
      pageSize: 20,
      form: {
        searchProject: '',
        keyword: '',
        currentWeek: '52',
        startDate: '2020-01-03',
        endDate: '2020-01-07',
        workContent: '123123',
        planContent: '1233132111',
        projectName: '测试',
        projectId: '',
        projectRole: '初测',
        projectDate: '30',
        workPlace: '工作地点'

      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    searchForm() {
      this.getList()
    },
    showReport() {
      this.drawer = true
    },
    showReportDetail(date) {
      // 跳转项目列表
      this.$router.push('/sMonthReport/personList')
    },
    closeDrawer() {
      this.drawer = false
    },
    submitReport() {
      this.drawer = false
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    getList() {
      weeklyReportList({ pageSize: this.pageSize, pageNum: this.currentPage, logTimeStr: this.form.searchDate }).then(res => {
        const { status, data, count } = res
        if (status === 200) {
          this.taskList = data
          this.pageTotal = count
        }
      })
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
    margin-bottom: 5px;
  }
  .self-cr-desc{
    font-size: 12px;
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
