<template>
  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">自揽周报汇总</div>
      </div>
      <div class="self-box2" style="font-size:14px;color:red;">
        <p>提示:1.院控项目周报请在生产经营管理系统填报，这里只填自揽项目周报。</p>
        <p>2.周四为起始日期。</p>
      </div>
      <div class="self-box2 self-box2-fix" style="justify-content: space-between">
        <div class="search-row-fix">
          <div class="search-row" style="margin-right:20px">
            <el-button
              type="primary"
              @click="prevWeek"
            >前一周</el-button>
          </div>
          <div class="search-row">
            <div class="search-text" style="width:80px;text-align:left">起始时间</div>
            <el-date-picker
              v-model="searchForm.startDateStr"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              @change="listChange"
            />
          </div>
          <div class="search-row" style="margin-right:20px">
            <el-button
              type="primary"
              @click="nextWeek"
            >后一周</el-button>
          </div>
          <div class="search-row search-row-type">
            <div class="search-text" style="width: 130px">项目名称或编码</div>
            <el-input v-model="searchForm.proText" :clearable="true"   @clear="proClear"/>
          </div>
                    <div class="search-row search-row-type">
            <div class="search-text" style="width: 100px">姓名或工号</div>
            <el-input v-model="searchForm.userText" :clearable="true" @clear="userClear" />
          </div>
          <div class="search-row search-row-s">
            <el-button type="primary" @click="search">查询</el-button>
          </div>
        </div>
        <div class="search-button-fix">
          <el-button type="primary" @click="saveList" style="display:none">保存</el-button>
          <el-button type="primary" @click="handleDownload">导出</el-button>
        </div>
      </div>
      <!--style="flex:1;flex-basis: auto"  -->
      <div class="self-box3">
        <!--           height="calc(100vh - 200px)" -->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          highlight-current-row
          :fit="true"
          :span-method="objectSpanMethod"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
        >
          <el-table-column
            prop="proName"
            label="项目名称"
          />
          <el-table-column
            prop="proCode"
            label="项目代码"
            width="90px"
          />
          <el-table-column
            prop="proTypeText"
            label="项目类型"
            width="90px"
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
            prop="startDate"
            label="起始日期"
            width="90px"
          />
          <el-table-column
            prop="endDate"
            label="结束日期"
            width="90px"
          />
          <el-table-column
            prop="userName"
            label="填报人"
            width="80px"
          />

        </el-table>
      </div>
      <div class="self-box3" />
    </div>

  </div>
</template>

<script>
import { weeklySummary, summaryListAdd, weeklyProjectListAdmin } from '@/api/sMonthReport'
export default {
  name: 'TotalReport',
  data() {
    return {
      ids: '',
      tableData: [],
      searchForm: {
        proType: 1,
        proCodeKeyWord: '',
        proNameKeyWord: '',
        proText:'',
        startDateStr: '',
        userNameKeyWord: '',
        workNumberKeyWord: '',
        userText:''
      },
      buttonDisabled: false,
      searchDate: '',
      nextWeekBtnEdit: true,
      searchWeekStr: '',
      spanArr: []
    }
  },
  mounted() {
      this.searchForm.startDateStr = this.dateFormat2(new Date().getTime() - (new Date().getDay()+3)*24*60*60*1000)
      this.getList()
  },
  methods: {
    userClear(){
      this.searchForm.userText = ''
      this.searchForm.userNameKeyWord = ''
      this.searchForm.workNumberKeyWord = ''
    },
    proClear(){
      this.searchForm.proNameKeyWord = ''
      this.searchForm.proCodeKeyWord = ''
      this.searchForm.proText = ''
    },
    getSpanArr(data) {
      console.log(data,'data')
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].proCode === data[i - 1].proCode) {
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
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        console.log(`rowspan:${_row} colspan:${_col}`)
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    },
    search() {
      if(!this.searchForm.startDateStr){
        this.$message.error('必须输入时间')
        return
      }
      if(this.searchForm.proText){
        if(escape(this.searchForm.proText).indexOf( "%u" ) > -1){
          this.searchForm.proNameKeyWord = this.searchForm.proText
          this.searchForm.proCodeKeyWord = ''
        }else{
          this.searchForm.proCodeKeyWord = this.searchForm.proText
          this.searchForm.proNameKeyWord = ''
        }
      }
      if(this.searchForm.userText){
        if(isNaN(this.searchForm.userText)){
          this.searchForm.userNameKeyWord = this.searchForm.userText
          this.searchForm.workNumberKeyWord = ''
        }else{
          this.searchForm.workNumberKeyWord = this.searchForm.userText
          this.searchForm.userNameKeyWord = ''
        }
      }
      this.getList()
    },
    getList() {
      this.spanArr = []
      this.tableData = []
      weeklyProjectListAdmin(this.searchForm).then(res => {
        const { status, data } = res
        if (status === 200) {
          var result = data
          result.map((item) => {

            item.proTypeText = '自揽项目'
            item.startDate = this.dateFormat2(item.startDate)
            item.endDate = this.dateFormat2(item.endDate)
          })
          this.$nextTick(()=>{
            this.tableData = result
            this.getSpanArr(this.tableData)
            this.$forceUpdate()
          })


        }
      })
    },
    listChange(e) {
      // this.searchWeekStr = e
      // this.getList()
      if(new Date(e).getDay != 4){
        this.$message.error('时间必须为周四')
        this.searchForm.startDateStr = ''
        return
      }else{
        this.searchForm.startDateStr = e
      }
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
    //上一周
    prevWeek() {
      if(!this.searchForm.startDateStr){
        this.searchForm.startDateStr = this.dateFormat2(new Date().getTime() - (new Date().getDay()+3)*24*60*60*1000)
      }else{
        this.searchForm.startDateStr = this.dateFormat2(new Date(this.searchForm.startDateStr).getTime() - 7*24*60*60*1000)
      }
      this.getList()
    },
    // 下一周
    nextWeek() {
      if(!this.searchForm.startDateStr){
        this.$message.error('请输入起始时间')
        return
      }else{
        var news = new Date().getTime() + 3*24*60*60*1000
        if(new Date(this.searchForm.startDateStr).getTime() > news) {
          this.$message.error('起始时间不能超过本周范围')
          return
        }else{
          this.searchForm.startDateStr = this.dateFormat2(new Date(this.searchForm.startDateStr).getTime() + 7*24*60*60*1000)
          this.getList()
        }
      }

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
      this.handleDownload2()
      //this.handleDownload3()
    },
    handleDownload3() {
      //  dateStr: this.searchWeekStr, proType: this.searchForm.proType, proNameKeyWord: this.searchForm.proNameKeyWord, proCodeKeyWord: this.searchForm.proCodeKeyWord
      window.open(process.env.VUE_APP_BASE_API + 'excel/downloadSummary?dateStr=' + this.searchWeekStr + '&proType=' + this.searchForm.proType) + '&proNameKeyWord=' + this.searchForm.proNameKeyWord + '&proCodeKeyWord=' + this.searchForm.proCodeKeyWord
    },
    async handleDownload2() {
      this.$message.success('导出成功')
      // this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = [
          'proName',
          'proCode',
          'proTypeText',
          'problem',
          'toBeSolve',
          'content',
          'keyPoint',
          'startDate',
          'endDate',
          'userName'
        ]
        const tHeader = ['项目名称', '项目代码','项目类型','项目的问题', '需要室所领导、昝领导、总工解决的问题', '项目的进展情况', '下周工作安排', '起始日期','结束日期','填报人']
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Report',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        // this.downloadLoading = false
      })
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
    /* width:20%; */
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
