<template>
  <div class="issues-view">
    <div class="username" style="font-size:'x-small;'">ログイン：{{userName}}({{connectStatus}})</div>
    <div class="header-field">
      <div class="table-row header">
        <div class="message-field">
          {{message}}
        </div>
        <div class="productfilter">
          <b-form-select
            class="flex-inner-item"
            v-model="product"
            :options="productOptions"
            @change="filterByProduct">
          </b-form-select>
        </div>
        <div class="operation">
          <div class="filter" >
            <input name="query" class="flex-inner-item" v-model="searchQuery" placeholder="フィルタ文字列">
          </div>
          <div class="sorter">
            <b-dropdown id="ddown-buttons" split right variant="success" size="sm" class="flex-inner-item">
              <template slot="button-content">
                {{sortKey}}
                <span class="arrow" :class="sortOrders[sortKey] > 0 ? 'asc' : 'dsc'"></span>
              </template>
              <b-dropdown-item v-for="(val, idx) in columns" v-bind:key=idx @click="sortBy(val)" :class="[{ active: sortKey == val }, { focus: sortKey == val }]">
                {{ val }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="new-issue">
            <img :src="icon_new_issue" class="flex-inner-item" width='30px' height='30px' @click="createIssue"/>
          </div>
          <div class="refresh-list">
            <img :src="icon_refresh_list" class="flex-inner-item" width='25px' height='25px' @click="refreshList"/>
          </div>
          <div class="spacer">
          </div>
        </div>
      </div>
    </div>

    <div class="data-field">
      <div v-for="(entry,idx) in issueslist" v-bind:key=idx @click="editIssue(entry)">
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
  </div>
</template>

<script>
import naim from '../../models/naim.js'
import editstate from '../../models/editState.js'
import iconNew from '../../assets/new.png'
import iconRefresh from '../../assets/refresh.png'

export default {
  name: 'IssuesView',
  data () {
    let sortOrders = {}
    let columns = [
      'id',
      '製品名',
      '件名',
      '登録日',
      '期日',
      'ステータス',
      '担当者'
    ]
    columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    let styleForSelectedRow = {
      'background-color': '#C0C0C0'
    }
    let styleForNonSelectedRow = {
      'background-color': '#FFFFFF'
    }
    return {
      icon_new_issue: iconNew,
      icon_refresh_list: iconRefresh,
      columns: columns,
      issues: [], // 不適合のトラッカーでフィルタ済み
      filteredIssues: [], // 製品番号でフィルタした指摘一覧
      searchQuery: '',
      sortKey: 'キー',
      sortOrders: sortOrders,
      message: '不適合管理　不適合一覧',
      product: '',
      productOptions: [{value: '', text: ''}],
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
    },
    issueslist () {
      console.log('### issues computed property in IssuestList.vue ####')
      let ret = []
      this.filteredIssues.forEach(issue => {
        let assignedName = issue.assigned_to ? issue.assigned_to.name : ''
        let dueDate = issue.due_date ? issue.due_date : '未定義'
        let rec = {
          'id': issue.id,
          '製品名': issue.project.name,
          '件名': issue.subject,
          '登録日': issue.created_on,
          '期日': dueDate,
          'ステータス': issue.status.name,
          '担当者': assignedName
        }
        // let obj = JSON.parse(rec)
        let obj = Object.assign(rec, { issue: issue })
        ret.push(obj)
      })
      let filterKey = this.searchQuery && this.searchQuery.toLowerCase()
      if (filterKey) {
        // console.log('filterData by filterKey changed');
        ret = ret.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return (
              String(row[key])
                .toLowerCase()
                .indexOf(filterKey) > -1
            )
          })
        })
      }
      let sortKey = this.sortKey
      let order = this.sortOrders[sortKey] || 1
      if (sortKey) {
        // console.log('filterData by sortKey changed');
        ret = ret.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return ret
    }
  },
  methods: {
    filterProduct () {
      let issues = []
      if (this.product === -1) {
        issues = this.issues.slice(0)
      } else {
        issues = this.issues.filter(issue => {
          return issue.project.id === this.product
        })
      }
      return issues
    },
    sortBy (key) {
      console.log('sortBy : key=' + key)
      console.log(this.sortOrders)
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    filterByProduct () {
      this.$nextTick(function () {
        this.filteredIssues = this.filterProduct()
      })
    },
    editIssue (entry) {
      console.log('editIssue')
      let storageKey = 'issue-' + entry.id
      if (!this.connected && !(storageKey in localStorage)) {
        alert('オフラインモード　詳細情報を取得できません')
      } else {
        this.selectedId = entry.id
        let issue = {
          issue: entry.issue,
          currentProduct: this.product
        }
        editstate.issue = issue
        editstate.previousPath = '/issues'
        this.$router.push('issueedit')
      }
    },
    createIssue () {
      console.log('createIssue')
      this.selectedId = -1
      let issue = {
        issue: {
          id: -1,
          subject: '新規登録の件名',
          project: {name: '新規登録時の製品名'},
          description: '新規登録の説明'
        },
        currentProduct: -1
      }
      editstate.issue = issue
      editstate.previousPath = '/issues'
      this.$router.push('issueedit')
    },
    async refreshList () {
      console.log('refreshList')
      if (!this.connected) {
        alert('オフラインモード　更新できません')
      } else {
        await naim.retrieveIssues(naim.getTrackerIdByName('不適合'))
        this.issues = naim.getIssues()
        this.filterByProduct()
      }
    },
    setProductOptions () {
      console.log('setProductOptions')
      let availableProjects = naim.getAvailableProjects()
      console.log(availableProjects)
      this.productOptions = []
      this.productOptions.push({value: -1, text: '製品フィルタ'})
      for (let project of availableProjects) {
        let option = {
          value: project.id,
          text: project.name
        }
        this.productOptions.push(option)
      }
      this.product = this.productOptions[0].value
    }
  },
  created () {
    console.log('IssuesView created')
    this.setProductOptions()
    this.product = editstate.productId
    this.issues = naim.getIssues()
    this.filteredIssues = this.filterProduct()
    this.userName = editstate.user.username
  },
  mounted () {
    console.log('IssuesView mounted')
  },
  destroy () {
    console.log('IssuesView destroy')
  }
}
</script>

