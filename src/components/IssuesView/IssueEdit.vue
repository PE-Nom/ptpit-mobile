<template>
  <div class="issue-edit">
    <b-navbar v-if="showNavbar" type="dark" variant="success">
      <b-navbar-brand to="/issues">&lt;&lt; 指摘一覧</b-navbar-brand>
    </b-navbar>
    <b-navbar v-else type="dark" variant="success">
      <b-navbar-brand to="/pendingrequests">&lt;&lt; 未登録指摘一覧</b-navbar-brand>
    </b-navbar>
    <div class="username" style="font-size:'x-small;'">ログイン：{{userName}}</div>
    <div class="operation-field">
      <b-button v-if="(issue && issue.issue.id === -1)"
        class="control-button create"
        variant="success"
        v-bind:disabled="(!issueDuty)"
        @click='createInfo'>
        登録
      </b-button>
      <b-button v-else
        class="control-button update"
        variant="success"
        v-bind:disabled="!issue || !issueDuty"
        @click='updateInfo'>
        更新
      </b-button>
    </div>
    <div class="edit-field">
      <!-- ステータス表示 エリア -->
      <div class="status-display-field">
        <div v-if="issStatus==='登録'">
          <span style="color:red">登録</span><span style="color:gray"> > 原因分析 > 是正処置 > 効果確認 > 水平展開 > 完了</span>
        </div>
        <div v-else-if="issStatus==='原因分析'">
          <span style="color:blue">登録 > </span><span style="color:red">原因分析</span><span style="color:gray"> > 是正処置 > 効果確認 > 水平展開 > 完了</span>
        </div>
        <div v-else-if="issStatus==='是正処置'">
          <span style="color:blue">登録 > 原因分析 > </span><span style="color:red">是正処置</span><span style="color:gray"> > 効果確認 > 水平展開 > 完了</span>
        </div>
        <div v-else-if="issStatus==='効果確認'">
          <span style="color:blue">登録 > 原因分析 > 是正処置 > </span><span style="color:red">効果確認</span><span style="color:gray"> > 水平展開 > 完了</span>
        </div>
        <div v-else-if="issStatus==='水平展開'">
          <span style="color:blue">登録 > 原因分析 > 是正処置 > 効果確認 > </span><span style="color:red">水平展開</span><span style="color:gray"> > 完了</span>
        </div>
        <div v-else-if="issStatus==='完了'">
          <span style="color:blue">登録 > 原因分析 > 是正処置 > 効果確認 > 水平展開 > 完了</span>
        </div>
        <div v-else>
          登録 > 原因分析 > 是正処置 > 効果確認 > 水平展開 > 完了
        </div>
      </div>
      <!-- 基本情報 編集エリア -->
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion-issue variant="success">安全指摘 id:#{{issueId}}</b-btn>
        </b-card-header>
        <b-collapse id="accordion-issue" :visible="this.product===-1" accordion="issue-accordion" role="tabpanel">
          <b-card-body>
            <div class="basic-item-field">
              <!--
              <div class="items">
              </div>
              -->
                <!-- 指摘番号 -->
                <div class="form-group row-top">
                  <div class="col-md-10">
                    <label for="issue-id" class="control-label">指摘番号</label>
                    <input type="text"
                      class="form-control"
                      id="issue-id"
                      v-model="issueId"
                      disabled >
                  </div>
                </div>
                <!-- 製品名 -->
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="product-name" class="controle-label">製品名</label>
                    <b-form-select
                      id="product-name"
                      v-model="product"
                      :options="productOptions"
                      :disabled="issue && issue.issue.id !== -1"
                      @change="productChanged">
                    </b-form-select>
                  </div>
                </div>
                <!-- 指摘件名 -->
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="issue-subject" class="control-label">指摘件名</label>
                    <input type="text"
                      class="form-control"
                      id="issue-subject"
                      placeholder="指摘件名"
                      v-model="issueSubject"
                      @change="issueSubjectChanged">
                  </div>
                </div>
                <!-- 顧客情報 -->
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="customer-info" class="control-label">顧客情報</label>
                    <input type="text"
                      class="form-control"
                      id="customer-info"
                      v-model="customer"
                      disabled>
                  </div>
                </div>
                <!-- 起票日 -->
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="created-date" class="control-label">起票日</label>
                    <input type="text"
                      class="form-control"
                      id="created-date"
                      v-model="created_on"
                      disabled>
                  </div>
                </div>
                <!-- 処置期限 -->
                <div class="form-group">
                  <div class="col-md-10">
                    <b-row>
                      <div class="col-md-10">
                        <label for="due-date" class="control-label">期日</label>
                      </div>
                    </b-row>
                    <b-row>
                      <div class="col-md-10">
                        <date-selector
                          id="due-date"
                          :format="dateFormat"
                          :start="minDate"
                          :end="maxDate"
                          v-bind:default="due_date"
                          @date-change="dueDate">
                        </date-selector>
                      </div>
                    </b-row>
                  </div>
                </div>
                <!-- 処置責任者 -->
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="assigned" class="control-label">処置責任者</label>
                    <b-form-select
                      id="assigned"
                      v-model="assigned"
                      :disabled="this.product===-1"
                      :options="membershipOptions"
                      @change="memberChanged">
                    </b-form-select>
                  </div>
                </div>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- 詳細内容 編集エリア -->
      <div class="content-field">
        <!-- 不適合内容 -->
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block href="#" v-b-toggle.nonconformity v-bind:variant="nonConformityVariant">不適合内容</b-btn>
          </b-card-header>
          <b-collapse id="nonconformity" accordion="nonconformity-items" role="tabpanel">
            <b-card-body>
              <div class="nonconformity-item-field">
                <NonConformityItem
                  :itemdata="itemdata[0]"
                  :disabled="stateNonconformity"
                  @enter="enter"
                  @reject="reject"
                  @accept="accept"
                  @cancel="cancel"
                  @attach="attach"
                  @contentChanged="contentChanged">
                </NonConformityItem>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
        <!-- 修正処置 -->
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block href="#" v-b-toggle.correct v-bind:variant="correctVariant">修正処置</b-btn>
          </b-card-header>
          <b-collapse id="correct" accordion="nonconformity-items" role="tabpanel">
            <b-card-body>
              <div class="nonconformity-item-field">
                <NonConformityItem
                  :itemdata="itemdata[1]"
                  :disabled="stateCorrect"
                  @enter="enter"
                  @reject="reject"
                  @accept="accept"
                  @cancel="cancel"
                  @attach="attach"
                  @contentChanged="contentChanged">
                </NonConformityItem>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
        <!-- 不適合原因 -->
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block href="#" v-b-toggle.cause v-bind:variant="causeVariant">不適合原因</b-btn>
          </b-card-header>
          <b-collapse id="cause" accordion="nonconformity-items" role="tabpanel">
            <b-card-body>
              <div class="nonconformity-item-field">
                <NonConformityItem
                  :itemdata="itemdata[2]"
                  :disabled="stateCause"
                  @enter="enter"
                  @reject="reject"
                  @accept="accept"
                  @cancel="cancel"
                  @attach="attach"
                  @contentChanged="contentChanged">
                </NonConformityItem>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
        <!-- 是正処置 -->
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block href="#" v-b-toggle.countermeasure v-bind:variant="counterMeasureVariant">是正処置</b-btn>
          </b-card-header>
          <b-collapse id="countermeasure" accordion="nonconformity-items" role="tabpanel">
            <b-card-body>
              <div class="nonconformity-item-field">
                <NonConformityItem
                  :itemdata="itemdata[3]"
                  :disabled="stateCounterMeasure"
                  @enter="enter"
                  @reject="reject"
                  @accept="accept"
                  @cancel="cancel"
                  @attach="attach"
                  @contentChanged="contentChanged">
                </NonConformityItem>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
        <!-- 効果確認 -->
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block href="#" v-b-toggle.result v-bind:variant="resultVariant">効果確認</b-btn>
          </b-card-header>
          <b-collapse id="result" accordion="nonconformity-items" role="tabpanel">
            <b-card-body>
              <div class="nonconformity-item-field">
                <NonConformityItem
                  :itemdata="itemdata[4]"
                  :disabled="stateResult"
                  @enter="enter"
                  @reject="reject"
                  @accept="accept"
                  @cancel="cancel"
                  @attach="attach"
                  @contentChanged="contentChanged">
                </NonConformityItem>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
        <!-- 水平展開 -->
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block href="#" v-b-toggle.rollout v-bind:variant="rollOutVariant">水平展開</b-btn>
          </b-card-header>
          <b-collapse id="rollout" accordion="nonconformity-items" role="tabpanel">
            <b-card-body>
              <div class="nonconformity-item-field">
                <NonConformityItem
                  :itemdata="itemdata[5]"
                  :disabled="stateRollOut"
                  @enter="enter"
                  @reject="reject"
                  @accept="accept"
                  @cancel="cancel"
                  @attach="attach"
                  @contentChanged="contentChanged">
                </NonConformityItem>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <Indicator v-if="updating || creating" message="更新中です。少々お待ちください" color="#FFFFFF"></Indicator>
  </div>
