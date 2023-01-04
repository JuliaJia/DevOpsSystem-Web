<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>CMDB</el-breadcrumb-item>
            <el-breadcrumb-item>模型列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input placeholder="请输入内容" v-model="keywords">
                        <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" @click="addDialogVisible = true">增加模型</el-button>
                </el-col>
            </el-row>
            <el-card class="box-card">
                <el-table :data="dataList"  style="border width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="label" label="模型标签"></el-table-column>
                    <el-table-column prop="name" label="模型类型"></el-table-column>
                    <el-table-column label="操作" >
                        <template #default="{ row }">
                            <el-tooltip content="修改" effect="light">
                                <el-button type="success" icon="el-icon-edit" size="mini" @click="handleEdit(row,row.id)">编辑</el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" effect="light">
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(row.id)">删除</el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-pagination
            @current-change="handleCurrentChange"
              :current-page="pagination.page"
              :page-size="pagination.size"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total"
            >
            </el-pagination>
        </el-card>
        <!-- 用户角色授权 -->
        <el-dialog title="用户角色授权" :visible.sync="addRoleDialogVisible" @close="restTree">
            <el-tree
            :data="roleList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props=defaultProps
            :default-checked-keys="selectedIds"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addRoles">确定</el-button>
                <el-button @click="restTree">重置</el-button>
            </span>
        </el-dialog>
        <!-- 添加用户 -->
        <el-dialog title="增加模型" :visible.sync="addDialogVisible" @close="resetForm('add')">
            <el-form :model="addForm" :rules="addRules" ref="add" label-width="100px">
                <el-form-item label="模型类型" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="模型标签" prop="label">
                    <el-input v-model="addForm.label"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="add">确定</el-button>
                <el-button @click="$refs['add'].resetFields()">重置</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户 -->
        <el-dialog title="修改" :visible.sync="editDialogVisible">
            <el-form :model="editForm" :rules="editRules" ref="edit" label-width="100px">
                <el-form-item label="模型类型" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="模型标签" prop="label">
                    <el-input v-model="editForm.label"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="edit">确定</el-button>
                <el-button @click="$refs['edit'].resetFields()">重置</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  created () {
    this.getList()
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      keywords: '',
      search: '',
      dataList: [],
      pagination: { page: 1, size: 20, total: 0 },
      addDialogVisible: false,
      addForm: { name: '', label: '' },
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在4到16个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在8到16个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入确认密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: { name: '', label: '' },
      editRules: {},
      addRoleDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleList: [],
      selectedIds: [],
      currentUser: {}
    }
  },
  methods: {
    handleDel (id) {
      this.$msgbox.confirm('删除该模型类型，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async () => {
        const { data: response } = await axios.delete(`cmdb/citypes/${id}/`)
        if (response.code) {
          return this.$message.error(response.message)
        }
        this.getList()
      }).catch(() => {})
    },
    resetForm (name) {
      this.$refs[name].resetFields()
    },
    handleCurrentChange (val) {
      this.getList(val)
    },
    add () {
      const name = 'add'
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await axios.post('cmdb/citypes/', this.addForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.addDialogVisible = false
          this.getList()
        }
      })
    },
    async getList (page = 1) {
      if (!page) {
        page = 1
      }
      const { data: response } = await axios.get('cmdb/citypes/', {
        params: {
          page
        }
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.dataList = response.results
      this.pagination = response.pagination
    },
    async handleChange (row) {
      await axios.patch(`users/user/${row.id}/`, {
        is_active: row.is_active
      })
    },
    handleEdit (row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    edit () {
      const { id } = this.editForm
      const name = 'edit'
      this.$refs[name].validate(async valid => {
        if (valid) {
          const { data: response } = await axios.patch(`cmdb/citypes/${id}/`, this.editForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.editDialogVisible = false
          this.getList(this.pagination.page)
        }
      })
    },
    async handleAuthorUser (row) {
      const { id } = row
      const { data: response } = await axios.get(`users/user/${id}/roles/`)
      if (response.code) {
        this.$message.error(response.message)
      }
      this.roleList = response.allRoles
      this.selectedIds = response.roles
      this.currentUser = row
      this.addRoleDialogVisible = true
    },
    async addRoles (row) {
      const name = 'tree'
      const roles = this.$refs[name].getCheckedKeys()
      const { id } = this.currentUser
      const { data: response } = await axios.put(`users/user/${id}/roles/`, {
        roles
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.addRoleDialogVisible = false
    },
    restTree () {
      this.currentUser = {}
      this.selectedIds = []
      this.roleList = []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
