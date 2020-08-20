<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="mbShow" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-if="sidemenuShow" class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      diyshow: false
    }
  },
  computed: {
    mbShow() {
      if (this.device === 'mobile') {
        if (this.$store.state.app.sidebar.opened) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    sidemenuShow() {
      if (this.device === 'mobile') {
        if (this.$store.state.app.sidebar.opened) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      if (this.$store.state.app.device == 'mobile') {

      }
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: false,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {

  },
  methods: {
    getClientInfo() {
      var userAgentInfo = navigator.userAgent
      var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod')
      var agentinfo = null
      for (var i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) > 0) { agentinfo = userAgentInfo; break }
      }
      if (agentinfo) {
        return false
      } else {
        return true
      }
    },
    handleClickOutside() {
      console.log(2, this.sidebar.opened, 'opened')

      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    background: aliceblue;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
   @media only screen and (max-width: 768px){
     .sidebar-container{width:200px!important;}
   }
</style>
