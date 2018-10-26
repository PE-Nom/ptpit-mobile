<template>
  <div class="content-field">
    <div class="username" style="font-size:'x-small;'">ログイン：{{userName}}</div>
    <div class="banner-title">
      <div>
        <div>
        <img src="../assets/safetyfirst.png" alt="安全第一">
        </div>
        <br>
        <div>
          <h1>{{ msg }}</h1>
          <br>
          <p class="explanation">{{system}}</p>
          <p class="explanation">{{subname}}</p>
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
      msg: 'ピットさん',
      system: 'Safety And Nonconforming',
      subname: 'Management System',
      corporate: 'by Pitarpit Co.,Ltd.',
      userName: ''
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
  align-items: center;
  justify-content: center;
  text-align: center;
}
.explanation {
  font-weight: 100;
  font-size: 1rem;
}
</style>
