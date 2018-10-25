<template>
    <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>
          <div class="modal-body">

            <div>
                <p class="explanation">ログアウトします。<br><br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;よろしいですか</p>
            </div>

          </div>
          <div class="modal-footer">
            <button class="modal-default-button" @click='logout'>ログアウト</button>
            <button class="modal-default-button" @click='cancel'>キャンセル</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import naim from '../models/naim.js'

export default {
  name: 'LogoutDialog',
  methods: {
    logout () {
      console.log('close @ logoutDialog')
      naim.finalize()
      this.$emit('logoutClose')
    },
    cancel () {
      console.log('close @ logoutDialog')
      this.$emit('cancelClose')
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>

<style>
@import '../style/modal.css'
</style>
