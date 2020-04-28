<template>
  <div class="self-container" style="padding-bottom: 60px">
    <div class="self-box">
      <div class="self-box2">
        <div class="self-circle" style="opacity: 0.5;" />
        <div class="self-circle" style="left: 6px" />
        <div style="padding-left: 30px;font-weight: bold">项目参与人员</div>
      </div>
      <!-- 查询项 -->
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
          <div style="margin-top: 10px;margin-right: 30px">
            <el-button style="text-align: right" type="primary" size="mini" @click.stop="goBack">返回</el-button>
            <el-button style="text-align: right" type="primary" size="mini" @click.stop="commitUser">确定</el-button>
          </div>
        </el-col>
      </el-row>
      <div style="display: flex;width: 100%;flex: 1;padding-top: 20px;flex: 1">
        <div style="border: 1px solid #eeeeee;flex: 1">
          <!-- 数据表格 -->
          <div style="padding: 10px 0 0 10px">人员列表</div>
          <div style="flex: 1;overflow-y: auto;max-height: 580px">
            <el-table

              v-loading="loading"
              :data="personList"
              style="width: 100%; margin-top:20px;"
              tooltip-effect="dark"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              @selection-change="handleSelectionChange"
            >
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
                  <el-select v-model="scope.row.proRoleId" placeholder="请选择" @change="choicePerson(scope.row)">
                    <el-option
                      v-for="item in userTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
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
        <div style="width: 10px" />
        <div style="border: 1px solid #eeeeee;flex: 1">

          <div style="padding: 10px 0 0 10px">已选择的人员列表</div>
          <!-- 数据表格 -->
          <div style="overflow-y: auto;max-height: 580px; ">
            <el-table

              v-loading="loading"
              :data="checkPersonList"
              style="width: 100%; margin-top:20px;"
              tooltip-effect="dark"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              @selection-change="handleSelectionChange"
            >
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
                  <el-select v-model="scope.row.proRoleId" placeholder="请选择" @change="choicePerson(scope.row)">
                    <el-option
                      v-for="item in userTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="operate"
                label="操作"
                align="center"
              >
                <template slot-scope="scope">

                  <el-button type="danger" @click="deletePerson(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { projectOptionalUserList, addProjectUsers } from '@/api/project'
export default {
  data() {
    return {
      projectNo: '',
      projectName: '',
      // 选中的人员
      checkPersonMap: {},
      checkPersonList: [],
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
      userTypeObj: {
        1: '总体',
        2: '副总体',
        3: '专册',
        4: '副专册'
      },
      role: '',
      queryDataTime: '',
      userNameKeyWord: '',
      workNumberKeyWord: '',
      // 项目数据列表
      personList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      multipleSelection: [],
      loading: false,
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
      projectOptionalUserList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        workNumberKeyWord: this.workNumberKeyWord,
        userNameKeyWord: this.userNameKeyWord,
        projectId: this.projectId
      }).then(res => {
        if (res.status === 200) {
          this.personList = res.data
          this.total = res.count
        }
      })
    },
    choicePerson(row) {
      let saved = false
      let saveIndex = 0
      this.checkPersonList.forEach((obj, index) => {
        if (obj.userId === row.userId) {
          saved = true
          saveIndex = index
        }
      })
      if (saved) {
        this.checkPersonList[saveIndex] = row
      } else {
        this.checkPersonList.push(row)
      }
      this.checkPersonMap[row.userId] = row
    },
    commitUser() {
      if (this.checkPersonList.length === 0) {
        this.$message('请选择人员')
        return false
      }
      const submitPersonList = []
      this.checkPersonList.forEach((row, index) => {
        const submitPersonRow = {
          userId: row.userId,
          projectId: this.projectId,
          proRoleId: row.proRoleId,
          userName: row.userName
        }
        submitPersonList.push(submitPersonRow)
      })
      addProjectUsers(submitPersonList).then(res => {
        if (res.status === 200) {
          this.goBack()
        } else {
          this.$message.warning('添加失败')
        }
      })
    },
    goBack() {
      this.$router.push({ path: '/projects/personList', query: { projectId: this.projectId, projectCode: this.projectCode, projectName: this.projectName }})
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
    // 提交数据
    // submitUsers() {
    //   this.$router.push('/project/personList')
    // },
    // 删除人员
    deletePerson(index) {
      this.checkPersonList.splice(index, 1)
    },
    getUserType(row) {
      const personRow = this.checkPersonMap[row.userId]
      if (row.proRoleId != null) {
        return row.proRoleId
      } else if (personRow != null) {
        return personRow.proRoleId
      } else {
        return ''
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
            filename: 'person',
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
  .self-icon{
    font-weight: bold;font-size: 16px
  }
</style>
