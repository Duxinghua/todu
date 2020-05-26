<template>
  <div :class="{'has-logo':false}">
    <logo v-if="false" :collapse="true" />
    <div class="logo-box">
      <div class="logo-img" />
      <div class="logo-text">铁四院线站处</div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" style="padding-right: 0">
      <el-menu
        :collapse="true"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in selfRoute" :key="route.id" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { authorityTree } from '@/api/authority'
export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      selfRoute: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },

  mounted() {
    authorityTree().then(res => {
      // 用户权限 默认有首页
      const userRoute = [{
        id: 1,
        name: '首页',
        icon: 'example',
        path: '/'
      }]
      const { status, data } = res
      if (status === 200) {
        data.forEach((item, index) => {
          if (item.id !== -1) {
            const row = {
              id: item.id,
              name: item.label,
              path: item.path,
              icon: 'example'
            }
            userRoute.push(row)
          }
        })
        this.selfRoute = userRoute
      }
    })
  }
}
</script>
<style scoped>
  .logo-box{
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 10px;
    /* margin:40px auto 10px auto; */
  }
  .logo-img{
    width: 60px;
    height: 60px;
    background: #20a0ff;
    /* margin-bottom: 20px; */
    margin:0 auto 20px auto;
    border-radius: 50px;
  }
  .logo-text{
    height: 20px;
    width: 100%;
    color: #000000;
    font-size: 14px;
    text-align: center;
    font-weight: bold;
  }
</style>
