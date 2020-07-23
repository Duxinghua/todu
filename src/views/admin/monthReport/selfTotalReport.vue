<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">自揽周报汇总</div>
      </div>
      <div class="self-box2 self-box2-fix" style="justify-content: space-between">
        <div class="search-row-fix">
          <div class="search-row">
            <div class="search-text" style="width:40px;text-align:left">时间</div>
            <el-date-picker
              v-model="searchWeekStr"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              @change="listChange"
            />
          </div>
          <!-- <div class="search-row search-row-type search-row-sel">
            <div class="search-text" style="width: 70px">项目类型</div>
            <el-select v-model="searchForm.proType" :clearable="true">
              <el-option key="1" value="1" label="自揽">自控</el-option>
              <el-option key="2" value="2" label="院控">院控</el-option>
            </el-select>
          </div> -->
          <div class="search-row search-row-type">
            <div class="search-text" style="width: 70px">项目编号</div>
            <el-input v-model="searchForm.proCodeKeyWord" :clearable="true" />
          </div>
          <div class="search-row search-row-type">
            <div class="search-text" style="width: 70px">项目名称</div>
            <el-input v-model="searchForm.proNameKeyWord" :clearable="true" />
          </div>
          <div class="search-row search-row-s">
            <el-button type="primary" @click="search">查询</el-button>
          </div>
        </div>
        <div class="search-button-fix">
          <el-button type="primary" @click="saveList">保存</el-button>
          <el-button type="primary" @click="handleDownload">导出</el-button>
        </div>
      </div>
      <!--style="flex:1;flex-basis: auto"  -->
      <div class="self-box3">
        <!--           height="calc(100vh - 200px)" -->
        <el-table
          :data="tableData"
          style="width: 100%"
          highlight-current-row
          :fit="true"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
        >
          <el-table-column
            prop="proName"
            label="项目名称"
          />
          <el-table-column
            prop="proCode"
            label="项目代码"
          />
          <el-table-column
            prop="proType"
            label="项目的问题"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.problem" />
            </template>
          </el-table-column>
          <el-table-column
            prop="toBeSolve"
            label="需要室所领导、处领导、总工解决的问题"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.toBeSolve" />
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="项目的进展情况"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.content" />
            </template>
          </el-table-column>
          <el-table-column
            prop="keyPoint"
            label="下周工作安排"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.keyPoint" />
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="startDate"
            label="起始日期"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ dateFormat2(scope.row.startDate) }}
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="endDate"
            label="结束日期"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ dateFormat2(scope.row.endDate) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="self-box3" />
    </div>

  </div>
</template>

