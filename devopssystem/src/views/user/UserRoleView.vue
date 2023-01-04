<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input placeholder="请输入内容" v-model="search">
                        <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" @click="addDialogVisible = true">增加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="dataList"  style="border width: 100%">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column label="操作" >
                    <template #default="{ row }">
                        <el-tooltip content="分配权限" effect="light">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="handleSetPerm(row)">分配权限</el-button>
                        </el-tooltip>
                        <el-tooltip content="修改" effect="light">
                            <el-button type="success" icon="el-icon-edit" size="mini" @click="handleEdit(row)">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" effect="light">
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
        <!-- 给角色赋权 -->
        <el-dialog title="角色赋权" :visible.sync="addPermDialogVisbile" @close="resetTree">
          <el-tree
          :data="permList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
          :default-checked-keys="selectedIds"
          >
          </el-tree>
          <span slot="footer" class="dialog-footer">
              <el-button @click="addPermDialogVisbile = false">取消</el-button>
              <el-button type="primary" @click="addPerm">确定</el-button>
              <el-button @click="resetTree">重置</el-button>
          </span>
        </el-dialog>
        <!-- 添加角色 -->
        <el-dialog title="增加角色" :visible.sync="addDialogVisible" @close="resetForm('add')">
            <el-form :model="addForm" :rules="addRules" ref="add" label-width="100px">
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="add">确定</el-button>
                <el-button @click="$refs['add'].resetFields()">重置</el-button>
            </span>
        </el-dialog>
        <!-- 修改角色 -->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible">
            <el-form :model="editForm" :rules="editRules" ref="edit" label-width="100px">
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="editForm.name">{{ editForm.username }}</el-input>
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
    return {
      keywords: '',
      search: '',
      dataList: [],
      pagination: { page: 1, size: 20, total: 0 },
      addDialogVisible: false,
      addForm: { name: '' },
      addRules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在1到16个字符', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: { name: '' },
      editRules: {},
      addPermDialogVisbile: false,
      permList: [],
      selectedIds: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentRole: {}
    }
  },
  methods: {
    handleDel (id) {
      this.$msgbox.confirm('删除该角色，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async () => {
        const { data: response } = await axios.delete(`users/roles/${id}/`)
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
          const { data: response } = await axios.post('users/roles/', this.addForm)
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
      const { data: response } = await axios.get('users/roles/', {
        params: {
          page,
          rolename: this.search
        }
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.dataList = response.results
      this.pagination = response.pagination
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
          const { data: response } = await axios.patch(`users/roles/${id}/`, this.editForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.editDialogVisible = false
          this.getList(this.pagination.page)
        }
      })
    },
    async handleSetPerm (row) {
      const { id } = row
      const { data: response } = await axios.get(`users/roles/${id}/perms/`)
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.permList = response.allPerms
      this.selectedIds = response.permissions
      this.currentRole = row
      this.addPermDialogVisbile = true
    },
    async addPerm () {
      const name = 'tree'
      const permissions = this.$refs[name].getCheckedKeys()
      const { id } = this.currentRole
      const { data: response } = await axios.patch(`users/roles/${id}/`, {
        permissions
      })
      // console.log(permissions)
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.addPermDialogVisbile = false
    },

    resetTree () {
      this.currentRole = {}
      this.selectedIds = []
      this.permList = []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
