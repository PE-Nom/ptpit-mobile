<template>
  <div class='issues-view'>
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'IssuesView',
  data () {
    return {
      message: '「指摘一覧」　工事中のテンポラリ表示'
    }
  },
  methods: {

  },
  created () {
    console.log('IssuesView created')
  }
}
</script>

<style>

</style>
