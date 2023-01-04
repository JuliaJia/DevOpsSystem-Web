<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo-img.15f436d0.svg" alt="logo" />
      </div>
      <div style="margin: 20px"></div>
      <el-form
        ref="loginFormRef"
        :label-position="labelPosition"
        label-width="80px"
        :model="loginForm"
        class="login_form"
        :rules="loginRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" prefix-icon="el-icon-user-solid" @keyup.enter.native="jump"  v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input ref="inputPass" type="password" placeholder="请输入密码" @keyup.enter.native="login"  prefix-icon="el-icon-key" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 50px">
          <el-button type="primary" icon="el-icon-user" @click="login" >登录</el-button>
          <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      labelPosition: 'right',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 14, message: '长度在5到14个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 30, message: '长度在8到30个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
        //   console.log(this.loginForm)
          try {
            const { data: response } = await axios.post('login/', this.loginForm)
            if (!response.code) {
              this.$message({
                message: '登录成功！',
                type: 'success'
              })
              window.localStorage.setItem('token', response.access)
              this.$router.push('/home')
            } else {
              this.$message.error('登录失败！')
            }
          } catch (err) {
            this.$message.error('密码错误，登录失败！')
          }
        } else {
          // test
        }
      })
    },
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    jump () {
      this.$refs.inputPass.focus()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2936a2;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #e7ebf3;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
