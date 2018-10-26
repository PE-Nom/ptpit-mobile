import store from '../store.js'
import redmine from './redmine.js'
import util from './util.js'
import fileUploader from './fileUploader.js'

export default {

  projects: [],
  memberships: [],
  availablePrjs: [],
  customFields: [],
  roles: [],
  issues: [],
  issueDetail: null,
  issueStatuses: null,
  issuePriorities: null,
  trackers: null,
  users: null,
  activities: null,
  documentCategories: null,
  online: true,
  userId: null,
  rootPrj: null,

  async initialize (user) {
    console.log('initialize @ naim')
    redmine.configure(user)
    let resp
    try {
      resp = await fileUploader.pingToServer()
      console.log('naim.initialize @ return from fileUploader.pingtoServer')
      console.log(resp)
      // alert(resp.data.dateandtime)
      //
      await this.retrieveUsers()
      this.getUserId(user.username)
      await this.retrieveTrackers()
      await this.retrieveCustomFields()
      await this.retrieveRoles()
      await this.retrieveIssueStatuses()
      await this.retrieveIssuePriorities()
      //
      await this.retrieveProjects()
      await this.retrieveMembershipOfProjects()
      await this.retrieveIssues(this.getTrackerIdByName('不適合'))
      //
      await this.retrieveTimeEntryActivities()
      await this.retrieveDocumentCategories()
    } catch (err) {
      alert(err)
      store.commit('setConnectStat', {connectStat: false})
      this.users = JSON.parse(localStorage.getItem('users'))
      this.trackers = JSON.parse(localStorage.getItem('trackers'))
      this.customFields = JSON.parse(localStorage.getItem('customFields'))
      this.roles = JSON.parse(localStorage.getItem('roles'))
      this.issueStatuses = JSON.parse(localStorage.getItem('issueStatuses'))
      this.issuePriorities = JSON.parse(localStorage.getItem('issuePriorities'))
      this.projects = JSON.parse(localStorage.getItem('projects'))
      this.issues = JSON.parse(localStorage.getItem('issues'))
      this.memberships = JSON.parse(localStorage.getItem('memberships'))
      this.availablePrjs = JSON.parse(localStorage.getItem('availablePrjs'))
      this.activities = JSON.parse(localStorage.getItem('activities'))
      this.documentCategories = JSON.parse(localStorage.getItem('documentCategories'))
    }
  },
  finalize () {
    this.clearProjects()
    this.clearIssues()
    this.clearCustomFileds()
    redmine.configure()
  },

  // ------------------
  // Users
  // ------------------
  async retrieveUsers () {
    try {
      await redmine.users(res => {
        console.log('==== Users @ naim ====')
        this.users = res.data.users
        console.log(this.users)
        localStorage.removeItem('users')
        localStorage.setItem('users', JSON.stringify(this.users))
      })
    } catch (err) {
      console.log('==== Users @ naim ====')
      console.log(err)
    }
  },
  getUsers () {
    return this.users
  },
  getUserId (userName) {
    let id = null
    this.users.forEach(user => {
      if (user.login === userName) {
        console.log(user)
        id = user.id
      }
    })
    this.userId = id
    console.log('getUserId : ' + userName + ' id : ' + this.userId)
    return this.userId
  },
  // ------------------
  // Trackers
  // ------------------
  async retrieveTrackers () {
    try {
      await redmine.getTrackers(res => {
        console.log('==== trackers @ naim ====')
        this.trackers = res.data.trackers
        localStorage.removeItem('trackers')
        localStorage.setItem('trackers', JSON.stringify(this.trackers))
        console.log(this.trackers)
      })
    } catch (err) {
      console.log('==== trackers @ naim ====')
      console.log(err)
    }
  },
  getTrackers () {
    return util.convertOptionObjs(this.trackers, 'name')
  },
  getTrackerIdByName (name) {
    let id = null
    this.trackers.forEach(tracker => {
      if (tracker.name === name) {
        id = tracker.id
      }
    })
    return id
  },
  // ------------------
  // CustomField data
  // ------------------
  async retrieveCustomFields () {
    try {
      const customfileds = []
      await redmine.customFields({}, res => {
        console.log('==== CustomFields @ naim ====')
        res.data.custom_fields.forEach(element => {
          customfileds.push(element)
          // console.log(element)
        })
      })
      // ここで customfields List を更新する。
      this.customFields = customfileds
      console.log(this.customFields)
      localStorage.removeItem('customFields')
      localStorage.setItem('customFields', JSON.stringify(this.customFields))
    } catch (err) {
      throw err
    }
  },
  getCustomFieldId (fieldName) {
    let fieldId
    this.customFields.forEach(element => {
      if (element.name === fieldName) {
        fieldId = element.id
      }
    })
    return fieldId
  },
  getCustomeFileds (fieldName) {
    let customField = null
    this.customFields.forEach(element => {
      if (element.name === fieldName) {
        // console.log('getCustomerFields')
        // console.log(element)
        customField = util.convertOptions(element.possible_values)
      }
    })
    return customField
  },
  clearCustomFileds () {
    this.cunstomFields = []
  },
  // ------------------
  // Roles
  // ------------------
  async retrieveRoles () {
    try {
      await redmine.roles({}, res => {
        console.log('==== retrieveRoles @ naim ====')
        console.log(res)
        this.roles = res.data.roles
      })
      // ここで customfields List を更新する。
      localStorage.removeItem('roles')
      localStorage.setItem('roles', JSON.stringify(this.roles))
      console.log(this.roles)
    } catch (err) {
      throw err
    }
  },
  getRoleId (rolename) {
    let id = null
    this.roles.forEach(role => {
      if (role.name === rolename) {
        id = role.id
      }
    })
    return id
  },
  getRoleName (roleId) {
    let name = null
    this.roles.forEach(role => {
      if (role.id === roleId) {
        name = role.name
      }
    })
    return name
  },
  // ------------------
  // Issue Status
  // ------------------
  async retrieveIssueStatuses () {
    try {
      await redmine.getIssueStatuses(res => {
        console.log('==== Issue Statuses @ naim ====')
        this.issueStatuses = res.data.issue_statuses
        localStorage.removeItem('issueStatuses')
        localStorage.setItem('issueStatuses', JSON.stringify(this.issueStatuses))
        console.log(this.issueStatuses)
      })
    } catch (err) {
      console.log('==== Issue Statuses @ naim ====')
      console.log(err)
    }
  },
  getIssueStatuses: function () {
    return util.convertOptionObjs(this.issueStatuses, 'name')
  },
  getIssueStatusIdByName (name) {
    let issueStatus = this.issueStatuses.filter(status => {
      return status.name === name
    })
    return issueStatus[0].id
  },

  // ------------------
  // Issue Priority
  // ------------------
  async retrieveIssuePriorities () {
    try {
      await redmine.getIssuePriorities(res => {
        console.log('==== Issue Priorities @ naim ====')
        this.issuePriorities = res.data.issue_priorities
        localStorage.removeItem('issuePriorities')
        localStorage.setItem('issuePriorities', JSON.stringify(this.issuePriorities))
        console.log(this.issuePriorities)
      })
    } catch (err) {
      console.log('==== IssuePriorities @ naim ====')
      console.log(err)
    }
  },
  getIssuePriorities: function () {
    return util.convertOptionObjs(this.issuePriorities, 'name')
  },
  getIssuePriorityByName (name) {
    let issuePriority = this.issuePriorities.filter(priority => {
      return priority.name === name
    })
    return issuePriority[0].id
  },

  // ------------------
  // Projects data
  // ------------------
  async retrieveProjects () {
    try {
      // Project List
      const prjs = []
      this.projects = []
      await redmine.projects({}, res => {
        console.log('==== Retrieve Projects @ naim ====')
        res.data.projects.forEach(element => {
          prjs.push(element)
          // console.log(element)
        })
      })
      // ここで Project List を更新する。
      this.projects = prjs
      localStorage.removeItem('projects')
      localStorage.setItem('projects', JSON.stringify(this.projects))
      console.log(this.projects)
    } catch (err) {
      alert(err)
      throw err
    }
  },
  getProjects () {
    console.log('getProjects')
    return this.projects
    // return util.convertOptionObjs(this.projects, 'name')
  },
  getProject (prjId) {
    let prj = null
    this.projects.forEach(project => {
      if (project.id === prjId) {
        prj = project
      }
    })
    return prj
  },
  async retrieveProject (prjId) {
    let ret = null
    try {
      ret = await redmine.project(prjId, {}, res => {
        // console.log('==== retrieve Project @ naim ====')
        // console.log(res)
      })
      return ret
    } catch (err) {
      throw err
    }
  },
  async retrieveMembershipOfProjects () {
    try {
      this.memberships = []
      let prjs = []
      for (let prj of this.projects) {
        await redmine.membershipOfProject(prj.id, res => {
          // console.log('==== Membership of project @ naim ====')
          // console.log(prj)
          for (let membership of res.data.memberships) {
            this.memberships.push(membership)
            if (membership.user.id === this.userId) {
              // console.log('find userId')
              if (prj.parent !== undefined) {
                this.rootPrj = prj.parent
                let availablePrj = Object.assign({}, prj)
                Object.assign(availablePrj, {roles: membership.roles})
                prjs.push(availablePrj)
              }
            }
          }
        })
      }
      localStorage.removeItem('memberships')
      localStorage.setItem('memberships', JSON.stringify(this.memberships))
      // console.log(this.memberships)
      this.availablePrjs = prjs
      localStorage.removeItem('availablePrjs')
      localStorage.setItem('availablePrjs', JSON.stringify(this.availablePrjs))
      // console.log(this.availablePrjs)
    } catch (err) {
      console.log('==== Membership of project @ naim ====')
      console.log(err)
    }
  },
  getParentProject () {
    return this.rootPrj
  },
  getAvailableProjects () {
    return this.availablePrjs
  },
  getProjectMemberships (id) {
    console.log('getProjectMemberships id : ' + id)
    let members = []
    this.memberships.forEach(membership => {
      // console.log(membership)
      if (membership.project.id === id) {
        members.push(membership)
      }
    })
    return members
  },
  async createProject (qstr) {
    let ret = null
    try {
      ret = await redmine.createProject(qstr, res => {
        console.log('==== Create Project @ naim ====')
        console.log(res)
      })
      return ret
    } catch (err) {
      throw err
    }
  },
  async createMembership (prjId, qstr) {
    try {
      await redmine.createMembership(prjId, qstr, res => {
        console.log('==== Create Membership @ naim ====')
        console.log(res)
      })
    } catch (err) {
      throw err
    }
  },
  async updateProject (prjId, qstr) {
    try {
      await redmine.updateProject(prjId, qstr, res => {
        // console.log('==== Update Project @ naim ====')
        // console.log(res)
      })
    } catch (err) {
      throw err
    }
  },
  async updateMembership (membershipId, query) {
    try {
      console.log(membershipId)
      await redmine.updateMembership(membershipId, query, res => {
        console.log('==== Update Membership @ naim ====')
        console.log(res)
      })
    } catch (err) {
      throw err
    }
  },
  async deleteProject (prjId) {
    try {
      await redmine.deleteProject(prjId, res => {
        // console.log('==== Delete Project @ naim ====')
        // console.log(res)
      })
    } catch (err) {
      throw err
    }
  },
  async deleteMembership (membershiId) {
    try {
      await redmine.deleteMembership(membershiId, res => {
        console.log('==== Delete Membership @ naim ====')
        console.log(res)
      })
    } catch (err) {
      throw err
    }
  },
  clearProjects () {
    this.projects = []
    this.availablePrjs = []
  },

  // ------------------
  // Ticket Custom Filed
  // ------------------

  // ------------------
  // Issue data
  // ------------------
  // columns: ['id', 'トラッカー', 'プロジェクト', '題名', '優先度', 'ステータス', '進捗率', '作成者', '担当者', '開始日', '期日', '更新日'],
  async retrieveIssues (trackerId) {
    try {
      console.log('### retrieveIssues ###')
      // Issues List
      this.issues = []
      console.log(' call redmine.issues')
      await redmine.issues(trackerId, res => {
        console.log('==== Issues @ naim ====')
        res.data.issues.forEach(el => {
          this.issues.push(el)
        })
      })
      localStorage.removeItem('issues')
      localStorage.setItem('issues', JSON.stringify(this.issues))
      console.log(this.issues)
    } catch (err) {
      console.log('err @ retrieveIssues')
      console.log(err)
      alert(err)
      throw err
    }
  },
  getIssues: function () {
    return this.issues
  },

  // redmineに問い合わせ
  async retrieveIssueDetail (issId) {
    try {
      await redmine.getIssue(issId, res => {
        // console.log('==== Issue Detail @ naim ====')
        // console.log(res)
        this.issueDetail = res.data.issue
        let storageKey = 'issue-' + issId
        console.log('storageKey = ' + storageKey)
        localStorage.removeItem(storageKey)
        localStorage.setItem(storageKey, JSON.stringify(this.issueDetail))
        console.log(this.issueDetail)
      })
    } catch (err) {
      console.log('==== Issue Detail @ naim ====')
      console.log(err)
    }
  },
  // localStorageを検索
  searchIssueDetail: function (issId) {
    let storageKey = 'issue-' + issId
    if (storageKey in localStorage) {
      this.issueDetail = JSON.parse(localStorage.getItem(storageKey))
    } else {
      this.issueDetail = null
    }
  },
  async getIssueDetail (issId) {
    if (store.getters.connectStat) {
      await this.retrieveIssueDetail(issId)
    } else {
      this.searchIssueDetail(issId)
    }
    return this.issueDetail
  },

  async createIssue (qobj) {
    try {
      let ret = await redmine.createIssue(qobj, res => {
        console.log('==== Create Issue @ naim ====')
        console.log(res)
      })
      return ret
    } catch (err) {
      throw err
    }
  },
  updateIssue: async function (issId, qobj) {
    try {
      // console.log('updateIssue @ naim : ' + issId)
      // console.log(qstr)
      await redmine.updateIssue(issId, qobj, res => {
        console.log('==== Update Issue @ naim ====')
        console.log(res)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  clearIssues: function () {
    this.issues = []
  },

  async uploadFile (file, mediaData, imageDescription) {
    console.log('uploadFile @ naim')
    let ret = null
    try {
      console.log(file)
      ret = await redmine.attachingFiles(file, res => {
        // console.log('==== uploadFiles @ naim ====')
        // console.log(res)
      })
      return ret
    } catch (err) {
      throw err
    }
  },

  // ------------------
  // Enumeration
  // ------------------
  retrieveTimeEntryActivities: async function () {
    try {
      await redmine.getTimeEntryActivities(res => {
        console.log('==== TimeEntryActivities @ naim ====')
        this.activities = util.convertOptionObjs(res.data.time_entry_activities, 'name')
        localStorage.removeItem('activities')
        localStorage.setItem('activities', JSON.stringify(this.activities))
        console.log(this.activities)
      })
    } catch (err) {
      console.log('==== TimeEntryActivities @ naim ====')
      console.log(err)
    }
  },
  getTimeEntryActivities: function () {
    return this.activities
  },
  retrieveDocumentCategories: async function () {
    try {
      await redmine.getDocumentCategories(res => {
        console.log('==== DocumentCategories @ naim ====')
        this.documentCategories = util.convertOptionObjs(res.data.document_categories, 'name')
        localStorage.removeItem('documentCategories')
        localStorage.setItem('documentCategories', JSON.stringify(this.documentCategories))
        console.log(this.documentCategories)
      })
    } catch (err) {
      console.log('==== DocumentCategories @ naim ====')
      console.log(err)
    }
  },
  getDocumentCategories: function () {
    return this.documentCategories
  }
}
