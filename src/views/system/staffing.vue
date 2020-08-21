<template>
  <div class="self-container">
    <div class="self-box">
      <el-row :gutter="20" class="grid-content">
        <!--        <el-col :span="5" style="height: 100%;padding: 20px 10px;border-right: 1px solid aliceblue;;">-->

        <!--          <div class="header-title">-->
        <!--            &lt;!&ndash;          <img class="header-img" src="../../assets/logo.png" alt="无法显示图片">&ndash;&gt;-->
        <!--            <div style="display: flex;justify-content: center">-->
        <!--              <div style="padding-right: 5px;"><el-icon class="el-icon-s-grid self-font-color" /></div>-->
        <!--              <div-->
        <!--                style="font-size: 14px"-->
        <!--              >武汉企秀网络科技有限公司</div>-->
        <!--            </div>-->

        <!--            <el-tree-->
        <!--              style="margin-top: 20px"-->
        <!--              :data="deptTree"-->
        <!--              :props="defaultProps"-->
        <!--              :expand-on-click-node="false"-->
        <!--              node-key="id"-->
        <!--              default-expand-all-->
        <!--              @node-click="handleNodeClick"-->
        <!--            >-->
        <!--              <span slot-scope="{ node }" class="custom-tree-node">-->
        <!--                <span>-->
        <!--                  <i class="el-icon-folder-opened" />{{ node.label }}-->
        <!--                </span>-->
        <!--              </span>-->
        <!--            </el-tree>-->
        <!--          </div>-->

        <!--        </el-col>-->
        <el-col :span="24" style="height: 100%;padding: 20px 10px">
          <!-- display: flex;flex-direction: column;height: 100% -->
          <div class="el-row-fixw">
            <el-row>
              <el-col>
                <div class="header-title">
                  <span style="font-size: 24px;margin-left: 30px;margin-top: 20px;">配施人员管理</span>
                </div>
              </el-col>
            </el-row>
            <el-row class="self-box2 self-box2-fix2">
              <div class="search-row">
                <div class="search-text" style="width:40px">室所</div>
                <el-select v-model="searchDeptId" placeholder="请选择项目" :clearable="true" @clear="clearDept">
                  <el-option label="请选择室所" :value="0" disabled />
                  <el-option
                    v-for="(item,key) in deptList"
                    :key="key"
                    :label="item.deptName"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <div class="search-row">
                <div class="search-text" style="width: 140px">工号或姓名</div>
                <el-input v-model="workNumberKeyWord" :clearable="true" />
              </div>
              <!-- <div class="search-row">
                <div class="search-text" style="width: 40px">姓名</div>
                <el-input v-model="userNameKeyWord" :clearable="true" />
              </div> -->
              <div class="search-row">
                <el-button type="primary" @click="searchForm">查询</el-button>
              </div>
              <el-col :span="12">
                <div style="margin-top: 10px;margin-left: 20px">
                  <div v-if="batchEdit" class="self-box3">
                    <!-- <el-button type="info" :disabled="true">导出</el-button>
                    <el-button type="info" :disabled="true">删除</el-button> -->
                    <!--                    <el-button style="cursor:pointer;" size="mini" type="primary" @click="handleAddDept()">新增部门</el-button>-->
                  </div>
                  <div v-else class="self-box3" style="flex: 1;flex-wrap: wrap;">
                    <el-button type="primary" @click="doExportData">导出</el-button>
                    <el-button type="primary" @click="handleBacthDel">删除</el-button>
                    <!--                    <el-button style="cursor:pointer;" size="mini" type="primary" @click="handleAddDept()">新增部门</el-button>-->
                  </div>

                </div>
              </el-col>
              <el-col :span="12" class="el-col-wrap">
                <div class="el-button-fix">
                <el-button style="cursor:pointer;margin-right:5px;" size="mini" type="primary" @click="addPersonView()">添加配施人员</el-button>
                  <el-button style="cursor:pointer;margin-right:5px;" size="mini" type="primary" @click="downloadTemp()">下载导入模板</el-button>
                  <el-upload
                    v-loading.fullscreen.lock="fullscreenLoading"
                    element-loading-text="文件上传处理中"
                    accept=".xlsx,.xls"
                    class="upload-demo"
                    size="mini"
                    :show-file-list="false"
                    :on-change="onprogress"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :action="uploadIp+ '/excel/psPersonFile'"
                  >
                    <el-button size="mini" type="primary" style=";margin-right:5px;">批量导入</el-button>
                  </el-upload>
                  <!--            <el-button style="cursor:pointer;" size="mini" type="primary" @click="batchExport()">批量导入</el-button>-->
                  <el-button style="float: right;display:none" type="primary" size="mini" icon="el-icon-plus" @click="handleAdd()">添加成员</el-button>
                </div>
                <!--                <div style="margin-top: 10px;margin-right: 30px">-->
                <!--                  <el-button style="float:right;" type="primary" size="mini" icon="el-icon-plus" @click="handleAdd()">添加成员</el-button>-->
                <!--                </div>-->

              </el-col>
            </el-row>
            <!-- 数据表格 -->
            <div ref="queryHeight" class="self-box3" style="position:relative" :style="{height:tableHeight+'px'}">
              <el-table
                v-loading="loading"
                class="userTable"
                :data="tableData"
                :height="tableHeight"
                style="position:absolute;top:0"
                :fit="true"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              >
                <!--    @selection-change="handleSelectionChange" -->
                <el-table-column
                  header-align="center"
                  align="center"
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
                <!--                <el-table-column-->
                <!--                  prop="userPosition"-->
                <!--                  label="岗位"-->
                <!--                  align="center"-->
                <!--                />-->
                <!-- <el-table-column
                  prop="userMajor"
                  label="专业"
                  align="center"
                /> -->
                <!--                <el-table-column-->
                <!--                  prop="contactInfo"-->
                <!--                  label="手机号码"-->
                <!--                  align="center"-->
                <!--                />-->
                <!-- <el-table-column label="状态" width="180" align="center">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.userStatus"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="changeUserStatus(scope.row)"
                    />
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="120" fixed="right" align="center">
                  <template slot-scope="scope">
                    <div style="font-size: 18px;color:dodgerblue;">
                      <i style="cursor:pointer;" class="el-icon-edit-outline" @click="handleEdit(scope.row)" />
                      <i style="cursor:pointer;" class="el-icon-view" @click="handleView(scope.row)" />
                      <i style="cursor:pointer;" class="el-icon-delete" @click="handleDelete(scope.row)" />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格分页组件 -->
            <el-pagination
              style="margin:20px 0 20px 10px"
              :current-page="pageNum"
              :page-sizes="[20, 50, 80, 200]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>

      <!-- 修改 -->
      <!-- 添加用户对话框 -->
      <!-- el-drawer -->
      <el-dialog
        ref="addUserDrawer"
        :visible.sync="dialogFormVisibleAdd"
        :show-close="false"
        :wrapper-closable="false"
        center
        width="30%"
        title="添加成员"
        class="self-drawer self-drawer-wrap"
      >
        <!-- self-drawer self-drawer-wrap -->
        <div class="self-box3 self-box3-wrap" style="display:none;padding: 0 20px;justify-content: space-between">
          <!-- <div slot="title" style="font-size: 20px"></div> -->
          <!--          <el-button style="float:right;margin-right: 20px;" type="primary" size="mini" @click="batchEditPage">批量添加</el-button>-->
        </div>
        <el-form ref="addForm" :model="userForm" :rules="rules" label-width="50px">
          <el-form-item prop="workNumber" label="工号" class="self-input-box">
            <el-input v-model="userForm.workNumber" size="normal" placeholder="请输入工号" autocomplete="off" class="self-input" @blur="validateWorkNum" />
          </el-form-item>
          <el-form-item label="姓名" prop="userName" class="self-input-box">
            <el-input v-model="userForm.userName" size="normal" placeholder="请输入姓名" autocomplete="off" class="self-input" />
          </el-form-item>
          <el-form-item label="性别" class="self-input-box">
            <el-select ref="deptSelect" v-model="userForm.userSex" size="normal" placeholder="请选择性别" value="男" class="self-input">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="室所" class="self-input-box">
            <el-select
              ref="deptSelect"
              v-model="userForm.deptId"
              placeholder="请选择专业"
              size="normal"
              value="0"
              class="self-input"
              clearable
              @change="selectDept"
            >
              <el-option label="请选择室所" :value="0" disabled />
              <el-option
                v-for="(item,key) in deptList"
                :key="key"
                :label="item.deptName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="专业" class="self-input-box">
            <el-select
              v-model="userForm.userMajorId"
              placeholder="请选择专业"
              class="self-input"
              value="-1"
              size="normal"
            >
              <el-option label="请选择" :value="-1" disabled />
              <el-option v-for="(item,key) in majorList" :key="key" :label="item.deptName" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="权限" class="self-input-box">
            <el-select
              ref="positionSelect"
              v-model="userForm.roleId"
              placeholder="请选择用户权限"
              class="self-input"
              value="-1"
              size="normal"
            >
              <el-option label="请选择" value="-1" disabled />
              <el-option
                v-for="(item,key) in roleList"
                :key="key"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item prop="password" label="密码" class="self-input-box">
            <el-input v-model="userForm.password" size="normal" placeholder="请输入用户密码/默认密码为123456" class="self-input" />
          </el-form-item> -->
        </el-form>

        <div slot="footer" style="text-align: left;margin-left: 25px;margin-top: 25px;">
          <el-button size="normal" @click="cancelForm">取 消</el-button>
          <el-button size="normal" type="primary" :loading="loading" @click="commitUser()">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </el-dialog>

      <!-- todo 编辑用户对话框 -->
      <el-dialog
        ref="editUserDrawer"
        :visible.sync="dialogFormVisibleEdit"
        direction="rtl"
        center
        :show-close="false"
        :wrapper-closable="false"
        title="编辑资料"
        size="30%"
        width="30%"
        class="self-drawer self-drawer-wrap"
      >
        <!-- <div slot="title" style="font-size: 20px">编辑资料</div> -->
        <el-form
          ref="editForm"
          :model="userForm"
          :rules="rules"
          :disabled="editFormDisabled"
          label-width="50px"
        >
          <el-form-item prop="workNumber" label="工号" class="self-input-box">
            <el-input v-model="userForm.workNumber" size="normal" :disabled="true" placeholder="请输入工号" autocomplete="off" class="self-input" />
          </el-form-item>
          <el-form-item prop="userName" label="姓名" class="self-input-box">
            <el-input v-model="userForm.userName" size="normal" placeholder="请输入姓名" autocomplete="off" class="self-input" />
          </el-form-item>
          <!--          <el-form-item prop="contactInfo">-->
          <!--            <el-input v-model="userForm.contactInfo" size="normal" placeholder="请输入手机号" autocomplete="off" />-->
          <!--          </el-form-item>-->
          <el-form-item label="性别" class="self-input-box">
            <el-select ref="deptSelect" v-model="userForm.userSex" size="normal" placeholder="请选择性别" value="男" class="self-input">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="室所" class="self-input-box">
            <el-select
              ref="deptSelect"
              v-model="userForm.deptId"
              placeholder="请选择室所"
              size="normal"
              value="0"
              class="self-input"
              clearable
              @change="selectDept"
            >
              <el-option label="请选择用户权限" :value="0" disabled />
              <el-option
                v-for="(item,key) in deptList"
                :key="key"
                :label="item.deptName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-select-->
          <!--              ref="positionSelect"-->
          <!--              v-model="userForm.userPositionId"-->
          <!--              placeholder="请选择岗位"-->
          <!--              size="normal"-->
          <!--              value="0"-->
          <!--            >-->
          <!--              <el-option label="请选择岗位" :value="0" disabled />-->
          <!--              <el-option v-for="(item,key) in posList" :key="key" :label="item.posName" :value="item.id" />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!-- <el-form-item label="专业" class="self-input-box">
            <el-select
              ref="positionSelect"
              v-model="userForm.userMajorId"
              placeholder="请选择专业"
              size="normal"
              value="0"
              class="self-input"
            >
              <el-option label="请选择专业" :value="0" disabled />
              <el-option v-for="(item,key) in majorList" :key="key" :label="item.deptName" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="权限" class="self-input-box">
            <el-select
              ref="positionSelect"
              v-model="userForm.roleId"
              placeholder="请选择用户权限"
              size="normal"
              value="0"
              class="self-input"
            >
              <el-option label="请选择用户权限" :value="0" disabled />
              <el-option
                v-for="(item,key) in roleList"
                :key="key"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item prop="password" label="密码" class="self-input-box">
            <el-input v-model="userForm.password" size="normal" placeholder="请输入重置密码" class="self-input" />
          </el-form-item> -->
        </el-form>
        <div slot="footer" style="text-align: left;margin-left: 25px;margin-top: 25px;">
          <el-button size="normal" @click="cancelEditForm">取 消</el-button>
          <el-button size="normal" type="primary" :loading="loading" :disabled="editBtnDisabled" @click="updateUser()">{{ loading ? '提交中...' : '确 定' }}
          </el-button>
        </div>
      </el-dialog>

      <!-- 新增配施人员 -->
      <el-dialog
        title="添加配施人员"
        :visible.sync="dialogVisible"
        width="80%"
      >
        <p class="tips">请先在查询系统用户表，选择要添加的用户，并添加到待加入配施用户表，然后选择右上角确定添加按钮即可</p>
        <div class="header-search">
                <div class="search-row">
                <div class="search-text" style="width:40px">室所</div>
                <el-select v-model="searchDeptId" placeholder="请选择项目" :clearable="true" @clear="clearDept" @change="depchange">
                  <el-option label="请选择室所" :value="0" disabled />
                  <el-option
                    v-for="(item,key) in deptList"
                    :key="key"
                    :label="item.deptName"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <div class="search-row">
                <div class="search-text" style="width: 140px">工号或姓名</div>
                <el-input v-model="workNumberKeyWord" :clearable="true" @input="workNumberHandler"/>
              </div>
              <!-- <div class="search-row">
                <div class="search-text" style="width: 40px">姓名</div>
                <el-input v-model="userNameKeyWord" :clearable="true" />
              </div> -->
              <div class="search-row">
                <el-button type="primary" @click="listsearchForm">查询</el-button>
              </div>
              <div class="search-row search-row-margin">
                <el-button type="primary" @click="listsearchAdd">确定添加</el-button>
              </div>
        </div>
        <div class="personview">
          <div class="left">
            <p class="tablenames">系统用户表</p>
            <el-table
              v-loading="loading"
              :data="listtableData"
              height="700px"
              style="width: 100%; margin-top:20px;"
              tooltip-effect="dark"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              @selection-change="lefthandleSelectionChange"
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
            </el-table>
                        <!-- 表格分页组件 -->
            <el-pagination
              style="margin:20px 0 20px 10px"
              :current-page="listpageNum"
              :page-sizes="[20, 50, 80, 200]"
              :page-size="listpageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="listtotal"
              @size-change="listhandleSizeChange"
              @current-change="listhandleCurrentChange"
            />
          </div>
          <div class="center">
            <el-button type="primary" @click="addPersontoright">添加</el-button>
          </div>
             <div class="right">
            <p class="tablenames">待加入配施用户表</p>
            <el-table
              v-loading="loading"
              :data="personListData"
              height="700px"
              style="width: 100%; margin-top:20px;"
              tooltip-effect="dark"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
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
                prop="operate"
                label="操作"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button type="primary" @click="delPerson(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" style="display:none">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>