<style scoped>
.issues-view {
  padding-left: 6px;
  padding-right: 6px;
  height: 100%;
  box-shadow: 2px 2px 10px rgba(63, 63, 63, 0.2);
}
.username {
  line-height: 30px;
  padding-left: 4px;
  font-style: italic;
  font-weight: bold;
}
/* list header */
.header-field {
  height: 120px;
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
  height: 20%;
  padding-top: 6px;
  text-align: left;
}
.productfilter {
  height: 40%;
  width:40%;
  margin-right: auto;
  padding-left: 6px;
  padding-top: 8px;
}
.operation {
  height: 40%;
  padding-top: 6px;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
}
.filter {
  margin: auto;
  padding-left: 6px;
  padding-right: 6px;
  flex-grow: 2;
}
.sorter {
  padding-top: 6px;
  padding-left: 6px;
  flex-grow: 2;
}
.new-issue {
  margin: auto;
  padding-left: 6px;
  flex-grow: 2;
}
.refresh-list {
  margin: auto;
  padding-left: 6px;
  flex-grow: 2;
}
.spacer {
  padding-top: 6px;
  padding-left: 6px;
  flex-grow: 2;
}
.flex-inner-item {
  float: left;
}
/* list data */
.wrapper {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
}
/* growable wrappers */
.attributes {
  flex-grow: 0;
  -webkit-flex-grow: 0;
}
.data-field {
  height: 600px;
  overflow-y: auto;
}
.table-row.data {
  height: auto;
  width: 100%;
  padding-left: 6px;
  padding-right: 6px;
}
.wrapper.attributes.data {
  height: auto;
  margin-left: 0px;
  margin-right: 0px;
  padding-top: 6px;
}

/* item in list */
.id {
  width: 5vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.製品名 {
  width: 10vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.件名 {
  width: 30vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.登録日 {
  width: 15vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.期日 {
  width: 15vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.ステータス {
  width: 10vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.担当者 {
  width: 15vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}

/*
 * Media queries: optimize for different screen widths.
 */
@media screen and (max-device-width: 768px),screen and (max-width: 768px)
{
  .attributes {
    flex-direction: column;
    -webkit-flex-direction: column;
  }
  .attributes div {
    flex-grow: 0;
    -webkit-flex-grow: 0;
  }
  .attributes > div {
    width: 100%;
  }
}

/*
 * General good-look styles
 */
div.active {
  color: rgb(55, 11, 177);
}
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.0;
}
.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #000;
}
.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #000;
}
.sorter .arrow {
  opacity: 1;
}
div.active .arrow {
  opacity: 1;
}
div.active .arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid rgb(55, 11, 177);
}
div.active .arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid rgb(55, 11, 177);
}
</style>
