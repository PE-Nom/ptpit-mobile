<template>
  <div class="content-fulied">
    <b-navbar v-if="showNavbar" type="dark" variant="success">
      <b-navbar-brand to="/issues">&lt;&lt; 指摘一覧</b-navbar-brand>
    </b-navbar>
    <b-navbar v-else type="dark" variant="success">
      <b-navbar-brand to="/pendingrequests">&lt;&lt; 未登録指摘一覧</b-navbar-brand>
    </b-navbar>
    <b-container class="table-row header">
      <!--
      <label class="currentpath-user" >{{currentPath}} ({{connectStatus}})</label>
      -->
      <label class='issueedit'>{{message}}</label>
    </b-container>
    <div>コンテンツフィールド</div>
  </div>
</template>

<script>
export default {
  name: 'IssueEdit',
  data () {
    return {
      showNavbar: true,
      message: '「指摘編集」 工事中のテンポラリ表示'
    }
  },
  methods: {

  },
  created () {
    console.log('IssueEdit created')
  }
}
</script>

<style>

</style>
