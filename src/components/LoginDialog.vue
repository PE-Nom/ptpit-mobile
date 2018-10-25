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

            <div class="form-group">
            <input id="username" v-model="user.username" type="text" placeholder="Username">
            </div>

            <div class="form-group">
            <input id="password" v-model="user.password" type="password" placeholder="Password">
            </div>
            <p v-if=errorMessage class="message-field">{{errorMessage}}</p>
          </div>
          <div class="modal-footer">
            <button class="modal-default-button" @click='login'>ログイン</button>
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
  name: 'LoginDialog',
  data () {
    return {
      user: {
        username: null,
        password: null
      },
      errorMessage: ''
    }
  },
  methods: {
    async login () {
      console.log('close @ loginDialog')
      console.log(this.user)
      try {
        await naim.initialize(this.user)
        // login成功でmodalクローズ
        this.$emit('loginClose', this.user)
      } catch (err) {
        console.log('==== LoginDialog ====')
        console.log(err)
        alert(err)
        // this.errorMessage = err.toString()
        this.errorMessage = err
        // 失敗メッセージを modal に表示する
      }
    },
    cancel () {
      console.log('close @ loginDialog')
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
