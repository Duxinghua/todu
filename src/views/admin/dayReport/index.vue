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
          <div class="search-text" style="width:40px">时间</div>
          <el-date-picker
            v-model="form.searchDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期"
          />
        </div>
        <div class="search-row search-row-dep">
          <div class="search-text">部门</div>
          <el-select v-model="form.searchProject" clearable placeholder="请选择部门" class="el-select-f">
            <el-option
              v-for="project in projectList"
              :key="project.id"
              :label="project.deptName"
              :value="project.id"
            />
          </el-select>
        </div>
        <div class="search-row">
          <div class="search-text">工号</div>
          <el-input v-model="form.job_number" placeholder="请输入员工工号" />
        </div>
        <div class="search-row">
          <div class="search-text">姓名</div>
          <el-input v-model="form.job_staff" placeholder="请输入员工姓名" />
        </div>
        <div class="search-row search-row-btn-s">
          <el-button type="primary" @click="searchForm">查询</el-button>
        </div>
        <div class="search-row search-row-btn-fix">
          <el-button type="primary" @click="saveForm" style="width:70px">导出</el-button>
        </div>
      </div>

      <div ref="queryHeight" class="self-box2 self-box23-fix">
        <!-- <div v-for="(task,index) in taskList" :key="index" class="self-card-container" @click="showReportDetail(task.date)">
          <el-card class="self-box-card" :body-style="{ width: '100%' }">
            <div slot="default" class="self-card-body">
              <div class="self-cr-text">
                <span v-if="task.today">今天</span>
                <span v-else>{{ task.logDate }}</span>
              </div>
            </div>
          </el-card>
        </div> -->
        <!--           :header-cell-style="{background:'#eef1f6',color:'#606266'}" -->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :height="tableHeight"
          :span-method="objectSpanMethod"
          :fit="true"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
        >
          <el-table-column
            prop="deptName"
            label="部门"
            width="90px"
          />
          <el-table-column
            prop="workNumber"
            label="工号"
            width="90px"
          />
          <el-table-column
            prop="userName"
            label="姓名"
            width="90px"
          />
          <el-table-column
            prop="proName"
            label="项目"
            width="250px"
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
            width="100px"
          />
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { admindeptlist, dailyListAdmin } from '@/api/sDayReport'
export default {
  name: 'DayReport',
  data() {
    return {
      menubar: '',
      projectList: [],
      taskList: [],
      drawer: false,
      direction: 'rtl',
      currentDate: '2020-02-01',
      pageSize: 10,
      pageNum: 1,
      total: 0,
      form: {
        searchDate: '',
        searchProject: '',
        keyword: '',
        reportDate: '2020-01-01',
        workContent: '',
        planContent: '',
        job_number: '',
        job_staff: ''
      },
      tableData: [],
      tableHeight: 700,
      spanArr: []
    }
  },
  watch: {
    // 这里的定时器是为了优化，如果频繁调用window.onresize方法会造成页面卡顿，增加定时器会避免频繁调用window.onresize方法
    // timer默认值设置为false，这里相当于一个按钮，防止频繁改变时引起卡顿
    tableHeight(val) {
      if (!this.timer) {
        this.tableHeight = val
        this.timer = true
        const that = this
        setTimeout(function() {
          that.timer = false
        }, 400)
      }
    }
  },
  mounted() {
    this.form.searchDate = this.dateFormat(new Date())
    this.getList()
    this.getDep()
    const that = this
    window.onresize = () => {
      return (() => {
        window.tableHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        that.tableHeight = that.$refs.queryHeight.offsetHeight - 50
        if (that.tableHeight < 700) {
          that.tableHeight = 700
        }
      })()
    }
  },
  methods: {
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
    },
    saveForm() {
      this.handleDownload2()
    },
    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].deptId === data[i - 1].deptId) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
        console.log(this.spanArr)
      }
    },
    objectSpanMethod: function({ row, column, rowIndex, columnIndex }) {
      // || columnIndex === 1 || columnIndex === 2
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        console.log(`rowspan:${_row} colspan:${_col}`)
        return { // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    },
    async handleDownload2() {
      this.$message.success('导出成功')
              // this.downloadLoading = true
              import('@/vendor/Export2Excel').then(excel => {
                const filterVal = ['deptName', 'workNumber', 'userName', 'content', 'logTime']
                const tHeader = ['部门', '工号', '姓名', '日志内容', '日期']
                const data = this.formatJson(filterVal, this.tableData)
                excel.export_json_to_excel({
                  header: tHeader,
                  data,
                  filename: 'totalReport',
                  autoWidth: this.autoWidth,
                  bookType: this.bookType
                })
                // this.downloadLoading = false
              })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return this.toText(v[j])
      }))
    },
    toText(HTML) {
      const input = HTML
      if (input !== null && input !== undefined && input !== '') {
        return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ')
      } else {
        return ''
      }
    },
    searchForm() {
      this.getList()
    },
    showReport() {
      this.drawer = true
    },
    showReportDetail(date) {
      this.$router.push('/sDayReport/personList')
    },
    getDep() {
      admindeptlist({}).then((res) => {
        const { status, data } = res
        if (status === 200) {
          this.projectList = data
        }
      })
    },
    closeDrawer() {
      this.drawer = false
    },
    submitReport() {
      this.drawer = false
    },
    getList() {
      this.tableData = []
      this.spanArr = []
      dailyListAdmin({ pageSize: this.pageSize, pageNum: this.pageNum, logTimeStr: this.form.searchDate, deptId: this.form.searchProject, workNumberKeyWord: this.form.job_number, userNameKeyWord: this.form.job_staff }).then(res => {
        const { status, data, count } = res
        if (status === 200) {
          var s = data
          var list = []
          s.map((item) => {
            item.busDailyList.map((sitem) => {
              sitem.deptId = item.deptId
              sitem.deptName = item.deptName
              sitem.logTime = this.dateFormat(sitem.logTime)
              list.push(sitem)
            })
          })
          this.$nextTick(() => {
            this.tableData = list
            this.getSpanArr(this.tableData)
            this.total = count
          })
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
    /* display: flex; */
    display: inline-block;
    width:100%;
    flex-direction: column;
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
    /* margin-bottom: 20px; */
  }
  .self-box23-fix{
    flex: 1;
    width:100%\9;
    display: inline-block\9;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top:0;
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
    align-items: center;
    width:20%;
  }
  .search-row-btn-s{
    padding-left:20px;
    width:10%
  }
  .search-row-btn-fix{
    display: flex;
    display: inline-block\9;
    float:right\9;
    justify-content: flex-end;
    width:10%;
  }
  .search-row-btn-fix button{
    margin-left:calc(100% - 70px)
  }
  .search-text{
    font-size: 12px;
    text-align: right;
    margin-right: 10px;
    float:left\9;
    line-height: 28px \9;
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
  .search-row .el-input.el-date-editor, .search-row .el-input__inner.el-date-editor,.search-row .el-input{
    width:calc(100% - 50px);
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
  .search-row .el-select-f{
      width:calc(100% - 40px);
  }
  /* .search-row .el-select-f  .el-input{
    width:calc(100% - 80px);
  } */
  .search-row-dep .el-select,.search-row-dep .el-input{
     width:calc(100% - 40px) !important;
  }
</style>
