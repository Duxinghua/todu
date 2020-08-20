<template>
  <div class="self-container" style="padding-bottom: 60px">
    <div class="self-box">
      <div class="self-box2 self-box2-mobile">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div class="self-container-title">操作日志</div>
      </div>
      <!-- 查询项 -->
      <el-row style=" margin-top: 2px;">
        <el-col class="el-col-pc">
          <span style="font-size: 12px;">时间：</span>
          <el-date-picker
            v-model="queryDataTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间"
            size="mini"
          />
        </el-col>
        <el-col class="el-col-pc  el-col-pc1">
          <span style="font-size: 12px;">操作人：</span>
          <el-input
            v-model="queryUserName"
            placeholder="请输入用户名"
            clearable
            size="mini"
          />

          <el-button style="text-align: right" type="primary" icon="el-icon-search" size="mini" @click="searchOplog()">查询
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div style="margin-top: 20px;">
            <el-button type="info" @click="doExportData">导出</el-button>
            <!--            <el-tag style="cursor:pointer;" size="mini" type="info"  effect="dark" @click="doExportData()">导出</el-tag>-->
          </div>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <div class="self-box3">
        <el-table

          v-loading="loading"
          :data="oplogData"
          style="width: 100%; margin-top:20px;"
          tooltip-effect="dark"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <!-- <el-table-column
            prop="operator"
            label="操作人"
            width="100"
            align="center"
          /> -->
          <el-table-column
            label="操作时间"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.operateTime | fmtdate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="operateContent"
            label="操作事项"
            align="center"
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
          layout="total, sizes, prev, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { logList, logAdminList } from '@/api/oplog'
export default {
  data() {
    return {
      role: '',
      queryDataTime: '',
      queryUserName: '',
      // 项目数据列表
      oplogData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      multipleSelection: [],
      loading: false
    }
  },
  created() {
    this.role = this.$store.state.user.role
    this.getList()
  },
  methods: {
    // 查询操作日志
    searchOplog() {
      if (this.role === 1) {
        this.getAdminList()
      } else {
        this.getList()
      }
    },
    getList() {
      logList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryDataTime: this.queryDataTime,
        queryUserName: this.queryUserName
      }).then(res => {
        if (res.status === 200) {
          this.oplogData = res.data
          this.total = res.count
        }
      })
    },
    getAdminList() {
      logAdminList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryDataTime: this.queryDataTime,
        queryUserName: this.queryUserName
      }).then(res => {
        if (res.status === 200) {
          this.oplogData = res.data
          this.total = res.count
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'operateTime') {
          return this.dateFormat(v[j])
        } else {
          return this.toText(v[j])
        }
      }))
    },
    doExportData() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = ['operator', 'operateTime', 'operateContent']
        const tHeader = ['操作人员', '操作时间', '操作内容']
        const data = this.formatJson(filterVal, this.multipleSelection)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'oplog',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    toText(HTML) {
      const input = HTML
      if (input !== null && input !== undefined && input !== '') {
        return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ')
      } else {
        return ''
      }
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('multipleSelection', val)
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
    dateFormat: function(time) {
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

<style scoped lang="scss">
  .self-container{
    padding: 10px 10px 10px 0;
    display: flex;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
  }
  .self-box{

    display: flex;
    display: inline-block\9;
    flex-direction: column;
    flex: 1;
    width:100%;
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
  .self-container-title{
      font-size: 30px;
      padding-left: 30px;
      font-weight: bold
  }
  .el-col-pc{
      width:25%!important;
      display: flex;
      flex-direction: row;
      align-items: center;
  }
   .el-col-pc span{
     width: 80px;
   }
    @media only screen and (max-width: 768px){
    .self-container-title{
      font-size: 16px!important;
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
    .el-col-pc{
      width:100%!important;
      margin-bottom:10px;
      span{
        width:60px!important;
      }
      .el-input{
        width:calc(100% - 60px)!important;
      }
    }
    .el-col-pc1{
      .el-input{
        width:calc(100% - 132px)!important;
      }
    }

  }

</style>
<style>

</style>
