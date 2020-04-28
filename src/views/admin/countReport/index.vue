<template>

  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">数据统计</div>
      </div>
      <div class="self-box3 self-box3-fixed">
        <div class="self-box3-wrap-fix">
          <div class="self-count-title">
            <div><el-icon class="el-icon-s-comment self-font-color" style="font-size: 30px" /></div>
            <div>日报</div>
          </div>
          <div class="self-box2 self-box2-fix2">
            <div class="self-box2-title" style="font-size: 14px;padding-right: 10px">项目名称</div>
            <div>
              <el-select v-model="projectId" placeholder="请选择项目" size="small" @change="dailyChange">
                <el-option
                  v-for="project in projectList"
                  :key="project.id"
                  :label="project.label"
                  :value="project.id"
                />
              </el-select>
            </div>
          </div>
          <div class="self-box3 self-card-box-fix clearfix">
            <div class="self-card-box" @click="dailyCommitDetail">
              <div class="self-font-color self-count-num">{{ dailyCommit.count }}</div>
              <div class="self-card-count-title">
                已发人数
              </div>
            </div>
            <div class="self-card-box" @click="dailyLackDetail">
              <div class="self-font-color self-count-num">{{ dailyLack.count }}</div>
              <div class="self-card-count-title">
                未发人数
              </div>
            </div>
            <div class="self-card-box">
              <div class="self-font-color self-count-num">{{ dailyTotal }}</div>
              <div class="self-card-count-title">
                日报份数
              </div>
            </div>
          </div>
        </div>
        <div class="self-box3-wrap-fix">
          <div class="self-count-title">
            <div><el-icon class="el-icon-s-comment self-font-color" style="font-size: 30px" /></div>
            <div>周报</div>
          </div>
          <div class="self-box2">
            <div class="self-box2-title" style="font-size: 14px;padding-right: 10px">项目名称</div>
            <div>
              <el-select v-model="weekProjectId" placeholder="请选择项目" size="small" @change="weekChange">
                <el-option
                  v-for="project in projectList"
                  :key="project.id"
                  :label="project.label"
                  :value="project.id"
                />
              </el-select>
            </div>
          </div>
          <div class="self-box3 self-card-box-fix clearfix">
            <div class="self-card-box" @click="weekCommitDetail">
              <div class="self-font-color self-count-num">{{ weekCommit.count }}</div>
              <div class="self-card-count-title">
                已发人数
              </div>
            </div>
            <div class="self-card-box" @click="weekLackDetail">
              <div class="self-font-color self-count-num">{{ weekLack.count }}</div>
              <div class="self-card-count-title">
                未发人数
              </div>
            </div>
            <div class="self-card-box">
              <div class="self-font-color self-count-num">{{ weekTotal }}</div>
              <div class="self-card-count-title">
                周报份数
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      :visible.sync="commitDrawer"
      :direction="direction"
      size="30%"
      custom-class="self-drawer"
    >
      <div slot="title">
        <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;padding: 0 20px">
          <div style="font-size: 18px;color: #000000">已发人数列表 </div>
        </div>
      </div>
      <div slot="default" style="padding: 0 30px" class="ctable">
        <div v-if="tableData === null || tableData.length === 0" style="margin-top: 20%;text-align: center">
          <el-image style="text-align: center;max-width: 280px" src="/noData.png" />
        </div>
        <el-table
          v-else
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="userName"
            label="姓名"
          />
          <el-table-column
            prop="type"
            label="类型"
          >
            <template>{{ reportType }}</template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
          >
            <template>{{ statusText }}</template>
          </el-table-column>
          <el-table-column
            prop="logTimeStr"
            label="提交时间"
          >
            <template slot-scope="scope">{{ dateFormat(scope.row.logTimeStr) }}</template>
          </el-table-column>
        </el-table>
      </div>

    </el-drawer>
    <el-drawer
      :visible.sync="lackDrawer"
      :direction="direction"
      size="30%"
      custom-class="self-drawer"
    >
      <div slot="title">
        <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;padding: 0 20px">
          <div style="font-size: 18px;color: #000000">未发人数列表 </div>
        </div>
      </div>
      <div slot="default" style="padding: 0 30px" class="ctable">
        <div v-if="tableData === null || tableData.length === 0" style="margin-top: 20%;text-align: center">
          <el-image style="text-align: center;max-width: 280px" src="/noData.png" />
        </div>
        <el-table
          v-else
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="userName"
            label="姓名"
          />
          <el-table-column
            prop="type"
            label="类型"
          >
            <template>{{ reportType }}</template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
          >
            <template>{{ statusText }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>

</template>

<script>
import { projectList, dailyCount, weekCount } from '@/api/countReport'
export default {
  name: 'CountReport',
  data() {
    return {
      commitDrawer: false,
      lackDrawer: false,
      direction: 'rtl',
      reportType: '日报',
      statusText: '',
      projectList: [],
      weekProjectId: '',
      projectId: '',
      dailyLack: { count: 0, list: [] },
      dailyCommit: { count: 0, list: [] },
      dailyTotal: 0,
      weekLack: { count: 0, list: [] },
      weekCommit: { count: 0, list: [] },
      weekTotal: 0,
      tableData: []
    }
  },
  mounted() {
    this.getProjectList()
  },
  methods: {
    showDetail() {
      this.drawer = true
    },
    dailyCommitDetail() {
      this.commitDrawer = true
      this.tableData = this.dailyCommit.list
      this.reportType = '日报'
      this.statusText = '已发'
    },
    dailyLackDetail() {
      this.lackDrawer = true
      this.tableData = this.dailyLack.list
      this.reportType = '日报'
      this.statusText = '未发'
    },
    weekCommitDetail() {
      this.commitDrawer = true
      this.tableData = this.weekCommit.list
      this.reportType = '周报'
      this.statusText = '已发'
    },
    weekLackDetail() {
      this.lackDrawer = true
      this.tableData = this.weekLack.list
      this.reportType = '周报'
      this.statusText = '未发'
    },
    dailyChange() {
      this.getDailyCount()
    },
    weekChange() {
      console.log(22)
      this.getWeekCount()
    },
    getProjectList() {
      projectList().then(res => {
        if (res.status === 200) {
          this.projectList = res.data
        }
      })
    },
    getDailyCount() {
      dailyCount({ projectId: this.projectId }).then(res => {
        if (res.status === 200) {
          this.dailyLack = res.data.lackItem
          this.dailyCommit = res.data.commitItem
          this.dailyTotal = res.data.total
        }
      })
    },
    getWeekCount() {
      console.log(weekCount, 'week')
      weekCount({ projectId: this.weekProjectId }).then(res => {
        if (res.status === 200) {
          this.weekLack = res.data.lackItem
          this.weekCommit = res.data.commitItem
          this.weekTotal = res.data.total
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
      const min = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
      const sec = date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day + ' ' + date.getHours() + ':' + min + ':' + sec
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
    display: inline-block\9;
    width:100%;
    flex-direction: column;
    flex: 1;
    background: white;
    position: relative;
    padding: 30px;
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
  .self-box2-fix2{
    display: inline-block\9;
  }
  .self-box2-title{
    line-height: 32px\9;
    height:32px\9;
    float:left\9;
  }
  .self-box3{
    position: relative;
    padding: 0 ;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    display: block\9;
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

  .self-count-title{
    background: rgba(32, 160, 255,0.1);
    height: 50px;
    display: flex;
    display: block\9;
    justify-content: flex-start;
    align-content: center;
    margin-bottom: 20px;
    border-radius: 6px;
  }
  .self-count-title>div{
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #20a0ff;
    padding-left: 10px;
  }
  .self-card-box{
    display: flex;
    flex-direction: column;
    background:rgba(32, 160, 255,0.1);
    border-radius: 6px;
    flex: 1;
    padding: 10px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: block\9;
    width:30%;
    margin-right:4%;
    float:left\9;
  }
  .self-card-box:last-child{
    margin-right:0;
  }
  .self-count-num{
    font-size: 50px;
    padding-bottom: 5px;
  }
  .self-card-count-title{
    font-size: 12px;
  }
  .self-chart-box{
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: flex-start;
  }

</style>
<style>
  .ctable .el-table__body,.ctable .el-table__header{
    width:100%!important;
  }
  .ctable table{
    width:100%!important;
  }
  .self-input .el-input__inner{
    flex: 1;
    border: none;
    border-left: 1px solid #3333;
    border-radius: 0;
  }
  .self-drawer .el-drawer__header{
    margin-bottom: 0px;
  }
  .self-drawer .el-drawer__header div{
    width:80%\9;
  }
  .self-drawer .el-drawer__header button{
    width:20%\9;
  }
  .self-box3-wrap-fix{
    flex:1;
    height: 100%;
    padding: 0 10px;
    display:flex;
    display:inline-block \9;
    flex-direction: column;
    width: 100%;
  }
  .self-card-box-fix{
    display: flex!important;
    flex-direction:row!important;
    width:100%;
  }
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
   .self-box3-wrap-fix{
     flex-basis:auto;
   }
   .self-card-box-fix{
    display: flex!important;
    flex-direction:row!important;
   }
  .ctable .el-table__body,.ctable .el-table__header{
    width:100%!important;
   }
  }
</style>