import { deptAdd,deptPersonList,adminPsDel, searchAdminps, batchDeletePerson, savePerson, updatePerson, deptList, checkContactInfo, checkWorkNumber, AdminListPs } from '@/api/dept'
import { posList, majorList, roleList } from '@/api/dict'
import { updateAccountStatus } from '@/api/account'
import {addBatchAddPs } from '@/api/user'
export default {
  name: 'Users',
  data() {
    return {
      uploadIp: '',
      currentDeptId: -1,
      pageNum: 1,
      pageSize: 20,
      total: 0,
      listpageNum: 1,
      listpageSize: 20,
      listtotal: 0,
      searchDeptId: '',
      workNumberKeyWord: '',
      userNameKeyWord: '',
      tableHeight: 500 /* window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 500*/,
      tableData: [],
      listtableData:[],
      majorList: [],
      posList: [],
      deptList: [],
      roleList: [],
      multipleSelection: [],
      addDeptVisible: false,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogRoleVisible: false,
      editFormDisabled: false,
      editBtnDisabled: false,
      cascaderDisabled: false,
      showAllLevels: false,
      currentRoleId: -1,
      currentUserId: -1,
      currentUserName: '',
      labelwidth: '80px',
      batchEdit: true,
      userForm: {
        workNumber: '',
        userName: '',
        loginName: '',
        userSex: '男',
        userPositionId: 1,
        userMajorId: 1,
        contactInfo: '',
        deptId: '-1',
        deptName: '',
        roleId: '-1'
      },
      deptForm: {
        deptName: '',
        pid: 0
      },

      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '请输入用户工号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        userPositionId: [
          { required: true, message: '请选择用户岗位', trigger: 'blur' }
        ],
        userMajorId: [
          { required: true, message: '请选择用户专业', trigger: 'blur' }
        ],
        contactInfo: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '长度为11位数字', trigger: 'change' }
        ],
        deptId: [
          { required: true, message: '请选择用户所属部门', trigger: 'blur' }
        ]
      },
      timer: null,
      loading: false,
      deptTree: [],
      fullscreenLoading: false,
      dialogVisible: false,
      personListData: [],
      personListDatas: []
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

  created() {
    this.uploadIp = process.env.VUE_APP_BASE_API
    // 加载部门树
    this.getList()

    this.getPosList()
    this.getDeptList()
    this.getRoleList()
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.tableHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        // that.tableHeight = window.tableHeight - that.$refs.queryHeight.offsetHeight
        that.tableHeight = that.$refs.queryHeight.offsetHeight - 50
        if (that.tableHeight < 600) {
          that.tableHeight = 600
        }
      })()
    }
  },

  methods: {
    workNumberHandler(e){
      console.log(e)
    },
    depchange(e){
      this.currentDeptId = e
    },
    async listsearchAdd(){
      if(!this.personListData.length){
          this.$message.warning('请添加用户')
        return 
      }
      var data = []
      this.personListData.map((item)=>{
        data.push(item.id)
      })
      var result = await addBatchAddPs(data)
      if(result.code == 200){
        this.listtableData = []
        this.listpageNum = 1
        this.listpageSize = 20
        this.listtotal = 0
        this.currentDeptId = ''
        this.dialogVisible = false
        this.$message.success('添加成功')
      }else{
         this.$message.warning('添加失败')
      }
    },
    listsearchForm(){
      this.listtableData = []
      this.listpageNum = 1
      this.listpageSize = 20
      this.listtotal = 0
      this.getDeptPersonList()
    },
    listhandleSizeChange(val) {
      this.listpageSize = val
      this.listpageNum = 1
      this.getDeptPersonList()

      console.log(`每页 ${val} 条`)
    },
    listhandleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.listpageNum = val
      this.getDeptPersonList()
    },
        // 查询用户
    async getDeptPersonList() {
      var searchText = false
      if (!isNaN(this.workNumberKeyWord)) {
        searchText = true
      }
      await deptPersonList({ deptId: this.currentDeptId, pageNum: this.listpageNum, pageSize: this.listpageSize, workNumberKeyWord: searchText ? this.workNumberKeyWord : '', userNameKeyWord: searchText ? '' : this.workNumberKeyWord }).then(res => {
        const {
          data, msg, status, count
        } = res

        if (status === 200) {
          this.listtableData = data
          this.listtotal = count
        } else {
          this.$message.warning(msg)
        }
        this.loading = false
      })
    },
    addPersontoright(){
      if(!this.personListDatas.length){
          this.$message.warning('请选择系统用户')
        return
      }
      this.personListData = this.personListData.concat(this.personListDatas)
    },
    delPerson(obj){

         this.personListData.some((item, i) => {
                if (item.id == obj.id ){
                        this.personListData.splice(i,1)
                        return true
                }
        })
    },
    lefthandleSelectionChange(e){
      this.personListDatas = e
    },
    righthandleSelectionChange(e){

    },
    addPersonView(){
      this.dialogVisible = true
    },
    onprogress(e) {
      this.fullscreenLoading = true
    },
    searchForm(e) {
      //       searchDeptId: '',
      // workNumberKeyWord: '',
      // userNameKeyWord: '',
      var searchText = false
      if (!isNaN(this.workNumberKeyWord)) {
        searchText = true
      }
      searchAdminps({ deptId: this.searchDeptId, workNumberKeyWord: searchText ? this.workNumberKeyWord : '', userNameKeyWord: !searchText ? this.workNumberKeyWord : '', pageNum: this.pageNum, pageSize: this.pageSize }).then((res) => {
        const {
          data, msg, status, count
        } = res

        if (status === 200) {
          this.tableData = data
          this.total = count
        } else {
          this.$message.warning(msg)
        }
        this.loading = false
      })
    },
    clearDept() {
      this.currentDeptId = -1
    },
    selectDept(val) {
      // 清空数据
      this.$set(this.userForm, 'userMajorId', '')
      // 重新加载下拉数据
      this.getMajorList({ deptId: val })
    },
    downloadTemp() {
      window.open(process.env.VUE_APP_BASE_API + 'excel/download?templateType=5')
    },
    uploadSuccess(response, file, fileList) {
      if (response.status === 500) {
        this.$nextTick(() => {
          this.fullscreenLoading = false
        })
        this.$notify({
          title: '提示信息',
          message: response.msg,
          duration: 10000,
          customClass: 'self-notice',
          dangerouslyUseHTMLString: true,
          position: 'bottom-right'
        })
      } else {
        this.$nextTick(() => {
          this.fullscreenLoading = false
        })
        this.$notify({
          title: '提示信息',
          message: response.data,
          duration: 10000,
          customClass: 'self-notice',
          dangerouslyUseHTMLString: true,
          position: 'bottom-right'
        })
        this.getList()
      }
    },
    uploadError(err, file, fileList) {
      console.log(err)
      console.log(file)
      console.log(fileList)
    },
    // 加载专业列表
    async getMajorList(params) {
      majorList(params).then(res => {
        const {
          data, status
        } = res
        if (status === 200) {
          this.majorList = data
        }
      })
    },
    //
    async getRoleList() {
      roleList().then(res => {
        const {
          data, status
        } = res
        if (status === 200) {
          this.roleList = data
        }
      })
    },
    // 加载岗位列表
    async getPosList() {
      posList().then(res => {
        const {
          data, status
        } = res
        if (status === 200) {
          this.posList = data
        }
      })
    },
    async getDeptList() {
      deptList().then(res => {
        const {
          data, status
        } = res
        if (status === 200) {
          this.deptList = data
        }
      })
    },
    // 加载用户列表
    async getList() {
      await AdminListPs({ deptId: this.searchDeptId, pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
        const {
          data, msg, status, count
        } = res

        if (status === 200) {
          this.tableData = data
          this.total = count
        } else {
          this.$message.warning(msg)
        }
        this.loading = false
      })
    },
    validateContactInfo() {
      if (this.userForm.contactInfo !== '') {
        checkContactInfo({ contactInfo: this.userForm.contactInfo }).then(res => {
          if (res.data) {
            this.userForm.contactInfo = ''
            this.$message.warning('该手机号码已被使用')
          }
        })
      }
    },
    validateWorkNum(val) {
      if (this.userForm.workNumber !== '') {
        checkWorkNumber({ workNumber: this.userForm.workNumber }).then(res => {
          if (res.data) {
            this.userForm.workNumber = ''
            this.$message.warning('该工号已被使用')
          }
        })
      }
    },
    // 提交添加用户信息
    async commitUser() {
      this.loading = true
      if (this.userForm.roleId === 0) {
        this.$message.warning('未设置用户的角色，用户无法启用！')
      }

      const deptId = this.userForm.deptId
      const majorId = this.userForm.userMajorId
      const posId = this.userForm.userPositionId
      if (deptId) {
        const deptObj = this.deptList.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.id === deptId// 筛选出匹配数据
        })
        this.userForm.deptName = deptObj.deptName
      }
      if (majorId) {
        const majorObj = this.majorList.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.id === majorId// 筛选出匹配数据
        })
        this.userForm.userMajor = majorObj.deptName
      }
      // if (posId) {
      //   const posObj = this.posList.find((item) => { // 这里的userList就是上面遍历的数据源
      //     return item.id === posId// 筛选出匹配数据
      //   })
      //   this.userForm.userPosition = posObj.posName
      // }
      savePerson(this.userForm).then(res => {
        const {
          msg, status
        } = res
        if (status === 200) {
          this.getList()
          this.loading = false
          this.$refs.addUserDrawer.closeDrawer()
        } else {
          this.$message.warning(msg)
          this.loading = false
        }
      })
    },
    // 编辑用户
    async updateUser() {
      this.dialogFormVisibleEdit = false
      this.loading = true

      const deptId = this.userForm.deptId
      const majorId = this.userForm.userMajorId
      // const posId = this.userForm.userPositionId
      if (deptId) {
        const deptObj = this.deptList.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.id === deptId// 筛选出匹配数据
        })
        this.userForm.deptName = deptObj.deptName
      }
      if (majorId) {
        const majorObj = this.majorList.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.id === majorId// 筛选出匹配数据
        })
        this.userForm.userMajor = majorObj.deptName
      }
      // if (posId) {
      //   const posObj = this.posList.find((item) => { // 这里的userList就是上面遍历的数据源
      //     return item.id === posId// 筛选出匹配数据
      //   })
      //   this.userForm.userPosition = posObj.posName
      // }

      updatePerson(this.userForm).then(res => {
        const {
          msg, status
        } = res
        if (status === 200) {
          this.getList()
        } else {
          this.$message.warning(msg)
          this.loading = false
        }
      })
    },
    // 打开添加用户对话框
    handleAdd() {
      console.log('打开添加用户对话框')
      this.dialogFormVisibleAdd = true
      // this.$refs获取组件需要等组件渲染完成后才能调用重置表单数据方法
      this.userForm = {}
    },
    handleEdit(row) {
      this.userForm = row
      this.editFormDisabled = false
      this.editBtnDisabled = false
      this.dialogFormVisibleEdit = true
      console.log(row)
      this.getMajorList({ deptId: row.deptId })
    },
    // 查看
    handleView(row) {
      this.userForm = row
      this.editFormDisabled = true
      this.editBtnDisabled = true
      this.dialogFormVisibleEdit = true
      this.getMajorList({ deptId: row.deptId })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作是将用户从配施人员表里面删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        adminPsDel(row.id).then(res => {
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
    // 修改用户状态
    async changeUserStatus(user) {
      this.loading = true
      updateAccountStatus(user).then(res => {
        const { msg, status } = res
        if (status === 200) {
          if (user.userStatus) {
            this.$message.success(user.userName + '用户已启用！')
          } else {
            this.$message.warning(user.userName + '用户已禁用！')
          }
        } else {
          user.userStatus = false
          this.$message.error(msg)
        }
        this.loading = false
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
    handleNodeClick(data) {
      this.currentDeptId = data.id
      this.getList()
    },
    handleAddDept() {
      this.deptForm = {
        pid: 0
      }
      this.addDeptVisible = true
    },
    async commitDept() {
      this.loading = true
      console.log(this.deptForm)
      deptAdd(this.deptForm).then(res => {
        const { msg, status } = res
        if (status === 200) {
          this.loading = false
          this.$refs.addDeptDrawer.closeDrawer()
          this.getDeptTreeList()
        }
        if (status === 500) {
          this.$message.warning(msg)
          this.loading = false
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'logTime') {
          return this.dateFormat(v[j])
        } else {
          return this.toText(v[j])
        }
      }))
    },
    doExportData() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = ['workNumber', 'userName', 'userSex', 'deptName', 'userPosition', 'userMajor', 'contactInfo']
        const tHeader = ['工号', '姓名', '性别', '所属部门', '岗位', '专业', '手机号码']
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
    handleBacthDel() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一个员工！')
        return
      }

      this.$confirm('此操作将永久已勾选的用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const userIds = []
        this.multipleSelection.forEach((item) => {
          userIds.push(item.id)
        })
        const uids = userIds.join(',')
        console.log('uids', uids)
        batchDeletePerson(uids).then(res => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length > 0) {
        this.batchEdit = false
      } else {
        this.batchEdit = true
      }
    },
    cancelForm() {
      this.loading = false
      this.dialogFormVisibleAdd = false
      clearTimeout(this.timer)
    },
    cancelEditForm() {
      this.loading = false
      this.dialogFormVisibleEdit = false
      clearTimeout(this.timer)
    },
    cancelDeptForm() {
      this.loading = false
      this.addDeptVisible = false
      clearTimeout(this.timer)
    },
    batchEditPage() {
      this.$router.push({ path: '/mailList/batchEdit', query: {
        deptTreeList: this.deptTreeList,
        deptList: this.deptList,
        majorList: this.majorList,
        posList: this.posList,
        roleList: this.roleList
      }})
    }
  }
}
</script>

<style scoped lang="scss">
.tips{
  color:red;
}
.header-search{
  display: flex;
  flex-direction: row;
  .search-row-margin{
    margin-left:auto;
    margin-right:0px!important;
  }
}
.personview{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .left{
    width:45%;
    .tablenames{
      font-size:18px;
      font-weight:bold;
      text-align:center;
    }
  }

  .right{
    width:45%;
    padding-bottom: 71px;
    .tablenames{
      font-size:18px;
      font-weight:bold;
      text-align:center;
    }
  }
}
.el-col-wrap{
  padding-top:15px;
  padding-bottom: 15px;
}
  .bg-purple {
    background: #d3dce6;
    height: 100%;
  }

  .grid-content {
    background: #ffffff;
    border-radius: 4px;
    height: 100%;
  }

  .userTable {
    width: 98%;
    margin: 0 0 0 20px;
  }

  .header-img {
    width: 20px;
    height: 20px;
  }

  .header-title {
    padding: 20px 10px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .self-box{

    display: flex;
    flex-direction: column;
    flex: 1;
    flex-basis: auto;
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
  .self-box3{
    position: relative;
    padding: 0 ;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .self-input-box{
    display: flex;
    display: inline-block\9;
    width:100%\9;
    align-items: center;
    padding: 10px;
    border: 1px solid rgba(51, 51, 51, 0.2);
  }
  .self-title{
    width: 90px;
    text-align: center;
    font-size: 14px;
  }
  .self-input{
    flex: 1;
  }
  .self-card-icon{
    width: 40px;
    height: 40px;
    background: aliceblue;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px
  }
  h3{
    margin: 10px 0;
  }

  .self-box2{
    position: relative;
    padding: 10px 20px ;
    box-sizing: border-box;
    display: flex;
    display: inline-block\9;
    align-items: center;
  }
  .self-box2-fix2{
    width:100%\9;
  }
  .self-box2-fix2 .search-row{
    width:16.7%;
  }
  .el-button-fix{
    display:flex;
    margin-top: 10px;
    margin-right: 20px;
    justify-content: flex-end;
    display: inline-block\9;
    width:300px;
    margin-left:calc(100% - 310px);
  }
  .el-button-fix .el-button{
    float:left\9;
  }
  .el-button-fix .upload-demo{
    float:left\9;
  }

  .search-row{
    display: flex;
    display: inline-block\9;
    margin-right: 20px;
    align-items: center;
  }
  .search-text{
    font-size: 12px;
    text-align: right;
    margin-right: 10px;
    float:left\9;
    height:28px\9;
    line-height: 28px\9;
  }

</style>
<style>
  .el-row-fixw{
    display: flex;
    display: block\9;
    flex-direction: column;
    height: 100%;
    height:100%\9;
  }
  .self-drawer-wrap{

  }
  .self-drawer-wrap .el-dialog__body{
    height:350px;
    overflow: hidden;
    overflow-y:scroll;
  }
  .el-row-fixw .el-input{
    width:auto\9;
  }
  .self-drawer .el-form-item{
    padding: 10px 20px;
    border: 1px solid rgba(51, 51, 51, 0.2)!important;
    display: flex;
    align-items: center;
    border-radius: 0px!important;
  }
  /*.self-drawer .el-form-item__label{*/
  /*  width: 80px;*/
  /*}*/
  .self-drawer .el-form-item__content{
    margin-left: 0!important;
    flex: 1;
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
    border-left: 1px solid #3333!important;
    border-radius: 0;
  }
  .self-drawer .el-drawer__header{
    margin-bottom: 0px;
  }
  .self-notice{
    /* margin:0 auto; */
    left:50%;
    /* margin-left:-25%;
    margin-top:-25%; */
    margin-left:-165px;
  }
  .self-notice .el-notification__group{
    width: 100%;
  }
  .self-notice .el-notification__group .el-notification__content{
    max-height: calc(100vh - 150px);
    width: 100%;
    overflow: auto;
  }
  .self-input-box .el-form-item__content{
    float:left\9;
    width:calc(100% - 50px) \9;
  }
  .self-input-box  .el-form-item__label{
    line-height:40px!important;
  }
  .search-row .el-select .el-input{
    width:100%!important;
  }
</style>
