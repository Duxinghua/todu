<template>
  <div class="self-container" style="padding-bottom: 60px">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">配置项目人员</div>
      </div>
      <!-- 查询项 -->
      <el-row style=" margin-top: 2px;margin-bottom: 10px">
        <el-col>
          <div style="display:flex;">
            <div style="color: #409EFF">项目名称：{{ projectName }}</div>
            <div style="color: #409EFF;padding-left: 20px">项目编码：{{ projectCode }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style=" margin-top: 2px;">
        <el-col style="display: flex;justify-content: space-between">
          <div>
            <span style="font-size: 12px;">姓名：</span>
            <el-input
              v-model="userNameKeyWord"
              style="width:150px"
              placeholder="请输入姓名"
              clearable
              size="mini"
            />
            <span style="font-size: 12px;">工号：</span>
            <el-input
              v-model="workNumberKeyWord"
              style="width:150px"
              placeholder="请输入工号"
              clearable
              size="mini"
            />

            <el-button style="text-align: right" type="primary" icon="el-icon-search" size="mini" @click="searchList()">查询</el-button>
          </div>

        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="person-button-fix p-b-f-x">
            <div v-if="batchEdit" class="self-box3">
              <el-button type="info" :disabled="true">导出</el-button>
              <el-button type="info" :disabled="true">删除</el-button>
            </div>
            <div v-else class="self-box3" style="flex: 1;flex-wrap: wrap;">
              <el-button type="primary" @click="doExportData">导出</el-button>
              <el-button type="primary" @click="batchDelete">删除</el-button>
            </div>
            <div class="el-button-self">
              <el-button style="text-align: right" type="primary" size="mini" @click="goBack()">返回</el-button>
              <el-button style="text-align: right" type="primary" size="mini" @click="addPersonList()">添加人员</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <div style="flex: 1;overflow-y: auto;max-height: 580px">
        <el-table
          v-loading="loading"
          :data="personListData"
          style="width: 100%; margin-top:20px;"
          tooltip-effect="dark"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            header-align="center"
            align="center"
            type="selection"
            width="55"
          />
          <el-table-column
            prop="workNumber"
            label="工号"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="姓名"
            align="center"
          />
          <el-table-column
            prop="deptName"
            label="室所"
            align="center"
          />
          <el-table-column
            prop="userMajor"
            label="专业"
            align="center"
          />
          <el-table-column
            prop="proRoleId"
            label="人员类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ userTypeObj[scope.row.proRole] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">

              <el-button type="primary" @click="updatePerson(scope.row)">编辑</el-button>
              <el-button type="danger" @click="deletePerson(scope.row)">删除</el-button>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      ref="editDrawer"
      :visible.sync="formVisible"
      direction="rtl"
      :show-close="false"
      :wrapper-closable="false"
      width="30%"
      class="self-drawer"
    >
      <div slot="title" style="font-size: 20px">编辑人员信息</div>
      <el-form ref="form" :model="form" style="padding:0  20px" label-width="90px">
        <el-form-item prop="title" label="姓名" class="self-input-box">
          <el-input v-model="form.userName" :readonly="true" :minlength="1" prop="title" :maxlength="30" class="self-input" />
        </el-form-item>
        <el-form-item prop="content" label="工号" class="self-input-box">
          <el-input v-model="form.workNumber" :readonly="true" :minlength="1" prop="content" :maxlength="300" class="self-input" />
        </el-form-item>
        <el-form-item prop="content" label="室所" class="self-input-box">
          <el-input v-model="form.deptName" :readonly="true" :minlength="1" prop="content" :maxlength="300" class="self-input" />
        </el-form-item>
        <el-form-item prop="content" label="人员类型" class="self-input-box">
          <el-select v-model="form.proRole" placeholder="请选择" class="self-input">
            <el-option
              v-for="item in userTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="content" label="专业" class="self-input-box">
          <el-input v-model="form.userMajor" :readonly="true" :minlength="1" prop="content" :maxlength="300" class="self-input" />
        </el-form-item>

      </el-form>
      <div slot="footer" style="text-align: left;margin-left: 25px">
        <el-button size="normal" @click="cancelForm">取 消</el-button>
        <el-button size="normal" type="primary" :loading="loading" @click="submitData">{{ loading ? '提交中 ...' :
          '确 定' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { projectUserList, updateProjectUser, deleteProjectUser } from '@/api/project'
export default {
  data() {
    return {
      formVisible: false,
      form: {},
      userTypeObj: {
        1: '总体',
        2: '副总体',
        3: '专册',
        4: '副专册'
      },
      userTypeList: [
        {
          value: 1,
          label: '总体'
        },
        {
          value: 2,
          label: '副总体'
        },
        {
          value: 3,
          label: '专册'
        },
        {
          value: 4,
          label: '副专册'
        }
      ],
      role: '',
      batchEdit: true,
      queryDataTime: '',
      userNameKeyWord: '',
      workNumberKeyWord: '',
      // 项目数据列表
      personListData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      multipleSelection: [],
      loading: false,
      projectName: '',
      projectCode: '',
      projectId: ''
    }
  },
  created() {
    this.role = this.$store.state.user.role
    const query = this.$route.query
    this.projectId = query.projectId
    this.projectCode = query.projectCode
    this.projectName = query.projectName
    this.getList()
  },
  methods: {
    // 查询操作日志
    searchList() {
      this.getList()
    },
    getList() {
      console.log(this.projectId)
      projectUserList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        workNumberKeyWord: this.workNumberKeyWord,
        userNameKeyWord: this.userNameKeyWord,
        projectId: this.projectId
      }).then(res => {
        if (res.status === 200) {
          this.personListData = res.data
          this.total = res.count
        }
      })
    },
    updatePerson(row) {
      this.form = row
      this.formVisible = true
    },
    submitData() {
      this.form.proRoleId = this.form.proRole
      updateProjectUser(this.form).then(res => {
        if (res.status === 200) {
          this.getList()
          this.formVisible = false
        } else {
          this.$message.warning('更新失败')
        }
      })
    },
    cancelForm() {
      this.formVisible = false
    },
    deletePerson(row) {
      this.$confirm('此操作将永久删除项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const userIds = [{ projectId: row.projectId, userId: row.userId }]
        deleteProjectUser(userIds).then(res => {
          const { msg, status } = res
          if (status === 200) {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.warning(msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    batchDelete() {
      this.$confirm('此操作将永久删除项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const userIds = []
        this.multipleSelection.forEach((item) => {
          userIds.push({
            projectId: item.projectId,
            userId: item.userId
          })
        })
        deleteProjectUser(userIds).then(res => {
          const { msg, status } = res
          if (status === 200) {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.warning(msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
    // 选择人员
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length > 0) {
        this.batchEdit = false
      } else {
        this.batchEdit = true
      }
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
            filename: this.filename,
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
    goBack() {
      this.$router.push('/projects/index')
    },
    // 前往 添加人员的页面
    addPersonList() {
      this.$router.push({ path: '/projects/selectPersonList', query: { projectId: this.projectId, projectCode: this.projectCode, projectName: this.projectName }})
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
      const min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      const sec = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
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
    border: 1px solid #C0C4CC;
  }
  .self-title{
    width: 90px;
    text-align: center;
    font-size: 14px;
  }
  .self-input{
    flex: 1;
    width:100%;
  }
  .p-b-f-x{
    display:flex;
    display: inline-block;
    width:100%;
    justify-content:space-between;
    margin-top:20px;
  }
  .self-box3{
    width:30%;
    float: left;
  }
  .el-button-self{
    /* width:152px; */
    float:right;
  }
</style>
<style>
  .self-drawer .el-dialog__body{
    padding:10px 20px;
  }
  .self-drawer .el-dialog__footer{
    padding-top:0px;
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
  .self-input-box .el-form-item__content{
    width:calc(100% - 90px)
  }
  .person-button-fix{
    display: inline-block \9;
    width:100%\9;
  }
  .person-button-fix > div{
    float:left\9;
  }
  .person-button-fix div:last-child{
    float:right;
  }
</style>
