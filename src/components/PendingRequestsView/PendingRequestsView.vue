<template>
  <div class="pendingrequest-view">
    <div class="username" style="font-size:'x-small;'">ログイン：{{userName}}({{connectStatus}})</div>
    <div class="header-field">
      <b-container class="table-row header">
        <div class="message-field">
          {{message}}
        </div>
        <div class="operation">
          <div class="spacer">
          </div>
          <div class="trash">
            <img :src="icon_trash" class="icon-trash" width='30px' height='30px' @click="removeIssue"/>
          </div>
          <div class="connection">
            <img :src="icon_connection" class="icon-connection" width='25px' height='25px' @click="checkServerAccess"/>
          </div>
          <div class="up-load">
            <img :src="icon_upload" v-if="connected" class="icon-up-load" width='30px' height='30px' @click="upload"/>
          </div>
          <div class="new-issue">
            <img :src="icon_new_issue" class="icon-new_issue" width='30px' height='30px' @click="createIssue"/>
          </div>
        </div>
      </b-container>
    </div>

    <div class="data-field">
      <div v-for="(entry, idx) in requestStrs" v-bind:key=idx @click="select(idx, entry)">
        <div class="table-row data" v-bind:style="[selectedId===entry.id ? styleForSelectedRow : styleForNonSelectedRow]">
          <div class="wrapper attributes data">
            <div v-for="(val, idx) in columns" v-bind:key=idx :class="[val]">
              <span>
                {{entry[val]}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Indicator v-if="uploading" message="更新中です。少々お待ちください" color="#FFFFFF"></Indicator>

  </div>
</template>

<script>
import editstate from '../../models/editState.js'
import prm from '../../models/pendingRequestManager.js'
import naim from '../../models/naim.js'
import util from '../../models/util.js'
import fileUploader from '../../models/fileUploader.js'
import Indicator from '../Indicator.vue'
import iconUpload from '../../assets/upload.png'
import iconNew from '../../assets/new.png'
import iconTrash from '../../assets/trash.png'
import iconConnection from '../../assets/connection.png'

export default {
  components: {
    Indicator
  },
  data () {
    let styleForSelectedRow = {
      'background-color': '#C0C0C0'
    }
    let styleForNonSelectedRow = {
      'background-color': '#FFFFFF'
    }
    return {
      columns: ['key', 'request', 'id', 'name', 'subject', 'description'],
      pendingRequests: [],
      requestStrs: [],
      message: '不適合管理　未登録の不適合一覧',
      icon_trash: iconTrash,
      icon_new_issue: iconNew,
      icon_upload: iconUpload,
      icon_connection: iconConnection,
      selectRequestKey: '',
      uploading: false,
      selectedId: -1,
      styleForSelectedRow: styleForSelectedRow,
      styleForNonSelectedRow: styleForNonSelectedRow,
      userName: ''
    }
  },
  computed: {
    connectStatus: function () {
      return this.$store.getters.connectStat ? 'on-line' : 'off-line'
    },
    connected: function () {
      return this.$store.getters.connectStat
    }
  },
  methods: {
    createPendingRequestsList () {
      this.pendingRequests = naim.getPendingRequests()
      console.log('****** PendingRequestList.complete() ******')
      console.log(this.pendingRequests)
      let req = []
      this.pendingRequests.forEach(element => {
        let rec = null
        if (element.value.request === 'file attach') {
          rec = {
            key: element.key,
            id: element.value.id,
            name: element.value.custom_field_name,
            request: element.value.request,
            subject: element.value.name,
            description: element.value.description
          }
        } else {
          rec = {
            key: element.key,
            id: element.value.id,
            name: naim.getIssueStatusNameById(element.value.query.issue.status_id),
            request: element.value.request,
            subject: element.value.query.issue.subject,
            description: element.value.query.issue.description
          }
        }
        req.push(rec)
      })
      this.requestStrs = req
    },
    async checkServerAccess () {
      console.log('checkServerAccess')
      let resp
      try {
        resp = await fileUploader.pingToServer()
        alert(resp.data.dateandtime)
        this.$store.commit('setConnectStat', {connectStat: true})
      } catch (err) {
        alert(err)
        this.$store.commit('setConnectStat', {connectStat: false})
      }
    },
    removeIssue () {
      console.log('removeIssue')
      if (this.selectRequestKey !== '') {
        prm.deletePendingRequest(this.selectRequestKey, this.retrievePendingRequests)
      }
    },
    createIssue: function () {
      console.log('createIssue')
      let pendingIssueId = JSON.parse(localStorage.getItem('pendingIssueId'))
      this.selectedId = pendingIssueId - 10
      editstate.issueId = '***'
      editstate.previousPath = '/pendingrequests'
      this.$router.push('issueedit')
    },
    select (idx, entry) {
      console.log('selected request key is ' + entry.key)
      this.selectedId = entry.id
      console.log(this.pendingRequests[idx])
      if (this.pendingRequests[idx].value.request !== 'file attach') {
        console.log('selected requests : ' + this.pendingRequests[idx].value.request)
        console.log('               id : ' + this.pendingRequests[idx].value.id)
        editstate.issueId = this.pendingRequests[idx].value.id
        editstate.previousPath = '/pendingrequests'
        this.$router.push('issueedit')
      } else {
        alert('これはファイル添付のレコードです。\r "create"もしくは"update"のレコードを選択してください。')
      }
    },
    async uploadFile (id, request) {
      try {
        // ここでFileオブジェクトを再構築してproperties にセットする。
        let file = util.createFile(
          request.value.name,
          request.value.file_property_bag.type,
          request.value.mediaData)
        let res = await naim.uploadFile(
          id,
          request.value.custom_field_name,
          file,
          request.value.mediaData,
          request.value.description)
        if (res) {
          let token = res.data.upload.token
          let attachId = res.data.upload.id
          let filename = request.value.custom_field_name + '_' + request.value.name
          console.log('uploaded file')
          console.log('token : ' + token)
          console.log('id : ' + attachId)
          let qobj = {
            'issue': {
              'uploads': [{
                'token': token,
                'filename': filename,
                'description': request.value.description,
                'content_type': request.value.file_property_bag.type
              }]
            }
          }
          await naim.updateIssue(id, qobj)
          await fileUploader.uploadFile(
            id,
            attachId + '_' + request.value.custom_field_name,
            file)
        }
      } catch (err) {
        console.log('error has occured @ attachingFile')
        console.log(err)
        this.errorMessage = err.toString()
      }
    },
    async upload () {
      console.log('upload')
      // ここでrequestObjsを一件づつ登録していく
      // this.pendingRequests.forEach では
      // asyn/awaitのコンテキストが不整合になるため
      // ここではあえてfor ループで実装している
      if (!this.connected) {
        alert('オフラインモード　指摘情報をアップロードできません')
      } else if (this.uploading) {
        alert('アップロード中です。しばらくお待ちください')
      } else {
        let id = null
        this.uploading = true
        for (let i = 0; i < this.pendingRequests.length; i++) {
          let request = this.pendingRequests[i]
          console.log(request)
          if (request.value.request === 'create') {
            console.log('upload create request')
            let ret = null
            ret = await naim.createIssue(request.value.query)
            id = ret.data.issue.id
          } else if (request.value.request === 'update') {
            console.log('upload update request')
            id = request.value.id < 0 ? id : request.value.id
            await naim.updateIssue(id, request.value.query)
          } else if (request.value.request === 'file attach') {
            console.log('upload attachingFile request')
            await this.uploadFile(id, request)
          } else {
            console.log('unknown request')
          }
          prm.deletePendingRequest(request.key)
        }
        naim.retrievePendingRequests()
        setTimeout(() => {
          this.createPendingRequestsList()
          localStorage.removeItem('pendingIssueId')
          localStorage.setItem('pendingIssueId', 0)
          this.uploading = false
        }, 100)
      }
    }
  },
  created () {
    this.createPendingRequestsList()
    this.userName = editstate.user.username
  }
}
</script>

<style scoped>
.pendingrequest-view{
  padding: 5px;
  width: 100%;
}
.username {
  line-height: 30px;
  padding-left: 4px;
  font-style: italic;
  font-weight: bold;
}
/* list header */
.header-field {
  height: 80px;
}
.table-row {
  border-bottom: 1px solid #e0e0e0;
  border-collapse: collapse;
}
.table-row.header {
  height: 100%;
  width: 100%;
  padding-left: 6px;
  padding-right: 6px;
  background-color: rgb(229, 255, 219);
}
.message-field {
  height: 40%;
  padding-top: 6px;
  text-align: left;
}
.operation {
  height: 60%;
  padding-top: 6px;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
}
.spacer {
  flex-grow: 4;
}
.up-load {
  position: relative;
  margin: auto;
  padding-left: 6px;
  padding-right: 6px;
  flex-grow: 2;
}
.icon-up-load {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
  /* float: right; */
}
.new-issue {
  position: relative;
  margin: auto;
  padding-left: 6px;
  padding-right: 6px;
  flex-grow: 2;
}
.icon-new_issue {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
  /* float: right; */
}
.trash {
  position: relative;
  margin: auto;
  padding-left: 6px;
  padding-right: 6px;
  flex-grow: 2;
}
.icon-trash {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
  /* float: right; */
}
.connection {
  position: relative;
  margin: auto;
  padding-left: 6px;
  padding-right: 6px;
  flex-grow: 2;
}
.icon-connection {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
  /* float: right; */
}
.data-field {
  height: 600px;
  overflow-y: auto;
}
/*
 * Media queries: optimize for different screen widths.
 */
@media screen and (max-device-width: 768px),screen and (max-width: 768px)
{
}

</style>
