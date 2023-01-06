<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>CMDB</el-breadcrumb-item>
            <el-breadcrumb-item>资产列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input placeholder="请输入内容" v-model="keywords">
                        <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" @click="addDialogVisible = true">增加资产</el-button>
                </el-col>
            </el-row>
            <el-card class="box-card">
                <el-table :data="dataList"  style="border width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column label="资产名称">
                      <template #default="{ row }">
                        {{ row.fields[1].value }}
                      </template>
                    </el-table-column>
                    <el-table-column label="资产类型">
                      <template #default="{ row }">
                        {{ row.fields[0].value }}
                      </template>
                    </el-table-column>
                    <el-table-column label="资产用途">
                      <template #default="{ row }">
                        {{ row.fields[2].value }}
                      </template>
                    </el-table-column>
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
        <el-dialog title="增加资产" :visible.sync="addDialogVisible" @close="resetForm('add')">
            <el-form :model="addForm" :rules="addRules" ref="add" label-width="100px">
                <el-form-item label="资产类型" prop="label">
                    <el-select v-model="addForm.citype" placeholder="请选择资产类型" @change="handleCiTypeChange">
                      <el-option v-for="item in citypes" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                  v-for="(domain, index) in addForm.fields"
                  :label="domain.label"
                  :key="domain.name"
                  :prop="'fields.' + index + '.value'"
                  :rules="
                    domain.required
                      ? {
                          required: true,
                          message: domain.label + '不能为空',
                          trigger: 'blur'
                      }
                    : {}
                  "
                >
                  <div v-if="!domain.type.startsWith('list:')">
                    <el-input v-model="domain.value"></el-input>
                  </div>
                  <div v-else>
                    <el-button icon="el-icon-plus" size="mini" plain type="success" @click="handleAddChild(domain)"></el-button>
                    <el-card
                        v-for="(def, i) in domain.fieldsDef"
                        :key="`${domain.name}.def.${i}`">
                      <el-form-item
                        v-for="(subDomain, j) in def.fields"
                        :label="subDomain.label"
                        :key="subDomain.name"
                        :prop="'fields.' + index + '.fieldsDef.' + i + '.fields.' + j + '.value'"
                        :rules="
                          subDomain.required
                            ? {
                                required: true,
                                message: subDomain.label + '不能为空',
                                trigger: 'blur'
                            }
                            : {}
                        "
                      >
                        <el-input v-model="subDomain.value"></el-input>
                      </el-form-item>
                    </el-card>
                  </div>
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
                <!-- <el-form-item label="模型类型" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="模型标签" prop="label">
                    <el-input v-model="editForm.label"></el-input>
                </el-form-item> -->
                <el-form-item label="资产类型" prop="label">
                    <el-select v-model="editForm.citype" placeholder="请选择资产类型" @change="handleCiTypeChange">
                      <el-option v-for="item in citypes" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                  v-for="(domain, index) in editForm.fields"
                  :label="domain.label"
                  :key="domain.name"
                  :prop="'fields.' + index + '.value'"
                  :rules="
                    domain.required
                      ? {
                          required: true,
                          message: domain.label + '不能为空',
                          trigger: 'blur'
                      }
                    : {}
                  "
                >
                  <div v-if="!domain.type.startsWith('list:')">
                    <el-input v-model="domain.value"></el-input>
                  </div>
                  <div v-else>
                    <el-button icon="el-icon-plus" size="mini" plain type="success" @click="handleAddChild(domain)"></el-button>
                    <el-card
                        v-for="(def, i) in domain.fieldsDef"
                        :key="`${domain.name}.def.${i}`">
                      <el-form-item
                        v-for="(subDomain, j) in def.fields"
                        :label="subDomain.label"
                        :key="subDomain.name"
                        :prop="'fields.' + index + '.fieldsDef.' + i + '.fields.' + j + '.value'"
                        :rules="
                          subDomain.required
                            ? {
                                required: true,
                                message: subDomain.label + '不能为空',
                                trigger: 'blur'
                            }
                            : {}
                        "
                      >
                        <el-input v-model="subDomain.value"></el-input>
                      </el-form-item>
                    </el-card>
                  </div>
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
    this.getAllTypeList()
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
      citypes: [],
      addDialogVisible: false,
      addForm: { citype: null },
      addRules: {
        citype: [
          { required: true, message: '请选择资产类型', trigger: 'blur' }
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
      editForm: { id: null, citype: null },
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
        const { data: response } = await axios.delete(`cmdb/cis/${id}/`)
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
    async getAllTypeList () {
      const { data: response } = await axios.get('cmdb/citypes/all/')
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.citypes = response
    },
    add () {
      const name = 'add'
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await axios.post('cmdb/cis/', this.addForm)
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
      const { data: response } = await axios.get('cmdb/cis/', {
        params: {
          page,
          // fields[2].value: this.keywords
          // label: this.keywords,
          value: this.keywords
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
    async handleCiTypeChange (id) {
      const { data: response } = await axios.get(`cmdb/citypes/${id}/`)
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.$set(this.addForm, 'fields', response.fields)
    },
    async handleAddChild (domain) {
      const [, name, version] = domain.type.split(':')
      const { data: response } = await axios.get(`cmdb/citypes/${name}/${version}`)
      if (response.code) {
        return this.$message.error(response.message)
      }
      if ('fieldsDef' in domain === false) {
        this.$set(domain, 'fieldsDef', [])
      }
      domain.fields.push(response)
    },
    handleEdit (row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    edit () {
      const { id } = this.editForm
      const name = 'edit'
      this.editForm.id = id
      console.log(this.editForm)
      this.$refs[name].validate(async valid => {
        if (valid) {
          const { data: response } = await axios.patch(`cmdb/cisid/${id}/`, this.editForm)
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
.el-form-item .el-form-item {
  margin-bottom: 22px;
}
</style>
