<template>
  <div class='products-view'>
    <div class="username" style="font-size:'x-small;'">ログイン：{{userName}}({{connectStatus}})</div>
    <div class="header-field">
      <div class="table-row header">
        <div class="message-field">
          {{message}}
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
          <div class="refresh-list">
              <img :src="icon_refresh_list" class="flex-inner-item" width='25px' height='25px' @click="refreshList"/>
          </div>
          <div class="spacer">
          </div>
        </div>
      </div>
    </div>

    <div class="data-field">
      <div v-for="(entry,idx) in productslist" v-bind:key=idx @click="editProduct(entry)">
        <div class="table-row data" v-bind:style="[selectedId===entry.product.id ? styleForSelectedRow : styleForNonSelectedRow]">
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
  name: 'ProductsView',
  data () {
    let sortOrders = {}
    let columns = [
      '品番',
      '製品名称',
      '客先',
      '登録日時',
      '説明'
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
      icon_new_product: iconNew,
      icon_refresh_list: iconRefresh,
      columns: columns,
      products: [],
      searchQuery: '',
      sortKey: 'キー',
      sortOrders: sortOrders,
      message: '不適合管理対象　製品情報',
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
    productslist: function () {
      console.log('### project computed property in ProjectList.vue ####')
      let ret = []
      // let prjs = naim.getAvailableProjects()
      this.products.forEach(element => {
        // 顧客の文字列生成
        let customer = ''
        element.custom_fields.forEach(field => {
          if (field.name === '顧客情報') {
            customer = field.value
          }
        })
        // 説明欄の改行コードエスケープ
        let desc = String(element.description)
        desc = desc.replace(/(\r\n)/g, '\\\\n')
        // Project List の表示オブジェクト生成
        let rec = '{' +
          ' "品番" : "' + element.identifier + '"' +
          ',"製品名称" : "' + element.name + '"' +
          ',"客先" : "' + customer + '"' +
          ',"登録日時" : "' + element.created_on + '"' +
          ',"説明" : "' + desc + '"' +
          ' }'
        let obj = JSON.parse(rec)
        obj = Object.assign(obj, {product: element})
        ret.push(obj)
      })
      let filterKey = this.searchQuery && this.searchQuery.toLowerCase()
      if (filterKey) {
        // console.log('filterData by filterKey changed');
        ret = ret.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
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
    sortBy (key) {
      console.log('sortBy : key=' + key)
      console.log(this.sortOrders)
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    editProduct (entry) {
      console.log('edit products')
      console.log(entry)
      this.selectedId = entry.product.id
      // 指摘一覧に遷移させる。
      editstate.productId = entry.product.id
      this.$router.push('/issues')
    },
    async refreshList () {
      console.log('refreshList')
      try {
        await naim.retrieveProjects()
        await naim.retrieveMembershipOfProjects()
        this.products = await naim.getAvailableProjects()
        console.log(this.products)
      } catch (err) {
        alert(err)
      }
    }
  },
  async created () {
    console.log('ProductsView created')
    this.products = await naim.getAvailableProjects()
    editstate.productId = -1
    this.userName = editstate.user.username
  },
  mounted () {
    console.log('ProjectsView mounted')
  },
  destroy () {
    console.log('ProductsView destroy')
  }
}
</script>

<style scoped>
.products-view{
  padding-left: 6px;
  padding-right: 6px;
  height: 100%;
  box-shadow: 2px 2px 10px rgba(63, 63, 63, 0.2);
  /*
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  border:rgba(63, 63, 63, 0.1) solid 1px;
  */
}
.username {
  line-height: 30px;
  padding-left: 4px;
  font-style: italic;
  font-weight: bold;
}
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
.table-row {
  border-bottom: 1px solid #e0e0e0;
  border-collapse: collapse;
}
/* list header */
.header-field {
  height: 80px;
  /*
  display: block;
  font-size: 80%;
  font-weight: bold;
  */
}
.table-row.header {
  height: 100%;
  width: 100%;
  padding-left: 6px;
  padding-right: 6px;
  background-color: rgb(229, 255, 219);
  /*
  font-weight: bold;
  */
}
.message-field {
  height: 30%;
  padding-top: 6px;
  text-align: left;
}
.operation {
  height: 70%;
  padding-top: 6px;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
}
.filter {
  padding-top: 6px;
  padding-left: 6px;
  flex-grow: 2;
}
.sorter {
  padding-top: 6px;
  padding-left: 6px;
  flex-grow: 2;
}
.refresh-list {
  padding-top: 6px;
  padding-left: 6px;
  flex-grow: 2;
}
.spacer {
  padding-top: 6px;
  padding-left: 6px;
  flex-grow: 6;
}
.flex-inner-item {
  float: left;
}
/* list data */
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
.品番 {
  width: 15vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.製品名称 {
  width: 15vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.客先 {
  width: 10vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.登録日時 {
  width: 20vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.説明 {
  width: 35vw;
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
