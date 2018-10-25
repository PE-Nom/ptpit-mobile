<template>
  <div class='pendingrequests-view'>
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'PendingRequestsView',
  data () {
    return {
      message: '「未登録の更新要求」 工事中のテンポラリ表示'
    }
  },
  methods: {

  },
  created () {
    console.log('PendingRequestsView created')
  }
}
</script>

<style>

</style>
