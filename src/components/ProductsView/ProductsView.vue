<template>
  <div class='products-view'>
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'ProductsView',
  data () {
    return {
      message: '「製品一覧」 工事中のテンポラリ表示'
    }
  },
  methods: {

  },
  created () {
    console.log('ProductsView created')
  }
}
</script>

<style>

</style>
