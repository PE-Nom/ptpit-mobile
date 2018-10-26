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
              <div class="col-md-10">
                <!--
                <label for="inputImageAndVideo" class="control-label">画像・動画</label>
                -->
                <input type="file" class="form-control" id="inputImageAndVideo" variant="success" accept="image/*,video/*" capture="camera" @change="onImageAndVideoChanged">
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-10">
                <b-row class='form-box'>
                  <b-col cols="10">
                    <label for="inputImageDescription" class="control-label">画像の説明</label>
                  </b-col>
                  <b-col cols="2">
                    <!--
                    <icon-base class="mic_enable" icon-color="#0000ff" width=30 height=30 icon-name="mic"><icon-mic @iconClick="recording('imageDescription')"/></icon-base>
                    -->
                  </b-col>
                </b-row>
                <textarea
                  class="form-control"
                  rows="3"
                  id="inputImageDescription"
                  placeholder="画像の説明記述"
                  v-model="description">
                </textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-default-button" @click='attachClose'>添付</button>
            <button class="modal-default-button" @click='cancelClose'>キャンセル</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AttachmentDialog',
  data () {
    return {
      description: '',
      attachment: '',
      file: null,
      mediaData: null
    }
  },
  methods: {
    onImageAndVideoChanged (event) {
      console.log('AttachmentDialog.onImageAndVideoChanged')
      if (event.target.files.length) {
        // 選択されたファイル情報を取得
        this.file = event.target.files[0]
        console.log(this.file)
        this.mediaData = new Image()
        let reader = new FileReader()
        reader.onload = (e) => {
          console.log('reader.onload')
          this.mediaData = e.target.result
          console.log(this.mediaData)
        }
        reader.readAsDataURL(this.file)
      } else {
        console.log('no file selected')
      }
    },
    attachClose () {
      console.log('AttachmentDialog.attachClose')
      let attachment = {
        file: this.file,
        mediaData: this.mediaData,
        description: this.description
      }
      this.$emit('attachClose', attachment)
    },
    cancelClose () {
      console.log('AttachmentDialog.attachClose')
      this.$emit('cancelClose')
    }
  }
}
</script>

<style scoped>

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}
.modal-footer {
  margin: 20px 0;
}
.modal-default-button {
  /* float: right; */
  width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  /* 文字サイズを1.4emに指定 */
  font-size: 1.0em;
  /* 文字の太さをboldに指定 */
  font-weight: bold;
  /* 背景色を濃い青色に指定 */
  background-color: rgb(19, 134, 241);
  /* 文字色を白色に指定 */
  color: #fff;
  /* ボーダーをなくす */
  border-style: none;
  border-radius: 3px;
  /* ボタンの影の指定
  * 影の横幅を2px
  * 縦長を2px
  * ぼかしを3px
  * 広がりを1px
  * 色を#666（グレー）に指定 */
  box-shadow: 2px 2px 3px 1px #248;
  -moz-box-shadow: 2px 2px 3px 1px #248;
  -webkit-box-shadow: 2px 2px 3px 1px #248;
}
.check-explain {
  /* 文字サイズを1.4emに指定 */
  font-size: 0.8em;
}

@media screen and (max-device-width: 768px),screen and (max-width: 768px)
{
  .modal-container  {
    width:70%;
  }
}
@media screen and (max-width: 468px)
{
  .modal-container  {
    width:90%;
  }
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
