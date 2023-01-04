<template>
    <div>
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input placeholder="请输入内容" v-model="search">
                        <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="dataList" style="border width: 100%">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="codename" label="codename"></el-table-column>
                <el-table-column prop="content_type.app_label" label="应用"></el-table-column>
                <el-table-column prop="content_type.model" label="模型"></el-table-column>
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
      search: '',
      dataList: [],
      pagination: { page: 1, size: 1, total: 0 }
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.getList(val)
    },
    async getList (page = 1) {
      if (!page) {
        page = 1
      }
      const { data: response } = await axios.get('users/perms/', {
        params: { page, search: this.search }
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.dataList = response.results
      this.pagination = response.pagination
    }
  }
}
</script>