<script>
import { weeklySummary, summaryListAdd } from '@/api/sMonthReport'
export default {
  name: 'TotalReport',
  data() {
    return {
      ids: '',
      tableData: [],
      searchForm: {
        proType: 1,
        proNameKeyWord: '',
        proCodeKeyWord: '',
        dateStr: ''
      },
      buttonDisabled: false,
      searchDate: '',
      nextWeekBtnEdit: true,
      searchWeekStr: ''
    }
  },
  mounted() {
    this.ids = this.$route.query.ids
    this.searchWeekStr = this.currentWeek()
    this.nextWeekBtnEdit = false
    // this.getList()
    // const week = new Date().getDay()
    // if (week !== 2 && week !== 3) {
    //   this.buttonDisabled = true
    // } else {
    //   this.buttonDisabled = false
    // }
  },
  methods: {
    search() {
      this.getList()
    },
    getList() {
      weeklySummary({ dateStr: this.searchWeekStr, proType: this.searchForm.proType, proNameKeyWord: this.searchForm.proNameKeyWord, proCodeKeyWord: this.searchForm.proCodeKeyWord }).then(res => {
        const { status, data } = res
        if (status === 200) {
          var s = data
          var list = []
          s.map((item) => {
            item.content = item.content.replace(/\。\<\/br\>/g, '<br/>')
            item.keyPoint = item.keyPoint.replace(/\。\<\/br\>/g, '<br/>')
            item.problem = item.problem.replace(/\。\<\/br\>/g, '<br/>')
            list.push(item)
          })
          this.tableData = list
        }
      })
    },
    listChange(e) {
      this.searchWeekStr = e
      this.getList()
    },
    async saveList() {
      // 校验数据
      let flag = true
      this.tableData.forEach((row, index) => {
        if (row.implementation === null || row.implementation === '' || row.implementation === undefined) {
          flag = false
        }
      })
      if (!flag) {
        this.$confirm('您还有上周调度会内容落实情况未填写, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          summaryListAdd(this.tableData).then(res => {
            if (res.status === 200) {
              this.$message.success('保存成功')
            }
          })
        }).catch(() => {

        })
      } else {
        summaryListAdd(this.tableData).then(res => {
          if (res.status === 200) {
            this.$message.success('保存成功')
          }
        })
      }
    },
    prevWeek() {
      const prevWeekTemp = this.addDate(this.searchWeekStr, -7)
      this.nextWeekBtnStatus(prevWeekTemp)
      this.searchWeekStr = prevWeekTemp
      this.getList()
    },
    // 当前周
    currentWeek() {
      const weekTemp = this.dateFormat2(new Date())
      this.nextWeekBtnStatus(weekTemp)
      this.searchWeekStr = weekTemp
      this.getList()
      return this.searchWeekStr
    },
    // 下一周
    nextWeek() {
      const weekTemp = this.addDate(this.searchWeekStr, 7)
      this.nextWeekBtnStatus(weekTemp)
      this.searchWeekStr = weekTemp
      this.getList()
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return this.toText(v[j])
      }))
    },
    async handleDownload() {
      // if (this.buttonDisabled) {
      //   this.$message.success('导出成功')
      //   this.downloadLoading = true
      //   import('@/vendor/Export2Excel').then(excel => {
      //     const filterVal = ['proCode', 'proName', 'implementation', 'problem', 'keyPoint', 'prevTotalContent', 'content']
      //     const tHeader = ['项目代码', '项目名称', '上周调度会内容落实情况', '调度会提纲内容', '工作重点提示', '上周调度会提纲内容', '工作情况']
      //     const data = this.formatJson(filterVal, this.tableData)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: 'totalReport',
      //       autoWidth: this.autoWidth,
      //       bookType: this.bookType
      //     })
      //     this.downloadLoading = false
      //   })
      // } else {
      //   this.handleDownload2()
      // }
      // this.handleDownload2()
      this.handleDownload3()
    },
    handleDownload3() {
      //  dateStr: this.searchWeekStr, proType: this.searchForm.proType, proNameKeyWord: this.searchForm.proNameKeyWord, proCodeKeyWord: this.searchForm.proCodeKeyWord
      window.open(process.env.VUE_APP_BASE_API + 'excel/downloadSummary?dateStr=' + this.searchWeekStr + '&proType=' + this.searchForm.proType) + '&proNameKeyWord=' + this.searchForm.proNameKeyWord + '&proCodeKeyWord=' + this.searchForm.proCodeKeyWord
    },
    async handleDownload2() {
      // 校验数据
      let flag = true
      this.tableData.forEach((row, index) => {
        if (row.implementation === null || row.implementation === '' || row.implementation === undefined) {
          flag = false
        }
      })
      if (!flag) {
        this.$confirm('您还有上周调度会内容落实情况未填写, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          summaryListAdd(this.tableData).then(res => {
            if (res.status === 200) {
              this.$message.success('导出成功')
              this.downloadLoading = true
              import('@/vendor/Export2Excel').then(excel => {
                const filterVal = ['proCode', 'proName', 'implementation', 'problem', 'keyPoint', 'prevTotalContent', 'content']
                const tHeader = ['项目代码', '项目名称', '上周调度会内容落实情况', '调度会提纲内容', '工作重点提示', '上周调度会提纲内容', '工作情况']
                const data = this.formatJson(filterVal, this.tableData)
                excel.export_json_to_excel({
                  header: tHeader,
                  data,
                  filename: 'totalReport',
                  autoWidth: this.autoWidth,
                  bookType: this.bookType
                })
                this.downloadLoading = false
              })
            }
          })
        }).catch(() => {

        })
      } else {
        summaryListAdd(this.tableData).then(res => {
          if (res.status === 200) {
            this.$message.success('导出成功')
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const filterVal = ['proCode', 'proName', 'implementation', 'problem', 'keyPoint', 'prevTotalContent', 'content']
              const tHeader = ['项目代码', '项目名称', '上周调度会内容落实情况', '调度会提纲内容', '工作重点提示', '上周调度会提纲内容', '工作情况']
              const data = this.formatJson(filterVal, this.tableData)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'totalReport',
                autoWidth: this.autoWidth,
                bookType: this.bookType
              })
              this.downloadLoading = false
            })
          }
        })
      }
    },
    toText(HTML) {
      const input = HTML
      if (input !== null && input !== undefined && input !== '') {
        return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ')
      } else {
        return ''
      }
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
    padding: 10px 0 ;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-bottom: 0px;
  }
  .self-box2-fix{
    display: flex;
    display: inline-block \9;
    width:100% \9;
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
  .search-row-fix{
    display: flex;
    width:85%;
    display: inline-block\9;
  }
  .search-row-s{
    padding-left:20px;
    box-sizing: border-box;
    width:15%!important;
  }
  .search-button-fix{
    width:15%;
    float:right \9;
    display: flex;
    justify-content: flex-end;
  }
  .search-row{
    display: flex;
    display: inline-block\9;
    vertical-align: middle;
    width:20%;
    align-items: center;
  }
  .search-row-sel{
    width:20%;
  }
  .el-input__inner{
    width:80%;
  }
  .search-text{
    font-size: 12px;
    text-align: right;
    margin-right: 10px;
    float:left\9;
    line-height: 28px\9;
  }
</style>
<style>
  .self-input .el-textarea__inner{
    flex: 1;
    border: none;
    border-radius: 0;
  }
  .self-drawer .el-drawer__header{
    margin-bottom: 0px;
  }
  .search-row-type{
    width:20%;
    /* width:280px\9; */
    /* vertical-align:middle; */
  }
  .search-row-type .el-input__inner{
    width:100%\9;
  }
  .search-row .el-input{
    float:left\9;
    width:calc(100% - 80px);
  }
  .search-row .el-select{
    float:left\9;
    width:calc(100% - 80px);
  }
  .search-button-fix button{
    float:left;
  }
  .search-button-fix button:last-child{
    float:right;
  }
</style>