</template>

<script>
import naim from '../../models/naim.js'
import util from '../../models/util.js'
import editstate from '../../models/editState.js'
import fileUploader from '../../models/fileUploader.js'
import Indicator from '../Indicator.vue'
import DateSelector from '../DateSelector.vue'
import NonConformityItem from './NonConformityItem'

export default {
  name: 'IssueEdit',
  components: {
    NonConformityItem,
    Indicator,
    DateSelector
  },
  computed: {
    connectStatus: function () {
      return this.$store.getters.connectStat ? 'on-line' : 'off-line'
    },
    nonConformityVariant () {
      let myStatusIdx = this.findStatusIndex(this.issDetailItems[0].conditions.currentState)
      let currentStatusIdx = this.findStatusIndex(this.issStatus)
      let colorVarinant = this.getColorVariant(myStatusIdx, currentStatusIdx)
      console.log('nonConformityVariant myStatusIdx : ' + myStatusIdx + ', currentStatusIdx : ' + currentStatusIdx + ', colorVariant : ' + colorVarinant)
      return colorVarinant
    },
    correctVariant () {
      let myStatusIdx = this.findStatusIndex(this.issDetailItems[0].conditions.currentState)
      let currentStatusIdx = this.findStatusIndex(this.issStatus)
      let colorVarinant = this.getColorVariant(myStatusIdx, currentStatusIdx)
      console.log('correctVariant myStatusIdx : ' + myStatusIdx + ', currentStatusIdx : ' + currentStatusIdx + ', colorVariant : ' + colorVarinant)
      return colorVarinant
    },
    causeVariant () {
      let myStatusIdx = this.findStatusIndex(this.issDetailItems[2].conditions.currentState)
      let currentStatusIdx = this.findStatusIndex(this.issStatus)
      let colorVarinant = this.getColorVariant(myStatusIdx, currentStatusIdx)
      console.log('causeVariant myStatusIdx : ' + myStatusIdx + ', currentStatusIdx : ' + currentStatusIdx + ', colorVariant : ' + colorVarinant)
      return colorVarinant
    },
    counterMeasureVariant () {
      let myStatusIdx = this.findStatusIndex(this.issDetailItems[3].conditions.currentState)
      let currentStatusIdx = this.findStatusIndex(this.issStatus)
      let colorVarinant = this.getColorVariant(myStatusIdx, currentStatusIdx)
      console.log('counterMeasureVariant myStatusIdx : ' + myStatusIdx + ', currentStatusIdx : ' + currentStatusIdx + ', colorVariant : ' + colorVarinant)
      return colorVarinant
    },
    resultVariant () {
      let myStatusIdx = this.findStatusIndex(this.issDetailItems[4].conditions.currentState)
      let currentStatusIdx = this.findStatusIndex(this.issStatus)
      let colorVarinant = this.getColorVariant(myStatusIdx, currentStatusIdx)
      console.log('resultVariant myStatusIdx : ' + myStatusIdx + ', currentStatusIdx : ' + currentStatusIdx + ', colorVariant : ' + colorVarinant)
      return colorVarinant
    },
    rollOutVariant () {
      let myStatusIdx = this.findStatusIndex(this.issDetailItems[5].conditions.currentState)
      let currentStatusIdx = this.findStatusIndex(this.issStatus)
      let colorVarinant = this.getColorVariant(myStatusIdx, currentStatusIdx)
      console.log('rollOutVariant myStatusIdx : ' + myStatusIdx + ', currentStatusIdx : ' + currentStatusIdx + ', colorVariant : ' + colorVarinant)
      return colorVarinant
    }
  },
  data () {
    let statusStrings = [
      '登録',
      '原因分析',
      '是正処置',
      '効果確認',
      '水平展開',
      '完了'
    ]
    let issDetailItems = [
      {name: '不適合内容', statusName: '不適合内容ステータス', conditions: {currentState: '登録', nextState: '原因分析'}},
      {name: '修正処置', statusName: '修正処置ステータス', conditions: {currentState: '登録', nextState: '原因分析'}},
      {name: '不適合原因', statusName: '不適合原因ステータス', conditions: {currentState: '原因分析', nextState: '是正処置'}},
      {name: '是正処置', statusName: '是正処置ステータス', conditions: {currentState: '是正処置', nextState: '効果確認'}},
      {name: '効果確認', statusName: '効果確認ステータス', conditions: {currentState: '効果確認', nextState: '水平展開'}},
      {name: '水平展開', statusName: '水平展開ステータス', conditions: {currentState: '水平展開', nextState: '完了'}}
    ]
    let issDetailInfoStatusValue = {
      '入力待ち': 0,
      '承認待ち': 1,
      '完了': 2
    }
    let issDetailInfoStatusName = ['入力待ち', '承認待ち', '完了']

    return {
      showNavbar: true,
      message: '「指摘編集」 工事中のテンポラリ表示',
      userName: '',

      dateFormat: 'YYYY-MM-DD',
      currentDate: '2018-07-25',
      minDate: '2018-01-01',
      maxDate: '2030-12-31',
      due_date: '2018-08-11',
      start_date: '',
      created_on: '',
      assigned: '',
      updating: false,
      creating: false,
      issStatus: '',
      issueDuty: false,
      issueId: '',
      issueSubject: '',
      product: '',
      productOptions: [{value: '', text: ''}],
      membershipOptions: [{value: '', text: ''}],
      customer: '',
      issDetailItems: issDetailItems,
      issDetailInfoStatusValue: issDetailInfoStatusValue,
      issDetailInfoStatusName: issDetailInfoStatusName,
      issDetail: null,
      itemdata: [],
      attachmentFiles: [],
      statusStrings: statusStrings
    }
  },
  methods: {
    getColorVariant (myidx, currentidx) {
      let colorVariant
      if (myidx === currentidx) {
        colorVariant = 'danger'
      } else if (myidx < currentidx) {
        colorVariant = 'info'
      } else if (currentidx === -1) {
        colorVariant = 'default'
      } else {
        colorVariant = 'warning'
      }
      return colorVariant
    },
    findStatusIndex (statusName) {
      let idx = this.statusStrings.indexOf(statusName)
      return idx
    },
    findItemIndex (name) {
      let idx = this.itemdata.findIndex(item => {
        return item.name === name
      })
      return idx
    },
    // 確定
    enter (itemdata) {
      console.log('IssuEdit.enter')
      console.log(itemdata)
      let idx = this.findItemIndex(itemdata.name)
      // 入力待ち -> 承認待ち に遷移させる
      this.itemdata[idx].state = this.issDetailInfoStatusValue['承認待ち']
      this.setIssueDuty()
    },
    // 差戻し
    reject (itemdata) {
      console.log('IssuEdit.reject')
      console.log(itemdata)
      let idx = this.findItemIndex(itemdata.name)
      // 承認待ち -> 入力待ち に遷移させる
      this.itemdata[idx].state = this.issDetailInfoStatusValue['入力待ち']
      this.setIssueDuty()
    },
    // 承認
    accept (itemdata) {
      console.log('IssuEdit.accept')
      console.log(itemdata)
      let idx = this.findItemIndex(itemdata.name)
      // 承認待ち -> 完了 に遷移させる
      this.itemdata[idx].state = this.issDetailInfoStatusValue['完了']
      // ステータスを進める
      this.issStatus = this.issDetailItems[idx].conditions.nextState
      this.itemdata.forEach(item => {
        item.currentState = this.issStatus
      })
      this.setIssueDuty()
    },
    // 取り消し
    cancel (itemdata) {
      console.log('IssuEdit.cancel')
      console.log(itemdata)
      let idx = this.findItemIndex(itemdata.name)
      // 完了 -> 入力待ち に遷移させる
      this.itemdata[idx].state = this.issDetailInfoStatusValue['入力待ち']
      // ステータスを戻す
      this.issStatus = this.issDetailItems[idx].conditions.currentState
      this.itemdata.forEach(item => {
        item.currentState = this.issStatus
      })
      this.setIssueDuty()
    },
    // 記述内容の編集
    contentChanged (itemdata) {
      console.log('IssuEdit.contentChanged')
      console.log(itemdata)
      let idx = this.findItemIndex(itemdata.name)
      // 編集内容を反映
      this.itemdata[idx].content = itemdata.content
      this.setIssueDuty()
    },
    // 添付ファイル追加
    attach (attachment) {
      console.log('IssuEdit.attach')
      console.log(attachment)
      let idx = this.findItemIndex(attachment.name)
      let item = {
        filename: attachment.file.name,
        filesize: parseInt(attachment.file.size / 1000) + 'kbyte',
        description: attachment.description,
        content_type: attachment.file.type,
        content_url: '',
        id: '***',
        attachment: attachment
      }
      this.attachmentFiles.push(item)
      this.itemdata[idx].attachments.push(item)
      this.setIssueDuty()
    },
    // ------------------
    // DataBase 更新
    async uploadFile () {
      for (let attachment of this.attachmentFiles) {
        try {
          console.log('IssueEdit.uploadFile')
          console.log(attachment)
          let res = await naim.uploadFile(
            attachment.attachment.file,
            attachment.attachment.mediaData,
            attachment.attachment.description)
          if (res) {
            let token = res.data.upload.token
            let attachId = res.data.upload.id
            let filename = attachment.attachment.name + '_' + attachment.attachment.file.name
            console.log('uploaded file')
            console.log('token : ' + token)
            console.log('id : ' + attachId)
            console.log('name : ' + filename)
            let qobj = {
              'issue': {
                'uploads': [{
                  'token': token,
                  'filename': filename,
                  'description': attachment.attachment.description,
                  'content_type': attachment.attachment.file.type
                }]
              }
            }
            await naim.updateIssue(this.issueId, qobj)
            await fileUploader.uploadFile(
              this.issueId,
              attachId + '_' + attachment.attachment.name,
              attachment.attachment.file)
          }
        } catch (err) {
          console.log('error has occured @ attachingFile')
          console.log(err)
        }
      }
    },
    createQueryString: function () {
      let qobj = {
        issue: {
          subject: this.issueSubject, // subject
          priority_id: naim.getIssuePriorityByName('通常'), // priority Object
          status_id: naim.getIssueStatusIdByName(this.issStatus), // status Object
          // ----------------------
          tracker_id: naim.getTrackerIdByName('不適合'), // tracker Object
          project_id: this.product, // project Object
          description: '', // description
          // ----------------------
          start_date: this.start_date, // start_date
          due_date: this.due_date, // due_date
          done_ratio: '', // done_ratio
          // ----------------------
          assigned_to_id: this.assigned !== -1 ? this.assigned : this.membershipOptions[1].value, // assigned_to Object
          // ----------------------
          // activity
          // workingTime
          // comment
          // 'notes': this.notation, // notation
          custom_fields: [
            { id: naim.getCustomFieldId('不適合内容'), value: this.itemdata[0].content },
            { id: naim.getCustomFieldId('修正処置'), value: this.itemdata[1].content },
            { id: naim.getCustomFieldId('不適合原因'), value: this.itemdata[2].content },
            { id: naim.getCustomFieldId('是正処置'), value: this.itemdata[3].content },
            { id: naim.getCustomFieldId('効果確認'), value: this.itemdata[4].content },
            { id: naim.getCustomFieldId('水平展開'), value: this.itemdata[5].content },
            { id: naim.getCustomFieldId('不適合内容ステータス'), value: this.issDetailInfoStatusName[this.itemdata[0].state] },
            { id: naim.getCustomFieldId('修正処置ステータス'), value: this.issDetailInfoStatusName[this.itemdata[1].state] },
            { id: naim.getCustomFieldId('不適合原因ステータス'), value: this.issDetailInfoStatusName[this.itemdata[2].state] },
            { id: naim.getCustomFieldId('是正処置ステータス'), value: this.issDetailInfoStatusName[this.itemdata[3].state] },
            { id: naim.getCustomFieldId('効果確認ステータス'), value: this.issDetailInfoStatusName[this.itemdata[4].state] },
            { id: naim.getCustomFieldId('水平展開ステータス'), value: this.issDetailInfoStatusName[this.itemdata[5].state] }
          ]
        }
      }
      return qobj
    },
    async updateInfo () {
      console.log('updateInfo')
      this.updating = true
      let qobj = this.createQueryString()
      await naim.updateIssue(this.issueId, qobj)
      await naim.retrieveIssues(naim.getTrackerIdByName('不適合'))
      await this.uploadFile()
      this.resetIssueDuty()
      this.updating = false
    },
    async createInfo () {
      console.log('createInfo')
      this.creating = true
      let qobj = this.createQueryString()
      let ret = await naim.createIssue(qobj)
      this.issueId = ret.data.issue.id
      // 登録時、ステータスは必ず初期値となるので、最新値に変更するため登録後、更新をかける
      await naim.updateIssue(this.issueId, qobj)
      await naim.retrieveIssues(naim.getTrackerIdByName('不適合'))
      await this.uploadFile()
      this.resetIssueDuty()
      this.creating = false
    },
    // ------------------
    issueSubjectChanged () {
      console.log('issueSubjectChanged')
      this.setIssueDuty()
    },
    dueDate: function (date) {
      console.log('dueDate')
      this.due_date = date.format(this.dateFormat)
      // console.log('期日' + this.due_date)
      this.setIssueDuty()
    },
    memberChanged () {
      console.log('memberChanged')
      this.$nextTick(function () {
        this.setIssueDuty()
      })
    },
    productChanged () {
      this.$nextTick(function () {
        this.productOptions.forEach(option => {
          if (option.value === this.product) {
            console.log('selected product is ' + option.value)
          }
        })
        if (this.product !== -1) {
          let prj = naim.getProject(this.product)
          let customer = util.getProjectCustomFieldValue(prj, '顧客情報')
          this.customer = customer
        } else {
          this.customer = '未定'
        }
        this.setMembershipOptions()
        this.setIssueDuty()
      })
    },
    setIssueDuty () {
      this.issueDuty = true
    },
    resetIssueDuty () {
      this.issueDuty = false
    },
    setProductOptions () {
      console.log('setProductOptions')
      let availableProjects = naim.getAvailableProjects()
      console.log(availableProjects)
      this.productOptions = []
      this.productOptions.push({value: -1, text: '製品番号'})
      for (let project of availableProjects) {
        let option = {
          value: project.id,
          text: project.name
        }
        this.productOptions.push(option)
      }
      if (this.issue && this.issue.issue.id !== -1) {
        this.product = this.issue.issue.project.id
      } else {
        this.product = this.productOptions[0].value
      }
      this.setMembershipOptions()
    },
    setMembershipOptions () {
      console.log('setMembershipOptions')
      this.membershipOptions = []
      this.membershipOptions.push({value: -1, text: '-'})
      if (this.product !== -1) {
        let membership = naim.getProjectMemberships(this.product)
        console.log(membership)
        for (let member of membership) {
          let option = {
            value: member.user.id,
            text: member.user.name
          }
          this.membershipOptions.push(option)
        }
      }
      if (this.issue.issue.assigned_to) {
        this.assigned = this.issue.issue.assigned_to.id
      } else {
        this.assigned = this.membershipOptions[0].value
      }
    },
    setIssDetail () {
      console.log('setIssDetail')
      console.log(this.issDetail)
      if (this.issDetail) {
        // 添付ファイルリスト
        let issueAttachments = []
        this.issDetail.attachments.forEach(el => {
          let item = {
            filename: el.filename,
            filesize: parseInt(el.filesize / 1000) + 'kbyte',
            description: el.description,
            content_type: el.content_type,
            content_url: el.content_url,
            id: el.id,
            attachment: null
          }
          issueAttachments.push(item)
        })
        // Detail オブジェクトの生成
        this.itemdata = []
        this.attachmentFiles = []
        this.issDetailItems.forEach(item => {
          let customFieldForName = util.getCustomFieldByName(this.issDetail.custom_fields, item.name)
          let customFieldForStatus = util.getCustomFieldByName(this.issDetail.custom_fields, item.statusName)
          // 添付ファイルを検索し、ファイル名に項目名を含む添付ファイルを抽出する。
          let itemAttachments = issueAttachments.filter(attachment => {
            return attachment.filename.indexOf(item.name) !== -1
          })
          let itemdata = {
            id: this.issDetail.id,
            name: customFieldForName.name,
            state: this.issDetailInfoStatusValue[customFieldForStatus.value],
            content: customFieldForName.value,
            attachments: itemAttachments,
            conditions: item.conditions,
            currentState: this.issStatus
          }
          console.log(itemdata)
          this.itemdata.push(itemdata)
        })
      }
    },
    async setData () {
      console.log('IssueEdit.setData')
      if (this.issue) {
        console.log(this.issue)
        let customer = ''
        if (this.issue.issue.id !== -1) {
          let prj = naim.getProject(this.issue.issue.project.id)
          // console.log(prj)
          customer = util.getProjectCustomFieldValue(prj, '顧客情報')
          this.issDetail = await naim.getIssueDetail(this.issue.issue.id)
          this.issStatus = this.issDetail.status.name
          this.setIssDetail()
          console.log(this.issDetail)
        } else {
          customer = '未定'
          this.issDetail = null
          this.issStatus = '登録'
          this.initializeProps()
        }
        this.issueId = this.issue.issue.id
        this.created_on = this.issue.issue.created_on
        this.due_date = this.issue.issue.due_date ? this.issue.issue.due_date : util.getNowYMD()
        this.start_date = this.issue.issue.start_date ? this.issue.issue.start_date : util.getNowYMD()
        this.issueSubject = this.issue.issue.subject
        this.customer = customer
        this.setProductOptions()
        this.resetIssueDuty()
      }
    },
    initializeProps () {
      this.itemdata = []
      for (let i = 0; i < this.issDetailItems.length; i++) {
        let itemdata = {
          id: '***',
          name: this.issDetailItems[i].name,
          state: 0,
          content: '詳細を記述する欄',
          attachments: [],
          conditions: this.issDetailItems[i].conditions,
          currentState: '登録'
        }
        this.itemdata.push(Object.assign({}, itemdata))
      }
    }
  },
  created () {
    console.log('IssueEdit created')
    this.userName = editstate.user.username
    this.issue = editstate.issue
    this.initializeProps()
    this.setData()
  },
  mounted () {
    console.log('IssueEdit mounted')
  }
}
</script>

