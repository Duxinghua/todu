<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left" style="display: flex;flex: 1;align-items: center;justify-content: center;">
      <div class="loginfix">
        <div class="login-fix-1">
          <div class="login-fix-1-img" />
        </div>
        <div class="login-fix-2">
          <div class="login-fix-2-title">你好，请登录</div>
          <div class="login-fix-2-des">工作计划管理平台</div>
          <div class="login-fix2-content">
            <div class="inputwrap">
              <div class="inputico1" />
              <div class="inputico2 clearfix">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  style="color: black"
                  placeholder="请输入用户名"
                  name="username"
                  type="text"
                  tabindex="1"
                  trigger-on-focus="false"
                  autofocus
                />

              </div>
            </div>
            <div class="inputwrap inputwrapfix">
              <div class="inputico1 inputico1-fix" />
              <div class="inputico2 inputico2-fix clearfix">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="请输入密码"
                  name="password"
                  tabindex="2"
                  autofocus
                  trigger-on-focus="false"
                  @keyup.enter.native="handleLogin"
                />

              </div>
            </div>
            <div class="btnwrap">
              <el-button :loading="loading" size="normal" type="primary" round style="width: 300px" @click.native.prevent="handleLogin">登录</el-button>
            </div>
          </div>
        </div>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.$refs.input.$el.querySelector('input').focus()
      console.log(this.$refs.loginForm.$el)
    })
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style>

</style>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {

  }
}
.loginfix{
  position: absolute;
  left:50%;
  top:50%;
  margin-left:-450px;
  margin-top:-250px;
  display: flex;
  height: 500px;
  width: 900px;
  background: white;
  border-radius: 8px;
  flex-direction: row
}
.login-fix-1{
  float:left;
  width:50%;
  justify-content: center;
  align-items: center;
  padding:65px 50px 0 50px;
  display: flex;
  flex: 1
}
.login-fix-1-img{
background-image: url(/loginLeft.png);
background-size: 424px 325px;
height: 325px;
width: 424px;
}
.login-fix-2{
  float:left;
  width:50%;
  display:flex;
  padding: 60px 80px 60px 20px;
  flex-direction: column;
  flex: 1;
  .login-fix-2-title{
    font-size: 32px;
  }
  .login-fix-2-des{
    font-size: 12px;
    color: #999;
    padding-top: 10px;
  }
  .login-fix2-content{
    padding-top: 60px;
    flex:1;
  }
}
.inputico1{
  width:15%;
  float:left;
  margin-top:16px;
  background-image: url('../../assets/loginUser.png');
  width: 20px;
  height: 20px;
  background-size: 20px 20px

}
.inputico1-fix{
  background-image: url('../../assets/loginPwd.png');
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
}
.inputico2{
  width: 85%;
  float: right;
  flex: 1
}
.inputico2-fix{
flex: 1
}
.inputwrap{
  border-bottom: 1px solid #333;
  display: inline-block;
  width: 100%;
  align-items: CENTER;
}

.inputwrapfix{
display: inline-block;
width: 100%;
align-items: CENTER;
border-bottom: 1px solid #333;
padding-top: 30px
}
/* reset element-ui css */
.login-container {
  background-image: url("/loginBg.png");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.login-container .el-input input:-webkit-autofill{
  -webkit-box-shadow: 0 0 0 1000px white inset!important;
  box-shadow: inset 0 0 0 1000px white!important;
  // -webkit-text-fill-color: white!important;
}
.btnwrap{
  padding-top:50px;
}
@media only screen and (max-width: 768px) {
#app{
  overflow: hidden;
}
.loginfix{
  width:90%!important;
  display: flex;
  flex-direction: column!important;
  position: absolute;
  margin-top:0!important;
  margin-left:0!important;
  left:5%!important;
  top:50%!important;
  transform: translateY(-50%)!important;
  height: auto!important;
}
.login-fix-1{
 width:100% !important;
 padding:0.35rem;
}
.login-fix-2{
width:100%!important;
display: flex;
flex-direction: column;
align-items: center;
padding:0.25rem;
}
.login-fix-1-img{
background-size: 4.24rem 3.25rem;
width: 4.24rem;
height:3.25rem;
}
.login-fix-2 .login-fix-2-title{
  font-size: 0.32rem;
}
.login-fix-2 .login-fix2-content{
padding:0.6rem 1.2rem;
box-sizing: border-box;
}
.inputwrap{
  border-bottom: 1px solid #999;
  width:100%;
  display: flex;
  margin:0 auto;
}
.inputwrapfix{
border-bottom: 1px solid #999;
padding-top:0.3rem
}
.btnwrap{
  padding-top:0.5rem;
  .el-button{
    width:4rem!important;
    margin:0 auto;
  }
}
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

