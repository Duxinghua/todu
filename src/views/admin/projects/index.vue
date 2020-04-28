<template>
  <div class="self-container">
    <div class="self-box self-box-fix1">
      <el-row style=" margin-top: 2px;">
        <el-col>
          <span style="font-size: 12px;">项目编码：</span>
          <el-input
            v-model="queryProjectNo"
            style="width:150px"
            placeholder="请输入内容"
            clearable
            size="mini"
          />
          <span style="font-size: 12px;margin-left: 2px;">项目名称：</span>
          <el-input
            v-model="queryProjectName"
            style="width:150px"
            placeholder="请输入内容"
            clearable
            size="mini"
          />
          <el-button type="primary" size="mini" icon="el-icon-search" @click="searchForm()">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="button-fix-wrap">
          <div v-if="batchEditDisabled" class="self-box3">
            <el-button type="info" :disabled="true">导出</el-button>
            <el-button type="info" :disabled="true">编辑</el-button>
          </div>
          <div v-else class="self-box3" style="flex: 1;flex-wrap: wrap;">
            <el-button style="cursor:pointer;" size="mini" type="primary" @click="doExportData()">导出</el-button>
            <el-button style="cursor:pointer;" size="mini" type="primary" @click="handleBatchEdit()">编辑</el-button>
          </div>
          <div class="button-fix">
            <!-- size="small" -->
            <el-dropdown split-button type="primary" style="padding-right: 10px" @command="downloadTemp">
              下载模板
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">项目</el-dropdown-item>
                <el-dropdown-item command="2">项目人员</el-dropdown-item>
                <el-dropdown-item command="4">项目总体组人员</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-upload
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-text="文件上传处理中"
              accept=".xlsx,.xls"
              class="upload-demo"
              :show-file-list="false"
              :on-change="uploadchange"
              :on-success="uploadSuccess"
              :action="uploadIp + '/excel/projectFile'"
            >
              <el-button type="primary" style=";margin-right:5px;">导入项目</el-button>
            </el-upload>
            <el-upload
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-text="文件上传处理中"
              accept=".xlsx,.xls"
              class="upload-demo"
              :show-file-list="false"
              :on-change="uploadchange"
              :on-success="uploadSuccess"
              :multiple="true"
              name="files"
              :action="uploadIp + '/excel/proPersons'"
            ><el-button type="primary" style=";margin-right:5px;">导入项目人员</el-button>
            </el-upload>
            <el-upload
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-text="文件上传处理中"
              accept=".xlsx,.xls"
              class="upload-demo"
              :show-file-list="false"
              :on-progress="uploading"
              :on-change="uploadchange"
              :on-success="uploadSuccess"
              :multiple="true"
              name="file"
              :action="uploadIp + '/excel/projectZtPersonsFile'"
            ><el-button type="primary" style=";margin-right:5px;">导入总体组人员</el-button>
            </el-upload>
            <el-button style="float: right;margin-right:5px;" type="primary" icon="el-icon-plus" @click="handleAdd()">新建项目</el-button>
          </div>

        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <div class="self-box3" style="flex:1;flex-basis: auto">
        <el-table
          v-loading="loading"
          :data="tableData"
          :height="tableHeight"
          :fit="true"
          class="userTable"
          tooltip-effect="dark"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="100"
            align="center"
          />
          <el-table-column
            prop="proCode"
            label="项目代码"
            width="120"
            align="center"
          />
          <el-table-column
            prop="proName"
            label="项目名称"
            width="200"
            align="center"
          />
          <el-table-column
            label="项目类别"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.proType===1">
                自揽
              </el-tag>
              <el-tag
                v-if="scope.row.proType===2"
                type="success"
              >
                院控
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="项目状态" width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.proStatus === 0">停止</span>
              <span v-else>进行中</span>
            </template>
          </el-table-column>
          <el-table-column label="项目参与人员" width="160" align="center">
            <template slot-scope="scope">
              <div style="color: #409EFF;cursor: pointer" @click.stop="toPersonDetail(scope.row.id,scope.row.proCode,scope.row.proName)">查看详情<i class="el-icon el-icon-arrow-right" /></div>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime | fmtdate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                style="font-size: 14px"
                @click="handleEdit(scope.row)"
              >编辑
              </el-link>
              <el-link
                type="primary"
                :underline="false"
                style="font-size: 14px"
                @click="handleDelete(scope.row)"
              >删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 表格分页组件 -->
      <el-pagination
        style="margin: 30px 0;"
        :current-page="pageNum"
        :page-sizes="[20, 50, 80, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 查询项 -->

    <!-- 新建项目对话框 -->
    <el-dialog
      ref="addDrawer"
      :visible.sync="addProjectFormVisible"
      direction="rtl"
      :show-close="false"
      :wrapper-closable="false"
      size="30%"
      class="self-drawer"
    >
      <div class="self-box3" style="padding: 0 20px;justify-content: space-between">
        <div slot="title" style="font-size: 20px">新建项目</div>
      </div>
      <el-form ref="addProjectForm" :model="projectForm" :rules="rules" label-position="right" label-width="80px">
        <el-form-item prop="proCode" label="项目编码" class="self-input-box">
          <el-input v-model="projectForm.proCode" placeholder="请输入项目编码" class="self-input" @blur="validateProjectCode" />

        </el-form-item>
        <el-form-item prop="proName" label="项目名称" class="self-input-box">
          <el-input v-model="projectForm.proName" placeholder="请输入项目名称" class="self-input" />

        </el-form-item>
        <el-form-item prop="proType" label="项目类型" class="self-input-box">
          <el-select v-model="projectForm.proType" placeholder="请选择项目类型" class="self-input">
            <el-option label="自揽" :value="1" />
            <el-option label="院控" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="proStatus" label="项目状态" class="self-input-box">
          <el-select v-model="projectForm.proStatus" placeholder="请选择项目状态" class="self-input">
            <el-option label="停止" :value="0" />
            <el-option label="进行中" :value="1" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item prop="text" label=" 人员配置" class="self-input-box" @click.stop="toPersonDetail(projectForm.id,projectForm.proCode,projectForm.proName)">-->
        <!--          <el-input value="前往配置" :readonly="true" class="self-input" style="font-size: 16px;cursor: pointer" @click.stop="toPersonDetail(projectForm.id,projectForm.proCode,projectForm.proName)">-->
        <!--            <i-->
        <!--              slot="suffix"-->
        <!--              class="el-icon-arrow-right el-input__icon"-->
        <!--              @click.stop="toPersonDetail(projectForm.id,projectForm.proCode,projectForm.proName)"-->
        <!--            />-->
        <!--          </el-input>-->

        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" style="text-align: left;margin-left: 25px;margin-top: 50px;">
        <el-button size="normal" @click="cancelForm">取 消</el-button>
        <el-button size="normal" type="primary" :loading="loading" @click="saveProject">{{ loading ? '提交中 ...' :
          '确 定' }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 编辑项目对话框 -->
    <el-dialog
      ref="editDrawer"
      :visible.sync="editProjectFormVisible"
      direction="rtl"
      :show-close="false"
      :wrapper-closable="false"
      size="30%"
      class="self-drawer"
    >
      <div class="self-box3" style="padding: 0 20px;justify-content: space-between">
        <div slot="title" style="font-size: 20px">编辑项目</div>
      </div>
      <el-form ref="editProjectForm" :model="projectForm" :rules="rules" label-position="right" label-width="80px">
        <el-form-item prop="proCode" class="self-input-box" label="项目编码">
          <el-input v-model="projectForm.proCode" :readonly="true" placeholder="请输入项目代码" class="self-input" />

        </el-form-item>
        <el-form-item prop="proName" class="self-input-box" label="项目名称">
          <el-input v-model="projectForm.proName" placeholder="请输入项目名称" class="self-input" />

        </el-form-item>
        <el-form-item prop="proType" class="self-input-box" label="项目类型">
          <el-select v-model="projectForm.proType" placeholder="请选择项目类型" class="self-input">
            <el-option label="自揽" :value="1" />
            <el-option label="院控" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="proStatus" class="self-input-box" label="项目状态">
          <el-select v-model="projectForm.proStatus" placeholder="请选择项目状态" class="self-input">
            <el-option label="停止" :value="0" />
            <el-option label="进行中" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="text" label=" 人员配置" class="self-input-box" @click.stop="toPersonDetail(projectForm.id,projectForm.proCode,projectForm.proName)">
          <el-input value="前往配置" :readonly="true" class="self-input" style="font-size: 16px;cursor: pointer" @click.stop="toPersonDetail(projectForm.id,projectForm.proCode,projectForm.proName)">
            <i
              slot="suffix"
              class="el-icon-arrow-right el-input__icon"
              @click.stop="toPersonDetail(projectForm.id,projectForm.proCode,projectForm.proName)"
            />
          </el-input>

        </el-form-item>
      </el-form>
      <div style="text-align: left;margin-left: 25px;margin-top: 50px;">
        <el-button size="normal" @click="cancelUpdateForm">取 消</el-button>
        <el-button size="normal" type="primary" :loading="loading" @click="updateProject">{{ loading ? '提交中 ...' :
          '确 定' }}
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { projectList, projectDelete, projectAdd, projectUpdate, personList, checkCode } from '@/api/project'
export default {
  name: 'ProjectList',
  data() {
    return {
      uploadIp: 'http://121.40.86.153:8999',
      // uploadIp: 'http://92game.xicp.net',
      // 项目数据列表
      tableData: [],
      proTypeObj: { 1: '自揽', 2: '院控' },
      proStatusObj: { 0: '停止', 1: '进行中' },
      rules: {
        proCode: [
          { required: true, message: '请输入项目编号', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
        ],
        proName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
        ],
        proType: [
          { required: true, message: '请输选择项目类型', trigger: 'blur' }
        ],
        proStatus: [
          { required: true, message: '请输选择项目状态', trigger: 'blur' }
        ],
        ztPersonId: [
          { required: true, message: '请输选择总体', trigger: 'blur' }
        ],
        fztPersonId: [
          { required: true, message: '请输选择副总体', trigger: 'blur' }
        ],
        zcPersonId: [
          { required: true, message: '请输选择专册', trigger: 'blur' }
        ],
        fzcPersonId: [
          { required: true, message: '请输选择副专册', trigger: 'blur' }
        ]
      },
      // 人员选择列表
      personList: [],
      pageSize: 20,
      pageNum: 1,
      total: 0,
      addProjectFormVisible: false,
      editProjectFormVisible: false,
      batchEditDisabled: true,
      projectForm: {
        proType: 1
      },
      queryProjectNo: '',
      queryProjectName: '',
      multipleSelection: [],
      loading: false,
      fullscreenLoading: false,
      tableHeight: 600
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
    const that = this
    window.onresize = () => {
      return (() => {
        window.tableHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        that.tableHeight = window.tableHeight - that.$refs.queryHeight.offsetHeight - 150
      })()
    }
  },
  created() {
    this.uploadIp = process.env.VUE_APP_BASE_API
    this.getList()
  },
  methods: {
    uploadchange() {
      this.fullscreenLoading = true
    },
    closeDrawer() {
      this.editProjectFormVisible = false
      this.addProjectFormVisible = false
    },
    getList() {
      projectList({
        queryProjectNo: this.queryProjectNo,
        queryProjectName: this.queryProjectName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.total = res.count
        }
      })
    },
    getPersonList() {
      personList().then(res => {
        if (res.status === 200) {
          this.personList = res.data
        }
      })
    },
    toPersonDetail(projectId, projectCode, projectName) {
      if (projectCode === '' || projectCode === undefined) {
        this.$message.warning('请输入项目编码')
        return false
      }
      if (projectName === '' || projectName === undefined) {
        this.$message.warning('请输入项目名称')
        return false
      }
      this.$router.push({ path: '/projects/personList', query: { projectId: projectId, projectCode: projectCode, projectName: projectName }})
    },
    // 打开新增抽屉
    handleAdd() {
      // 清空数据
      this.projectForm = {}
      this.addProjectFormVisible = true
    },
    searchForm() {
      this.pageSize = 10
      this.pageNum = 1
      this.getList()
    },
    uploading(res, file, fileList) {
      console.log(res, file, fileList)
    },
    uploadSuccess(response, file, fileList) {
      if (response.status === 500) {
        this.$nextTick(() => {
          this.fullscreenLoading = false
        })
        this.$notify({
          title: '提示信息',
          message: response.msg,
          dangerouslyUseHTMLString: true,
          duration: 0,
          customClass: 'self-notice',
          position: 'bottom-right'
        })
      } else {
        this.$nextTick(() => {
          this.fullscreenLoading = false
        })
        this.$notify({
          title: '提示信息',
          message: response.data,
          dangerouslyUseHTMLString: true,
          duration: 0,
          customClass: 'self-notice',
          position: 'bottom-right'
        })
        this.getList()
      }
    },
    // 导出模板
    downloadTemp(type) {
      console.log(type)
      window.open('http://121.40.86.153:8999/excel/download?templateType=' + type)
    },
    // 批量导入
    batchExport() {

    },
    // 执行新增
    doAdd() {

    },
    // 打开修改抽屉
    handleEdit(row) {
      this.projectForm = row
      this.editProjectFormVisible = true
    },
    saveProject() {
      this.$refs.addProjectForm.validate(valid => {
        if (valid) {
          projectAdd(this.projectForm).then(res => {
            if (res.status === 200) {
              this.$message.success('保存成功')
              this.closeDrawer()
              this.getList()
            }
          })
        }
      })
    },
    updateProject() {
      this.$refs.editProjectForm.validate(valid => {
        if (valid) {
          projectUpdate(this.projectForm).then(res => {
            if (res.status === 200) {
              this.$message.success('修改成功')
              this.closeDrawer()
              this.getList()
            }
          })
        }
      })
    },
    validateProjectCode() {
      if (this.projectForm.proCode) {
        checkCode({ proCode: this.projectForm.proCode }).then(res => {
          const { data, status } = res
          if (status === 200 && data) {
            this.$message.warning('该项目编号已被使用')
            this.projectForm.proCode = ''
          }
        })
      }
    },
    // 批量修改
    handleBatchEdit() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一个要编辑的项目!')
        return
      }
      localStorage.setItem('projectForms', JSON.stringify(this.multipleSelection))
      localStorage.setItem('personList', JSON.stringify(this.personList))
      // this.$router.push({
      //   path: '/projects/batchEdit',
      //   query: {
      //     projectForms: this.multipleSelection,
      //     personList: this.personList
      //   }
      // })
      this.$router.push({
        path: '/projects/batchEdit'
      })
    },
    // 执行修改
    doEdit() {

    },
    // 执行删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        projectDelete(row.id).then(res => {
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
    // 修改项目状态
    changeStatus(row) {

    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length > 0) {
        this.batchEditDisabled = false
      } else {
        this.batchEditDisabled = true
      }
    },
    // 取消并关闭抽屉
    cancelForm() {
      this.loading = false
      this.addProjectFormVisible = false
      clearTimeout(this.timer)
    },
    cancelUpdateForm() {
      this.loading = false
      this.editProjectFormVisible = false
      clearTimeout(this.timer)
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
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return this.dateFormat(v[j])
        } else {
          return this.toText(v[j])
        }
      }))
    },
    doExportData() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一个项目进行导出操作！')
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const exportData = []
        this.multipleSelection.forEach((item, index) => {
          const data = {
            proCode: item.proCode,
            proName: item.proName,
            proType: this.proTypeObj[item.proType],
            proStatus: this.proStatusObj[item.proStatus],
            ztPersonName: item.ztPersonName,
            fztPersonName: item.fztPersonName,
            zcPersonName: item.zcPersonName,
            fzcPersonName: item.fzcPersonName,
            createTime: item.createTime
          }
          exportData.push(data)
        })
        const filterVal = ['proCode', 'proName', 'proType', 'proStatus', 'ztPersonName', 'fztPersonName', 'zcPersonName', 'fzcPersonName', 'createTime']
        const tHeader = ['项目代码', '项目名称', '项目类型', '项目状态', '总体', '副总体', '专册', '副专册', '创建时间']
        const data = this.formatJson(filterVal, exportData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'project',
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
    }
  }

}
</script>