<style scoped>
.issue-edit{
  margin-top: 6px;
  padding-left: 6px;
  padding-right: 6px;
  height: 100%;
  box-shadow: 2px 2px 10px rgba(63, 63, 63, 0.2);
}
/* ログイン情報表示エリア */
.username {
  line-height: 30px;
  padding-left: 4px;
  font-style: italic;
  font-weight: bold;
}
/* 操作ボタンエリア */
.operation-field {
  padding-top: 6px;
  height: 50px;
}
.control-label {
  margin-bottom: 0px;
  float: left;
}
.control-button {
  float: left;
  margin-left: 1em;
}
.form-group {
  margin-bottom: 0.5em;
}
.row-top {
  margin-top: 0em;
}
.col-md-10 {
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%;
}
/* 編集エリア */
.edit-field {
  padding-left: 6px;
  padding-right: 6px;
  height: 100%;
  box-shadow: 2px 2px 10px rgba(63, 63, 63, 0.2);
}
/* 基本情報 編集エリア */
.card-body {
  padding: 0.25rem 0.25rem;
}
.basic-item-field {
  height: 550px;
  overflow-y: auto;
}

/* 処置状況 表示エリア */
.status-display-field {
  line-height: 30px;
  padding-left: 4px;
  font-style: italic;
  font-weight: bold;
  font-size: small;
}

/* 詳細情報 編集エリア */
.content-field {
  text-align: left;
  padding-top: 6px;
  padding-left: 6px;
  padding-right: 6px;
  height: 100%;
  overflow: auto;
  box-shadow: 2px 2px 10px rgba(63, 63, 63, 0.2);
}
.nonconformity-item-field {
  padding-right: 6px;
  padding-left: 6px;
}
</style>
