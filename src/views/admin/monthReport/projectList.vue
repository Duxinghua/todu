<template>

  <div class="self-container">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">配施日志</div>
      </div>
      <div class="self-box3">
        <div class="search-row">
          <div class="search-text">时间</div>
          <el-date-picker
            v-model="form.searchDate"
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
        <!--        <div class="search-row">-->
        <!--          <div class="search-text" style="width: 60px">关键词</div>-->
        <!--          <el-input v-model="form.keyword" placeholder="请输入关键词" />-->
        <!--        </div>-->
        <div class="search-row">
          <el-button type="primary" @click="searchForm">查询</el-button>
        </div>
      </div>

      <div v-if="exportDisabled" class="self-box3">
        <el-button type="info" :disabled="exportDisabled">导出</el-button>
        <el-button type="info" :disabled="exportDisabled">删除</el-button>
      </div>
      <div v-else class="self-box3" style="flex: 1;flex-wrap: wrap;">
        <el-button type="primary" :disabled="exportDisabled">导出</el-button>
        <el-button type="primary" :disabled="exportDisabled" @click="deleteAllRow">删除</el-button>
      </div>
      <div class="self-box3" style="flex: 1;flex-wrap: wrap;">
        <el-table
          ref="personTable"
          :data="tableData"
          style="width: 100%"
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            header-align="center"
            align="center"
            type="selection"
            width="55"
          />
          <el-table-column
            fixed
            prop="userName"
            label="姓名"
            align="center"
            header-align="center"
          />
          <el-table-column
            fixed
            prop="workNumber"
            label="工号"
          />
          <el-table-column
            fixed
            prop="userMajor"
            label="专业"

            align="center"
            header-align="center"
          />
          <el-table-column
            fixed
            prop="role"
            label="角色"

            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ formatterRoleName(scope.row.projectRoleId) }}
            </template>

          </el-table-column>
          <el-table-column
            fixed
            prop="workPlace"
            label="地点"

            align="center"
            header-align="center"
          />
          <el-table-column
            fixed
            prop="proName"
            label="项目名称"

            align="center"
            header-align="center"
          />
          <el-table-column
            fixed
            prop="content"
            label="工作内容"

            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.content" />
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="plan"
            label="下步计划"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.plan" />
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="logTime"
            label="日期"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ dateFormat(scope.row.logTime) }}
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="date"
            label="编辑"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showReport(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      size="45%"
      :show-close="false"
      :wrapper-closable="false"
      custom-class="self-drawer"
    >
      <div slot="title">
        <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;padding: 0 20px">
          <div style="font-size: 18px;color: #000000">配施日志详情 </div>
        </div>
      </div>
      <div slot="default" style="padding: 0 30px">
        <div style="position: absolute;left: 5px;top: 50%;width: 50px;height: 50px;cursor: pointer" @click="closeDrawer">
          <el-icon class="el-icon-arrow-left" style="font-weight: bold" />
        </div>
        <div>
          <div>
            <el-row :gutter="20" style="display: flex;margin-bottom: 20px">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">项目名称</div>
                <!--                <el-input v-model="form.projectName" :readonly="readonly" size="small" class="self-input" />-->
                <el-select v-model="dailyForm.projectId" :disabled="readonly" placeholder="请选择项目" size="small" class="self-input">
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
                <el-input v-model="dailyForm.projectRole" :readonly="readonly" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row :gutter="20" style="display: flex">
              <el-col :span="12" class="self-input-box" style="margin-right: 10px">
                <div class="self-title">时间（天）</div>
                <el-input v-model="dailyForm.logTime" :readonly="readonly" size="small" class="self-input" />
              </el-col>
              <el-col :span="12" class="self-input-box" style="margin-left: 10px">
                <div class="self-title">工作地点</div>
                <el-input v-model="dailyForm.workPlace" :readonly="readonly" size="small" class="self-input" />
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>工作情况</h3>
              <div style="width: 100%;">
                <div class="self-content" v-html="dailyForm.content" />
              </div>
            </el-row>
            <el-row style="margin-top: 10px">
              <h3>下步计划</h3>
              <div style="width: 100%;">
                <div class="self-content" v-html="dailyForm.plan" />
              </div>
            </el-row>
          </div>
        </div>
      </div>

    </el-drawer>

  </div>

</template>

<script>
import { dailyPersonList, dailyDelete, dailyBatchDelete } from '@/api/sDayReport'
import { reportView, projectList } from '@/api/dayReportList'
export default {
  name: 'DayPersonList',
  data() {
    return {
      roleObj: {
        1: '总体',
        2: '副总体',
        3: '专册',
        4: '副专册'
      },
      deleteId: '',
      tableData: [],
      menubar: '',
      projectList: [],
      drawer: false,
      direction: 'rtl',
      currentPage: 1,
      pageTotal: 0,
      pageSize: 20,
      readonly: true,
      exportDisabled: true,
      dialogVisible: false,
      selectData: [],
      form: {
        searchDate: '',
        searchProjectId: ''

      },
      dailyForm: {}
    }
  },
  mounted() {
    this.getList()
    this.getProjectList()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    searchForm() {
      this.getList()
    },
    closeDrawer() {
      this.drawer = false
    },
    showReport(row) {
      reportView({ id: row.id }).then(res => {
        const { status, data } = res
        if (status === 200) {
          data.logTime = this.dateFormat(data.logTime)
          data.projectRole = this.roleObj[data.projectRoleId]
          this.dailyForm = data
        }
      })
      this.drawer = true
    },
    // 单行删除
    deleteRow(id) {
      this.$confirm('是否确认删除数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dailyDelete(id).then(res => {
          const { status, msg } = res
          if (status === 200) {
            this.getList()
            this.$message.success('删除成功')
          } else {
            this.$message.warning(msg)
          }
          this.dialogVisible = false
        })
      }).catch(() => {

      })
    },
    deleteAllRow() {
      this.$confirm('是否确认删除数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = ''
        this.selectData.forEach((item, index) => {
          ids += item.id + ','
        })
        ids = ids.substr(0, ids.length - 1)
        dailyBatchDelete(ids).then(res => {
          const { status, msg } = res
          if (status === 200) {
            this.getList()
            this.$message.success('删除成功')
          } else {
            this.$message.warning(msg)
          }
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(rows) {
      this.selectData = rows
      if (rows.length === 0) {
        this.exportDisabled = true
      } else {
        this.exportDisabled = false
      }
    },
    getProjectList() {
      projectList().then(res => {
        if (res.status === 200) {
          this.projectList = res.data
        }
      })
    },
    getList() {
      dailyPersonList({ pageSize: this.pageSize, pageNum: this.currentPage, logTimeStr: this.form.searchDate, projectId: this.form.searchProjectId }).then(res => {
        const { status, data, count } = res
        if (status === 200) {
          this.tableData = data
          this.pageTotal = count
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
      month = month > 9 ? month : '0' + month
      const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      // 拼接
      return year + '-' + month + '-' + day
    },
    formatterRoleName(roleId) {
      return this.roleObj[roleId]
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
  .self-content{
    height: 150px;
    padding: 20px;
    border: 1px solid #3333;
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
