export default {
  convertOptions: function (values) {
    let options = []
    values.forEach(el => {
      let option = {
        value: el.value,
        text: el.label
      }
      options.push(option)
    })
    return options
  },
  convertOptionObjs: function (values, key) {
    let options = []
    values.forEach(el => {
      let option = {
        value: el.id,
        text: el[key]
      }
      options.push(option)
    })
    return options
  },
  convertProjectObjs: function (values, key) {
    let options = []
    values.forEach(el => {
      let option = {
        id: el.id,
        name: el[key]
      }
      options.push(option)
    })
    return options
  },
  convertUsersObjs: function (values) {
    let options = []
    values.forEach(el => {
      let option = {
        value: el.id,
        text: el.firstname + ' ' + el.lastname
      }
      options.push(option)
    })
    return options
  },
  findValue: function (options, name) {
    let ret
    options.forEach(element => {
      if (element.text === name) {
        ret = element.value
      }
    })
    return ret
  },

  getNowYMD: function () {
    var dt = new Date()
    var y = dt.getFullYear()
    var m = ('00' + (dt.getMonth() + 1)).slice(-2)
    var d = ('00' + dt.getDate()).slice(-2)
    var result = y + '-' + m + '-' + d
    return result
  },

  // Project の操作
  getProjectCustomFieldValue (prj, fieldName) {
    let value
    prj.custom_fields.forEach(field => {
      if (field.name === fieldName) {
        value = field.value
      }
    })
    return value
  },

  // IssueDetail の customFiels検索
  getCustomFieldByName (customField, fieldName) {
    let ret = null
    customField.forEach(field => {
      if (field.name === fieldName) {
        ret = field
      }
    })
    return ret
  },

  // 引数はbase64形式の文字列と作成するファイルオブジェクトのファイル名
  createFile (name, type, mediaData) {
    let filePropertyBag = { type: type }
    // base64のデコード
    let bin = atob(mediaData.replace(/^.*,/, ''))
    // バイナリデータ化
    let buffer = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i)
    }
    // ファイルオブジェクト生成(この例ではjpegファイル)
    return new File([buffer.buffer], name, filePropertyBag)
  }

}
