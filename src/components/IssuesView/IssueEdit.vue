<template>
  <div class="issue-edit">
    <b-navbar v-if="showNavbar" type="dark" variant="success">
      <b-navbar-brand to="/issues">&lt;&lt; 指摘一覧</b-navbar-brand>
    </b-navbar>
    <b-navbar v-else type="dark" variant="success">
      <b-navbar-brand to="/pendingrequests">&lt;&lt; 未登録指摘一覧</b-navbar-brand>
    </b-navbar>
    <div class="username" style="font-size:'x-small;'">ログイン：{{userName}}</div>
    <div class="edit-field">
      <label>{{message}}</label>
      <div>コンテンツフィールド</div>
    </div>
  </div>
</template>

<script>
import editstate from '../../models/editState.js'

export default {
  name: 'IssueEdit',
  data () {
    return {
      showNavbar: true,
      message: '「指摘編集」 工事中のテンポラリ表示',
      userName: ''
    }
  },
  methods: {

  },
  created () {
    console.log('IssueEdit created')
    this.userName = editstate.user.username
  }
}
</script>

<style>
.username {
  line-height: 30px;
  padding-left: 4px;
  font-style: italic;
  font-weight: bold;
}
.edit-field {
  padding-left: 6px;
  padding-right: 6px;
  height: 100%;
  box-shadow: 2px 2px 10px rgba(63, 63, 63, 0.2);
}
</style>
