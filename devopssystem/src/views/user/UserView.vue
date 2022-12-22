<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input placeholder="请输入内容" v-model="keywords">
                        <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" @click="addDialogVisible = true">增加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="dataList"  style="border width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="登录名"></el-table-column>
                <el-table-column prop="is_active" label="激活状态">
                    <template #default="{ row }">
                        <el-switch v-model="row.is_active" @change="handleChange(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="is_superuser" label="是否为管理员" ></el-table-column>
                <el-table-column prop="phone" label="手机" ></el-table-column>
                <el-table-column label="操作" >
                    <template #default="{ row }">
                        <el-tooltip v-if="row.id !== 1 " content="修改" effect="light">
                            <el-button type="success" icon="el-icon-edit" size="mini" @click="handleEdit(row)">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip v-if="row.id !== 1" content="删除" effect="light">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(row.id)">删除</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            @current-change="handleCurrentChange"
              :current-page="pagination.page"
              :page-size="pagination.size"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户 -->
        <el-dialog title="增加用户" :visible.sync="addDialogVisible" @close="resetForm('add')">
            <el-form :model="addForm" :rules="addRules" ref="add" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="addForm.checkPass"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
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
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username">{{ editForm.username }}</el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="editForm.checkPass"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
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
      addForm: { username: '', password: '', checkPass: '', phone: '', email: '' },
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在4到16个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入确认密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: { username: '', phone: '', email: '' },
      editRules: {}
    }
  },
  methods: {
    handleDel (id) {
      this.$msgbox.confirm('删除该用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async () => {
        const { data: response } = await axios.delete(`users/${id}/`)
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
          const { data: response } = await axios.post('users/', this.addForm)
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
      const { data: response } = await axios.get('users/', {
        params: {
          page,
          username: this.keywords
        }
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.dataList = response.results
      this.pagination = response.pagination
    },
    async handleChange (row) {
      await axios.patch(`users/${row.id}`, {
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
          const { data: response } = await axios.patch(`users/${id}`, this.editForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.editDialogVisible = false
          this.getList(this.pagination.page)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
