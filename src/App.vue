<template>
  <div id="app">

    <b-navbar v-if="showNavbar" toggleable="md" type="dark" variant="success">

      <b-navbar-brand to="/">ピットさん ({{version}})</b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/products">製品一覧</b-nav-item>
          <b-nav-item to="/issues">指摘一覧</b-nav-item>
          <b-nav-item to="/pendingrequests">未登録の指摘一覧</b-nav-item>
          <b-nav-item href="#" @click.prevent="showLoginDialog = !showLoginDialog" v-if="!activeUser">ログイン</b-nav-item>
          <b-nav-item href="#" @click.prevent="showLogoutDialog = !showLogoutDialog" v-else>ログアウト</b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>
    <div class="username" style="font-size:'x-small;'">ログイン：{{userName}}</div>

    <LoginDialog v-if="showLoginDialog" @cancelClose="cancelClose" @loginClose="loginClose">
      <h3 slot="header">ログイン</h3>
    </LoginDialog>
    <LogoutDialog v-if="showLogoutDialog" @cancelClose="cancelClose" @logoutClose="logoutClose">
      <h3 slot="header">ログアウト</h3>
    </LogoutDialog>
    <router-view />
  </div>
</template>

<script>
import _ from 'lodash'
import config from './config.js'
import naim from './models/naim.js'
import LoginDialog from '@/components/LoginDialog.vue'
import LogoutDialog from '@/components/LogoutDialog.vue'

export default {
  name: 'app',
  components: {
    LoginDialog,
    LogoutDialog
  },
  data () {
    return {
      activeUser: false,
      userName: '',
      version: config.Versions,
      showLoginDialog: false,
      showLogoutDialog: false,
      tablet: false
    }
  },
  computed: {
    showNavbar: function () {
      let show = true
      if (this.$route.path !== '/' &&
          this.$route.path !== '/products' &&
          this.$route.path !== '/issues' &&
          this.$route.path !== '/pendingrequests') {
        show = false
      }
      return show
    }
  },
  async beforeCreate () {
    console.log('beforeCreate @ App.vue')
    // 起動時にredmineのデータを取り込む取得
    /*
    try {
      await naim.initialize()
    } catch (err) {
      console.log('------- initialize 失敗 -------')
      alert(err)
    }
    */
  },
  async created () {
    console.log('created @ App.vue')
    this.tablet = window.innerWidth < 769
    // インスタンスを作成した後、イベントリスナに登録
    window.addEventListener('resize', this.setTabletMode, false)
    window.addEventListener('online', this.onlineEventHandler, false)
    window.addEventListener('offline', this.offlineEventHandler, false)

    // 開発時のログインバイパス
    let user = {
      username: 'nc-manager-001',
      password: 'nc-manager-001'
    }
    await naim.initialize(user)
    this.loginClose(user)
  },
  mounted () {
    this.$router.push('/')
  },
  beforeDestroy () {
    // インスタンスを破棄する前に、イベントリスナから削除
    window.removeEventListener('resize', this.setTabletMode, false)
  },
  methods: {
    // 無くても良いが lodash の debounce で発火頻度を調整してあげるとエコ
    setTabletMode: _.debounce(function () {
      // data にリサイズ後のウィンドウ幅を代入
      this.tablet = window.innerWidth < 769
      console.log('setTabletMode : ' + this.tablet)
    }, 300),
    onlineEventHandler (event) {
      this.$store.commit('setConnectStat', {connectStat: true})
    },
    offlineEventHandler (event) {
      this.$store.commit('setConnectStat', {connectStat: false})
    },
    loginClose: function (user) {
      console.log('## login@App.vue')
      console.log(user)
      this.userName = user.username
      this.activeUser = true
      this.showLoginDialog = false
      this.$router.push('/')
    },
    logoutClose: function () {
      console.log('## logout@App.vue')
      this.activeUser = false
      this.showLogoutDialog = false
      this.userName = ''
      this.$router.push('/')
    },
    cancelClose: function () {
      console.log('## cancelCloe@App.vue')
      this.showLoginDialog = false
      this.showLogoutDialog = false
    }
  }
}
</script>

<style>
body {
  overflow: hidden;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}

.username {
  line-height: 30px;
  padding-left: 4px;
  font-style: italic;
  font-weight: bold;
}
</style>
