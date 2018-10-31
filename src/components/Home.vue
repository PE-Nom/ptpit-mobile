<template>
  <div class="content-field">
    <div class="username" style="font-size:'x-small;'">ログイン：{{userName}}({{connectStatus}})</div>
    <div class="banner-title">
      <div>
        <div class="qaimage">
        <img src="../assets/QualityAssuarance.png" alt="品質保証">
        </div>
        <br>
        <div>
          <h1>{{ msg }}</h1>
          <br>
          <p class="explanation">{{system}}</p>
          <p class="explanation">{{corporate}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editstate from '../models/editState.js'

export default {
  // name: 'Home',
  data () {
    return {
      msg: 'ピットさん NM',
      system: 'Nonconforming Management System',
      corporate: 'by Pitarpit Co.,Ltd.',
      userName: ''
    }
  },
  computed: {
    connectStatus: function () {
      return this.$store.getters.connectStat ? 'on-line' : 'off-line'
    }
  },
  created () {
    console.log('home created')
    editstate.productId = -1
    this.userName = editstate.user.username
  },
  destroy () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-field {
  padding-left: 6px;
  padding-right: 6px;
  height: 100%;
  box-shadow: 2px 2px 10px rgba(63, 63, 63, 0.2);
}
.username {
  line-height: 30px;
  padding-left: 4px;
  font-style: italic;
  font-weight: bold;
}
.banner-title {
  height: 90vh;
  display: flex;
  justify-content: center;
  text-align: center;
}
.qaimage {
  margin-top: 50px;
}
.explanation {
  font-weight: 100;
  font-size: 1rem;
}
</style>
