<template>
<el-container>
  <el-header>
    <div class="logo">
      <img src="../assets/logo-img.15f436d0.svg" alt="logo">
      <div class="title">OneManDevOps</div>
      <div style="font-size: 30px; margin-left: 8px"><i :class="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i></div>
    </div>
    <div class="info">
      <el-button type="danger" circle @click="logout" style="margin-right: 8px" class="el-icon-switch-button"></el-button>
      <el-dropdown @command="handleCommand" style="font-size: 20px; color: rgb(255,255,255)">
        <span class="el-dropdown-link">{{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="chpwd">修改密码</el-dropdown-item>
          <!-- <el-dropdown-item command="logout">退出</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="chpwdDialogVisible" @close="resetForm('changepwd')">
      <el-form :model="chpwdForm" :rules="chpwdRules" ref="changepwd" label-width="100px">
        <el-form-item label="用户名">{{ user.username }}</el-form-item>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="chpwdForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="chpwdForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="chpwdForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chpwdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </span>
    </el-dialog>
  </el-header>
  <el-container>
    <el-aside :width="isCollapsed ? '64px' : '240px'">
      <el-menu  :router="true" :collapse="isCollapsed" :collapse-transition="true" background-color="#216ec6" text-color="#f5f7f9" active-text-color="#f5f7f9">
        <el-menu-item index="/welcome">
        <i class="el-icon-s-data"  style="padding-right: 20px; color: rgb(255,255,255)"></i>
        <span slot="title" style="padding-right: 100px; color: rgb(255,255,255)">Dashboard</span>
      </el-menu-item>
        <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
          <template slot="title">
            <i class="el-icon-menu" style="padding-right: 20px; color: rgb(255,255,255)"></i>
            <span style="padding-right: 100px; color: rgb(255,255,255)">{{ item.name }}</span>
          </template>
          <el-menu-item :index="c.path" v-for="c in item.children" :key="c.id" style="padding-left: 30px; color: rgb(255,255,255)">{{ c.name }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-aside :width="isCollapsed ? '64px' : '0px'"></el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <el-footer>Footer</el-footer>
</el-container>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
export default {
  created () {
    this.getMenuList()
    this.getUserInfo()
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value !== this.chpwdForm.password) {
        callback(new Error('两次输入的密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      menulist: [],
      isCollapsed: false,
      user: {
        id: ''
      },
      chpwdDialogVisible: false,
      chpwdForm: {
        oldPassword: '',
        password: '',
        checkPass: ''
      },
      chpwdRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在8到16个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在8到16个字符之间', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    logout () {
      window.localStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: response } = await axios.get('users/menulist/')
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.menulist = response
    },
    handleCommand (command) {
      if (command === 'logout') {
        this.logout()
      } else if (command === 'chpwd') {
        this.chpwdDialogVisible = true
      }
    },
    async getUserInfo () {
      const { data: response } = await axios.get('users/whoami/')
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.user = response.user
    },
    async changePassword (name) {
      const { data: response } = await axios.post(`users/${this.user.id}/setpwd/`, this.chpwdForm)
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.chpwdDialogVisible = false
      this.$message({
        message: '密码修改成功！',
        type: 'success'
      })
    },
    resetForm (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-footer {
    background-color: #2936a2;
    color: rgb(255,255,255);
    text-align: center;
    line-height: 60px;
  }
  .el-header {
    background-color: #2936a2;
    color: rgb(255,255,255);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    .logo {
      display: flex;
      img {
        width: 30px;
      }
      .title {
        font-size: 25px;
        margin-left: 5px;
      }
    }
  }

  .el-aside {
    background-color: #216ec6;
    color: rgb(255,255,255);
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #f5f7f9;
    color: rgb(134, 132, 132);
    text-align: center;
    line-height: 160px;
  }

.el-container {
  height: 100%;
}

</style>
