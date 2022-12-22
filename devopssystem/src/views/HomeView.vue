<template>
<el-container>
  <el-header>
    <div class="logo">
      <img src="../assets/logo-img.15f436d0.svg" alt="logo">
      <div class="title">OneManDevOps</div>
    </div>
    <div class="info">
      <el-button type="info" @click="logout">退出</el-button>
    </div>
  </el-header>
  <el-container>
    <el-aside width="210px">
      <el-menu  router :collapse="isCollapsed" background-color="#216ec6" text-color="#f5f7f9" active-text-color="#f5f7f9">
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
      <el-main>Main</el-main>
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
  },
  data () {
    return {
      menulist: [],
      isCollapsed: false
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
        width: 26px;
      }
      .title {
        font-size: 22px;
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