<style scoped>
  .self-box{
    padding: 20px;
    display: flex;
    display: inline-block\9;
    width:100%\9;
    flex-direction: column;
    flex: 1;
    background: white;
    position: relative;
    box-sizing: border-box;
  }
  .self-container{
    padding: 10px 10px 10px 0;
    display: flex;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
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
  .userTable {
    width: 98%;
    margin: 20px 0 0 20px;
  }
</style>
<style>
  .self-drawer .el-form-item{
    padding: 10px 20px;
    border: 1px solid #3333!important;
    display: flex;
    display: inline-block\9;
    align-items: center;
    border-radius: 0px!important;
    width:100%\9;
  }
  /*.self-drawer .el-form-item__label{*/
  /*  width: 80px;*/
  /*}*/
  .self-drawer .el-form-item__content{
    margin-left: 0!important;
    width:calc(100% - 80px)\9;
    float:left\9;
    flex: 1;
  }
  .self-drawer  .el-form-item{
    border:1px solid #EBEEF5;
  }
  .self-drawer .el-input__inner{
    border: none;
  }
  .self-drawer .el-form{

    padding: 20px ;box-sizing: border-box
  }
  .self-drawer .el-select,.el-cascader{
    width: 100%;
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
  .self-notice{
    left:50%;
    /* margin-left:-25%;
    margin-top:-25%; */
    width:660px;
    margin-left:-330px;
  }
  .self-notice .el-notification__group{
    width: 100%;
  }
  .self-notice .el-notification__group .el-notification__content{
    max-height: calc(100vh - 150px);
    width: 100%;
    overflow: auto;
  }
  .button-fix{
    display: flex;
    display: inline-block\9;
  }
  .button-fix >div,.button-fix>button{
    float:left\9;
  }
  .button-fix .el-dropdown .el-button-group .el-button{
    float:left
  }
  .button-fix-wrap{
    display: inline-block\9;
    width:100%\9;
    margin-top: 30px;
    display: flex;
    justify-content: space-between
  }
  .button-fix-wrap .self-box3{
    float:left\9;
  }
  .button-fix-wrap .button-fix{
    float:right\9;
  }
  .self-box-fix1 .el-button--mini,.self-box-fix1 .el-button--small{
    font-size:inherit;
  }
  .el-loading-mask{
    background-color:rgba(255,255,255,0.5)
  }
  .userTable .el-table__body-wrapper{
    /* height: 100%; */
    overflow-y: scroll;
  }

</style>
